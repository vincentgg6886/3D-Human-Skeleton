/*
 * muscleFilter.ts - Filter logic to identify muscle meshes in GLB limb models
 * 
 * The upper-limb.glb and lower-limb.glb models contain muscles, bones, nerves,
 * arteries, ligaments, etc. We only want to display actual muscle tissue.
 */

// Keywords that indicate a node IS a muscle
const MUSCLE_KEYWORDS = [
  'muscle', 'bicep', 'tricep', 'deltoid', 'pectoralis', 'latissimus',
  'trapezius', 'serratus', 'gluteus', 'gastrocnemius', 'soleus',
  'sartorius', 'gracilis', 'iliacus', 'piriformis', 'psoas',
  'adductor', 'abductor', 'coracobrachialis', 'brachialis',
  'brachioradialis', 'anconeus', 'palmaris', 'opponens',
  'infraspinatus', 'supraspinatus', 'subscapularis', 'teres',
  'rhomboid', 'subclavius', 'pectineus', 'quadratus',
  'semimembranosus', 'semitendinosus', 'vastus', 'tibialis',
  'fibularis', 'peroneus', 'plantaris', 'popliteus', 'lumbrical',
  'interossei', 'gemellus', 'obturator', 'coccygeus',
  'flexor pollicis brevis', 'flexor digiti minimi',
  'extensor digitorum brevis', 'extensor digitorum longus',
  'extensor hallucis', 'flexor digitorum brevis', 'flexor digitorum longus',
  'flexor hallucis', 'levator',
];

// Keywords that indicate a node is NOT a muscle (even if it matches above)
const EXCLUDE_KEYWORDS = [
  'ligament', 'artery', 'nerve', 'vein', 'bursa', 'membrane',
  'retinaculum', 'aponeurosis', 'tendon sheath', 'art cart',
  'capsule', 'meniscus', 'labrum', 'annulus', 'disc',
  'symphysis', 'canal', 'hiatus', 'arch of soleus',
  'overlay', 'tendinous arch',
];

/**
 * Check if a GLB node name represents a muscle mesh
 */
export function isMuscleNode(nodeName: string): boolean {
  const lower = nodeName.toLowerCase();

  // First check exclusions
  for (const kw of EXCLUDE_KEYWORDS) {
    if (lower.includes(kw)) return false;
  }

  // Then check if it's a muscle
  for (const kw of MUSCLE_KEYWORDS) {
    if (lower.includes(kw)) return true;
  }

  return false;
}

/**
 * Muscle group classification for color coding
 */
export type MuscleGroup = 'shoulder' | 'arm' | 'forearm' | 'hand' | 'hip' | 'thigh' | 'leg' | 'foot' | 'trunk';

const GROUP_PATTERNS: [RegExp, MuscleGroup][] = [
  // Shoulder
  [/deltoid|trapezius|rhomboid|levator|serratus|pectoralis|subclavius|infraspinatus|supraspinatus|subscapularis|teres|latissimus/i, 'shoulder'],
  // Arm
  [/biceps brachii|triceps|brachialis|coracobrachialis/i, 'arm'],
  // Forearm
  [/brachioradialis|anconeus|pronator|supinator|palmaris longus|flexor carpi|extensor carpi|flexor digitorum.*(?:superficialis|profundus)|extensor digitorum(?! brevis| longus\.)|abductor pollicis longus/i, 'forearm'],
  // Hand
  [/(?:of hand|pollicis brevis|digiti minimi(?!.*foot)|opponens.*hand|palmaris brevis|adductor pollicis|lumbrical.*hand|inteross.*hand)/i, 'hand'],
  // Hip
  [/gluteus|piriformis|obturator|gemellus|iliacus|psoas|coccygeus|pectineus/i, 'hip'],
  // Thigh
  [/vastus|sartorius|gracilis|adductor (?:brevis|longus|magnus)|biceps femoris|semimembranosus|semitendinosus|quadratus femoris|rectus femoris|tensor/i, 'thigh'],
  // Leg
  [/gastrocnemius|soleus|tibialis|fibularis|peroneus|plantaris|popliteus|extensor digitorum longus|extensor hallucis longus|flexor digitorum longus|flexor hallucis longus/i, 'leg'],
  // Foot
  [/(?:of foot|hallucis brevis|digiti minimi.*foot|quadratus plantae|lumbrical.*foot|inteross.*foot|extensor digitorum brevis|extensor hallucis brevis|flexor digitorum brevis|abductor hallucis|abductor digiti minimi of foot)/i, 'foot'],
];

export function getMuscleGroup(nodeName: string): MuscleGroup {
  for (const [pattern, group] of GROUP_PATTERNS) {
    if (pattern.test(nodeName)) return group;
  }
  return 'trunk';
}

// Colors for muscle groups (semi-transparent reds/pinks)
export const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
  shoulder: '#C44040',  // Deep red
  arm: '#D04848',       // Medium red
  forearm: '#B83838',   // Dark red
  hand: '#CC5050',      // Warm red
  hip: '#A83030',       // Dark crimson
  thigh: '#D85050',     // Bright red
  leg: '#C04040',       // Standard red
  foot: '#B84848',      // Muted red
  trunk: '#D04848',     // Medium red
};

// Chinese names for muscle groups
export const MUSCLE_GROUP_NAMES_CN: Record<MuscleGroup, string> = {
  shoulder: '肩部肌群',
  arm: '上臂肌群',
  forearm: '前臂肌群',
  hand: '手部肌群',
  hip: '髋部肌群',
  thigh: '大腿肌群',
  leg: '小腿肌群',
  foot: '足部肌群',
  trunk: '躯干肌群',
};
