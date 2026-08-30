import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'motion/react';
import {
  Cpu,
  Zap,
  Activity,
  Layers,
  Shield,
  ArrowRight,
  Command,
  Radio,
  BarChart3,
  Flame,
  CheckCircle,
  TrendingUp,
  Terminal,
  ChevronDown,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MagneticButton } from './MagneticButton';

export const HeroSection: React.FC = () => {
  const {
    settings,
    telemetry,
    playSound,
    setIsCommandCenterOpen,
    setIsTerminalOpen,
    simulateAlert,
    triggerEasterEgg,
  } = useApp();

  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll Parallax for 3D Camera Travel
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const cameraScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const cameraZ = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const typographyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const typographyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const hudY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Mouse Parallax Springs with smooth damping
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.35 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Transform values for 3D UI depth & kinetic typography
  const rotateX = useTransform(
    smoothMouseY,
    [-0.5, 0.5],
    [12 * settings.parallaxStrength, -12 * settings.parallaxStrength]
  );
  const rotateY = useTransform(
    smoothMouseX,
    [-0.5, 0.5],
    [-14 * settings.parallaxStrength, 14 * settings.parallaxStrength]
  );
  const typoShiftX = useTransform(smoothMouseX, [-0.5, 0.5], [-22, 22]);
  const typoShiftY = useTransform(smoothMouseY, [-0.5, 0.5], [-18, 18]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!settings.enable3D || settings.reducedMotion || settings.performanceMode) return;
    const rect = sectionRef.current?.getBoundingClientRect();
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
  const [activeNodesMap, setActiveNodesMap] = useState<number[]>([0, 2, 5, 7, 11, 14, 17, 21]);
  const [burstActive, setBurstActive] = useState(false);
  const [activeCore, setActiveCore] = useState<'NEURAL' | 'SPATIAL' | 'QUANTUM'>('NEURAL');

  // Trigger Burst Simulation
  const handleTriggerBurst = () => {
    playSound('switch');
    setBurstActive(true);
    const randomNodes = Array.from({ length: 14 }, () => Math.floor(Math.random() * 24));
    setActiveNodesMap(randomNodes);
    simulateAlert();

    setTimeout(() => {
      setBurstActive(false);
      playSound('success');
    }, 850);
  };

  const scrollToNext = () => {
    playSound('switch');
    const el = document.getElementById('command-center') || document.getElementById('dashboard');
    if (el) {
      const offset = 70;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-between items-center overflow-hidden perspective-1000 select-none"
    >
      {/* Precision Corner Technical HUD Marks */}
      <div className="absolute top-20 left-6 sm:left-10 font-mono text-[10px] text-zinc-500 tracking-wider hidden sm:block pointer-events-none z-20">
        <div className="flex items-center gap-2 text-cyan-400/80 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>KRYO MATRIX // SYSTEM 01</span>
        </div>
        <div className="text-zinc-600">LOC: 37.7749° N, 122.4194° W</div>
        <div className="text-zinc-600">KERNEL: QUANTUM-COS v4.0</div>
      </div>

      <div className="absolute top-20 right-6 sm:right-10 font-mono text-[10px] text-zinc-500 tracking-wider text-right hidden sm:block pointer-events-none z-20">
        <div className="text-emerald-400/90 font-bold mb-1">STATUS // 100% ONLINE</div>
        <div className="text-zinc-600">RENDER FREQ // {telemetry.fps} FPS</div>
        <div className="text-zinc-600">LATENCY // {telemetry.renderLatencyMs}ms</div>
      </div>

      {/* Main 3D Camera Stage */}
      <motion.div
        style={{
          scale: !settings.reducedMotion ? cameraScale : 1,
          translateZ: !settings.reducedMotion ? cameraZ : 0,
          rotateX: settings.enable3D && !settings.reducedMotion && !settings.performanceMode ? rotateX : 0,
          rotateY: settings.enable3D && !settings.reducedMotion && !settings.performanceMode ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        className="w-full max-w-7xl flex flex-col items-center justify-center my-auto relative z-10 pt-4"
      >
        {/* Giant Kinetic Typography Container */}
        <motion.div
          style={{
            y: typographyY,
            opacity: typographyOpacity,
            x: typoShiftX,
          }}
          className="relative text-center w-full flex flex-col items-center select-none"
        >
          {/* Sub-Header Technical Tag */}
          <motion.div
            initial={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-xl shadow-cyan-950/30 mb-4 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold tracking-widest">NEXUS CORE 04.0</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">AUTONOMOUS SPATIAL MATRIX</span>
            <button
              onClick={handleTriggerBurst}
              className="ml-1 text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 transition cursor-pointer active:scale-95"
              title="Inject load burst into cluster"
            >
              {burstActive ? 'BURSTING...' : 'PULSE'}
            </button>
          </motion.div>

          {/* THE GIANT KRYO DISPLAY HEADING */}
          <div className="relative group cursor-default py-2">
            {/* Background Depth Glint behind typography */}
            <div className="absolute inset-0 -inset-x-12 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-sky-500/0 blur-2xl pointer-events-none rounded-full opacity-60" />

            <motion.h1
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[14rem] font-black tracking-tighter text-white font-display leading-none flex items-center justify-center gap-1 sm:gap-2 drop-shadow-2xl"
            >
              {['K', 'R', 'Y', 'O'].map((char, index) => (
                <motion.span
                  key={char}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    scale: 1.05,
                    color: '#38bdf8',
                    transition: { duration: 0.15 },
                  }}
                  className="inline-block transition-colors cursor-pointer"
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            {/* NEXUS Spaced Sub-Label */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.55em' }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-xl md:text-2xl font-mono text-cyan-400 font-bold uppercase tracking-[0.55em] mt-1 sm:mt-2 text-center pl-[0.55em]"
            >
              N E X U S
            </motion.div>
          </div>

          {/* Cinematic Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed mt-4 px-4"
          >
            A sub-millisecond digital operating environment. Built for autonomous neural pipelines, spatial workloads, and zero-latency cluster synchronization.
          </motion.p>

          {/* Action CTAs using Magnetic Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="flex flex-wrap items-center justify-center gap-3.5 pt-6"
          >
            <MagneticButton
              id="hero-enter-cta"
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={scrollToNext}
            >
              ENTER NEXUS
            </MagneticButton>

            <MagneticButton
              id="hero-command-cta"
              variant="secondary"
              size="lg"
              icon={<Command className="w-4 h-4 text-cyan-400" />}
              iconPosition="left"
              onClick={() => setIsCommandCenterOpen(true)}
            >
              COMMAND PALETTE (⌘K)
            </MagneticButton>

            <MagneticButton
              id="hero-terminal-cta"
              variant="ghost"
              size="lg"
              icon={<Terminal className="w-4 h-4 text-emerald-400" />}
              iconPosition="left"
              onClick={() => setIsTerminalOpen(true)}
            >
              TERMINAL (T)
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Floating Interactive 3D Command Deck (HUD Object) */}
        <motion.div
          style={{
            y: hudY,
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="w-full max-w-5xl glass-panel rounded-2xl p-4 sm:p-6 border border-zinc-700/60 shadow-2xl shadow-black/80 mt-10 relative overflow-hidden"
        >
          {/* Deck Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-5">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-zinc-300 border-l border-zinc-800 pl-3">
                PRIMARY MATRIX DECK // CLUSTER-01
              </span>
            </div>

            {/* Core Mode Switcher */}
            <div className="flex items-center p-1 bg-black/50 rounded-lg border border-zinc-800 text-xs font-mono">
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
                <span>COHERENCE: {telemetry.quantumCoherence}%</span>
              </span>
            </div>
          </div>

          {/* Grid of 4 Interactive HUD Sub-Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Panel 1: Real-time Node Matrix */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>NODE ARRAY</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                  {activeNodesMap.length} / 24
                </span>
              </div>

              {/* Interactive Node Matrix */}
              <div className="grid grid-cols-6 gap-1.5 my-1.5">
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
                      className={`h-4.5 rounded flex items-center justify-center text-[8px] font-mono transition-all cursor-pointer ${
                        isActive
                          ? 'bg-cyan-400 text-black font-bold shadow-sm shadow-cyan-400/50 scale-105'
                          : 'bg-zinc-800/80 text-zinc-500 hover:bg-zinc-700'
                      }`}
                      title={`Toggle Node #${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <div className="text-[9px] text-zinc-500 font-mono flex justify-between mt-2 pt-1.5 border-t border-zinc-800/60">
                <span>INTERACTIVE NODES</span>
                <span className="text-zinc-300">{Math.round((activeNodesMap.length / 24) * 100)}% LOAD</span>
              </div>
            </div>

            {/* Panel 2: Memory & Bandwidth Meter */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>BANDWIDTH</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  {telemetry.networkThroughputGbps} Gbps
                </span>
              </div>

              <div className="space-y-2 py-1">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                    <span>L3 Cache</span>
                    <span className="text-zinc-200">{telemetry.memoryUsageMb} MB</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      animate={{ width: `${(telemetry.memoryUsageMb / 512) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                    <span>Core Load</span>
                    <span className="text-zinc-200">{telemetry.systemLoadPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-sky-400"
                      animate={{ width: `${telemetry.systemLoadPercent}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 3: Quantum Security State */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>ENCRYPTION</span>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">
                  KYBER-1024
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="flex justify-between text-zinc-400">
                  <span>Handshake:</span>
                  <span className="text-emerald-400 font-semibold">VALIDATED</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Entropy Pool:</span>
                  <span className="text-zinc-200">100.0% PURE</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Packet Loss:</span>
                  <span className="text-zinc-200">{telemetry.packetLossRate}%</span>
                </div>
              </div>

              <button
                onClick={() => {
                  playSound('switch');
                  simulateAlert();
                }}
                className="w-full mt-2.5 py-1 text-[10px] font-mono rounded bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/40 transition cursor-pointer"
              >
                ROTATE KEYS
              </button>
            </div>

            {/* Panel 4: Active Engine Performance */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>PERFORMANCE</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                  TIER 3
                </span>
              </div>

              <div className="text-center py-1">
                <div className="text-2xl font-bold font-mono text-white">
                  {telemetry.activeSessions.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-zinc-400">Active Sync Streams</div>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-400">
                <span>SIMD Vector</span>
                <span className="text-emerald-400">AVX-512</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Down Prompt Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        onClick={scrollToNext}
        className="flex flex-col items-center gap-1.5 cursor-pointer text-zinc-500 hover:text-cyan-400 transition-colors z-20 pb-2 select-none"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">EXPLORE ARCHITECTURE</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
};
