import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Zap, Cpu, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

const BOOT_LOGS = [
  { text: 'BIOS INITIALIZATION: KRYO-QUANTUM-HOST 0x88F0', delay: 100 },
  { text: 'LOADING SPATIAL COMPUTE KERNEL v4.12.0...', delay: 250 },
  { text: 'MOUNTING LOCK-FREE RING BUFFERS (64MB L3 CACHE)', delay: 400 },
  { text: 'STARTING 4,096 AUTONOMOUS NEURAL vNODES...', delay: 580 },
  { text: 'ESTABLISHING KYBER-1024 CRYPTOGRAPHIC HANDSHAKE', delay: 750 },
  { text: 'CALIBRATING ZERO-LATENCY INTERACTION PIPELINE', delay: 920 },
  { text: 'ALL SUBSYSTEMS NOMINAL. COMPOSITING HUD MATRIX...', delay: 1100 },
];

export const BootSequence: React.FC = () => {
  const { isBooting, setIsBooting, playSound, settings } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isBooting) return;

    // Trigger boot sound
    playSound('boot');

    const duration = settings.animationIntensity === 'rapid' ? 800 : settings.animationIntensity === 'minimal' ? 400 : 1600;
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsBooting(false);
            playSound('success');
          }, 200);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Stagger boot log messages
    BOOT_LOGS.forEach((_, idx) => {
      setTimeout(() => {
        setCurrentStep(idx);
      }, (duration / BOOT_LOGS.length) * idx);
    });

    return () => clearInterval(timer);
  }, [isBooting, settings.animationIntensity]);

  if (!isBooting) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="boot-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[9999] bg-[#05070a] text-zinc-100 flex flex-col items-center justify-center p-6 select-none overflow-hidden"
      >
        {/* Subtle geometric grid frame */}
        <div className="absolute inset-0 tech-grid-subtle opacity-40 pointer-events-none" />

        {/* Outer cinematic corner brackets */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />

        {/* Center Boot Terminal Box */}
        <div className="relative w-full max-w-xl glass-panel rounded-xl p-6 sm:p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-950/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="font-display font-bold text-sm tracking-wider text-white flex items-center gap-2">
                  KRYO NEXUS OS <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">v4.12</span>
                </div>
                <div className="text-xs text-zinc-400 font-mono">AUTONOMOUS SPATIAL KERNEL</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono text-cyan-400 font-medium">BOOTING</span>
            </div>
          </div>

          {/* Console Log Stream */}
          <div className="font-mono text-xs space-y-2 mb-6 min-h-[140px] bg-black/40 rounded-lg p-3.5 border border-zinc-800/60 overflow-hidden">
            {BOOT_LOGS.slice(0, currentStep + 1).map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className={index === currentStep ? 'text-cyan-300 font-medium' : 'text-zinc-400'}>
                  {log.text}
                </span>
                {index < currentStep && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-auto flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">INTERFACE COMPILATION</span>
              <span className="text-cyan-400 font-semibold">{Math.min(100, Math.round(progress))}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>

          {/* Interactive Fast Skip CTA */}
          <div className="mt-6 flex items-center justify-between text-xs pt-3 border-t border-zinc-800/40">
            <span className="text-zinc-500 font-mono">PRE-WARMING 64 SHADERS</span>
            <button
              id="boot-skip-button"
              onClick={() => {
                setIsBooting(false);
                playSound('click');
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white font-mono text-xs transition border border-zinc-700/60 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>SKIP BOOT</span>
              <span className="text-[10px] opacity-60">↵</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
