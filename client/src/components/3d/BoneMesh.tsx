/*
 * BoneMesh.tsx - Individual bone 3D mesh component
 * Design: Scientific Instrument Aesthetic - ivory bone with cyan highlight on hover/select
 * Optimized: Material updates via useFrame instead of recreating on state change
 */

import { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BoneGeometry } from '@/lib/skeletonData';
import { REGION_COLORS } from '@/lib/skeletonData';
import { useAppStore } from '@/lib/store';

interface BoneMeshProps {
  bone: BoneGeometry;
}

const SELECTED_EMISSIVE = new THREE.Color('#00D4FF');
const HOVER_EMISSIVE = new THREE.Color('#00A8CC');
const DEFAULT_EMISSIVE = new THREE.Color('#000000');
const DIMMED_COLOR = new THREE.Color('#3A3A4A');

export default function BoneMesh({ bone }: BoneMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [localHover, setLocalHover] = useState(false);
  const glowTime = useRef(0);

  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const hoveredBoneId = useAppStore((s) => s.hoveredBoneId);
  const visibleRegions = useAppStore((s) => s.visibleRegions);
  const hiddenBones = useAppStore((s) => s.hiddenBones);
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);
  const selectBone = useAppStore((s) => s.selectBone);
  const hoverBone = useAppStore((s) => s.hoverBone);

  const isSelected = selectedBoneId === bone.id;
  const isHovered = hoveredBoneId === bone.id || localHover;
  const isVisible = visibleRegions.has(bone.region) && !hiddenBones.has(bone.id);
  const isDimmed = lockedRegionId !== null && lockedRegionId !== bone.region;

  const baseColor = useMemo(() => new THREE.Color(REGION_COLORS[bone.region] || '#E8DCC8'), [bone.region]);

  // Create material once, update in useFrame
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.55,
      metalness: 0.08,
      emissive: DEFAULT_EMISSIVE,
      emissiveIntensity: 0,
    });
  }, []);

  // Create geometry once
  const geometry = useMemo(() => {
    switch (bone.shape) {
      case 'sphere':
        return new THREE.SphereGeometry(bone.dimensions[0], 32, 32);
      case 'box': {
        const geo = new THREE.BoxGeometry(bone.dimensions[0], bone.dimensions[1], bone.dimensions[2], 2, 2, 2);
        return geo;
      }
      case 'cylinder':
        return new THREE.CylinderGeometry(bone.dimensions[0], bone.dimensions[1], bone.dimensions[2], 20);
      case 'capsule':
        return new THREE.CapsuleGeometry(bone.dimensions[0], bone.dimensions[1], 12, 20);
      default:
        return new THREE.BoxGeometry(0.1, 0.1, 0.1);
    }
  }, [bone.shape, bone.dimensions]);

  // Animate material properties every frame
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;

    // Color: dimmed when region locked and not in locked region
    if (isDimmed) {
      mat.color.lerp(DIMMED_COLOR, 0.1);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.25, 0.1);
      mat.transparent = true;
    } else {
      mat.color.lerp(baseColor, 0.1);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 1, 0.1);
      mat.transparent = mat.opacity < 0.99;
    }

    // Emissive: selected > hovered > default
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
    selectBone(isSelected ? null : bone.id);
  }, [isSelected, bone.id, selectBone]);

  const handlePointerOver = useCallback((e: any) => {
    e.stopPropagation();
    setLocalHover(true);
    hoverBone(bone.id);
    document.body.style.cursor = 'pointer';
  }, [bone.id, hoverBone]);

  const handlePointerOut = useCallback(() => {
    setLocalHover(false);
    hoverBone(null);
    document.body.style.cursor = 'default';
  }, [hoverBone]);

  if (!isVisible) return null;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={bone.position}
      rotation={bone.rotation || [0, 0, 0]}
      scale={bone.scale || [1, 1, 1]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      castShadow
      receiveShadow
    />
  );
}
