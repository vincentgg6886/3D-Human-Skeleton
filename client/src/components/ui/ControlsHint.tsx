/*
 * ControlsHint.tsx - Bottom-right controls hint
 * Design: Subtle monospace hints, auto-hide after 8s
 */

import { useState, useEffect } from 'react';
import { Mouse, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ControlsHint() {
  const [visible, setVisible] = useState(true);

  // Auto-hide after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 right-4 z-30 max-w-[280px]"
        >
          <div className="glass rounded-lg px-3 py-2 text-[10px] font-mono text-slate-500 space-y-1 relative">
            <button
              onClick={() => setVisible(false)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={8} />
            </button>
            {/* Desktop hints */}
            <div className="hidden sm:block space-y-1">
              <div className="flex items-center gap-2">
                <Mouse size={10} className="flex-shrink-0" />
                <span>左键拖拽旋转 · 右键平移 · 滚轮缩放</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[10px] text-center flex-shrink-0">+</span>
                <span>点击骨骼选择 · 再次点击取消</span>
              </div>
            </div>
            {/* Mobile hints */}
            <div className="sm:hidden space-y-1">
              <div className="flex items-center gap-2">
                <Smartphone size={10} className="flex-shrink-0" />
                <span>单指旋转 · 双指缩放/平移</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[10px] text-center flex-shrink-0">+</span>
                <span>点击骨骼选择</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
