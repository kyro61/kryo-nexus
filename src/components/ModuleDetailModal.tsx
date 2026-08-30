import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Cpu,
  Boxes,
  Zap,
  ShieldCheck,
  Database,
  Activity,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Terminal,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { SystemModule } from '../types';
import { useApp } from '../context/AppContext';

interface ModuleDetailModalProps {
  module: SystemModule | null;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Boxes,
  Zap,
  ShieldCheck,
  Database,
  Activity,
};

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({ module, onClose }) => {
  const { playSound, addNotification } = useApp();
  const [threads, setThreads] = useState(module ? module.activeThreads : 1024);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([
    'KERNEL: Initialized module runtime hooks.',
    'ROUTING: Mapped direct memory addresses to ring buffer.',
    'STATUS: Steady state achieved with 0 packet drops.',
  ]);

  if (!module) return null;

  const Icon = iconMap[module.iconName] || Cpu;

  const handleRunDiagnostics = () => {
    playSound('switch');
    setIsSimulating(true);
    const newLog = `DIAGNOSTIC [${new Date().toLocaleTimeString()}]: Validated ${threads} active threads. Latency = ${(
      module.latencyMs * (0.8 + Math.random() * 0.4)
    ).toFixed(2)}ms`;

    setTimeout(() => {
      setSimulatedLogs((prev) => [newLog, ...prev.slice(0, 5)]);
      setIsSimulating(false);
      playSound('success');
      addNotification({
        title: `${module.title} Optimized`,
        description: `Ran self-healing diagnostics with ${threads} active worker threads.`,
        type: 'success',
        tag: 'MODULE',
      });
    }, 600);
  };

  const handleResetModule = () => {
    playSound('click');
    setThreads(module.activeThreads);
    setSimulatedLogs(['STATUS: State reset to factory baseline.']);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl glass-panel rounded-2xl p-6 sm:p-8 border border-zinc-700 shadow-2xl z-10 my-auto text-zinc-100"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-zinc-800 pb-5 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {module.category}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {module.badge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                  {module.title}
                </h3>
              </div>
            </div>

            <button
              id="module-modal-close-btn"
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer border border-zinc-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Long Description */}
          <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-6">
            {module.longDescription}
          </p>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {module.specs.map((spec, i) => (
              <div key={i} className="p-3 rounded-xl bg-black/40 border border-zinc-800/80">
                <div className="text-[11px] font-mono text-zinc-400">{spec.label}</div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">{spec.value}</div>
              </div>
            ))}
          </div>

          {/* Interactive Simulator Section */}
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 mb-6">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-3">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Sliders className="w-3.5 h-3.5" />
                <span>DYNAMIC THREAD ALLOCATION: {threads} THREADS</span>
              </span>
              <span>LATENCY: {(module.latencyMs * (1024 / threads)).toFixed(2)}ms</span>
            </div>

            <input
              type="range"
              min="256"
              max="8192"
              step="256"
              value={threads}
              onChange={(e) => {
                setThreads(Number(e.target.value));
                playSound('hover');
              }}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1.5">
              <span>256 (Low Energy)</span>
              <span>4,096 (Nominal)</span>
              <span>8,192 (Overclocked)</span>
            </div>
          </div>

          {/* Console Output Log */}
          <div className="bg-black/50 rounded-xl p-3.5 border border-zinc-800/80 font-mono text-xs mb-6 max-h-32 overflow-y-auto">
            <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 mb-2 pb-1 border-b border-zinc-800/60">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>MODULE RUNTIME CONSOLE</span>
            </div>
            {simulatedLogs.map((log, i) => (
              <div key={i} className="text-zinc-400 flex items-start gap-1.5 mb-1 leading-tight">
                <span className="text-cyan-500">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>

          {/* Footer Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
            <button
              onClick={handleResetModule}
              className="px-3 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer border border-zinc-700/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET THREADS</span>
            </button>

            <button
              id="run-module-diagnostic-btn"
              onClick={handleRunDiagnostics}
              disabled={isSimulating}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono flex items-center gap-2 transition active:scale-95 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'EVALUATING...' : 'EXECUTE BENCHMARK'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
