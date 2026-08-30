import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Command,
  Bell,
  Sliders,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Zap,
  Activity,
  Layers,
  Send,
  Gauge,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    settings,
    updateSettings,
    unreadNotificationCount,
    setIsCommandCenterOpen,
    setIsSearchOpen,
    setIsSettingsOpen,
    setIsNotificationsOpen,
    triggerEasterEgg,
    playSound,
    activeSection,
    setActiveSection,
    telemetry,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  // Logo triple click easter egg handler
  const handleLogoClick = () => {
    playSound('click');
    setLogoClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        triggerEasterEgg();
        return 0;
      }
      return next;
    });
    // Reset click count after 800ms
    setTimeout(() => setLogoClickCount(0), 800);
  };

  // Scroll listener for smart navbar hiding/showing and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 40);

      // Hide on scrolling down fast after 150px, show immediately on scroll up
      if (currentScrollY > 150 && currentScrollY > lastScrollY + 10) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 5 || currentScrollY < 100) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);

      // Detect active section based on scroll position
      const sections = ['hero', 'command-center', 'dashboard', 'modules', 'architecture', 'diagnostics', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, setActiveSection]);

  const navItems = [
    { id: 'hero', label: 'Nexus Core', icon: Cpu },
    { id: 'command-center', label: 'Command Center', icon: Command },
    { id: 'dashboard', label: 'Telemetry', icon: Activity },
    { id: 'modules', label: 'Modules', icon: Layers },
    { id: 'architecture', label: 'Pipeline', icon: Zap },
    { id: 'diagnostics', label: 'Diagnostics', icon: Gauge },
    { id: 'contact', label: 'Dispatch', icon: Send },
  ];

  const scrollToSection = (id: string) => {
    playSound('switch');
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const cycleTheme = () => {
    playSound('switch');
    if (settings.theme === 'dark') updateSettings({ theme: 'oled' });
    else if (settings.theme === 'oled') updateSettings({ theme: 'midnight' });
    else if (settings.theme === 'midnight') updateSettings({ theme: 'light' });
    else updateSettings({ theme: 'dark' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -90,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 flex justify-center pointer-events-none"
      >
        <nav
          id="main-floating-navbar"
          className={`pointer-events-auto flex items-center justify-between w-full max-w-6xl px-4 py-2.5 rounded-2xl transition-all duration-300 ${
            settings.theme === 'light'
              ? isScrolled
                ? 'bg-white/90 shadow-xl shadow-zinc-900/5 border border-zinc-200 backdrop-blur-xl'
                : 'bg-white/70 border border-zinc-200/60 backdrop-blur-md'
              : settings.theme === 'oled'
              ? isScrolled
                ? 'bg-black/95 shadow-2xl shadow-cyan-950/20 border border-zinc-800/80 backdrop-blur-2xl'
                : 'bg-black/80 border border-zinc-900 backdrop-blur-lg'
              : settings.theme === 'midnight'
              ? isScrolled
                ? 'bg-[#081126]/90 shadow-2xl shadow-sky-950/40 border border-sky-500/20 backdrop-blur-2xl'
                : 'bg-[#081126]/75 border border-sky-500/10 backdrop-blur-lg'
              : isScrolled
              ? 'bg-[#0c0f18]/90 shadow-2xl shadow-cyan-950/20 border border-zinc-800/80 backdrop-blur-2xl'
              : 'bg-[#0c0f18]/70 border border-zinc-800/50 backdrop-blur-lg'
          }`}
        >
          {/* Brand / Logo */}
          <div className="flex items-center space-x-3">
            <button
              id="navbar-brand-logo"
              onClick={handleLogoClick}
              title="Triple click to trigger Overclock Mode"
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-shadow">
                <div className="w-full h-full bg-[#090b12] rounded-[7px] flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-wider text-white flex items-center gap-1.5">
                  KRYO <span className="text-cyan-400 text-xs font-mono font-normal">NEXUS</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono tracking-tight -mt-0.5">
                  {telemetry.fps} FPS • {telemetry.quantumCoherence}% COHERENCE
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 p-1 bg-zinc-950/40 dark:bg-black/30 rounded-xl border border-zinc-800/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-cyan-400' : 'text-zinc-400'}`} />
                  <span className="relative z-10 font-mono tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Tools & Hotkeys */}
          <div className="flex items-center space-x-2">
            {/* Command Palette Trigger */}
            <button
              id="navbar-cmd-k-trigger"
              onClick={() => {
                playSound('switch');
                setIsCommandCenterOpen(true);
              }}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-300 hover:text-white text-xs font-mono border border-zinc-700/50 transition active:scale-95 cursor-pointer"
              title="Command Palette (Ctrl + K / Cmd + K)"
            >
              <Command className="w-3.5 h-3.5 text-cyan-400" />
              <span>COMMAND</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-400">
                ⌘K
              </kbd>
            </button>

            {/* Quick Search */}
            <button
              id="navbar-search-trigger"
              onClick={() => {
                playSound('click');
                setIsSearchOpen(true);
              }}
              className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/70 text-zinc-300 hover:text-white border border-zinc-700/40 transition active:scale-95 cursor-pointer"
              title="Global Search (/)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <button
              id="navbar-notifications-trigger"
              onClick={() => {
                playSound('click');
                setIsNotificationsOpen(true);
              }}
              className="relative p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/70 text-zinc-300 hover:text-white border border-zinc-700/40 transition active:scale-95 cursor-pointer"
              title="Notifications Center"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 text-[9px] font-bold font-mono text-black items-center justify-center">
                    {unreadNotificationCount}
                  </span>
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              id="navbar-theme-toggle"
              onClick={cycleTheme}
              className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/70 text-zinc-300 hover:text-white border border-zinc-700/40 transition active:scale-95 cursor-pointer"
              title={`Current Theme: ${settings.theme.toUpperCase()} (Click to toggle)`}
            >
              {settings.theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Settings Trigger */}
            <button
              id="navbar-settings-trigger"
              onClick={() => {
                playSound('click');
                setIsSettingsOpen(true);
              }}
              className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/70 text-zinc-300 hover:text-white border border-zinc-700/40 transition active:scale-95 cursor-pointer"
              title="System Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="navbar-mobile-menu-toggle"
              onClick={() => {
                playSound('click');
                setMobileMenuOpen((prev) => !prev);
              }}
              className="lg:hidden p-2 rounded-lg bg-zinc-800/60 text-zinc-300 hover:text-white border border-zinc-700/50 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-20 z-50 p-4 rounded-2xl glass-panel border border-zinc-800 shadow-2xl lg:hidden flex flex-col space-y-2"
          >
            <div className="text-xs font-mono text-zinc-400 px-3 py-1 border-b border-zinc-800/60 flex items-center justify-between">
              <span>SYSTEM NAVIGATION</span>
              <span className="text-cyan-400">{telemetry.activeNodes} NODES ONLINE</span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-zinc-300 hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono">{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-zinc-800/60 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCommandCenterOpen(true);
                }}
                className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-mono flex items-center justify-center gap-1.5"
              >
                <Command className="w-3.5 h-3.5 text-cyan-400" />
                COMMAND ⌘K
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-mono flex items-center justify-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                SETTINGS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
