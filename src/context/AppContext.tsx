import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, NotificationItem, SystemModule, ContactSubmission, SystemTelemetryState } from '../types';
import { INITIAL_NOTIFICATIONS, INITIAL_MODULES } from '../data/mockData';
import { soundManager } from '../utils/audio';

interface AppContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
  
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  simulateAlert: () => void;

  isCommandCenterOpen: boolean;
  setIsCommandCenterOpen: (open: boolean) => void;
  
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  activeModuleDetail: SystemModule | null;
  setActiveModuleDetail: (module: SystemModule | null) => void;

  isEasterEggOpen: boolean;
  setIsEasterEggOpen: (open: boolean) => void;
  triggerEasterEgg: () => void;

  isBooting: boolean;
  setIsBooting: (booting: boolean) => void;
  rebootSystem: () => void;

  activeSection: string;
  setActiveSection: (section: string) => void;

  telemetry: SystemTelemetryState;
  toggleSimulation: () => void;
  injectFault: () => void;
  
  submissions: ContactSubmission[];
  addSubmission: (submission: Omit<ContactSubmission, 'id' | 'timestamp'>) => void;
  clearSubmissions: () => void;

  playSound: (type: 'click' | 'hover' | 'switch' | 'success' | 'boot' | 'overclock' | 'error') => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  animationIntensity: 'cinematic',
  reducedMotion: false,
  uiDensity: 'normal',
  enable3D: true,
  soundFx: false,
  parallaxStrength: 0.7,
  showFpsCounter: true,
  performanceMode: false,
  customCursor: true,
  demoNotifications: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'kryo_nexus_settings_v1';
const NOTIFICATIONS_STORAGE_KEY = 'kryo_nexus_notifications_v1';
const SUBMISSIONS_STORAGE_KEY = 'kryo_nexus_submissions_v1';

export function AppProvider({ children }: { children: ReactNode }) {
  // 1. Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Sync theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-oled', 'theme-midnight', 'theme-light', 'dark', 'light');
    if (settings.theme === 'light') {
      root.classList.add('theme-light', 'light');
    } else if (settings.theme === 'oled') {
      root.classList.add('theme-oled', 'dark');
    } else if (settings.theme === 'midnight') {
      root.classList.add('theme-midnight', 'dark');
    } else {
      root.classList.add('theme-dark', 'dark');
    }
  }, [settings.theme]);

  // 2. Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_NOTIFICATIONS;
  });

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const saveNotifications = (items: NotificationItem[]) => {
    setNotifications(items);
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
    playSound('switch');
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
    playSound('click');
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false,
    };
    saveNotifications([newNotif, ...notifications.slice(0, 19)]);
    playSound('success');
  };

  const simulateAlert = () => {
    const mockTitles = [
      'Neural Mesh Auto-Healed',
      'Quantum Buffer Snapshot Saved',
      'Inbound High-Throughput Packet Burst',
      'L3 Cache Line Re-indexed',
      'Kyber-1024 Ephemeral Rotation Done',
    ];
    const mockDescriptions = [
      'Worker pool 09 dynamically balanced 1,024 concurrent task streams.',
      'Delta compression saved 4.2 GB memory with zero lock stalls.',
      'Peak bandwidth spiked to 18.4 TB/s, absorbed cleanly by ring buffers.',
      'Memory latency reduced to 0.28ms following page table defragmentation.',
      'Lattice key pairs regenerated across all 4,096 active edge nodes.',
    ];
    const randomIndex = Math.floor(Math.random() * mockTitles.length);
    const types: NotificationItem['type'][] = ['success', 'info', 'telemetry', 'alert'];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    addNotification({
      title: mockTitles[randomIndex],
      description: mockDescriptions[randomIndex],
      type: chosenType,
      tag: 'SIMULATED',
    });
  };

  // 3. UI Modal States
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeModuleDetail, setActiveModuleDetail] = useState<SystemModule | null>(null);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // 4. Sound helper
  const playSound = (type: 'click' | 'hover' | 'switch' | 'success' | 'boot' | 'overclock' | 'error') => {
    if (!settings.soundFx) return;
    switch (type) {
      case 'click':
        soundManager.playClick(true);
        break;
      case 'hover':
        soundManager.playHover(true);
        break;
      case 'switch':
        soundManager.playSwitch(true);
        break;
      case 'success':
        soundManager.playSuccess(true);
        break;
      case 'boot':
        soundManager.playBoot(true);
        break;
      case 'overclock':
        soundManager.playOverclock(true);
        break;
      case 'error':
        soundManager.playError(true);
        break;
    }
  };

  const rebootSystem = () => {
    setIsBooting(true);
    playSound('boot');
  };

  const triggerEasterEgg = () => {
    setIsEasterEggOpen(true);
    playSound('overclock');
  };

  // 5. Global Telemetry Engine (Live FPS and real-time fluctuating stats)
  const [telemetry, setTelemetry] = useState<SystemTelemetryState>({
    fps: 60,
    memoryUsageMb: 142.8,
    activeNodes: 4096,
    quantumCoherence: 99.98,
    packetLossRate: 0.0001,
    renderLatencyMs: 1.2,
    uptimeSeconds: 8420,
    isOverclocked: false,
    isSimulationLive: true,
    activeSessions: 12840,
    systemLoadPercent: 48.2,
    networkThroughputGbps: 184.6,
  });

  const toggleSimulation = () => {
    setTelemetry((prev) => {
      const nextState = !prev.isSimulationLive;
      playSound(nextState ? 'switch' : 'click');
      return { ...prev, isSimulationLive: nextState };
    });
  };

  const injectFault = () => {
    playSound('error');
    setTelemetry((prev) => ({
      ...prev,
      systemLoadPercent: +(88 + Math.random() * 8).toFixed(1),
      packetLossRate: +(0.004 + Math.random() * 0.002).toFixed(4),
      renderLatencyMs: +(4.2 + Math.random() * 1.5).toFixed(2),
      quantumCoherence: 96.4,
    }));
    simulateAlert();

    // Auto heal after 2.5s
    setTimeout(() => {
      setTelemetry((prev) => ({
        ...prev,
        systemLoadPercent: 49.5,
        packetLossRate: 0.0001,
        renderLatencyMs: 1.2,
        quantumCoherence: 99.98,
      }));
      playSound('success');
    }, 2500);
  };

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const calculateFps = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        const currentFps = Math.min(144, Math.round((frameCount * 1000) / (now - lastTime)));
        setTelemetry((prev) => {
          if (!prev.isSimulationLive) {
            return {
              ...prev,
              fps: currentFps,
              isOverclocked: isEasterEggOpen,
            };
          }

          const loadJitter = (Math.random() - 0.5) * 3;
          const sessionJitter = Math.floor((Math.random() - 0.5) * 16);
          const throughputJitter = (Math.random() - 0.5) * 8;

          return {
            ...prev,
            fps: currentFps,
            uptimeSeconds: prev.uptimeSeconds + 1,
            memoryUsageMb: +(140 + Math.sin(now / 5000) * 12 + Math.random() * 2).toFixed(1),
            quantumCoherence: +(99.94 + Math.random() * 0.05).toFixed(2),
            renderLatencyMs: +(1.1 + Math.random() * 0.3).toFixed(2),
            systemLoadPercent: +Math.max(15, Math.min(95, prev.systemLoadPercent + loadJitter)).toFixed(1),
            activeSessions: Math.max(1000, prev.activeSessions + sessionJitter),
            networkThroughputGbps: +Math.max(50, Math.min(400, prev.networkThroughputGbps + throughputJitter)).toFixed(1),
            isOverclocked: isEasterEggOpen,
          };
        });
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calculateFps);
    };

    animId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(animId);
  }, [isEasterEggOpen]);

  // Periodic Demo Notifications Generator
  useEffect(() => {
    if (!settings.demoNotifications) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        simulateAlert();
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [settings.demoNotifications]);

  // 6. Submissions Storage
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(() => {
    try {
      const stored = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      {
        id: 'sub-init-1',
        timestamp: 'Today at 14:22 UTC',
        name: 'Alex Vance',
        email: 'vance@blackmesa.internal',
        organization: 'Lambda Neural Research',
        priority: 'Critical Protocol',
        message: 'Synchronized telemetry streams with KRYO cluster 04. Zero packet jitter observed across 100M payload benchmark.',
        systemFingerprint: 'FP-889-KYRO-NODE-PROD',
      },
    ];
  });

  const addSubmission = (submission: Omit<ContactSubmission, 'id' | 'timestamp'>) => {
    const newEntry: ContactSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
    };
    const nextList = [newEntry, ...submissions];
    setSubmissions(nextList);
    try {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(nextList));
    } catch {
      // ignore
    }
    playSound('success');
  };

  const clearSubmissions = () => {
    setSubmissions([]);
    try {
      localStorage.removeItem(SUBMISSIONS_STORAGE_KEY);
    } catch {
      // ignore
    }
    playSound('click');
  };

  // 7. Global Keyboard Listeners
  useEffect(() => {
    let keyBuffer = '';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Easter Egg Key Tracker: "kryo"
      if (!['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-8);
        if (keyBuffer.includes('kryo')) {
          keyBuffer = '';
          triggerEasterEgg();
          return;
        }
      }

      // Command Palette (Ctrl+K or Cmd+K)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandCenterOpen((prev) => !prev);
        setIsSearchOpen(false);
        setIsSettingsOpen(false);
        setIsNotificationsOpen(false);
        playSound('switch');
        return;
      }

      // Quick Search shortcut '/'
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
        setIsCommandCenterOpen(false);
        playSound('switch');
        return;
      }

      // Escape key closes everything
      if (e.key === 'Escape') {
        if (
          isCommandCenterOpen ||
          isSearchOpen ||
          isSettingsOpen ||
          isNotificationsOpen ||
          activeModuleDetail ||
          isEasterEggOpen
        ) {
          setIsCommandCenterOpen(false);
          setIsSearchOpen(false);
          setIsSettingsOpen(false);
          setIsNotificationsOpen(false);
          setActiveModuleDetail(null);
          setIsEasterEggOpen(false);
          playSound('click');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandCenterOpen, isSearchOpen, isSettingsOpen, isNotificationsOpen, activeModuleDetail, isEasterEggOpen, settings.soundFx]);

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        addNotification,
        simulateAlert,
        isCommandCenterOpen,
        setIsCommandCenterOpen,
        isSearchOpen,
        setIsSearchOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        activeModuleDetail,
        setActiveModuleDetail,
        isEasterEggOpen,
        setIsEasterEggOpen,
        triggerEasterEgg,
        isBooting,
        setIsBooting,
        rebootSystem,
        activeSection,
        setActiveSection,
        telemetry,
        toggleSimulation,
        injectFault,
        submissions,
        addSubmission,
        clearSubmissions,
        playSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
