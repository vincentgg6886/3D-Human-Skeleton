/*
 * ViewPresets.tsx - Quick view angle presets
 * V1.2: Glass panel styling, improved hover states
 */

import { useAppStore } from '@/lib/store';
import { RotateCcw } from 'lucide-react';

const PRESETS = [
  { label: '前', labelEn: 'ANT', position: [0, 4, 10] as [number, number, number] },
  { label: '后', labelEn: 'POST', position: [0, 4, -10] as [number, number, number] },
  { label: '左', labelEn: 'LAT-L', position: [-10, 4, 0] as [number, number, number] },
  { label: '右', labelEn: 'LAT-R', position: [10, 4, 0] as [number, number, number] },
  { label: '上', labelEn: 'SUP', position: [0, 16, 0.1] as [number, number, number] },
];

export default function ViewPresets() {
  const setCameraPreset = useAppStore((s) => s.setCameraPreset);
  const resetView = useAppStore((s) => s.resetView);

  return (
    <div className="absolute bottom-4 left-[84px] z-30 flex items-center gap-1">
      <div className="glass-panel-subtle rounded-lg p-1 flex gap-0.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.labelEn}
            onClick={() => setCameraPreset(preset.position, [0, 4, 0])}
            className="group relative w-8 h-8 rounded-md btn-glass flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-all duration-200"
            title={preset.labelEn}
          >
            <span className="text-[11px] font-semibold">{preset.label}</span>
          </button>
        ))}
        <div className="w-px h-5 bg-white/5 self-center mx-0.5" />
        <button
          onClick={() => {
            resetView();
            setCameraPreset([0, 4, 10], [0, 4, 0]);
          }}
          className="w-8 h-8 rounded-md btn-glass flex items-center justify-center text-slate-500 hover:text-amber-400 transition-all duration-200"
          title="重置视图"
        >
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
}
