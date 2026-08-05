"use client";

import React, { useState } from "react";
import { ScrollText, Search, Filter, AlertTriangle, Info, ShieldAlert, Cpu } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "FATAL";
  source: "AI_MODEL" | "SYSTEM" | "NETWORK" | "HARDWARE";
  message: string;
}

const generateMockLogs = (): LogEntry[] => {
  const logs: LogEntry[] = [];
  const sources: LogEntry["source"][] = ["AI_MODEL", "SYSTEM", "NETWORK", "HARDWARE"];
  
  for (let i = 0; i < 50; i++) {
    const isError = Math.random() > 0.85;
    const isWarn = Math.random() > 0.6;
    let level: LogEntry["level"] = "INFO";
    if (isError) level = "ERROR";
    else if (isWarn) level = "WARN";
    
    // Some manual overrides for FATAL
    if (i === 12 || i === 45) level = "FATAL";

    logs.push({
      id: `LOG-${1000 + i}`,
      timestamp: new Date(Date.now() - Math.random() * 100000000).toISOString().replace("T", " ").split(".")[0],
      level,
      source: sources[Math.floor(Math.random() * sources.length)],
      message: getMessageForLevelAndSource(level, sources[Math.floor(Math.random() * sources.length)]),
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const getMessageForLevelAndSource = (level: string, source: string) => {
  if (level === "FATAL") return "CRITICAL FAILURE: Memory access violation at 0x0000. System halt requested.";
  if (level === "ERROR" && source === "AI_MODEL") return "TensorRT Engine failed to allocate CUDA memory for inference.";
  if (level === "ERROR" && source === "NETWORK") return "WebSocket connection timed out (heartbeat missing > 5000ms).";
  if (level === "WARN") return "Approaching thermal limits. GPU temperature at 84°C.";
  if (source === "AI_MODEL") return "YOLOv10-X inference completed successfully (12ms latency).";
  return "System health check OK. Diagnostics passed.";
};

const mockLogs = generateMockLogs();

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [logs] = useState<LogEntry[]>(mockLogs);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === "ALL" ? true : log.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              System Audit & Telemetry Logs
            </h2>
            <p className="text-[10px] text-outline font-mono">
              REGISTRY: OAVAS Kernel Event Viewer
            </p>
          </div>
        </div>
      </div>

      {/* FILTER SEARCH BAR */}
      <div className="bg-surface-container-low/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex flex-wrap items-center justify-between gap-3 font-mono text-[10px]">
        <div className="flex items-center gap-2 bg-background/50 border border-surface-container-high rounded px-3 py-1.5 w-full md:w-80">
          <Search className="w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Search logs by ID or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-white focus:outline-none w-full text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-outline flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-primary" />
            SEVERITY LEVEL:
          </span>
          <div className="flex bg-background border border-surface-container-high rounded-lg p-0.5 font-bold">
            {["ALL", "FATAL", "ERROR", "WARN", "INFO"].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-3 py-1 rounded text-[9px] transition-colors ${
                  filterLevel === level ? "bg-primary-container text-primary" : "text-outline hover:text-white"
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
        <div className="h-full overflow-y-auto overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead className="sticky top-0 bg-surface-container-lowest z-10 border-b border-surface-container-high text-outline font-bold uppercase tracking-wider text-[9px]">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Event Source</th>
                <th className="p-3">Message payload</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-outline">
                    No telemetry events matched your query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-surface-container-high/40 hover:bg-surface-container-high/20 transition-colors">
                    <td className="p-3 font-bold text-outline">{log.id}</td>
                    <td className="p-3 text-white">{log.timestamp}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold border flex items-center w-max gap-1 ${
                          log.level === "FATAL"
                            ? "bg-red-950/50 border-red-500 text-white animate-pulse"
                            : log.level === "ERROR"
                            ? "bg-red-950/30 border-red-500/50 text-red-400"
                            : log.level === "WARN"
                            ? "bg-yellow-950/30 border-yellow-500/50 text-yellow-400"
                            : "bg-blue-950/30 border-blue-500/50 text-blue-400"
                        }`}
                      >
                        {log.level === "FATAL" && <ShieldAlert className="w-3 h-3" />}
                        {log.level === "ERROR" && <AlertTriangle className="w-3 h-3" />}
                        {log.level === "WARN" && <AlertTriangle className="w-3 h-3" />}
                        {log.level === "INFO" && <Info className="w-3 h-3" />}
                        {log.level}
                      </span>
                    </td>
                    <td className="p-3 text-tertiary font-bold">{log.source}</td>
                    <td className="p-3 text-[#a3b5db]">{log.message}</td>
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
