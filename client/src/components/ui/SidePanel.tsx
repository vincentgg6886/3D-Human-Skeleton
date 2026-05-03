/*
 * SidePanel.tsx - Right side information panel
 * V1.1: Smart collapse, accordion hierarchy, reduced density
 * V1.2: 6-level gray hierarchy, refined typography
 * V1.5: Joint view tab, enhanced pathology data
 */

import { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { BONE_INFO, REGIONS } from '@/lib/skeletonData';
import { BONE_PATHOLOGIES } from '@/lib/pathologyData';
import { getPathologyEffect } from '@/lib/pathologyEffects';
import { JOINT_PRESETS, JOINT_PRESET_MAP } from '@/lib/jointPresets';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ChevronRight, Eye, EyeOff,
  Lock, Unlock, Activity, AlertTriangle, Bone, Info,
  Heart,
} from 'lucide-react';

// ============================================================
// Hierarchy Tab - Accordion-based region navigation
// ============================================================
function HierarchyTab() {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const selectBone = useAppStore((s) => s.selectBone);
  const visibleRegions = useAppStore((s) => s.visibleRegions);
  const toggleRegionVisibility = useAppStore((s) => s.toggleRegionVisibility);
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);
  const lockRegion = useAppStore((s) => s.lockRegion);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  const filteredRegions = useMemo(() => {
    if (!searchQuery.trim()) return REGIONS;
    const q = searchQuery.toLowerCase();
    return REGIONS.map((region) => ({
      ...region,
      bones: region.bones.filter((boneId) => {
        const info = BONE_INFO[boneId];
        if (!info) return false;
        return (
          info.nameCn.toLowerCase().includes(q) ||
          info.name.toLowerCase().includes(q) ||
          boneId.toLowerCase().includes(q)
        );
      }),
    })).filter((r) => r.bones.length > 0);
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索骨骼名称..."
            className="w-full pl-8 pr-8 py-2 text-[12px] bg-white/[0.03] border border-white/8 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/30 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Region list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-1">
        {filteredRegions.map((region) => {
          const isExpanded = expandedRegion === region.id || !!searchQuery;
          const isVisible = visibleRegions.has(region.id);
          const isLocked = lockedRegionId === region.id;

          return (
            <div key={region.id} className="mb-0.5">
              {/* Region header */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 group ${
                  isLocked
                    ? 'bg-cyan-400/8 border border-cyan-400/15'
                    : 'hover:bg-white/[0.03] border border-transparent'
                }`}
                onClick={() => setExpandedRegion(isExpanded && !searchQuery ? null : region.id)}
              >
                <ChevronRight
                  size={12}
                  className={`text-slate-600 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                />
                <span className={`text-[12px] font-medium flex-1 ${isLocked ? 'text-cyan-300' : 'text-slate-300'}`}>
                  {region.nameCn}
                </span>
                <span className="text-[9px] font-mono text-slate-600 mr-1">
                  {region.bones.length}
                </span>

                {/* Region controls */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleRegionVisibility(region.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
                >
                  {isVisible ? <Eye size={11} className="text-slate-500" /> : <EyeOff size={11} className="text-slate-600" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); lockRegion(isLocked ? null : region.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
                >
                  {isLocked ? <Unlock size={11} className="text-cyan-400" /> : <Lock size={11} className="text-slate-500" />}
                </button>
              </div>

              {/* Bone list */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-5 pr-1 py-0.5">
                      {region.bones.map((boneId) => {
                        const info = BONE_INFO[boneId];
                        if (!info) return null;
                        const isSelected = selectedBoneId === boneId;
                        return (
                          <button
                            key={boneId}
                            onClick={() => selectBone(isSelected ? null : boneId)}
                            className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] transition-all duration-150 ${
                              isSelected
                                ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                            }`}
                          >
                            {info.nameCn}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Info Tab - Bone detail information
// ============================================================
function InfoTab() {
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const muscleMode = useAppStore((s) => s.muscleMode);
  const muscleOpacity = useAppStore((s) => s.muscleOpacity);
  const setMuscleOpacity = useAppStore((s) => s.setMuscleOpacity);
  const toggleMuscleMode = useAppStore((s) => s.toggleMuscleMode);
  const bone = selectedBoneId ? BONE_INFO[selectedBoneId] : null;

  if (!bone) {
    return (
      <div className="px-3 space-y-4">
        <div className="flex flex-col items-center justify-center text-center px-6 py-12">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-3">
            <Info size={20} className="text-slate-600" />
          </div>
          <p className="text-[12px] text-slate-500">点击3D模型中的骨骼</p>
          <p className="text-[11px] text-slate-600 mt-1">查看详细解剖学信息</p>
        </div>

        {/* Muscle controls always visible */}
        <MuscleControls
          muscleMode={muscleMode}
          muscleOpacity={muscleOpacity}
          onToggle={toggleMuscleMode}
          onOpacityChange={setMuscleOpacity}
        />
      </div>
    );
  }

  return (
    <div className="px-3 space-y-3 overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="px-1">
        <h3 className="text-[15px] font-semibold text-slate-100">{bone.nameCn}</h3>
        <p className="text-[11px] font-mono text-cyan-400/60 mt-0.5">{bone.name}</p>
      </div>

      {/* Location */}
      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
        <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">解剖位置</div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500">区域</span>
            <div className="text-slate-200 mt-0.5">{bone.regionCn}</div>
          </div>
          <div>
            <span className="text-slate-500">分区</span>
            <div className="text-slate-200 mt-0.5">{bone.subRegionCn}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
        <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">描述</div>
        <p className="text-[11px] text-slate-300 leading-relaxed">{bone.descriptionCn}</p>
      </div>

      {/* Joints */}
      {bone.joints && bone.joints.length > 0 && (
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">相关关节</div>
          <div className="flex flex-wrap gap-1">
            {bone.joints.map((j, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-400/8 text-cyan-300 border border-cyan-400/15">
                {j}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ROM Data */}
      {bone.romData && bone.romData.length > 0 && (
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">关节活动度 (ROM)</div>
          <div className="space-y-1.5">
            {bone.romData.map((rom, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{rom.movement}</span>
                <span className="font-mono text-cyan-300">{rom.range}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Muscle controls */}
      <MuscleControls
        muscleMode={muscleMode}
        muscleOpacity={muscleOpacity}
        onToggle={toggleMuscleMode}
        onOpacityChange={setMuscleOpacity}
      />
    </div>
  );
}

// ============================================================
// Muscle Controls - Reusable muscle mode settings
// ============================================================
function MuscleControls({ muscleMode, muscleOpacity, onToggle, onOpacityChange }: {
  muscleMode: boolean;
  muscleOpacity: number;
  onToggle: () => void;
  onOpacityChange: (v: number) => void;
}) {
  return (
    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Heart size={12} className={muscleMode ? 'text-red-400' : 'text-slate-600'} />
          <span className="text-[11px] font-medium text-slate-300">肌肉层</span>
        </div>
        <button
          onClick={onToggle}
          className={`text-[9px] px-2 py-0.5 rounded-md transition-colors ${
            muscleMode
              ? 'bg-red-400/15 text-red-300 border border-red-400/20'
              : 'bg-white/5 text-slate-500 border border-white/5'
          }`}
        >
          {muscleMode ? '已开启' : '关闭'}
        </button>
      </div>
      {muscleMode && (
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-600 w-8">透明</span>
          <Slider
            value={[muscleOpacity]}
            onValueChange={([v]) => onOpacityChange(v)}
            min={0.1}
            max={0.9}
            step={0.05}
            className="flex-1"
          />
          <span className="text-[9px] text-slate-600 w-8 text-right">实体</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Motion Tab - ROM and movement data
// ============================================================
function MotionTab() {
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const bone = selectedBoneId ? BONE_INFO[selectedBoneId] : null;

  if (!bone) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-3">
          <Activity size={20} className="text-slate-600" />
        </div>
        <p className="text-[12px] text-slate-500">选择骨骼查看运动数据</p>
        <p className="text-[11px] text-slate-600 mt-1">包含关节活动度 (ROM) 信息</p>
      </div>
    );
  }

  return (
    <div className="px-3 space-y-3 overflow-y-auto scrollbar-thin">
      <div className="px-1">
        <h3 className="text-[14px] font-semibold text-slate-100">{bone.nameCn}</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">运动学数据</p>
      </div>

      {bone.romData && bone.romData.length > 0 ? (
        <div className="space-y-2">
          {bone.romData.map((rom, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-slate-200">{rom.movement}</span>
                <span className="text-[12px] font-mono text-cyan-400">{rom.range}</span>
              </div>
              {/* Visual bar */}
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                  style={{ width: `${Math.min(parseInt(rom.range) / 180 * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center">
          <p className="text-[11px] text-slate-500">该骨骼无独立运动数据</p>
          <p className="text-[10px] text-slate-600 mt-1">请查看相关关节的运动信息</p>
        </div>
      )}

      {bone.joints && bone.joints.length > 0 && (
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">参与关节</div>
          <div className="flex flex-wrap gap-1">
            {bone.joints.map((j, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-400/8 text-cyan-300 border border-cyan-400/15">
                {j}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Pathology Tab - Disease visualization
// ============================================================
function PathologyTab() {
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const activePathologyIndex = useAppStore((s) => s.activePathologyIndex);
  const setActivePathology = useAppStore((s) => s.setActivePathology);

  const pathologies = selectedBoneId ? BONE_PATHOLOGIES[selectedBoneId] : undefined;

  if (!selectedBoneId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-3">
          <AlertTriangle size={20} className="text-slate-600" />
        </div>
        <p className="text-[12px] text-slate-500">选择骨骼查看常见病症</p>
        <p className="text-[11px] text-slate-600 mt-1">激活病症可在3D模型上显示病变效果</p>
      </div>
    );
  }

  const bone = BONE_INFO[selectedBoneId];

  return (
    <div className="px-3 space-y-3 overflow-y-auto scrollbar-thin">
      <div className="px-1">
        <h3 className="text-[14px] font-semibold text-slate-100">{bone?.nameCn || selectedBoneId}</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">常见骨科病症</p>
      </div>

      {pathologies && pathologies.length > 0 ? (
        <div className="space-y-2">
          {pathologies.map((p, i) => {
            const isActive = activePathologyIndex === i;
            const effect = getPathologyEffect(p.name);
            return (
              <button
                key={i}
                onClick={() => setActivePathology(isActive ? null : i)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  isActive
                    ? 'border-red-400/30 bg-red-400/8'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/8'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: effect?.color || '#ef4444' }} />
                      )}
                      <span className={`text-[12px] font-medium ${isActive ? 'text-red-300' : 'text-slate-200'}`}>
                        {p.nameCn}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-600 mt-0.5">{p.name}</p>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium flex-shrink-0 ${
                    isActive ? 'bg-red-400/20 text-red-300' : 'bg-white/5 text-slate-500'
                  }`}>
                    {isActive ? '已激活' : '查看'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{p.descriptionCn}</p>
                {p.clinicalNotesCn && (
                  <p className="text-[10px] text-slate-500 mt-1.5 italic leading-relaxed">
                    {p.clinicalNotesCn}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center">
          <p className="text-[11px] text-slate-500">该骨骼暂无病症数据</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Joints Tab - V1.5 Joint view presets
// ============================================================
function JointsTab() {
  const activeJointPreset = useAppStore((s) => s.activeJointPreset);
  const setActiveJointPreset = useAppStore((s) => s.setActiveJointPreset);
  const setCameraPreset = useAppStore((s) => s.setCameraPreset);
  const selectBone = useAppStore((s) => s.selectBone);
  const lockRegion = useAppStore((s) => s.lockRegion);

  const handleJointClick = (preset: typeof JOINT_PRESETS[0]) => {
    const isActive = activeJointPreset === preset.id;
    if (isActive) {
      setActiveJointPreset(null);
      lockRegion(null);
      selectBone(null);
    } else {
      setActiveJointPreset(preset.id);
      setCameraPreset(preset.cameraPosition, preset.cameraTarget);
      if (preset.bones.length > 0) {
        selectBone(preset.bones[0]);
      }
    }
  };

  const jointPairs = [
    { label: '肩关节', joints: JOINT_PRESETS.filter(j => j.id.startsWith('shoulder')) },
    { label: '肘关节', joints: JOINT_PRESETS.filter(j => j.id.startsWith('elbow')) },
    { label: '髋关节', joints: JOINT_PRESETS.filter(j => j.id.startsWith('hip')) },
    { label: '膝关节', joints: JOINT_PRESETS.filter(j => j.id.startsWith('knee')) },
  ];

  return (
    <div className="px-3 space-y-3 overflow-y-auto scrollbar-thin">
      <div className="px-1">
        <h3 className="text-[14px] font-semibold text-slate-100">关节视图</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">快速聚焦8大关节，查看骨骼结构关系</p>
      </div>

      {jointPairs.map((pair) => (
        <div key={pair.label}>
          <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider px-1 mb-1.5">{pair.label}</div>
          <div className="grid grid-cols-2 gap-1.5">
            {pair.joints.map((joint) => {
              const isActive = activeJointPreset === joint.id;
              return (
                <button
                  key={joint.id}
                  onClick={() => handleJointClick(joint)}
                  className={`p-2.5 rounded-lg border text-left transition-all duration-200 ${
                    isActive
                      ? 'border-amber-400/30 bg-amber-400/8'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/8'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Bone size={12} className={isActive ? 'text-amber-400' : 'text-slate-500'} />
                    <span className={`text-[11px] font-medium ${isActive ? 'text-amber-300' : 'text-slate-300'}`}>
                      {joint.nameCn}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-600 mt-0.5">{joint.nameEn}</div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Active joint detail */}
      <AnimatePresence>
        {activeJointPreset && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {(() => {
              const joint = JOINT_PRESET_MAP[activeJointPreset];
              if (!joint) return null;
              return (
                <div className="p-3 rounded-lg bg-amber-400/5 border border-amber-400/15">
                  <div className="text-[12px] font-medium text-amber-300 mb-1.5">{joint.nameCn}</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-2">{joint.description}</p>
                  <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider mb-1">相关骨骼</div>
                  <div className="flex flex-wrap gap-1">
                    {joint.bones.map((boneId) => {
                      const info = BONE_INFO[boneId];
                      return (
                        <button
                          key={boneId}
                          onClick={() => selectBone(boneId)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400/8 text-amber-300 border border-amber-400/15 hover:bg-amber-400/15 transition-colors"
                        >
                          {info?.nameCn || boneId}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// Main SidePanel
// ============================================================
export default function SidePanel() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const activeTab = useAppStore((s) => s.activeTab);

  const tabTitles: Record<string, string> = {
    hierarchy: '解剖层级',
    info: '骨骼信息',
    motion: '运动数据',
    pathology: '常见病症',
    joints: '关节视图',
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="absolute right-0 top-0 bottom-0 w-[300px] sm:w-[320px] z-30 glass-strong border-l border-white/5 flex flex-col"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <h2 className="text-[13px] font-semibold text-slate-200">
              {tabTitles[activeTab] || '面板'}
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/8 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden py-3">
            {activeTab === 'hierarchy' && <HierarchyTab />}
            {activeTab === 'info' && <InfoTab />}
            {activeTab === 'motion' && <MotionTab />}
            {activeTab === 'pathology' && <PathologyTab />}
            {activeTab === 'joints' && <JointsTab />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
