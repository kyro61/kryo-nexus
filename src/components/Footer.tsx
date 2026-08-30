import React from 'react';
import { Cpu, ShieldCheck, Terminal, Heart, Zap, Command, Sliders, ArrowUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { telemetry, setIsCommandCenterOpen, setIsSettingsOpen, triggerEasterEgg, playSound } = useApp();

  const scrollToTop = () => {
    playSound('switch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-zinc-800/80 bg-[#06080e] text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto flex flex-col space-y-8">
        {/* Top Tier */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-800/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm tracking-wider">
                KRYO NEXUS <span className="text-cyan-400 text-xs font-mono">v4.12</span>
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">AUTONOMOUS SPATIAL COMPUTE ENGINE</div>
            </div>
          </div>

          {/* Quick System Telemetry Pill */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>CLUSTER: ONLINE (4,096 NODES)</span>
            </span>
            <span className="text-zinc-600">|</span>
            <span>FRAME: {telemetry.fps} FPS</span>
            <span className="text-zinc-600">|</span>
            <span>LATENCY: {telemetry.renderLatencyMs}ms</span>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            title="Return to top of page"
          >
            <ArrowUp className="w-4 h-4" />
            <span>TOP</span>
          </button>
        </div>

        {/* Middle Tier: Shortcuts & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                playSound('click');
                setIsCommandCenterOpen(true);
              }}
              className="hover:text-cyan-400 transition cursor-pointer flex items-center gap-1"
            >
              <Command className="w-3.5 h-3.5" />
              <span>COMMAND PALETTE (⌘K)</span>
            </button>
            <button
              onClick={() => {
                playSound('click');
                setIsSettingsOpen(true);
              }}
              className="hover:text-cyan-400 transition cursor-pointer flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>SYSTEM SETTINGS</span>
            </button>
            <button
              onClick={triggerEasterEgg}
              className="hover:text-purple-400 transition cursor-pointer flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>OVERCLOCK PROTOCOL</span>
            </button>
          </div>

          <div>
            <span>ENCRYPTED VIA POST-QUANTUM KYBER-1024</span>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-zinc-600 pt-4 border-t border-zinc-900">
          <div>© {new Date().getFullYear()} KRYO NEXUS INTERACTIVE CORE. ALL RIGHTS RESERVED.</div>
          <div>CINEMATIC SPATIAL ARCHITECTURE • 60+ FPS ZERO-LATENCY INTERACTION</div>
        </div>
      </div>
    </footer>
  );
};
