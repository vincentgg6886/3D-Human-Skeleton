import { Move3d, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 flex items-center justify-center mx-auto border border-cyan-400/20">
          <Move3d size={28} className="text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">页面未找到</h1>
          <p className="text-sm text-muted-foreground">请返回骨骼可视化系统</p>
        </div>
        <button
          onClick={() => setLocation('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 hover:bg-cyan-400/20 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          返回首页
        </button>
      </div>
    </div>
  );
}
