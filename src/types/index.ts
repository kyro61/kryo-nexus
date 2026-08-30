export type ThemeMode = 'dark' | 'oled' | 'midnight' | 'light';
export type AnimationIntensity = 'cinematic' | 'rapid' | 'minimal';
export type UIDensity = 'compact' | 'normal' | 'expansive';

export interface AppSettings {
  theme: ThemeMode;
  animationIntensity: AnimationIntensity;
  reducedMotion: boolean;
  uiDensity: UIDensity;
  enable3D: boolean;
  soundFx: boolean;
  parallaxStrength: number; // 0.1 to 1.5
  showFpsCounter: boolean;
  performanceMode: boolean;
  customCursor: boolean;
  demoNotifications: boolean;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'info' | 'alert' | 'success' | 'telemetry';
  read: boolean;
  tag?: string;
}

export interface SystemModule {
  id: string;
  title: string;
  subtitle: string;
  category: 'Compute Core' | 'Spatial Engine' | 'Zero-Latency' | 'Security Matrix' | 'Memory Grid' | 'Neural Quantum';
  badge: string;
  description: string;
  longDescription: string;
  status: 'operational' | 'optimized' | 'standby' | 'syncing';
  loadPercent: number;
  latencyMs: number;
  throughput: string;
  specs: { label: string; value: string }[];
  activeThreads: number;
  colorGradient: string;
  iconName: string;
}

export type ChartTimeframe = '24H' | '7D' | '30D' | '90D' | '1Y';
export type MetricType = 'neural' | 'throughput' | 'latency' | 'efficiency';

export interface ChartDataPoint {
  time: string;
  neural: number;       // Ops / sec in GigaOps
  throughput: number;   // GB/s
  latency: number;      // microseconds / ms
  efficiency: number;   // %
  anomaly?: boolean;
}

export interface SearchResultItem {
  id: string;
  title: string;
  category: 'Navigation' | 'System Module' | 'Telemetry' | 'Command Action' | 'Settings';
  snippet: string;
  sectionId?: string;
  actionKey?: string;
  iconName?: string;
}

export interface ContactSubmission {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  organization: string;
  priority: 'Routine' | 'High' | 'Critical Protocol';
  message: string;
  systemFingerprint: string;
}

export interface SystemTelemetryState {
  fps: number;
  memoryUsageMb: number;
  activeNodes: number;
  quantumCoherence: number;
  packetLossRate: number;
  renderLatencyMs: number;
  uptimeSeconds: number;
  isOverclocked: boolean;
  isSimulationLive: boolean;
  activeSessions: number;
  systemLoadPercent: number;
  networkThroughputGbps: number;
}

