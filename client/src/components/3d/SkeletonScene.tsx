/*
 * SkeletonScene.tsx - Main 3D scene with real anatomical skeleton + muscle overlay + pathology effects
 * Design: Deep space gray environment with cool blue rim lighting
 * Model: AnatomyTOOL medical-grade skeleton (147 bones, mirrored for left side)
 *        + upper-limb muscles (44) + lower-limb muscles (53)
 * 
 * Model coordinate system:
 *   - Units: meters (total height ~1.55m)
 *   - Y-axis: up (0 = feet, 1.55 = top of skull)
 *   - X-axis: right side is negative X (anatomical convention)
 */

import { useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLB_NODE_TO_BONE, APP_BONE_LOOKUP } from '@/lib/boneMapping';
import { useAppStore } from '@/lib/store';
import { BONE_PATHOLOGIES } from '@/lib/pathologyData';
import { getPathologyEffect } from '@/lib/pathologyEffects';
import { isMuscleNode, getMuscleGroup, MUSCLE_GROUP_COLORS } from '@/lib/muscleFilter';

const SKELETON_URL = '/manus-storage/overview-skeleton_8b0752cc.glb';
const UPPER_LIMB_URL = '/manus-storage/upper-limb_1ff7cbc0.glb';
const LOWER_LIMB_URL = '/manus-storage/lower-limb_931f932f.glb';

// Model bounding box: X[-0.34, 0.07], Y[0.009, 1.71], Z[-0.12, 0.14]
const MODEL_SCALE = 4.7;
const MODEL_OFFSET_X = 0.13 * MODEL_SCALE;
const MODEL_OFFSET_Y = -0.009 * MODEL_SCALE;
const MODEL_OFFSET_Z = -0.01 * MODEL_SCALE;

// ============================================================
// Region color palette
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

// ============================================================
// Interactive Bone Mesh
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
  const activePathologyIndex = useAppStore((s) => s.activePathologyIndex);
  const selectBone = useAppStore((s) => s.selectBone);
  const hoverBone = useAppStore((s) => s.hoverBone);

  const isSelected = selectedBoneId === appBoneId;
  const isHovered = hoveredBoneId === appBoneId;
  const isVisible = visibleRegions.has(region) && !hiddenBones.has(appBoneId);
  const isDimmed = lockedRegionId !== null && lockedRegionId !== region;

  // Check if this bone has an active pathology effect
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

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;

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
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        pathologyEffect.emissiveIntensity * (0.6 + 0.4 * pulse),
        0.1
      );
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, pathologyEffect.opacity, 0.1);
      mat.roughness = THREE.MathUtils.lerp(mat.roughness, pathologyEffect.roughness, 0.05);
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
  );
}

// ============================================================
// Muscle Mesh - Semi-transparent muscle overlay
// ============================================================
interface MuscleMeshProps {
  geometry: THREE.BufferGeometry;
  groupColor: string;
  isMirror: boolean;
}

function MuscleMesh({ geometry, groupColor, isMirror }: MuscleMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
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

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const targetOpacity = muscleMode ? muscleOpacity : 0;
    fadeRef.current = THREE.MathUtils.lerp(fadeRef.current, targetOpacity, 0.06);
    mat.opacity = fadeRef.current;
    meshRef.current.visible = fadeRef.current > 0.01;
  });

  const meshPosition: [number, number, number] = isMirror
    ? [2 * MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z]
    : [MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z];
  
  const meshScale: [number, number, number] = isMirror
    ? [-MODEL_SCALE, MODEL_SCALE, MODEL_SCALE]
    : [MODEL_SCALE, MODEL_SCALE, MODEL_SCALE];

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={meshPosition}
      scale={meshScale}
      visible={false}
      renderOrder={1}
    />
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

  // Get active pathology info if any
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
      <div className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm border border-cyan-400/30 whitespace-nowrap">
        <div className="text-[11px] font-medium text-cyan-300">{boneEntry.nameCn}</div>
        <div className="text-[9px] font-mono text-cyan-400/60">{boneEntry.nameEn}</div>
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
// GLB Skeleton Loader
// ============================================================
const SANITIZED_LOOKUP: Record<string, string> = {};
for (const originalName of Object.keys(GLB_NODE_TO_BONE)) {
  const sanitized = originalName.replace(/\s/g, '_').replace(/\./g, '');
  SANITIZED_LOOKUP[sanitized] = originalName;
}

function SkeletonModel() {
  const { scene } = useGLTF(SKELETON_URL);

  const bones = useMemo(() => {
    const result: { geometry: THREE.BufferGeometry; appBoneId: string; region: string; isMirror: boolean; center: [number, number, number] }[] = [];
    const bonePositions: Record<string, [number, number, number]> = {};

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

      result.push({
        geometry: geo,
        appBoneId: mapping.appBoneId,
        region: mapping.region,
        isMirror: false,
        center: scaledCenter,
      });
      bonePositions[mapping.appBoneId] = scaledCenter;

      if (mapping.mirror && mapping.mirrorAppBoneId) {
        const leftRegion = mapping.region.replace('-right', '-left');
        const mirroredCenter: [number, number, number] = [
          2 * MODEL_OFFSET_X - scaledCenter[0],
          scaledCenter[1],
          scaledCenter[2],
        ];
        result.push({
          geometry: geo,
          appBoneId: mapping.mirrorAppBoneId,
          region: leftRegion === mapping.region ? mapping.region : leftRegion,
          isMirror: true,
          center: mirroredCenter,
        });
        bonePositions[mapping.mirrorAppBoneId] = mirroredCenter;
      }
    });

    (window as any).__bonePositions = bonePositions;
    return result;
  }, [scene]);

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
    </group>
  );
}

// ============================================================
// Muscle Overlay Loader - loads upper-limb and lower-limb GLB
// ============================================================
function MuscleOverlay() {
  const { scene: upperScene } = useGLTF(UPPER_LIMB_URL);
  const { scene: lowerScene } = useGLTF(LOWER_LIMB_URL);

  const muscles = useMemo(() => {
    const result: { geometry: THREE.BufferGeometry; groupColor: string; isMirror: boolean; nodeName: string }[] = [];

    const processScene = (scene: THREE.Group) => {
      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const rawName = child.name;
        // Reverse Three.js sanitization
        const originalName = rawName.replace(/_/g, ' ');
        
        if (!isMuscleNode(originalName)) return;

        const group = getMuscleGroup(originalName);
        const color = MUSCLE_GROUP_COLORS[group];
        const geo = child.geometry;

        // Right side (original)
        result.push({ geometry: geo, groupColor: color, isMirror: false, nodeName: originalName });
        
        // Mirror for left side if node name ends with .r or .r (sanitized)
        if (rawName.endsWith('r') || originalName.endsWith('.r') || originalName.endsWith('.r.')) {
          result.push({ geometry: geo, groupColor: color, isMirror: true, nodeName: originalName + '_L' });
        }
      });
    };

    processScene(upperScene);
    processScene(lowerScene);

    return result;
  }, [upperScene, lowerScene]);

  return (
    <group>
      {muscles.map(({ geometry, groupColor, isMirror, nodeName }, i) => (
        <MuscleMesh
          key={`${nodeName}-${i}`}
          geometry={geometry}
          groupColor={groupColor}
          isMirror={isMirror}
        />
      ))}
    </group>
  );
}

// ============================================================
// Camera Controller with smooth transitions
// ============================================================
function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const cameraTarget = useAppStore((s) => s.cameraTarget);
  const cameraPosition = useAppStore((s) => s.cameraPosition);
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!controlsRef.current || !cameraPosition || !cameraTarget) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const startTarget = controlsRef.current.target.clone();
    const startPos = camera.position.clone();
    const endTarget = new THREE.Vector3(...cameraTarget);
    const endPos = new THREE.Vector3(...cameraPosition);

    let progress = 0;
    const animate = () => {
      progress += 0.03;
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
      progress += 0.03;
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

  useEffect(() => {
    if (!selectedBoneId || !controlsRef.current) return;
    const pos = (window as any).__bonePositions?.[selectedBoneId];
    if (pos) {
      useAppStore.getState().setCameraTarget(pos);
    }
  }, [selectedBoneId]);

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
// Main Scene Export
// ============================================================
export default function SkeletonScene() {
  const selectBone = useAppStore((s) => s.selectBone);

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{
          position: [0, 4, 10],
          fov: 45,
          near: 0.01,
          far: 100,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        onPointerMissed={() => selectBone(null)}
        style={{ background: 'linear-gradient(180deg, #0A0E17 0%, #0D1220 50%, #101828 100%)' }}
      >
        <SceneLighting />
        <CameraController />
        <SkeletonModel />
        <MuscleOverlay />
        <FloorGrid />
        <fog attach="fog" args={['#0A0E17', 12, 30]} />
      </Canvas>
    </div>
  );
}

// Preload all GLB models
useGLTF.preload(SKELETON_URL);
useGLTF.preload(UPPER_LIMB_URL);
useGLTF.preload(LOWER_LIMB_URL);
