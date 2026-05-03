/*
 * QuickRegionSelector.tsx - Quick region selection
 * V1.2: Glass panel styling, visual indicators
 */

import { useAppStore } from '@/lib/store';
import { Focus } from 'lucide-react';

const REGION_BUTTONS = [
  { id: 'skull', label: '颅骨', emoji: '' },
  { id: 'spine', label: '脊柱', emoji: '' },
  { id: 'thorax', label: '胸廓', emoji: '' },
  { id: 'upper-limb-right', label: '右上肢', emoji: '' },
  { id: 'upper-limb-left', label: '左上肢', emoji: '' },
  { id: 'pelvis', label: '骨盆', emoji: '' },
  { id: 'lower-limb-right', label: '右下肢', emoji: '' },
  { id: 'lower-limb-left', label: '左下肢', emoji: '' },
];

export default function QuickRegionSelector() {
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);
  const lockRegion = useAppStore((s) => s.lockRegion);
  const visibleRegions = useAppStore((s) => s.visibleRegions);

  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30">
      <div className="glass-panel rounded-xl px-1.5 py-2 space-y-0.5">
        <div className="flex items-center justify-center gap-1 mb-1.5 px-1">
          <Focus size={9} className="text-slate-600" />
          <span className="text-[8px] font-mono text-slate-600 tracking-wider uppercase">区域</span>
        </div>
        {REGION_BUTTONS.map((region) => {
          const isLocked = lockedRegionId === region.id;
          const isVisible = visibleRegions.has(region.id);

          return (
            <button
              key={region.id}
              onClick={() => lockRegion(isLocked ? null : region.id)}
              className={`block w-full px-2 py-1 rounded-md text-[10px] text-left transition-all duration-200 whitespace-nowrap ${
                isLocked
                  ? 'bg-cyan-400/12 text-cyan-300 border border-cyan-400/25 glow-cyan'
                  : isVisible
                    ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                    : 'text-slate-700 border border-transparent opacity-50'
              }`}
            >
              {region.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
