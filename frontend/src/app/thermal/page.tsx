"use client";

import { Flame, Sliders, Layers, RefreshCw, Eye, ShieldAlert, Cpu } from "lucide-react";
import ThermalFeed from "@/components/ThermalFeed";
import { useCameraStore } from "@/store/cameraStore";

const palettes = [
  { id: "ironbow", name: "Ironbow (Standard)", colors: "bg-gradient-to-r from-blue-900 via-purple-700 via-red-500 to-yellow-300" },
  { id: "rainbow", name: "Rainbow Spectrum", colors: "bg-gradient-to-r from-blue-500 via-green-400 via-yellow-400 to-red-500" },
  { id: "grayscale", name: "Grayscale (Hot White)", colors: "bg-gradient-to-r from-black to-white" },
  { id: "hot-metal", name: "Hot Metal (Friction)", colors: "bg-gradient-to-r from-black via-red-700 via-orange-500 to-yellow-200" },
];

export default function ThermalPage() {
  const {
    thermalPalette,
    thermalFusion,
    fusionOpacity,
    setThermalPalette,
    toggleThermalFusion,
    setFusionOpacity,
  } = useCameraStore();

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#ffb4ab]" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              Long-Wave Infrared (LWIR) Thermal Stream
            </h2>
            <p className="text-[10px] text-outline font-mono">
              SENSOR ID: FLIR Boson 640 (Dynamic Thermal Profiler)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1">
        {/* LWIR THERMAL SCREEN PORT (8/12 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col h-[480px]">
          <ThermalFeed />
        </div>

        {/* SETTINGS AND HEAT TARGETS (4/12 cols) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-4 overflow-y-auto">
          {/* PALETTES */}
          <div>
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-headline">
              <Sliders className="w-4 h-4 text-primary" />
              Thermal Palette Profiles
            </h3>

            <div className="flex flex-col gap-2 font-mono text-[10px]">
              {palettes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setThermalPalette(p.id as any)}
                  className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    thermalPalette === p.id
                      ? "bg-primary-container/40 border-primary text-primary font-bold shadow-[0_0_10px_rgba(11,61,145,0.2)]"
                      : "bg-background/40 border-surface-container-high/50 text-outline hover:border-outline hover:text-white"
                  }`}
                >
                  <span>{p.name}</span>
                  <div className={`w-16 h-2 rounded overflow-hidden ${p.colors}`} />
                </button>
              ))}
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          {/* FUSION OVERLAYS */}
          <div>
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-headline">
              <Layers className="w-4 h-4 text-primary" />
              Thermal Fusion Calibration
            </h3>

            <div className="flex flex-col gap-3 font-mono text-[10px]">
              <div className="flex items-center justify-between p-2.5 bg-background/40 border border-surface-container-high/40 rounded-lg">
                <div>
                  <p className="text-white font-bold">RGB/IR Fusion Overlay</p>
                  <span className="text-outline text-[9px]">Combines RGB outline onto LWIR stream</span>
                </div>
                <button
                  onClick={toggleThermalFusion}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${thermalFusion ? "bg-primary" : "bg-surface-container-high"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-background transition-transform ${thermalFusion ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {thermalFusion && (
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-outline">Fusion Opacity: {Math.floor(fusionOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={fusionOpacity}
                    onChange={(e) => setFusionOpacity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              )}
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          {/* MOCK DETECTED HEAT SIGNATURES */}
          <div className="flex-1 flex flex-col min-h-[160px]">
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-headline">
              <Eye className="w-4 h-4 text-primary" />
              Thermal Anomalies Detected
            </h3>

            <div className="flex flex-col gap-2 font-mono text-[9px] flex-1">
              <div className="p-2.5 rounded-lg border border-yellow-500/30 bg-yellow-950/10 flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 font-bold">ANOMALY_01 (HUMAN_SIG)</p>
                  <span className="text-outline">EST. TEMP: 37.4°C | DISTANCE: 180m</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/20">
                  HIGH SIGNATURE
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-surface-container-high bg-surface-container-lowest/60 flex items-center justify-between">
                <div>
                  <p className="text-[#a3b5db] font-bold font-mono">ANOMALY_02 (ANIMAL_SIG)</p>
                  <span className="text-outline">EST. TEMP: 39.1°C | DISTANCE: 380m</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-outline font-bold border border-outline/10">
                  MONITORING
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
