"use client";

import React from "react";
import { Bell, ShieldAlert, Volume2, VolumeX, AlertTriangle, CheckCircle, Trash2, Shield, Settings, Info } from "lucide-react";
import { useAlertStore } from "@/store/alertStore";

export default function AlertsPage() {
  const {
    alerts,
    isHornActive,
    isBrakeActive,
    isEmergencyBrakeActive,
    audioAlarmEnabled,
    voiceAlertsEnabled,
    dismissAlert,
    dismissAllAlerts,
    triggerHorn,
    triggerBrake,
    triggerEmergencyBrake,
    toggleAudioAlarm,
    toggleVoiceAlerts,
  } = useAlertStore();

  const activeAlerts = alerts.filter((a) => !a.dismissed);
  const resolvedAlerts = alerts.filter((a) => a.dismissed);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-error animate-bounce" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              Emergency Alerts & Intervention Control
            </h2>
            <p className="text-[10px] text-outline font-mono">
              SYSTEM: Locomotive Braking & Horn Trigger Interface
            </p>
          </div>
        </div>
        <button
          onClick={dismissAllAlerts}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high border border-outline/20 hover:bg-surface-bright rounded text-[10px] font-mono font-bold text-white transition-all active:scale-[0.98]"
        >
          <Trash2 className="w-3.5 h-3.5" />
          CLEAR ACTIVE ALARMS
        </button>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1">
        {/* INTERVENE COMMANDS CARD (4/12 cols) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-4 font-mono text-[10px]">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 font-headline">
              <Settings className="w-4 h-4 text-primary" />
              Pilot Override Interface
            </h3>

            <div className="flex flex-col gap-3">
              {/* Emergency stop */}
              <button
                onClick={() => triggerEmergencyBrake()}
                className={`w-full py-4 text-white font-headline text-xs font-black tracking-widest rounded-xl border transition-all ${
                  isEmergencyBrakeActive
                    ? "bg-red-700 border-red-500 shadow-[0_0_20px_#ef4444] animate-pulse"
                    : "bg-red-600 hover:bg-red-700 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                }`}
              >
                {isEmergencyBrakeActive ? "EMERGENCY AIR BRAKES FULLY ON" : "APPLY EMERGENCY BRAKES"}
              </button>

              {/* Service brake toggle */}
              <button
                onClick={() => triggerBrake(!isBrakeActive)}
                className={`w-full py-3 font-headline text-xs font-black tracking-widest rounded-xl border transition-all ${
                  isBrakeActive
                    ? "bg-yellow-600 border-yellow-500 text-white shadow-[0_0_15px_#f59e0b]"
                    : "bg-surface-container-lowest border-surface-container-high text-outline hover:border-outline hover:text-white"
                }`}
              >
                {isBrakeActive ? "SERVICE BRAKE: APPLIED (ADVISED)" : "APPLY SERVICE BRAKE"}
              </button>

              {/* Horn trigger */}
              <button
                onClick={() => triggerHorn()}
                disabled={isHornActive}
                className={`w-full py-3 font-headline text-xs font-black tracking-widest rounded-xl border transition-all ${
                  isHornActive
                    ? "bg-primary-container border-primary text-primary"
                    : "bg-surface-container-lowest border-surface-container-high text-outline hover:border-outline hover:text-white"
                }`}
              >
                {isHornActive ? "SOUNDING HORN..." : "TRIGGER LOCO HORN"}
              </button>
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          {/* AUDIO OPTIONS */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <Volume2 className="w-4 h-4 text-primary" />
              Auditory Alert Configurations
            </h3>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2.5 bg-background/40 border border-surface-container-high/40 rounded-lg">
                <div>
                  <p className="text-white font-bold">Audio Alarm Sirens</p>
                  <span className="text-outline text-[8px]">Continuous loop sound during danger</span>
                </div>
                <button
                  onClick={toggleAudioAlarm}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${audioAlarmEnabled ? "bg-primary" : "bg-surface-container-high"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-background transition-transform ${audioAlarmEnabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-background/40 border border-surface-container-high/40 rounded-lg">
                <div>
                  <p className="text-white font-bold">AI Voice Recommendations</p>
                  <span className="text-outline text-[8px]">Announces target directions verbally</span>
                </div>
                <button
                  onClick={toggleVoiceAlerts}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${voiceAlertsEnabled ? "bg-primary" : "bg-surface-container-high"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-background transition-transform ${voiceAlertsEnabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ALARMS LOGS COLUMN (8/12 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-3 h-[480px]">
          {/* ACTIVE ALARMS */}
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex-1 flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 font-headline">
              <AlertTriangle className="w-4 h-4 text-error" />
              Active System Alarms
            </h3>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
              {activeAlerts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-outline font-mono gap-1">
                  <Shield className="w-8 h-8 text-tertiary opacity-45" />
                  <p>All locomotive safety integrity parameters NOMINAL.</p>
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 font-mono text-[10px] ${
                      alert.level === "DANGER"
                        ? "bg-red-950/20 border-red-500/50"
                        : alert.level === "WARNING"
                        ? "bg-yellow-950/20 border-yellow-500/50"
                        : "bg-surface-container-lowest border-surface-container-high"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold ${alert.level === "DANGER" ? "text-red-400" : alert.level === "WARNING" ? "text-yellow-400" : "text-primary"}`}>
                          [{alert.source}] {alert.level}
                        </span>
                        <span className="text-outline text-[9px]">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-white text-xs font-sans font-medium">{alert.message}</p>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-bright rounded text-[9px] font-bold border border-outline/10 text-white"
                    >
                      RESOLVE
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* HISTORICAL RESOLVED ALARMS */}
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex-1 flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold text-outline uppercase tracking-wider mb-3 flex items-center gap-1.5 font-headline">
              <CheckCircle className="w-4 h-4 text-tertiary" />
              Resolved Alarms
            </h3>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2 opacity-65">
              {resolvedAlerts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-outline font-mono">
                  <Info className="w-6 h-6 text-outline/30 mb-1" />
                  <p>No historical alarm resolutions logged in current session.</p>
                </div>
              ) : (
                resolvedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-2.5 rounded-lg border border-surface-container-high bg-background/30 flex items-center justify-between gap-3 font-mono text-[9px]"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-tertiary font-bold">[{alert.source}] RESOLVED</span>
                        <span className="text-outline">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[#a3b5db] font-sans">{alert.message}</p>
                    </div>
                    <span className="text-tertiary font-bold uppercase text-[8px] bg-tertiary-container/10 px-2 py-0.5 border border-tertiary/20 rounded">
                      CLEARED
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
