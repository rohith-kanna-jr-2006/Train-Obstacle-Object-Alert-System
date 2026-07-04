"use client";

import React from "react";
import { Radar, Sliders, Zap, RefreshCw, BarChart2, CheckCircle2, Crosshair } from "lucide-react";
import LidarFeed from "@/components/LidarFeed";
import { useThemeStore } from "@/store/themeStore";
import { useGPSStore } from "@/store/gpsStore";

export default function LidarPage() {
  const { settings, updateLidarSettings } = useThemeStore();
  const { gpsData } = useGPSStore();

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radar className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              LiDAR 3D Laser Scanning Telemetry
            </h2>
            <p className="text-[10px] text-outline font-mono">
              SENSOR ID: Ouster OS1-64 (Catenary Corridor Mapping)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1">
        {/* LIDAR CANVAS RADAR SWEEP (8/12 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col h-[480px]">
          <LidarFeed />
        </div>

        {/* SETTINGS AND COORDINATES (4/12 cols) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-4 overflow-y-auto">
          {/* LIDAR PARAMETERS */}
          <div>
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-headline">
              <Sliders className="w-4 h-4 text-primary" />
              LiDAR Scan Settings
            </h3>

            <div className="flex flex-col gap-4 font-mono text-[10px]">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-outline">Max Vision Range: {settings.lidarSettings.range}m</span>
                  <span className="text-[#ffffff] font-bold">250m Max</span>
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

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-outline">Laser Point Size: {settings.lidarSettings.pointSize}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={settings.lidarSettings.pointSize}
                  onChange={(e) => updateLidarSettings({ pointSize: parseInt(e.target.value) })}
                  className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          {/* DEPTH / RELATIVE VELOCITY METRICS */}
          <div>
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <BarChart2 className="w-4 h-4 text-primary" />
              Corridor Distance Analytics
            </h3>

            <div className="flex flex-col gap-2 font-mono text-[10px]">
              <div className="p-2.5 bg-background/40 border border-surface-container-high/40 rounded-lg flex items-center justify-between">
                <span className="text-outline">Approaching Curvature:</span>
                <span className="text-white font-bold">R = 1,450m (Slight Right)</span>
              </div>
              <div className="p-2.5 bg-background/40 border border-surface-container-high/40 rounded-lg flex items-center justify-between">
                <span className="text-outline">Track Corridor Gradient:</span>
                <span className="text-white font-bold">+0.8% (Ascending)</span>
              </div>
              <div className="p-2.5 bg-background/40 border border-surface-container-high/40 rounded-lg flex items-center justify-between">
                <span className="text-outline">Relative Target Approach Speed:</span>
                <span className="text-primary font-bold">{(gpsData.speed * 0.277).toFixed(1)} m/s</span>
              </div>
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          {/* ACTIVE SPATIAL LOGS */}
          <div className="flex-1 flex flex-col min-h-[160px]">
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <Crosshair className="w-4 h-4 text-primary" />
              Spatial Co-ordinates (Detected Point Clusters)
            </h3>

            <div className="flex-1 overflow-y-auto border border-surface-container-high bg-background/30 rounded-lg p-2 font-mono text-[9px] text-[#a3b5db] flex flex-col gap-1.5">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>CLUSTER_01: RAIL_LEFT</span>
                <span className="text-white">X:-2.0m, Y:-1.0m, Z:120m</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>CLUSTER_02: RAIL_RIGHT</span>
                <span className="text-white">X:2.0m, Y:-1.0m, Z:120m</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>CLUSTER_03: ROAD_CROSSING</span>
                <span className="text-yellow-400 font-bold">X:0.2m, Y:-0.8m, Z:180m</span>
              </div>
              <div className="flex justify-between py-1">
                <span>CLUSTER_04: FOREST_MARGIN</span>
                <span className="text-outline">X:-14.2m, Y:2.4m, Z:65m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
