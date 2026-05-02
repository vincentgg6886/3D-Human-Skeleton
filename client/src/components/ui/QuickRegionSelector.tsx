/*
 * QuickRegionSelector.tsx - Quick region selection via body outline
 * Design: Minimal compact region list on right side
 */

import { useAppStore } from '@/lib/store';

const REGION_BUTTONS = [
  { id: 'skull', label: '颅骨' },
  { id: 'spine', label: '脊柱' },
  { id: 'thorax', label: '胸廓' },
  { id: 'upper-limb-left', label: '左上肢' },
  { id: 'upper-limb-right', label: '右上肢' },
  { id: 'pelvis', label: '骨盆' },
  { id: 'lower-limb-left', label: '左下肢' },
  { id: 'lower-limb-right', label: '右下肢' },
];

export default function QuickRegionSelector() {
  const lockedRegionId = useAppStore((s) => s.lockedRegionId);
  const lockRegion = useAppStore((s) => s.lockRegion);
  const visibleRegions = useAppStore((s) => s.visibleRegions);

  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30">
      <div className="glass rounded-lg px-1.5 py-2 space-y-0.5">
        <div className="text-[8px] font-mono text-slate-600 text-center mb-1.5 tracking-wider uppercase">
          区域
        </div>
        {REGION_BUTTONS.map((region) => {
          const isLocked = lockedRegionId === region.id;
          const isVisible = visibleRegions.has(region.id);

          return (
            <button
              key={region.id}
              onClick={() => lockRegion(isLocked ? null : region.id)}
              className={`block w-full px-2 py-0.5 rounded text-[10px] text-left transition-all duration-200 whitespace-nowrap ${
                isLocked
                  ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/30'
                  : isVisible
                    ? 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    : 'text-slate-700 border border-transparent'
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
