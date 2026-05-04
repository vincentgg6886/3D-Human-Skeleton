/*
 * jointMotionData.ts - Anatomically correct joint motion animation data
 * V2.4: Complete kinematic chains including hands/feet + corrected pivot strategy
 * 
 * Key concepts:
 * - pivotBone: the bone that provides the joint pivot point (stays fixed)
 * - movingBones: ALL bones downstream in the kinematic chain (including hands/feet)
 * - axis: rotation axis in model coordinate system
 *   Model orientation: Y=up, facing -Z, right side = +X
 *   Flexion/Extension = rotation around Z axis (mediolateral)
 *   Abduction/Adduction = rotation around X axis (anteroposterior) 
 *   Internal/External rotation = rotation around Y axis (longitudinal)
 * - pivotStrategy: how to determine the pivot point
 *   'moving-proximal' = use the proximal end (top/near-body) of the first moving bone
 *   This is the most anatomically correct: the joint surface is at the top of the moving bone
 * - visualRange: degrees of oscillation for the animation (kept small to avoid dislocation)
 */

export interface JointMotion {
  id: string;
  jointId: string;       // matches JOINT_PRESETS[].id
  nameCn: string;
  nameEn: string;
  rangeMin: number;      // degrees (clinical ROM reference)
  rangeMax: number;      // degrees (clinical ROM reference)
  axis: 'x' | 'y' | 'z';  // rotation axis in world space
  /** All bones that move during this motion (complete kinematic chain) */
  movingBones: string[];
  /** Bone that provides the pivot point (stays fixed) */
  pivotBone: string;
  /** Visual animation range in degrees [-range, +range] for smooth oscillation */
  visualRange: number;
}

// Complete hand bones (right side)
const HAND_BONES_RIGHT = [
  'scaphoid-right', 'lunate-right', 'triquetrum-right', 'pisiform-right',
  'trapezium-right', 'trapezoid-right', 'capitate-right', 'hamate-right',
  'metacarpal-1-right', 'metacarpal-2-right', 'metacarpal-3-right', 'metacarpal-4-right', 'metacarpal-5-right',
  'prox-phalanx-f1-right', 'prox-phalanx-f2-right', 'prox-phalanx-f3-right', 'prox-phalanx-f4-right', 'prox-phalanx-f5-right',
  'mid-phalanx-f2-right', 'mid-phalanx-f3-right', 'mid-phalanx-f4-right', 'mid-phalanx-f5-right',
  'dist-phalanx-f1-right', 'dist-phalanx-f2-right', 'dist-phalanx-f3-right', 'dist-phalanx-f4-right', 'dist-phalanx-f5-right',
];

const HAND_BONES_LEFT = [
  'scaphoid-left', 'lunate-left', 'triquetrum-left', 'pisiform-left',
  'trapezium-left', 'trapezoid-left', 'capitate-left', 'hamate-left',
  'metacarpal-1-left', 'metacarpal-2-left', 'metacarpal-3-left', 'metacarpal-4-left', 'metacarpal-5-left',
  'prox-phalanx-f1-left', 'prox-phalanx-f2-left', 'prox-phalanx-f3-left', 'prox-phalanx-f4-left', 'prox-phalanx-f5-left',
  'mid-phalanx-f2-left', 'mid-phalanx-f3-left', 'mid-phalanx-f4-left', 'mid-phalanx-f5-left',
  'dist-phalanx-f1-left', 'dist-phalanx-f2-left', 'dist-phalanx-f3-left', 'dist-phalanx-f4-left', 'dist-phalanx-f5-left',
];

// Complete foot bones (right side)
const FOOT_BONES_RIGHT = [
  'talus-right', 'calcaneus-right', 'navicular-right', 'cuboid-right',
  'medial-cuneiform-right', 'intermediate-cuneiform-right', 'lateral-cuneiform-right',
  'metatarsal-1-right', 'metatarsal-2-right', 'metatarsal-3-right', 'metatarsal-4-right', 'metatarsal-5-right',
  'prox-phalanx-t1-right', 'prox-phalanx-t2-right', 'prox-phalanx-t3-right', 'prox-phalanx-t4-right', 'prox-phalanx-t5-right',
  'mid-phalanx-t2-right', 'mid-phalanx-t3-right', 'mid-phalanx-t4-right', 'mid-phalanx-t5-right',
  'dist-phalanx-t1-right', 'dist-phalanx-t2-right', 'dist-phalanx-t3-right', 'dist-phalanx-t4-right', 'dist-phalanx-t5-right',
];

const FOOT_BONES_LEFT = [
  'talus-left', 'calcaneus-left', 'navicular-left', 'cuboid-left',
  'medial-cuneiform-left', 'intermediate-cuneiform-left', 'lateral-cuneiform-left',
  'metatarsal-1-left', 'metatarsal-2-left', 'metatarsal-3-left', 'metatarsal-4-left', 'metatarsal-5-left',
  'prox-phalanx-t1-left', 'prox-phalanx-t2-left', 'prox-phalanx-t3-left', 'prox-phalanx-t4-left', 'prox-phalanx-t5-left',
  'mid-phalanx-t2-left', 'mid-phalanx-t3-left', 'mid-phalanx-t4-left', 'mid-phalanx-t5-left',
  'dist-phalanx-t1-left', 'dist-phalanx-t2-left', 'dist-phalanx-t3-left', 'dist-phalanx-t4-left', 'dist-phalanx-t5-left',
];

// Forearm + hand (right)
const FOREARM_HAND_RIGHT = ['radius-right', 'ulna-right', ...HAND_BONES_RIGHT];
const FOREARM_HAND_LEFT = ['radius-left', 'ulna-left', ...HAND_BONES_LEFT];

// Full arm (right): humerus + forearm + hand
const FULL_ARM_RIGHT = ['humerus-right', ...FOREARM_HAND_RIGHT];
const FULL_ARM_LEFT = ['humerus-left', ...FOREARM_HAND_LEFT];

// Lower leg + foot (right)
const LOWER_LEG_FOOT_RIGHT = ['tibia-right', 'fibula-right', 'patella-right', ...FOOT_BONES_RIGHT];
const LOWER_LEG_FOOT_LEFT = ['tibia-left', 'fibula-left', 'patella-left', ...FOOT_BONES_LEFT];

// Full leg (right): femur + lower leg + foot
const FULL_LEG_RIGHT = ['femur-right', ...LOWER_LEG_FOOT_RIGHT];
const FULL_LEG_LEFT = ['femur-left', ...LOWER_LEG_FOOT_LEFT];

export const JOINT_MOTION_DATA: JointMotion[] = [
  // ══════════════════════════════════════════
  // SHOULDER (glenohumeral joint)
  // Pivot: scapula (glenoid fossa)
  // Moving: entire arm (humerus + forearm + hand)
  // Pivot strategy: use proximal end of humerus (humeral head = joint surface)
  // ══════════════════════════════════════════
  {
    id: 'shoulder-right-flexion',
    jointId: 'shoulder-right',
    nameCn: '前屈/后伸',
    nameEn: 'Flexion / Extension',
    rangeMin: -45,
    rangeMax: 180,
    axis: 'z',  // mediolateral axis - arm swings forward/backward
    movingBones: FULL_ARM_RIGHT,
    pivotBone: 'humerus-right',  // pivot at the TOP of humerus (humeral head)
    visualRange: 15,
  },
  {
    id: 'shoulder-right-abduction',
    jointId: 'shoulder-right',
    nameCn: '外展/内收',
    nameEn: 'Abduction / Adduction',
    rangeMin: 0,
    rangeMax: 180,
    axis: 'x',  // anteroposterior axis - arm lifts sideways
    movingBones: FULL_ARM_RIGHT,
    pivotBone: 'humerus-right',
    visualRange: 15,
  },
  {
    id: 'shoulder-left-flexion',
    jointId: 'shoulder-left',
    nameCn: '前屈/后伸',
    nameEn: 'Flexion / Extension',
    rangeMin: -45,
    rangeMax: 180,
    axis: 'z',
    movingBones: FULL_ARM_LEFT,
    pivotBone: 'humerus-left',
    visualRange: 15,
  },
  {
    id: 'shoulder-left-abduction',
    jointId: 'shoulder-left',
    nameCn: '外展/内收',
    nameEn: 'Abduction / Adduction',
    rangeMin: 0,
    rangeMax: 180,
    axis: 'x',
    movingBones: FULL_ARM_LEFT,
    pivotBone: 'humerus-left',
    visualRange: 15,
  },

  // ══════════════════════════════════════════
  // ELBOW (humeroulnar + humeroradial joints)
  // Pivot: humerus (distal end = elbow joint)
  // Moving: forearm + hand
  // Pivot strategy: use proximal end of radius/ulna (= elbow joint surface)
  // ══════════════════════════════════════════
  {
    id: 'elbow-right-flexion',
    jointId: 'elbow-right',
    nameCn: '屈曲/伸展',
    nameEn: 'Flexion / Extension',
    rangeMin: 0,
    rangeMax: 145,
    axis: 'z',  // mediolateral axis - forearm swings up/down
    movingBones: FOREARM_HAND_RIGHT,
    pivotBone: 'ulna-right',  // pivot at the TOP of ulna (olecranon = elbow joint)
    visualRange: 20,
  },
  {
    id: 'elbow-right-pronation',
    jointId: 'elbow-right',
    nameCn: '旋前/旋后',
    nameEn: 'Pronation / Supination',
    rangeMin: -80,
    rangeMax: 80,
    axis: 'y',  // longitudinal axis - forearm rotates
    movingBones: ['radius-right', ...HAND_BONES_RIGHT],
    pivotBone: 'radius-right',
    visualRange: 15,
  },
  {
    id: 'elbow-left-flexion',
    jointId: 'elbow-left',
    nameCn: '屈曲/伸展',
    nameEn: 'Flexion / Extension',
    rangeMin: 0,
    rangeMax: 145,
    axis: 'z',
    movingBones: FOREARM_HAND_LEFT,
    pivotBone: 'ulna-left',
    visualRange: 20,
  },
  {
    id: 'elbow-left-pronation',
    jointId: 'elbow-left',
    nameCn: '旋前/旋后',
    nameEn: 'Pronation / Supination',
    rangeMin: -80,
    rangeMax: 80,
    axis: 'y',
    movingBones: ['radius-left', ...HAND_BONES_LEFT],
    pivotBone: 'radius-left',
    visualRange: 15,
  },

  // ══════════════════════════════════════════
  // HIP (acetabulofemoral joint)
  // Pivot: hip-bone (acetabulum)
  // Moving: entire leg (femur + lower leg + foot)
  // Pivot strategy: use proximal end of femur (femoral head = joint surface)
  // ══════════════════════════════════════════
  {
    id: 'hip-right-flexion',
    jointId: 'hip-right',
    nameCn: '前屈/后伸',
    nameEn: 'Flexion / Extension',
    rangeMin: -15,
    rangeMax: 125,
    axis: 'z',  // mediolateral axis - thigh swings forward/backward
    movingBones: FULL_LEG_RIGHT,
    pivotBone: 'femur-right',  // pivot at the TOP of femur (femoral head)
    visualRange: 12,
  },
  {
    id: 'hip-right-abduction',
    jointId: 'hip-right',
    nameCn: '外展/内收',
    nameEn: 'Abduction / Adduction',
    rangeMin: -25,
    rangeMax: 45,
    axis: 'x',  // anteroposterior axis - leg lifts sideways
    movingBones: FULL_LEG_RIGHT,
    pivotBone: 'femur-right',
    visualRange: 10,
  },
  {
    id: 'hip-left-flexion',
    jointId: 'hip-left',
    nameCn: '前屈/后伸',
    nameEn: 'Flexion / Extension',
    rangeMin: -15,
    rangeMax: 125,
    axis: 'z',
    movingBones: FULL_LEG_LEFT,
    pivotBone: 'femur-left',
    visualRange: 12,
  },
  {
    id: 'hip-left-abduction',
    jointId: 'hip-left',
    nameCn: '外展/内收',
    nameEn: 'Abduction / Adduction',
    rangeMin: -25,
    rangeMax: 45,
    axis: 'x',
    movingBones: FULL_LEG_LEFT,
    pivotBone: 'femur-left',
    visualRange: 10,
  },

  // ══════════════════════════════════════════
  // KNEE (tibiofemoral joint)
  // Pivot: femur (distal end = knee joint)
  // Moving: lower leg + foot
  // Pivot strategy: use proximal end of tibia (tibial plateau = knee joint surface)
  // ══════════════════════════════════════════
  {
    id: 'knee-right-flexion',
    jointId: 'knee-right',
    nameCn: '屈曲/伸展',
    nameEn: 'Flexion / Extension',
    rangeMin: 0,
    rangeMax: 135,
    axis: 'z',  // mediolateral axis - lower leg swings backward
    movingBones: LOWER_LEG_FOOT_RIGHT,
    pivotBone: 'tibia-right',  // pivot at the TOP of tibia (tibial plateau)
    visualRange: 15,
  },
  {
    id: 'knee-left-flexion',
    jointId: 'knee-left',
    nameCn: '屈曲/伸展',
    nameEn: 'Flexion / Extension',
    rangeMin: 0,
    rangeMax: 135,
    axis: 'z',
    movingBones: LOWER_LEG_FOOT_LEFT,
    pivotBone: 'tibia-left',
    visualRange: 15,
  },
];

export const JOINT_MOTION_MAP: Record<string, JointMotion> = {};
JOINT_MOTION_DATA.forEach((m) => { JOINT_MOTION_MAP[m.id] = m; });
