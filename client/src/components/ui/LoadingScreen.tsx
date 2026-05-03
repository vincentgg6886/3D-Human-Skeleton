/*
 * LoadingScreen.tsx - Branded loading experience
 * V1.1: Multi-stage progress bar with skeleton animation
 */

import { motion } from 'framer-motion';
import { Bone } from 'lucide-react';

interface LoadingScreenProps {
  progress: number; // 0-100
  stage: string;
}

export default function LoadingScreen({ progress, stage }: LoadingScreenProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0e14]">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Animated bone icon */}
      <motion.div
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="mb-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/20 flex items-center justify-center">
          <Bone size={28} className="text-cyan-400" />
        </div>
      </motion.div>

      {/* Brand */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-slate-200 tracking-wide">OrthoVis 3D</h1>
        <p className="text-[11px] text-slate-600 mt-1 font-mono">骨科3D骨骼交互可视化系统</p>
      </div>

      {/* Progress bar */}
      <div className="w-64 mb-3">
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Stage text */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-cyan-400"
        />
        <span className="text-[11px] font-mono text-slate-500">{stage}</span>
        <span className="text-[11px] font-mono text-slate-600">{progress}%</span>
      </div>
    </div>
  );
}
