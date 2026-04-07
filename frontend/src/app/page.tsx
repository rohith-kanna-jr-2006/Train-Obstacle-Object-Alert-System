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

interface Detection {
  id: string;
  object: string;
  distance: number;
  confidence: number;
  timestamp: string;
}

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [detection, setDetection] = useState<Detection | null>(null);
  const [startupProgress, setStartupProgress] = useState(0);

  // Simulation logic...
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        const hasDetection = Math.random() > 0.7;
        if (hasDetection) {
          setDetection({
            id: Math.random().toString(36).substr(2, 9),
            object: "Animal",
            distance: Math.floor(Math.random() * 500),
            confidence: 0.85 + (Math.random() * 0.1),
            timestamp: new Date().toLocaleTimeString()
          });
        } else {
          setDetection(null);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

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

  if (!isActive) {
    return <SetupScreen startupProgress={startupProgress} onStart={handleStart} />;
  }

  return (
    <div className="h-screen bg-[#041329] text-[#d6e3ff] font-body overflow-hidden flex flex-col">
      <AudioAlert status={(detection && detection.distance < 300) ? "DANGER" : "SAFE"} />
      
      <Header />

      <main className="flex-1 grid grid-cols-12 gap-1 p-1 overflow-hidden">
        {/* Left Panel: Systems & Telemetry (3 Cols) */}
        <SystemStatus />

        {/* Center Panel: Live Feed (6 Cols) - VideoFeed component */}
        <VideoFeed detections={detection ? [detection] : []} />

        {/* Right Panel: Alert System (3 Cols) - AlertPanel component */}
        <AlertPanel detection={detection} />
      </main>

      <ControlPanel />
    </div>
  );
}


