import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BootSequence } from './components/BootSequence';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CommandCenterSection } from './components/CommandCenterSection';
import { DashboardSection } from './components/DashboardSection';
import { ModulesSection } from './components/ModulesSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { DiagnosticBenchmarkSection } from './components/DiagnosticBenchmarkSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CommandCenter } from './components/CommandCenter';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SettingsModal } from './components/SettingsModal';
import { NotificationCenter } from './components/NotificationCenter';
import { EasterEggModal } from './components/EasterEggModal';
import { ScrollProgressBar } from './components/ScrollProgressBar';

function MainExperience() {
  const { settings } = useApp();

  const getThemeClass = () => {
    switch (settings.theme) {
      case 'light':
        return 'bg-[#f4f6fa] text-zinc-900';
      case 'oled':
        return 'bg-[#000000] text-zinc-100';
      case 'midnight':
        return 'bg-[#050b18] text-zinc-100';
      default:
        return 'bg-[#07090e] text-zinc-100';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${getThemeClass()} overflow-x-hidden relative`}>
      {/* Scroll Progress Bar at the top */}
      <ScrollProgressBar />

      {/* Booting Sequence */}
      <BootSequence />

      {/* Subtle Custom Cursor (Desktop Only) */}
      <CustomCursor />

      {/* Floating Cinematic Navigation Bar */}
      <Navbar />

      {/* Main Sections */}
      <main className="relative z-10">
        <HeroSection />
        <CommandCenterSection />
        <DashboardSection />
        <ModulesSection />
        <ArchitectureSection />
        <DiagnosticBenchmarkSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals and Overlays */}
      <CommandCenter />
      <GlobalSearchModal />
      <SettingsModal />
      <NotificationCenter />
      <EasterEggModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainExperience />
    </AppProvider>
  );
}
