import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

interface ScreenDef {
  id: string;
  number: string;
  name: string;
}

const SCREENS: ScreenDef[] = [
  { id: 'hero', number: '01', name: 'NEXUS CORE' },
  { id: 'command-center', number: '02', name: 'COMMAND SUITE' },
  { id: 'dashboard', number: '03', name: 'TELEMETRY & ANALYTICS' },
  { id: 'modules', number: '04', name: 'SYSTEM MODULES' },
  { id: 'architecture', number: '05', name: 'PIPELINE ARCHITECTURE' },
  { id: 'diagnostics', number: '06', name: 'HARDWARE BENCHMARK' },
  { id: 'contact', number: '07', name: 'SECURE DISPATCH' },
];

export const ScreenIndicator: React.FC = () => {
  const { activeSection, playSound, settings } = useApp();

  const currentIndex = SCREENS.findIndex((s) => s.id === activeSection);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentScreen = SCREENS[safeIndex];

  const scrollTo = (id: string) => {
    playSound('switch');
    const el = document.getElementById(id);
    if (el) {
      const offset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <aside aria-label="Screen Navigation" className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 pointer-events-auto select-none">
      {/* Current Screen Badge */}
      <div className="px-2.5 py-1 rounded-md bg-zinc-950/85 border border-zinc-800/90 text-right backdrop-blur-md shadow-lg shadow-black/60">
        <div className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">
          SCREEN {currentScreen.number} / {String(SCREENS.length).padStart(2, '0')}
        </div>
        <div className="text-[9px] font-mono text-zinc-400 truncate max-w-[120px]">
          {currentScreen.name}
        </div>
      </div>

      {/* Screen Interactive Dots */}
      <div className="flex flex-col items-end gap-2 pr-1">
        {SCREENS.map((s, idx) => {
          const isActive = idx === safeIndex;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              aria-label={`Jump to Screen ${s.number}: ${s.name}`}
              className="group flex items-center gap-2 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
            >
              {/* Tooltip on hover */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[10px] font-mono text-zinc-300 bg-zinc-900/90 border border-zinc-800 px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none">
                {s.number} • {s.name}
              </span>

              {/* Indicator line/dot */}
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-6 h-1.5 bg-gradient-to-r from-cyan-400 to-sky-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                    : 'w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-400 group-hover:scale-125'
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
};
