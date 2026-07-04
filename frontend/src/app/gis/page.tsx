"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Map, Compass, Navigation, Database, Signal, AlertTriangle } from "lucide-react";
import { useGPSStore } from "@/store/gpsStore";

// Dynamically import LeafletMap with SSR disabled to prevent Node compilation crashes
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false });

export default function GISPage() {
  const { gpsData } = useGPSStore();

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              Interactive Railway GIS Navigation
            </h2>
            <p className="text-[10px] text-outline font-mono">
              MAP ENGINE: Leaflet Vector Core (WGS 84 Ellipsoid projection)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1">
        {/* INTERACTIVE LEAFLET VIEWPORT (8/12 cols) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low/30 border border-surface-container-high rounded-xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.5)] relative h-[500px] lg:h-auto">
          <LeafletMap />
        </div>

        {/* DETAILS PANEL (4/12 cols) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-4 overflow-y-auto">
          {/* NAVIGATION HUD */}
          <div>
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-headline">
              <Compass className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "15s" }} />
              Locomotive Positioning GPS
            </h3>

            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
              <div className="bg-background/40 border border-surface-container-high/40 p-2.5 rounded">
                <span className="text-outline text-[8px] block">LATITUDE</span>
                <span className="text-white font-bold text-[11px]">{gpsData.latitude.toFixed(6)}° N</span>
              </div>
              <div className="bg-background/40 border border-surface-container-high/40 p-2.5 rounded">
                <span className="text-outline text-[8px] block">LONGITUDE</span>
                <span className="text-white font-bold text-[11px]">{gpsData.longitude.toFixed(6)}° E</span>
              </div>
              <div className="bg-background/40 border border-surface-container-high/40 p-2.5 rounded">
                <span className="text-outline text-[8px] block">HEADING BEARING</span>
                <span className="text-white font-bold text-[11px]">{gpsData.heading.toFixed(1)}° (EAST)</span>
              </div>
              <div className="bg-background/40 border border-surface-container-high/40 p-2.5 rounded">
                <span className="text-outline text-[8px] block">ALTITUDE (MSL)</span>
                <span className="text-white font-bold text-[11px]">{gpsData.altitude.toFixed(1)} m</span>
              </div>
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          {/* SIGNAL / GPS HEALTH */}
          <div>
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <Signal className="w-4 h-4 text-primary" />
              GNSS Signal Health
            </h3>

            <div className="flex flex-col gap-2 font-mono text-[10px]">
              <div className="flex items-center justify-between p-2 bg-background/40 border border-surface-container-high/40 rounded-lg">
                <span className="text-outline">GNSS Sats Tracked:</span>
                <span className="text-tertiary font-bold">{gpsData.satellites} Satellites</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-background/40 border border-surface-container-high/40 rounded-lg">
                <span className="text-outline">Horizontal Precision (HDOP):</span>
                <span className="text-white font-bold">0.82 (Excellent)</span>
              </div>
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          {/* OFFLINE MAP SUPPORT */}
          <div>
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <Database className="w-4 h-4 text-primary" />
              Offline Maps Storage
            </h3>

            <div className="flex flex-col gap-2 font-mono text-[10px]">
              <div className="flex items-center justify-between p-2 bg-background/40 border border-surface-container-high/40 rounded-lg">
                <div>
                  <p className="text-white font-bold">Local Map Cache</p>
                  <span className="text-outline text-[8px]">Sector: Delhi-NCR Rail Corridor</span>
                </div>
                <span className="text-tertiary font-bold">1.42 GB (ACTIVE)</span>
              </div>
              <div className="p-2 border border-yellow-500/20 bg-yellow-500/5 rounded text-[9px] text-[#ffb4ab] flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-yellow-500" />
                <span>Offline caching will auto-update upon 4G LTE-R handshake.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
