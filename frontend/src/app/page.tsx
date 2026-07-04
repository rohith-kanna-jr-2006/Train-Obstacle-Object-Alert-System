"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Gauge,
  Signal,
  Wind,
  Eye,
  Sliders,
  AlertTriangle,
  Play,
  Square,
  Volume2,
  ShieldCheck,
  Activity,
  Cpu,
  Tv
} from "lucide-react";
import VideoFeed from "@/components/VideoFeed";
import ThermalFeed from "@/components/ThermalFeed";
import LidarFeed from "@/components/LidarFeed";
import MiniMap from "@/components/MiniMap";

import { useGPSStore } from "@/store/gpsStore";
import { useSystemStore } from "@/store/systemStore";
import { useAlertStore } from "@/store/alertStore";
import { useCameraStore } from "@/store/cameraStore";

export default function HomeDashboard() {
  const { gpsData, updateGPSData, speedLimit } = useGPSStore();
  const { systemData, updateSystemData } = useSystemStore();
  const { alerts, addAlert, isBrakeActive, isEmergencyBrakeActive, triggerHorn, triggerBrake } = useAlertStore();
  const { showBoundingBoxes, toggleBoundingBoxes } = useCameraStore();

  const [activeTab, setActiveTab] = useState<"all" | "sensors" | "telemetry">("all");
  const [simulationActive, setSimulationActive] = useState(true);

  // 1. WebSocket integration with backend
  useEffect(() => {
    const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const wsUrl = apiHost.replace("http", "ws") + "/ws";
    
    console.log("Connecting to WebSocket:", wsUrl);
    let socket: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWS = () => {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket connected to detection stream");
        addAlert({
          level: "INFO",
          message: "Real-time edge telemetry WebSocket stream connected.",
          source: "SYSTEM",
        });
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.detections && data.detections.length > 0) {
            // Find closest detection
            const closest = data.detections.reduce((prev: any, curr: any) =>
              curr.distance < prev.distance ? curr : prev
            );
            
            // Map threat level based on distance
            const dist = closest.distance;
            const level = dist < 200 ? "DANGER" : dist < 500 ? "WARNING" : "INFO";
            const threat = dist < 200 ? "CRITICAL" : dist < 500 ? "HIGH" : "LOW";

            // Add alert to store
            addAlert({
              level,
              message: `AI DETECTED: ${closest.object.toUpperCase()} at ${dist}m (${Math.floor(closest.confidence * 100)}% conf).`,
              source: "AI_VISION",
              actionTaken: dist < 200 ? "Automatic brake recommendation applied" : undefined,
            });

            // If danger, trigger brake
            if (dist < 200) {
              triggerBrake(true);
            }
          }
        } catch (err) {
          console.error("Error parsing socket frame:", err);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket socket error:", err);
      };

      socket.onclose = () => {
        console.warn("WebSocket closed, attempting reconnect...");
        reconnectTimeout = setTimeout(connectWS, 5000);
      };
    };

    connectWS();

    return () => {
      if (socket) socket.close();
      clearTimeout(reconnectTimeout);
    };
  }, [addAlert, triggerBrake]);

  // 2. Real-Time Telemetry Simulation loop
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      // Fluctuate speed unless brakes applied
      let targetSpeed = gpsData.speed;
      if (isEmergencyBrakeActive) {
        targetSpeed = Math.max(0, gpsData.speed - 12.5); // Fast deceleration
      } else if (isBrakeActive) {
        targetSpeed = Math.max(0, gpsData.speed - 3.8); // Standard deceleration
      } else {
        // Normal cruise speed fluctuation (around 72-76 km/h)
        const mod = Math.random() > 0.5 ? 1 : -1;
        targetSpeed = Math.min(Math.max(gpsData.speed + Math.random() * 0.8 * mod, 68), 78);
      }

      // Update GPS coordinates slightly along a trail (going East)
      const newLng = gpsData.longitude + (gpsData.speed / 360000); // simulate motion
      
      updateGPSData({
        speed: targetSpeed,
        longitude: newLng,
        heading: 90 + Math.sin(Date.now() / 10000) * 2, // Slight curves
        satellites: Math.min(16, Math.max(8, gpsData.satellites + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
      });

      // Update Jetson system health telemetry
      const newCpu = Math.min(100, Math.max(30, systemData.cpuUsage + Math.floor((Math.random() - 0.5) * 4)));
      const newGpu = Math.min(100, Math.max(65, systemData.gpuUsage + Math.floor((Math.random() - 0.5) * 6)));
      const newTemp = Math.min(85, Math.max(50, systemData.gpuTemp + (newGpu > 85 ? 0.2 : -0.1)));
      
      updateSystemData({
        cpuUsage: newCpu,
        gpuUsage: newGpu,
        gpuTemp: parseFloat(newTemp.toFixed(1)),
        fps: 58.5 + Math.random() * 2.5,
        networkLatency: 12 + Math.floor(Math.random() * 5),
        inferenceTime: 11.8 + Math.random() * 1.5,
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [simulationActive, gpsData, isBrakeActive, isEmergencyBrakeActive, systemData, updateGPSData, updateSystemData]);

  // Trigger simulated obstacle (demonstration function)
  const triggerSimulationObstacle = (level: "WARNING" | "DANGER") => {
    if (level === "DANGER") {
      addAlert({
        level: "DANGER",
        message: "CRITICAL OBSTACLE: Boulder/Rockslide detected on track corridor - 180m.",
        source: "AI_VISION",
        actionTaken: "Service brake recommendation initiated.",
      });
      triggerBrake(true);
    } else {
      addAlert({
        level: "WARNING",
        message: "AHEAD WARNING: Maintenance vehicle spotted on loop track siding - 380m.",
        source: "LIDAR",
        actionTaken: "Speed restriction advisement: 45 km/h limit.",
      });
    }
  };

  // Reset demo states
  const resetDemoState = () => {
    triggerBrake(false);
    // Remove emergency stops, clear alerts, reset speed
    updateGPSData({ speed: 72 });
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HUD HEADER CONTROL TERMINAL */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary animate-pulse" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff]">OPERATOR TACTICAL DISPLAY</h2>
            <p className="text-[10px] text-outline font-mono">LOCOMOTIVE SYSTEMS STATUS: NOMINAL</p>
          </div>
        </div>

        {/* TAB CONTROLLERS */}
        <div className="flex bg-background/80 border border-surface-container-high rounded-lg p-1 text-[10px] font-mono font-bold">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 rounded transition-colors ${activeTab === "all" ? "bg-primary-container text-primary" : "text-outline hover:text-white"}`}
          >
            GRID DASHBOARD
          </button>
          <button
            onClick={() => setActiveTab("sensors")}
            className={`px-3 py-1 rounded transition-colors ${activeTab === "sensors" ? "bg-primary-container text-primary" : "text-outline hover:text-white"}`}
          >
            SENSORS MATRIX
          </button>
        </div>

        {/* DEMO ACTION TERMINAL */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-outline">HUD SIMULATION:</span>
          <button
            onClick={() => triggerSimulationObstacle("WARNING")}
            className="px-2.5 py-1 bg-yellow-950/30 border border-yellow-500/40 hover:bg-yellow-900/30 text-yellow-400 text-[9px] font-mono font-bold rounded"
          >
            SIM WARNING
          </button>
          <button
            onClick={() => triggerSimulationObstacle("DANGER")}
            className="px-2.5 py-1 bg-red-950/30 border border-red-500/40 hover:bg-red-900/30 text-red-400 text-[9px] font-mono font-bold rounded"
          >
            SIM DANGER
          </button>
          <button
            onClick={resetDemoState}
            className="px-2.5 py-1 bg-surface-container-high border border-outline/20 hover:bg-surface-bright text-white text-[9px] font-mono font-bold rounded"
            title="Reset telemetry & warning states"
          >
            RESET TELEMETRY
          </button>
        </div>
      </div>

      {activeTab === "all" ? (
        <div className="grid grid-cols-12 gap-3 flex-1">
          {/* LEFT TELEMETRY AND SPEEDOMETER COLUMN (3/12 cols) */}
          <div className="col-span-12 md:col-span-4 xl:col-span-3 flex flex-col gap-3">
            {/* Speedometer Card */}
            <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute top-2 left-2 text-[9px] font-mono text-outline font-bold">LOCOMOTIVE SPEED</div>
              <Gauge className="w-8 h-8 text-primary absolute right-3 top-3 opacity-20" />
              
              <div className="my-3 flex flex-col items-center">
                <span className="text-5xl font-black font-headline tracking-tighter text-[#ffffff] italic leading-none">
                  {Math.floor(gpsData.speed)}
                </span>
                <span className="text-[10px] font-mono text-outline font-bold mt-1 uppercase tracking-widest">KILOMETERS / HOUR</span>
              </div>

              {/* Speed limit display */}
              <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-surface-container-high/40 text-center font-mono text-[10px]">
                <div className="border-r border-surface-container-high/40">
                  <span className="text-outline block text-[9px]">SPEED LIMIT</span>
                  <span className="text-primary font-bold text-sm">{speedLimit} km/h</span>
                </div>
                <div>
                  <span className="text-outline block text-[9px]">MAX CAPABILITY</span>
                  <span className="text-[#ffffff] font-bold text-sm">160 km/h</span>
                </div>
              </div>
            </div>

            {/* Railway Track Geometry and Signal Aspects */}
            <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-3">
              <div className="text-[10px] font-mono text-outline font-bold uppercase tracking-wider">Railway Signal Status</div>
              
              <div className="flex items-center gap-3 bg-background/50 border border-surface-container-high/40 p-2.5 rounded-lg">
                {/* Visual signal display light */}
                <div className="flex flex-col gap-1.5 bg-[#0d1c32] p-1.5 rounded-full border border-surface-container-high">
                  <div className={`w-3.5 h-3.5 rounded-full border border-black/40 ${isBrakeActive ? "bg-red-500 shadow-[0_0_10px_#ef4444]" : "bg-red-950"}`} />
                  <div className={`w-3.5 h-3.5 rounded-full border border-black/40 ${!isBrakeActive && gpsData.speed < 60 ? "bg-yellow-400 shadow-[0_0_10px_#f59e0b]" : "bg-yellow-950"}`} />
                  <div className={`w-3.5 h-3.5 rounded-full border border-black/40 ${!isBrakeActive && gpsData.speed >= 60 ? "bg-green-500 shadow-[0_0_10px_#10b981]" : "bg-green-950"}`} />
                </div>

                <div className="flex-1 leading-tight font-mono">
                  <span className="text-outline text-[9px] block">SIGNAL ASPECT AHEAD</span>
                  <span className={`text-xs font-bold ${isBrakeActive ? "text-error" : gpsData.speed < 60 ? "text-yellow-400" : "text-tertiary"}`}>
                    {isBrakeActive ? "STOP (RED)" : gpsData.speed < 60 ? "CAUTION (YELLOW)" : "PROCEED (GREEN)"}
                  </span>
                  <p className="text-[9px] text-[#a3b5db] mt-0.5">DISTANCE: 850m</p>
                </div>
              </div>

              {/* Distance telemetries */}
              <div className="flex flex-col gap-2 text-[10px] font-mono">
                <div className="flex justify-between py-1 border-b border-surface-container-high/40">
                  <span className="text-outline">Dist to Station (Faridabad):</span>
                  <span className="text-[#ffffff] font-bold">21.0 km</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container-high/40">
                  <span className="text-outline">Dist to Road Crossing:</span>
                  <span className="text-[#ffffff] font-bold">1,250 m</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-outline">Track Occupancy Status:</span>
                  <span className="text-tertiary font-bold">CLEAR</span>
                </div>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-2.5 font-mono text-[10px]">
              <div className="text-[10px] text-outline font-bold uppercase tracking-wider">Atmospheric Telemetry</div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-background/55 border border-surface-container-high/40 p-2 rounded">
                  <Wind className="w-4 h-4 text-primary mx-auto mb-1 opacity-70" />
                  <span className="text-outline text-[8px] block">VISIBILITY</span>
                  <span className="text-white font-bold text-[11px]">350 Meters</span>
                </div>
                <div className="bg-background/55 border border-surface-container-high/40 p-2 rounded">
                  <Wind className="w-4 h-4 text-primary mx-auto mb-1 opacity-70" />
                  <span className="text-outline text-[8px] block">WIND SPEED</span>
                  <span className="text-white font-bold text-[11px]">18 km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN RADAR AND CAMERA STREAM WINDOWS (6/12 cols) */}
          <div className="col-span-12 md:col-span-8 xl:col-span-6 flex flex-col gap-3">
            <div className="h-[280px]">
              <VideoFeed />
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1 h-[230px]">
              <div className="h-full">
                <ThermalFeed />
              </div>
              <div className="h-full">
                <LidarFeed />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR MAP AND SYSTEM HEALTH STATS (3/12 cols) */}
          <div className="col-span-12 xl:col-span-3 flex flex-col gap-3">
            <div className="h-[270px]">
              <MiniMap />
            </div>

            {/* System Resources Card */}
            <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex-1 flex flex-col gap-3 font-mono text-xs">
              <div className="text-[10px] text-outline font-bold uppercase tracking-wider flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span>GPU Inference Diagnostics</span>
              </div>
              
              <div className="flex flex-col gap-2.5">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-outline">CUDA Core Workload</span>
                    <span className="text-primary font-bold">{systemData.gpuUsage}%</span>
                  </div>
                  <div className="h-1.5 bg-background border border-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${systemData.gpuUsage}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-outline">AGX CPU Host Load</span>
                    <span className="text-primary font-bold">{systemData.cpuUsage}%</span>
                  </div>
                  <div className="h-1.5 bg-background border border-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${systemData.cpuUsage}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1 text-[10px]">
                  <div className="bg-background/40 border border-surface-container-high/40 p-2 rounded">
                    <span className="text-outline text-[9px] block">INFERENCE TIMER</span>
                    <span className="text-[#ffffff] font-bold text-xs">{systemData.inferenceTime.toFixed(1)} ms</span>
                  </div>
                  <div className="bg-background/40 border border-surface-container-high/40 p-2 rounded">
                    <span className="text-outline text-[9px] block">SYSTEM TEMP</span>
                    <span className="text-white font-bold text-xs">{systemData.gpuTemp}°C</span>
                  </div>
                </div>

                <div className="p-2 border border-[#8dadff]/20 bg-[#0b3d91]/5 rounded flex items-center justify-between text-[9px]">
                  <span className="text-[#a3b5db] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    TensorRT Core Acceleration
                  </span>
                  <span className="text-primary font-bold">ENABLED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CAMERA, THERMAL & LIDAR FULL SENSOR VIEW GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
          <div className="h-[360px]">
            <VideoFeed />
          </div>
          <div className="h-[360px]">
            <ThermalFeed />
          </div>
          <div className="h-[360px]">
            <LidarFeed />
          </div>
        </div>
      )}
    </div>
  );
}
