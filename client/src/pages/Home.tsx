/*
 * Home.tsx - Main application page
 * V2.0: Improved mobile layout, SidePanel responsive positioning
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
import OnboardingDialog from '@/components/ui/OnboardingDialog';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { useState, useEffect } from 'react';

function LoadingFallback() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('初始化 WebGL 渲染器...');

  useEffect(() => {
    const stages = [
      { at: 15, text: '加载骨骼模型数据...' },
      { at: 40, text: '解析解剖学结构...' },
      { at: 65, text: '构建3D网格...' },
      { at: 85, text: '加载肌肉模型...' },
      { at: 95, text: '准备交互系统...' },
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 3 + 0.5;
        if (next >= 98) {
          clearInterval(timer);
          return 98;
        }
        const s = stages.find((s) => prev < s.at && next >= s.at);
        if (s) setStage(s.text);
        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return <LoadingScreen progress={Math.round(progress)} stage={stage} />;
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

      {/* Onboarding */}
      <OnboardingDialog />
    </div>
  );
}
