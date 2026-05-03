import type { BoneInfo, RegionInfo } from './store';
import { APP_BONE_LOOKUP, TOTAL_BONE_COUNT } from './boneMapping';

// ============================================================
// Re-export bone count for UI components
// ============================================================
export { TOTAL_BONE_COUNT };

// ============================================================
// 骨骼医学信息数据库
// Keyed by appBoneId from boneMapping
// For bones not explicitly listed, we auto-generate basic info from the mapping
// ============================================================

const DETAILED_BONE_INFO: Record<string, Partial<BoneInfo>> = {
  // ==================== SKULL ====================
  'frontal-bone': {
    description: 'The frontal bone forms the forehead and the superior part of the orbits.',
    descriptionCn: '额骨构成前额和眼眶上部。',
    joints: ['冠状缝', '额鼻缝'],
  },
  'occipital-bone': {
    description: 'The occipital bone forms the posterior part of the cranium. It contains the foramen magnum through which the spinal cord passes.',
    descriptionCn: '枕骨构成颅骨后部。包含枕骨大孔，脊髓由此通过。',
    joints: ['枕乳缝', '寰枕关节'],
  },
  'sphenoid-bone': {
    description: 'The sphenoid bone is a butterfly-shaped bone at the base of the skull, articulating with all other cranial bones.',
    descriptionCn: '蝶骨是颅底的蝴蝶形骨骼，与所有其他颅骨相关节。',
    joints: ['蝶额缝', '蝶顶缝'],
  },
  'mandible': {
    description: 'The mandible is the largest and strongest bone of the face. It forms the lower jaw and holds the lower teeth.',
    descriptionCn: '下颌骨是面部最大、最坚固的骨骼。构成下颌并固定下排牙齿。',
    joints: ['颞下颌关节 (TMJ)'],
    romData: [
      { movement: '张口 (Opening)', range: '35-45mm' },
      { movement: '前伸 (Protrusion)', range: '6-9mm' },
      { movement: '侧方运动 (Lateral)', range: '10-12mm' },
    ],
  },

  // ==================== SPINE ====================
  'atlas-c1': {
    description: 'The atlas (C1) is the first cervical vertebra. It supports the skull and allows nodding movements.',
    descriptionCn: '寰椎(C1)是第一颈椎。它支撑颅骨并允许点头运动。',
    joints: ['寰枕关节', '寰枢关节'],
    romData: [
      { movement: '屈伸 (Flexion/Extension)', range: '25°' },
    ],
  },
  'axis-c2': {
    description: 'The axis (C2) has the odontoid process (dens) that allows the atlas to rotate, enabling head turning.',
    descriptionCn: '枢椎(C2)具有齿突，允许寰椎旋转，使头部可以转动。',
    joints: ['寰枢关节'],
    romData: [
      { movement: '旋转 (Rotation)', range: '40-45°' },
    ],
  },
  'sacrum': {
    description: 'The sacrum is a triangular bone formed by fusion of 5 sacral vertebrae. It connects the spine to the pelvis.',
    descriptionCn: '骶骨由5块骶椎融合而成的三角形骨骼。通过骶髂关节将脊柱与骨盆连接。',
    joints: ['骶髂关节', '腰骶关节'],
  },
  'coccyx': {
    description: 'The coccyx (tailbone) is formed by 3-5 fused vertebrae. It serves as attachment for pelvic floor ligaments and muscles.',
    descriptionCn: '尾骨由3-5块融合的椎骨组成。是骨盆底韧带和肌肉的附着点。',
    joints: ['骶尾关节'],
  },

  // ==================== THORAX ====================
  'sternum-body': {
    description: 'The body of the sternum connects to ribs 3-7 via costal cartilages.',
    descriptionCn: '胸骨体通过肋软骨与第3-7肋相连。',
    joints: ['胸肋关节'],
  },
  'sternum-manubrium': {
    description: 'The manubrium is the superior part of the sternum, articulating with the clavicles and first two ribs.',
    descriptionCn: '胸骨柄是胸骨上部，与锁骨和前两根肋骨相关节。',
    joints: ['胸锁关节', '胸肋关节'],
  },

  // ==================== UPPER LIMB ====================
  'clavicle-right': {
    description: 'The clavicle (collarbone) connects the arm to the trunk. It is the most commonly fractured bone.',
    descriptionCn: '锁骨连接上肢与躯干。它是人体最常发生骨折的骨骼。',
    joints: ['胸锁关节', '肩锁关节'],
  },
  'scapula-right': {
    description: 'The scapula (shoulder blade) is a flat triangular bone providing attachment for 17 muscles.',
    descriptionCn: '肩胛骨是扁三角形骨骼，为17块肌肉提供附着点。',
    joints: ['肩锁关节', '盂肱关节'],
  },
  'humerus-right': {
    description: 'The humerus is the single bone of the upper arm. Proximal end forms the shoulder joint, distal end forms the elbow.',
    descriptionCn: '肱骨是上臂的唯一骨骼。近端构成肩关节，远端构成肘关节。',
    joints: ['盂肱关节（肩关节）', '肘关节'],
    romData: [
      { movement: '肩前屈 (Flexion)', range: '150-170°' },
      { movement: '肩后伸 (Extension)', range: '40-45°' },
      { movement: '肩外展 (Abduction)', range: '150-180°' },
      { movement: '肩外旋 (External Rotation)', range: '80-90°' },
      { movement: '肩内旋 (Internal Rotation)', range: '60-100°' },
    ],
  },
  'radius-right': {
    description: 'The radius is the lateral bone of the forearm. Distal radius fractures (Colles) are among the most common.',
    descriptionCn: '桡骨是前臂外侧骨骼。桡骨远端骨折（Colles骨折）是最常见的骨折之一。',
    joints: ['肘关节', '桡尺近侧关节', '腕关节'],
    romData: [
      { movement: '肘屈曲 (Flexion)', range: '140-150°' },
      { movement: '前臂旋前 (Pronation)', range: '75-85°' },
      { movement: '前臂旋后 (Supination)', range: '80-90°' },
    ],
  },
  'ulna-right': {
    description: 'The ulna is the medial bone of the forearm. The olecranon forms the elbow tip.',
    descriptionCn: '尺骨是前臂内侧骨骼。鹰嘴形成肘尖。',
    joints: ['肘关节', '桡尺近侧关节', '桡尺远侧关节'],
  },

  // ==================== PELVIS ====================
  'hip-bone-right': {
    description: 'The hip bone (os coxae) is formed by fusion of ilium, ischium, and pubis. The acetabulum forms the hip joint socket.',
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

  // ==================== LOWER LIMB ====================
  'femur-right': {
    description: 'The femur is the longest and strongest bone in the body. The femoral neck is a common fracture site in osteoporosis.',
    descriptionCn: '股骨是人体最长、最坚固的骨骼。股骨颈是骨质疏松患者骨折的常见部位。',
    joints: ['髋关节', '膝关节'],
    romData: [
      { movement: '膝屈曲 (Knee Flexion)', range: '130-150°' },
      { movement: '膝伸展 (Knee Extension)', range: '0-10°' },
    ],
  },
  'patella-right': {
    description: 'The patella (kneecap) is the largest sesamoid bone. It protects the knee and improves quadriceps leverage.',
    descriptionCn: '髌骨是最大的籽骨。保护膝关节并增强股四头肌腱的杠杆作用。',
    joints: ['髌股关节'],
  },
  'tibia-right': {
    description: 'The tibia (shinbone) is the larger medial bone of the leg, bearing most body weight from the femur.',
    descriptionCn: '胫骨是小腿内侧较大的骨骼，承受从股骨传递的大部分体重。',
    joints: ['膝关节', '踝关节', '胫腓近侧关节'],
  },
  'fibula-right': {
    description: 'The fibula is the slender lateral bone of the leg. It forms the lateral malleolus of the ankle.',
    descriptionCn: '腓骨是小腿外侧的细长骨骼。构成踝关节的外踝。',
    joints: ['胫腓近侧关节', '胫腓远侧关节', '踝关节'],
  },
  'calcaneus-right': {
    description: 'The calcaneus (heel bone) is the largest tarsal bone. Calcaneal fractures often result from falls.',
    descriptionCn: '跟骨是最大的跗骨。跟骨骨折常因高处坠落引起。',
    joints: ['距下关节'],
    romData: [
      { movement: '踝背屈 (Dorsiflexion)', range: '15-20°' },
      { movement: '踝跖屈 (Plantarflexion)', range: '40-55°' },
      { movement: '足内翻 (Inversion)', range: '20-35°' },
      { movement: '足外翻 (Eversion)', range: '10-25°' },
    ],
  },
  'talus-right': {
    description: 'The talus transmits body weight from the tibia to the foot. It has no muscle attachments.',
    descriptionCn: '距骨将体重从胫骨传递到足部。它没有肌肉附着。',
    joints: ['踝关节', '距下关节'],
  },
  'scaphoid-right': {
    description: 'The scaphoid is the most commonly fractured carpal bone, often missed on initial X-rays.',
    descriptionCn: '舟骨是最常骨折的腕骨，初次X线检查常被漏诊。',
    joints: ['桡腕关节', '腕骨间关节'],
  },
};

// ============================================================
// Auto-generate BONE_INFO for all bones from boneMapping
// ============================================================
export const BONE_INFO: Record<string, BoneInfo> = {};

for (const [appBoneId, entry] of Object.entries(APP_BONE_LOOKUP)) {
  // Check if there's detailed info for this bone or its right-side counterpart
  const detailKey = appBoneId;
  const rightKey = appBoneId.replace('-left', '-right');
  const detail = DETAILED_BONE_INFO[detailKey] || DETAILED_BONE_INFO[rightKey] || {};

  // Determine sub-region
  let subRegion = '';
  let subRegionCn = '';
  if (entry.region === 'skull') { subRegion = 'cranium'; subRegionCn = '颅骨'; }
  else if (entry.region === 'spine') {
    if (appBoneId.includes('c') && appBoneId.includes('cervical') || appBoneId.includes('atlas') || appBoneId.includes('axis')) {
      subRegion = 'cervical'; subRegionCn = '颈段';
    } else if (appBoneId.includes('thoracic-t')) {
      subRegion = 'thoracic'; subRegionCn = '胸段';
    } else if (appBoneId.includes('lumbar')) {
      subRegion = 'lumbar'; subRegionCn = '腰段';
    } else {
      subRegion = 'sacral'; subRegionCn = '骶尾段';
    }
  }
  else if (entry.region === 'thorax') { subRegion = 'thorax'; subRegionCn = '胸廓'; }
  else if (entry.region.includes('upper-limb')) {
    if (appBoneId.includes('clavicle') || appBoneId.includes('scapula')) {
      subRegion = 'shoulder-girdle'; subRegionCn = '肩带';
    } else if (appBoneId.includes('humerus')) {
      subRegion = 'arm'; subRegionCn = '上臂';
    } else if (appBoneId.includes('radius') || appBoneId.includes('ulna')) {
      subRegion = 'forearm'; subRegionCn = '前臂';
    } else {
      subRegion = 'hand'; subRegionCn = '手部';
    }
  }
  else if (entry.region === 'pelvis') { subRegion = 'pelvis'; subRegionCn = '骨盆'; }
  else if (entry.region.includes('lower-limb')) {
    if (appBoneId.includes('femur')) {
      subRegion = 'thigh'; subRegionCn = '大腿';
    } else if (appBoneId.includes('patella')) {
      subRegion = 'knee'; subRegionCn = '膝部';
    } else if (appBoneId.includes('tibia') || appBoneId.includes('fibula')) {
      subRegion = 'leg'; subRegionCn = '小腿';
    } else {
      subRegion = 'foot'; subRegionCn = '足部';
    }
  }

  const regionCnMap: Record<string, string> = {
    'skull': '颅骨', 'spine': '脊柱', 'thorax': '胸廓',
    'upper-limb-left': '左上肢', 'upper-limb-right': '右上肢',
    'pelvis': '骨盆',
    'lower-limb-left': '左下肢', 'lower-limb-right': '右下肢',
  };

  BONE_INFO[appBoneId] = {
    id: appBoneId,
    name: entry.nameEn,
    nameCn: entry.nameCn,
    region: entry.region,
    regionCn: regionCnMap[entry.region] || entry.region,
    subRegion,
    subRegionCn,
    description: detail.description || `${entry.nameEn} is a bone of the ${entry.region.replace(/-/g, ' ')}.`,
    descriptionCn: detail.descriptionCn || `${entry.nameCn}是${regionCnMap[entry.region] || entry.region}的骨骼。`,
    joints: detail.joints,
    romData: detail.romData,
  };
}

// ============================================================
// 区域分组定义 - 从boneMapping自动生成
// ============================================================

function buildRegions(): RegionInfo[] {
  const regionMap = new Map<string, Set<string>>();

  for (const [appBoneId, entry] of Object.entries(APP_BONE_LOOKUP)) {
    if (!regionMap.has(entry.region)) {
      regionMap.set(entry.region, new Set());
    }
    regionMap.get(entry.region)!.add(appBoneId);
  }

  const regionNames: Record<string, { name: string; nameCn: string }> = {
    'skull': { name: 'Skull', nameCn: '颅骨' },
    'spine': { name: 'Vertebral Column', nameCn: '脊柱' },
    'thorax': { name: 'Thorax', nameCn: '胸廓' },
    'upper-limb-left': { name: 'Upper Limb (Left)', nameCn: '左上肢' },
    'upper-limb-right': { name: 'Upper Limb (Right)', nameCn: '右上肢' },
    'pelvis': { name: 'Pelvis', nameCn: '骨盆' },
    'lower-limb-left': { name: 'Lower Limb (Left)', nameCn: '左下肢' },
    'lower-limb-right': { name: 'Lower Limb (Right)', nameCn: '右下肢' },
  };

  const regionOrder = ['skull', 'spine', 'thorax', 'upper-limb-left', 'upper-limb-right', 'pelvis', 'lower-limb-left', 'lower-limb-right'];

  return regionOrder.map((regionId) => {
    const bones = Array.from(regionMap.get(regionId) || []);
    const info = regionNames[regionId] || { name: regionId, nameCn: regionId };

    // Build sub-regions
    const subRegionMap = new Map<string, string[]>();
    bones.forEach((boneId) => {
      const boneInfo = BONE_INFO[boneId];
      if (boneInfo?.subRegion) {
        if (!subRegionMap.has(boneInfo.subRegion)) {
          subRegionMap.set(boneInfo.subRegion, []);
        }
        subRegionMap.get(boneInfo.subRegion)!.push(boneId);
      }
    });

    const subRegions = Array.from(subRegionMap.entries()).map(([subId, subBones]) => {
      const firstBone = BONE_INFO[subBones[0]];
      return {
        id: subId,
        name: subId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        nameCn: firstBone?.subRegionCn || subId,
        bones: subBones,
      };
    });

    return {
      id: regionId,
      name: info.name,
      nameCn: info.nameCn,
      bones,
      subRegions,
    };
  });
}

export const REGIONS: RegionInfo[] = buildRegions();

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
