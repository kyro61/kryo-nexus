import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sliders,
  Moon,
  Sun,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  Shield,
  Layers,
  Activity,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeMode, AnimationIntensity, UIDensity } from '../types';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, settings, updateSettings, resetSettings, playSound } = useApp();

  if (!isSettingsOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playSound('click');
            setIsSettingsOpen(false);
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Settings Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl glass-panel rounded-2xl p-6 sm:p-8 border border-zinc-700 shadow-2xl z-10 my-auto text-zinc-100 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-white">System Preferences</h3>
                <p className="text-xs text-zinc-400 font-mono">CLIENT RUNTIME CONFIGURATION</p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                setIsSettingsOpen(false);
              }}
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer border border-zinc-700/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Appearance */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-cyan-400">01. APPEARANCE & THEME</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'dark', label: 'Charcoal Dark', icon: Moon },
                { id: 'oled', label: 'Pure OLED', icon: Moon },
                { id: 'midnight', label: 'Midnight Blue', icon: Sparkles },
                { id: 'light', label: 'Clean Light', icon: Sun },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      playSound('switch');
                      updateSettings({ theme: t.id as ThemeMode });
                    }}
                    className={`p-3 rounded-xl border text-xs font-mono flex flex-col items-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
                        : 'bg-black/30 text-zinc-400 border-zinc-800 hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Motion & 3D Depth */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-cyan-400">02. 3D TRANSFORMS & MOTION</div>
            
            {/* 3D Effects Toggle */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white font-mono">Enable 3D Parallax Transforms</div>
                <div className="text-[11px] text-zinc-400">Cards and panels tilt smoothly responding to cursor coordinates.</div>
              </div>
              <button
                onClick={() => {
                  playSound('switch');
                  updateSettings({ enable3D: !settings.enable3D });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.enable3D ? 'bg-cyan-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                    settings.enable3D ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Parallax Strength Slider */}
            {settings.enable3D && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 space-y-2">
                <div className="flex justify-between text-xs font-mono text-zinc-300">
                  <span>3D PARALLAX INTENSITY</span>
                  <span className="text-cyan-400 font-bold">{Math.round(settings.parallaxStrength * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.5"
                  step="0.1"
                  value={settings.parallaxStrength}
                  onChange={(e) => {
                    updateSettings({ parallaxStrength: parseFloat(e.target.value) });
                  }}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            )}
          </div>

          {/* Section 3: Web Audio Tactile Synthesizer */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-cyan-400">03. AUDIO TACTILE FEEDBACK</div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-400">
                  {settings.soundFx ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white font-mono">Synthesized Web Audio Clicks</div>
                  <div className="text-[11px] text-zinc-400">Zero-latency harmonic feedback generated on interactions.</div>
                </div>
              </div>
              <button
                onClick={() => {
                  playSound('switch');
                  updateSettings({ soundFx: !settings.soundFx });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.soundFx ? 'bg-cyan-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                    settings.soundFx ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer Reset & LocalStorage Status */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
            <button
              onClick={() => {
                resetSettings();
                playSound('click');
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer border border-zinc-700/60"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTORE DEFAULTS</span>
            </button>

            <span className="text-zinc-500 text-[11px]">AUTOSAVED TO LOCALSTORAGE</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
