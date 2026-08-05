"use client";

import React from "react";
import { PieChart as PieChartIcon, Cpu, Zap, Activity, Thermometer, Database } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { useSystemStore } from "@/store/systemStore";

export default function AnalyticsPage() {
  const { systemData, cpuUsageHistory, gpuUsageHistory, fpsHistory, latencyHistory } = useSystemStore();

  // Combine histories into a single data array for Recharts
  const historyData = cpuUsageHistory.map((cpu, index) => ({
    time: `T-${cpuUsageHistory.length - index}`,
    cpu,
    gpu: gpuUsageHistory[index],
    fps: fpsHistory[index],
    latency: latencyHistory[index],
  }));

  const tempData = [
    { name: "CPU Core", temp: systemData.cpuTemp, fill: systemData.cpuTemp > 80 ? "#ef4444" : "#3b82f6" },
    { name: "GPU (CUDA)", temp: systemData.gpuTemp, fill: systemData.gpuTemp > 85 ? "#ef4444" : "#10b981" },
  ];

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              System Telemetry & Analytics
            </h2>
            <p className="text-[10px] text-outline font-mono">
              EDGE NODE: NVIDIA Jetson Orin AGX (Real-time Hardware Monitoring)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1 overflow-y-auto pb-4">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
          {/* CPU & GPU WORKLOAD */}
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex-1 min-h-[250px]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 font-headline">
              <Cpu className="w-4 h-4 text-primary" />
              Compute Workload (CPU vs GPU)
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="#8e909d" fontSize={9} tickLine={false} />
                  <YAxis stroke="#8e909d" fontSize={9} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "#041329", border: "1px solid #27354c", fontSize: "10px", color: "#d6e3ff" }} />
                  <Line type="monotone" dataKey="cpu" name="CPU Usage %" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="gpu" name="GPU Usage %" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-mono">
              <span className="text-blue-400 font-bold">Current CPU: {systemData.cpuUsage.toFixed(1)}%</span>
              <span className="text-emerald-400 font-bold">Current GPU: {systemData.gpuUsage.toFixed(1)}%</span>
            </div>
          </div>

          {/* LATENCY */}
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex-1 min-h-[250px]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 font-headline">
              <Activity className="w-4 h-4 text-primary" />
              Network & WebSocket Latency (ms)
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="#8e909d" fontSize={9} tickLine={false} />
                  <YAxis stroke="#8e909d" fontSize={9} tickLine={false} domain={[0, 'dataMax + 20']} />
                  <Tooltip contentStyle={{ background: "#041329", border: "1px solid #27354c", fontSize: "10px", color: "#d6e3ff" }} />
                  <defs>
                    <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#latGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-[10px] font-mono text-yellow-500 font-bold">
              Current Latency: {systemData.networkLatency.toFixed(1)} ms
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
          {/* FPS STABILITY */}
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex-1 min-h-[250px]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 font-headline">
              <Zap className="w-4 h-4 text-primary" />
              Inference FPS Stability
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="#8e909d" fontSize={9} tickLine={false} />
                  <YAxis stroke="#8e909d" fontSize={9} tickLine={false} domain={[0, 120]} />
                  <Tooltip contentStyle={{ background: "#041329", border: "1px solid #27354c", fontSize: "10px", color: "#d6e3ff" }} />
                  <Line type="stepAfter" dataKey="fps" name="Frames Per Second" stroke="#a855f7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-[10px] font-mono text-purple-400 font-bold">
              Current FPS: {systemData.fps.toFixed(1)} FPS
            </div>
          </div>

          {/* TEMPERATURES & MEMORY */}
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-[250px]">
            <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 font-headline">
                <Thermometer className="w-4 h-4 text-primary" />
                Thermal Metrics (°C)
              </h3>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tempData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#8e909d" fontSize={9} tickLine={false} />
                    <YAxis stroke="#8e909d" fontSize={9} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "#041329", border: "1px solid #27354c", fontSize: "10px", color: "#d6e3ff" }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="temp" radius={[4, 4, 0, 0]}>
                      {tempData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 font-headline">
                  <Database className="w-4 h-4 text-primary" />
                  Memory & Storage
                </h3>
                <div className="flex flex-col gap-4 font-mono text-[10px]">
                  <div>
                    <div className="flex justify-between mb-1 text-outline">
                      <span>RAM Allocation</span>
                      <span className="text-white font-bold">{systemData.ramUsage}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${systemData.ramUsage}%` }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-outline">
                      <span>NAND Storage</span>
                      <span className="text-white font-bold">{systemData.diskUsage}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${systemData.diskUsage}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2 bg-background/50 border border-surface-container-high/60 rounded text-[#a3b5db] text-[9px] mt-4 font-mono">
                TensorRT: <strong className={systemData.tensorRtActive ? "text-emerald-400" : "text-red-400"}>
                  {systemData.tensorRtActive ? "ACTIVE" : "INACTIVE"}
                </strong>
                <br />
                Inference Time: <strong className="text-white">{systemData.inferenceTime} ms</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
