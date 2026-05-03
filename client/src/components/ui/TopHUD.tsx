/*
 * TopHUD.tsx - Top status bar with brand identity and context info
 * V1.2: Refined typography hierarchy, mode indicators, context breadcrumb
 */

import { useAppStore } from '@/lib/store';
import { BONE_INFO, TOTAL_BONE_COUNT } from '@/lib/skeletonData';
import { BONE_PATHOLOGIES } from '@/lib/pathologyData';
import { JOINT_PRESET_MAP } from '@/lib/jointPresets';
import { Crosshair, Lock, Eye, Heart, Tag, Bone, AlertTriangle, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopHUD() {
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const hoveredBoneId = useAppStore((s) => s.hoveredBoneId);
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);
  const muscleMode = useAppStore((s) => s.muscleMode);
  const labelMode = useAppStore((s) => s.labelMode);
  const activeJointPreset = useAppStore((s) => s.activeJointPreset);
  const xrayMode = useAppStore((s) => s.xrayMode);

  const displayBoneId = selectedBoneId || hoveredBoneId;
  const info = displayBoneId ? BONE_INFO[displayBoneId] : null;
  const pathologyCount = displayBoneId ? (BONE_PATHOLOGIES[displayBoneId]?.length || 0) : 0;
  const joint = activeJointPreset ? JOINT_PRESET_MAP[activeJointPreset] : null;

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Left: Brand + context */}
          <div className="flex items-center gap-2.5">
            {/* Brand - hidden on mobile since toolbar has logo */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-[13px] font-semibold text-slate-300 tracking-wide">OrthoVis</span>
              <span className="text-[10px] font-mono text-cyan-400/60">3D</span>
            </div>

            {/* Context breadcrumb */}
            {(joint || lockedRegionId) && (
              <div className="flex items-center gap-1.5 sm:ml-1 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-sm border border-white/5">
                {joint ? (
                  <>
                    <Bone size={11} className="text-amber-400" />
                    <span className="text-[11px] text-amber-300 font-medium">{joint.nameCn}</span>
                  </>
                ) : lockedRegionId ? (
                  <>
                    <Lock size={10} className="text-cyan-400" />
                    <span className="text-[11px] text-cyan-300 font-medium">区域锁定</span>
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Right: Mode indicators */}
          <div className="flex items-center gap-1.5">
            {muscleMode && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-400/10 border border-red-400/20">
                <Heart size={10} className="text-red-400" />
                <span className="text-[9px] text-red-300 font-medium hidden sm:inline">肌肉</span>
              </div>
            )}
            {labelMode && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-400/10 border border-emerald-400/20">
                <Tag size={10} className="text-emerald-400" />
                <span className="text-[9px] text-emerald-300 font-medium hidden sm:inline">标注</span>
              </div>
            )}
            {xrayMode && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-400/10 border border-blue-400/20">
                <Scan size={10} className="text-blue-400" />
                <span className="text-[9px] text-blue-300 font-medium hidden sm:inline">X光</span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5">
              <Eye size={10} className="text-slate-500" />
              <span className="text-[9px] text-slate-600 font-mono">{TOTAL_BONE_COUNT} bones</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom center - Bone info readout */}
      <AnimatePresence>
        {info && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none max-w-[90vw]"
          >
            <div className="glass rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Crosshair size={14} className="text-cyan-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-slate-100 truncate">{info.nameCn}</div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-cyan-400/70 truncate">{info.name}</div>
                </div>
              </div>

              <div className="w-px h-8 bg-white/10 flex-shrink-0 hidden sm:block" />

              <div className="text-[10px] font-mono text-slate-500 space-y-0.5 hidden sm:block">
                <div>
                  区域: <span className="text-slate-300">{info.regionCn}</span>
                </div>
                <div>
                  分区: <span className="text-slate-400">{info.subRegionCn}</span>
                </div>
              </div>

              {pathologyCount > 0 && (
                <>
                  <div className="w-px h-8 bg-white/10 flex-shrink-0 hidden sm:block" />
                  <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400/80 hidden sm:flex">
                    <AlertTriangle size={10} />
                    <span>{pathologyCount} 病症</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
