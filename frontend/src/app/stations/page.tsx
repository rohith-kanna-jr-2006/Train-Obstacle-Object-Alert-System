"use client";

import React from "react";
import { Train, Clock, Milestone, Calendar, AlertTriangle } from "lucide-react";
import { useMapStore } from "@/store/mapStore";
import { useGPSStore } from "@/store/gpsStore";

export default function StationsPage() {
  const { stations } = useMapStore();
  const { routeProgress } = useGPSStore();

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Train className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              Locomotive Station Schedule & Schedulers
            </h2>
            <p className="text-[10px] text-outline font-mono">
              SCHEDULING DEPOT: Northern Railway Division (Delhi Corridor)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1">
        {/* STATION SCHEDULER VIEW (8/12 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-3">
          <div className="bg-surface-container-low/60 border border-surface-container-high rounded-xl p-4 backdrop-blur flex-1">
            
            {/* PROGRESS GAUGE */}
            <div className="mb-6 p-4 bg-background/50 border border-surface-container-high rounded-xl font-mono text-[10px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-outline">TOTAL ROUTE MILEAGE PROGRESS</span>
                <span className="text-primary font-bold">{routeProgress}% COMPLETED</span>
              </div>
              <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${routeProgress}%` }} />
              </div>
              <div className="flex justify-between text-[8px] text-outline mt-1.5">
                <span>NEW DELHI (0 km)</span>
                <span>FARIDABAD (21 km)</span>
                <span>MATHURA JN (141 km)</span>
              </div>
            </div>

            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-headline">
              Station Sequence
            </h3>

            <div className="flex flex-col gap-3">
              {stations.map((stn) => (
                <div
                  key={stn.id}
                  className="p-3.5 bg-background/50 border border-surface-container-high rounded-xl flex flex-wrap items-center justify-between gap-3 font-mono text-[10px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary-container border border-primary flex items-center justify-center text-primary">
                      <Milestone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{stn.name}</h4>
                      <p className="text-outline text-[9px] mt-0.5">ASSIGNED PLATFORM: {stn.platform}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-outline block text-[9px]">DISTANCE TARGET</span>
                    <span className="text-[#ffffff] font-bold text-xs">{stn.distance === 0 ? "PASSED" : `${stn.distance / 1000} km`}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-outline block text-[9px]">RESTRICTION LIMIT</span>
                    <span className="text-error font-bold text-xs">{stn.speedRestriction} km/h</span>
                  </div>

                  <div className="text-right">
                    <span className="text-outline block text-[9px]">ESTIMATED ARRIVAL</span>
                    <span className="text-tertiary font-bold text-xs">{stn.distance === 0 ? "ARRIVED" : stn.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DETAILS SIDEBAR (4/12 cols) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-4 font-mono text-[10px]">
          <div>
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <Clock className="w-4 h-4 text-primary" />
              Pilot Timetable Schedule
            </h3>
            
            <div className="flex flex-col gap-2">
              <div className="p-2.5 bg-background/40 border border-surface-container-high/40 rounded-lg flex justify-between">
                <span className="text-outline">Trip Code:</span>
                <span className="text-white font-bold">TRIP-12845-UP</span>
              </div>
              <div className="p-2.5 bg-background/40 border border-surface-container-high/40 rounded-lg flex justify-between">
                <span className="text-outline">Catenary Corridor:</span>
                <span className="text-white font-bold">NCR_TK_LINE_01</span>
              </div>
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          {/* STATION BRAKING REGULATIONS */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <AlertTriangle className="w-4 h-4 text-primary" />
              Platform Braking Guidelines
            </h3>
            <p className="text-outline leading-relaxed mb-3">
              Standard platform deceleration curves must match track restrictors:
            </p>
            <div className="flex flex-col gap-2 text-[9px]">
              <div className="p-2 border border-[#8dadff]/20 bg-[#0b3d91]/5 rounded">
                <span className="text-white font-bold block">Approach Limit (&lt; 1,000m)</span>
                <span className="text-outline">Decelerate to 45 km/h.</span>
              </div>
              <div className="p-2 border border-yellow-500/20 bg-yellow-950/5 rounded">
                <span className="text-yellow-400 font-bold block">Platform Entry (&lt; 200m)</span>
                <span className="text-outline">Decelerate to 15 km/h.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
