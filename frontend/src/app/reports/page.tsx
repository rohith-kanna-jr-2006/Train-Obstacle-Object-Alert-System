"use client";

import React, { useState } from "react";
import { FileText, Download, BarChart2, Calendar, FileSpreadsheet, File } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const reportData = [
  { name: "Mon", obstacles: 4, warnings: 12, stops: 0 },
  { name: "Tue", obstacles: 2, warnings: 8, stops: 1 },
  { name: "Wed", obstacles: 6, warnings: 15, stops: 0 },
  { name: "Thu", obstacles: 3, warnings: 9, stops: 0 },
  { name: "Fri", obstacles: 5, warnings: 14, stops: 2 },
  { name: "Sat", obstacles: 1, warnings: 4, stops: 0 },
  { name: "Sun", obstacles: 2, warnings: 6, stops: 0 },
];

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");

  const triggerExport = (format: "pdf" | "csv") => {
    alert(`REPORT EXPORT: Preparing ${timeframe.toUpperCase()} diagnostic report in ${format.toUpperCase()} format. Download started.`);
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              Locomotive Incident & AI Analytics Registry
            </h2>
            <p className="text-[10px] text-outline font-mono">
              DATABASE: Local SQLite DB Store (Synchronized with Central Cloud Depot)
            </p>
          </div>
        </div>
        
        {/* EXPORTS */}
        <div className="flex gap-2">
          <button
            onClick={() => triggerExport("csv")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#004e11]/30 hover:bg-[#004e11]/50 border border-tertiary/30 text-tertiary text-[10px] font-mono font-bold rounded transition-all active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            CSV REPORT
          </button>
          <button
            onClick={() => triggerExport("pdf")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container/30 hover:bg-primary-container/55 border border-primary/30 text-primary text-[10px] font-mono font-bold rounded transition-all active:scale-[0.98]"
          >
            <File className="w-3.5 h-3.5" />
            PDF REPORT
          </button>
        </div>
      </div>

      {/* FILTER SEARCH BAR */}
      <div className="bg-surface-container-low/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex flex-wrap items-center justify-between gap-3 font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-outline">SELECT TIMEFRAME:</span>
        </div>
        <div className="flex bg-background border border-surface-container-high rounded-lg p-0.5 font-bold">
          {(["daily", "weekly", "monthly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded text-[9px] uppercase transition-colors ${
                timeframe === t ? "bg-primary-container text-primary" : "text-outline hover:text-white"
              }`}
            >
              {t} REPORT
            </button>
          ))}
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur font-mono text-[10px]">
          <span className="text-outline block text-[9px]">TOTAL SPOTTED CORRIDOR TARGETS</span>
          <span className="text-white font-headline text-lg font-black italic block mt-1">23 Detections</span>
          <span className="text-[#a3b5db] text-[9px] block mt-1">IN COMPLIANCE CORRIDOR SENSORS</span>
        </div>

        <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur font-mono text-[10px]">
          <span className="text-outline block text-[9px]">INTERRUPTS TRIGGERED</span>
          <span className="text-error font-headline text-lg font-black italic block mt-1">3 Braking Warnings</span>
          <span className="text-error text-[9px] font-bold block mt-1">SERVICE BRAKES COMMENCED</span>
        </div>

        <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur font-mono text-[10px]">
          <span className="text-outline block text-[9px]">AVERAGE AI CONFIDENCE RATINGS</span>
          <span className="text-tertiary font-headline text-lg font-black italic block mt-1">91.4%</span>
          <span className="text-tertiary text-[9px] font-bold block mt-1">STABLE OBJECT CLASSIFICATIONS</span>
        </div>

        <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur font-mono text-[10px]">
          <span className="text-outline block text-[9px]">CRITICAL EMERGENCY STOPS</span>
          <span className="text-white font-headline text-lg font-black italic block mt-1">0 Applications</span>
          <span className="text-outline text-[9px] block mt-1">0% FORCE CRITICAL INITIATES</span>
        </div>
      </div>

      {/* CHARTS GRAPH */}
      <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex-1 flex flex-col">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 font-headline">
          <BarChart2 className="w-4 h-4 text-primary" />
          Corridor Alarms & Warnings frequency (Daily Grid)
        </h3>
        
        <div className="flex-1 w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(11, 61, 145, 0.1)" />
              <XAxis dataKey="name" stroke="#8e909d" fontSize={9} tickLine={false} />
              <YAxis stroke="#8e909d" fontSize={9} tickLine={false} />
              <Tooltip contentStyle={{ background: "#041329", border: "1px solid #27354c", fontSize: "10px", color: "#d6e3ff" }} />
              <Bar dataKey="warnings" fill="#eab308" radius={[4, 4, 0, 0]} name="Caution Warnings" />
              <Bar dataKey="obstacles" fill="#ef4444" radius={[4, 4, 0, 0]} name="Critical Dangers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
