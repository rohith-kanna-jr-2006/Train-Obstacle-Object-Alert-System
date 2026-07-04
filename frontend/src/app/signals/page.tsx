"use client";

import React from "react";
import { TrafficCone, Info, RefreshCw, AlertTriangle, Route } from "lucide-react";
import { useMapStore } from "@/store/mapStore";

export default function SignalsPage() {
  const { signals } = useMapStore();

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrafficCone className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              Railway Signaling & Interlocking Monitor
            </h2>
            <p className="text-[10px] text-outline font-mono">
              SYSTEM: ETCS Level 2 (European Train Control System integration)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1">
        {/* SIGNAL MONITOR COLUMN (8/12 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-3">
          <div className="bg-surface-container-low/60 border border-surface-container-high rounded-xl p-4 backdrop-blur flex-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-headline">
              Approaching Signals Corridor
            </h3>

            <div className="flex flex-col gap-3">
              {signals.map((sig) => {
                let statusColor = "text-tertiary";
                if (sig.status === "FAULT") statusColor = "text-error";
                else if (sig.status === "MAINTENANCE") statusColor = "text-yellow-500";

                return (
                  <div
                    key={sig.id}
                    className="p-3.5 bg-background/50 border border-surface-container-high rounded-xl flex flex-wrap items-center justify-between gap-3 font-mono text-[10px]"
                  >
                    {/* Visual Signal aspect */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1 bg-[#0d1c32] p-1.5 rounded-full border border-surface-container-high">
                        <div className={`w-3.5 h-3.5 rounded-full ${sig.aspect === "RED" ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-red-950"}`} />
                        <div className={`w-3.5 h-3.5 rounded-full ${sig.aspect === "YELLOW" || sig.aspect === "DOUBLE_YELLOW" ? "bg-yellow-400 shadow-[0_0_8px_#f59e0b]" : "bg-yellow-950"}`} />
                        <div className={`w-3.5 h-3.5 rounded-full ${sig.aspect === "GREEN" ? "bg-green-500 shadow-[0_0_8px_#10b981]" : "bg-green-950"}`} />
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-white">{sig.id} ({sig.name})</h4>
                        <p className="text-outline text-[9px] mt-0.5">TRACK ID: {sig.trackId} | ROUTE: {sig.route}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-outline block text-[9px]">DISTANCE TARGET</span>
                      <span className="text-primary font-bold text-sm">{sig.distance} m</span>
                    </div>

                    <div className="text-right">
                      <span className="text-outline block text-[9px]">LINE STATE</span>
                      <span className={`font-bold ${statusColor}`}>{sig.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DETAILS SIDEBAR (4/12 cols) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-4 font-mono text-[10px]">
          <div>
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <Route className="w-4 h-4 text-primary" />
              Route Interlocking Status
            </h3>
            
            <div className="flex flex-col gap-2">
              <div className="p-2.5 bg-background/40 border border-surface-container-high/40 rounded-lg flex justify-between">
                <span className="text-outline">Catenary Line Power:</span>
                <span className="text-tertiary font-bold">25 kV AC (50Hz)</span>
              </div>
              <div className="p-2.5 bg-background/40 border border-surface-container-high/40 rounded-lg flex justify-between">
                <span className="text-outline">Track Shunt Loop:</span>
                <span className="text-tertiary font-bold">TUNED (NOMINAL)</span>
              </div>
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          {/* ASSETS SUMMARY */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <Info className="w-4 h-4 text-primary" />
              Aspect Speed Regulations
            </h3>
            <p className="text-outline leading-relaxed mb-3">
              Locomotive speed guidelines based on receiving signals:
            </p>
            <div className="flex flex-col gap-2 text-[9px]">
              <div className="p-2 border border-[#8dadff]/20 bg-[#0b3d91]/5 rounded flex justify-between">
                <span className="text-white font-bold">GREEN (Clear)</span>
                <span className="text-outline">CRUISE (Line Speed Limit)</span>
              </div>
              <div className="p-2 border border-yellow-500/20 bg-yellow-950/5 rounded flex justify-between">
                <span className="text-yellow-400 font-bold">YELLOW (Caution)</span>
                <span className="text-outline">DESTRUCT TO 45 km/h</span>
              </div>
              <div className="p-2 border border-red-500/20 bg-red-950/5 rounded flex justify-between">
                <span className="text-red-400 font-bold">RED (Danger)</span>
                <span className="text-outline">STOP COMMENCE IMMEDIATE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
