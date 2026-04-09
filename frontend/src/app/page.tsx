"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Import custom components
import VideoFeed from "@/components/VideoFeed";
import AlertPanel from "@/components/AlertPanel";
import AudioAlert from "@/components/AudioAlert";
import Header from "@/components/Header";
import SystemStatus from "@/components/SystemStatus";
import ControlPanel from "@/components/ControlPanel";
import SetupScreen from "@/components/SetupScreen";
import ActivityLog from "@/components/ActivityLog";

import { fetchDetection } from "@/services/api";

interface Detection {
  id: string;
  object: string;
  distance: number;
  confidence: number;
  timestamp: string;
}

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [systemActive, setSystemActive] = useState(true);
  const [detection, setDetection] = useState<Detection | null>(null);
  const [startupProgress, setStartupProgress] = useState(0);
  const [speed, setSpeed] = useState(72);

  // Real-time detection via WebSockets
  useEffect(() => {
    if (!isActive || !systemActive) return;

    let socket: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const wsUrl = apiHost.replace("http", "ws") + "/ws";
      
      console.log("Connecting to WebSocket:", wsUrl);
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("Connected to detection stream");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.detections && data.detections.length > 0) {
            // Priority: show the closest detection
            const critical = data.detections.reduce((prev: any, curr: any) => 
              (curr.distance < prev.distance) ? curr : prev
            );
            
            setDetection({
              id: Math.random().toString(36).substring(2, 9),
              object: critical.object || critical.label,
              distance: critical.distance,
              confidence: critical.confidence || critical.conf,
              timestamp: new Date().toLocaleTimeString()
            });
          } else {
            setDetection(null);
          }
        } catch (err) {
          console.error("Error parsing socket message:", err);
        }
      };

      socket.onclose = () => {
        console.log("Disconnected from detection stream, retrying...");
        reconnectTimeout = setTimeout(connect, 3000);
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        socket.close();
      };
    };

    connect();

    // Speed fluctuation simulator
    const speedInterval = setInterval(() => {
      setSpeed(prev => {
        const mod = Math.random() > 0.5 ? 1 : -1;
        const newSpeed = prev + (Math.random() * 2 * mod);
        return Math.min(Math.max(newSpeed, 65), 85);
      });
    }, 1000);

    return () => {
      if (socket) socket.close();
      clearTimeout(reconnectTimeout);
      clearInterval(speedInterval);
    };
  }, [isActive, systemActive]);

  const handleStart = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setStartupProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsActive(true);
      }
    }, 50);
  };

  const alertLevel = (!detection || !systemActive) ? 0 : detection.distance < 150 ? 3 : detection.distance < 300 ? 2 : 1;

  if (!isActive) {
    return <SetupScreen startupProgress={startupProgress} onStart={handleStart} />;
  }

  return (
    <div className="h-screen bg-[#041329] text-[#d6e3ff] font-body overflow-hidden flex flex-col">
      <AudioAlert level={alertLevel} />
      
      <Header trainId="IR-12845" speed={Math.floor(speed)} />

      <main className="flex-1 grid grid-cols-12 gap-1 p-1 overflow-hidden">
        {/* Left Panel: Systems & Telemetry (3 Cols) */}
        <SystemStatus />

        {/* Center Panel: Live Feed (6 Cols) */}
        <VideoFeed detections={(detection && systemActive) ? [detection] : []} speed={Math.floor(speed)} />

        {/* Right Panel: Alert System (3 Cols) */}
        <AlertPanel level={alertLevel} detection={systemActive ? detection : null} />
      </main>

      <ControlPanel 
        systemActive={systemActive} 
        onStart={() => setSystemActive(true)} 
        onStop={() => setSystemActive(false)} 
      />
    </div>
  );
}


