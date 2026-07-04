export type AlertLevel = "SAFE" | "INFO" | "WARNING" | "DANGER";

export interface Detection {
  id: string;
  object: string;
  distance: number;
  confidence: number;
  threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  timestamp: string;
}

export interface TelemetryData {
  currentSpeed: number;
  maxSpeed: number;
  signalAspect: "RED" | "YELLOW" | "DOUBLE_YELLOW" | "GREEN";
  distanceToSignal: number;
  distanceToStation: number;
  distanceToCrossing: number;
  trackOccupancy: boolean;
  aiConfidence: number;
  obstacleDistance: number;
  obstacleType: string;
  brakeRecommendation: "NONE" | "SERVICE" | "EMERGENCY";
  visibility: number; // in meters
}

export interface GPSData {
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  satellites: number;
  status: "CONNECTED" | "SEARCHING" | "DISCONNECTED";
  heading: number;
  timestamp: string;
}

export interface SystemHealthData {
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  cpuTemp: number;
  gpuTemp: number;
  networkLatency: number;
  fps: number;
  inferenceTime: number; // in ms
  cudaEnabled: boolean;
  tensorRtActive: boolean;
  jetsonStatus: "NOMINAL" | "THROTTLED" | "OVERHEATING" | "ERROR";
}

export interface SignalInfo {
  id: string;
  name: string;
  aspect: "RED" | "YELLOW" | "DOUBLE_YELLOW" | "GREEN";
  distance: number;
  status: "ACTIVE" | "MAINTENANCE" | "FAULT";
  trackId: string;
  route: string;
  latitude: number;
  longitude: number;
}

export interface StationInfo {
  id: string;
  name: string;
  distance: number;
  eta: string;
  platform: string;
  scheduledArrival: string;
  speedRestriction: number;
  latitude: number;
  longitude: number;
}

export interface TrackGeometry {
  gradient: number; // in percentage
  curvature: number; // in radius (meters)
  elevation: number; // in meters
  condition: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
  speedLimit: number;
  switchPosition: "NORMAL" | "REVERSE" | "LOCKED";
  railHealth: number; // 0 to 100%
}

export interface SystemSettings {
  theme: "dark" | "light" | "industrial-cyber";
  language: "en" | "de" | "fr";
  units: "metric" | "imperial";
  aiThreshold: number; // 0.0 to 1.0
  cameraCalibration: {
    brightness: number;
    contrast: number;
    exposure: number;
    resolution: string;
  };
  thermalSettings: {
    palette: "ironbow" | "rainbow" | "grayscale" | "hot-metal";
    overlayOpacity: number;
    fusionMode: boolean;
  };
  lidarSettings: {
    range: number; // max visualization range
    pointSize: number;
    colorByDistance: boolean;
  };
  notificationSettings: {
    soundEnabled: boolean;
    voiceAlerts: boolean;
    vibrationFeedback: boolean;
  };
}

export interface AlertLog {
  id: string;
  timestamp: string;
  level: AlertLevel;
  message: string;
  source: "AI_VISION" | "THERMAL" | "LIDAR" | "SYSTEM" | "TELEMETRY";
  dismissed: boolean;
  actionTaken?: string;
}

export interface UserSession {
  token: string | null;
  user: {
    id: string;
    username: string;
    role: "DRIVER" | "DISPATCHER" | "MAINTENANCE" | "ADMIN";
    name: string;
  } | null;
}
