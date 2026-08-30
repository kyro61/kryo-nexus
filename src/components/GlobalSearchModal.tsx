import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Layers, Cpu, Zap, Activity, Gauge, Moon, Sun, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SEARCH_INDEX } from '../data/mockData';
import { SearchResultItem } from '../types';
import { useApp } from '../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    updateSettings,
    setIsSettingsOpen,
    setIsTerminalOpen,
    rebootSystem,
    triggerEasterEgg,
    playSound,
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const categories = ['ALL', 'Navigation', 'System Module', 'Telemetry', 'Command Action', 'Settings'];

  const filteredResults = SEARCH_INDEX.filter((item) => {
    const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.snippet.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleSelectResult = (item: SearchResultItem) => {
    playSound('switch');
    setIsSearchOpen(false);

    if (item.sectionId) {
      const el = document.getElementById(item.sectionId);
      if (el) {
        const offset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
      return;
    }

    if (item.actionKey === 'THEME_OLED') updateSettings({ theme: 'oled' });
    else if (item.actionKey === 'THEME_MIDNIGHT') updateSettings({ theme: 'midnight' });
    else if (item.actionKey === 'THEME_LIGHT') updateSettings({ theme: 'light' });
    else if (item.actionKey === 'TRIGGER_OVERCLOCK') triggerEasterEgg();
    else if (item.actionKey === 'OPEN_SETTINGS') setIsSettingsOpen(true);
    else if (item.actionKey === 'OPEN_TERMINAL') setIsTerminalOpen(true);
    else if (item.actionKey === 'REBOOT_SYSTEM') rebootSystem();
  };

  // Helper to highlight matching text query
  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <span key={i} className="bg-cyan-500/30 text-cyan-300 font-semibold px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-start justify-center pt-16 px-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playSound('click');
            setIsSearchOpen(false);
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Search Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl glass-panel rounded-2xl border border-zinc-700 shadow-2xl z-10 overflow-hidden text-zinc-100 flex flex-col max-h-[80vh]"
        >
          {/* Top Search Bar */}
          <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search components, documentation, telemetry, actions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 p-3 border-b border-zinc-800/80 bg-black/20 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playSound('hover');
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Grid / List */}
          <div className="p-3 overflow-y-auto flex-1 space-y-2">
            {filteredResults.length === 0 ? (
              <div className="py-16 text-center text-xs font-mono text-zinc-500">
                NO RESULTS MATCHING "{query.toUpperCase()}"
              </div>
            ) : (
              filteredResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  className="w-full p-3 rounded-xl bg-black/30 hover:bg-zinc-800/60 border border-zinc-800 hover:border-cyan-500/40 transition text-left cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-display text-white group-hover:text-cyan-300 transition">
                        {highlightMatch(item.title, query)}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans line-clamp-1">
                      {highlightMatch(item.snippet, query)}
                    </p>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-cyan-400 group-hover:bg-cyan-950 transition ml-3 flex-shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-black/40 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>{filteredResults.length} RESULTS INDEXED</span>
            <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400">
              ESC TO CLOSE
            </kbd>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
