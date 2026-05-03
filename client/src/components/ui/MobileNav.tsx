/*
 * MobileNav.tsx - Mobile bottom navigation + view controls
 * V2.0: Full-featured mobile experience
 *   - Primary nav bar with core tabs
 *   - Expandable "more" tray for toggles + view presets + region selector
 *   - Swipe-up gesture via Drawer for side panel content
 */

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Layers,
  Info,
  Activity,
  Stethoscope,
  RotateCcw,
  Heart,
  Tag,
  Bone,
  Scan,
  MoreHorizontal,
  X,
  ChevronUp,
  Focus,
  Eye,
  Move3d,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Mobile Tab Button ── */
function MobileTabButton({
  icon: Icon,
  label,
  active,
  onClick,
  variant = 'default',
  badge,
}: {
  icon: React.ComponentType<any>;
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: 'default' | 'muscle' | 'accent' | 'xray' | 'label';
  badge?: boolean;
}) {
  const activeClassMap: Record<string, string> = {
    default: 'text-cyan-400',
    muscle: 'text-red-400',
    accent: 'text-amber-400',
    xray: 'text-blue-400',
    label: 'text-emerald-400',
  };

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 ${
        active ? activeClassMap[variant] : 'text-slate-500 active:text-slate-300'
      }`}
    >
      {/* Active indicator dot for toggles */}
      {badge && (
        <div className={`absolute top-0.5 right-1 w-[5px] h-[5px] rounded-full transition-all ${
          active
            ? `bg-current shadow-[0_0_4px_currentColor]`
            : 'bg-slate-600/40'
        }`} />
      )}
      <Icon size={18} strokeWidth={1.5} />
      <span className="text-[9px] font-medium">{label}</span>
    </button>
  );
}

/* ── View Preset Button ── */
function PresetButton({ label, onClick, active }: { label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-lg flex items-center justify-center text-[12px] font-semibold transition-all duration-200 ${
        active
          ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/25'
          : 'bg-white/[0.04] text-slate-400 border border-white/6 active:bg-white/8'
      }`}
    >
      {label}
    </button>
  );
}

/* ── Region Button ── */
function RegionButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? 'bg-cyan-400/12 text-cyan-300 border border-cyan-400/25'
          : 'bg-white/[0.04] text-slate-400 border border-white/6 active:bg-white/8'
      }`}
    >
      {label}
    </button>
  );
}

const VIEW_PRESETS = [
  { label: '前', position: [0, 4, 10] as [number, number, number] },
  { label: '后', position: [0, 4, -10] as [number, number, number] },
  { label: '左', position: [-10, 4, 0] as [number, number, number] },
  { label: '右', position: [10, 4, 0] as [number, number, number] },
  { label: '上', position: [0, 16, 0.1] as [number, number, number] },
];

const REGIONS = [
  { id: 'skull', label: '颅骨' },
  { id: 'spine', label: '脊柱' },
  { id: 'thorax', label: '胸廓' },
  { id: 'upper-limb-right', label: '右上肢' },
  { id: 'upper-limb-left', label: '左上肢' },
  { id: 'pelvis', label: '骨盆' },
  { id: 'lower-limb-right', label: '右下肢' },
  { id: 'lower-limb-left', label: '左下肢' },
];

export default function MobileNav() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const resetView = useAppStore((s) => s.resetView);
  const muscleMode = useAppStore((s) => s.muscleMode);
  const toggleMuscleMode = useAppStore((s) => s.toggleMuscleMode);
  const labelMode = useAppStore((s) => s.labelMode);
  const toggleLabelMode = useAppStore((s) => s.toggleLabelMode);
  const xrayMode = useAppStore((s) => s.xrayMode);
  const toggleXrayMode = useAppStore((s) => s.toggleXrayMode);
  const setCameraPreset = useAppStore((s) => s.setCameraPreset);
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);
  const lockRegion = useAppStore((s) => s.lockRegion);
  const [moreOpen, setMoreOpen] = useState(false);

  const handleTabClick = (tab: 'hierarchy' | 'info' | 'motion' | 'pathology' | 'joints') => {
    if (activeTab === tab && sidebarOpen) {
      setSidebarOpen(false);
    } else {
      setActiveTab(tab);
      setSidebarOpen(true);
    }
    setMoreOpen(false);
  };

  return (
    <>
      {/* Mobile bottom nav - only visible on small screens */}
      <div className="sm:hidden absolute bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/5">
        {/* Expandable more tray */}
        <AnimatePresence>
          {moreOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden border-b border-white/5"
            >
              <div className="px-3 py-3 space-y-3">
                {/* Display mode toggles */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Eye size={10} className="text-slate-500" />
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">显示模式</span>
                  </div>
                  <div className="flex gap-2">
                    <MobileTabButton
                      icon={Heart}
                      label="肌肉"
                      active={muscleMode}
                      onClick={() => toggleMuscleMode()}
                      variant="muscle"
                      badge
                    />
                    <MobileTabButton
                      icon={Scan}
                      label="X光"
                      active={xrayMode}
                      onClick={() => toggleXrayMode()}
                      variant="xray"
                      badge
                    />
                    <MobileTabButton
                      icon={Tag}
                      label="标注"
                      active={labelMode}
                      onClick={() => toggleLabelMode()}
                      variant="label"
                      badge
                    />
                    <MobileTabButton
                      icon={Activity}
                      label="运动"
                      active={activeTab === 'motion' && sidebarOpen}
                      onClick={() => handleTabClick('motion')}
                    />
                    <button
                      onClick={() => { resetView(); setMoreOpen(false); }}
                      className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-slate-500 active:text-slate-300 transition-all"
                    >
                      <RotateCcw size={18} strokeWidth={1.5} />
                      <span className="text-[9px] font-medium">重置</span>
                    </button>
                  </div>
                </div>

                {/* View presets */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Move3d size={10} className="text-slate-500" />
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">视角预设</span>
                  </div>
                  <div className="flex gap-1.5">
                    {VIEW_PRESETS.map((preset) => (
                      <PresetButton
                        key={preset.label}
                        label={preset.label}
                        onClick={() => setCameraPreset(preset.position, [0, 4, 0])}
                      />
                    ))}
                  </div>
                </div>

                {/* Region selector */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Focus size={10} className="text-slate-500" />
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">区域聚焦</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {REGIONS.map((region) => (
                      <RegionButton
                        key={region.id}
                        label={region.label}
                        active={lockedRegionId === region.id}
                        onClick={() => lockRegion(lockedRegionId === region.id ? null : region.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary nav bar */}
        <div className="flex items-center justify-around px-1 py-1 safe-area-bottom">
          <MobileTabButton
            icon={Layers}
            label="层级"
            active={activeTab === 'hierarchy' && sidebarOpen}
            onClick={() => handleTabClick('hierarchy')}
          />
          <MobileTabButton
            icon={Info}
            label="信息"
            active={activeTab === 'info' && sidebarOpen}
            onClick={() => handleTabClick('info')}
          />
          <MobileTabButton
            icon={Bone}
            label="关节"
            active={activeTab === 'joints' && sidebarOpen}
            onClick={() => handleTabClick('joints')}
            variant="accent"
          />
          <MobileTabButton
            icon={Stethoscope}
            label="病症"
            active={activeTab === 'pathology' && sidebarOpen}
            onClick={() => handleTabClick('pathology')}
          />

          {/* More menu button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 ${
              moreOpen ? 'text-cyan-400' : 'text-slate-500 active:text-slate-300'
            }`}
          >
            {moreOpen ? (
              <X size={18} strokeWidth={1.5} />
            ) : (
              <ChevronUp size={18} strokeWidth={1.5} />
            )}
            <span className="text-[9px] font-medium">{moreOpen ? '收起' : '更多'}</span>
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sm:hidden fixed inset-0 bg-black/40 z-[35]"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
