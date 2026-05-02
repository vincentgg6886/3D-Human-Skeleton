import type { BoneInfo, RegionInfo } from './store';

// ============================================================
// 骨骼3D几何定义 - 每块骨骼的位置、尺寸、形状参数
// ============================================================

export interface BoneGeometry {
  id: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  shape: 'capsule' | 'box' | 'sphere' | 'cylinder' | 'custom';
  dimensions: number[]; // shape-specific: capsule=[radius,length], box=[w,h,d], sphere=[r], cylinder=[rTop,rBot,h]
  region: string;
  color?: string;
}

// Y-axis is up. Units are approximate cm scaled to scene units (1 unit ≈ 10cm)

export const BONE_GEOMETRIES: BoneGeometry[] = [
  // ==================== SKULL ====================
  { id: 'cranium', position: [0, 8.2, 0], shape: 'sphere', dimensions: [0.55], region: 'skull' },
  { id: 'mandible', position: [0, 7.35, 0.15], shape: 'box', dimensions: [0.45, 0.18, 0.35], region: 'skull' },

  // ==================== SPINE ====================
  // Cervical (C1-C7)
  { id: 'cervical-vertebrae', position: [0, 7.0, -0.05], shape: 'cylinder', dimensions: [0.12, 0.14, 0.7], region: 'spine' },
  // Thoracic (T1-T12)
  { id: 'thoracic-vertebrae', position: [0, 5.6, -0.1], shape: 'cylinder', dimensions: [0.16, 0.18, 1.8], region: 'spine' },
  // Lumbar (L1-L5)
  { id: 'lumbar-vertebrae', position: [0, 4.1, -0.05], shape: 'cylinder', dimensions: [0.2, 0.22, 0.8], region: 'spine' },
  // Sacrum
  { id: 'sacrum', position: [0, 3.4, -0.1], shape: 'box', dimensions: [0.35, 0.45, 0.2], region: 'spine' },
  // Coccyx
  { id: 'coccyx', position: [0, 3.0, -0.08], shape: 'capsule', dimensions: [0.06, 0.2], region: 'spine' },

  // ==================== THORAX ====================
  // Sternum
  { id: 'sternum', position: [0, 5.8, 0.35], shape: 'box', dimensions: [0.15, 1.0, 0.08], region: 'thorax' },
  // Ribs (simplified as curved boxes, left and right)
  { id: 'ribs-left', position: [-0.45, 5.6, 0.15], shape: 'box', dimensions: [0.55, 1.5, 0.35], region: 'thorax', rotation: [0, 0, 0.15] },
  { id: 'ribs-right', position: [0.45, 5.6, 0.15], shape: 'box', dimensions: [0.55, 1.5, 0.35], region: 'thorax', rotation: [0, 0, -0.15] },

  // ==================== UPPER LIMB LEFT ====================
  // Clavicle
  { id: 'clavicle-left', position: [-0.45, 6.55, 0.2], shape: 'capsule', dimensions: [0.05, 0.55], region: 'upper-limb-left', rotation: [0, 0, -0.3] },
  // Scapula
  { id: 'scapula-left', position: [-0.55, 6.1, -0.2], shape: 'box', dimensions: [0.35, 0.55, 0.06], region: 'upper-limb-left' },
  // Humerus
  { id: 'humerus-left', position: [-0.95, 5.35, 0], shape: 'capsule', dimensions: [0.08, 1.5], region: 'upper-limb-left' },
  // Radius
  { id: 'radius-left', position: [-0.9, 4.05, 0.05], shape: 'capsule', dimensions: [0.05, 1.2], region: 'upper-limb-left' },
  // Ulna
  { id: 'ulna-left', position: [-1.0, 4.05, -0.05], shape: 'capsule', dimensions: [0.05, 1.25], region: 'upper-limb-left' },
  // Hand
  { id: 'hand-left', position: [-0.95, 3.1, 0.02], shape: 'box', dimensions: [0.22, 0.4, 0.08], region: 'upper-limb-left' },

  // ==================== UPPER LIMB RIGHT ====================
  { id: 'clavicle-right', position: [0.45, 6.55, 0.2], shape: 'capsule', dimensions: [0.05, 0.55], region: 'upper-limb-right', rotation: [0, 0, 0.3] },
  { id: 'scapula-right', position: [0.55, 6.1, -0.2], shape: 'box', dimensions: [0.35, 0.55, 0.06], region: 'upper-limb-right' },
  { id: 'humerus-right', position: [0.95, 5.35, 0], shape: 'capsule', dimensions: [0.08, 1.5], region: 'upper-limb-right' },
  { id: 'radius-right', position: [0.9, 4.05, 0.05], shape: 'capsule', dimensions: [0.05, 1.2], region: 'upper-limb-right' },
  { id: 'ulna-right', position: [1.0, 4.05, -0.05], shape: 'capsule', dimensions: [0.05, 1.25], region: 'upper-limb-right' },
  { id: 'hand-right', position: [0.95, 3.1, 0.02], shape: 'box', dimensions: [0.22, 0.4, 0.08], region: 'upper-limb-right' },

  // ==================== PELVIS ====================
  { id: 'ilium-left', position: [-0.35, 3.55, 0], shape: 'box', dimensions: [0.4, 0.5, 0.25], region: 'pelvis' },
  { id: 'ilium-right', position: [0.35, 3.55, 0], shape: 'box', dimensions: [0.4, 0.5, 0.25], region: 'pelvis' },

  // ==================== LOWER LIMB LEFT ====================
  // Femur
  { id: 'femur-left', position: [-0.35, 2.35, 0], shape: 'capsule', dimensions: [0.09, 2.0], region: 'lower-limb-left' },
  // Patella
  { id: 'patella-left', position: [-0.35, 1.35, 0.18], shape: 'sphere', dimensions: [0.08], region: 'lower-limb-left' },
  // Tibia
  { id: 'tibia-left', position: [-0.33, 0.55, 0.02], shape: 'capsule', dimensions: [0.07, 1.7], region: 'lower-limb-left' },
  // Fibula
  { id: 'fibula-left', position: [-0.45, 0.55, -0.02], shape: 'capsule', dimensions: [0.035, 1.65], region: 'lower-limb-left' },
  // Foot
  { id: 'foot-left', position: [-0.35, -0.45, 0.12], shape: 'box', dimensions: [0.2, 0.12, 0.45], region: 'lower-limb-left' },

  // ==================== LOWER LIMB RIGHT ====================
  { id: 'femur-right', position: [0.35, 2.35, 0], shape: 'capsule', dimensions: [0.09, 2.0], region: 'lower-limb-right' },
  { id: 'patella-right', position: [0.35, 1.35, 0.18], shape: 'sphere', dimensions: [0.08], region: 'lower-limb-right' },
  { id: 'tibia-right', position: [0.33, 0.55, 0.02], shape: 'capsule', dimensions: [0.07, 1.7], region: 'lower-limb-right' },
  { id: 'fibula-right', position: [0.45, 0.55, -0.02], shape: 'capsule', dimensions: [0.035, 1.65], region: 'lower-limb-right' },
  { id: 'foot-right', position: [0.35, -0.45, 0.12], shape: 'box', dimensions: [0.2, 0.12, 0.45], region: 'lower-limb-right' },
];

// ============================================================
// 骨骼医学信息数据库
// ============================================================

export const BONE_INFO: Record<string, BoneInfo> = {
  'cranium': {
    id: 'cranium', name: 'Cranium', nameCn: '颅骨',
    region: 'skull', regionCn: '颅骨', subRegion: 'neurocranium', subRegionCn: '脑颅',
    description: 'The cranium is the skeletal structure of the head that supports the face and protects the brain. It consists of 8 bones: frontal, 2 parietal, 2 temporal, occipital, sphenoid, and ethmoid.',
    descriptionCn: '颅骨是头部的骨骼结构，支撑面部并保护大脑。由8块骨骼组成：额骨、2块顶骨、2块颞骨、枕骨、蝶骨和筛骨。',
    joints: ['颞下颌关节 (TMJ)'],
  },
  'mandible': {
    id: 'mandible', name: 'Mandible', nameCn: '下颌骨',
    region: 'skull', regionCn: '颅骨', subRegion: 'viscerocranium', subRegionCn: '面颅',
    description: 'The mandible is the largest and strongest bone of the face. It forms the lower jaw and holds the lower teeth in place.',
    descriptionCn: '下颌骨是面部最大、最坚固的骨骼。它构成下颌并固定下排牙齿。',
    joints: ['颞下颌关节 (TMJ)'],
    romData: [
      { movement: '张口 (Opening)', range: '35-45mm' },
      { movement: '前伸 (Protrusion)', range: '6-9mm' },
      { movement: '侧方运动 (Lateral)', range: '10-12mm' },
    ],
  },
  'cervical-vertebrae': {
    id: 'cervical-vertebrae', name: 'Cervical Vertebrae (C1-C7)', nameCn: '颈椎 (C1-C7)',
    region: 'spine', regionCn: '脊柱', subRegion: 'cervical', subRegionCn: '颈段',
    description: 'The 7 cervical vertebrae form the neck region of the spine. C1 (atlas) supports the skull, C2 (axis) allows rotation. They protect the spinal cord and support the head.',
    descriptionCn: '7块颈椎构成脊柱的颈段。C1（寰椎）支撑颅骨，C2（枢椎）允许旋转。它们保护脊髓并支撑头部。',
    joints: ['寰枕关节', '寰枢关节', '椎间关节'],
    romData: [
      { movement: '前屈 (Flexion)', range: '45-50°' },
      { movement: '后伸 (Extension)', range: '45-55°' },
      { movement: '侧屈 (Lateral Flexion)', range: '40-45°' },
      { movement: '旋转 (Rotation)', range: '60-80°' },
    ],
  },
  'thoracic-vertebrae': {
    id: 'thoracic-vertebrae', name: 'Thoracic Vertebrae (T1-T12)', nameCn: '胸椎 (T1-T12)',
    region: 'spine', regionCn: '脊柱', subRegion: 'thoracic', subRegionCn: '胸段',
    description: 'The 12 thoracic vertebrae connect with the ribs. They form the posterior part of the thoracic cage and have limited mobility due to rib attachments.',
    descriptionCn: '12块胸椎与肋骨相连。它们构成胸廓后壁，因肋骨附着而活动度有限。',
    joints: ['肋椎关节', '椎间关节'],
    romData: [
      { movement: '前屈 (Flexion)', range: '30-40°' },
      { movement: '后伸 (Extension)', range: '20-25°' },
      { movement: '侧屈 (Lateral Flexion)', range: '25-30°' },
      { movement: '旋转 (Rotation)', range: '30-35°' },
    ],
  },
  'lumbar-vertebrae': {
    id: 'lumbar-vertebrae', name: 'Lumbar Vertebrae (L1-L5)', nameCn: '腰椎 (L1-L5)',
    region: 'spine', regionCn: '脊柱', subRegion: 'lumbar', subRegionCn: '腰段',
    description: 'The 5 lumbar vertebrae are the largest of the movable vertebrae. They bear the most body weight and are a common site of back pain and disc herniation.',
    descriptionCn: '5块腰椎是可动椎骨中最大的。它们承受最多体重，是腰痛和椎间盘突出的常见部位。',
    joints: ['椎间关节', '腰骶关节'],
    romData: [
      { movement: '前屈 (Flexion)', range: '40-60°' },
      { movement: '后伸 (Extension)', range: '20-35°' },
      { movement: '侧屈 (Lateral Flexion)', range: '15-20°' },
      { movement: '旋转 (Rotation)', range: '5-7°' },
    ],
  },
  'sacrum': {
    id: 'sacrum', name: 'Sacrum', nameCn: '骶骨',
    region: 'spine', regionCn: '脊柱', subRegion: 'sacral', subRegionCn: '骶段',
    description: 'The sacrum is a triangular bone formed by the fusion of 5 sacral vertebrae. It connects the spine to the pelvis through the sacroiliac joints.',
    descriptionCn: '骶骨是由5块骶椎融合而成的三角形骨骼。它通过骶髂关节将脊柱与骨盆连接。',
    joints: ['骶髂关节', '腰骶关节'],
  },
  'coccyx': {
    id: 'coccyx', name: 'Coccyx', nameCn: '尾骨',
    region: 'spine', regionCn: '脊柱', subRegion: 'coccygeal', subRegionCn: '尾段',
    description: 'The coccyx (tailbone) is formed by 3-5 fused vertebrae. It serves as an attachment point for ligaments and muscles of the pelvic floor.',
    descriptionCn: '尾骨由3-5块融合的椎骨组成。它是骨盆底韧带和肌肉的附着点。',
    joints: ['骶尾关节'],
  },
  'sternum': {
    id: 'sternum', name: 'Sternum', nameCn: '胸骨',
    region: 'thorax', regionCn: '胸廓', subRegion: 'sternum', subRegionCn: '胸骨',
    description: 'The sternum (breastbone) is a flat bone in the center of the chest. It consists of the manubrium, body, and xiphoid process, connecting to the ribs via costal cartilages.',
    descriptionCn: '胸骨是位于胸部中央的扁骨。由柄、体和剑突组成，通过肋软骨与肋骨相连。',
    joints: ['胸锁关节', '胸肋关节'],
  },
  'ribs-left': {
    id: 'ribs-left', name: 'Ribs (Left)', nameCn: '肋骨（左侧）',
    region: 'thorax', regionCn: '胸廓', subRegion: 'ribs', subRegionCn: '肋骨',
    description: 'The left 12 ribs form the lateral wall of the thoracic cage. Ribs 1-7 are true ribs (attached to sternum), 8-10 are false ribs, and 11-12 are floating ribs.',
    descriptionCn: '左侧12根肋骨构成胸廓侧壁。第1-7肋为真肋（连接胸骨），第8-10肋为假肋，第11-12肋为浮肋。',
    joints: ['肋椎关节', '胸肋关节'],
  },
  'ribs-right': {
    id: 'ribs-right', name: 'Ribs (Right)', nameCn: '肋骨（右侧）',
    region: 'thorax', regionCn: '胸廓', subRegion: 'ribs', subRegionCn: '肋骨',
    description: 'The right 12 ribs mirror the left side. Together they protect the heart, lungs, and major vessels.',
    descriptionCn: '右侧12根肋骨与左侧对称。它们共同保护心脏、肺和大血管。',
    joints: ['肋椎关节', '胸肋关节'],
  },
  // Upper limb - Left
  'clavicle-left': {
    id: 'clavicle-left', name: 'Clavicle (Left)', nameCn: '锁骨（左）',
    region: 'upper-limb-left', regionCn: '左上肢', subRegion: 'shoulder-girdle', subRegionCn: '肩带',
    description: 'The clavicle (collarbone) connects the arm to the trunk. It is the most commonly fractured bone in the body.',
    descriptionCn: '锁骨连接上肢与躯干。它是人体最常发生骨折的骨骼。',
    joints: ['胸锁关节', '肩锁关节'],
  },
  'scapula-left': {
    id: 'scapula-left', name: 'Scapula (Left)', nameCn: '肩胛骨（左）',
    region: 'upper-limb-left', regionCn: '左上肢', subRegion: 'shoulder-girdle', subRegionCn: '肩带',
    description: 'The scapula (shoulder blade) is a flat triangular bone on the posterior thorax. It provides attachment for 17 muscles.',
    descriptionCn: '肩胛骨是位于胸廓后方的扁三角形骨骼。它为17块肌肉提供附着点。',
    joints: ['肩锁关节', '盂肱关节'],
  },
  'humerus-left': {
    id: 'humerus-left', name: 'Humerus (Left)', nameCn: '肱骨（左）',
    region: 'upper-limb-left', regionCn: '左上肢', subRegion: 'arm', subRegionCn: '上臂',
    description: 'The humerus is the single bone of the upper arm. Its proximal end forms the shoulder joint, and the distal end forms part of the elbow joint.',
    descriptionCn: '肱骨是上臂的唯一骨骼。近端构成肩关节，远端构成肘关节的一部分。',
    joints: ['盂肱关节（肩关节）', '肘关节'],
    romData: [
      { movement: '肩前屈 (Flexion)', range: '150-170°' },
      { movement: '肩后伸 (Extension)', range: '40-45°' },
      { movement: '肩外展 (Abduction)', range: '150-180°' },
      { movement: '肩内收 (Adduction)', range: '30-45°' },
      { movement: '肩外旋 (External Rotation)', range: '80-90°' },
      { movement: '肩内旋 (Internal Rotation)', range: '60-100°' },
    ],
  },
  'radius-left': {
    id: 'radius-left', name: 'Radius (Left)', nameCn: '桡骨（左）',
    region: 'upper-limb-left', regionCn: '左上肢', subRegion: 'forearm', subRegionCn: '前臂',
    description: 'The radius is the lateral bone of the forearm. Its distal end forms the main articulation with the carpal bones at the wrist.',
    descriptionCn: '桡骨是前臂外侧骨骼。其远端与腕骨构成腕关节的主要关节面。',
    joints: ['肘关节', '桡尺近侧关节', '桡尺远侧关节', '腕关节'],
    romData: [
      { movement: '肘屈曲 (Flexion)', range: '140-150°' },
      { movement: '前臂旋前 (Pronation)', range: '75-85°' },
      { movement: '前臂旋后 (Supination)', range: '80-90°' },
    ],
  },
  'ulna-left': {
    id: 'ulna-left', name: 'Ulna (Left)', nameCn: '尺骨（左）',
    region: 'upper-limb-left', regionCn: '左上肢', subRegion: 'forearm', subRegionCn: '前臂',
    description: 'The ulna is the medial bone of the forearm. Its proximal end forms the olecranon (elbow tip) and the main hinge of the elbow joint.',
    descriptionCn: '尺骨是前臂内侧骨骼。其近端形成鹰嘴（肘尖），构成肘关节的主要铰链。',
    joints: ['肘关节', '桡尺近侧关节', '桡尺远侧关节'],
  },
  'hand-left': {
    id: 'hand-left', name: 'Hand Bones (Left)', nameCn: '手骨（左）',
    region: 'upper-limb-left', regionCn: '左上肢', subRegion: 'hand', subRegionCn: '手部',
    description: 'The hand contains 27 bones: 8 carpals, 5 metacarpals, and 14 phalanges. The intricate arrangement allows for fine motor skills.',
    descriptionCn: '手部包含27块骨骼：8块腕骨、5块掌骨和14块指骨。精密的排列使精细运动成为可能。',
    joints: ['腕关节', '腕掌关节', '掌指关节', '指间关节'],
    romData: [
      { movement: '腕屈曲 (Wrist Flexion)', range: '60-80°' },
      { movement: '腕伸展 (Wrist Extension)', range: '60-70°' },
      { movement: '腕桡偏 (Radial Deviation)', range: '15-25°' },
      { movement: '腕尺偏 (Ulnar Deviation)', range: '30-45°' },
    ],
  },
  // Upper limb - Right (mirror)
  'clavicle-right': {
    id: 'clavicle-right', name: 'Clavicle (Right)', nameCn: '锁骨（右）',
    region: 'upper-limb-right', regionCn: '右上肢', subRegion: 'shoulder-girdle', subRegionCn: '肩带',
    description: 'The right clavicle mirrors the left. It acts as a strut to keep the arm away from the trunk.',
    descriptionCn: '右锁骨与左侧对称。它起支撑作用，使上肢远离躯干。',
    joints: ['胸锁关节', '肩锁关节'],
  },
  'scapula-right': {
    id: 'scapula-right', name: 'Scapula (Right)', nameCn: '肩胛骨（右）',
    region: 'upper-limb-right', regionCn: '右上肢', subRegion: 'shoulder-girdle', subRegionCn: '肩带',
    description: 'The right scapula mirrors the left. Key landmarks include the spine, acromion, coracoid process, and glenoid cavity.',
    descriptionCn: '右肩胛骨与左侧对称。关键标志包括肩胛冈、肩峰、喙突和关节盂。',
    joints: ['肩锁关节', '盂肱关节'],
  },
  'humerus-right': {
    id: 'humerus-right', name: 'Humerus (Right)', nameCn: '肱骨（右）',
    region: 'upper-limb-right', regionCn: '右上肢', subRegion: 'arm', subRegionCn: '上臂',
    description: 'The right humerus mirrors the left. Common pathologies include proximal fractures (especially in elderly) and supracondylar fractures (in children).',
    descriptionCn: '右肱骨与左侧对称。常见病理包括近端骨折（尤其老年人）和髁上骨折（儿童）。',
    joints: ['盂肱关节（肩关节）', '肘关节'],
    romData: [
      { movement: '肩前屈 (Flexion)', range: '150-170°' },
      { movement: '肩后伸 (Extension)', range: '40-45°' },
      { movement: '肩外展 (Abduction)', range: '150-180°' },
      { movement: '肩内收 (Adduction)', range: '30-45°' },
    ],
  },
  'radius-right': {
    id: 'radius-right', name: 'Radius (Right)', nameCn: '桡骨（右）',
    region: 'upper-limb-right', regionCn: '右上肢', subRegion: 'forearm', subRegionCn: '前臂',
    description: 'The right radius mirrors the left. Distal radius fractures (Colles fracture) are among the most common fractures.',
    descriptionCn: '右桡骨与左侧对称。桡骨远端骨折（Colles骨折）是最常见的骨折之一。',
    joints: ['肘关节', '桡尺近侧关节', '桡尺远侧关节', '腕关节'],
  },
  'ulna-right': {
    id: 'ulna-right', name: 'Ulna (Right)', nameCn: '尺骨（右）',
    region: 'upper-limb-right', regionCn: '右上肢', subRegion: 'forearm', subRegionCn: '前臂',
    description: 'The right ulna mirrors the left. The olecranon is vulnerable to fracture from direct impact.',
    descriptionCn: '右尺骨与左侧对称。鹰嘴易因直接撞击而骨折。',
    joints: ['肘关节', '桡尺近侧关节', '桡尺远侧关节'],
  },
  'hand-right': {
    id: 'hand-right', name: 'Hand Bones (Right)', nameCn: '手骨（右）',
    region: 'upper-limb-right', regionCn: '右上肢', subRegion: 'hand', subRegionCn: '手部',
    description: 'The right hand mirrors the left with 27 bones. Scaphoid fractures are common and often missed on initial X-rays.',
    descriptionCn: '右手与左侧对称，包含27块骨骼。舟骨骨折常见且初次X线检查常被漏诊。',
    joints: ['腕关节', '腕掌关节', '掌指关节', '指间关节'],
  },
  // Pelvis
  'ilium-left': {
    id: 'ilium-left', name: 'Hip Bone (Left)', nameCn: '髋骨（左）',
    region: 'pelvis', regionCn: '骨盆', subRegion: 'os-coxae', subRegionCn: '髋骨',
    description: 'The hip bone (os coxae) is formed by fusion of ilium, ischium, and pubis. The acetabulum forms the socket of the hip joint.',
    descriptionCn: '髋骨由髂骨、坐骨和耻骨融合而成。髋臼构成髋关节的关节窝。',
    joints: ['骶髂关节', '髋关节', '耻骨联合'],
    romData: [
      { movement: '髋屈曲 (Flexion)', range: '110-130°' },
      { movement: '髋伸展 (Extension)', range: '10-30°' },
      { movement: '髋外展 (Abduction)', range: '30-50°' },
      { movement: '髋内收 (Adduction)', range: '20-30°' },
      { movement: '髋外旋 (External Rotation)', range: '40-60°' },
      { movement: '髋内旋 (Internal Rotation)', range: '30-40°' },
    ],
  },
  'ilium-right': {
    id: 'ilium-right', name: 'Hip Bone (Right)', nameCn: '髋骨（右）',
    region: 'pelvis', regionCn: '骨盆', subRegion: 'os-coxae', subRegionCn: '髋骨',
    description: 'The right hip bone mirrors the left. Together they form the pelvic girdle, transmitting body weight to the lower limbs.',
    descriptionCn: '右髋骨与左侧对称。两侧髋骨共同构成骨盆带，将体重传递至下肢。',
    joints: ['骶髂关节', '髋关节', '耻骨联合'],
  },
  // Lower limb - Left
  'femur-left': {
    id: 'femur-left', name: 'Femur (Left)', nameCn: '股骨（左）',
    region: 'lower-limb-left', regionCn: '左下肢', subRegion: 'thigh', subRegionCn: '大腿',
    description: 'The femur is the longest and strongest bone in the body. The femoral neck is a common site of fracture in osteoporotic patients.',
    descriptionCn: '股骨是人体最长、最坚固的骨骼。股骨颈是骨质疏松患者骨折的常见部位。',
    joints: ['髋关节', '膝关节'],
    romData: [
      { movement: '膝屈曲 (Knee Flexion)', range: '130-150°' },
      { movement: '膝伸展 (Knee Extension)', range: '0-10°' },
    ],
  },
  'patella-left': {
    id: 'patella-left', name: 'Patella (Left)', nameCn: '髌骨（左）',
    region: 'lower-limb-left', regionCn: '左下肢', subRegion: 'knee', subRegionCn: '膝部',
    description: 'The patella (kneecap) is the largest sesamoid bone. It protects the knee joint and improves the leverage of the quadriceps tendon.',
    descriptionCn: '髌骨是最大的籽骨。它保护膝关节并增强股四头肌腱的杠杆作用。',
    joints: ['髌股关节'],
  },
  'tibia-left': {
    id: 'tibia-left', name: 'Tibia (Left)', nameCn: '胫骨（左）',
    region: 'lower-limb-left', regionCn: '左下肢', subRegion: 'leg', subRegionCn: '小腿',
    description: 'The tibia (shinbone) is the larger medial bone of the leg. It bears most of the body weight transmitted from the femur.',
    descriptionCn: '胫骨是小腿内侧较大的骨骼。它承受从股骨传递的大部分体重。',
    joints: ['膝关节', '踝关节', '胫腓近侧关节'],
  },
  'fibula-left': {
    id: 'fibula-left', name: 'Fibula (Left)', nameCn: '腓骨（左）',
    region: 'lower-limb-left', regionCn: '左下肢', subRegion: 'leg', subRegionCn: '小腿',
    description: 'The fibula is the slender lateral bone of the leg. It mainly serves as a muscle attachment site and forms the lateral malleolus of the ankle.',
    descriptionCn: '腓骨是小腿外侧的细长骨骼。主要作为肌肉附着点，并构成踝关节的外踝。',
    joints: ['胫腓近侧关节', '胫腓远侧关节', '踝关节'],
  },
  'foot-left': {
    id: 'foot-left', name: 'Foot Bones (Left)', nameCn: '足骨（左）',
    region: 'lower-limb-left', regionCn: '左下肢', subRegion: 'foot', subRegionCn: '足部',
    description: 'The foot contains 26 bones: 7 tarsals, 5 metatarsals, and 14 phalanges. The arches of the foot distribute body weight during standing and walking.',
    descriptionCn: '足部包含26块骨骼：7块跗骨、5块跖骨和14块趾骨。足弓在站立和行走时分散体重。',
    joints: ['踝关节', '跗骨间关节', '跖趾关节'],
    romData: [
      { movement: '踝背屈 (Dorsiflexion)', range: '15-20°' },
      { movement: '踝跖屈 (Plantarflexion)', range: '40-55°' },
      { movement: '足内翻 (Inversion)', range: '20-35°' },
      { movement: '足外翻 (Eversion)', range: '10-25°' },
    ],
  },
  // Lower limb - Right
  'femur-right': {
    id: 'femur-right', name: 'Femur (Right)', nameCn: '股骨（右）',
    region: 'lower-limb-right', regionCn: '右下肢', subRegion: 'thigh', subRegionCn: '大腿',
    description: 'The right femur mirrors the left. Femoral shaft fractures typically result from high-energy trauma.',
    descriptionCn: '右股骨与左侧对称。股骨干骨折通常由高能量创伤引起。',
    joints: ['髋关节', '膝关节'],
  },
  'patella-right': {
    id: 'patella-right', name: 'Patella (Right)', nameCn: '髌骨（右）',
    region: 'lower-limb-right', regionCn: '右下肢', subRegion: 'knee', subRegionCn: '膝部',
    description: 'The right patella mirrors the left. Patellar fractures and dislocations are common knee injuries.',
    descriptionCn: '右髌骨与左侧对称。髌骨骨折和脱位是常见的膝关节损伤。',
    joints: ['髌股关节'],
  },
  'tibia-right': {
    id: 'tibia-right', name: 'Tibia (Right)', nameCn: '胫骨（右）',
    region: 'lower-limb-right', regionCn: '右下肢', subRegion: 'leg', subRegionCn: '小腿',
    description: 'The right tibia mirrors the left. Tibial plateau fractures are important injuries affecting knee alignment.',
    descriptionCn: '右胫骨与左侧对称。胫骨平台骨折是影响膝关节对线的重要损伤。',
    joints: ['膝关节', '踝关节', '胫腓近侧关节'],
  },
  'fibula-right': {
    id: 'fibula-right', name: 'Fibula (Right)', nameCn: '腓骨（右）',
    region: 'lower-limb-right', regionCn: '右下肢', subRegion: 'leg', subRegionCn: '小腿',
    description: 'The right fibula mirrors the left. Lateral malleolus fractures are among the most common ankle fractures.',
    descriptionCn: '右腓骨与左侧对称。外踝骨折是最常见的踝关节骨折之一。',
    joints: ['胫腓近侧关节', '胫腓远侧关节', '踝关节'],
  },
  'foot-right': {
    id: 'foot-right', name: 'Foot Bones (Right)', nameCn: '足骨（右）',
    region: 'lower-limb-right', regionCn: '右下肢', subRegion: 'foot', subRegionCn: '足部',
    description: 'The right foot mirrors the left with 26 bones. Calcaneal fractures often result from falls from height.',
    descriptionCn: '右足与左侧对称，包含26块骨骼。跟骨骨折常因高处坠落引起。',
    joints: ['踝关节', '跗骨间关节', '跖趾关节'],
  },
};

// ============================================================
// 区域分组定义
// ============================================================

export const REGIONS: RegionInfo[] = [
  {
    id: 'skull', name: 'Skull', nameCn: '颅骨',
    bones: ['cranium', 'mandible'],
    subRegions: [
      { id: 'neurocranium', name: 'Neurocranium', nameCn: '脑颅', bones: ['cranium'] },
      { id: 'viscerocranium', name: 'Viscerocranium', nameCn: '面颅', bones: ['mandible'] },
    ],
  },
  {
    id: 'spine', name: 'Vertebral Column', nameCn: '脊柱',
    bones: ['cervical-vertebrae', 'thoracic-vertebrae', 'lumbar-vertebrae', 'sacrum', 'coccyx'],
    subRegions: [
      { id: 'cervical', name: 'Cervical', nameCn: '颈段', bones: ['cervical-vertebrae'] },
      { id: 'thoracic-spine', name: 'Thoracic', nameCn: '胸段', bones: ['thoracic-vertebrae'] },
      { id: 'lumbar', name: 'Lumbar', nameCn: '腰段', bones: ['lumbar-vertebrae'] },
      { id: 'sacral', name: 'Sacral', nameCn: '骶尾段', bones: ['sacrum', 'coccyx'] },
    ],
  },
  {
    id: 'thorax', name: 'Thorax', nameCn: '胸廓',
    bones: ['sternum', 'ribs-left', 'ribs-right'],
    subRegions: [
      { id: 'sternum-region', name: 'Sternum', nameCn: '胸骨', bones: ['sternum'] },
      { id: 'ribs-region', name: 'Ribs', nameCn: '肋骨', bones: ['ribs-left', 'ribs-right'] },
    ],
  },
  {
    id: 'upper-limb-left', name: 'Upper Limb (Left)', nameCn: '左上肢',
    bones: ['clavicle-left', 'scapula-left', 'humerus-left', 'radius-left', 'ulna-left', 'hand-left'],
    subRegions: [
      { id: 'shoulder-left', name: 'Shoulder Girdle', nameCn: '肩带', bones: ['clavicle-left', 'scapula-left'] },
      { id: 'arm-left', name: 'Arm', nameCn: '上臂', bones: ['humerus-left'] },
      { id: 'forearm-left', name: 'Forearm', nameCn: '前臂', bones: ['radius-left', 'ulna-left'] },
      { id: 'hand-left-region', name: 'Hand', nameCn: '手部', bones: ['hand-left'] },
    ],
  },
  {
    id: 'upper-limb-right', name: 'Upper Limb (Right)', nameCn: '右上肢',
    bones: ['clavicle-right', 'scapula-right', 'humerus-right', 'radius-right', 'ulna-right', 'hand-right'],
    subRegions: [
      { id: 'shoulder-right', name: 'Shoulder Girdle', nameCn: '肩带', bones: ['clavicle-right', 'scapula-right'] },
      { id: 'arm-right', name: 'Arm', nameCn: '上臂', bones: ['humerus-right'] },
      { id: 'forearm-right', name: 'Forearm', nameCn: '前臂', bones: ['radius-right', 'ulna-right'] },
      { id: 'hand-right-region', name: 'Hand', nameCn: '手部', bones: ['hand-right'] },
    ],
  },
  {
    id: 'pelvis', name: 'Pelvis', nameCn: '骨盆',
    bones: ['ilium-left', 'ilium-right'],
    subRegions: [
      { id: 'os-coxae-left', name: 'Hip Bone (Left)', nameCn: '左髋骨', bones: ['ilium-left'] },
      { id: 'os-coxae-right', name: 'Hip Bone (Right)', nameCn: '右髋骨', bones: ['ilium-right'] },
    ],
  },
  {
    id: 'lower-limb-left', name: 'Lower Limb (Left)', nameCn: '左下肢',
    bones: ['femur-left', 'patella-left', 'tibia-left', 'fibula-left', 'foot-left'],
    subRegions: [
      { id: 'thigh-left', name: 'Thigh', nameCn: '大腿', bones: ['femur-left'] },
      { id: 'knee-left', name: 'Knee', nameCn: '膝部', bones: ['patella-left'] },
      { id: 'leg-left', name: 'Leg', nameCn: '小腿', bones: ['tibia-left', 'fibula-left'] },
      { id: 'foot-left-region', name: 'Foot', nameCn: '足部', bones: ['foot-left'] },
    ],
  },
  {
    id: 'lower-limb-right', name: 'Lower Limb (Right)', nameCn: '右下肢',
    bones: ['femur-right', 'patella-right', 'tibia-right', 'fibula-right', 'foot-right'],
    subRegions: [
      { id: 'thigh-right', name: 'Thigh', nameCn: '大腿', bones: ['femur-right'] },
      { id: 'knee-right', name: 'Knee', nameCn: '膝部', bones: ['patella-right'] },
      { id: 'leg-right', name: 'Leg', nameCn: '小腿', bones: ['tibia-right', 'fibula-right'] },
      { id: 'foot-right-region', name: 'Foot', nameCn: '足部', bones: ['foot-right'] },
    ],
  },
];

// Region color mapping
export const REGION_COLORS: Record<string, string> = {
  'skull': '#E8DCC8',
  'spine': '#D4C4A8',
  'thorax': '#DED0B8',
  'upper-limb-left': '#E0D2BC',
  'upper-limb-right': '#E0D2BC',
  'pelvis': '#D8CAB0',
  'lower-limb-left': '#E2D6C0',
  'lower-limb-right': '#E2D6C0',
};
