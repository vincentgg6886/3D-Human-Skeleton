/*
 * SkeletonScene.tsx - Main 3D scene with skeleton, lighting, camera controls
 * Design: Deep space gray environment with cool blue rim lighting
 * Features: Bone connections, anatomical labels, smooth camera transitions
 */

import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import BoneMesh from './BoneMesh';
import { BONE_GEOMETRIES, BONE_INFO } from '@/lib/skeletonData';
import { useAppStore } from '@/lib/store';

// ============================================================
// Connection lines between bones (joints/articulations)
// ============================================================

const BONE_CONNECTIONS: [string, string][] = [
  // Skull to spine
  ['cranium', 'mandible'],
  ['cranium', 'cervical-vertebrae'],
  // Spine chain
  ['cervical-vertebrae', 'thoracic-vertebrae'],
  ['thoracic-vertebrae', 'lumbar-vertebrae'],
  ['lumbar-vertebrae', 'sacrum'],
  ['sacrum', 'coccyx'],
  // Thorax
  ['thoracic-vertebrae', 'sternum'],
  ['sternum', 'ribs-left'],
  ['sternum', 'ribs-right'],
  ['ribs-left', 'thoracic-vertebrae'],
  ['ribs-right', 'thoracic-vertebrae'],
  // Upper limb left
  ['sternum', 'clavicle-left'],
  ['clavicle-left', 'scapula-left'],
  ['scapula-left', 'humerus-left'],
  ['humerus-left', 'radius-left'],
  ['humerus-left', 'ulna-left'],
  ['radius-left', 'hand-left'],
  ['ulna-left', 'hand-left'],
  // Upper limb right
  ['sternum', 'clavicle-right'],
  ['clavicle-right', 'scapula-right'],
  ['scapula-right', 'humerus-right'],
  ['humerus-right', 'radius-right'],
  ['humerus-right', 'ulna-right'],
  ['radius-right', 'hand-right'],
  ['ulna-right', 'hand-right'],
  // Pelvis
  ['sacrum', 'ilium-left'],
  ['sacrum', 'ilium-right'],
  // Lower limb left
  ['ilium-left', 'femur-left'],
  ['femur-left', 'patella-left'],
  ['femur-left', 'tibia-left'],
  ['femur-left', 'fibula-left'],
  ['tibia-left', 'foot-left'],
  ['fibula-left', 'foot-left'],
  // Lower limb right
  ['ilium-right', 'femur-right'],
  ['femur-right', 'patella-right'],
  ['femur-right', 'tibia-right'],
  ['femur-right', 'fibula-right'],
  ['tibia-right', 'foot-right'],
  ['fibula-right', 'foot-right'],
];

function ConnectionLines() {
  const visibleRegions = useAppStore((s) => s.visibleRegions);
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);

  const boneMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    BONE_GEOMETRIES.forEach((b) => map.set(b.id, b.position));
    return map;
  }, []);

  const regionMap = useMemo(() => {
    const map = new Map<string, string>();
    BONE_GEOMETRIES.forEach((b) => map.set(b.id, b.region));
    return map;
  }, []);

  const lines = useMemo(() => {
    const result: { points: THREE.Vector3[]; dimmed: boolean }[] = [];
    BONE_CONNECTIONS.forEach(([a, b]) => {
      const posA = boneMap.get(a);
      const posB = boneMap.get(b);
      if (!posA || !posB) return;

      const regionA = regionMap.get(a)!;
      const regionB = regionMap.get(b)!;
      if (!visibleRegions.has(regionA) || !visibleRegions.has(regionB)) return;

      const dimmed = lockedRegionId !== null &&
        lockedRegionId !== regionA && lockedRegionId !== regionB;

      result.push({
        points: [new THREE.Vector3(...posA), new THREE.Vector3(...posB)],
        dimmed,
      });
    });
    return result;
  }, [boneMap, regionMap, visibleRegions, lockedRegionId]);

  return (
    <>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(line.points.flatMap((p) => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={line.dimmed ? '#1a2030' : '#1e3a5f'}
            transparent
            opacity={line.dimmed ? 0.15 : 0.35}
            linewidth={1}
          />
        </line>
      ))}
    </>
  );
}

// ============================================================
// Floating label for selected bone
// ============================================================

function BoneLabel() {
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const bone = selectedBoneId ? BONE_GEOMETRIES.find((b) => b.id === selectedBoneId) : null;
  const info = selectedBoneId ? BONE_INFO[selectedBoneId] : null;

  if (!bone || !info) return null;

  return (
    <Html
      position={[bone.position[0], bone.position[1] + 0.4, bone.position[2]]}
      center
      distanceFactor={5}
      style={{ pointerEvents: 'none' }}
    >
      <div className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm border border-cyan-400/30 whitespace-nowrap">
        <div className="text-[11px] font-medium text-cyan-300">{info.nameCn}</div>
        <div className="text-[9px] font-mono text-cyan-400/60">{info.name}</div>
      </div>
    </Html>
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

  // Handle camera preset (both position and target)
  useEffect(() => {
    if (!controlsRef.current || !cameraPosition || !cameraTarget) return;

    // Cancel any existing animation
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
        // Clear cameraPosition after animation completes
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

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [cameraPosition, cameraTarget, camera]);

  // Handle camera target only (focus on bone/region)
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

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [cameraTarget, camera]);

  // Auto-focus on selected bone
  useEffect(() => {
    if (!selectedBoneId || !controlsRef.current) return;
    const bone = BONE_GEOMETRIES.find((b) => b.id === selectedBoneId);
    if (bone) {
      useAppStore.getState().setCameraTarget(bone.position);
    }
  }, [selectedBoneId]);

  // Auto-focus on locked region
  useEffect(() => {
    if (!lockedRegionId || !controlsRef.current) return;
    const regionBones = BONE_GEOMETRIES.filter((b) => b.region === lockedRegionId);
    if (regionBones.length === 0) return;

    const center = new THREE.Vector3();
    regionBones.forEach((b) => center.add(new THREE.Vector3(...b.position)));
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
      minDistance={1}
      maxDistance={15}
      target={[0, 4, 0]}
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
      <ambientLight intensity={0.25} color="#8090B0" />
      <pointLight position={[0, -2, 0]} intensity={0.15} color="#4060A0" />
    </>
  );
}

// ============================================================
// Skeleton Model Group
// ============================================================

function SkeletonModel() {
  return (
    <group>
      {BONE_GEOMETRIES.map((bone) => (
        <BoneMesh key={bone.id} bone={bone} />
      ))}
      <ConnectionLines />
      <BoneLabel />
    </group>
  );
}

// ============================================================
// Floor Grid
// ============================================================

function FloorGrid() {
  return (
    <Grid
      position={[0, -0.6, 0]}
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
          position: [4, 5, 6],
          fov: 45,
          near: 0.1,
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
        <FloorGrid />
        <fog attach="fog" args={['#0A0E17', 10, 25]} />
      </Canvas>
    </div>
  );
}
