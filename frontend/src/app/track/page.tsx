"use client";

import React from "react";
import { GitCommit, Activity, ShieldCheck, Settings, AlertTriangle, Compass } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const profileData = [
  { dist: "0km", gradient: 0.2, elevation: 210 },
  { dist: "1km", gradient: 0.5, elevation: 213 },
  { dist: "2km", gradient: 0.8, elevation: 216 },
  { dist: "3km", gradient: 0.4, elevation: 218 },
  { dist: "4km", gradient: -0.2, elevation: 217 },
  { dist: "5km", gradient: -0.5, elevation: 214 },
  { dist: "6km", gradient: 0.1, elevation: 215 },
];

export default function TrackPage() {
  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              Track Geometry & Infrastructure Diagnostics
            </h2>
            <p className="text-[10px] text-outline font-mono">
              SYSTEM: Track Integrity Inspector (Acoustic & Vibration Sensors)
            </p>
          </div>
        </div>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface-container-low/60 border border-surface-container-high p-4.5 rounded-xl backdrop-blur font-mono text-[10px]">
          <span className="text-outline block text-[9px]">TRACK GRADIENT</span>
          <span className="text-white font-headline text-lg font-black italic block mt-1">+0.8%</span>
          <span className="text-outline text-[9px] block mt-1">ASCENDING GRADIENT PROFILE</span>
        </div>

        <div className="bg-surface-container-low/60 border border-surface-container-high p-4.5 rounded-xl backdrop-blur font-mono text-[10px]">
          <span className="text-outline block text-[9px]">TRACK CURVATURE</span>
          <span className="text-white font-headline text-lg font-black italic block mt-1">R = 1,450m</span>
          <span className="text-primary text-[9px] font-bold block mt-1">SLIGHT RIGHT CURVATURE</span>
        </div>

        <div className="bg-surface-container-low/60 border border-surface-container-high p-4.5 rounded-xl backdrop-blur font-mono text-[10px]">
          <span className="text-outline block text-[9px]">STRUCTURAL RAIL HEALTH</span>
          <span className="text-tertiary font-headline text-lg font-black italic block mt-1">98.4%</span>
          <span className="text-tertiary text-[9px] font-bold block mt-1">NOMINAL (ZERO FRACTURES)</span>
        </div>

        <div className="bg-surface-container-low/60 border border-surface-container-high p-4.5 rounded-xl backdrop-blur font-mono text-[10px]">
          <span className="text-outline block text-[9px]">LINE SPEED CAP</span>
          <span className="text-white font-headline text-lg font-black italic block mt-1">110 km/h</span>
          <span className="text-outline text-[9px] block mt-1">SECTOR: NORTHERN HIGHWAY-1</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1">
        {/* GRAPH CHARTS (8/12 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-3">
          {/* ELEVATION CROSS SECTION */}
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 font-headline">
              <Activity className="w-4 h-4 text-primary" />
              Elevation Cross Section Profile (MSL meters)
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profileData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="dist" stroke="#8e909d" fontSize={9} tickLine={false} />
                  <YAxis stroke="#8e909d" fontSize={9} tickLine={false} domain={[200, 225]} />
                  <Tooltip contentStyle={{ background: "#041329", border: "1px solid #27354c", fontSize: "10px", color: "#d6e3ff" }} />
                  <defs>
                    <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b1c5ff" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#b1c5ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="elevation" stroke="#b1c5ff" strokeWidth={2} fillOpacity={1} fill="url(#elevationGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRADIENT SHIFT RATE */}
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 font-headline">
              <Compass className="w-4 h-4 text-primary" />
              Catenary Line Gradient Rate (%)
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profileData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="dist" stroke="#8e909d" fontSize={9} tickLine={false} />
                  <YAxis stroke="#8e909d" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#041329", border: "1px solid #27354c", fontSize: "10px", color: "#d6e3ff" }} />
                  <Line type="monotone" dataKey="gradient" stroke="#82db7e" strokeWidth={2} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SIDE BAR DETAILS (4/12 cols) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-4 font-mono text-[10px]">
          <div>
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <Settings className="w-4 h-4 text-primary" />
              Switch Junction Position
            </h3>
            
            <div className="flex flex-col gap-2">
              <div className="p-2.5 bg-background/40 border border-surface-container-high/40 rounded-lg flex justify-between">
                <span className="text-outline">Active Switch Siding:</span>
                <span className="text-tertiary font-bold">NORMAL (MAIN LINE)</span>
              </div>
              <div className="p-2.5 bg-background/40 border border-surface-container-high/40 rounded-lg flex justify-between">
                <span className="text-outline">Point Machine Locks:</span>
                <span className="text-tertiary font-bold">LOCKED & SEALED</span>
              </div>
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          {/* STRUCTURAL INTEGRITY */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Safety Integrity Levels (SIL)
            </h3>
            <p className="text-outline leading-relaxed mb-3">
              Infrastructure assets conform to regulatory safety integrity loops:
            </p>
            <div className="flex flex-col gap-2 text-[9px]">
              <div className="p-2.5 border border-[#8dadff]/20 bg-[#0b3d91]/5 rounded flex justify-between">
                <span className="text-white font-bold">Rail Integrity Index</span>
                <span className="text-tertiary font-bold">SIL-4 RATED</span>
              </div>
              <div className="p-2.5 border border-yellow-500/20 bg-yellow-950/5 rounded flex justify-between">
                <span className="text-yellow-400 font-bold">Automatic Point Shunts</span>
                <span className="text-yellow-400 font-bold">SIL-3 RATED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
