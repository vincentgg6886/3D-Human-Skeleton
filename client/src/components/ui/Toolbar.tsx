/*
 * Toolbar.tsx - Left sidebar toolbar with labeled icons
 * V2.0: Visual hierarchy - Tab buttons vs Toggle buttons clearly distinguished
 *       Toggle buttons have switch indicator dot
 *       Improved section labels, keyboard shortcuts
 */

import { useEffect } from 'react';
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
  Scan,
} from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

/* ── Tab Button: opens side panel ── */
interface TabButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  shortcut?: string;
  active?: boolean;
  onClick: () => void;
  variant?: 'default' | 'accent';
}

function TabButton({ icon: Icon, label, shortcut, active, onClick, variant = 'default' }: TabButtonProps) {
  const colors = variant === 'accent'
    ? {
        active: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
        idle: 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent',
      }
    : {
        active: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
        idle: 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent',
      };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`relative w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg border transition-all duration-200 ${
            active ? colors.active : colors.idle
          }`}
        >
          <Icon size={17} strokeWidth={1.6} />
          <span className="text-[9px] font-medium leading-tight tracking-wide">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        <span>{label}</span>
        {shortcut && <span className="ml-2 text-[10px] opacity-60 font-mono">{shortcut}</span>}
      </TooltipContent>
    </Tooltip>
  );
}

/* ── Toggle Button: switches 3D display mode, has indicator dot ── */
interface ToggleButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  shortcut?: string;
  active: boolean;
  onClick: () => void;
  color: string; // tailwind color prefix e.g. 'red', 'blue', 'emerald'
}

function ToggleButton({ icon: Icon, label, shortcut, active, onClick, color }: ToggleButtonProps) {
  const activeClass = `text-${color}-400 bg-${color}-400/10 border-${color}-400/25`;
  const idleClass = `text-slate-400 hover:text-${color}-300 hover:bg-${color}-400/5 border-transparent`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`relative w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg border transition-all duration-200 ${
            active ? activeClass : idleClass
          }`}
        >
          {/* Toggle indicator dot */}
          <div className={`absolute top-1 right-1.5 w-[6px] h-[6px] rounded-full transition-all duration-300 ${
            active
              ? `bg-${color}-400 shadow-[0_0_6px] shadow-${color}-400/60`
              : 'bg-slate-600/40'
          }`} />
          <Icon size={17} strokeWidth={1.6} />
          <span className="text-[9px] font-medium leading-tight tracking-wide">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        <span>{label} {active ? '(已开启)' : '(已关闭)'}</span>
        {shortcut && <span className="ml-2 text-[10px] opacity-60 font-mono">{shortcut}</span>}
      </TooltipContent>
    </Tooltip>
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
  const xrayMode = useAppStore((s) => s.xrayMode);
  const toggleXrayMode = useAppStore((s) => s.toggleXrayMode);
  const setShowOnboarding = useAppStore((s) => s.setShowOnboarding);

  const handleTabClick = (tab: typeof activeTab) => {
    if (activeTab === tab && sidebarOpen) {
      setSidebarOpen(false);
    } else {
      setActiveTab(tab);
      setSidebarOpen(true);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case '1': handleTabClick('hierarchy'); break;
        case '2': handleTabClick('info'); break;
        case '3': handleTabClick('joints'); break;
        case '4': handleTabClick('motion'); break;
        case '5': handleTabClick('pathology'); break;
        case 'm': toggleMuscleMode(); break;
        case 'x': toggleXrayMode(); break;
        case 'l': toggleLabelMode(); break;
        case ' ':
          e.preventDefault();
          resetView();
          break;
        case 'escape':
          setSidebarOpen(false);
          useAppStore.getState().selectBone(null);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, activeTab]);

  return (
    <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-[64px]">
      <div className="glass-strong rounded-xl px-1 py-2 flex flex-col gap-0.5">
        {/* Logo */}
        <div className="flex justify-center mb-1">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Move3d size={16} className="text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Section: Navigation - Tab buttons */}
        <div className="px-1 mt-1 mb-0.5">
          <div className="text-[7px] font-mono text-slate-500 uppercase tracking-[0.15em] text-center">导航</div>
        </div>
        <TabButton
          icon={Layers}
          label="层级"
          shortcut="1"
          active={activeTab === 'hierarchy' && sidebarOpen}
          onClick={() => handleTabClick('hierarchy')}
        />
        <TabButton
          icon={Info}
          label="信息"
          shortcut="2"
          active={activeTab === 'info' && sidebarOpen}
          onClick={() => handleTabClick('info')}
        />
        <TabButton
          icon={Bone}
          label="关节"
          shortcut="3"
          active={activeTab === 'joints' && sidebarOpen}
          onClick={() => handleTabClick('joints')}
          variant="accent"
        />

        {/* Divider */}
        <div className="mx-2 my-1 h-px bg-white/5" />

        {/* Section: Clinical - Tab buttons */}
        <div className="px-1 mb-0.5">
          <div className="text-[7px] font-mono text-slate-500 uppercase tracking-[0.15em] text-center">临床</div>
        </div>
        <TabButton
          icon={Activity}
          label="运动"
          shortcut="4"
          active={activeTab === 'motion' && sidebarOpen}
          onClick={() => handleTabClick('motion')}
        />
        <TabButton
          icon={Stethoscope}
          label="病症"
          shortcut="5"
          active={activeTab === 'pathology' && sidebarOpen}
          onClick={() => handleTabClick('pathology')}
        />

        {/* Divider */}
        <div className="mx-2 my-1 h-px bg-white/5" />

        {/* Section: Display modes - Toggle buttons with indicator dots */}
        <div className="px-1 mb-0.5">
          <div className="text-[7px] font-mono text-slate-500 uppercase tracking-[0.15em] text-center">显示</div>
        </div>
        <ToggleButton
          icon={Heart}
          label="肌肉"
          shortcut="M"
          active={muscleMode}
          onClick={toggleMuscleMode}
          color="red"
        />
        <ToggleButton
          icon={Scan}
          label="X光"
          shortcut="X"
          active={xrayMode}
          onClick={toggleXrayMode}
          color="blue"
        />
        <ToggleButton
          icon={Tag}
          label="标注"
          shortcut="L"
          active={labelMode}
          onClick={toggleLabelMode}
          color="emerald"
        />

        {/* Divider */}
        <div className="mx-2 my-1 h-px bg-white/5" />

        {/* Utility */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={resetView}
              className="relative w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
            >
              <RotateCcw size={17} strokeWidth={1.6} />
              <span className="text-[9px] font-medium leading-tight tracking-wide">重置</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <span>重置视图</span>
            <span className="ml-2 text-[10px] opacity-60 font-mono">Space</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowOnboarding(true)}
              className="relative w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
            >
              <HelpCircle size={17} strokeWidth={1.6} />
              <span className="text-[9px] font-medium leading-tight tracking-wide">帮助</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <span>使用帮助</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
