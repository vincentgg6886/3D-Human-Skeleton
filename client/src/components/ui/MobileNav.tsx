/*
 * MobileNav.tsx - Bottom navigation bar for mobile devices
 * V1.5: Added joints, label, xray mode toggles via expandable menu
 * Design: Compact glass bar with tab icons
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
  Bone,
  Tag,
  Scan,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MobileTabButton({
  icon: Icon,
  label,
  active,
  onClick,
  variant = 'default',
}: {
  icon: React.ComponentType<any>;
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: 'default' | 'muscle' | 'accent' | 'xray' | 'label';
}) {
  const activeClassMap: Record<string, string> = {
    default: 'text-cyan-400 bg-cyan-400/10',
    muscle: 'text-red-400 bg-red-400/10',
    accent: 'text-amber-400 bg-amber-400/10',
    xray: 'text-blue-400 bg-blue-400/10',
    label: 'text-emerald-400 bg-emerald-400/10',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all ${
        active ? activeClassMap[variant] : 'text-slate-500'
      }`}
    >
      <Icon size={18} strokeWidth={1.5} />
      <span className="text-[9px] font-mono">{label}</span>
    </button>
  );
}

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
          <MobileTabButton
            icon={Heart}
            label="肌肉"
            active={muscleMode}
            onClick={toggleMuscleMode}
            variant="muscle"
          />
          {/* More menu button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all ${
              moreOpen ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-500'
            }`}
          >
            {moreOpen ? <X size={18} strokeWidth={1.5} /> : <MoreHorizontal size={18} strokeWidth={1.5} />}
            <span className="text-[9px] font-mono">{moreOpen ? '关闭' : '更多'}</span>
          </button>
        </div>

        {/* Expandable more menu */}
        <AnimatePresence>
          {moreOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/5"
            >
              <div className="flex items-center justify-around px-2 py-2">
                <MobileTabButton
                  icon={Activity}
                  label="运动"
                  active={activeTab === 'motion' && sidebarOpen}
                  onClick={() => handleTabClick('motion')}
                />
                <MobileTabButton
                  icon={Scan}
                  label="X光"
                  active={xrayMode}
                  onClick={() => { toggleXrayMode(); setMoreOpen(false); }}
                  variant="xray"
                />
                <MobileTabButton
                  icon={Tag}
                  label="标注"
                  active={labelMode}
                  onClick={() => { toggleLabelMode(); setMoreOpen(false); }}
                  variant="label"
                />
                <button
                  onClick={() => { resetView(); setMoreOpen(false); }}
                  className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-slate-500"
                >
                  <RotateCcw size={18} strokeWidth={1.5} />
                  <span className="text-[9px] font-mono">重置</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
