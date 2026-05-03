/*
 * Home.tsx - Main application page
 * Design: Full-screen 3D viewport with L-shaped control console
 * Mobile: Bottom tab bar replaces left toolbar, overlay side panel
 */

import { Suspense } from 'react';
import SkeletonScene from '@/components/3d/SkeletonScene';
import Toolbar from '@/components/ui/Toolbar';
import SidePanel from '@/components/ui/SidePanel';
import TopHUD from '@/components/ui/TopHUD';
import ControlsHint from '@/components/ui/ControlsHint';
import ViewPresets from '@/components/ui/ViewPresets';
import QuickRegionSelector from '@/components/ui/QuickRegionSelector';
import MobileNav from '@/components/ui/MobileNav';
import { Loader2, Move3d } from 'lucide-react';
import { motion } from 'framer-motion';

function LoadingFallback() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #0A0E17 0%, #0D1220 50%, #101828 100%)' }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center mb-6 border border-cyan-400/20"
      >
        <Move3d size={32} className="text-cyan-400 animate-pulse" />
      </motion.div>
      <div className="flex items-center gap-2 mb-2">
        <Loader2 size={14} className="text-cyan-400 animate-spin" />
        <p className="text-sm text-slate-300 font-medium">加载3D骨骼模型</p>
      </div>
      <p className="text-[10px] text-slate-600 font-mono tracking-wider">Initializing WebGL renderer...</p>

      {/* Loading progress bar */}
      <div className="mt-6 w-48 h-0.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-background">
      {/* 3D Viewport - Full screen background */}
      <Suspense fallback={<LoadingFallback />}>
        <SkeletonScene />
      </Suspense>

      {/* Desktop UI Overlays */}
      <div className="hidden sm:block">
        <Toolbar />
        <ViewPresets />
        <QuickRegionSelector />
      </div>

      {/* Shared overlays */}
      <SidePanel />
      <TopHUD />
      <ControlsHint />

      {/* Mobile UI */}
      <MobileNav />
    </div>
  );
}
