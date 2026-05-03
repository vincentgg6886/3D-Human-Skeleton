/*
 * pathologyEffects.ts - Visual effect definitions for pathology visualization on bones
 * 
 * When a pathology is activated, the affected bone(s) display visual effects
 * that represent the disease state in the 3D scene.
 */

export type PathologyEffectType = 
  | 'fracture'        // Red crack lines, displacement
  | 'degeneration'    // Darkened, roughened surface
  | 'inflammation'    // Red/orange glow, swelling effect
  | 'osteoporosis'    // Porous appearance, transparency
  | 'displacement'    // Shifted position, misalignment
  | 'tear'            // Soft tissue tear indicator
  | 'compression'     // Compressed/flattened appearance
  | 'necrosis';       // Dark patches, dead tissue

export interface PathologyEffect {
  type: PathologyEffectType;
  color: string;         // Primary effect color
  emissiveColor: string; // Glow color
  emissiveIntensity: number;
  opacity: number;
  roughness: number;
  pulseSpeed: number;    // 0 = no pulse
  labelCn: string;       // Chinese label for the effect type
}

// Effect presets for each pathology type
export const PATHOLOGY_EFFECTS: Record<PathologyEffectType, PathologyEffect> = {
  fracture: {
    type: 'fracture',
    color: '#8B2020',
    emissiveColor: '#FF3030',
    emissiveIntensity: 0.6,
    opacity: 0.95,
    roughness: 0.8,
    pulseSpeed: 2.5,
    labelCn: '骨折',
  },
  degeneration: {
    type: 'degeneration',
    color: '#6B5B3A',
    emissiveColor: '#8B7340',
    emissiveIntensity: 0.25,
    opacity: 0.85,
    roughness: 0.9,
    pulseSpeed: 0.8,
    labelCn: '退行性变',
  },
  inflammation: {
    type: 'inflammation',
    color: '#C04030',
    emissiveColor: '#FF6040',
    emissiveIntensity: 0.5,
    opacity: 0.9,
    roughness: 0.4,
    pulseSpeed: 3.0,
    labelCn: '炎症',
  },
  osteoporosis: {
    type: 'osteoporosis',
    color: '#A09080',
    emissiveColor: '#C0A880',
    emissiveIntensity: 0.2,
    opacity: 0.5,
    roughness: 0.95,
    pulseSpeed: 0.5,
    labelCn: '骨质疏松',
  },
  displacement: {
    type: 'displacement',
    color: '#9B3030',
    emissiveColor: '#FF4040',
    emissiveIntensity: 0.45,
    opacity: 0.9,
    roughness: 0.6,
    pulseSpeed: 1.5,
    labelCn: '移位',
  },
  tear: {
    type: 'tear',
    color: '#A04050',
    emissiveColor: '#FF5060',
    emissiveIntensity: 0.4,
    opacity: 0.85,
    roughness: 0.5,
    pulseSpeed: 2.0,
    labelCn: '撕裂',
  },
  compression: {
    type: 'compression',
    color: '#7B6B4A',
    emissiveColor: '#A08850',
    emissiveIntensity: 0.3,
    opacity: 0.8,
    roughness: 0.85,
    pulseSpeed: 1.0,
    labelCn: '压缩',
  },
  necrosis: {
    type: 'necrosis',
    color: '#2A2020',
    emissiveColor: '#503030',
    emissiveIntensity: 0.15,
    opacity: 0.75,
    roughness: 1.0,
    pulseSpeed: 0.3,
    labelCn: '坏死',
  },
};

// Map pathology names to their visual effect types
export const PATHOLOGY_NAME_TO_EFFECT: Record<string, PathologyEffectType> = {
  // Fractures
  'Skull Fracture': 'fracture',
  'Mandibular Fracture': 'fracture',
  'Proximal Humerus Fracture': 'fracture',
  'Supracondylar Fracture': 'fracture',
  'Distal Radius Fracture (Colles)': 'fracture',
  'Radial Head Fracture': 'fracture',
  'Femoral Neck Fracture': 'fracture',
  'Femoral Shaft Fracture': 'fracture',
  'Patellar Fracture': 'fracture',
  'Tibial Plateau Fracture': 'fracture',
  'Calcaneal Fracture': 'fracture',
  'Ankle Fracture': 'fracture',
  'Sacral Fracture': 'fracture',
  'Pelvic Fracture': 'fracture',
  'Scaphoid Fracture': 'fracture',
  "Boxer's Fracture": 'fracture',
  'Compression Fracture': 'compression',

  // Degenerative
  'Cervical Spondylosis': 'degeneration',
  'Hip Osteoarthritis': 'degeneration',
  'Lumbar Spinal Stenosis': 'degeneration',
  'Scheuermann Disease': 'degeneration',
  'TMJ Dysfunction': 'degeneration',

  // Inflammatory
  'Sacroiliitis': 'inflammation',
  'Plantar Fasciitis': 'inflammation',
  'Trigger Finger': 'inflammation',

  // Disc / Herniation
  'Cervical Disc Herniation': 'displacement',
  'Lumbar Disc Herniation': 'displacement',
  'Spondylolisthesis': 'displacement',
  'Patellar Dislocation': 'displacement',

  // Soft tissue
  'Rotator Cuff Tear': 'tear',
  'ACL Tear': 'tear',
  'Hip Labral Tear': 'tear',
  'Whiplash Injury': 'tear',

  // Necrosis / Avascular
  // (Femoral neck fracture can lead to necrosis - handled via fracture primarily)
  
  // Osteoporosis-related
  // (Compression fractures are often osteoporotic)
};

/**
 * Get the visual effect for a pathology by its English name
 */
export function getPathologyEffect(pathologyName: string): PathologyEffect {
  const effectType = PATHOLOGY_NAME_TO_EFFECT[pathologyName] || 'inflammation';
  return PATHOLOGY_EFFECTS[effectType];
}
