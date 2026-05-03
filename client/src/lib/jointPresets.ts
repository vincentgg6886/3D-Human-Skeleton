/*
 * jointPresets.ts - Joint view presets for orthopedic clinical focus
 * 8 major joints with camera positions, related bones, and descriptions
 */

import type { JointPreset } from './store';

export const JOINT_PRESETS: JointPreset[] = [
  {
    id: 'shoulder-right',
    nameCn: '右肩关节',
    nameEn: 'Right Shoulder',
    bones: ['scapula-right', 'clavicle-right', 'humerus-right'],
    cameraPosition: [4, 6.5, 4],
    cameraTarget: [2, 6, 0],
    description: '肩关节由肱骨头与肩胛骨关节盂构成，是人体活动度最大的关节。锁骨参与肩锁关节和胸锁关节。',
  },
  {
    id: 'shoulder-left',
    nameCn: '左肩关节',
    nameEn: 'Left Shoulder',
    bones: ['scapula-left', 'clavicle-left', 'humerus-left'],
    cameraPosition: [-4, 6.5, 4],
    cameraTarget: [-2, 6, 0],
    description: '肩关节由肱骨头与肩胛骨关节盂构成，是人体活动度最大的关节。锁骨参与肩锁关节和胸锁关节。',
  },
  {
    id: 'elbow-right',
    nameCn: '右肘关节',
    nameEn: 'Right Elbow',
    bones: ['humerus-right', 'radius-right', 'ulna-right'],
    cameraPosition: [5, 4.5, 3],
    cameraTarget: [3, 4, 0],
    description: '肘关节由肱尺关节、肱桡关节和近端桡尺关节三个关节组成，是典型的复合关节。',
  },
  {
    id: 'elbow-left',
    nameCn: '左肘关节',
    nameEn: 'Left Elbow',
    bones: ['humerus-left', 'radius-left', 'ulna-left'],
    cameraPosition: [-5, 4.5, 3],
    cameraTarget: [-3, 4, 0],
    description: '肘关节由肱尺关节、肱桡关节和近端桡尺关节三个关节组成，是典型的复合关节。',
  },
  {
    id: 'hip-right',
    nameCn: '右髋关节',
    nameEn: 'Right Hip',
    bones: ['ilium-right', 'femur-right'],
    cameraPosition: [4, 3.5, 4],
    cameraTarget: [1.5, 3.2, 0],
    description: '髋关节由股骨头与髋臼构成的球窝关节，承载体重并传递力量。是人体最大、最稳定的关节。',
  },
  {
    id: 'hip-left',
    nameCn: '左髋关节',
    nameEn: 'Left Hip',
    bones: ['ilium-left', 'femur-left'],
    cameraPosition: [-4, 3.5, 4],
    cameraTarget: [-1.5, 3.2, 0],
    description: '髋关节由股骨头与髋臼构成的球窝关节，承载体重并传递力量。是人体最大、最稳定的关节。',
  },
  {
    id: 'knee-right',
    nameCn: '右膝关节',
    nameEn: 'Right Knee',
    bones: ['femur-right', 'tibia-right', 'patella-right', 'fibula-right'],
    cameraPosition: [3, 2, 4],
    cameraTarget: [1, 1.8, 0],
    description: '膝关节是人体最大最复杂的关节，由股骨下端、胫骨上端和髌骨构成。含前后交叉韧带和内外侧半月板。',
  },
  {
    id: 'knee-left',
    nameCn: '左膝关节',
    nameEn: 'Left Knee',
    bones: ['femur-left', 'tibia-left', 'patella-left', 'fibula-left'],
    cameraPosition: [-3, 2, 4],
    cameraTarget: [-1, 1.8, 0],
    description: '膝关节是人体最大最复杂的关节，由股骨下端、胫骨上端和髌骨构成。含前后交叉韧带和内外侧半月板。',
  },
];

export const JOINT_PRESET_MAP: Record<string, JointPreset> = {};
JOINT_PRESETS.forEach((p) => { JOINT_PRESET_MAP[p.id] = p; });
