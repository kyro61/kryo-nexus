import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const BOOT_CHECKPOINTS = [
  { label: 'CORE SYSTEM', status: 'OK', delay: 150 },
  { label: 'INTERFACE', status: 'OK', delay: 350 },
  { label: 'MODULES', status: 'OK', delay: 550 },
  { label: 'NETWORK', status: 'OK', delay: 750 },
];

export const BootSequence: React.FC = () => {
  const { isBooting, setIsBooting, playSound, settings } = useApp();
  const [phase, setPhase] = useState<'init' | 'checks' | 'online' | 'done'>('init');
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    try {
      const visited = localStorage.getItem('kryo_nexus_visited_v3');
      if (visited) {
        setIsFirstVisit(false);
      } else {
        localStorage.setItem('kryo_nexus_visited_v3', 'true');
        setIsFirstVisit(true);
      }
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    if (!isBooting) return;

    playSound('boot');
    setPhase('init');
    setCheckedSteps([]);

    // Timing config based on returning user or settings
    const isRapid = !isFirstVisit || settings.animationIntensity === 'rapid';
    const initDelay = isRapid ? 200 : 500;
    const stepDuration = isRapid ? 120 : 260;
    const onlineDuration = isRapid ? 350 : 700;

    const t1 = setTimeout(() => {
      setPhase('checks');
      BOOT_CHECKPOINTS.forEach((_, idx) => {
        setTimeout(() => {
          setCheckedSteps((prev) => [...prev, idx]);
          playSound('hover');
        }, (idx + 1) * stepDuration);
      });
    }, initDelay);

    const checksTotalTime = initDelay + BOOT_CHECKPOINTS.length * stepDuration;

    const t2 = setTimeout(() => {
      setPhase('online');
      playSound('success');
    }, checksTotalTime + 150);

    const t3 = setTimeout(() => {
      setIsBooting(false);
    }, checksTotalTime + 150 + onlineDuration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isBooting, isFirstVisit, settings.animationIntensity]);

  if (!isBooting) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="boot-screen"
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.04,
          filter: 'blur(10px)',
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[9999] bg-[#05070a] text-zinc-100 flex flex-col items-center justify-center p-6 select-none overflow-hidden"
      >
        {/* Subtle geometric grid backdrop */}
        <div className="absolute inset-0 tech-grid-subtle opacity-30 pointer-events-none" />

        {/* Ambient Corner Frame HUD brackets */}
        <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-cyan-500/40" />
        <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-cyan-500/40" />
        <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-cyan-500/40" />
        <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-cyan-500/40" />

        {/* Primary Terminal Window */}
        <div className="relative w-full max-w-lg bg-[#0a0d14]/90 border border-zinc-800/90 rounded-2xl p-8 shadow-2xl shadow-black/90 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs text-zinc-400 tracking-wider">
                KRYO OS // INITIALIZATION MATRIX
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              v3.0.0
            </span>
          </div>

          {/* Main Stage Animation */}
          <div className="min-h-[140px] flex flex-col justify-center font-mono">
            {phase === 'init' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-cyan-300 text-sm font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>INITIALIZING KRYO NEXUS...</span>
              </motion.div>
            )}

            {phase === 'checks' && (
              <div className="space-y-2.5">
                <div className="text-xs text-zinc-500 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>INITIALIZING KRYO NEXUS...</span>
                </div>
                {BOOT_CHECKPOINTS.map((chk, idx) => {
                  const isPassed = checkedSteps.includes(idx);
                  return (
                    <motion.div
                      key={chk.label}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: isPassed ? 1 : 0.4, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-between text-xs py-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400/80" />
                        <span className="text-zinc-300 tracking-wider">{chk.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-600">................</span>
                        <span
                          className={`font-semibold ${
                            isPassed ? 'text-emerald-400' : 'text-zinc-600'
                          }`}
                        >
                          {isPassed ? chk.status : 'PENDING'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {phase === 'online' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4 space-y-2"
              >
                <div className="text-2xl font-bold font-display text-white tracking-widest">
                  KRYO NEXUS
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold tracking-widest shadow-lg shadow-emerald-950/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Skip Button */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>{!isFirstVisit ? 'RETURNING OPERATOR DETECTED' : 'FIRST BOOT PROTOCOL'}</span>
            <button
              id="boot-skip-btn"
              onClick={() => {
                setIsBooting(false);
                playSound('click');
              }}
              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition cursor-pointer"
            >
              SKIP [ESC]
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
