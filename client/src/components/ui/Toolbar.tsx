/*
 * Toolbar.tsx - Left vertical toolbar (48px wide)
 * Design: Scientific Instrument Aesthetic - minimal icons on glass panel
 */

import { useAppStore } from '@/lib/store';
import {
  RotateCcw,
  Eye,
  Lock,
  Unlock,
  Move3d,
  Layers,
  Info,
  Activity,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function ToolButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  variant = 'default',
}: {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  active?: boolean;
  variant?: 'default' | 'accent' | 'danger';
}) {
  const colorClass =
    variant === 'accent'
      ? 'text-cyan-400 bg-cyan-400/10'
      : variant === 'danger'
        ? 'text-amber-400 bg-amber-400/10'
        : active
          ? 'text-cyan-400 bg-cyan-400/10'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${colorClass}`}
        >
          <Icon size={18} strokeWidth={1.5} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="glass text-xs font-mono">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export default function Toolbar() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);
  const lockRegion = useAppStore((s) => s.lockRegion);
  const resetView = useAppStore((s) => s.resetView);
  const showAllRegions = useAppStore((s) => s.showAllRegions);

  return (
    <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-center py-3 z-30 glass-strong border-r border-white/5">
      {/* Logo */}
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-4">
        <Move3d size={16} className="text-white" strokeWidth={2} />
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-white/10 mb-3" />

      {/* Main tools */}
      <div className="flex flex-col gap-1">
        <ToolButton
          icon={Layers}
          label="解剖层级"
          onClick={() => {
            setActiveTab('hierarchy');
            setSidebarOpen(true);
          }}
          active={activeTab === 'hierarchy' && sidebarOpen}
        />
        <ToolButton
          icon={Info}
          label="骨骼信息"
          onClick={() => {
            setActiveTab('info');
            setSidebarOpen(true);
          }}
          active={activeTab === 'info' && sidebarOpen}
        />
        <ToolButton
          icon={Activity}
          label="运动模拟"
          onClick={() => {
            setActiveTab('motion');
            setSidebarOpen(true);
          }}
          active={activeTab === 'motion' && sidebarOpen}
        />
        <ToolButton
          icon={Stethoscope}
          label="常见病症"
          onClick={() => {
            setActiveTab('pathology');
            setSidebarOpen(true);
          }}
          active={activeTab === 'pathology' && sidebarOpen}
        />
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-white/10 my-3" />

      {/* View controls */}
      <div className="flex flex-col gap-1">
        <ToolButton
          icon={Eye}
          label="显示全部"
          onClick={showAllRegions}
        />
        <ToolButton
          icon={lockedRegionId ? Unlock : Lock}
          label={lockedRegionId ? '解锁区域' : '锁定区域'}
          onClick={() => lockRegion(lockedRegionId ? null : null)}
          active={!!lockedRegionId}
          variant={lockedRegionId ? 'accent' : 'default'}
        />
        <ToolButton
          icon={RotateCcw}
          label="重置视图"
          onClick={resetView}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Toggle sidebar */}
      <ToolButton
        icon={sidebarOpen ? ChevronLeft : ChevronRight}
        label={sidebarOpen ? '收起面板' : '展开面板'}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
}
