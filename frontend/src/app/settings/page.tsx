"use client";

import React from "react";
import { Settings, Sliders, Bell, Globe, Shield, RefreshCw, Layers, Volume2, Save } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function SettingsPage() {
  const { settings, updateSettings, updateCameraSettings, updateThermalSettings, updateLidarSettings } = useThemeStore();

  const handleSave = () => {
    alert("SYSTEM SETTINGS: Calibration data successfully written to onboard EEPROM cache.");
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              Locomotive HUD System Configuration
            </h2>
            <p className="text-[10px] text-outline font-mono">
              SYSTEM: Config Control Panel (EEPROM Secure Write)
            </p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container/80 hover:bg-primary border border-primary text-[#ffffff] text-[10px] font-mono font-bold rounded transition-all active:scale-[0.98]"
        >
          <Save className="w-3.5 h-3.5" />
          SAVE CALIBRATION
        </button>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1 overflow-y-auto pb-4">
        {/* LEFT COLUMN: SYSTEM SETTINGS (6/12 cols) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
          {/* AI DECISION THRESHOLDS */}
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur font-mono text-[10px] flex flex-col gap-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <Shield className="w-4 h-4 text-primary" />
              AI Decision & Threat Thresholds
            </h3>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-outline font-bold">Neural Object Detection Confidence: {Math.floor(settings.aiThreshold * 100)}%</span>
                <span className="text-[#ffffff]">Default 65%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={settings.aiThreshold}
                onChange={(e) => updateSettings({ aiThreshold: parseFloat(e.target.value) })}
                className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[8px] text-outline mt-1 block">Adjusts minimum confidence for drawing YOLO bounding boxes.</span>
            </div>
          </div>

          {/* BASIC PREFERENCES */}
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur font-mono text-[10px] flex flex-col gap-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <Globe className="w-4 h-4 text-primary" />
              General Preferences
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-outline block mb-1.5">DISPLAY UNITS</label>
                <div className="flex bg-background border border-surface-container-high rounded p-0.5">
                  <button
                    onClick={() => updateSettings({ units: "metric" })}
                    className={`flex-1 py-1 rounded text-[9px] font-bold ${settings.units === "metric" ? "bg-primary-container text-primary" : "text-outline hover:text-white"}`}
                  >
                    METRIC (KM/H)
                  </button>
                  <button
                    onClick={() => updateSettings({ units: "imperial" })}
                    className={`flex-1 py-1 rounded text-[9px] font-bold ${settings.units === "imperial" ? "bg-primary-container text-primary" : "text-outline hover:text-white"}`}
                  >
                    IMPERIAL (MPH)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-outline block mb-1.5">HUD LANGUAGE</label>
                <div className="flex bg-background border border-surface-container-high rounded p-0.5">
                  {(["en", "de", "fr"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => updateSettings({ language: lang })}
                      className={`flex-1 py-1 rounded text-[9px] font-bold uppercase ${settings.language === lang ? "bg-primary-container text-primary" : "text-outline hover:text-white"}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CALIBRATION SETTINGS (6/12 cols) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
          {/* CAMERA CALIBRATION */}
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur font-mono text-[10px] flex flex-col gap-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <Sliders className="w-4 h-4 text-primary" />
              Camera Calibration
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-outline">Catenary Brightness: {settings.cameraCalibration.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={settings.cameraCalibration.brightness}
                  onChange={(e) => updateCameraSettings({ brightness: parseInt(e.target.value) })}
                  className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-outline">Catenary Contrast: {settings.cameraCalibration.contrast}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={settings.cameraCalibration.contrast}
                  onChange={(e) => updateCameraSettings({ contrast: parseInt(e.target.value) })}
                  className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          {/* THERMAL & LIDAR CALIBRATION */}
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur font-mono text-[10px] flex flex-col gap-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <Layers className="w-4 h-4 text-primary" />
              Infrared & LiDAR Calibration
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-outline">IR Overlay Opacity: {Math.floor(settings.thermalSettings.overlayOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={settings.thermalSettings.overlayOpacity}
                  onChange={(e) => updateThermalSettings({ overlayOpacity: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-outline">LiDAR Scan Range: {settings.lidarSettings.range}m</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="250"
                  step="50"
                  value={settings.lidarSettings.range}
                  onChange={(e) => updateLidarSettings({ range: parseInt(e.target.value) })}
                  className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          {/* NOTIFICATION SETTINGS */}
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur font-mono text-[10px] flex flex-col gap-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <Bell className="w-4 h-4 text-primary" />
              HUD Notifications
            </h3>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between p-2 bg-background/40 border border-surface-container-high/40 rounded-lg">
                <div>
                  <p className="text-white font-bold">Alarm Sound Effects</p>
                  <span className="text-outline text-[9px]">Siren alert loop played during danger</span>
                </div>
                <button
                  onClick={() => updateSettings({
                    notificationSettings: {
                      ...settings.notificationSettings,
                      soundEnabled: !settings.notificationSettings.soundEnabled
                    }
                  })}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${settings.notificationSettings.soundEnabled ? "bg-primary" : "bg-surface-container-high"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-background transition-transform ${settings.notificationSettings.soundEnabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-2 bg-background/40 border border-surface-container-high/40 rounded-lg">
                <div>
                  <p className="text-white font-bold">Synthesized Voice Advisories</p>
                  <span className="text-outline text-[9px]">Speaks object names and alerts vocally</span>
                </div>
                <button
                  onClick={() => updateSettings({
                    notificationSettings: {
                      ...settings.notificationSettings,
                      voiceAlerts: !settings.notificationSettings.voiceAlerts
                    }
                  })}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${settings.notificationSettings.voiceAlerts ? "bg-primary" : "bg-surface-container-high"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-background transition-transform ${settings.notificationSettings.voiceAlerts ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
