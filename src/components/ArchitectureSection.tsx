import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  ArrowRight,
  Shield,
  Layers,
  Database,
  Cpu,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PipelineStage {
  id: string;
  stepNumber: string;
  title: string;
  category: string;
  description: string;
  latencyBudget: string;
  icon: React.ElementType;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'stage-1',
    stepNumber: '01',
    title: 'Ingest & Quantization',
    category: 'INPUT SHAPER',
    description: 'Compresses continuous client gestures into FP4/INT8 hybrid sparse matrices.',
    latencyBudget: '0.12 ms',
    icon: Cpu,
  },
  {
    id: 'stage-2',
    stepNumber: '02',
    title: 'Spatial Geometry Projection',
    category: '3D DISPATCHER',
    description: 'Projects viewport interactions across 64-bit IEEE spatial bounding trees.',
    latencyBudget: '0.24 ms',
    icon: Layers,
  },
  {
    id: 'stage-3',
    stepNumber: '03',
    title: 'Lock-Free Ring Buffer',
    category: 'MEMORY BUS',
    description: 'Routes payloads directly across 64MB locked L3 memory with zero system locks.',
    latencyBudget: '0.08 ms',
    icon: Database,
  },
  {
    id: 'stage-4',
    stepNumber: '04',
    title: 'Kyber-1024 Verification',
    category: 'SECURITY PASS',
    description: 'Validates cryptographic entropy signatures to prevent injection vectors.',
    latencyBudget: '0.18 ms',
    icon: Shield,
  },
  {
    id: 'stage-5',
    stepNumber: '05',
    title: 'GPU Frame Presentation',
    category: 'HARDWARE SINK',
    description: 'Synchronizes transformed geometry directly with display refresh interval.',
    latencyBudget: '0.22 ms',
    icon: Zap,
  },
];

export const ArchitectureSection: React.FC = () => {
  const { playSound, addNotification } = useApp();
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isAutoStepping, setIsAutoStepping] = useState(false);
  const [packetCounter, setPacketCounter] = useState(14820);
  const [accumulatedLatency, setAccumulatedLatency] = useState(0.84);

  // Auto stepping simulation
  useEffect(() => {
    if (!isAutoStepping) return;

    const interval = setInterval(() => {
      setActiveStageIndex((prev) => {
        const next = (prev + 1) % PIPELINE_STAGES.length;
        if (next === 0) {
          setPacketCounter((p) => p + 1);
          setAccumulatedLatency(+(0.75 + Math.random() * 0.2).toFixed(2));
          playSound('success');
        } else {
          playSound('hover');
        }
        return next;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isAutoStepping, playSound]);

  const handleStepForward = () => {
    playSound('switch');
    setActiveStageIndex((prev) => {
      const next = (prev + 1) % PIPELINE_STAGES.length;
      if (next === 0) {
        setPacketCounter((p) => p + 1);
        playSound('success');
      }
      return next;
    });
  };

  const handleDispatchSingle = () => {
    playSound('click');
    setIsAutoStepping(false);
    setActiveStageIndex(0);
    setPacketCounter((p) => p + 1);

    // Sequence through stages
    [0, 1, 2, 3, 4].forEach((idx) => {
      setTimeout(() => {
        setActiveStageIndex(idx);
        if (idx === 4) {
          playSound('success');
          addNotification({
            title: 'Test Packet Delivered',
            description: `Packet #KRYO-${packetCounter + 1} finalized across 5 stages in 0.84ms total.`,
            type: 'telemetry',
            tag: 'PIPELINE',
          });
        } else {
          playSound('hover');
        }
      }, idx * 280);
    });
  };

  return (
    <section id="architecture" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40 mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>INTERACTIVE PACKET PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Deterministic Pipeline Execution
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl font-normal">
            Step through each synchronous stage of the living interface engine to observe zero-jitter latency profiling.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="pipeline-dispatch-single"
            onClick={handleDispatchSingle}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-semibold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Play className="w-3.5 h-3.5" />
            <span>DISPATCH TEST PACKET</span>
          </button>

          <button
            id="pipeline-auto-step-toggle"
            onClick={() => {
              playSound('switch');
              setIsAutoStepping(!isAutoStepping);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-mono border transition cursor-pointer flex items-center gap-1.5 ${
              isAutoStepping
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40'
                : 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAutoStepping ? 'bg-emerald-400 animate-ping' : 'bg-zinc-500'}`} />
            <span>{isAutoStepping ? 'AUTO PULSE: ON' : 'AUTO PULSE: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Stage Flow Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
        {PIPELINE_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = activeStageIndex === idx;
          const isPassed = activeStageIndex > idx;

          return (
            <button
              key={stage.id}
              onClick={() => {
                playSound('switch');
                setActiveStageIndex(idx);
              }}
              className={`text-left p-4 rounded-xl transition-all duration-200 cursor-pointer border relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-950/30 scale-[1.02]'
                  : isPassed
                  ? 'bg-zinc-900/60 border-zinc-700/70 text-zinc-300'
                  : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {/* Active Indicator Top Line */}
              {isActive && (
                <motion.div
                  layoutId="activePipelineTopLine"
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500"
                />
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-black/40 border border-zinc-800 flex items-center justify-center text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {stage.stepNumber}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-zinc-400 mb-0.5">{stage.category}</div>
                <h4 className={`text-sm font-bold font-display ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                  {stage.title}
                </h4>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-500">BUDGET:</span>
                <span className={isActive ? 'text-cyan-300 font-semibold' : 'text-zinc-400'}>
                  {stage.latencyBudget}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Focus Inspector Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>STAGE {PIPELINE_STAGES[activeStageIndex].stepNumber} INSPECTOR</span>
              <span>•</span>
              <span className="text-zinc-400">{PIPELINE_STAGES[activeStageIndex].category}</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-white">
              {PIPELINE_STAGES[activeStageIndex].title}
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              {PIPELINE_STAGES[activeStageIndex].description}
            </p>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-zinc-800/80 font-mono text-xs w-full lg:w-auto">
            <div>
              <div className="text-zinc-500 text-[10px]">TOTAL DISPATCHED</div>
              <div className="text-white font-bold text-base mt-0.5">#{packetCounter}</div>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div>
              <div className="text-zinc-500 text-[10px]">ACCUMULATED LATENCY</div>
              <div className="text-emerald-400 font-bold text-base mt-0.5">{accumulatedLatency}ms</div>
            </div>
            <button
              onClick={handleStepForward}
              className="ml-auto lg:ml-2 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-400 border border-zinc-700 transition cursor-pointer"
              title="Next Stage"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
