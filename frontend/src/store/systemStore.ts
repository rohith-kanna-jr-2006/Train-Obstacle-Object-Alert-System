import { create } from "zustand";
import { SystemHealthData } from "@/types";

interface SystemState {
  systemData: SystemHealthData;
  latencyHistory: number[];
  fpsHistory: number[];
  cpuUsageHistory: number[];
  gpuUsageHistory: number[];
  
  updateSystemData: (data: Partial<SystemHealthData>) => void;
  addLatencyHistory: (latency: number) => void;
  addFpsHistory: (fps: number) => void;
  addCpuUsageHistory: (cpu: number) => void;
  addGpuUsageHistory: (gpu: number) => void;
  resetTelemetryHistory: () => void;
}

const maxHistoryLength = 20;

export const useSystemStore = create<SystemState>((set) => ({
  systemData: {
    cpuUsage: 45,
    gpuUsage: 82,
    ramUsage: 58,
    diskUsage: 34,
    cpuTemp: 52,
    gpuTemp: 64,
    networkLatency: 15,
    fps: 59.8,
    inferenceTime: 12.4, // milliseconds
    cudaEnabled: true,
    tensorRtActive: true,
    jetsonStatus: "NOMINAL",
  },
  latencyHistory: Array(maxHistoryLength).fill(15),
  fpsHistory: Array(maxHistoryLength).fill(60),
  cpuUsageHistory: Array(maxHistoryLength).fill(45),
  gpuUsageHistory: Array(maxHistoryLength).fill(82),

  updateSystemData: (data) =>
    set((state) => {
      const updated = { ...state.systemData, ...data };
      
      // Update history arrays
      const latencyHistory = [...state.latencyHistory.slice(1), updated.networkLatency];
      const fpsHistory = [...state.fpsHistory.slice(1), updated.fps];
      const cpuUsageHistory = [...state.cpuUsageHistory.slice(1), updated.cpuUsage];
      const gpuUsageHistory = [...state.gpuUsageHistory.slice(1), updated.gpuUsage];

      return {
        systemData: updated,
        latencyHistory,
        fpsHistory,
        cpuUsageHistory,
        gpuUsageHistory,
      };
    }),

  addLatencyHistory: (latency) =>
    set((state) => ({
      latencyHistory: [...state.latencyHistory.slice(1), latency],
    })),
  addFpsHistory: (fps) =>
    set((state) => ({
      fpsHistory: [...state.fpsHistory.slice(1), fps],
    })),
  addCpuUsageHistory: (cpu) =>
    set((state) => ({
      cpuUsageHistory: [...state.cpuUsageHistory.slice(1), cpu],
    })),
  addGpuUsageHistory: (gpu) =>
    set((state) => ({
      gpuUsageHistory: [...state.gpuUsageHistory.slice(1), gpu],
    })),
  resetTelemetryHistory: () =>
    set({
      latencyHistory: Array(maxHistoryLength).fill(15),
      fpsHistory: Array(maxHistoryLength).fill(60),
      cpuUsageHistory: Array(maxHistoryLength).fill(45),
      gpuUsageHistory: Array(maxHistoryLength).fill(82),
    }),
}));
