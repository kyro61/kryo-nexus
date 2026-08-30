import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  Boxes,
  Zap,
  ShieldCheck,
  Database,
  Activity,
  ArrowUpRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { INITIAL_MODULES } from '../data/mockData';
import { SystemModule } from '../types';
import { useApp } from '../context/AppContext';
import { ModuleDetailModal } from './ModuleDetailModal';

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Boxes,
  Zap,
  ShieldCheck,
  Database,
  Activity,
};

// 3D Tilt Card Component
const Interactive3DCard: React.FC<{
  module: SystemModule;
  onOpen: (mod: SystemModule) => void;
}> = ({ module, onOpen }) => {
  const { playSound, settings } = useApp();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const Icon = iconMap[module.iconName] || Cpu;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!settings.enable3D || settings.reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized [-0.5, 0.5]
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;

    setRotateX(-normY * 16 * settings.parallaxStrength);
    setRotateY(normX * 16 * settings.parallaxStrength);
    setGlarePosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        playSound('hover');
        setIsHovered(true);
      }}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        playSound('switch');
        onOpen(module);
      }}
      className="interactive-card relative glass-panel rounded-2xl p-6 border border-zinc-800/80 hover:border-cyan-500/50 cursor-pointer overflow-hidden group shadow-xl hover:shadow-2xl hover:shadow-cyan-950/30 flex flex-col justify-between"
    >
      {/* Glare effect overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-20"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(56, 189, 248, 0.6) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Top Card Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 group-hover:scale-105 transition-all">
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {module.badge}
            </span>
            <div className="w-6 h-6 rounded-lg bg-zinc-800/60 flex items-center justify-center text-zinc-400 group-hover:text-white transition">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div className="text-xs font-mono text-zinc-500 mb-1">{module.category}</div>
        <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
          {module.title}
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-2 mb-4">
          {module.description}
        </p>
      </div>

      {/* Card Stats Footer */}
      <div className="pt-4 border-t border-zinc-800/60">
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-zinc-500 text-[10px] block">THROUGHPUT</span>
            <span className="text-zinc-200 font-semibold">{module.throughput}</span>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] block">LATENCY</span>
            <span className="text-emerald-400 font-semibold">{module.latencyMs}ms</span>
          </div>
        </div>

        {/* Load Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
            <span>THREAD POOL</span>
            <span>{module.loadPercent}% ALLOCATED</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              style={{ width: `${module.loadPercent}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ModulesSection: React.FC = () => {
  const { activeModuleDetail, setActiveModuleDetail } = useApp();

  return (
    <section id="modules" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto select-none">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40 mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>AUTONOMOUS ENGINE CAPABILITIES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Modular Spatial Architecture
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 mt-2 font-normal">
          Click any module to enter deep tactile inspection mode with live thread allocation and diagnostics.
        </p>
      </div>

      {/* Grid of 6 Interactive 3D Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_MODULES.map((mod) => (
          <Interactive3DCard
            key={mod.id}
            module={mod}
            onOpen={(m) => setActiveModuleDetail(m)}
          />
        ))}
      </div>

      {/* Expanded Modal */}
      <ModuleDetailModal
        module={activeModuleDetail}
        onClose={() => setActiveModuleDetail(null)}
      />
    </section>
  );
};
