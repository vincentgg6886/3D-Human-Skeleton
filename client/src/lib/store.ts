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

interface AppState {
  // Selection
  selectedBoneId: string | null;
  hoveredBoneId: string | null;
  lockedRegionId: string | null;

  // Visibility
  visibleRegions: Set<string>;
  hiddenBones: Set<string>;

  // UI State
  sidebarOpen: boolean;
  infoPanelOpen: boolean;
  searchQuery: string;
  activeTab: 'hierarchy' | 'info' | 'motion' | 'pathology';

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
  setActiveTab: (tab: 'hierarchy' | 'info' | 'motion' | 'pathology') => void;
  setCameraTarget: (target: [number, number, number] | null) => void;
  setCameraPreset: (position: [number, number, number], target: [number, number, number]) => void;
  resetView: () => void;
}

const ALL_REGIONS = new Set([
  'skull', 'spine', 'thorax', 'upper-limb-left', 'upper-limb-right',
  'pelvis', 'lower-limb-left', 'lower-limb-right'
]);

export const useAppStore = create<AppState>((set) => ({
  selectedBoneId: null,
  hoveredBoneId: null,
  lockedRegionId: null,
  visibleRegions: new Set(ALL_REGIONS),
  hiddenBones: new Set<string>(),
  sidebarOpen: true,
  infoPanelOpen: false,
  searchQuery: '',
  activeTab: 'hierarchy' as 'hierarchy' | 'info' | 'motion' | 'pathology',
  viewMode: 'full',
  cameraTarget: null,
  cameraPosition: null,

  selectBone: (id) => set((state) => ({
    selectedBoneId: id,
    infoPanelOpen: id !== null,
    activeTab: id !== null ? 'info' : state.activeTab,
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
  }),
}));
