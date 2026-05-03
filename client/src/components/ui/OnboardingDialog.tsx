/*
 * OnboardingDialog.tsx - First-visit onboarding guide
 * V1.1: 3-step interactive coach marks
 * Design: Dark glass modal matching surgical microscope aesthetic
 */

import { useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, Move3d, Layers, Stethoscope, ChevronRight, X } from 'lucide-react';

const STEPS = [
  {
    icon: Move3d,
    title: '3D 骨骼交互',
    subtitle: '自由探索人体骨骼结构',
    items: [
      { label: '旋转', desc: '鼠标左键拖拽 / 单指滑动' },
      { label: '缩放', desc: '滚轮滚动 / 双指捏合' },
      { label: '平移', desc: '鼠标右键拖拽 / 双指滑动' },
    ],
    color: '#00D4FF',
  },
  {
    icon: MousePointer2,
    title: '骨骼选择与信息',
    subtitle: '点击任意骨骼查看详细信息',
    items: [
      { label: '选择', desc: '点击骨骼高亮选中，查看解剖信息' },
      { label: '区域锁定', desc: '右侧区域栏锁定特定解剖区域' },
      { label: '搜索', desc: '左侧面板搜索框快速定位骨骼' },
    ],
    color: '#00D4FF',
  },
  {
    icon: Stethoscope,
    title: '临床功能',
    subtitle: '肌肉模式、病症可视化、关节视图',
    items: [
      { label: '肌肉模式', desc: '叠加半透明肌肉层，查看骨骼-肌肉关系' },
      { label: '病症可视化', desc: '选中骨骼后查看常见病症，激活3D病变效果' },
      { label: '关节视图', desc: '快速聚焦8大关节，查看结构关系' },
    ],
    color: '#00D4FF',
  },
];

export default function OnboardingDialog() {
  const showOnboarding = useAppStore((s) => s.showOnboarding);
  const setShowOnboarding = useAppStore((s) => s.setShowOnboarding);
  const [step, setStep] = useState(0);

  const handleClose = useCallback(() => {
    setShowOnboarding(false);
    try { localStorage.setItem('orthovis-onboarding-seen', 'true'); } catch {}
  }, [setShowOnboarding]);

  const handleNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  }, [step, handleClose]);

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <Dialog open={showOnboarding} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent
        className="sm:max-w-[440px] p-0 border-0 bg-transparent shadow-none gap-0"
        showCloseButton={false}
      >
        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0D1220]/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/5">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>

            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mb-5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === step ? 24 : 8,
                    backgroundColor: i === step ? current.color : i < step ? current.color + '60' : 'rgba(255,255,255,0.08)',
                  }}
                />
              ))}
              <span className="ml-auto text-[10px] font-mono text-slate-600">
                {step + 1}/{STEPS.length}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-1.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: current.color + '15', border: `1px solid ${current.color}25` }}
                  >
                    <Icon size={20} style={{ color: current.color }} />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-semibold text-slate-100 leading-tight">
                      {current.title}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 mt-0.5">
                      {current.subtitle}
                    </DialogDescription>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="px-6 pb-4"
            >
              <div className="space-y-2">
                {current.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/5"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: current.color }}
                    />
                    <div>
                      <div className="text-[12px] font-medium text-slate-200">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="px-6 pb-5 flex items-center justify-between">
            <button
              onClick={handleClose}
              className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
            >
              跳过引导
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium transition-all duration-200 hover:brightness-110"
              style={{
                backgroundColor: current.color + '20',
                color: current.color,
                border: `1px solid ${current.color}30`,
              }}
            >
              {step < STEPS.length - 1 ? '下一步' : '开始使用'}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
