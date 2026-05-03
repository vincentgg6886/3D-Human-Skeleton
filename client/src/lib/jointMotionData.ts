/*
 * jointMotionData.ts - Anatomically correct joint motion animation data
 * V2.2: Pivot-based rotation with kinematic chains
 * 
 * Key concepts:
 * - pivotBone: the bone that stays fixed (provides the joint pivot point)
 * - pivotEnd: which end of the pivotBone is the joint ('proximal'=top/near-body, 'distal'=bottom/far-from-body)
 * - movingBones: ALL bones that should move (includes kinematic chain downstream)
 * - axis: anatomically correct rotation axis relative to the model coordinate system
 *   Model orientation: Y=up, facing -Z, right side = +X
 *   Flexion/Extension = rotation around Z axis (mediolateral)
 *   Abduction/Adduction = rotation around X axis (anteroposterior) 
 *   Internal/External rotation = rotation around Y axis (longitudinal)
 * - angleRange: [min, max] in degrees for the visual animation sweep
 */

export interface JointMotion {
  id: string;
  jointId: string;       // matches JOINT_PRESETS[].id
  nameCn: string;
  nameEn: string;
  rangeMin: number;      // degrees (clinical ROM)
  rangeMax: number;      // degrees (clinical ROM)
  axis: 'x' | 'y' | 'z';  // rotation axis in world space
  /** All bones that move during this motion (kinematic chain) */
  movingBones: string[];
  /** Bone that provides the pivot point (stays fixed) */
  pivotBone: string;
  /** Which end of pivotBone is the joint point */
  pivotEnd: 'proximal' | 'distal';
  /** Visual animation range in degrees [-max, +max] for smooth oscillation */
  visualRange: number;
}

export const JOINT_MOTION_DATA: JointMotion[] = [
  // ══════════════════════════════════════════
  // SHOULDER (glenohumeral joint)
  // Pivot: scapula (glenoid fossa at its lateral end)
  // Moving: humerus + forearm (radius, ulna)
  // ══════════════════════════════════════════
  {
    id: 'shoulder-right-flexion',
    jointId: 'shoulder-right',
    nameCn: '前屈/后伸',
    nameEn: 'Flexion / Extension',
    rangeMin: -45,
    rangeMax: 180,
    axis: 'z',  // mediolateral axis - arm swings forward/backward
    movingBones: ['humerus-right', 'radius-right', 'ulna-right'],
    pivotBone: 'scapula-right',
    pivotEnd: 'distal',  // glenoid is at the lateral (distal) end of scapula
    visualRange: 30,
  },
  {
    id: 'shoulder-right-abduction',
    jointId: 'shoulder-right',
    nameCn: '外展/内收',
    nameEn: 'Abduction / Adduction',
    rangeMin: 0,
    rangeMax: 180,
    axis: 'x',  // anteroposterior axis - arm lifts sideways
    movingBones: ['humerus-right', 'radius-right', 'ulna-right'],
    pivotBone: 'scapula-right',
    pivotEnd: 'distal',
    visualRange: 30,
  },
  {
    id: 'shoulder-left-flexion',
    jointId: 'shoulder-left',
    nameCn: '前屈/后伸',
    nameEn: 'Flexion / Extension',
    rangeMin: -45,
    rangeMax: 180,
    axis: 'z',
    movingBones: ['humerus-left', 'radius-left', 'ulna-left'],
    pivotBone: 'scapula-left',
    pivotEnd: 'distal',
    visualRange: 30,
  },
  {
    id: 'shoulder-left-abduction',
    jointId: 'shoulder-left',
    nameCn: '外展/内收',
    nameEn: 'Abduction / Adduction',
    rangeMin: 0,
    rangeMax: 180,
    axis: 'x',
    movingBones: ['humerus-left', 'radius-left', 'ulna-left'],
    pivotBone: 'scapula-left',
    pivotEnd: 'distal',
    visualRange: 30,
  },

  // ══════════════════════════════════════════
  // ELBOW (humeroulnar + humeroradial joints)
  // Pivot: humerus (distal end = elbow joint)
  // Moving: radius + ulna
  // ══════════════════════════════════════════
  {
    id: 'elbow-right-flexion',
    jointId: 'elbow-right',
    nameCn: '屈曲/伸展',
    nameEn: 'Flexion / Extension',
    rangeMin: 0,
    rangeMax: 145,
    axis: 'z',  // mediolateral axis - forearm swings up/down
    movingBones: ['radius-right', 'ulna-right'],
    pivotBone: 'humerus-right',
    pivotEnd: 'distal',  // elbow is at the distal end of humerus
    visualRange: 35,
  },
  {
    id: 'elbow-right-pronation',
    jointId: 'elbow-right',
    nameCn: '旋前/旋后',
    nameEn: 'Pronation / Supination',
    rangeMin: -80,
    rangeMax: 80,
    axis: 'y',  // longitudinal axis - forearm rotates
    movingBones: ['radius-right'],
    pivotBone: 'ulna-right',
    pivotEnd: 'proximal',
    visualRange: 20,
  },
  {
    id: 'elbow-left-flexion',
    jointId: 'elbow-left',
    nameCn: '屈曲/伸展',
    nameEn: 'Flexion / Extension',
    rangeMin: 0,
    rangeMax: 145,
    axis: 'z',
    movingBones: ['radius-left', 'ulna-left'],
    pivotBone: 'humerus-left',
    pivotEnd: 'distal',
    visualRange: 35,
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
    pivotEnd: 'proximal',
    visualRange: 20,
  },

  // ══════════════════════════════════════════
  // HIP (acetabulofemoral joint)
  // Pivot: hip-bone (acetabulum at its lateral-inferior aspect)
  // Moving: femur + lower leg (tibia, fibula)
  // ══════════════════════════════════════════
  {
    id: 'hip-right-flexion',
    jointId: 'hip-right',
    nameCn: '前屈/后伸',
    nameEn: 'Flexion / Extension',
    rangeMin: -15,
    rangeMax: 125,
    axis: 'z',  // mediolateral axis - thigh swings forward/backward
    movingBones: ['femur-right', 'tibia-right', 'fibula-right', 'patella-right'],
    pivotBone: 'hip-bone-right',
    pivotEnd: 'distal',  // acetabulum is at the inferior-lateral end
    visualRange: 25,
  },
  {
    id: 'hip-right-abduction',
    jointId: 'hip-right',
    nameCn: '外展/内收',
    nameEn: 'Abduction / Adduction',
    rangeMin: -25,
    rangeMax: 45,
    axis: 'x',  // anteroposterior axis - leg lifts sideways
    movingBones: ['femur-right', 'tibia-right', 'fibula-right', 'patella-right'],
    pivotBone: 'hip-bone-right',
    pivotEnd: 'distal',
    visualRange: 20,
  },
  {
    id: 'hip-left-flexion',
    jointId: 'hip-left',
    nameCn: '前屈/后伸',
    nameEn: 'Flexion / Extension',
    rangeMin: -15,
    rangeMax: 125,
    axis: 'z',
    movingBones: ['femur-left', 'tibia-left', 'fibula-left', 'patella-left'],
    pivotBone: 'hip-bone-left',
    pivotEnd: 'distal',
    visualRange: 25,
  },
  {
    id: 'hip-left-abduction',
    jointId: 'hip-left',
    nameCn: '外展/内收',
    nameEn: 'Abduction / Adduction',
    rangeMin: -25,
    rangeMax: 45,
    axis: 'x',
    movingBones: ['femur-left', 'tibia-left', 'fibula-left', 'patella-left'],
    pivotBone: 'hip-bone-left',
    pivotEnd: 'distal',
    visualRange: 20,
  },

  // ══════════════════════════════════════════
  // KNEE (tibiofemoral joint)
  // Pivot: femur (distal end = knee joint)
  // Moving: tibia + fibula
  // ══════════════════════════════════════════
  {
    id: 'knee-right-flexion',
    jointId: 'knee-right',
    nameCn: '屈曲/伸展',
    nameEn: 'Flexion / Extension',
    rangeMin: 0,
    rangeMax: 135,
    axis: 'z',  // mediolateral axis - lower leg swings backward
    movingBones: ['tibia-right', 'fibula-right', 'patella-right'],
    pivotBone: 'femur-right',
    pivotEnd: 'distal',  // knee is at the distal end of femur
    visualRange: 30,
  },
  {
    id: 'knee-left-flexion',
    jointId: 'knee-left',
    nameCn: '屈曲/伸展',
    nameEn: 'Flexion / Extension',
    rangeMin: 0,
    rangeMax: 135,
    axis: 'z',
    movingBones: ['tibia-left', 'fibula-left', 'patella-left'],
    pivotBone: 'femur-left',
    pivotEnd: 'distal',
    visualRange: 30,
  },
];

export const JOINT_MOTION_MAP: Record<string, JointMotion> = {};
JOINT_MOTION_DATA.forEach((m) => { JOINT_MOTION_MAP[m.id] = m; });
