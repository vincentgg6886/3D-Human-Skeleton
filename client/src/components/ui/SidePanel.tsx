/*
 * SidePanel.tsx - Collapsible side panel with hierarchy, info, motion, pathology tabs
 * Design: Glass morphism panel with scientific instrument typography
 */

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { REGIONS, BONE_INFO } from '@/lib/skeletonData';
import { BONE_PATHOLOGIES, SEVERITY_COLORS, SEVERITY_LABELS } from '@/lib/pathologyData';
import { getPathologyEffect } from '@/lib/pathologyEffects';
import { MUSCLE_GROUP_NAMES_CN, MUSCLE_GROUP_COLORS, type MuscleGroup } from '@/lib/muscleFilter';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Search,
  X,
  MapPin,
  Bone,
  Activity,
  AlertTriangle,
  Stethoscope,
  Zap,
  Heart,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// Hierarchy Tab
// ============================================================
function HierarchyTab() {
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set(['skull', 'spine']));
  const visibleRegions = useAppStore((s) => s.visibleRegions);
  const toggleRegionVisibility = useAppStore((s) => s.toggleRegionVisibility);
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const selectBone = useAppStore((s) => s.selectBone);
  const lockRegion = useAppStore((s) => s.lockRegion);
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  const filteredRegions = useMemo(() => {
    if (!searchQuery.trim()) return REGIONS;
    const q = searchQuery.toLowerCase();
    return REGIONS.map((region) => ({
      ...region,
      bones: region.bones.filter((boneId) => {
        const info = BONE_INFO[boneId];
        if (!info) return false;
        return (
          info.name.toLowerCase().includes(q) ||
          info.nameCn.includes(q) ||
          info.id.includes(q)
        );
      }),
    })).filter((r) => r.bones.length > 0);
  }, [searchQuery]);

  const toggleExpand = (regionId: string) => {
    setExpandedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(regionId)) next.delete(regionId);
      else next.add(regionId);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="搜索骨骼..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-8 rounded-md bg-white/5 border border-white/10 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="px-2 pb-4">
          {filteredRegions.map((region) => {
            const isExpanded = expandedRegions.has(region.id);
            const isVisible = visibleRegions.has(region.id);
            const isLocked = lockedRegionId === region.id;

            return (
              <div key={region.id} className="mb-1">
                <div
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer group transition-colors ${
                    isLocked ? 'bg-cyan-400/10' : 'hover:bg-white/5'
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(region.id)}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  <button
                    onClick={() => toggleExpand(region.id)}
                    className="flex-1 text-left text-xs font-medium text-slate-300 truncate"
                  >
                    <span className="text-cyan-400/70 font-mono mr-1.5">{region.bones.length}</span>
                    {region.nameCn}
                    <span className="text-slate-500 ml-1.5 text-[10px]">{region.name}</span>
                  </button>

                  <button
                    onClick={() => lockRegion(isLocked ? null : region.id)}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                      isLocked ? '!opacity-100 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Lock size={12} />
                  </button>

                  <button
                    onClick={() => toggleRegionVisibility(region.id)}
                    className={`transition-colors ${
                      isVisible ? 'text-slate-500 hover:text-slate-300' : 'text-red-400/60'
                    }`}
                  >
                    {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {region.bones.map((boneId) => {
                        const info = BONE_INFO[boneId];
                        if (!info) return null;
                        const isActive = selectedBoneId === boneId;

                        return (
                          <button
                            key={boneId}
                            onClick={() => selectBone(isActive ? null : boneId)}
                            className={`w-full flex items-center gap-2 pl-7 pr-2 py-1 text-left rounded-md transition-all ${
                              isActive
                                ? 'bg-cyan-400/10 text-cyan-300'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`}
                          >
                            <Bone size={11} className={isActive ? 'text-cyan-400' : 'text-slate-600'} />
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] truncate">{info.nameCn}</div>
                              <div className="text-[9px] text-slate-500 font-mono truncate">{info.name}</div>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

// ============================================================
// Info Tab
// ============================================================
function InfoTab() {
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const muscleMode = useAppStore((s) => s.muscleMode);
  const muscleOpacity = useAppStore((s) => s.muscleOpacity);
  const setMuscleOpacity = useAppStore((s) => s.setMuscleOpacity);
  const toggleMuscleMode = useAppStore((s) => s.toggleMuscleMode);
  const info = selectedBoneId ? BONE_INFO[selectedBoneId] : null;

  if (!info) {
    return (
      <ScrollArea className="h-full">
        <div className="flex flex-col items-center justify-center h-64 text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <MapPin size={24} className="text-slate-600" />
          </div>
          <p className="text-sm text-slate-500 mb-1">点击骨骼查看详情</p>
          <p className="text-xs text-slate-600">
            在3D视图中选择任意骨骼，<br />此处将显示其解剖学信息
          </p>
        </div>

        {/* Muscle mode controls always visible */}
        <MuscleControls
          muscleMode={muscleMode}
          muscleOpacity={muscleOpacity}
          onToggle={toggleMuscleMode}
          onOpacityChange={setMuscleOpacity}
        />
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="px-3 pb-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-100">{info.nameCn}</h3>
          <p className="text-xs font-mono text-cyan-400/80">{info.name}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 font-mono">
              {info.regionCn}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
              {info.subRegionCn}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">描述</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{info.descriptionCn}</p>
          <p className="text-[10px] text-slate-500 leading-relaxed italic">{info.description}</p>
        </div>

        {info.joints && info.joints.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">相关关节</h4>
            <div className="flex flex-wrap gap-1.5">
              {info.joints.map((joint, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                >
                  {joint}
                </span>
              ))}
            </div>
          </div>
        )}

        {info.romData && info.romData.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              关节活动度 (ROM)
            </h4>
            <div className="space-y-1">
              {info.romData.map((rom, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-2 py-1.5 rounded-md bg-white/[0.03] border border-white/5"
                >
                  <span className="text-[10px] text-slate-300">{rom.movement}</span>
                  <span className="text-[11px] font-mono text-cyan-400">{rom.range}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Muscle controls in info tab */}
        <MuscleControls
          muscleMode={muscleMode}
          muscleOpacity={muscleOpacity}
          onToggle={toggleMuscleMode}
          onOpacityChange={setMuscleOpacity}
        />
      </div>
    </ScrollArea>
  );
}

// ============================================================
// Muscle Controls Component
// ============================================================
function MuscleControls({
  muscleMode,
  muscleOpacity,
  onToggle,
  onOpacityChange,
}: {
  muscleMode: boolean;
  muscleOpacity: number;
  onToggle: () => void;
  onOpacityChange: (v: number) => void;
}) {
  const muscleGroups: MuscleGroup[] = ['shoulder', 'arm', 'forearm', 'hand', 'hip', 'thigh', 'leg', 'foot'];

  return (
    <div className="px-3 pb-4 space-y-3">
      <div className="w-full h-px bg-white/5" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart size={13} className={muscleMode ? 'text-red-400' : 'text-slate-500'} />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">肌肉模式</span>
        </div>
        <button
          onClick={onToggle}
          className={`w-9 h-5 rounded-full transition-all duration-300 relative ${
            muscleMode ? 'bg-red-400/30' : 'bg-white/10'
          }`}
        >
          <div
            className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${
              muscleMode ? 'left-[18px] bg-red-400' : 'left-0.5 bg-slate-500'
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {muscleMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-3"
          >
            {/* Opacity slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">透明度</span>
                <span className="text-[10px] font-mono text-red-400/80">{Math.round(muscleOpacity * 100)}%</span>
              </div>
              <Slider
                value={[muscleOpacity * 100]}
                onValueChange={(v) => onOpacityChange(v[0] / 100)}
                min={10}
                max={90}
                step={5}
                className="[&_[data-slot=range]]:bg-red-400/50 [&_[data-slot=thumb]]:border-red-400"
              />
            </div>

            {/* Muscle group legend */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500">肌群图例</span>
              <div className="grid grid-cols-2 gap-1">
                {muscleGroups.map((group) => (
                  <div key={group} className="flex items-center gap-1.5 px-1.5 py-1 rounded bg-white/[0.02]">
                    <div
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: MUSCLE_GROUP_COLORS[group] }}
                    />
                    <span className="text-[9px] text-slate-400 truncate">
                      {MUSCLE_GROUP_NAMES_CN[group]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// Motion Tab
// ============================================================
function MotionTab() {
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const info = selectedBoneId ? BONE_INFO[selectedBoneId] : null;

  if (!info || !info.romData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Activity size={24} className="text-slate-600" />
        </div>
        <p className="text-sm text-slate-500 mb-1">选择含关节的骨骼</p>
        <p className="text-xs text-slate-600">
          选择具有关节活动度数据的骨骼，<br />此处将显示运动范围可视化
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="px-3 pb-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-100">{info.nameCn} - 运动学数据</h3>
          <p className="text-xs font-mono text-cyan-400/80">{info.name}</p>
        </div>

        <div className="space-y-3">
          {info.romData.map((rom, i) => {
            const match = rom.range.match(/(\d+)/g);
            const maxVal = match ? parseInt(match[match.length - 1]) : 0;
            const percentage = Math.min((maxVal / 180) * 100, 100);

            return (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">{rom.movement}</span>
                  <span className="text-[11px] font-mono text-cyan-400">{rom.range}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-600 font-mono">
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                </div>
              </div>
            );
          })}
        </div>

        {info.joints && (
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">涉及关节</h4>
            <div className="space-y-1">
              {info.joints.map((joint, i) => (
                <div
                  key={i}
                  className="px-2 py-1.5 rounded-md bg-white/[0.03] border border-white/5 text-[10px] text-slate-300"
                >
                  {joint}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

// ============================================================
// Pathology Tab - 常见骨科病症 with visualization activation
// ============================================================
function PathologyTab() {
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const activePathologyIndex = useAppStore((s) => s.activePathologyIndex);
  const setActivePathology = useAppStore((s) => s.setActivePathology);
  const pathologies = selectedBoneId ? BONE_PATHOLOGIES[selectedBoneId] : null;
  const info = selectedBoneId ? BONE_INFO[selectedBoneId] : null;

  if (!info || !pathologies || pathologies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Stethoscope size={24} className="text-slate-600" />
        </div>
        <p className="text-sm text-slate-500 mb-1">选择骨骼查看病症</p>
        <p className="text-xs text-slate-600">
          选择骨骼后，此处将显示<br />该部位常见的骨科病症信息
        </p>
        <p className="text-[10px] text-slate-600 mt-3 px-4 leading-relaxed">
          点击病症卡片可在3D模型上<br />激活病变可视化效果
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="px-3 pb-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-100">{info.nameCn} - 常见病症</h3>
          <p className="text-xs font-mono text-cyan-400/80">{info.name}</p>
          <p className="text-[10px] text-slate-500 mt-1">
            共 {pathologies.length} 种常见病症 · 点击卡片激活可视化
          </p>
        </div>

        <div className="space-y-2.5">
          {pathologies.map((pathology, i) => {
            const severityStyle = SEVERITY_COLORS[pathology.severity];
            const isActive = activePathologyIndex === i;
            const effect = getPathologyEffect(pathology.name);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActivePathology(isActive ? null : i)}
                className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'bg-white/[0.06] border-2 ring-1'
                    : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.05]'
                }`}
                style={isActive ? {
                  borderColor: effect.emissiveColor + '60',
                  boxShadow: `0 0 12px ${effect.emissiveColor}20`,
                } : undefined}
              >
                {/* Header */}
                <div className="px-3 py-2 flex items-start gap-2">
                  {isActive ? (
                    <Zap
                      size={13}
                      className="mt-0.5 flex-shrink-0 animate-pulse"
                      style={{ color: effect.emissiveColor }}
                    />
                  ) : (
                    <AlertTriangle
                      size={13}
                      className={`mt-0.5 flex-shrink-0 ${severityStyle.text}`}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[11px] font-medium ${isActive ? 'text-slate-100' : 'text-slate-200'}`}>
                        {pathology.nameCn}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full ${severityStyle.bg} ${severityStyle.text} border ${severityStyle.border}`}
                      >
                        {SEVERITY_LABELS[pathology.severity]}
                      </span>
                      {isActive && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10 animate-pulse">
                          可视化中
                        </span>
                      )}
                    </div>
                    <div className="text-[9px] font-mono text-slate-500">{pathology.name}</div>
                  </div>
                </div>

                {/* Description */}
                <div className="px-3 pb-2 space-y-1">
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    {pathology.descriptionCn}
                  </p>
                  {pathology.clinicalNotesCn && (
                    <div className="mt-1.5 px-2 py-1.5 rounded-md bg-amber-400/5 border border-amber-400/10">
                      <p className="text-[10px] text-amber-300/80 leading-relaxed">
                        <span className="font-semibold">临床提示：</span>
                        {pathology.clinicalNotesCn}
                      </p>
                    </div>
                  )}

                  {/* Effect type indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-1.5 px-2 py-1.5 rounded-md border"
                      style={{
                        backgroundColor: effect.emissiveColor + '08',
                        borderColor: effect.emissiveColor + '20',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full animate-pulse"
                          style={{ backgroundColor: effect.emissiveColor }}
                        />
                        <span className="text-[10px] font-medium" style={{ color: effect.emissiveColor }}>
                          病变效果：{effect.labelCn}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-1">
                        骨骼正在显示{effect.labelCn}状态的视觉效果，点击卡片可关闭
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}

// ============================================================
// Main SidePanel
// ============================================================

const TAB_TITLES: Record<string, string> = {
  hierarchy: '解剖层级',
  info: '骨骼信息',
  motion: '运动模拟',
  pathology: '常见病症',
};

export default function SidePanel() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const activeTab = useAppStore((s) => s.activeTab);

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute left-0 sm:left-12 top-0 bottom-12 sm:bottom-0 w-[280px] z-20 glass-strong border-r border-white/5 flex flex-col"
        >
          {/* Panel header */}
          <div className="px-3 pt-3 pb-2 border-b border-white/5">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
              {TAB_TITLES[activeTab] || ''}
            </h2>
          </div>

          {/* Tab content */}
          <div className="flex-1 pt-3 overflow-hidden">
            {activeTab === 'hierarchy' && <HierarchyTab />}
            {activeTab === 'info' && <InfoTab />}
            {activeTab === 'motion' && <MotionTab />}
            {activeTab === 'pathology' && <PathologyTab />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
