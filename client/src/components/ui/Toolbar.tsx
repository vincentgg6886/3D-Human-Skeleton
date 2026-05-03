/*
 * Toolbar.tsx - Left sidebar toolbar with labeled icons
 * V1.1: Icon + text labels (width 64px), grouped sections
 * V1.2: Refined visual hierarchy, active states with color coding
 */

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
  HelpCircle,
  Move3d,
} from 'lucide-react';

interface ToolButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  active?: boolean;
  onClick: () => void;
  variant?: 'default' | 'muscle' | 'accent' | 'label';
}

function ToolButton({ icon: Icon, label, active, onClick, variant = 'default' }: ToolButtonProps) {
  const colorMap: Record<string, { active: string; idle: string }> = {
    default: {
      active: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
      idle: 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border-transparent',
    },
    muscle: {
      active: 'text-red-400 bg-red-400/10 border-red-400/25',
      idle: 'text-slate-500 hover:text-red-300 hover:bg-red-400/5 border-transparent',
    },
    accent: {
      active: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
      idle: 'text-slate-500 hover:text-amber-300 hover:bg-amber-400/5 border-transparent',
    },
    label: {
      active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
      idle: 'text-slate-500 hover:text-emerald-300 hover:bg-emerald-400/5 border-transparent',
    },
  };

  const colors = colorMap[variant];

  return (
    <button
      onClick={onClick}
      className={`relative w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg border transition-all duration-200 ${
        active ? colors.active : colors.idle
      }`}
    >
      <Icon size={17} strokeWidth={1.6} />
      <span className="text-[9px] font-medium leading-tight tracking-wide">{label}</span>
    </button>
  );
}

export default function Toolbar() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const resetView = useAppStore((s) => s.resetView);
  const muscleMode = useAppStore((s) => s.muscleMode);
  const toggleMuscleMode = useAppStore((s) => s.toggleMuscleMode);
  const labelMode = useAppStore((s) => s.labelMode);
  const toggleLabelMode = useAppStore((s) => s.toggleLabelMode);
  const setShowOnboarding = useAppStore((s) => s.setShowOnboarding);

  const handleTabClick = (tab: typeof activeTab) => {
    if (activeTab === tab && sidebarOpen) {
      setSidebarOpen(false);
    } else {
      setActiveTab(tab);
      setSidebarOpen(true);
    }
  };

  return (
    <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-[64px]">
      <div className="glass-strong rounded-xl px-1 py-2 flex flex-col gap-0.5">
        {/* Logo */}
        <div className="flex justify-center mb-1">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Move3d size={16} className="text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Section: Navigation */}
        <div className="px-1 mt-1 mb-0.5">
          <div className="text-[7px] font-mono text-slate-600 uppercase tracking-[0.15em] text-center">导航</div>
        </div>
        <ToolButton
          icon={Layers}
          label="层级"
          active={activeTab === 'hierarchy' && sidebarOpen}
          onClick={() => handleTabClick('hierarchy')}
        />
        <ToolButton
          icon={Info}
          label="信息"
          active={activeTab === 'info' && sidebarOpen}
          onClick={() => handleTabClick('info')}
        />
        <ToolButton
          icon={Bone}
          label="关节"
          active={activeTab === 'joints' && sidebarOpen}
          onClick={() => handleTabClick('joints')}
          variant="accent"
        />

        {/* Divider */}
        <div className="mx-2 my-1 h-px bg-white/5" />

        {/* Section: Clinical */}
        <div className="px-1 mb-0.5">
          <div className="text-[7px] font-mono text-slate-600 uppercase tracking-[0.15em] text-center">临床</div>
        </div>
        <ToolButton
          icon={Activity}
          label="运动"
          active={activeTab === 'motion' && sidebarOpen}
          onClick={() => handleTabClick('motion')}
        />
        <ToolButton
          icon={Stethoscope}
          label="病症"
          active={activeTab === 'pathology' && sidebarOpen}
          onClick={() => handleTabClick('pathology')}
        />

        {/* Divider */}
        <div className="mx-2 my-1 h-px bg-white/5" />

        {/* Section: Display modes */}
        <div className="px-1 mb-0.5">
          <div className="text-[7px] font-mono text-slate-600 uppercase tracking-[0.15em] text-center">显示</div>
        </div>
        <ToolButton
          icon={Heart}
          label="肌肉"
          active={muscleMode}
          onClick={toggleMuscleMode}
          variant="muscle"
        />
        <ToolButton
          icon={Tag}
          label="标注"
          active={labelMode}
          onClick={toggleLabelMode}
          variant="label"
        />

        {/* Divider */}
        <div className="mx-2 my-1 h-px bg-white/5" />

        {/* Utility */}
        <ToolButton
          icon={RotateCcw}
          label="重置"
          onClick={resetView}
        />
        <ToolButton
          icon={HelpCircle}
          label="帮助"
          onClick={() => setShowOnboarding(true)}
        />
      </div>
    </div>
  );
}
