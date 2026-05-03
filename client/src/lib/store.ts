import { create } from 'zustand';

export interface BoneInfo {
  id: string;
  name: string;
  nameCn: string;
  region: string;
  regionCn: string;
  subRegion: string;
  subRegionCn: string;
  description: string;
  descriptionCn: string;
  joints?: string[];
  romData?: { movement: string; range: string }[];
}

export interface RegionInfo {
  id: string;
  name: string;
  nameCn: string;
  bones: string[];
  subRegions: { id: string; name: string; nameCn: string; bones: string[] }[];
}

export type JointPreset = {
  id: string;
  nameCn: string;
  nameEn: string;
  bones: string[];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  description: string;
};

interface AppState {
  // Selection
  selectedBoneId: string | null;
  hoveredBoneId: string | null;
  lockedRegionId: string | null;

  // Visibility
  visibleRegions: Set<string>;
  hiddenBones: Set<string>;

  // Display Modes
  muscleMode: boolean;
  muscleOpacity: number;
  labelMode: boolean;        // V1.5: bone label annotations
  xrayMode: boolean;         // X-ray transparency mode

  // Joint View - V1.5
  activeJointPreset: string | null;

  // Pathology Visualization
  activePathologyIndex: number | null;

  // UI State
  sidebarOpen: boolean;
  infoPanelOpen: boolean;
  searchQuery: string;
  activeTab: 'hierarchy' | 'info' | 'motion' | 'pathology' | 'joints';
  showOnboarding: boolean;   // V1.1: first-visit onboarding
  modelLoaded: boolean;      // V1.1: loading state tracking

  // View
  viewMode: 'full' | 'region';
  cameraTarget: [number, number, number] | null;
  cameraPosition: [number, number, number] | null;

  // Actions
  selectBone: (id: string | null) => void;
  hoverBone: (id: string | null) => void;
  lockRegion: (id: string | null) => void;
  toggleRegionVisibility: (regionId: string) => void;
  toggleBoneVisibility: (boneId: string) => void;
  showAllRegions: () => void;
  setSidebarOpen: (open: boolean) => void;
  setInfoPanelOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  setCameraTarget: (target: [number, number, number] | null) => void;
  setCameraPreset: (position: [number, number, number], target: [number, number, number]) => void;
  resetView: () => void;

  // Muscle mode
  toggleMuscleMode: () => void;
  setMuscleOpacity: (opacity: number) => void;

  // Label mode
  toggleLabelMode: () => void;

  // X-ray mode
  toggleXrayMode: () => void;

  // Joint view
  setActiveJointPreset: (id: string | null) => void;

  // Pathology visualization
  setActivePathology: (index: number | null) => void;

  // Onboarding
  setShowOnboarding: (show: boolean) => void;
  setModelLoaded: (loaded: boolean) => void;
}

const ALL_REGIONS = new Set([
  'skull', 'spine', 'thorax', 'upper-limb-left', 'upper-limb-right',
  'pelvis', 'lower-limb-left', 'lower-limb-right'
]);

// Check if user has seen onboarding before
const hasSeenOnboarding = () => {
  try { return localStorage.getItem('orthovis-onboarding-seen') === 'true'; }
  catch { return false; }
};

export const useAppStore = create<AppState>((set) => ({
  selectedBoneId: null,
  hoveredBoneId: null,
  lockedRegionId: null,
  visibleRegions: new Set(ALL_REGIONS),
  hiddenBones: new Set<string>(),
  muscleMode: false,
  muscleOpacity: 0.55,
  labelMode: false,
  xrayMode: false,
  activeJointPreset: null,
  activePathologyIndex: null,
  sidebarOpen: false,
  infoPanelOpen: false,
  searchQuery: '',
  activeTab: 'hierarchy' as AppState['activeTab'],
  showOnboarding: !hasSeenOnboarding(),
  modelLoaded: false,
  viewMode: 'full',
  cameraTarget: null,
  cameraPosition: null,

  selectBone: (id) => set((state) => ({
    selectedBoneId: id,
    infoPanelOpen: id !== null,
    activeTab: id !== null ? 'info' : state.activeTab,
    activePathologyIndex: null,
    sidebarOpen: id !== null ? true : state.sidebarOpen,
  })),

  hoverBone: (id) => set({ hoveredBoneId: id }),

  lockRegion: (id) => set({
    lockedRegionId: id,
    viewMode: id ? 'region' : 'full',
  }),

  toggleRegionVisibility: (regionId) => set((state) => {
    const newVisible = new Set(state.visibleRegions);
    if (newVisible.has(regionId)) {
      newVisible.delete(regionId);
    } else {
      newVisible.add(regionId);
    }
    return { visibleRegions: newVisible };
  }),

  toggleBoneVisibility: (boneId) => set((state) => {
    const newHidden = new Set(state.hiddenBones);
    if (newHidden.has(boneId)) {
      newHidden.delete(boneId);
    } else {
      newHidden.add(boneId);
    }
    return { hiddenBones: newHidden };
  }),

  showAllRegions: () => set({ visibleRegions: new Set(ALL_REGIONS), hiddenBones: new Set() }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setInfoPanelOpen: (open) => set({ infoPanelOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setCameraPreset: (position, target) => set({ cameraPosition: position, cameraTarget: target }),

  toggleMuscleMode: () => set((state) => ({ muscleMode: !state.muscleMode })),
  setMuscleOpacity: (opacity) => set({ muscleOpacity: opacity }),

  toggleLabelMode: () => set((state) => ({ labelMode: !state.labelMode })),
  toggleXrayMode: () => set((state) => ({ xrayMode: !state.xrayMode })),

  setActiveJointPreset: (id) => set({ activeJointPreset: id }),
  setActivePathology: (index) => set({ activePathologyIndex: index }),

  setShowOnboarding: (show) => set({ showOnboarding: show }),
  setModelLoaded: (loaded) => set({ modelLoaded: loaded }),

  resetView: () => set({
    selectedBoneId: null,
    hoveredBoneId: null,
    lockedRegionId: null,
    visibleRegions: new Set(ALL_REGIONS),
    hiddenBones: new Set(),
    viewMode: 'full',
    cameraTarget: null,
    cameraPosition: null,
    infoPanelOpen: false,
    muscleMode: false,
    labelMode: false,
    xrayMode: false,
    activeJointPreset: null,
    activePathologyIndex: null,
  }),
}));
