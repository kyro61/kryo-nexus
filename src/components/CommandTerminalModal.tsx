import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, CornerDownLeft, Sparkles, Shield, Cpu, Activity, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
  time?: string;
}

export const CommandTerminalModal: React.FC = () => {
  const {
    isTerminalOpen,
    setIsTerminalOpen,
    telemetry,
    toggleSimulation,
    injectFault,
    settings,
    updateSettings,
    rebootSystem,
    triggerEasterEgg,
    playSound,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'welcome-1',
      type: 'system',
      text: 'KRYO NEXUS SHELL v3.0.0 [x86_64-quantum-cos]',
    },
    {
      id: 'welcome-2',
      type: 'system',
      text: 'Type "help" for a list of operational commands. Press ESC or type "exit" to close.',
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTerminalOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isTerminalOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Save to command history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const timestamp = new Date().toLocaleTimeString();
    const newLines: TerminalLine[] = [
      ...lines,
      { id: String(Date.now()), type: 'input', text: `> ${trimmed}`, time: timestamp },
    ];

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase();

    playSound('click');

    switch (cmd) {
      case 'help':
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `AVAILABLE COMMANDS:
  help                    - Display this command reference
  status                  - Print live cluster telemetry & load state
  analytics               - Display compute and network performance metrics
  modules                 - List active neural architecture modules
  ping [target]           - Probe quantum edge link latency
  theme [dark|oled|mid|light] - Modulate active UI color space
  sound [on|off]          - Toggle synthetic acoustic synthesizer
  simulation [toggle]     - Pause or resume live system simulation
  fault                   - Inject synthetic latency jitter test
  reboot                  - Trigger complete kernel boot sequence
  diagnostics             - Open God-Mode hardware telemetry suite
  clear                   - Purge terminal buffer
  about                   - Display KRYO NEXUS system architecture manifesto
  exit                    - Close shell session`,
        });
        break;

      case 'status':
        newLines.push({
          id: String(Date.now() + 1),
          type: 'success',
          text: `[SYSTEM STATUS]
  Cluster ID        : KRYO-CLUSTER-0x88
  Quantum Coherence : ${telemetry.quantumCoherence}% (Zero Decoherence)
  System Load       : ${telemetry.systemLoadPercent}%
  Active Sessions   : ${telemetry.activeSessions.toLocaleString()}
  FPS Target        : ${telemetry.fps} FPS
  Render Latency    : ${telemetry.renderLatencyMs} ms
  Simulation Mode   : ${telemetry.isSimulationLive ? 'ACTIVE (LIVE)' : 'PAUSED'}`,
        });
        break;

      case 'analytics':
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `[PERFORMANCE METRICS]
  Bandwidth Cap     : ${telemetry.networkThroughputGbps} Gbps
  Memory Footprint  : ${telemetry.memoryUsageMb} MB
  Vector Acceleration: AVX-512 SIMD Enabled
  L3 Ring Buffer    : 64 MB (Occupancy: 24.8%)
  Packet Loss Rate  : ${telemetry.packetLossRate}%`,
        });
        break;

      case 'modules':
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `[ACTIVE SYSTEM MODULES]
  01. KRYO Compute Core  [OPERATIONAL] - 4,096 vNodes @ 0.12ms
  02. Spatial Engine     [OPTIMIZED]   - 120 FPS Raymarching
  03. Zero-Latency Mesh  [OPERATIONAL] - 18.4 TB/s Throughput
  04. Security Matrix    [LOCKED]      - Kyber-1024 / Dilithium-3
  05. L3 Memory Ring     [OPERATIONAL] - 64 MB Direct Mapped
  06. Quantum Lattice    [COHERENT]    - 99.98% Fidelity`,
        });
        break;

      case 'ping': {
        const target = arg || 'edge-cluster-04.kryo.io';
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `PING ${target} (192.0.2.88): 56 data bytes
64 bytes from ${target}: icmp_seq=0 ttl=64 time=0.42 ms
64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.38 ms
--- ${target} ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, rtt avg = 0.40ms`,
        });
        break;
      }

      case 'theme':
        if (arg === 'dark' || arg === 'oled' || arg === 'midnight' || arg === 'light' || arg === 'mid') {
          const themeTarget = arg === 'mid' ? 'midnight' : (arg as any);
          updateSettings({ theme: themeTarget });
          newLines.push({
            id: String(Date.now() + 1),
            type: 'success',
            text: `Theme switched to "${themeTarget}".`,
          });
        } else {
          newLines.push({
            id: String(Date.now() + 1),
            type: 'error',
            text: `Usage: theme [dark | oled | midnight | light]`,
          });
        }
        break;

      case 'sound':
        if (arg === 'on') {
          updateSettings({ soundFx: true });
          playSound('success');
          newLines.push({
            id: String(Date.now() + 1),
            type: 'success',
            text: 'Acoustic synthesizer feedback enabled.',
          });
        } else if (arg === 'off') {
          updateSettings({ soundFx: false });
          newLines.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: 'Sound feedback muted.',
          });
        } else {
          newLines.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: `Sound is currently: ${settings.soundFx ? 'ENABLED' : 'DISABLED'}. Usage: sound [on|off]`,
          });
        }
        break;

      case 'simulation':
        toggleSimulation();
        newLines.push({
          id: String(Date.now() + 1),
          type: 'success',
          text: `Simulation state toggled to: ${!telemetry.isSimulationLive ? 'LIVE' : 'PAUSED'}.`,
        });
        break;

      case 'fault':
        injectFault();
        newLines.push({
          id: String(Date.now() + 1),
          type: 'error',
          text: `Synthetic jitter fault injected. Failover recovery routines triggered.`,
        });
        break;

      case 'reboot':
        setIsTerminalOpen(false);
        rebootSystem();
        return;

      case 'diagnostics':
      case 'godmode':
        setIsTerminalOpen(false);
        triggerEasterEgg();
        return;

      case 'about':
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `KRYO NEXUS v3.0 is a cinematic, sub-millisecond digital operating environment.
Designed for autonomous neural workloads, real-time spatial computing, and zero-latency cluster synchronization.`,
        });
        break;

      case 'clear':
        setLines([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        setIsTerminalOpen(false);
        return;

      default:
        newLines.push({
          id: String(Date.now() + 1),
          type: 'error',
          text: `Command not recognized: "${trimmed}". Type "help" for available commands.`,
        });
        break;
    }

    setLines(newLines);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    }
  };

  if (!isTerminalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        {/* Backdrop click */}
        <div
          className="absolute inset-0"
          onClick={() => {
            setIsTerminalOpen(false);
            playSound('click');
          }}
        />

        {/* Terminal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-[#090c12]/95 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col h-[520px] max-h-[85vh] z-10"
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d121c] border-b border-zinc-800 select-none">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-zinc-200 tracking-wider">
                KRYO INTERACTIVE TERMINAL
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                TTY-01
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                PRESS ESC TO EXIT
              </span>
              <button
                id="terminal-close-btn"
                onClick={() => {
                  setIsTerminalOpen(false);
                  playSound('click');
                }}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Terminal Output Stream */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 bg-black/60 text-zinc-300 select-text"
          >
            {lines.map((line) => (
              <div
                key={line.id}
                className={`whitespace-pre-wrap leading-relaxed ${
                  line.type === 'input'
                    ? 'text-cyan-300 font-semibold'
                    : line.type === 'system'
                    ? 'text-zinc-500'
                    : line.type === 'success'
                    ? 'text-emerald-400'
                    : line.type === 'error'
                    ? 'text-rose-400'
                    : 'text-zinc-300'
                }`}
              >
                {line.text}
              </div>
            ))}
          </div>

          {/* Command Prompt Input */}
          <div className="p-3 bg-[#0a0d14] border-t border-zinc-800 flex items-center gap-2">
            <span className="font-mono text-xs text-cyan-400 select-none">&gt;</span>
            <input
              ref={inputRef}
              id="terminal-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command (e.g. help, status, analytics, ping, theme oled)..."
              className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-zinc-600 outline-none"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              onClick={() => executeCommand(inputVal)}
              className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition cursor-pointer"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
