"use client";

import React from "react";
import { Sliders, Camera, ZoomIn, Eye, Aperture, Video, Crop, Sparkles, RefreshCw } from "lucide-react";
import VideoFeed from "@/components/VideoFeed";
import { useCameraStore } from "@/store/cameraStore";

const resolutionsList = [
  "3840x2160 @ 30 FPS (4K UHD)",
  "1920x1080 @ 60 FPS (FHD)",
  "1280x720 @ 90 FPS (HD)",
];

export default function CameraPage() {
  const {
    zoom,
    brightness,
    contrast,
    exposure,
    resolution,
    showBoundingBoxes,
    showDistanceLabels,
    setZoom,
    setBrightness,
    setContrast,
    setExposure,
    setResolution,
    toggleBoundingBoxes,
    toggleDistanceLabels,
    resetCameraSettings,
  } = useCameraStore();

  const handleCapture = () => {
    // Simulated frame snapshot capture
    alert("CAMERA SNAPSHOT: High-definition RAW frame saved successfully to AGX disk store.");
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* HEADER TITLE */}
      <div className="bg-surface-container-lowest/60 border border-surface-container-high p-3 rounded-xl backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black font-headline tracking-widest text-[#ffffff] uppercase">
              HD RGB Vision Control
            </h2>
            <p className="text-[10px] text-outline font-mono">
              SENSOR ID: Sony IMX477 Starvis (RGB Catenary-Aligned)
            </p>
          </div>
        </div>
        <button
          onClick={resetCameraSettings}
          className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high border border-outline/20 hover:bg-surface-bright rounded text-[10px] font-mono font-bold text-white transition-all active:scale-[0.98]"
        >
          <RefreshCw className="w-3 h-3" />
          RESET CALIBRATION
        </button>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1">
        {/* LARGE CAMERA PORT VIEWPORT (8/12 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col h-[480px]">
          <VideoFeed />
        </div>

        {/* SETTINGS AND CALIBRATION CONTROL PANEL (4/12 cols) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low/60 border border-surface-container-high p-4 rounded-xl backdrop-blur flex flex-col gap-4 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-headline">
              <Sliders className="w-4 h-4 text-primary" />
              Camera Telemetry Adjustments
            </h3>

            {/* SLIDERS */}
            <div className="flex flex-col gap-4 font-mono text-[10px]">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-outline">Zoom Calibration: {zoom.toFixed(1)}x</span>
                  <span className="text-[#ffffff] font-bold">Max 4.0x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.5"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-outline">Sensor Brightness: {brightness}%</span>
                  <span className="text-[#ffffff] font-bold">50% Def</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-outline">Dynamic Contrast: {contrast}%</span>
                  <span className="text-[#ffffff] font-bold">50% Def</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-outline">Exposure Bias: {exposure > 0 ? `+${exposure}` : exposure} eV</span>
                  <span className="text-[#ffffff] font-bold">±3 eV</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="1"
                  value={exposure}
                  onChange={(e) => setExposure(parseInt(e.target.value))}
                  className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          {/* OVERLAY SWITCHES */}
          <div>
            <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-headline">
              <Eye className="w-4 h-4 text-primary" />
              HUD Overlay Parameters
            </h3>

            <div className="flex flex-col gap-2.5 font-mono text-[10px]">
              <div className="flex items-center justify-between p-2 bg-background/40 border border-surface-container-high/40 rounded-lg">
                <div>
                  <p className="text-white font-bold">AI Bounding Boxes</p>
                  <span className="text-outline text-[9px]">Highlights tracked targets on track</span>
                </div>
                <button
                  onClick={toggleBoundingBoxes}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${showBoundingBoxes ? "bg-primary" : "bg-surface-container-high"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-background transition-transform ${showBoundingBoxes ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-2 bg-background/40 border border-surface-container-high/40 rounded-lg">
                <div>
                  <p className="text-white font-bold">Distance Labels</p>
                  <span className="text-outline text-[9px]">Shows spatial depth in meters</span>
                </div>
                <button
                  onClick={toggleDistanceLabels}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${showDistanceLabels ? "bg-primary" : "bg-surface-container-high"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-background transition-transform ${showDistanceLabels ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>

          <hr className="border-surface-container-high/40" />

          {/* RESOLUTION SELECT */}
          <div>
            <label className="text-[10px] font-mono font-bold text-outline uppercase tracking-wider mb-2 block">
              STREAM OUTPUT CONFIGURATION
            </label>
            <div className="flex flex-col gap-1.5 font-mono">
              {resolutionsList.map((res) => (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  className={`w-full text-left p-2 rounded border text-[10px] transition-all ${
                    resolution === res
                      ? "bg-primary-container/40 border-primary text-primary font-bold"
                      : "bg-background/40 border-surface-container-high/50 text-outline hover:border-outline hover:text-white"
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* EXTRA ACTIONS */}
          <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={handleCapture}
              className="py-2.5 bg-surface-container-high hover:bg-surface-bright text-white text-[10px] font-mono font-bold rounded-lg border border-outline/25 transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
            >
              <Crop className="w-3.5 h-3.5" />
              SNAP IMAGE
            </button>
            <button
              onClick={handleCapture}
              className="py-2.5 bg-[#004e11]/30 hover:bg-[#004e11]/50 text-tertiary text-[10px] font-mono font-bold rounded-lg border border-tertiary/30 transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              RUN CALIBRATE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
