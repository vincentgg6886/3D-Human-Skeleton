/*
 * SkeletonScene.tsx - Main 3D scene with real anatomical skeleton
 * V1.5: Joint view highlighting, bone label annotations, X-ray mode
 * Model: AnatomyTOOL medical-grade skeleton (147 bones, mirrored for left side)
 *        + upper-limb muscles (44) + lower-limb muscles (53)
 */

import { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLB_NODE_TO_BONE, APP_BONE_LOOKUP } from '@/lib/boneMapping';
import { useAppStore } from '@/lib/store';
import { BONE_PATHOLOGIES } from '@/lib/pathologyData';
import { getPathologyEffect } from '@/lib/pathologyEffects';
import { isMuscleNode, getMuscleGroup, MUSCLE_GROUP_COLORS } from '@/lib/muscleFilter';
import { JOINT_PRESET_MAP } from '@/lib/jointPresets';
import { JOINT_MOTION_MAP } from '@/lib/jointMotionData';

const SKELETON_URL = '/manus-storage/overview-skeleton_8b0752cc.glb';
const UPPER_LIMB_URL = '/manus-storage/upper-limb_1ff7cbc0.glb';
const LOWER_LIMB_URL = '/manus-storage/lower-limb_931f932f.glb';

const MODEL_SCALE = 4.7;
const MODEL_OFFSET_X = 0.13 * MODEL_SCALE;
const MODEL_OFFSET_Y = -0.009 * MODEL_SCALE;
const MODEL_OFFSET_Z = -0.01 * MODEL_SCALE;

// ============================================================
// Region color palette - warm bone tones
// ============================================================
const REGION_COLORS: Record<string, THREE.Color> = {
  'skull': new THREE.Color('#E8DCC8'),
  'spine': new THREE.Color('#D4C4A8'),
  'thorax': new THREE.Color('#DED0B8'),
  'upper-limb-left': new THREE.Color('#E0D2BC'),
  'upper-limb-right': new THREE.Color('#E0D2BC'),
  'pelvis': new THREE.Color('#D8CAB0'),
  'lower-limb-left': new THREE.Color('#E2D6C0'),
  'lower-limb-right': new THREE.Color('#E2D6C0'),
};

const SELECTED_EMISSIVE = new THREE.Color('#00D4FF');
const HOVER_EMISSIVE = new THREE.Color('#00A8CC');
const DEFAULT_EMISSIVE = new THREE.Color('#000000');
const DIMMED_COLOR = new THREE.Color('#3A3A4A');
const JOINT_HIGHLIGHT_EMISSIVE = new THREE.Color('#FFB020');

// ============================================================
// Interactive Bone Mesh - V1.5: joint highlighting + xray mode
// ============================================================
interface InteractiveBoneProps {
  geometry: THREE.BufferGeometry;
  appBoneId: string;
  region: string;
  position: THREE.Vector3;
  isMirror: boolean;
}

function InteractiveBone({ geometry, appBoneId, region, isMirror }: InteractiveBoneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowTime = useRef(0);

  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const hoveredBoneId = useAppStore((s) => s.hoveredBoneId);
  const visibleRegions = useAppStore((s) => s.visibleRegions);
  const hiddenBones = useAppStore((s) => s.hiddenBones);
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);
  const muscleMode = useAppStore((s) => s.muscleMode);
  const xrayMode = useAppStore((s) => s.xrayMode);
  const activePathologyIndex = useAppStore((s) => s.activePathologyIndex);
  const activeJointPreset = useAppStore((s) => s.activeJointPreset);
  const selectBone = useAppStore((s) => s.selectBone);
  const hoverBone = useAppStore((s) => s.hoverBone);

  const isSelected = selectedBoneId === appBoneId;
  const isHovered = hoveredBoneId === appBoneId;
  const isVisible = visibleRegions.has(region) && !hiddenBones.has(appBoneId);
  const isDimmed = lockedRegionId !== null && lockedRegionId !== region;

  // V1.5: Check if this bone is part of the active joint preset
  const isJointBone = useMemo(() => {
    if (!activeJointPreset) return false;
    const preset = JOINT_PRESET_MAP[activeJointPreset];
    return preset ? preset.bones.includes(appBoneId) : false;
  }, [activeJointPreset, appBoneId]);

  const isJointDimmed = activeJointPreset !== null && !isJointBone;

  // Pathology effect
  const pathologyEffect = useMemo(() => {
    if (activePathologyIndex === null || selectedBoneId !== appBoneId) return null;
    const pathologies = BONE_PATHOLOGIES[appBoneId];
    if (!pathologies || !pathologies[activePathologyIndex]) return null;
    return getPathologyEffect(pathologies[activePathologyIndex].name);
  }, [activePathologyIndex, selectedBoneId, appBoneId]);

  const baseColor = useMemo(() => REGION_COLORS[region]?.clone() || new THREE.Color('#E8DCC8'), [region]);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: baseColor.clone(),
      roughness: 0.55,
      metalness: 0.08,
      emissive: DEFAULT_EMISSIVE.clone(),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    });
  }, []);

  // V2.2: Pivot group ref for anatomically correct rotation
  const pivotGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;

    // V2.2: Anatomically correct pivot-based rotation via parent group
    const motionData = (window as any).__jointMotionData as {
      angleRad: number;
      axis: 'x' | 'y' | 'z';
      pivotPoint: [number, number, number];
      movingBones: Set<string>;
    } | null;

    if (pivotGroupRef.current) {
      if (motionData && motionData.movingBones.has(appBoneId)) {
        const [px, py, pz] = motionData.pivotPoint;
        const angle = motionData.angleRad;

        // Move group origin to pivot point
        pivotGroupRef.current.position.x = THREE.MathUtils.lerp(pivotGroupRef.current.position.x, px, 0.15);
        pivotGroupRef.current.position.y = THREE.MathUtils.lerp(pivotGroupRef.current.position.y, py, 0.15);
        pivotGroupRef.current.position.z = THREE.MathUtils.lerp(pivotGroupRef.current.position.z, pz, 0.15);

        // Apply rotation on the correct axis
        const targetRotX = motionData.axis === 'x' ? angle : 0;
        const targetRotY = motionData.axis === 'y' ? angle : 0;
        const targetRotZ = motionData.axis === 'z' ? angle : 0;
        pivotGroupRef.current.rotation.x = THREE.MathUtils.lerp(pivotGroupRef.current.rotation.x, targetRotX, 0.15);
        pivotGroupRef.current.rotation.y = THREE.MathUtils.lerp(pivotGroupRef.current.rotation.y, targetRotY, 0.15);
        pivotGroupRef.current.rotation.z = THREE.MathUtils.lerp(pivotGroupRef.current.rotation.z, targetRotZ, 0.15);

        // Offset the mesh inside the group so it rotates around the pivot
        // mesh world pos should be: meshPosition (the shared offset)
        // mesh local pos inside group = meshPosition - pivotPoint
        const mp = isMirror
          ? [2 * MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z]
          : [MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z];
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mp[0] - px, 0.15);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mp[1] - py, 0.15);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, mp[2] - pz, 0.15);
      } else {
        // Smoothly return group to identity (no transform)
        pivotGroupRef.current.position.x = THREE.MathUtils.lerp(pivotGroupRef.current.position.x, 0, 0.1);
        pivotGroupRef.current.position.y = THREE.MathUtils.lerp(pivotGroupRef.current.position.y, 0, 0.1);
        pivotGroupRef.current.position.z = THREE.MathUtils.lerp(pivotGroupRef.current.position.z, 0, 0.1);
        pivotGroupRef.current.rotation.x = THREE.MathUtils.lerp(pivotGroupRef.current.rotation.x, 0, 0.1);
        pivotGroupRef.current.rotation.y = THREE.MathUtils.lerp(pivotGroupRef.current.rotation.y, 0, 0.1);
        pivotGroupRef.current.rotation.z = THREE.MathUtils.lerp(pivotGroupRef.current.rotation.z, 0, 0.1);

        // Return mesh to its original local position (0,0,0 inside group at identity)
        const mp = isMirror
          ? [2 * MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z]
          : [MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z];
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mp[0], 0.1);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mp[1], 0.1);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, mp[2], 0.1);
      }
    }

    // Pathology effect takes highest priority
    if (pathologyEffect) {
      glowTime.current += delta;
      const pathColor = new THREE.Color(pathologyEffect.color);
      const pathEmissive = new THREE.Color(pathologyEffect.emissiveColor);
      const pulse = pathologyEffect.pulseSpeed > 0
        ? 0.5 + 0.5 * Math.sin(glowTime.current * pathologyEffect.pulseSpeed)
        : 1;
      mat.color.lerp(pathColor, 0.12);
      mat.emissive.lerp(pathEmissive, 0.12);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, pathologyEffect.emissiveIntensity * (0.6 + 0.4 * pulse), 0.1);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, pathologyEffect.opacity, 0.1);
      mat.roughness = THREE.MathUtils.lerp(mat.roughness, pathologyEffect.roughness, 0.05);
      return;
    }

    // X-ray mode
    if (xrayMode) {
      mat.color.lerp(new THREE.Color('#88AACC'), 0.08);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, isSelected ? 0.7 : isHovered ? 0.5 : 0.25, 0.08);
      mat.emissive.lerp(isSelected ? SELECTED_EMISSIVE : isHovered ? HOVER_EMISSIVE : new THREE.Color('#2244AA'), 0.1);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, isSelected ? 0.5 : isHovered ? 0.3 : 0.1, 0.1);
      mat.roughness = THREE.MathUtils.lerp(mat.roughness, 0.2, 0.05);
      return;
    }

    // Joint view mode - highlight joint bones, dim others
    if (isJointBone) {
      glowTime.current += delta;
      const pulse = 0.5 + 0.5 * Math.sin(glowTime.current * 2);
      mat.color.lerp(baseColor, 0.1);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 1, 0.1);
      mat.emissive.lerp(isSelected ? SELECTED_EMISSIVE : JOINT_HIGHLIGHT_EMISSIVE, 0.1);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, isSelected ? 0.5 : 0.15 + pulse * 0.1, 0.1);
      mat.roughness = THREE.MathUtils.lerp(mat.roughness, 0.4, 0.05);
      return;
    }

    if (isJointDimmed) {
      mat.color.lerp(DIMMED_COLOR, 0.08);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.12, 0.08);
      mat.emissive.lerp(DEFAULT_EMISSIVE, 0.1);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0, 0.1);
      return;
    }

    // Muscle mode: make bones slightly transparent
    if (muscleMode && !isSelected) {
      mat.color.lerp(baseColor, 0.08);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.4, 0.06);
      mat.emissive.lerp(DEFAULT_EMISSIVE, 0.1);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0, 0.1);
      return;
    }

    if (isDimmed) {
      mat.color.lerp(DIMMED_COLOR, 0.1);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.2, 0.1);
    } else {
      mat.color.lerp(baseColor, 0.1);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 1, 0.1);
    }

    if (isSelected) {
      glowTime.current += delta;
      const pulse = 0.5 + 0.5 * Math.sin(glowTime.current * 3);
      mat.emissive.lerp(SELECTED_EMISSIVE, 0.15);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.3 + pulse * 0.35, 0.1);
      mat.roughness = THREE.MathUtils.lerp(mat.roughness, 0.35, 0.05);
    } else if (isHovered) {
      glowTime.current = 0;
      mat.emissive.lerp(HOVER_EMISSIVE, 0.15);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.2, 0.1);
      mat.roughness = THREE.MathUtils.lerp(mat.roughness, 0.45, 0.05);
    } else {
      glowTime.current = 0;
      mat.emissive.lerp(DEFAULT_EMISSIVE, 0.1);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0, 0.1);
      mat.roughness = THREE.MathUtils.lerp(mat.roughness, 0.55, 0.05);
    }
  });

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    selectBone(isSelected ? null : appBoneId);
  }, [isSelected, appBoneId, selectBone]);

  const handlePointerOver = useCallback((e: any) => {
    e.stopPropagation();
    hoverBone(appBoneId);
    document.body.style.cursor = 'pointer';
  }, [appBoneId, hoverBone]);

  const handlePointerOut = useCallback(() => {
    hoverBone(null);
    document.body.style.cursor = 'default';
  }, [hoverBone]);

  if (!isVisible) return null;

  const meshPosition: [number, number, number] = isMirror
    ? [2 * MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z]
    : [MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z];
  
  const meshScale: [number, number, number] = isMirror
    ? [-MODEL_SCALE, MODEL_SCALE, MODEL_SCALE]
    : [MODEL_SCALE, MODEL_SCALE, MODEL_SCALE];

  return (
    <group ref={pivotGroupRef}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        position={meshPosition}
        scale={meshScale}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      />
    </group>
  );
}

// ============================================================
// Muscle Mesh - Semi-transparent muscle overlay with joint motion following
// V2.4: Muscles follow skeletal joint motion via muscle group -> bone mapping
// ============================================================

// Map muscle groups to which joint motions they should follow
// This determines which muscles move when a joint animates
const MUSCLE_GROUP_MOTION_BONES: Record<string, string[]> = {
  // Upper limb muscles follow arm bones
  'shoulder': ['humerus-right', 'humerus-left'],
  'arm': ['humerus-right', 'humerus-left', 'radius-right', 'radius-left', 'ulna-right', 'ulna-left'],
  'forearm': ['radius-right', 'radius-left', 'ulna-right', 'ulna-left'],
  'hand': ['scaphoid-right', 'scaphoid-left', 'metacarpal-1-right', 'metacarpal-1-left'],
  // Lower limb muscles follow leg bones
  'hip': ['femur-right', 'femur-left'],
  'thigh': ['femur-right', 'femur-left', 'tibia-right', 'tibia-left'],
  'leg': ['tibia-right', 'tibia-left', 'fibula-right', 'fibula-left'],
  'foot': ['talus-right', 'talus-left', 'calcaneus-right', 'calcaneus-left'],
};

interface MuscleMeshProps {
  geometry: THREE.BufferGeometry;
  groupColor: string;
  isMirror: boolean;
  muscleGroup: string;
}

function MuscleMesh({ geometry, groupColor, isMirror, muscleGroup }: MuscleMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pivotGroupRef = useRef<THREE.Group>(null);
  const muscleMode = useAppStore((s) => s.muscleMode);
  const muscleOpacity = useAppStore((s) => s.muscleOpacity);
  const fadeRef = useRef(0);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(groupColor),
      roughness: 0.35,
      metalness: 0.05,
      emissive: new THREE.Color(groupColor),
      emissiveIntensity: 0.08,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [groupColor]);

  const meshPosition: [number, number, number] = isMirror
    ? [2 * MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z]
    : [MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z];
  
  const meshScale: [number, number, number] = isMirror
    ? [-MODEL_SCALE, MODEL_SCALE, MODEL_SCALE]
    : [MODEL_SCALE, MODEL_SCALE, MODEL_SCALE];

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const targetOpacity = muscleMode ? muscleOpacity : 0;
    fadeRef.current = THREE.MathUtils.lerp(fadeRef.current, targetOpacity, 0.06);
    mat.opacity = fadeRef.current;
    meshRef.current.visible = fadeRef.current > 0.01;

    // V2.4: Follow joint motion if this muscle group is associated with moving bones
    if (pivotGroupRef.current) {
      const motionData = (window as any).__jointMotionData as {
        angleRad: number;
        axis: 'x' | 'y' | 'z';
        pivotPoint: [number, number, number];
        movingBones: Set<string>;
      } | null;

      // Check if any of this muscle group's associated bones are in the motion set
      const associatedBones = MUSCLE_GROUP_MOTION_BONES[muscleGroup] || [];
      const shouldFollow = motionData && associatedBones.some(b => motionData.movingBones.has(b));

      if (shouldFollow && motionData) {
        const [px, py, pz] = motionData.pivotPoint;
        const angle = motionData.angleRad;

        pivotGroupRef.current.position.x = THREE.MathUtils.lerp(pivotGroupRef.current.position.x, px, 0.15);
        pivotGroupRef.current.position.y = THREE.MathUtils.lerp(pivotGroupRef.current.position.y, py, 0.15);
        pivotGroupRef.current.position.z = THREE.MathUtils.lerp(pivotGroupRef.current.position.z, pz, 0.15);

        const targetRotX = motionData.axis === 'x' ? angle : 0;
        const targetRotY = motionData.axis === 'y' ? angle : 0;
        const targetRotZ = motionData.axis === 'z' ? angle : 0;
        pivotGroupRef.current.rotation.x = THREE.MathUtils.lerp(pivotGroupRef.current.rotation.x, targetRotX, 0.15);
        pivotGroupRef.current.rotation.y = THREE.MathUtils.lerp(pivotGroupRef.current.rotation.y, targetRotY, 0.15);
        pivotGroupRef.current.rotation.z = THREE.MathUtils.lerp(pivotGroupRef.current.rotation.z, targetRotZ, 0.15);

        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, meshPosition[0] - px, 0.15);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, meshPosition[1] - py, 0.15);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, meshPosition[2] - pz, 0.15);
      } else {
        // Return to rest
        pivotGroupRef.current.position.x = THREE.MathUtils.lerp(pivotGroupRef.current.position.x, 0, 0.1);
        pivotGroupRef.current.position.y = THREE.MathUtils.lerp(pivotGroupRef.current.position.y, 0, 0.1);
        pivotGroupRef.current.position.z = THREE.MathUtils.lerp(pivotGroupRef.current.position.z, 0, 0.1);
        pivotGroupRef.current.rotation.x = THREE.MathUtils.lerp(pivotGroupRef.current.rotation.x, 0, 0.1);
        pivotGroupRef.current.rotation.y = THREE.MathUtils.lerp(pivotGroupRef.current.rotation.y, 0, 0.1);
        pivotGroupRef.current.rotation.z = THREE.MathUtils.lerp(pivotGroupRef.current.rotation.z, 0, 0.1);

        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, meshPosition[0], 0.1);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, meshPosition[1], 0.1);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, meshPosition[2], 0.1);
      }
    }
  });

  return (
    <group ref={pivotGroupRef}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        position={meshPosition}
        scale={meshScale}
        visible={false}
        renderOrder={1}
      />
    </group>
  );
}

// ============================================================
// Floating label for selected bone
// ============================================================
function BoneLabel() {
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const activePathologyIndex = useAppStore((s) => s.activePathologyIndex);
  const boneEntry = selectedBoneId ? APP_BONE_LOOKUP[selectedBoneId] : null;

  if (!boneEntry || !selectedBoneId) return null;

  const pos = (window as any).__bonePositions?.[selectedBoneId];
  if (!pos) return null;

  const pathologies = BONE_PATHOLOGIES[selectedBoneId];
  const activePathology = activePathologyIndex !== null && pathologies
    ? pathologies[activePathologyIndex]
    : null;

  return (
    <Html
      position={[pos[0], pos[1] + 0.3, pos[2]]}
      center
      distanceFactor={5}
      style={{ pointerEvents: 'none' }}
    >
      <div className="px-2.5 py-1.5 rounded-lg bg-[#0D1220]/90 backdrop-blur-md border border-cyan-400/30 whitespace-nowrap shadow-lg shadow-cyan-500/10">
        <div className="text-[11px] font-semibold text-cyan-300">{boneEntry.nameCn}</div>
        <div className="text-[9px] font-mono text-cyan-400/50">{boneEntry.nameEn}</div>
        {activePathology && (
          <div className="text-[10px] font-medium text-red-400 mt-0.5 border-t border-red-400/20 pt-0.5">
            {activePathology.nameCn}
          </div>
        )}
      </div>
    </Html>
  );
}

// ============================================================
// V1.5: All Bone Labels - annotation mode
// ============================================================
function AllBoneLabels() {
  const labelMode = useAppStore((s) => s.labelMode);
  const visibleRegions = useAppStore((s) => s.visibleRegions);
  const hiddenBones = useAppStore((s) => s.hiddenBones);
  const activeJointPreset = useAppStore((s) => s.activeJointPreset);
  const [positions, setPositions] = useState<Record<string, [number, number, number]>>({});

  useEffect(() => {
    const check = () => {
      const bp = (window as any).__bonePositions;
      if (bp && Object.keys(bp).length > 0) {
        setPositions({ ...bp });
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  }, []);

  if (!labelMode || Object.keys(positions).length === 0) return null;

  // In joint mode, only show labels for joint bones
  const jointPreset = activeJointPreset ? JOINT_PRESET_MAP[activeJointPreset] : null;

  // Show a subset of important bones to avoid clutter
  const importantBones = new Set([
    'cranium', 'mandible', 'cervical-vertebrae', 'thoracic-vertebrae', 'lumbar-vertebrae',
    'sacrum', 'coccyx', 'sternum', 'clavicle-right', 'clavicle-left',
    'scapula-right', 'scapula-left', 'humerus-right', 'humerus-left',
    'radius-right', 'radius-left', 'ulna-right', 'ulna-left',
    'ilium-right', 'ilium-left', 'femur-right', 'femur-left',
    'patella-right', 'patella-left', 'tibia-right', 'tibia-left',
    'fibula-right', 'fibula-left', 'calcaneus-right', 'calcaneus-left',
    'rib-1-right', 'rib-5-right', 'rib-10-right',
  ]);

  return (
    <>
      {Object.entries(positions).map(([boneId, pos]) => {
        const entry = APP_BONE_LOOKUP[boneId];
        if (!entry) return null;

        // Filter by visibility
        if (!visibleRegions.has(entry.region)) return null;
        if (hiddenBones.has(boneId)) return null;

        // In joint mode, only show joint bone labels
        if (jointPreset && !jointPreset.bones.includes(boneId)) return null;

        // In full mode, only show important bones
        if (!jointPreset && !importantBones.has(boneId)) return null;

        return (
          <Html
            key={boneId}
            position={[pos[0], pos[1] + 0.15, pos[2]]}
            center
            distanceFactor={8}
            style={{ pointerEvents: 'none' }}
          >
            <div className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 whitespace-nowrap">
              <div className="text-[8px] font-medium text-slate-300 leading-tight">{entry.nameCn}</div>
              <div className="text-[6px] font-mono text-slate-500 leading-tight">{entry.nameEn}</div>
            </div>
          </Html>
        );
      })}
    </>
  );
}

// ============================================================
// GLB Skeleton Loader
// ============================================================
const SANITIZED_LOOKUP: Record<string, string> = {};
for (const originalName of Object.keys(GLB_NODE_TO_BONE)) {
  const sanitized = originalName.replace(/\s/g, '_').replace(/\./g, '');
  SANITIZED_LOOKUP[sanitized] = originalName;
}

function SkeletonModel() {
  const { scene } = useGLTF(SKELETON_URL);
  const setModelLoaded = useAppStore((s) => s.setModelLoaded);

  const bones = useMemo(() => {
    const result: { geometry: THREE.BufferGeometry; appBoneId: string; region: string; isMirror: boolean; center: [number, number, number] }[] = [];
    const bonePositions: Record<string, [number, number, number]> = {};
    // V2.3: Store full bounding box data for accurate joint pivot calculation
    const boneBounds: Record<string, { min: [number, number, number]; max: [number, number, number]; center: [number, number, number] }> = {};

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const nodeName = child.name;
      const originalName = SANITIZED_LOOKUP[nodeName] || nodeName;
      const mapping = GLB_NODE_TO_BONE[originalName];
      if (!mapping) return;

      const geo = child.geometry;
      if (!geo.boundingBox) geo.computeBoundingBox();
      const center = new THREE.Vector3();
      geo.boundingBox!.getCenter(center);

      const scaledCenter: [number, number, number] = [
        center.x * MODEL_SCALE + MODEL_OFFSET_X,
        center.y * MODEL_SCALE + MODEL_OFFSET_Y,
        center.z * MODEL_SCALE + MODEL_OFFSET_Z,
      ];

      // V2.3: Compute scaled bounding box min/max for joint pivot calculation
      const bbMin = geo.boundingBox!.min;
      const bbMax = geo.boundingBox!.max;
      const scaledMin: [number, number, number] = [
        bbMin.x * MODEL_SCALE + MODEL_OFFSET_X,
        bbMin.y * MODEL_SCALE + MODEL_OFFSET_Y,
        bbMin.z * MODEL_SCALE + MODEL_OFFSET_Z,
      ];
      const scaledMax: [number, number, number] = [
        bbMax.x * MODEL_SCALE + MODEL_OFFSET_X,
        bbMax.y * MODEL_SCALE + MODEL_OFFSET_Y,
        bbMax.z * MODEL_SCALE + MODEL_OFFSET_Z,
      ];

      result.push({ geometry: geo, appBoneId: mapping.appBoneId, region: mapping.region, isMirror: false, center: scaledCenter });
      bonePositions[mapping.appBoneId] = scaledCenter;
      boneBounds[mapping.appBoneId] = { min: scaledMin, max: scaledMax, center: scaledCenter };

      if (mapping.mirror && mapping.mirrorAppBoneId) {
        const leftRegion = mapping.region.replace('-right', '-left');
        const mirroredCenter: [number, number, number] = [2 * MODEL_OFFSET_X - scaledCenter[0], scaledCenter[1], scaledCenter[2]];
        // Mirror the bounding box: flip X around MODEL_OFFSET_X
        const mirroredMin: [number, number, number] = [2 * MODEL_OFFSET_X - scaledMax[0], scaledMin[1], scaledMin[2]];
        const mirroredMax: [number, number, number] = [2 * MODEL_OFFSET_X - scaledMin[0], scaledMax[1], scaledMax[2]];
        result.push({
          geometry: geo,
          appBoneId: mapping.mirrorAppBoneId,
          region: leftRegion === mapping.region ? mapping.region : leftRegion,
          isMirror: true,
          center: mirroredCenter,
        });
        bonePositions[mapping.mirrorAppBoneId] = mirroredCenter;
        boneBounds[mapping.mirrorAppBoneId] = { min: mirroredMin, max: mirroredMax, center: mirroredCenter };
      }
    });

    (window as any).__bonePositions = bonePositions;
    (window as any).__boneBounds = boneBounds;
    return result;
  }, [scene]);

  // Signal model loaded
  useEffect(() => {
    if (bones.length > 0) setModelLoaded(true);
  }, [bones.length, setModelLoaded]);

  return (
    <group>
      {bones.map(({ geometry, appBoneId, region, isMirror }) => (
        <InteractiveBone
          key={appBoneId}
          geometry={geometry}
          appBoneId={appBoneId}
          region={region}
          position={new THREE.Vector3()}
          isMirror={isMirror}
        />
      ))}
      <BoneLabel />
      <AllBoneLabels />
    </group>
  );
}

// ============================================================
// Muscle Overlay Loader
// ============================================================
function MuscleOverlay() {
  const { scene: upperScene } = useGLTF(UPPER_LIMB_URL);
  const { scene: lowerScene } = useGLTF(LOWER_LIMB_URL);

  const muscles = useMemo(() => {
    const result: { geometry: THREE.BufferGeometry; groupColor: string; isMirror: boolean; nodeName: string; muscleGroup: string }[] = [];

    const processScene = (scene: THREE.Group) => {
      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const rawName = child.name;
        const originalName = rawName.replace(/_/g, ' ');
        if (!isMuscleNode(originalName)) return;

        const group = getMuscleGroup(originalName);
        const color = MUSCLE_GROUP_COLORS[group];
        const geo = child.geometry;

        result.push({ geometry: geo, groupColor: color, isMirror: false, nodeName: originalName, muscleGroup: group });
        if (rawName.endsWith('r') || originalName.endsWith('.r') || originalName.endsWith('.r.')) {
          result.push({ geometry: geo, groupColor: color, isMirror: true, nodeName: originalName + '_L', muscleGroup: group });
        }
      });
    };

    processScene(upperScene);
    processScene(lowerScene);
    return result;
  }, [upperScene, lowerScene]);

  return (
    <group>
      {muscles.map(({ geometry, groupColor, isMirror, nodeName, muscleGroup }, i) => (
        <MuscleMesh key={`${nodeName}-${i}`} geometry={geometry} groupColor={groupColor} isMirror={isMirror} muscleGroup={muscleGroup} />
      ))}
    </group>
  );
}

// ============================================================
// Camera Controller - V1.5: joint preset camera transitions
// ============================================================
function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const cameraTarget = useAppStore((s) => s.cameraTarget);
  const cameraPosition = useAppStore((s) => s.cameraPosition);
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);
  const activeJointPreset = useAppStore((s) => s.activeJointPreset);
  const animRef = useRef<number>(0);

  // Animate camera to position + target
  useEffect(() => {
    if (!controlsRef.current || !cameraPosition || !cameraTarget) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const startTarget = controlsRef.current.target.clone();
    const startPos = camera.position.clone();
    const endTarget = new THREE.Vector3(...cameraTarget);
    const endPos = new THREE.Vector3(...cameraPosition);

    let progress = 0;
    const animate = () => {
      progress += 0.025;
      if (progress >= 1) {
        controlsRef.current!.target.copy(endTarget);
        camera.position.copy(endPos);
        controlsRef.current!.update();
        useAppStore.setState({ cameraPosition: null });
        return;
      }
      const t = easeInOutCubic(progress);
      controlsRef.current!.target.lerpVectors(startTarget, endTarget, t);
      camera.position.lerpVectors(startPos, endPos, t);
      controlsRef.current!.update();
      animRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [cameraPosition, cameraTarget, camera]);

  // Animate camera to target only (keep direction)
  useEffect(() => {
    if (!controlsRef.current || !cameraTarget || cameraPosition) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const [x, y, z] = cameraTarget;
    const targetVec = new THREE.Vector3(x, y, z);
    const startTarget = controlsRef.current.target.clone();
    const startPos = camera.position.clone();
    const direction = new THREE.Vector3().subVectors(startPos, startTarget).normalize();
    const distance = startPos.distanceTo(startTarget);
    const newDistance = Math.min(distance, 4);
    const newPos = targetVec.clone().add(direction.multiplyScalar(newDistance));

    let progress = 0;
    const animate = () => {
      progress += 0.025;
      if (progress >= 1) {
        controlsRef.current!.target.copy(targetVec);
        camera.position.copy(newPos);
        controlsRef.current!.update();
        return;
      }
      const t = easeInOutCubic(progress);
      controlsRef.current!.target.lerpVectors(startTarget, targetVec, t);
      camera.position.lerpVectors(startPos, newPos, t);
      controlsRef.current!.update();
      animRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [cameraTarget, camera]);

  // Focus on selected bone
  useEffect(() => {
    if (!selectedBoneId || !controlsRef.current) return;
    const pos = (window as any).__bonePositions?.[selectedBoneId];
    if (pos) useAppStore.getState().setCameraTarget(pos);
  }, [selectedBoneId]);

  // Focus on locked region
  useEffect(() => {
    if (!lockedRegionId || !controlsRef.current) return;
    const positions = (window as any).__bonePositions;
    if (!positions) return;
    const regionBones = Object.entries(APP_BONE_LOOKUP)
      .filter(([_, entry]) => entry.region === lockedRegionId)
      .map(([id]) => positions[id])
      .filter(Boolean);
    if (regionBones.length === 0) return;
    const center = new THREE.Vector3();
    regionBones.forEach((p: [number, number, number]) => center.add(new THREE.Vector3(...p)));
    center.divideScalar(regionBones.length);
    useAppStore.getState().setCameraTarget([center.x, center.y, center.z]);
  }, [lockedRegionId]);

  // V1.5: Focus on joint preset
  useEffect(() => {
    if (!activeJointPreset || !controlsRef.current) return;
    const preset = JOINT_PRESET_MAP[activeJointPreset];
    if (!preset) return;
    useAppStore.getState().setCameraPreset(preset.cameraPosition, preset.cameraTarget);
  }, [activeJointPreset]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.8}
      zoomSpeed={1.2}
      panSpeed={0.8}
      minDistance={0.5}
      maxDistance={20}
      target={[0, 3.8, 0]}
      makeDefault
    />
  );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ============================================================
// Lighting
// ============================================================
function SceneLighting() {
  return (
    <>
      <directionalLight position={[3, 8, 5]} intensity={1.2} color="#E8F0FF" castShadow />
      <directionalLight position={[-4, 3, 2]} intensity={0.4} color="#FFE8D0" />
      <directionalLight position={[0, 2, -5]} intensity={0.6} color="#00D4FF" />
      <ambientLight intensity={0.3} color="#8090B0" />
      <pointLight position={[0, -2, 0]} intensity={0.15} color="#4060A0" />
      <hemisphereLight args={['#B0C4DE', '#2A2A3A', 0.3]} />
    </>
  );
}

// ============================================================
// Floor Grid
// ============================================================
function FloorGrid() {
  return (
    <Grid
      position={[0, -0.1, 0]}
      args={[20, 20]}
      cellSize={0.5}
      cellThickness={0.5}
      cellColor="#1a2540"
      sectionSize={2}
      sectionThickness={1}
      sectionColor="#253050"
      fadeDistance={12}
      fadeStrength={1}
      infiniteGrid
    />
  );
}

// ============================================================
// V2.4: Joint Motion Animator - Anatomically correct pivot-based rotation
// Pivot = proximal end (top/Y-max) of the pivotBone = the joint surface
// All movingBones rotate around this pivot point
// ============================================================
function JointMotionAnimator() {
  const jointMotionId = useAppStore((s) => s.jointMotionId);
  const jointMotionPlaying = useAppStore((s) => s.jointMotionPlaying);
  const jointMotionSpeed = useAppStore((s) => s.jointMotionSpeed);
  const timeRef = useRef(0);
  const prevMotionId = useRef<string | null>(null);

  useFrame((_, delta) => {
    // When motion changes, reset time
    if (jointMotionId !== prevMotionId.current) {
      timeRef.current = 0;
      prevMotionId.current = jointMotionId;
    }

    // Not playing or no motion selected -> signal bones to return to rest
    if (!jointMotionId || !jointMotionPlaying) {
      (window as any).__jointMotionData = null;
      return;
    }

    const motion = JOINT_MOTION_MAP[jointMotionId];
    if (!motion) {
      (window as any).__jointMotionData = null;
      return;
    }

    // V2.4: Get bone bounding box data for accurate joint pivot calculation
    const boneBounds = (window as any).__boneBounds as Record<string, { min: [number, number, number]; max: [number, number, number]; center: [number, number, number] }> | null;
    if (!boneBounds) {
      (window as any).__jointMotionData = null;
      return;
    }

    const pivotBoneBounds = boneBounds[motion.pivotBone];
    if (!pivotBoneBounds) {
      (window as any).__jointMotionData = null;
      return;
    }

    // V2.4: NEW PIVOT STRATEGY
    // The pivotBone IS the first bone that moves (e.g., humerus for shoulder).
    // The joint surface is at the PROXIMAL end (top, Y-max) of this bone.
    // This is where the bone connects to the body - the humeral head, femoral head, etc.
    //
    // For the proximal end of a long bone:
    //   - Y-max = top of the bone = closest to body center = joint surface
    //   - Use the X,Z of the bone's center (the joint is roughly centered on the bone's axis)
    const pivotPoint: [number, number, number] = [
      pivotBoneBounds.center[0],
      pivotBoneBounds.max[1],  // proximal end = Y maximum = joint surface
      pivotBoneBounds.center[2],
    ];

    timeRef.current += delta * jointMotionSpeed;

    // Sinusoidal oscillation within the visual range
    const t = Math.sin(timeRef.current * 1.5); // -1 to 1
    const angleDeg = t * motion.visualRange;
    const angleRad = THREE.MathUtils.degToRad(angleDeg);

    // Set global data for InteractiveBone AND MuscleMesh to read
    (window as any).__jointMotionData = {
      angleRad,
      axis: motion.axis,
      pivotPoint,
      movingBones: new Set(motion.movingBones),
    };
  });

  // Clear motion data when component unmounts
  useEffect(() => {
    return () => {
      (window as any).__jointMotionData = null;
    };
  }, []);

  return null;
}

// ============================================================
// Main Scene Export
// ============================================================
export default function SkeletonScene() {
  const selectBone = useAppStore((s) => s.selectBone);

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 4, 10], fov: 45, near: 0.01, far: 100 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        onPointerMissed={() => selectBone(null)}
        style={{ background: 'linear-gradient(180deg, #0A0E17 0%, #0D1220 50%, #101828 100%)' }}
      >
        <SceneLighting />
        <CameraController />
        <SkeletonModel />
        <MuscleOverlay />
        <JointMotionAnimator />
        <FloorGrid />
        <fog attach="fog" args={['#0A0E17', 12, 30]} />
      </Canvas>
    </div>
  );
}

useGLTF.preload(SKELETON_URL);
useGLTF.preload(UPPER_LIMB_URL);
useGLTF.preload(LOWER_LIMB_URL);
