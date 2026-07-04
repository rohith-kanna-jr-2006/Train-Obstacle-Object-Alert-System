"use client";

import React, { useEffect, useRef } from "react";
import { Map, Navigation2, ShieldAlert } from "lucide-react";
import { useMapStore } from "@/store/mapStore";
import { useGPSStore } from "@/store/gpsStore";

export default function MiniMap() {
  const { stations, signals, obstacleMarkers } = useMapStore();
  const { gpsData } = useGPSStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let pulseAngle = 0;

    const drawMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      
      pulseAngle = (pulseAngle + 0.05) % (Math.PI * 2);
      const pulseSize = 6 + Math.sin(pulseAngle) * 3;

      // 1. Fill background (industrial cyber dark grid)
      ctx.fillStyle = "#010e24";
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(11, 61, 145, 0.15)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // 2. Draw Railway Track Path (Vertical path down the center-right)
      const trackX = w / 2 - 20;
      
      ctx.strokeStyle = "rgba(177, 197, 255, 0.1)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(trackX, 0);
      ctx.lineTo(trackX, h);
      ctx.stroke();

      ctx.strokeStyle = "rgba(141, 173, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(trackX - 4, 0); ctx.lineTo(trackX - 4, h);
      ctx.moveTo(trackX + 4, 0); ctx.lineTo(trackX + 4, h);
      ctx.stroke();

      // Draw switches (Track branch line looping out)
      ctx.strokeStyle = "rgba(141, 173, 255, 0.25)";
      ctx.beginPath();
      ctx.moveTo(trackX, h * 0.7);
      ctx.bezierCurveTo(trackX + 40, h * 0.55, trackX + 50, h * 0.45, trackX + 50, 0);
      ctx.stroke();

      // Switch status text
      ctx.fillStyle = "rgba(177, 197, 255, 0.4)";
      ctx.font = "8px monospace";
      ctx.fillText("SWITCH: NORMAL (LOCKED)", trackX + 15, h * 0.65);

      // 3. Draw Approaching Signals on the track
      signals.forEach((sig, idx) => {
        // Map to canvas Y coordinate
        const sigY = 50 + idx * 70;
        if (sigY > h) return;

        // Aspect color
        let color = "#10b981"; // green
        if (sig.aspect === "RED") color = "#ef4444";
        else if (sig.aspect === "YELLOW" || sig.aspect === "DOUBLE_YELLOW") color = "#f59e0b";

        // Draw signal post
        ctx.strokeStyle = "#8e909d";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(trackX - 8, sigY);
        ctx.lineTo(trackX - 18, sigY);
        ctx.lineTo(trackX - 18, sigY - 10);
        ctx.stroke();

        // Signal Aspect Light
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(trackX - 18, sigY - 10, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px monospace";
        ctx.fillText(sig.id, trackX - 45, sigY - 8);
        ctx.fillStyle = "rgba(177, 197, 255, 0.6)";
        ctx.fillText(`${sig.distance}m`, trackX - 45, sigY + 2);
      });

      // 4. Draw Approaching Station
      stations.forEach((stn, idx) => {
        const stnY = 20 + idx * 110;
        if (stnY > h) return;

        // Draw station platform marker
        ctx.fillStyle = "rgba(11, 61, 145, 0.6)";
        ctx.fillRect(trackX + 8, stnY, 12, 30);
        
        ctx.strokeStyle = "#b1c5ff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(trackX + 8, stnY, 12, 30);

        // Station name
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px monospace";
        ctx.fillText(stn.name.toUpperCase(), trackX + 25, stnY + 12);
        ctx.fillStyle = "rgba(131, 219, 126, 0.8)";
        ctx.fillText(`ETA: ${stn.eta}`, trackX + 25, stnY + 22);
      });

      // 5. Draw train coordinates / Locomotive indicator
      const trainY = h - 60;
      ctx.fillStyle = "#b1c5ff";
      ctx.beginPath();
      // Draw locomotive arrow pointing north
      ctx.moveTo(trackX, trainY - 8);
      ctx.lineTo(trackX - 6, trainY + 6);
      ctx.lineTo(trackX + 6, trainY + 6);
      ctx.closePath();
      ctx.fill();

      // Blinking locator halo
      ctx.strokeStyle = "rgba(177, 197, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(trackX, trainY, pulseSize, 0, Math.PI * 2);
      ctx.stroke();

      // Speed tag
      ctx.fillStyle = "#b1c5ff";
      ctx.font = "bold 9px monospace";
      ctx.fillText("LOCO IR-WAP7", trackX + 12, trainY + 3);

      // 6. Draw obstacle marker (if any)
      if (obstacleMarkers.length > 0 || gpsData.speed < 40) {
        // Mock a flashing alert marker on track in front of train
        const obsY = trainY - 90;
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.beginPath();
        ctx.arc(trackX, obsY, pulseSize * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(trackX, obsY, 4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 8px monospace";
        ctx.fillText("WARNING: ROAD CROSSING", trackX + 10, obsY - 8);
        ctx.fillText("OBSTACLE POINT", trackX + 10, obsY + 2);
      }

      animId = requestAnimationFrame(drawMap);
    };

    drawMap();

    return () => cancelAnimationFrame(animId);
  }, [stations, signals, obstacleMarkers, gpsData.speed]);

  return (
    <div className="w-full h-full bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden flex flex-col relative shadow-[0_4px_25px_rgba(0,0,0,0.5)] group">
      {/* HEADER */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-background/80 border border-surface-container-high/60 backdrop-blur px-2.5 py-1 rounded text-[10px] font-mono text-primary font-bold">
          <Map className="w-3.5 h-3.5 text-primary" />
          <span>MINI GIS RAIL PROFILE</span>
        </div>

        <div className="bg-background/80 border border-surface-container-high/60 backdrop-blur px-2 py-0.5 rounded text-[8px] font-mono text-outline">
          GRID: WGS84
        </div>
      </div>

      {/* CANVAS */}
      <div className="flex-1 w-full h-full relative bg-[#010e24]">
        <canvas ref={canvasRef} width={280} height={250} className="w-full h-full object-cover" />
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-background/85 border border-surface-container-high/60 backdrop-blur p-1.5 rounded font-mono text-[9px] text-[#a3b5db] pointer-events-none">
        <span>LAT: {gpsData.latitude.toFixed(5)}</span>
        <span>LNG: {gpsData.longitude.toFixed(5)}</span>
      </div>
    </div>
  );
}
