import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Command,
  Cpu,
  Layers,
  Zap,
  Activity,
  Gauge,
  Send,
  Sliders,
  Moon,
  Sun,
  Flame,
  RotateCcw,
  Sparkles,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Action' | 'Theme' | 'System';
  shortcut?: string;
  icon: React.ElementType;
  action: () => void;
}

export const CommandCenter: React.FC = () => {
  const {
    isCommandCenterOpen,
    setIsCommandCenterOpen,
    setIsSettingsOpen,
    setIsNotificationsOpen,
    settings,
    updateSettings,
    rebootSystem,
    triggerEasterEgg,
    playSound,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollTo = (id: string) => {
    setIsCommandCenterOpen(false);
    playSound('switch');
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const commands: CommandItem[] = [
    {
      id: 'cmd-nav-hero',
      title: 'Navigate to Nexus Core (Hero Interface)',
      category: 'Navigation',
      shortcut: 'G H',
      icon: Cpu,
      action: () => scrollTo('hero'),
    },
    {
      id: 'cmd-nav-telemetry',
      title: 'Navigate to Telemetry & Load Dashboard',
      category: 'Navigation',
      shortcut: 'G T',
      icon: Activity,
      action: () => scrollTo('dashboard'),
    },
    {
      id: 'cmd-nav-modules',
      title: 'Navigate to System Architecture Modules',
      category: 'Navigation',
      shortcut: 'G M',
      icon: Layers,
      action: () => scrollTo('modules'),
    },
    {
      id: 'cmd-nav-pipeline',
      title: 'Navigate to Pipeline Execution Flow',
      category: 'Navigation',
      shortcut: 'G P',
      icon: Zap,
      action: () => scrollTo('architecture'),
    },
    {
      id: 'cmd-nav-diag',
      title: 'Navigate to Hardware Benchmarks',
      category: 'Navigation',
      shortcut: 'G D',
      icon: Gauge,
      action: () => scrollTo('diagnostics'),
    },
    {
      id: 'cmd-nav-contact',
      title: 'Navigate to Dispatch Terminal',
      category: 'Navigation',
      shortcut: 'G C',
      icon: Send,
      action: () => scrollTo('contact'),
    },
    {
      id: 'cmd-act-settings',
      title: 'Open System Preferences & Settings',
      category: 'Action',
      shortcut: '⌘ ,',
      icon: Sliders,
      action: () => {
        setIsCommandCenterOpen(false);
        setIsSettingsOpen(true);
        playSound('switch');
      },
    },
    {
      id: 'cmd-act-theme-dark',
      title: 'Theme: Cyber Charcoal Dark',
      category: 'Theme',
      icon: Moon,
      action: () => {
        updateSettings({ theme: 'dark' });
        setIsCommandCenterOpen(false);
        playSound('switch');
      },
    },
    {
      id: 'cmd-act-theme-oled',
      title: 'Theme: Pure OLED Pitch Black',
      category: 'Theme',
      icon: Moon,
      action: () => {
        updateSettings({ theme: 'oled' });
        setIsCommandCenterOpen(false);
        playSound('switch');
      },
    },
    {
      id: 'cmd-act-theme-midnight',
      title: 'Theme: Midnight Blue Cyber',
      category: 'Theme',
      icon: Sparkles,
      action: () => {
        updateSettings({ theme: 'midnight' });
        setIsCommandCenterOpen(false);
        playSound('switch');
      },
    },
    {
      id: 'cmd-act-theme-light',
      title: 'Theme: High Contrast Daylight',
      category: 'Theme',
      icon: Sun,
      action: () => {
        updateSettings({ theme: 'light' });
        setIsCommandCenterOpen(false);
        playSound('switch');
      },
    },
    {
      id: 'cmd-act-sound',
      title: settings.soundFx ? 'Mute Web Audio Tactile Synthesizer' : 'Enable Web Audio Tactile Synthesizer',
      category: 'System',
      icon: settings.soundFx ? VolumeX : Volume2,
      action: () => {
        updateSettings({ soundFx: !settings.soundFx });
        setIsCommandCenterOpen(false);
        playSound('click');
      },
    },
    {
      id: 'cmd-act-overclock',
      title: 'Trigger Overclock / God Mode Protocol',
      category: 'System',
      shortcut: 'K R Y O',
      icon: Flame,
      action: () => {
        setIsCommandCenterOpen(false);
        triggerEasterEgg();
      },
    },
    {
      id: 'cmd-act-reboot',
      title: 'Re-run Cinematic Boot Sequence',
      category: 'System',
      icon: RotateCcw,
      action: () => {
        setIsCommandCenterOpen(false);
        rebootSystem();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isCommandCenterOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandCenterOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      playSound('hover');
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      playSound('hover');
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  if (!isCommandCenterOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-start justify-center pt-20 px-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playSound('click');
            setIsCommandCenterOpen(false);
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Palette Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl glass-panel rounded-2xl border border-zinc-700 shadow-2xl z-10 overflow-hidden text-zinc-100"
        >
          {/* Input Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-zinc-800">
            <Search className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search actions..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-mono"
            />
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400 font-mono">
              ESC TO CLOSE
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-500">
                NO MATCHING COMMANDS FOUND
              </div>
            ) : (
              filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = selectedIndex === idx;

                return (
                  <button
                    key={cmd.id}
                    onClick={() => cmd.action()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-mono transition cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                        : 'text-zinc-300 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-zinc-800/80 text-zinc-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">{cmd.title}</div>
                        <div className="text-[10px] text-zinc-500">{cmd.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {cmd.shortcut && (
                        <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-zinc-700/60 text-[10px] text-zinc-400 font-mono">
                          {cmd.shortcut}
                        </kbd>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-zinc-600'}`} />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts Guide */}
          <div className="px-4 py-2.5 bg-black/40 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <div className="flex items-center gap-3">
              <span>↑ ↓ Navigate</span>
              <span>↵ Execute</span>
              <span>Esc Close</span>
            </div>
            <span className="text-cyan-400">{filteredCommands.length} COMMANDS AVAILABLE</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
