import { create } from "zustand";
import { AlertLog, AlertLevel } from "@/types";

interface AlertState {
  alerts: AlertLog[];
  isHornActive: boolean;
  isBrakeActive: boolean;
  isEmergencyBrakeActive: boolean;
  audioAlarmEnabled: boolean;
  voiceAlertsEnabled: boolean;
  
  addAlert: (alert: Omit<AlertLog, "id" | "timestamp" | "dismissed">) => void;
  dismissAlert: (id: string) => void;
  dismissAllAlerts: () => void;
  triggerHorn: (durationMs?: number) => void;
  triggerBrake: (active: boolean) => void;
  triggerEmergencyBrake: () => void;
  toggleAudioAlarm: () => void;
  toggleVoiceAlerts: () => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [
    {
      id: "alert-1",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      level: "INFO",
      message: "AI Vision Module fully initialized and connected.",
      source: "AI_VISION",
      dismissed: false,
    },
    {
      id: "alert-2",
      timestamp: new Date(Date.now() - 150000).toISOString(),
      level: "WARNING",
      message: "Moderate visibility degradation detected due to rising mist.",
      source: "SYSTEM",
      dismissed: false,
    },
  ],
  isHornActive: false,
  isBrakeActive: false,
  isEmergencyBrakeActive: false,
  audioAlarmEnabled: true,
  voiceAlertsEnabled: true,

  addAlert: (alert) => {
    const newAlert: AlertLog = {
      ...alert,
      id: `alert-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      dismissed: false,
    };
    
    set((state) => ({
      alerts: [newAlert, ...state.alerts],
    }));

    // Trigger audio effects or voice recommendations if enabled
    if (newAlert.level === "DANGER") {
      // Auto trigger brake recommend and warn operator
      set({ isBrakeActive: true });
    }
  },

  dismissAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, dismissed: true } : a)),
    })),

  dismissAllAlerts: () =>
    set((state) => ({
      alerts: state.alerts.map((a) => ({ ...a, dismissed: true })),
    })),

  triggerHorn: (durationMs = 1500) => {
    set({ isHornActive: true });
    setTimeout(() => {
      set({ isHornActive: false });
    }, durationMs);
  },

  triggerBrake: (active) => set({ isBrakeActive: active }),

  triggerEmergencyBrake: () => {
    set({
      isEmergencyBrakeActive: true,
      isBrakeActive: true,
    });
    // Add critical log
    get().addAlert({
      level: "DANGER",
      message: "EMERGENCY STOP COMMAND INITIATED BY OPERATOR",
      source: "TELEMETRY",
      actionTaken: "Emergency air brakes fully applied.",
    });
  },

  toggleAudioAlarm: () => set((state) => ({ audioAlarmEnabled: !state.audioAlarmEnabled })),
  toggleVoiceAlerts: () => set((state) => ({ voiceAlertsEnabled: !state.voiceAlertsEnabled })),
}));
