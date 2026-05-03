/*
 * pathologyData.ts - Common orthopedic pathologies database
 * Maps bone IDs to common conditions, fracture types, and clinical notes
 */

export interface Pathology {
  name: string;
  nameCn: string;
  severity: 'common' | 'moderate' | 'severe';
  description: string;
  descriptionCn: string;
  clinicalNotes?: string;
  clinicalNotesCn?: string;
}

export const BONE_PATHOLOGIES: Record<string, Pathology[]> = {
  'cranium': [
    {
      name: 'Skull Fracture', nameCn: '颅骨骨折',
      severity: 'severe',
      description: 'Linear, depressed, or basilar fractures of the cranial vault.',
      descriptionCn: '颅穹窿的线性、凹陷性或颅底骨折。常见于外伤，需CT评估。',
      clinicalNotesCn: '注意硬膜外/硬膜下血肿的可能性，需紧急CT检查。',
    },
  ],
  'mandible': [
    {
      name: 'Mandibular Fracture', nameCn: '下颌骨骨折',
      severity: 'moderate',
      description: 'Fractures commonly at the condyle, angle, or body of the mandible.',
      descriptionCn: '常见于髁突、下颌角或下颌体的骨折。面部外伤最常见的骨折之一。',
      clinicalNotesCn: '注意咬合关系改变，可能需要颌间固定。',
    },
    {
      name: 'TMJ Dysfunction', nameCn: '颞下颌关节紊乱',
      severity: 'common',
      description: 'Temporomandibular joint disorder causing pain, clicking, and limited opening.',
      descriptionCn: '颞下颌关节功能紊乱，表现为疼痛、弹响和张口受限。',
    },
  ],
  'cervical-vertebrae': [
    {
      name: 'Cervical Disc Herniation', nameCn: '颈椎间盘突出',
      severity: 'common',
      description: 'Herniation of nucleus pulposus compressing nerve roots or spinal cord.',
      descriptionCn: '髓核突出压迫神经根或脊髓。C5-C6和C6-C7最常见。',
      clinicalNotesCn: '需评估上肢神经功能，MRI为首选检查。',
    },
    {
      name: 'Cervical Spondylosis', nameCn: '颈椎病',
      severity: 'common',
      description: 'Degenerative changes in cervical spine including osteophytes and disc degeneration.',
      descriptionCn: '颈椎退行性改变，包括骨赘形成和椎间盘退变。',
    },
    {
      name: 'Whiplash Injury', nameCn: '挥鞭伤',
      severity: 'moderate',
      description: 'Soft tissue injury from rapid acceleration-deceleration of the neck.',
      descriptionCn: '颈部快速加速-减速导致的软组织损伤，常见于交通事故。',
    },
  ],
  'thoracic-vertebrae': [
    {
      name: 'Compression Fracture', nameCn: '压缩性骨折',
      severity: 'moderate',
      description: 'Vertebral body compression, often from osteoporosis or trauma.',
      descriptionCn: '椎体压缩，常因骨质疏松或外伤引起。T11-L1为好发部位。',
      clinicalNotesCn: '老年患者需排除骨质疏松，评估骨密度。',
    },
    {
      name: 'Scheuermann Disease', nameCn: 'Scheuermann病',
      severity: 'common',
      description: 'Developmental disorder causing excessive thoracic kyphosis in adolescents.',
      descriptionCn: '青少年发育性疾病，导致胸椎过度后凸。',
    },
  ],
  'lumbar-vertebrae': [
    {
      name: 'Lumbar Disc Herniation', nameCn: '腰椎间盘突出症',
      severity: 'common',
      description: 'Most common at L4-L5 and L5-S1. Causes sciatica and lower back pain.',
      descriptionCn: '最常见于L4-L5和L5-S1。引起坐骨神经痛和腰痛。',
      clinicalNotesCn: '直腿抬高试验阳性提示神经根受压，MRI确诊。',
    },
    {
      name: 'Lumbar Spinal Stenosis', nameCn: '腰椎管狭窄症',
      severity: 'moderate',
      description: 'Narrowing of the spinal canal causing neurogenic claudication.',
      descriptionCn: '椎管狭窄导致神经源性间歇性跛行。',
    },
    {
      name: 'Spondylolisthesis', nameCn: '腰椎滑脱症',
      severity: 'moderate',
      description: 'Forward displacement of a vertebra, commonly L5 over S1.',
      descriptionCn: '椎体前移，常见L5在S1上的滑脱。分为峡部裂性和退变性。',
    },
  ],
  'sacrum': [
    {
      name: 'Sacral Fracture', nameCn: '骶骨骨折',
      severity: 'severe',
      description: 'Often associated with pelvic ring injuries from high-energy trauma.',
      descriptionCn: '常与骨盆环损伤相关，多由高能量创伤引起。',
      clinicalNotesCn: '注意骶神经损伤的可能性，评估膀胱直肠功能。',
    },
    {
      name: 'Sacroiliitis', nameCn: '骶髂关节炎',
      severity: 'common',
      description: 'Inflammation of the sacroiliac joint, often seen in ankylosing spondylitis.',
      descriptionCn: '骶髂关节炎症，常见于强直性脊柱炎。',
    },
  ],
  'humerus-left': [
    {
      name: 'Proximal Humerus Fracture', nameCn: '肱骨近端骨折',
      severity: 'moderate',
      description: 'Common in elderly patients with osteoporosis after a fall.',
      descriptionCn: '老年骨质疏松患者跌倒后常见。Neer分型指导治疗。',
      clinicalNotesCn: '评估血管神经状态，注意腋神经损伤。',
    },
    {
      name: 'Rotator Cuff Tear', nameCn: '肩袖撕裂',
      severity: 'common',
      description: 'Tear of the rotator cuff tendons, causing shoulder pain and weakness.',
      descriptionCn: '肩袖肌腱撕裂，导致肩痛和无力。MRI评估撕裂程度。',
    },
  ],
  'humerus-right': [
    {
      name: 'Proximal Humerus Fracture', nameCn: '肱骨近端骨折',
      severity: 'moderate',
      description: 'Common in elderly patients with osteoporosis after a fall.',
      descriptionCn: '老年骨质疏松患者跌倒后常见。Neer分型指导治疗。',
    },
    {
      name: 'Supracondylar Fracture', nameCn: '肱骨髁上骨折',
      severity: 'moderate',
      description: 'Most common elbow fracture in children, usually from a fall on outstretched hand.',
      descriptionCn: '儿童最常见的肘部骨折，通常因伸手撑地跌倒引起。',
      clinicalNotesCn: '注意Volkmann缺血性挛缩的风险，评估桡动脉搏动。',
    },
  ],
  'radius-left': [
    {
      name: 'Distal Radius Fracture (Colles)', nameCn: '桡骨远端骨折（Colles骨折）',
      severity: 'common',
      description: 'Most common fracture type. Dorsal displacement of distal fragment.',
      descriptionCn: '最常见的骨折类型。远端骨折片背侧移位，"餐叉样"畸形。',
    },
    {
      name: 'Radial Head Fracture', nameCn: '桡骨头骨折',
      severity: 'common',
      description: 'Common after fall on outstretched hand. Mason classification guides treatment.',
      descriptionCn: '伸手撑地跌倒后常见。Mason分型指导治疗。',
    },
  ],
  'radius-right': [
    {
      name: 'Distal Radius Fracture (Colles)', nameCn: '桡骨远端骨折（Colles骨折）',
      severity: 'common',
      description: 'Most common fracture type. Dorsal displacement of distal fragment.',
      descriptionCn: '最常见的骨折类型。远端骨折片背侧移位，"餐叉样"畸形。',
    },
  ],
  'femur-left': [
    {
      name: 'Femoral Neck Fracture', nameCn: '股骨颈骨折',
      severity: 'severe',
      description: 'Common in elderly with osteoporosis. Risk of avascular necrosis of femoral head.',
      descriptionCn: '老年骨质疏松患者常见。有股骨头缺血性坏死的风险。',
      clinicalNotesCn: 'Garden分型指导治疗。移位型骨折多需关节置换。',
    },
    {
      name: 'Hip Osteoarthritis', nameCn: '髋关节骨关节炎',
      severity: 'common',
      description: 'Degenerative joint disease causing pain, stiffness, and reduced mobility.',
      descriptionCn: '退行性关节病，导致疼痛、僵硬和活动度降低。',
    },
  ],
  'femur-right': [
    {
      name: 'Femoral Neck Fracture', nameCn: '股骨颈骨折',
      severity: 'severe',
      description: 'Common in elderly with osteoporosis. Risk of avascular necrosis of femoral head.',
      descriptionCn: '老年骨质疏松患者常见。有股骨头缺血性坏死的风险。',
    },
    {
      name: 'Femoral Shaft Fracture', nameCn: '股骨干骨折',
      severity: 'severe',
      description: 'Usually from high-energy trauma. Treated with intramedullary nailing.',
      descriptionCn: '通常由高能量创伤引起。髓内钉固定为标准治疗。',
    },
  ],
  'patella-left': [
    {
      name: 'Patellar Fracture', nameCn: '髌骨骨折',
      severity: 'moderate',
      description: 'Usually from direct impact or forceful quadriceps contraction.',
      descriptionCn: '通常由直接撞击或股四头肌强力收缩引起。',
    },
    {
      name: 'Patellar Dislocation', nameCn: '髌骨脱位',
      severity: 'common',
      description: 'Lateral dislocation of the patella, common in young females.',
      descriptionCn: '髌骨外侧脱位，多见于年轻女性。',
    },
  ],
  'patella-right': [
    {
      name: 'Patellar Fracture', nameCn: '髌骨骨折',
      severity: 'moderate',
      description: 'Usually from direct impact or forceful quadriceps contraction.',
      descriptionCn: '通常由直接撞击或股四头肌强力收缩引起。',
    },
  ],
  'tibia-left': [
    {
      name: 'Tibial Plateau Fracture', nameCn: '胫骨平台骨折',
      severity: 'moderate',
      description: 'Intra-articular fracture affecting knee alignment. Schatzker classification.',
      descriptionCn: '关节内骨折，影响膝关节对线。Schatzker分型指导治疗。',
      clinicalNotesCn: '注意合并半月板和韧带损伤。CT评估骨折形态。',
    },
    {
      name: 'ACL Tear', nameCn: '前交叉韧带撕裂',
      severity: 'common',
      description: 'Common sports injury affecting knee stability.',
      descriptionCn: '常见运动损伤，影响膝关节稳定性。',
    },
  ],
  'tibia-right': [
    {
      name: 'Tibial Plateau Fracture', nameCn: '胫骨平台骨折',
      severity: 'moderate',
      description: 'Intra-articular fracture affecting knee alignment.',
      descriptionCn: '关节内骨折，影响膝关节对线。',
    },
  ],
  'calcaneus-left': [
    {
      name: 'Calcaneal Fracture', nameCn: '跟骨骨折',
      severity: 'severe',
      description: 'Usually from falls from height. Complex intra-articular fracture.',
      descriptionCn: '通常因高处坠落引起。复杂的关节内骨折。',
      clinicalNotesCn: '注意合并脊柱骨折（10%合并率）。Sanders分型指导治疗。',
    },
    {
      name: 'Ankle Fracture', nameCn: '踝关节骨折',
      severity: 'common',
      description: 'Fractures of the malleoli. Weber classification based on fibula fracture level.',
      descriptionCn: '踝部骨折。Weber分型基于腓骨骨折水平。',
    },
    {
      name: 'Plantar Fasciitis', nameCn: '足底筋膜炎',
      severity: 'common',
      description: 'Inflammation of the plantar fascia causing heel pain.',
      descriptionCn: '足底筋膜炎症，导致足跟疼痛。晨起第一步痛为典型表现。',
    },
  ],
  'calcaneus-right': [
    {
      name: 'Calcaneal Fracture', nameCn: '跟骨骨折',
      severity: 'severe',
      description: 'Usually from falls from height.',
      descriptionCn: '通常因高处坠落引起。',
    },
    {
      name: 'Ankle Fracture', nameCn: '踝关节骨折',
      severity: 'common',
      description: 'Fractures of the malleoli.',
      descriptionCn: '踝部骨折。',
    },
  ],
  'hip-bone-left': [
    {
      name: 'Pelvic Fracture', nameCn: '骨盆骨折',
      severity: 'severe',
      description: 'High-energy trauma. Risk of life-threatening hemorrhage.',
      descriptionCn: '高能量创伤。有危及生命的大出血风险。',
      clinicalNotesCn: 'Tile分型评估稳定性。注意合并泌尿系和血管损伤。',
    },
    {
      name: 'Hip Labral Tear', nameCn: '髋关节盂唇撕裂',
      severity: 'common',
      description: 'Tear of the acetabular labrum causing hip pain and mechanical symptoms.',
      descriptionCn: '髋臼盂唇撕裂，导致髋痛和机械症状。',
    },
  ],
  'hip-bone-right': [
    {
      name: 'Pelvic Fracture', nameCn: '骨盆骨折',
      severity: 'severe',
      description: 'High-energy trauma. Risk of life-threatening hemorrhage.',
      descriptionCn: '高能量创伤。有危及生命的大出血风险。',
    },
  ],
  'scaphoid-left': [
    {
      name: 'Scaphoid Fracture', nameCn: '舟骨骨折',
      severity: 'common',
      description: 'Most commonly fractured carpal bone. Often missed on initial X-ray.',
      descriptionCn: '最常骨折的腕骨。初次X线检查常被漏诊。',
      clinicalNotesCn: '鼻烟窝压痛提示舟骨骨折。注意缺血性坏死风险。',
    },
    {
      name: 'Boxer\'s Fracture', nameCn: '拳击手骨折',
      severity: 'common',
      description: 'Fracture of the 5th metacarpal neck from punching.',
      descriptionCn: '第5掌骨颈骨折，因拳击动作引起。',
    },
  ],
  'scaphoid-right': [
    {
      name: 'Scaphoid Fracture', nameCn: '舟骨骨折',
      severity: 'common',
      description: 'Most commonly fractured carpal bone.',
      descriptionCn: '最常骨折的腕骨。',
    },
    {
      name: 'Trigger Finger', nameCn: '扳机指',
      severity: 'common',
      description: 'Stenosing tenosynovitis causing finger catching or locking.',
      descriptionCn: '狭窄性腱鞘炎，导致手指弹响或卡锁。',
    },
  ],
};

// Severity color mapping
export const SEVERITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  common: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', border: 'border-emerald-400/20' },
  moderate: { bg: 'bg-amber-400/10', text: 'text-amber-400', border: 'border-amber-400/20' },
  severe: { bg: 'bg-red-400/10', text: 'text-red-400', border: 'border-red-400/20' },
};

export const SEVERITY_LABELS: Record<string, string> = {
  common: '常见',
  moderate: '中等',
  severe: '严重',
};
