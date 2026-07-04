"use client";

import React from "react";
import { HelpCircle, Info, FileText, ShieldAlert, Cpu, Keyboard } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              OAVAS Operator Reference & Diagnostic Manual
            </h2>
            <p className="text-[10px] text-outline font-mono">
              MANUAL SECTION: Operating Directives v2.4 (Interlocking division)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1 overflow-y-auto pb-4">
        {/* OPERATIONAL GUIDELINES (8/12 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-3 font-mono text-[10px] leading-relaxed text-[#a3b5db]">
          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <Info className="w-4 h-4 text-primary" />
              1. System Overview & Mission
            </h3>
            <p>
              The Onboard Augmented Vision Assistance System (OAVAS) is designed to mitigate collisions in high-density railway tracks by leveraging real-time sensor fusion. By combining HD optical camera frames, LWIR thermal signatures, and 3D LiDAR point clouds, the system calculates threat vectors under adverse conditions such as dense fog, rain, dust, and tunnels.
            </p>
          </div>

          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <Cpu className="w-4 h-4 text-primary" />
              2. Edge Compute Architecture
            </h3>
            <p>
              Primary inference is hosted locally on the locomotive chassis using the <strong className="text-white">NVIDIA Jetson AGX Orin</strong> edge computing node. Object detection tasks are accelerated using YOLOv10 networks serialized with custom <strong className="text-white">NVIDIA TensorRT</strong> engine engines, achieving average inference latency of less than 13 milliseconds.
            </p>
          </div>

          <div className="bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <ShieldAlert className="w-4 h-4 text-error" />
              3. Collision Intervention Protocol
            </h3>
            <p>
              When an obstacle is detected within 200 meters of the locomotive center, the HUD raises a <strong className="text-red-400">CRITICAL DANGER</strong> alarm. If the operator fails to engage the air brakes within 2.5 seconds of alert initiation, the ETCS interlocking system will advise an immediate emergency stop (brake recommendation active).
            </p>
          </div>
        </div>

        {/* CONTROLS REFERENCE (4/12 cols) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-4 font-mono text-[10px]">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 font-headline">
              <Keyboard className="w-4 h-4 text-primary" />
              Operator Override Hotline
            </h3>

            <div className="flex flex-col gap-2">
              <div className="p-2 bg-background/45 border border-surface-container-high/40 rounded flex justify-between">
                <span>Central Dispatch Station:</span>
                <span className="text-primary font-bold">1800-NCR-RAIL</span>
              </div>
              <div className="p-2 bg-background/45 border border-surface-container-high/40 rounded flex justify-between">
                <span>Locomotive Tech Depot:</span>
                <span className="text-primary font-bold">LINE-31012-HOT</span>
              </div>
              <div className="p-2 bg-background/45 border border-surface-container-high/40 rounded flex justify-between">
                <span>Signal Interlocking Siding:</span>
                <span className="text-primary font-bold">ETCS-CH-04</span>
              </div>
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <FileText className="w-4 h-4 text-primary" />
              Technical Specifications
            </h3>
            <div className="flex flex-col gap-1.5 text-[9px] text-outline">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>RGB Camera sensor:</span>
                <span className="text-white">Sony IMX477 @ 4K</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Thermal LWIR core:</span>
                <span className="text-white">FLIR Boson 640 @ LWIR</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>3D LiDAR sweep:</span>
                <span className="text-white">Ouster OS1-64 (64 channel)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Interlocking loop:</span>
                <span className="text-white">ETCS Level 2 / LTE-R</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
