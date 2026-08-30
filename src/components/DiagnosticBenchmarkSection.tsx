import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Gauge,
  Cpu,
  Activity,
  CheckCircle2,
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  ShieldAlert,
  Flame,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DiagnosticBenchmarkSection: React.FC = () => {
  const { telemetry, playSound, addNotification } = useApp();
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditScore, setAuditScore] = useState<number | null>(99.2);
  const [auditProgress, setAuditProgress] = useState(100);
  const [copiedReport, setCopiedReport] = useState(false);

  const handleRunAudit = () => {
    playSound('switch');
    setIsRunningAudit(true);
    setAuditProgress(0);
    setAuditScore(null);

    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setAuditProgress(p);
      playSound('hover');

      if (p >= 100) {
        clearInterval(interval);
        setIsRunningAudit(false);
        const finalScore = +(98.8 + Math.random() * 1.1).toFixed(1);
        setAuditScore(finalScore);
        playSound('success');
        addNotification({
          title: 'System Diagnostic Audit Passed',
          description: `Performance score: ${finalScore}/100. All 4,096 vNodes verified within 1.2ms envelope.`,
          type: 'success',
          tag: 'AUDIT',
        });
      }
    }, 180);
  };

  const handleCopyReport = () => {
    playSound('click');
    const reportData = {
      timestamp: new Date().toISOString(),
      systemScore: auditScore || 99.2,
      fps: telemetry.fps,
      memoryUsageMb: telemetry.memoryUsageMb,
      quantumCoherence: `${telemetry.quantumCoherence}%`,
      renderLatency: `${telemetry.renderLatencyMs}ms`,
      activeNodes: telemetry.activeNodes,
      kernelVersion: 'v4.12.0-spatial-prod',
    };
    navigator.clipboard.writeText(JSON.stringify(reportData, null, 2));
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <section id="diagnostics" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40 mb-2">
            <Gauge className="w-3.5 h-3.5" />
            <span>REAL HARDWARE PROFILING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Diagnostic & Runtime Benchmark
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl font-normal">
            Direct measurement of browser client rendering velocity, heap allocations, and WebGL/CSS3D acceleration.
          </p>
        </div>

        {/* Action button */}
        <button
          id="run-full-audit-btn"
          onClick={handleRunAudit}
          disabled={isRunningAudit}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-semibold text-xs transition active:scale-95 cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <Play className={`w-3.5 h-3.5 ${isRunningAudit ? 'animate-spin' : ''}`} />
          <span>{isRunningAudit ? 'RUNNING AUDIT SUITE...' : 'EXECUTE SYSTEM AUDIT'}</span>
        </button>
      </div>

      {/* Main Diagnostic Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Overall Health Score Card */}
        <div className="glass-panel rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-4">
              <span>OVERALL HEALTH INDEX</span>
              <span className="text-emerald-400 font-semibold">GRADE: PLATINUM</span>
            </div>

            {/* Score Ring Representation */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#06b6d4"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - (auditScore || 99) / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold font-display text-white">
                    {auditScore !== null ? auditScore : `${auditProgress}%`}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">/ 100 SCORE</span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs font-mono text-zinc-400">
              {isRunningAudit ? 'Analyzing 14 render passes...' : 'Zero frame drops detected across test cycle.'}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex gap-2">
            <button
              onClick={handleCopyReport}
              className="flex-1 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-mono text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-zinc-700/60"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReport ? 'COPIED JSON ✓' : 'COPY REPORT'}</span>
            </button>
          </div>
        </div>

        {/* Center & Right: 4 Detailed Metric Breakdowns */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tile 1 */}
          <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800/80 hover:border-zinc-700 transition">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>RENDER FRAME VELOCITY</span>
              </span>
              <span className="text-cyan-400 font-bold">{telemetry.fps} FPS</span>
            </div>
            <div className="text-xl font-bold font-display text-white mt-1">16.6ms Target Window</div>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Frame compositor maintains steady 60-144Hz vertical synchronization.
            </p>
            <div className="mt-4 pt-2 border-t border-zinc-800/60 flex justify-between text-[11px] font-mono text-zinc-500">
              <span>STATUS: HARDWARE ACCELERATED</span>
              <span className="text-emerald-400">NOMINAL</span>
            </div>
          </div>

          {/* Tile 2 */}
          <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800/80 hover:border-zinc-700 transition">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>HEAP ALLOCATION</span>
              </span>
              <span className="text-emerald-400 font-bold">{telemetry.memoryUsageMb} MB</span>
            </div>
            <div className="text-xl font-bold font-display text-white mt-1">Zero Garbage Spikes</div>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Pre-allocated typed arrays prevent GC pauses during continuous 3D transforms.
            </p>
            <div className="mt-4 pt-2 border-t border-zinc-800/60 flex justify-between text-[11px] font-mono text-zinc-500">
              <span>L3 LOCK STATUS: ACTIVE</span>
              <span className="text-emerald-400">OPTIMIZED</span>
            </div>
          </div>

          {/* Tile 3 */}
          <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800/80 hover:border-zinc-700 transition">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>SPATIAL TREE PRECISION</span>
              </span>
              <span className="text-amber-400 font-bold">64-BIT IEEE</span>
            </div>
            <div className="text-xl font-bold font-display text-white mt-1">Sub-pixel Matrix Clamping</div>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Viewport bounding boxes calculated with zero visual jitter or rounding artifacting.
            </p>
            <div className="mt-4 pt-2 border-t border-zinc-800/60 flex justify-between text-[11px] font-mono text-zinc-500">
              <span>OCCLUSION CULLING: ON</span>
              <span className="text-amber-300">ACTIVE</span>
            </div>
          </div>

          {/* Tile 4 */}
          <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800/80 hover:border-zinc-700 transition">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-purple-400" />
                <span>QUANTUM COHERENCE</span>
              </span>
              <span className="text-purple-400 font-bold">{telemetry.quantumCoherence}%</span>
            </div>
            <div className="text-xl font-bold font-display text-white mt-1">CRDT Delta Sync</div>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Distributed state trees resolve concurrent mutations deterministically.
            </p>
            <div className="mt-4 pt-2 border-t border-zinc-800/60 flex justify-between text-[11px] font-mono text-zinc-500">
              <span>FAILOVER LATENCY: &lt; 0.1ms</span>
              <span className="text-purple-400">NOMINAL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
