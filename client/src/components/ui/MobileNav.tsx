/*
 * MobileNav.tsx - Bottom navigation bar for mobile devices
 * Design: Compact glass bar with tab icons
 */

import { useAppStore } from '@/lib/store';
import {
  Layers,
  Info,
  Activity,
  Stethoscope,
  RotateCcw,
  Heart,
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
  variant?: 'default' | 'muscle';
}) {
  const activeClass = variant === 'muscle'
    ? 'text-red-400 bg-red-400/10'
    : 'text-cyan-400 bg-cyan-400/10';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-all ${
        active ? activeClass : 'text-slate-500'
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

  const handleTabClick = (tab: 'hierarchy' | 'info' | 'motion' | 'pathology') => {
    if (activeTab === tab && sidebarOpen) {
      setSidebarOpen(false);
    } else {
      setActiveTab(tab);
      setSidebarOpen(true);
    }
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
            icon={Activity}
            label="运动"
            active={activeTab === 'motion' && sidebarOpen}
            onClick={() => handleTabClick('motion')}
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
          <button
            onClick={resetView}
            className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-slate-500"
          >
            <RotateCcw size={18} strokeWidth={1.5} />
            <span className="text-[9px] font-mono">重置</span>
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
