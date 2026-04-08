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

  // Poll for real detection data from the backend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && systemActive) {
      interval = setInterval(async () => {
        try {
          const data = await fetchDetection();
          if (data) {
            setDetection({
              id: Math.random().toString(36).substring(2, 9),
              object: data.object,
              distance: data.distance,
              confidence: data.confidence,
              timestamp: new Date().toLocaleTimeString()
            });
          } else {
            setDetection(null);
          }
        } catch (err) {
          console.error("Failed to fetch detection:", err);
          setDetection(null);
        }

        // Simulating speed fluctuation (optional, could be from API too)
        setSpeed(prev => {
          const mod = Math.random() > 0.5 ? 1 : -1;
          const newSpeed = prev + (Math.random() * 2 * mod);
          return Math.min(Math.max(newSpeed, 65), 85);
        });
      }, 500); // Poll every 500ms
    }
    return () => clearInterval(interval);
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


