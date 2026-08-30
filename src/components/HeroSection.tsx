import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import {
  Cpu,
  Zap,
  Activity,
  Layers,
  Shield,
  ArrowRight,
  Command,
  Play,
  RotateCcw,
  Sparkles,
  Radio,
  BarChart3,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroSection: React.FC = () => {
  const {
    settings,
    telemetry,
    playSound,
    setIsCommandCenterOpen,
    simulateAlert,
    triggerEasterEgg,
  } = useApp();

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax Springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Transform values for 3D UI depth
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [12 * settings.parallaxStrength, -12 * settings.parallaxStrength]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-14 * settings.parallaxStrength, 14 * settings.parallaxStrength]);
  const panelTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [-20 * settings.parallaxStrength, 20 * settings.parallaxStrength]);
  const panelTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [-20 * settings.parallaxStrength, 20 * settings.parallaxStrength]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!settings.enable3D || settings.reducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Interactive Live Simulated Node Grid state
  const [activeNodesMap, setActiveNodesMap] = useState<number[]>([1, 4, 7, 12, 15, 18, 22]);
  const [burstActive, setBurstActive] = useState(false);
  const [activeCore, setActiveCore] = useState<'NEURAL' | 'SPATIAL' | 'QUANTUM'>('NEURAL');

  // Trigger Burst Simulation
  const handleTriggerBurst = () => {
    playSound('switch');
    setBurstActive(true);
    // Shuffle active nodes
    const randomNodes = Array.from({ length: 12 }, () => Math.floor(Math.random() * 24));
    setActiveNodesMap(randomNodes);
    simulateAlert();

    setTimeout(() => {
      setBurstActive(false);
      playSound('success');
    }, 900);
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center overflow-hidden perspective-1000 select-none"
    >
      {/* Subtle background coordinate lattice (structural, not floating particles) */}
      <div className="absolute inset-0 tech-grid-subtle opacity-30 pointer-events-none" />

      {/* Main 3D Interactive Stage */}
      <motion.div
        style={{
          rotateX: settings.enable3D && !settings.reducedMotion ? rotateX : 0,
          rotateY: settings.enable3D && !settings.reducedMotion ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        className="w-full max-w-6xl flex flex-col items-center relative z-10"
      >
        {/* Top Operational Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-950/20 mb-8 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold tracking-wider">KRYO SPATIAL ENGINE</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-400">CLUSTER STATUS: 100% OPERATIONAL</span>
          <button
            onClick={handleTriggerBurst}
            className="ml-1 text-[11px] px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 transition cursor-pointer active:scale-95"
            title="Inject simulated load burst"
          >
            {burstActive ? 'BURSTING...' : 'PULSE'}
          </button>
        </motion.div>

        {/* Hero Title & Subtext */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] font-display"
          >
            THE LIVING INTERFACE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              ARCHITECTURE.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Autonomous neural pipelines, lock-free ring buffers, and sub-millisecond 3D spatial layout dispatch compiled in real time.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-3"
          >
            <button
              id="hero-primary-cta"
              onClick={() => {
                playSound('switch');
                const el = document.getElementById('dashboard');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-sm font-mono tracking-tight shadow-xl shadow-cyan-500/20 hover:shadow-cyan-400/30 transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>INSPECT LIVE TELEMETRY</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-secondary-cta"
              onClick={() => {
                playSound('switch');
                setIsCommandCenterOpen(true);
              }}
              className="px-5 py-3 rounded-xl glass-panel hover:bg-zinc-800/80 text-zinc-200 font-medium text-sm font-mono border border-zinc-700/60 hover:border-zinc-500 transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Command className="w-4 h-4 text-cyan-400" />
              <span>COMMAND PALETTE (⌘K)</span>
            </button>
          </motion.div>
        </div>

        {/* Interactive Floating HUD Dashboard Interface (Physical 3D Object) */}
        <motion.div
          style={{
            x: settings.enable3D && !settings.reducedMotion ? panelTranslateX : 0,
            y: settings.enable3D && !settings.reducedMotion ? panelTranslateY : 0,
            transformStyle: 'preserve-3d',
          }}
          className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-zinc-700/60 shadow-2xl shadow-black/80 mt-4 relative overflow-hidden"
        >
          {/* Top HUD Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-zinc-400 border-l border-zinc-800 pl-3">
                NODE_ARRAY://CLUSTER-01 • US-EAST
              </span>
            </div>

            {/* Core Mode Switcher */}
            <div className="flex items-center p-1 bg-black/40 rounded-lg border border-zinc-800 text-xs font-mono">
              {(['NEURAL', 'SPATIAL', 'QUANTUM'] as const).map((core) => (
                <button
                  key={core}
                  onClick={() => {
                    playSound('switch');
                    setActiveCore(core);
                  }}
                  className={`px-3 py-1 rounded-md transition cursor-pointer ${
                    activeCore === core
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {core}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>SYNC RATE: 120Hz</span>
              </span>
            </div>
          </div>

          {/* Grid of 4 Interactive HUD Sub-Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Panel 1: Real-time Node Matrix */}
            <div className="p-4 rounded-xl bg-black/30 border border-zinc-800/80 hover:border-cyan-500/40 transition group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>NODE TOPOLOGY</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                  24 ACTIVE
                </span>
              </div>

              {/* 24 Interactive Node Dots */}
              <div className="grid grid-cols-6 gap-2 my-2">
                {Array.from({ length: 24 }).map((_, i) => {
                  const isActive = activeNodesMap.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        playSound('click');
                        setActiveNodesMap((prev) =>
                          prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i]
                        );
                      }}
                      className={`h-5 rounded flex items-center justify-center text-[9px] font-mono transition-all cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500 text-black font-bold shadow-sm shadow-cyan-400/50 scale-105'
                          : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                      }`}
                      title={`Toggle Node #${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] text-zinc-500 font-mono flex justify-between mt-3 pt-2 border-t border-zinc-800/60">
                <span>CLICK NODES TO TOGGLE</span>
                <span className="text-zinc-400">{(activeNodesMap.length / 24 * 100).toFixed(0)}% LOAD</span>
              </div>
            </div>

            {/* Panel 2: Memory & Bandwidth Meter */}
            <div className="p-4 rounded-xl bg-black/30 border border-zinc-800/80 hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>THROUGHPUT BUFFER</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  14.8 TB/s
                </span>
              </div>

              <div className="space-y-3 my-2">
                <div>
                  <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                    <span>L3 Ring Buffer</span>
                    <span className="text-zinc-200">72%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      initial={{ width: '60%' }}
                      animate={{ width: burstActive ? '94%' : '72%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                    <span>Quantum Coherence</span>
                    <span className="text-cyan-300">{telemetry.quantumCoherence}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400"
                      style={{ width: `${telemetry.quantumCoherence}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 font-mono flex justify-between mt-3 pt-2 border-t border-zinc-800/60">
                <span>JITTER: &lt; 0.04ms</span>
                <span className="text-emerald-400">OPTIMAL</span>
              </div>
            </div>

            {/* Panel 3: Live Waveform Oscilloscope */}
            <div className="p-4 rounded-xl bg-black/30 border border-zinc-800/80 hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  <span>LATENCY WAVEFORM</span>
                </div>
                <span className="text-[11px] font-mono text-sky-400">
                  {telemetry.renderLatencyMs}ms
                </span>
              </div>

              {/* Dynamic SVG Waveform */}
              <div className="h-16 w-full flex items-center justify-center my-1 bg-zinc-950/60 rounded-lg p-2 border border-zinc-800/40">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path
                    d={
                      burstActive
                        ? 'M 0 15 Q 12 0, 25 15 T 50 15 T 75 15 T 100 15'
                        : 'M 0 15 Q 10 7, 20 15 T 40 15 T 60 15 T 80 15 T 100 15'
                    }
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  <path
                    d="M 0 15 Q 15 22, 30 15 T 60 15 T 90 15 T 100 15"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    opacity="0.6"
                  />
                </svg>
              </div>

              <div className="text-[10px] text-zinc-500 font-mono flex justify-between mt-2 pt-2 border-t border-zinc-800/60">
                <span>FPS: {telemetry.fps}</span>
                <span className="text-sky-400 font-medium">60 FPS LOCKED</span>
              </div>
            </div>

            {/* Panel 4: Quick Action Protocol */}
            <div className="p-4 rounded-xl bg-black/30 border border-zinc-800/80 hover:border-cyan-500/40 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>SYSTEM PROTOCOL</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
                    KYBER-1024
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-3">
                  Hardware-grounded ephemeral encryption active on all client events.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  id="hero-burst-btn"
                  onClick={handleTriggerBurst}
                  className="flex-1 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>BURST</span>
                </button>
                <button
                  id="hero-overclock-btn"
                  onClick={triggerEasterEgg}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono transition active:scale-95 cursor-pointer"
                  title="Overclock Mode"
                >
                  <Flame className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
