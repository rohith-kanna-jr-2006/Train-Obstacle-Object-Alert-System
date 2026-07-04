"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, RefreshCw, ZoomIn, ZoomOut, Play, Square, Video } from "lucide-react";
import { useCameraStore } from "@/store/cameraStore";
import { useAlertStore } from "@/store/alertStore";
import { useGPSStore } from "@/store/gpsStore";

export default function VideoFeed() {
  const {
    zoom,
    brightness,
    contrast,
    exposure,
    resolution,
    isRecording,
    showBoundingBoxes,
    showDistanceLabels,
    thermalFusion,
    fusionOpacity,
    setZoom,
    toggleRecording,
  } = useCameraStore();

  const { alerts } = useAlertStore();
  const { gpsData } = useGPSStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamActive, setStreamActive] = useState(true);

  // Get active danger detection
  const activeDetection = alerts.find(
    (a) => !a.dismissed && (a.source === "AI_VISION" || a.source === "THERMAL" || a.source === "LIDAR") && a.level === "DANGER"
  );
  
  const activeWarning = alerts.find(
    (a) => !a.dismissed && (a.source === "AI_VISION" || a.source === "THERMAL" || a.source === "LIDAR") && a.level === "WARNING"
  );

  const obstacle = activeDetection || activeWarning;

  // Simulator loop: Draws a high-tech moving railway track entering fog
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const centerY = h / 2 + 30;

      // 1. Draw Background Sky & Ground
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, "#010816");
      skyGrad.addColorStop(0.5, "#041329");
      skyGrad.addColorStop(1, "#0a2246");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Draw Fog / Atmospheric haze
      const fogGrad = ctx.createRadialGradient(w / 2, centerY - 40, 10, w / 2, centerY - 40, w / 2);
      fogGrad.addColorStop(0, "rgba(100, 120, 150, 0.75)"); // Dense fog center
      fogGrad.addColorStop(0.2, "rgba(80, 100, 120, 0.45)");
      fogGrad.addColorStop(0.6, "rgba(10, 30, 60, 0.1)");
      fogGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, 0, w, h);

      // 3. Draw Moving Railway Tracks
      offset = (offset + gpsData.speed * 0.15) % 40;
      ctx.strokeStyle = "#8dadff";
      ctx.lineWidth = 2;

      // Left Rail
      ctx.beginPath();
      ctx.moveTo(w / 2 - 15, centerY - 30);
      ctx.lineTo(w / 2 - 250, h);
      ctx.stroke();

      // Right Rail
      ctx.beginPath();
      ctx.moveTo(w / 2 + 15, centerY - 30);
      ctx.lineTo(w / 2 + 250, h);
      ctx.stroke();

      // Draw Rail Sleepers (Horizontal bars)
      ctx.strokeStyle = "rgba(177, 197, 255, 0.3)";
      for (let y = centerY - 30; y < h; y += 12) {
        // Project sleep positions based on depth
        const progress = (y - (centerY - 30)) / (h - (centerY - 30));
        const currentOffset = (progress * 150 + offset) % 40;
        const adjustedY = y + currentOffset * progress;
        
        if (adjustedY > h) continue;

        const sleeperWidth = 30 + progress * 440;
        const sleeperLeft = w / 2 - sleeperWidth / 2;
        const sleeperRight = w / 2 + sleeperWidth / 2;

        ctx.lineWidth = 1 + progress * 4;
        ctx.beginPath();
        ctx.moveTo(sleeperLeft, adjustedY);
        ctx.lineTo(sleeperRight, adjustedY);
        ctx.stroke();
      }

      // 4. Draw overhead catenary cables (Wire lines)
      ctx.strokeStyle = "rgba(141, 173, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 5, centerY - 60);
      ctx.lineTo(w / 2 - 180, 0);
      ctx.moveTo(w / 2 + 5, centerY - 60);
      ctx.lineTo(w / 2 + 180, 0);
      ctx.stroke();

      // Overhead wire support poles (passing by)
      const poleInterval = 120;
      const poleOffset = (offset * 3) % poleInterval;
      for (let i = 0; i < 4; i++) {
        const xPos = w / 2 - 120 - i * poleInterval - poleOffset;
        if (xPos > 0) {
          ctx.strokeStyle = "rgba(177, 197, 255, 0.25)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(xPos, centerY - 80);
          ctx.lineTo(xPos, centerY + 100);
          ctx.stroke();
        }
      }

      // 5. Draw Obstacle (if simulated by alert store)
      if (obstacle) {
        const threatLevel = obstacle.level;
        // Map distance to visual scale & Y position
        const testDistance = threatLevel === "DANGER" ? 180 : 380; // meters
        const scale = Math.max(0.1, 1 - (testDistance / 600)); // larger as distance decreases
        
        const obstacleW = 80 * scale;
        const obstacleH = 60 * scale;
        const obsX = w / 2 - obstacleW / 2;
        const obsY = centerY - 15 + (h - centerY) * scale * 0.7;

        // Draw obstacle drawing (simulated car/cow)
        ctx.fillStyle = threatLevel === "DANGER" ? "rgba(220, 38, 38, 0.45)" : "rgba(234, 179, 8, 0.35)";
        ctx.fillRect(obsX, obsY, obstacleW, obstacleH);
        
        ctx.strokeStyle = threatLevel === "DANGER" ? "#ef4444" : "#eab308";
        ctx.lineWidth = 2;
        ctx.strokeRect(obsX, obsY, obstacleW, obstacleH);

        // Draw Bounding Box (YOLO AI style)
        if (showBoundingBoxes) {
          ctx.strokeStyle = threatLevel === "DANGER" ? "#ef4444" : "#eab308";
          ctx.lineWidth = 2.5;

          // Corner bracket style
          const cornerLen = Math.min(15, obstacleW / 3);
          
          // Top Left
          ctx.beginPath(); ctx.moveTo(obsX, obsY + cornerLen); ctx.lineTo(obsX, obsY); ctx.lineTo(obsX + cornerLen, obsY); ctx.stroke();
          // Top Right
          ctx.beginPath(); ctx.moveTo(obsX + obstacleW, obsY + cornerLen); ctx.lineTo(obsX + obstacleW, obsY); ctx.lineTo(obsX + obstacleW - cornerLen, obsY); ctx.stroke();
          // Bottom Left
          ctx.beginPath(); ctx.moveTo(obsX, obsY + obstacleH - cornerLen); ctx.lineTo(obsX, obsY + obstacleH); ctx.lineTo(obsX + cornerLen, obsY + obstacleH); ctx.stroke();
          // Bottom Right
          ctx.beginPath(); ctx.moveTo(obsX + obstacleW, obsY + obstacleH - cornerLen); ctx.lineTo(obsX + obstacleW, obsY + obstacleH); ctx.lineTo(obsX + obstacleW - cornerLen, obsY + obstacleH); ctx.stroke();

          // Label
          const labelText = `${threatLevel === "DANGER" ? "ROCKSLIDE" : "MAINTENANCE_VEHICLE"} [${(0.85 + Math.random() * 0.1).toFixed(2)}]`;
          ctx.fillStyle = threatLevel === "DANGER" ? "#ef4444" : "#eab308";
          ctx.font = "bold 9px monospace";
          const labelWidth = ctx.measureText(labelText).width;
          ctx.fillRect(obsX - 1, obsY - 14, labelWidth + 6, 14);
          ctx.fillStyle = "#ffffff";
          ctx.fillText(labelText, obsX + 2, obsY - 4);

          // Distance Label
          if (showDistanceLabels) {
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 10px monospace";
            ctx.shadowColor = "#000000";
            ctx.shadowBlur = 4;
            ctx.fillText(`RANGE: ${testDistance}m`, obsX + 2, obsY + obstacleH - 6);
            ctx.shadowBlur = 0; // reset
          }
        }
      }

      // 6. Thermal Overlay Blending
      if (thermalFusion) {
        ctx.fillStyle = `rgba(235, 94, 40, ${fusionOpacity * 0.5})`;
        ctx.fillRect(0, 0, w, h);

        // Draw hot signature on rails and overhead poles
        const grad = ctx.createLinearGradient(0, centerY, 0, h);
        grad.addColorStop(0, "rgba(0,0,100,0)");
        grad.addColorStop(0.5, "rgba(220,10,220,0.2)");
        grad.addColorStop(1, "rgba(255,100,0,0.4)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, centerY, w, h - centerY);
      }

      // 7. Tactical Reticle / Crosshair overlays
      ctx.strokeStyle = "rgba(177, 197, 255, 0.15)";
      ctx.lineWidth = 1;
      
      // Horizontal crosshair lines
      ctx.beginPath(); ctx.moveTo(20, centerY); ctx.lineTo(w / 2 - 40, centerY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w / 2 + 40, centerY); ctx.lineTo(w - 20, centerY); ctx.stroke();
      
      // Vertical crosshair lines
      ctx.beginPath(); ctx.moveTo(w / 2, 20); ctx.lineTo(w / 2, centerY - 40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w / 2, centerY + 40); ctx.lineTo(w, centerY + 100); // offset/dummy

      // Center crosshair ring
      ctx.strokeStyle = "rgba(177, 197, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(w / 2, centerY, 15, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gpsData.speed, obstacle, showBoundingBoxes, showDistanceLabels, thermalFusion, fusionOpacity]);

  return (
    <div className="w-full h-full flex flex-col bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden relative shadow-[0_4px_25px_rgba(0,0,0,0.5)] group">
      {/* HEADER / ACTIONS CONTROLLER */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-background/80 border border-surface-container-high/60 backdrop-blur px-2.5 py-1 rounded text-[10px] font-mono text-primary font-bold">
          <Camera className="w-3.5 h-3.5 text-primary" />
          <span>PRIMARY RGB FEED [CALIBRATED]</span>
        </div>

        <div className="flex gap-1.5 pointer-events-auto">
          {/* Zoom Buttons */}
          <button
            onClick={() => setZoom(Math.min(zoom + 0.5, 4.0))}
            className="p-1.5 bg-background/80 border border-surface-container-high/60 hover:bg-surface-container-high backdrop-blur rounded text-outline hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 0.5, 1.0))}
            className="p-1.5 bg-background/80 border border-surface-container-high/60 hover:bg-surface-container-high backdrop-blur rounded text-outline hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Record Button */}
          <button
            onClick={toggleRecording}
            className={`p-1.5 border backdrop-blur rounded flex items-center gap-1 text-[10px] font-mono transition-colors ${
              isRecording
                ? "bg-red-950/80 border-red-500 text-red-400 hover:bg-red-900/60"
                : "bg-background/80 border-surface-container-high/60 text-outline hover:text-white hover:bg-surface-container-high"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-red-500 ${isRecording ? "animate-ping" : ""}`} />
            <span>{isRecording ? "REC" : "RECORD"}</span>
          </button>
        </div>
      </div>

      {/* VIDEO CANVAS CONTAINER */}
      <div className="flex-1 w-full h-full overflow-hidden bg-black relative">
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            transform: `scale(${zoom})`,
            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(90%)`,
          }}
        />

        {/* SCANLINE EFFECT */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(18,16,16,0)_95%,rgba(177,197,255,0.08)_95%)] bg-[length:100%_20px] pointer-events-none animate-scan" />
        
        {/* CORNER TECH DESIGN MARKERS */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-primary/40 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-primary/40 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-primary/40 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-primary/40 pointer-events-none" />
      </div>

      {/* METADATA FOOTER OVERLAY */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end pointer-events-none z-20">
        <div className="flex flex-col gap-0.5 bg-background/80 border border-surface-container-high/60 backdrop-blur p-2 rounded font-mono text-[9px] text-[#a3b5db]">
          <div className="flex gap-2">
            <span>RES: {resolution}</span>
            <span>ZOOM: {zoom.toFixed(1)}x</span>
          </div>
          <div className="flex gap-2">
            <span>ISO: 400</span>
            <span>EXPOSURE: {exposure > 0 ? `+${exposure}` : exposure}</span>
          </div>
        </div>

        <div className="text-right">
          <p className="bg-background/80 border border-surface-container-high/60 backdrop-blur px-2.5 py-1 rounded text-2xl font-headline font-black text-primary tracking-tighter italic leading-none">
            {Math.floor(gpsData.speed)} <span className="text-[10px] not-italic opacity-50">KM/H</span>
          </p>
        </div>
      </div>
    </div>
  );
}
