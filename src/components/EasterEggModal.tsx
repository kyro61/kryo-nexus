import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, X, Cpu, Zap, Shield, Sparkles, Terminal, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const EasterEggModal: React.FC = () => {
  const { isEasterEggOpen, setIsEasterEggOpen, playSound, addNotification } = useApp();
  const [overclockFrequency, setOverclockFrequency] = useState(5.4);
  const [matrixStream, setMatrixStream] = useState<string[]>([]);

  useEffect(() => {
    if (!isEasterEggOpen) return;

    // Confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6'],
      });
    } catch {
      // ignore
    }

    addNotification({
      title: 'God Mode / Overclock Matrix Active',
      description: 'Kernel unlocked 16,384 virtual neural threads with 5.4 GHz quantum clocking.',
      type: 'alert',
      tag: 'SECRET',
    });

    // Generate streaming matrix stream
    const chars = '0123456789ABCDEFØX§ΔΩΨ';
    const interval = setInterval(() => {
      const line = Array.from({ length: 48 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      setMatrixStream((prev) => [line, ...prev.slice(0, 7)]);
    }, 120);

    return () => clearInterval(interval);
  }, [isEasterEggOpen]);

  if (!isEasterEggOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 select-none overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playSound('click');
            setIsEasterEggOpen(false);
          }}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#070b14] rounded-2xl p-6 sm:p-8 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/30 z-10 my-auto text-zinc-100 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-900/60 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-500/40">
                <Flame className="w-7 h-7 animate-pulse text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500 text-black font-bold">
                    UNLOCKED
                  </span>
                  <span className="text-xs font-mono text-cyan-300">EASTER EGG PROTOCOL: KRYO</span>
                </div>
                <h3 className="text-2xl font-bold font-display text-white mt-0.5">
                  Quantum Overclock Matrix
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                setIsEasterEggOpen(false);
              }}
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer border border-zinc-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Matrix Stream Monitor */}
          <div className="bg-black/80 rounded-xl p-4 border border-cyan-500/40 font-mono text-xs text-cyan-400 space-y-1 overflow-hidden h-36">
            <div className="text-[10px] text-zinc-500 flex items-center gap-1 mb-1">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE QUANTUM TELEMETRY HEX STREAM</span>
            </div>
            {matrixStream.map((line, i) => (
              <div key={i} className="tracking-widest opacity-90 truncate">
                {line}
              </div>
            ))}
          </div>

          {/* Overclock Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/30">
              <div className="text-zinc-500 text-[10px]">CLOCK FREQ</div>
              <div className="text-cyan-300 text-base font-bold mt-0.5">{overclockFrequency} GHz</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/30">
              <div className="text-zinc-500 text-[10px]">PARALLEL vNODES</div>
              <div className="text-white text-base font-bold mt-0.5">16,384</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/30">
              <div className="text-zinc-500 text-[10px]">LATENCY FLOOR</div>
              <div className="text-emerald-400 text-base font-bold mt-0.5">0.08 ms</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/30">
              <div className="text-zinc-500 text-[10px]">COHERENCE</div>
              <div className="text-purple-400 text-base font-bold mt-0.5">100.0%</div>
            </div>
          </div>

          {/* Interactive Clock Slider */}
          <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/30 space-y-2">
            <div className="flex justify-between text-xs font-mono text-cyan-300">
              <span>MANUAL QUANTUM CLOCK MULTIPLIER</span>
              <span className="font-bold">{overclockFrequency} GHz</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="8.0"
              step="0.1"
              value={overclockFrequency}
              onChange={(e) => {
                setOverclockFrequency(parseFloat(e.target.value));
                playSound('hover');
              }}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Close button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                playSound('click');
                setIsEasterEggOpen(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/30"
            >
              STABILIZE & RETURN
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
