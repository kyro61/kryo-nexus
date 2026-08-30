import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Cpu,
  Shield,
  Network,
  Radio,
  Sliders,
  RefreshCw,
  Zap,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Key,
  Flame,
  Terminal,
  Clock,
  ArrowRight,
  TrendingUp,
  Server,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MagneticButton } from './MagneticButton';

type CommandTab = 'SYSTEM STATUS' | 'NETWORK' | 'PROCESSING' | 'SECURITY' | 'ACTIVITY';

export const CommandCenterSection: React.FC = () => {
  const {
    telemetry,
    toggleSimulation,
    injectFault,
    playSound,
    simulateAlert,
    settings,
    triggerEasterEgg,
  } = useApp();

  const [activeTab, setActiveTab] = useState<CommandTab>('SYSTEM STATUS');

  // Interactive controls for each panel
  // 1. System Status
  const [powerGovernor, setPowerGovernor] = useState<'BALANCED' | 'PERFORMANCE' | 'QUANTUM_MAX'>('PERFORMANCE');
  const [l3CacheAllocation, setL3CacheAllocation] = useState(64); // MB
  const [nodeRedundancy, setNodeRedundancy] = useState(3); // 1-5x

  // 2. Network
  const [routeMode, setRouteMode] = useState<'DIRECT_EDGELINK' | 'MESH_RELAY' | 'QUANTUM_TUNNEL'>('QUANTUM_TUNNEL');
  const [packetPacingRate, setPacketPacingRate] = useState(100); // Gbps
  const [isDnsSecured, setIsDnsSecured] = useState(true);
  const [pingTarget, setPingTarget] = useState('edge-cluster-04.kryo.io');
  const [pingResult, setPingResult] = useState<{ status: string; latency: number } | null>({
    status: 'ONLINE',
    latency: 0.84,
  });
  const [isPinging, setIsPinging] = useState(false);

  // 3. Processing
  const [activeWorkerThreads, setActiveWorkerThreads] = useState(2048);
  const [simdVectorization, setSimdVectorization] = useState(true);
  const [jitCompileTier, setJitCompileTier] = useState<'TIER_1_FAST' | 'TIER_2_OPTIMIZED' | 'AVX512_HYPER'>('AVX512_HYPER');

  // 4. Security
  const [keyRotationInterval, setKeyRotationInterval] = useState(300); // seconds
  const [lastRotatedTime, setLastRotatedTime] = useState('42s ago');
  const [encryptionAlgo, setEncryptionAlgo] = useState('Kyber-1024 / Dilithium-3');
  const [isRotationSuccess, setIsRotationSuccess] = useState(false);

  // 5. Activity Log Stream
  const [activityFilter, setActivityFilter] = useState<'ALL' | 'CRITICAL' | 'NETWORK' | 'SECURITY'>('ALL');
  const [activityLogs, setActivityLogs] = useState<{ id: string; time: string; tag: string; msg: string; level: 'info' | 'warn' | 'success' }[]>([
    { id: '1', time: '14:22:04', tag: 'SECURITY', msg: 'Post-quantum ephemeral key exchange validated across 4,096 nodes.', level: 'success' },
    { id: '2', time: '14:21:48', tag: 'NETWORK', msg: 'Zero-latency mesh rerouted 18.4 TB/s burst via Ring Buffer #02.', level: 'info' },
    { id: '3', time: '14:20:12', tag: 'SYSTEM', msg: 'L3 Cache line re-indexed; garbage collection stall time: 0.00ms.', level: 'info' },
    { id: '4', time: '14:18:55', tag: 'CRITICAL', msg: 'Autonomous failover guard absorbed synthetic load spike cleanly.', level: 'warn' },
    { id: '5', time: '14:15:30', tag: 'SYSTEM', msg: 'Spatial layout GPU shader pre-warming completed successfully.', level: 'success' },
  ]);

  const handleManualPing = () => {
    setIsPinging(true);
    playSound('switch');
    setTimeout(() => {
      setIsPinging(false);
      setPingResult({
        status: 'ONLINE',
        latency: +(0.4 + Math.random() * 0.8).toFixed(2),
      });
      playSound('success');
    }, 600);
  };

  const handleRotateKeys = () => {
    playSound('switch');
    setIsRotationSuccess(true);
    setLastRotatedTime('Just now');
    simulateAlert();
    setTimeout(() => {
      setIsRotationSuccess(false);
      playSound('success');
    }, 1800);
  };

  const handleAddActivityLog = () => {
    playSound('click');
    const newLog = {
      id: String(Date.now()),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      tag: activeTab === 'NETWORK' ? 'NETWORK' : activeTab === 'SECURITY' ? 'SECURITY' : 'SYSTEM',
      msg: `Manual telemetry checkpoint captured: system coherence at ${telemetry.quantumCoherence}%.`,
      level: 'info' as const,
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 14)]);
  };

  const tabs: { id: CommandTab; label: string; icon: React.ElementType }[] = [
    { id: 'SYSTEM STATUS', label: 'SYSTEM STATUS', icon: Activity },
    { id: 'NETWORK', label: 'NETWORK', icon: Network },
    { id: 'PROCESSING', label: 'PROCESSING', icon: Cpu },
    { id: 'SECURITY', label: 'SECURITY', icon: Shield },
    { id: 'ACTIVITY', label: 'ACTIVITY', icon: Radio },
  ];

  return (
    <section id="command-center" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>CENTRAL COMMAND SUITE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
            OPERATIONAL COMMAND CENTER
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-xl">
            Live interactive telemetry governor. Inspect node topology, modulate packet routers, rotate cryptographic lattice keys, and trigger real-time state synchronizations.
          </p>
        </div>

        {/* Global Simulation & Governor Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="cmd-toggle-simulation"
            onClick={toggleSimulation}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 border transition cursor-pointer active:scale-95 ${
              telemetry.isSimulationLive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            {telemetry.isSimulationLive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>SIMULATION: LIVE</span>
                <Pause className="w-3.5 h-3.5 ml-1 opacity-70" />
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>SIMULATION: PAUSED</span>
                <Play className="w-3.5 h-3.5 ml-1 opacity-70" />
              </>
            )}
          </button>

          <button
            id="cmd-inject-fault"
            onClick={injectFault}
            className="px-3.5 py-2 rounded-xl text-xs font-mono bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition cursor-pointer flex items-center gap-1.5 active:scale-95"
            title="Inject simulated latency jitter test"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>TEST JITTER</span>
          </button>
        </div>
      </div>

      {/* Main Command Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Module Selector Tabs */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 px-1">
            CONTROL DOMAINS
          </div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`cmd-tab-${tab.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  playSound('switch');
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  isActive
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/30 text-white'
                    : 'bg-zinc-900/60 hover:bg-zinc-800/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-semibold tracking-wide">
                      {tab.label}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-sans">
                      {tab.id === 'SYSTEM STATUS' && `${telemetry.systemLoadPercent}% Load • ${telemetry.fps} FPS`}
                      {tab.id === 'NETWORK' && `${telemetry.networkThroughputGbps} Gbps • 0.001% Loss`}
                      {tab.id === 'PROCESSING' && `${activeWorkerThreads} Threads • AVX-512`}
                      {tab.id === 'SECURITY' && 'Kyber-1024 • Verified'}
                      {tab.id === 'ACTIVITY' && `${activityLogs.length} Events Logged`}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-cyan-400 translate-x-1' : 'text-zinc-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Column: Dynamic Interactive Command Module Panel */}
        <div className="lg:col-span-8">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-zinc-800/90 shadow-2xl relative overflow-hidden min-h-[420px]">
            {/* Top Bar inside panel */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800/80">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-sm font-bold text-white tracking-wide">
                  {activeTab} PANEL
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
                NODE: KRYO-CLUSTER-0x88
              </span>
            </div>

            {/* TAB 1: SYSTEM STATUS */}
            {activeTab === 'SYSTEM STATUS' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">SYSTEM LOAD</div>
                    <div className="text-xl font-mono font-bold text-white mt-1">
                      {telemetry.systemLoadPercent}%
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full transition-all duration-300"
                        style={{ width: `${telemetry.systemLoadPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">QUANTUM COHERENCE</div>
                    <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                      {telemetry.quantumCoherence}%
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">Zero decoherence detected</div>
                  </div>

                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">ACTIVE SESSIONS</div>
                    <div className="text-xl font-mono font-bold text-sky-300 mt-1">
                      {telemetry.activeSessions.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">Distributed across 32 zones</div>
                  </div>

                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">RENDER LATENCY</div>
                    <div className="text-xl font-mono font-bold text-cyan-300 mt-1">
                      {telemetry.renderLatencyMs} ms
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">Direct GPU SIMD Pipeline</div>
                  </div>
                </div>

                {/* Interactive Governors */}
                <div className="space-y-4 pt-2">
                  <div className="font-mono text-xs text-zinc-300 font-semibold">
                    POWER GOVERNOR PROFILE:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['BALANCED', 'PERFORMANCE', 'QUANTUM_MAX'] as const).map((gov) => (
                      <button
                        key={gov}
                        onClick={() => {
                          setPowerGovernor(gov);
                          playSound('switch');
                        }}
                        className={`p-3 rounded-xl border text-xs font-mono text-left transition cursor-pointer ${
                          powerGovernor === gov
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="font-semibold">{gov}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">
                          {gov === 'BALANCED' && 'Adaptive clocking (15W)'}
                          {gov === 'PERFORMANCE' && 'Locked 4.8 GHz (45W)'}
                          {gov === 'QUANTUM_MAX' && 'Overclocked AVX-512 (95W)'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Node Redundancy Slider */}
                <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/80 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-300">FAILOVER CLUSTER REDUNDANCY:</span>
                    <span className="text-cyan-400 font-bold">{nodeRedundancy}x MIRRORING</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={nodeRedundancy}
                    onChange={(e) => {
                      setNodeRedundancy(Number(e.target.value));
                      playSound('click');
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>1x (Single Node)</span>
                    <span>3x (Standard Raft)</span>
                    <span>5x (Byzantine Fault Tolerant)</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: NETWORK */}
            {activeTab === 'NETWORK' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">BANDWIDTH CAPACITY</div>
                    <div className="text-xl font-mono font-bold text-white mt-1">
                      {telemetry.networkThroughputGbps} Gbps
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1">Zero packet drop</div>
                  </div>

                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">ROUTE TOPOLOGY</div>
                    <div className="text-sm font-mono font-bold text-cyan-300 mt-1">
                      {routeMode.replace(/_/g, ' ')}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">Sub-millisecond direct hop</div>
                  </div>

                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">DNSSEC VERIFICATION</div>
                    <div className="text-sm font-mono font-bold text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ENFORCED
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">Encrypted DoH Tunnel</div>
                  </div>
                </div>

                {/* Route Selector */}
                <div className="space-y-3">
                  <div className="font-mono text-xs text-zinc-300 font-semibold">
                    DISPATCH ROUTING PROTOCOL:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['DIRECT_EDGELINK', 'MESH_RELAY', 'QUANTUM_TUNNEL'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRouteMode(r);
                          playSound('switch');
                        }}
                        className={`p-3 rounded-xl border text-xs font-mono text-left transition cursor-pointer ${
                          routeMode === r
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="font-semibold">{r.replace(/_/g, ' ')}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ping / Latency Test Box */}
                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-mono text-zinc-300">INTERACTIVE EDGE PROBE:</div>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5">{pingTarget}</div>
                    </div>
                    <button
                      onClick={handleManualPing}
                      disabled={isPinging}
                      className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                      <span>{isPinging ? 'TRANSMITTING...' : 'PROBE EDGE NODE'}</span>
                    </button>
                  </div>

                  {pingResult && (
                    <div className="p-2.5 bg-black/50 rounded-lg border border-zinc-800 text-xs font-mono text-emerald-400 flex items-center justify-between">
                      <span>STATUS: {pingResult.status}</span>
                      <span>ROUND TRIP TIME: {pingResult.latency} ms</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 3: PROCESSING */}
            {activeTab === 'PROCESSING' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">ACTIVE WORKER THREADS</div>
                    <div className="text-xl font-mono font-bold text-white mt-1">
                      {activeWorkerThreads.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-cyan-400 mt-1">Lock-free work stealing</div>
                  </div>

                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">COMPILATION TIER</div>
                    <div className="text-sm font-mono font-bold text-purple-300 mt-1">
                      {jitCompileTier}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">Auto Vectorization Enabled</div>
                  </div>

                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">RING BUFFER OCCUPANCY</div>
                    <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                      24.8% (15.9 MB)
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">Zero queue backpressure</div>
                  </div>
                </div>

                {/* Worker Threads Governor */}
                <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-300">NEURAL ACTOR POOL SIZE:</span>
                    <span className="text-cyan-400 font-bold">{activeWorkerThreads} CORES</span>
                  </div>
                  <input
                    type="range"
                    min={512}
                    max={4096}
                    step={256}
                    value={activeWorkerThreads}
                    onChange={(e) => {
                      setActiveWorkerThreads(Number(e.target.value));
                      playSound('click');
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>512 (Low Power)</span>
                    <span>2048 (Nominal)</span>
                    <span>4096 (Hyper-Scale)</span>
                  </div>
                </div>

                {/* JIT Tiers */}
                <div className="space-y-3">
                  <div className="font-mono text-xs text-zinc-300 font-semibold">
                    JIT COMPILER SPECIALIZATION:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['TIER_1_FAST', 'TIER_2_OPTIMIZED', 'AVX512_HYPER'] as const).map((tier) => (
                      <button
                        key={tier}
                        onClick={() => {
                          setJitCompileTier(tier);
                          playSound('switch');
                        }}
                        className={`p-3 rounded-xl border text-xs font-mono text-left transition cursor-pointer ${
                          jitCompileTier === tier
                            ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="font-semibold">{tier}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: SECURITY */}
            {activeTab === 'SECURITY' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">QUANTUM ENCRYPTION</div>
                    <div className="text-sm font-mono font-bold text-amber-300 mt-1">
                      {encryptionAlgo}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">NIST Post-Quantum Standard</div>
                  </div>

                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">LAST ROTATION</div>
                    <div className="text-xl font-mono font-bold text-white mt-1">
                      {lastRotatedTime}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1">Continuous TRNG entropy</div>
                  </div>

                  <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400">ISOLATION SANDBOX</div>
                    <div className="text-sm font-mono font-bold text-emerald-400 mt-1 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> SECURE ENCLAVE
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">Hardware root-of-trust</div>
                  </div>
                </div>

                {/* Key Rotation Action */}
                <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-xs text-zinc-200 font-semibold flex items-center gap-2">
                        <Key className="w-4 h-4 text-amber-400" />
                        <span>FORCE EPHEMERAL KEY ROTATION</span>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans mt-1">
                        Regenerates lattice-based keypairs across all active nodes with zero session drop.
                      </p>
                    </div>

                    <button
                      onClick={handleRotateKeys}
                      disabled={isRotationSuccess}
                      className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold transition cursor-pointer active:scale-95"
                    >
                      {isRotationSuccess ? 'ROTATING MATRIX...' : 'ROTATE KEYS NOW'}
                    </button>
                  </div>

                  {isRotationSuccess && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                      ✓ Kyber-1024 entropy regenerated. 4,096 nodes acknowledged handshake.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 5: ACTIVITY */}
            {activeTab === 'ACTIVITY' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-400">FILTER:</span>
                    {(['ALL', 'CRITICAL', 'NETWORK', 'SECURITY'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setActivityFilter(f);
                          playSound('click');
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono transition cursor-pointer ${
                          activityFilter === f
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleAddActivityLog}
                    className="px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono border border-zinc-700 transition cursor-pointer"
                  >
                    + CAPTURE SNAPSHOT
                  </button>
                </div>

                {/* Stream Box */}
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {activityLogs
                    .filter((log) => (activityFilter === 'ALL' ? true : log.tag === activityFilter))
                    .map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-black/40 rounded-xl border border-zinc-800/80 text-xs font-mono flex items-start gap-3"
                      >
                        <span className="text-zinc-500 shrink-0">{log.time}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                            log.level === 'success'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : log.level === 'warn'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {log.tag}
                        </span>
                        <span className="text-zinc-300 font-sans">{log.msg}</span>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
