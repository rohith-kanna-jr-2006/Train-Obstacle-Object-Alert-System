"use client";

import React, { useState } from "react";
import { Eye, Download, Search, Filter, BarChart3, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DetectionRecord {
  id: string;
  timestamp: string;
  object: string;
  distance: number;
  confidence: number;
  threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  trackId: string;
}

const initialDetections: DetectionRecord[] = [
  { id: "DET-901", timestamp: "2026-07-04 10:45:12", object: "Boulder/Rockslide", distance: 180, confidence: 0.94, threatLevel: "CRITICAL", trackId: "TK-UP-1" },
  { id: "DET-902", timestamp: "2026-07-04 10:38:45", object: "Maintenance Siding", distance: 380, confidence: 0.88, threatLevel: "HIGH", trackId: "TK-UP-2" },
  { id: "DET-903", timestamp: "2026-07-04 10:15:30", object: "Cattle / Animal", distance: 520, confidence: 0.72, threatLevel: "MEDIUM", trackId: "TK-LOOP-1" },
  { id: "DET-904", timestamp: "2026-07-04 09:55:18", object: "Human / Intruder", distance: 120, confidence: 0.96, threatLevel: "CRITICAL", trackId: "TK-UP-1" },
  { id: "DET-905", timestamp: "2026-07-04 09:24:05", object: "Debris / Trash", distance: 680, confidence: 0.65, threatLevel: "LOW", trackId: "TK-DOWN-1" },
  { id: "DET-906", timestamp: "2026-07-04 08:42:50", object: "Rail Vehicle", distance: 1100, confidence: 0.91, threatLevel: "MEDIUM", trackId: "TK-CROSS-2" },
];

const chartData = [
  { name: "Rocks", count: 4, fill: "#ef4444" },
  { name: "Animals", count: 12, fill: "#eab308" },
  { name: "Intruders", count: 8, fill: "#ef4444" },
  { name: "Vehicles", count: 3, fill: "#3b82f6" },
  { name: "Debris", count: 15, fill: "#10b981" },
];

export default function ObjectDetectionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterThreat, setFilterThreat] = useState<string>("ALL");
  const [records, setRecords] = useState<DetectionRecord[]>(initialDetections);

  const filteredRecords = records.filter((r) => {
    const matchesSearch = r.object.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesThreat = filterThreat === "ALL" ? true : r.threatLevel === filterThreat;
    return matchesSearch && matchesThreat;
  });

  // Export CSV functionality
  const exportToCSV = () => {
    const headers = "ID,Timestamp,Object,Distance(m),Confidence(%),Threat Level,Track ID\n";
    const rows = filteredRecords
      .map((r) => `${r.id},${r.timestamp},${r.object},${r.distance},${Math.floor(r.confidence * 100)},${r.threatLevel},${r.trackId}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OAVAS_Detections_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              Neural Object Detection Registry
            </h2>
            <p className="text-[10px] text-outline font-mono">
              AI INFERENCE MODEL: YOLOv10-X (TensorRT Optimized)
            </p>
          </div>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#004e11]/30 hover:bg-[#004e11]/50 border border-tertiary/30 text-tertiary text-[10px] font-mono font-bold rounded transition-all active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5" />
          EXPORT DATA (CSV)
        </button>
      </div>

      {/* TOP ANALYTICS CHARTS */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-6 bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur">
          <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-headline">
            <BarChart3 className="w-4 h-4 text-primary" />
            Monthly Obstacle Distribution
          </h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#8e909d" fontSize={9} tickLine={false} />
                <YAxis stroke="#8e909d" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ background: "#041329", border: "1px solid #27354c", fontSize: "10px", color: "#d6e3ff" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* THREAT WARNING CARD */}
        <div className="col-span-12 lg:col-span-6 bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col justify-between font-mono text-[10px]">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <AlertCircle className="w-4 h-4 text-error" />
              Vision Threat Classification Policy
            </h3>
            <p className="text-outline leading-relaxed mb-3">
              Objects detected in the central catenary corridor (±3m path clearance) are categorized based on range proximity indices:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              <div className="p-2 border border-red-500/20 bg-red-950/10 rounded">
                <span className="text-red-400 font-bold block">CRITICAL (&lt; 200m)</span>
                <span className="text-outline">Triggers emergency brake recommendation.</span>
              </div>
              <div className="p-2 border border-yellow-500/20 bg-yellow-950/10 rounded">
                <span className="text-yellow-400 font-bold block">HIGH (200m - 500m)</span>
                <span className="text-outline">Requires speed reduction to 45 km/h.</span>
              </div>
            </div>
          </div>
          <div className="p-2 bg-background/50 border border-surface-container-high/60 rounded text-[#a3b5db] text-[9px] mt-2">
            AI Model Average Confidence: <strong className="text-white">92.4%</strong> | Average Latency: <strong className="text-white">12.5ms</strong>
          </div>
        </div>
      </div>

      {/* FILTER SEARCH BAR */}
      <div className="bg-surface-container-low/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex flex-wrap items-center justify-between gap-3 font-mono text-[10px]">
        <div className="flex items-center gap-2 bg-background/50 border border-surface-container-high rounded px-3 py-1.5 w-full md:w-80">
          <Search className="w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Search by object or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-white focus:outline-none w-full text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-outline flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-primary" />
            THREAT BADGE:
          </span>
          <div className="flex bg-background border border-surface-container-high rounded-lg p-0.5 font-bold">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((level) => (
              <button
                key={level}
                onClick={() => setFilterThreat(level)}
                className={`px-3 py-1 rounded text-[9px] transition-colors ${
                  filterThreat === level ? "bg-primary-container text-primary" : "text-outline hover:text-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DATA LOGS TABLE */}
      <div className="bg-surface-container-low/60 border border-surface-container-high rounded-xl backdrop-blur overflow-hidden flex-1 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-surface-container-high text-outline font-bold uppercase tracking-wider text-[9px]">
                <th className="p-3">Record ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Detected Object</th>
                <th className="p-3">Distance</th>
                <th className="p-3">AI Confidence</th>
                <th className="p-3">Threat Badge</th>
                <th className="p-3">Track ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-outline">
                    No matching AI object logs found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="border-b border-surface-container-high/40 hover:bg-surface-container-high/20 transition-colors">
                    <td className="p-3 font-bold text-white">{rec.id}</td>
                    <td className="p-3 text-outline">{rec.timestamp}</td>
                    <td className="p-3 text-[#ffffff] font-bold">{rec.object}</td>
                    <td className="p-3 text-primary">{rec.distance} m</td>
                    <td className="p-3 text-[#a3b5db]">{(rec.confidence * 100).toFixed(0)}%</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                          rec.threatLevel === "CRITICAL"
                            ? "bg-red-950/30 border-red-500/50 text-red-400"
                            : rec.threatLevel === "HIGH"
                            ? "bg-yellow-950/30 border-yellow-500/50 text-yellow-400"
                            : rec.threatLevel === "MEDIUM"
                            ? "bg-blue-950/30 border-blue-500/50 text-blue-400"
                            : "bg-surface-container-lowest border-outline/20 text-outline"
                        }`}
                      >
                        {rec.threatLevel}
                      </span>
                    </td>
                    <td className="p-3 text-outline">{rec.trackId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
