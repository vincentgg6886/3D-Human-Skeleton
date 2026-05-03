/*
 * jointMotionData.ts - Joint motion animation data
 * V2.0: Defines motion types for each joint with ROM ranges and rotation axes
 * Used by SkeletonScene.tsx for real-time bone rotation animations
 */

export interface JointMotion {
  id: string;
  jointId: string;       // matches JOINT_PRESETS[].id
  nameCn: string;
  nameEn: string;
  rangeMin: number;      // degrees (negative = opposite direction)
  rangeMax: number;      // degrees
  axis: 'x' | 'y' | 'z';  // rotation axis in local space
  /** Which bone(s) to animate. First bone is the primary mover. */
  movingBones: string[];
  /** Pivot bone (stays fixed, motion is relative to this) */
  pivotBone: string;
}

export const JOINT_MOTION_DATA: JointMotion[] = [
  // ── Shoulder ──
  {
    id: 'shoulder-right-flexion',
    jointId: 'shoulder-right',
    nameCn: '前屈/后伸',
    nameEn: 'Flexion / Extension',
    rangeMin: -45,
    rangeMax: 180,
    axis: 'x',
    movingBones: ['humerus-right'],
    pivotBone: 'scapula-right',
  },
  {
    id: 'shoulder-right-abduction',
    jointId: 'shoulder-right',
    nameCn: '外展/内收',
    nameEn: 'Abduction / Adduction',
    rangeMin: 0,
    rangeMax: 180,
    axis: 'z',
    movingBones: ['humerus-right'],
    pivotBone: 'scapula-right',
  },
  {
    id: 'shoulder-left-flexion',
    jointId: 'shoulder-left',
    nameCn: '前屈/后伸',
    nameEn: 'Flexion / Extension',
    rangeMin: -45,
    rangeMax: 180,
    axis: 'x',
    movingBones: ['humerus-left'],
    pivotBone: 'scapula-left',
  },
  {
    id: 'shoulder-left-abduction',
    jointId: 'shoulder-left',
    nameCn: '外展/内收',
    nameEn: 'Abduction / Adduction',
    rangeMin: 0,
    rangeMax: 180,
    axis: 'z',
    movingBones: ['humerus-left'],
    pivotBone: 'scapula-left',
  },

  // ── Elbow ──
  {
    id: 'elbow-right-flexion',
    jointId: 'elbow-right',
    nameCn: '屈曲/伸展',
    nameEn: 'Flexion / Extension',
    rangeMin: 0,
    rangeMax: 145,
    axis: 'x',
    movingBones: ['radius-right', 'ulna-right'],
    pivotBone: 'humerus-right',
  },
  {
    id: 'elbow-right-pronation',
    jointId: 'elbow-right',
    nameCn: '旋前/旋后',
    nameEn: 'Pronation / Supination',
    rangeMin: -80,
    rangeMax: 80,
    axis: 'y',
    movingBones: ['radius-right'],
    pivotBone: 'ulna-right',
  },
  {
    id: 'elbow-left-flexion',
    jointId: 'elbow-left',
    nameCn: '屈曲/伸展',
    nameEn: 'Flexion / Extension',
    rangeMin: 0,
    rangeMax: 145,
    axis: 'x',
    movingBones: ['radius-left', 'ulna-left'],
    pivotBone: 'humerus-left',
  },
  {
    id: 'elbow-left-pronation',
    jointId: 'elbow-left',
    nameCn: '旋前/旋后',
    nameEn: 'Pronation / Supination',
    rangeMin: -80,
    rangeMax: 80,
    axis: 'y',
    movingBones: ['radius-left'],
    pivotBone: 'ulna-left',
  },

  // ── Hip ──
  {
    id: 'hip-right-flexion',
    jointId: 'hip-right',
    nameCn: '前屈/后伸',
    nameEn: 'Flexion / Extension',
    rangeMin: -15,
    rangeMax: 125,
    axis: 'x',
    movingBones: ['femur-right'],
    pivotBone: 'hip-bone-right',
  },
  {
    id: 'hip-right-abduction',
    jointId: 'hip-right',
    nameCn: '外展/内收',
    nameEn: 'Abduction / Adduction',
    rangeMin: -25,
    rangeMax: 45,
    axis: 'z',
    movingBones: ['femur-right'],
    pivotBone: 'hip-bone-right',
  },
  {
    id: 'hip-left-flexion',
    jointId: 'hip-left',
    nameCn: '前屈/后伸',
    nameEn: 'Flexion / Extension',
    rangeMin: -15,
    rangeMax: 125,
    axis: 'x',
    movingBones: ['femur-left'],
    pivotBone: 'hip-bone-left',
  },
  {
    id: 'hip-left-abduction',
    jointId: 'hip-left',
    nameCn: '外展/内收',
    nameEn: 'Abduction / Adduction',
    rangeMin: -25,
    rangeMax: 45,
    axis: 'z',
    movingBones: ['femur-left'],
    pivotBone: 'hip-bone-left',
  },

  // ── Knee ──
  {
    id: 'knee-right-flexion',
    jointId: 'knee-right',
    nameCn: '屈曲/伸展',
    nameEn: 'Flexion / Extension',
    rangeMin: 0,
    rangeMax: 135,
    axis: 'x',
    movingBones: ['tibia-right', 'fibula-right'],
    pivotBone: 'femur-right',
  },
  {
    id: 'knee-left-flexion',
    jointId: 'knee-left',
    nameCn: '屈曲/伸展',
    nameEn: 'Flexion / Extension',
    rangeMin: 0,
    rangeMax: 135,
    axis: 'x',
    movingBones: ['tibia-left', 'fibula-left'],
    pivotBone: 'femur-left',
  },
];

export const JOINT_MOTION_MAP: Record<string, JointMotion> = {};
JOINT_MOTION_DATA.forEach((m) => { JOINT_MOTION_MAP[m.id] = m; });
