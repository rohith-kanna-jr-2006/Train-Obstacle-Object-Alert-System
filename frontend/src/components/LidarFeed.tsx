"use client";

import React, { useEffect, useRef, useState } from "react";
import { Radar, ZoomIn, ZoomOut, Layers } from "lucide-react";
import { useCameraStore } from "@/store/cameraStore";
import { useAlertStore } from "@/store/alertStore";
import { useGPSStore } from "@/store/gpsStore";

export default function LidarFeed() {
  const { alerts } = useAlertStore();
  const { gpsData } = useGPSStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<"top-down" | "perspective">("perspective");
  const [range, setRange] = useState(200); // meters

  // Check active obstacle
  const activeDanger = alerts.find((a) => !a.dismissed && a.level === "DANGER");
  const activeWarning = alerts.find((a) => !a.dismissed && a.level === "WARNING");
  const threat = activeDanger || activeWarning;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0; // for radar sweep rotation
    let time = 0;

    // Generate random static background point cloud
    const points: { x: number; y: number; z: number; intensity: number }[] = [];
    // Railway track points
    for (let z = 10; z < 300; z += 5) {
      // Left rail points
      points.push({ x: -2, y: -1, z, intensity: 0.8 });
      // Right rail points
      points.push({ x: 2, y: -1, z, intensity: 0.8 });
      // Sleepers
      points.push({ x: 0, y: -1, z, intensity: 0.5 });
      // Overhead lines
      points.push({ x: -4, y: 4, z, intensity: 0.4 });
      points.push({ x: 4, y: 4, z, intensity: 0.4 });
    }
    // Surrounding tunnel/scenery points
    for (let i = 0; i < 200; i++) {
      const z = Math.random() * 280 + 10;
      const theta = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 8;
      points.push({
        x: Math.cos(theta) * radius,
        y: Math.sin(theta) * radius,
        z,
        intensity: 0.3,
      });
    }

    const drawLidar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      
      angle = (angle + 0.02) % (Math.PI * 2);
      time += 0.05;

      // 1. Draw Grid Base Background
      ctx.fillStyle = "#010e24";
      ctx.fillRect(0, 0, w, h);

      if (viewMode === "perspective") {
        // Perspective 3D Point Cloud View
        const cx = w / 2;
        const cy = h / 2 + 20;
        const fov = 150; // Focal length

        // Draw distance rings in 3D
        ctx.strokeStyle = "rgba(13, 173, 255, 0.15)";
        ctx.lineWidth = 1;
        [50, 100, 150, 200].forEach((d) => {
          if (d > range) return;
          ctx.beginPath();
          // Draw horizontal circle in 3D
          for (let a = 0; a <= Math.PI * 2; a += 0.1) {
            const px = Math.cos(a) * 8;
            const py = -1; // floor
            const pz = d;
            
            const screenX = cx + (px * fov) / pz;
            const screenY = cy + (py * fov) / pz;
            if (a === 0) ctx.moveTo(screenX, screenY);
            else ctx.lineTo(screenX, screenY);
          }
          ctx.closePath();
          ctx.stroke();

          // Label
          const labelY = cy + (-1 * fov) / d;
          ctx.fillStyle = "rgba(13, 173, 255, 0.4)";
          ctx.font = "7px monospace";
          ctx.fillText(`${d}m`, cx - 12, labelY - 2);
        });

        // Render point cloud
        points.forEach((p) => {
          // Add motion to rail corridor points
          let pz = p.z - (gpsData.speed * 0.15 * time) % 10;
          if (pz < 5) pz += 290; // loop back

          if (pz > range) return;

          // Projection
          const scale = fov / pz;
          const sx = cx + p.x * scale;
          const sy = cy - p.y * scale;

          if (sx < 0 || sx > w || sy < 0 || sy > h) return;

          // Color by distance
          const distPct = pz / range;
          const alpha = 1 - distPct;
          
          let color = `rgba(131, 219, 126, ${alpha * p.intensity})`; // green default
          if (pz < 80) color = `rgba(239, 68, 68, ${alpha})`; // red (close)
          else if (pz < 150) color = `rgba(234, 179, 8, ${alpha})`; // orange (warning)

          ctx.fillStyle = color;
          ctx.fillRect(sx, sy, Math.max(1, scale * 0.6), Math.max(1, scale * 0.6));
        });

        // Draw Obstacle 3D Bounding Box
        if (threat) {
          const isDanger = threat.level === "DANGER";
          const obsZ = isDanger ? 120 - (gpsData.speed * 0.05 * time) % 5 : 220 - (gpsData.speed * 0.05 * time) % 5;
          
          if (obsZ <= range && obsZ > 5) {
            const scale = fov / obsZ;
            const ox = cx + 0 * scale; // center on rails
            const oy = cy - (-0.5) * scale;
            const obW = 3 * scale;
            const obH = 2 * scale;

            // Draw bounding box
            ctx.strokeStyle = isDanger ? "#ef4444" : "#eab308";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(ox - obW / 2, oy - obH, obW, obH);
            
            // Draw connector points inside
            ctx.fillStyle = isDanger ? "rgba(239, 68, 68, 0.8)" : "rgba(234, 179, 8, 0.8)";
            for (let i = 0; i < 15; i++) {
              const rx = ox - obW / 2 + Math.random() * obW;
              const ry = oy - Math.random() * obH;
              ctx.fillRect(rx, ry, 2, 2);
            }

            // Depth stats
            ctx.fillStyle = "#ffffff";
            ctx.font = "8px monospace";
            ctx.fillText(`Z: ${obsZ.toFixed(1)}m`, ox - obW / 2, oy - obH - 12);
            ctx.fillText(`V_REL: ${(gpsData.speed * 0.28).toFixed(1)}m/s`, ox - obW / 2, oy - obH - 4);
          }
        }
      } else {
        // Top-Down Sector View
        const cx = w / 2;
        const cy = h - 20;
        const maxRadius = h - 40;

        // Draw Sector Rings
        ctx.strokeStyle = "rgba(13, 173, 255, 0.15)";
        ctx.lineWidth = 1;
        [50, 100, 150, 200].forEach((d) => {
          if (d > range) return;
          const r = (d / range) * maxRadius;
          ctx.beginPath();
          ctx.arc(cx, cy, r, Math.PI, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "rgba(13, 173, 255, 0.4)";
          ctx.font = "7px monospace";
          ctx.fillText(`${d}m`, cx - 20, cy - r + 8);
        });

        // Draw Angle division lines
        for (let a = -30; a <= 30; a += 15) {
          const rad = (a * Math.PI) / 180 - Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(rad) * maxRadius, cy + Math.sin(rad) * maxRadius);
          ctx.stroke();
        }

        // Render point cloud projected on flat grid
        points.forEach((p) => {
          let pz = p.z - (gpsData.speed * 0.15 * time) % 10;
          if (pz < 5) pz += 290;
          if (pz > range) return;

          const r = (pz / range) * maxRadius;
          // map x coordinate
          const theta = (p.x * 2.5 * Math.PI) / 180 - Math.PI / 2;

          const sx = cx + Math.cos(theta) * r;
          const sy = cy + Math.sin(theta) * r;

          ctx.fillStyle = `rgba(131, 219, 126, ${1 - pz / range})`;
          ctx.fillRect(sx, sy, 1.5, 1.5);
        });

        // Sweep Line
        const sweepX = cx + Math.cos(angle - Math.PI / 2) * maxRadius;
        const sweepY = cy + Math.sin(angle - Math.PI / 2) * maxRadius;
        ctx.strokeStyle = "rgba(131, 219, 126, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sweepX, sweepY);
        ctx.stroke();

        // Threat Marker
        if (threat) {
          const isDanger = threat.level === "DANGER";
          const obsZ = isDanger ? 120 : 220;
          const r = (obsZ / range) * maxRadius;
          const sx = cx; // center
          const sy = cy - r;

          ctx.fillStyle = isDanger ? "#ef4444" : "#eab308";
          ctx.beginPath();
          ctx.arc(sx, sy, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sx, sy, 8, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillText(`ALERT: ${obsZ}m`, sx + 10, sy + 3);
        }
      }

      // Draw Reticle Outline
      ctx.strokeStyle = "rgba(177, 197, 255, 0.1)";
      ctx.strokeRect(0, 0, w, h);

      animId = requestAnimationFrame(drawLidar);
    };

    drawLidar();

    return () => cancelAnimationFrame(animId);
  }, [viewMode, range, threat, gpsData.speed]);

  return (
    <div className="w-full h-full bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden flex flex-col relative shadow-[0_4px_25px_rgba(0,0,0,0.5)] group">
      {/* HEADER */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-background/80 border border-surface-container-high/60 backdrop-blur px-2.5 py-1 rounded text-[10px] font-mono text-[#a3b5db] font-bold">
          <Radar className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span>LIDAR 3D POINT CLOUD</span>
        </div>

        <div className="flex gap-1.5 pointer-events-auto">
          {/* View Modes */}
          <button
            onClick={() => setViewMode(viewMode === "perspective" ? "top-down" : "perspective")}
            className="px-2 py-0.5 bg-background/80 border border-surface-container-high/60 hover:bg-surface-container-high backdrop-blur rounded text-[9px] font-mono text-outline hover:text-white transition-all flex items-center gap-1"
          >
            <Layers className="w-3 h-3" />
            <span>{viewMode === "perspective" ? "3D CONES" : "TOP-DOWN"}</span>
          </button>
          
          {/* Ranges */}
          <button
            onClick={() => setRange(range === 200 ? 100 : 200)}
            className="px-2 py-0.5 bg-background/80 border border-surface-container-high/60 hover:bg-surface-container-high backdrop-blur rounded text-[9px] font-mono text-outline hover:text-white transition-all"
          >
            <span>R: {range}m</span>
          </button>
        </div>
      </div>

      {/* CANVAS */}
      <div className="flex-1 w-full h-full relative bg-black">
        <canvas ref={canvasRef} width={480} height={270} className="w-full h-full object-cover" />
      </div>

      {/* TELEMETRY FOOTER */}
      <div className="absolute bottom-2 left-2 flex gap-4 bg-background/85 border border-surface-container-high/60 backdrop-blur p-2 rounded font-mono text-[9px] text-[#a3b5db] pointer-events-none">
        <span>SENSORS: Ouster OS1-64</span>
        <span>RATE: 20 Hz</span>
        <span>GEOMETRY: NORMAL</span>
      </div>
    </div>
  );
}
