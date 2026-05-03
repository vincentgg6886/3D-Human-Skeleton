/*
 * ViewPresets.tsx - Quick view angle presets (anterior, posterior, lateral, superior)
 * Design: Compact button group at bottom-left
 * Fix: Uses setCameraPreset to set both camera position and look-at target
 */

import { useAppStore } from '@/lib/store';

const PRESETS = [
  { label: '前', labelEn: 'ANT', position: [0, 4, 10] as [number, number, number] },
  { label: '后', labelEn: 'POST', position: [0, 4, -10] as [number, number, number] },
  { label: '左', labelEn: 'LAT-L', position: [-10, 4, 0] as [number, number, number] },
  { label: '右', labelEn: 'LAT-R', position: [10, 4, 0] as [number, number, number] },
  { label: '上', labelEn: 'SUP', position: [0, 16, 0.1] as [number, number, number] },
];

export default function ViewPresets() {
  const setCameraPreset = useAppStore((s) => s.setCameraPreset);

  return (
    <div className="absolute bottom-4 left-14 z-30 flex gap-1">
      {PRESETS.map((preset) => (
        <button
          key={preset.labelEn}
          onClick={() => setCameraPreset(preset.position, [0, 4, 0])}
          className="group relative w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-200"
        >
          <span className="text-[11px] font-semibold">{preset.label}</span>
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {preset.labelEn}
          </span>
        </button>
      ))}
    </div>
  );
}
