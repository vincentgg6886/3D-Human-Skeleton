/*
 * TopHUD.tsx - Top status bar with bone name, region info, crosshair
 * Design: Minimal HUD overlay with monospace readouts
 * Mobile: Simplified display on small screens
 */

import { useAppStore } from '@/lib/store';
import { BONE_INFO, BONE_GEOMETRIES } from '@/lib/skeletonData';
import { BONE_PATHOLOGIES } from '@/lib/pathologyData';
import { Crosshair, Lock, Scan, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopHUD() {
  const selectedBoneId = useAppStore((s) => s.selectedBoneId);
  const hoveredBoneId = useAppStore((s) => s.hoveredBoneId);
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);

  const displayBoneId = selectedBoneId || hoveredBoneId;
  const info = displayBoneId ? BONE_INFO[displayBoneId] : null;
  const bone = displayBoneId ? BONE_GEOMETRIES.find((b) => b.id === displayBoneId) : null;
  const pathologyCount = displayBoneId ? (BONE_PATHOLOGIES[displayBoneId]?.length || 0) : 0;

  return (
    <>
      {/* Top center - Title */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-600 tracking-[0.25em] uppercase">
            OrthoVis 3D
          </span>
          {lockedRegionId && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 text-[10px] font-mono text-cyan-400/80 px-2 py-0.5 rounded-full bg-cyan-400/5 border border-cyan-400/20 pulse-glow"
            >
              <Lock size={9} />
              区域锁定
            </motion.span>
          )}
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
                {bone && (
                  <div>
                    坐标: <span className="text-cyan-400/70">
                      [{bone.position.map((v) => v.toFixed(1)).join(', ')}]
                    </span>
                  </div>
                )}
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

      {/* Top right - Stats */}
      <div className="absolute top-3 right-4 z-30 pointer-events-none">
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-600">
          <div className="flex items-center gap-1">
            <Scan size={10} />
            <span>{BONE_GEOMETRIES.length} 骨骼</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <span>WebGL 3D</span>
        </div>
      </div>
    </>
  );
}
