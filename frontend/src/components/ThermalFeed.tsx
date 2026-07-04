"use client";

import React, { useEffect, useRef } from "react";
import { Flame, Settings, Sliders } from "lucide-react";
import { useCameraStore } from "@/store/cameraStore";
import { useAlertStore } from "@/store/alertStore";
import { useGPSStore } from "@/store/gpsStore";

export default function ThermalFeed() {
  const { thermalPalette, setThermalPalette } = useCameraStore();
  const { alerts } = useAlertStore();
  const { gpsData } = useGPSStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Identify active threat to sync with camera feed
  const activeDanger = alerts.find((a) => !a.dismissed && a.level === "DANGER");
  const activeWarning = alerts.find((a) => !a.dismissed && a.level === "WARNING");
  const threat = activeDanger || activeWarning;

  // Simulator for Thermal Imaging
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const drawThermal = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const centerY = h / 2 + 20;

      // Color maps for palettes
      const getPaletteColors = (val: number) => {
        // val is 0.0 to 1.0 (cold to hot)
        if (thermalPalette === "ironbow") {
          // Purple -> Red -> Orange -> Yellow -> White
          if (val < 0.2) return `rgb(${val * 200}, 0, ${50 + val * 400})`;
          if (val < 0.5) return `rgb(${100 + (val - 0.2) * 500}, 0, 150)`;
          if (val < 0.8) return `rgb(255, ${(val - 0.5) * 600}, 30)`;
          return `rgb(255, 255, ${200 + (val - 0.8) * 275})`;
        } else if (thermalPalette === "rainbow") {
          // Blue -> Cyan -> Green -> Yellow -> Red
          const hue = (1 - val) * 240; // 240 (blue) to 0 (red)
          return `hsl(${hue}, 100%, 50%)`;
        } else if (thermalPalette === "grayscale") {
          const gray = Math.floor(val * 255);
          return `rgb(${gray}, ${gray}, ${gray})`;
        } else {
          // hot-metal: Dark red -> Orange -> Gold -> White
          if (val < 0.3) return `rgb(${val * 400}, 0, 0)`;
          if (val < 0.7) return `rgb(255, ${(val - 0.3) * 500}, 0)`;
          return `rgb(255, 255, ${(val - 0.7) * 850})`;
        }
      };

      // 1. Draw cold ambient background (sky is very cold, i.e. 0.05 value)
      const backgroundVal = 0.12;
      ctx.fillStyle = getPaletteColors(backgroundVal);
      ctx.fillRect(0, 0, w, h);

      // 2. Draw ground (slightly warmer, i.e. 0.25 value)
      const groundGrad = ctx.createLinearGradient(0, centerY, 0, h);
      groundGrad.addColorStop(0, getPaletteColors(0.18));
      groundGrad.addColorStop(1, getPaletteColors(0.3));
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, centerY, w, h - centerY);

      // 3. Draw Tracks (Rails are iron, heat signature differs. Let's make them colder than ground or warmer due to friction: 0.45)
      offset = (offset + gpsData.speed * 0.1) % 40;
      ctx.strokeStyle = getPaletteColors(0.4);
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(w / 2 - 10, centerY - 15);
      ctx.lineTo(w / 2 - 180, h);
      ctx.moveTo(w / 2 + 10, centerY - 15);
      ctx.lineTo(w / 2 + 180, h);
      ctx.stroke();

      // Sleepers (warm due to soil moisture, i.e. 0.22)
      for (let y = centerY - 15; y < h; y += 12) {
        const progress = (y - (centerY - 15)) / (h - (centerY - 15));
        const currentOffset = (progress * 120 + offset) % 40;
        const adjustedY = y + currentOffset * progress;
        if (adjustedY > h) continue;

        const sleeperWidth = 20 + progress * 320;
        ctx.strokeStyle = getPaletteColors(0.24);
        ctx.lineWidth = 1 + progress * 3;
        ctx.beginPath();
        ctx.moveTo(w / 2 - sleeperWidth / 2, adjustedY);
        ctx.lineTo(w / 2 + sleeperWidth / 2, adjustedY);
        ctx.stroke();
      }

      // 4. Draw heat signatures of trees/bushes (organic matter has slight warmth: 0.35)
      ctx.fillStyle = getPaletteColors(0.32);
      ctx.beginPath();
      // Draw left foliage
      ctx.arc(40, centerY - 10, 20, 0, Math.PI * 2);
      ctx.arc(80, centerY, 30, 0, Math.PI * 2);
      // Draw right foliage
      ctx.arc(w - 40, centerY - 10, 25, 0, Math.PI * 2);
      ctx.arc(w - 80, centerY, 28, 0, Math.PI * 2);
      ctx.fill();

      // 5. Draw Obstacle (extremely high heat signature: 0.95 due to engine/living body)
      if (threat) {
        const isDanger = threat.level === "DANGER";
        const testDistance = isDanger ? 180 : 380;
        const scale = Math.max(0.1, 1 - (testDistance / 600));

        const obsW = 60 * scale;
        const obsH = 45 * scale;
        const obsX = w / 2 - obsW / 2;
        const obsY = centerY - 10 + (h - centerY) * scale * 0.7;

        // Draw hot body gradient
        const obsGrad = ctx.createRadialGradient(
          obsX + obsW / 2, obsY + obsH / 2, 5 * scale,
          obsX + obsW / 2, obsY + obsH / 2, obsW / 2
        );
        obsGrad.addColorStop(0, getPaletteColors(0.98)); // Center hot core (white)
        obsGrad.addColorStop(0.3, getPaletteColors(0.85)); // Body core (orange/yellow)
        obsGrad.addColorStop(0.8, getPaletteColors(0.65)); // Outer limits (red)
        obsGrad.addColorStop(1, getPaletteColors(0.3)); // Shadow halo

        ctx.fillStyle = obsGrad;
        ctx.fillRect(obsX, obsY, obsW, obsH);

        // Highlight box overlay
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(obsX, obsY, obsW, obsH);

        ctx.fillStyle = "#ffffff";
        ctx.font = "9px monospace";
        ctx.fillText(`HOT_SIG: ${isDanger ? "108°C" : "42°C"}`, obsX, obsY - 4);
      }

      // Draw scan cursor
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY); ctx.lineTo(w, centerY);
      ctx.stroke();

      animId = requestAnimationFrame(drawThermal);
    };

    drawThermal();

    return () => cancelAnimationFrame(animId);
  }, [thermalPalette, threat, gpsData.speed]);

  return (
    <div className="w-full h-full bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden flex flex-col relative shadow-[0_4px_25px_rgba(0,0,0,0.5)] group">
      {/* HEADER */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-background/80 border border-surface-container-high/60 backdrop-blur px-2.5 py-1 rounded text-[10px] font-mono text-[#ffb4ab] font-bold">
          <Flame className="w-3.5 h-3.5 text-[#ffb4ab] animate-pulse" />
          <span>THERMAL LWIR [FUSION READY]</span>
        </div>

        <div className="flex gap-1 pointer-events-auto">
          {(["ironbow", "rainbow", "grayscale"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setThermalPalette(p)}
              className={`px-2 py-0.5 rounded text-[9px] font-mono capitalize border transition-all ${
                thermalPalette === p
                  ? "bg-primary-container/40 border-primary text-primary"
                  : "bg-background/80 border-surface-container-high/40 text-outline hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER AND TEMPERATURE SCALE */}
      <div className="flex-1 w-full h-full flex bg-black relative">
        <canvas ref={canvasRef} width={480} height={270} className="flex-1 h-full object-cover" />

        {/* Temperature Gradient Bar (Legend) */}
        <div className="w-10 bg-background/90 border-l border-surface-container-high flex flex-col items-center justify-between py-8 px-1 text-[8px] font-mono text-outline select-none">
          <span>120°C</span>
          <div className="w-2.5 flex-1 my-2 rounded border border-white/10 overflow-hidden bg-gradient-to-t from-blue-900 via-red-600 to-yellow-300" />
          <span>-10°C</span>
        </div>

        {/* HUD grid */}
        <div className="absolute inset-0 border border-white/5 pointer-events-none" />
      </div>

      {/* TELEMETRY FOOTER */}
      <div className="absolute bottom-2 left-2 flex gap-4 bg-background/85 border border-surface-container-high/60 backdrop-blur p-2 rounded font-mono text-[9px] text-[#a3b5db] pointer-events-none">
        <span>SENSOR: FLIR Boson</span>
        <span>PALETTE: {thermalPalette.toUpperCase()}</span>
        <span>CAL: AUTO</span>
      </div>
    </div>
  );
}
