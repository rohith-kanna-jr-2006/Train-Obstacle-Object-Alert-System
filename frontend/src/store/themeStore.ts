import { create } from "zustand";
import { SystemSettings } from "@/types";

interface ThemeState {
  settings: SystemSettings;
  updateSettings: (settings: Partial<SystemSettings>) => void;
  updateCameraSettings: (cam: Partial<SystemSettings["cameraCalibration"]>) => void;
  updateThermalSettings: (thermal: Partial<SystemSettings["thermalSettings"]>) => void;
  updateLidarSettings: (lidar: Partial<SystemSettings["lidarSettings"]>) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  settings: {
    theme: "dark",
    language: "en",
    units: "metric",
    aiThreshold: 0.65,
    cameraCalibration: {
      brightness: 50,
      contrast: 50,
      exposure: 0,
      resolution: "1920x1080 @ 60 FPS",
    },
    thermalSettings: {
      palette: "ironbow",
      overlayOpacity: 0.5,
      fusionMode: false,
    },
    lidarSettings: {
      range: 200,
      pointSize: 2,
      colorByDistance: true,
    },
    notificationSettings: {
      soundEnabled: true,
      voiceAlerts: true,
      vibrationFeedback: false,
    },
  },

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings,
      },
    })),

  updateCameraSettings: (cam) =>
    set((state) => ({
      settings: {
        ...state.settings,
        cameraCalibration: {
          ...state.settings.cameraCalibration,
          ...cam,
        },
      },
    })),

  updateThermalSettings: (thermal) =>
    set((state) => ({
      settings: {
        ...state.settings,
        thermalSettings: {
          ...state.settings.thermalSettings,
          ...thermal,
        },
      },
    })),

  updateLidarSettings: (lidar) =>
    set((state) => ({
      settings: {
        ...state.settings,
        lidarSettings: {
          ...state.settings.lidarSettings,
          ...lidar,
        },
      },
    })),
}));
