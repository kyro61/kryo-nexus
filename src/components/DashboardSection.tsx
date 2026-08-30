import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Cpu,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import { CHART_DATA_SETS } from '../data/mockData';
import { ChartTimeframe, MetricType } from '../types';
import { useApp } from '../context/AppContext';

export const DashboardSection: React.FC = () => {
  const { telemetry, playSound, settings } = useApp();
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('24H');
  const [activeMetric, setActiveMetric] = useState<MetricType>('neural');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Active dataset based on timeframe
  const rawData = CHART_DATA_SETS[timeframe];

  // Chart configuration based on active metric
  const metricConfig = useMemo(() => {
    switch (activeMetric) {
      case 'neural':
        return {
          label: 'Neural Evaluation Rate',
          unit: 'GigaOps/s',
          color: '#06b6d4',
          secondaryColor: '#38bdf8',
          gradientId: 'neuralGradient',
          format: (v: number) => `${v.toFixed(1)} GigaOps`,
        };
      case 'throughput':
        return {
          label: 'Network Bandwidth Throughput',
          unit: 'TB/s',
          color: '#10b981',
          secondaryColor: '#34d399',
          gradientId: 'throughputGradient',
          format: (v: number) => `${v.toFixed(1)} TB/s`,
        };
      case 'latency':
        return {
          label: 'Ring Buffer Dispatch Latency',
          unit: 'ms',
          color: '#f59e0b',
          secondaryColor: '#fbbf24',
          gradientId: 'latencyGradient',
          format: (v: number) => `${v.toFixed(2)} ms`,
        };
      case 'efficiency':
        return {
          label: 'Quantum Cluster Coherence',
          unit: '%',
          color: '#8b5cf6',
          secondaryColor: '#a78bfa',
          gradientId: 'efficiencyGradient',
          format: (v: number) => `${v.toFixed(1)}%`,
        };
    }
  }, [activeMetric]);

  // Compute SVG coordinates
  const values = rawData.map((d) => d[activeMetric]);
  const minValue = Math.min(...values) * 0.9;
  const maxValue = Math.max(...values) * 1.05;

  const chartPoints = useMemo(() => {
    const width = 800;
    const height = 240;
    const paddingX = 40;
    const paddingY = 20;

    return rawData.map((d, index) => {
      const x = paddingX + (index / (rawData.length - 1)) * (width - paddingX * 2);
      const val = d[activeMetric];
      const y = height - paddingY - ((val - minValue) / (maxValue - minValue || 1)) * (height - paddingY * 2);
      return { x, y, data: d };
    });
  }, [rawData, activeMetric, minValue, maxValue]);

  // Build SVG path
  const pathD = useMemo(() => {
    if (chartPoints.length === 0) return '';
    return chartPoints.reduce((acc, pt, idx, arr) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`;
      const prev = arr[idx - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
    }, '');
  }, [chartPoints]);

  const areaD = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const last = chartPoints[chartPoints.length - 1];
    const first = chartPoints[0];
    return `${pathD} L ${last.x} 230 L ${first.x} 230 Z`;
  }, [pathD, chartPoints]);

  const activeDataPoint = hoveredPointIndex !== null ? chartPoints[hoveredPointIndex] : chartPoints[chartPoints.length - 1];

  return (
    <section id="dashboard" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>REAL-TIME TELEMETRY ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            System Observability & Load Metrics
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl font-normal">
            Continuous streaming evaluation of neural worker pools, memory saturation, and zero-latency packet queues.
          </p>
        </div>

        {/* Live Stream Status & Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSound('switch');
              setIsLiveStreaming(!isLiveStreaming);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-2 transition cursor-pointer ${
              isLiveStreaming
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-ping' : 'bg-zinc-500'}`} />
            <span>{isLiveStreaming ? 'STREAMING LIVE' : 'STREAM PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Real-Time Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1 */}
        <motion.div
          whileHover={{ y: -3 }}
          className="glass-panel rounded-xl p-4 border border-zinc-800/80 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-2">
            <span>ACTIVE vNODES</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {telemetry.activeNodes.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+100% Cluster Capacity</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500/50" />
        </motion.div>

        {/* Card 2 */}
        <motion.div
          whileHover={{ y: -3 }}
          className="glass-panel rounded-xl p-4 border border-zinc-800/80 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-2">
            <span>COMPUTE VELOCITY</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            84.2 <span className="text-sm font-normal text-zinc-400 font-mono">GigaOps</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mt-2">
            <ChevronUp className="w-3.5 h-3.5" />
            <span>+14.2% Peak Throughput</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500/50" />
        </motion.div>

        {/* Card 3 */}
        <motion.div
          whileHover={{ y: -3 }}
          className="glass-panel rounded-xl p-4 border border-zinc-800/80 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-2">
            <span>DISPATCH JITTER</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {telemetry.renderLatencyMs} <span className="text-sm font-normal text-zinc-400 font-mono">ms</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sub-millisecond Lockless</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500/50" />
        </motion.div>

        {/* Card 4 */}
        <motion.div
          whileHover={{ y: -3 }}
          className="glass-panel rounded-xl p-4 border border-zinc-800/80 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-2">
            <span>SYSTEM COHERENCE</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {telemetry.quantumCoherence}%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-purple-300 font-mono mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>CRDT Deterministic</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500/50" />
        </motion.div>
      </div>

      {/* Main Interactive Chart Console */}
      <div className="glass-panel rounded-2xl p-6 border border-zinc-800 shadow-2xl relative overflow-hidden">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-6">
          {/* Metric Selector Tabs */}
          <div className="flex items-center p-1 bg-black/40 rounded-xl border border-zinc-800 text-xs font-mono">
            {[
              { id: 'neural', label: 'Neural Compute' },
              { id: 'throughput', label: 'Throughput' },
              { id: 'latency', label: 'Dispatch Latency' },
              { id: 'efficiency', label: 'Coherence' },
            ].map((metric) => (
              <button
                key={metric.id}
                onClick={() => {
                  playSound('switch');
                  setActiveMetric(metric.id as MetricType);
                }}
                className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                  activeMetric === metric.id
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>

          {/* Timeframe Filter Buttons */}
          <div className="flex items-center space-x-1 p-1 bg-black/40 rounded-xl border border-zinc-800 text-xs font-mono">
            {(['24H', '7D', '30D', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                id={`timeframe-btn-${tf}`}
                onClick={() => {
                  playSound('click');
                  setTimeframe(tf);
                }}
                className={`px-3 py-1 rounded-lg transition font-medium cursor-pointer ${
                  timeframe === tf
                    ? 'bg-cyan-500 text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Current Inspected Value Readout */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              {metricConfig.label}
            </div>
            <div className="text-3xl font-bold font-display text-white mt-0.5 flex items-baseline gap-2">
              <span>{metricConfig.format(activeDataPoint.data[activeMetric])}</span>
              <span className="text-xs font-mono text-zinc-500">
                @ {activeDataPoint.data.time} ({timeframe})
              </span>
            </div>
          </div>

          <div className="text-xs font-mono text-zinc-400 hidden sm:block">
            <span>HOVER OVER POINTS TO INSPECT</span>
          </div>
        </div>

        {/* Dynamic SVG Interactive Chart Canvas */}
        <div className="relative w-full h-64 sm:h-72 my-2 bg-black/20 rounded-xl p-2 border border-zinc-800/40 flex items-center justify-center">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 800 240"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={metricConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={metricConfig.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={metricConfig.color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => (
              <line
                key={i}
                x1="40"
                y1={240 * ratio}
                x2="760"
                y2={240 * ratio}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="4 4"
              />
            ))}

            {/* Area Fill */}
            <path d={areaD} fill={`url(#${metricConfig.gradientId})`} className="transition-all duration-300" />

            {/* Line Path */}
            <path
              d={pathD}
              fill="none"
              stroke={metricConfig.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />

            {/* Interactive Data Points */}
            {chartPoints.map((pt, i) => {
              const isHovered = hoveredPointIndex === i;
              return (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 3.5}
                    fill={isHovered ? '#ffffff' : metricConfig.color}
                    stroke="#090a0f"
                    strokeWidth="2"
                    className="transition-all duration-150 cursor-pointer"
                  />
                  {/* Invisible hit area for smooth hover */}
                  <rect
                    x={pt.x - 20}
                    y="0"
                    width="40"
                    height="240"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      playSound('hover');
                      setHoveredPointIndex(i);
                    }}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Tooltip Overlay */}
          {hoveredPointIndex !== null && (
            <div
              className="absolute pointer-events-none px-3 py-1.5 rounded-lg bg-zinc-900/95 border border-zinc-700 text-white font-mono text-xs shadow-xl backdrop-blur-md transition-all -translate-x-1/2 -translate-y-12"
              style={{
                left: `${(chartPoints[hoveredPointIndex].x / 800) * 100}%`,
                top: `${(chartPoints[hoveredPointIndex].y / 240) * 100}%`,
              }}
            >
              <div className="text-[10px] text-zinc-400">{chartPoints[hoveredPointIndex].data.time}</div>
              <div className="font-bold text-cyan-300">
                {metricConfig.format(chartPoints[hoveredPointIndex].data[activeMetric])}
              </div>
            </div>
          )}
        </div>

        {/* Chart Footer X-Axis Labels */}
        <div className="flex justify-between text-xs font-mono text-zinc-500 px-4 pt-3 border-t border-zinc-800/60">
          {rawData.map((d, i) => (
            <span key={i} className="hover:text-zinc-300 transition">
              {d.time}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
