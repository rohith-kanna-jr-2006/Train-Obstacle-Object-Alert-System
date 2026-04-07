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
    <div className="h-screen flex flex-col bg-background font-body text-on-surface overflow-hidden">
      <AudioAlert status={detection && detection.distance < 300 ? "DANGER" : "SAFE"} />
      
      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar Navigation */}
        <aside className="w-24 bg-[#0D1C32] flex flex-col items-center py-4 space-y-1 z-40 border-r border-outline-variant/10">
          <div className="mb-6 flex flex-col items-center">
            <span className="font-headline font-black text-lg text-primary tracking-tighter">LOCO-8821</span>
            <span className="font-headline font-bold uppercase text-[7px] text-outline tracking-widest">ZONE: NR-DLH</span>
          </div>
          <nav className="flex-1 w-full flex flex-col">
            {[
              { icon: 'analytics', label: 'Diagnostics' },
              { icon: 'cloud', label: 'Weather', active: true },
              { icon: 'visibility', label: 'Track View' },
              { icon: 'thermostat', label: 'Thermal' },
              { icon: 'router', label: 'Network' }
            ].map((nav) => (
              <div key={nav.label} className={`py-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${nav.active ? 'bg-[#1C2A41] text-primary border-l-4 border-primary w-full' : 'text-outline hover:bg-[#1C2A41] hover:text-on-surface'}`}>
                <span className="material-symbols-outlined mb-1 text-xl">{nav.icon}</span>
                <span className="font-headline font-black uppercase text-[8px] tracking-tighter">{nav.label}</span>
              </div>
            ))}
          </nav>
          <div className="mt-auto w-full flex flex-col items-center gap-4 py-4">
            <button 
                onClick={() => setIsActive(false)}
                className="bg-error-container text-on-error-container font-headline font-black text-[9px] py-4 px-1 w-11/12 leading-tight text-center hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-error/10"
            >
                EXIT SYSTEM
            </button>
          </div>
        </aside>

        {/* Main Interface Content */}
        <main className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden bg-background">
          {/* Left Column: Systems & Weather */}
          <SystemStatus />

          {/* Center Column: Video Feed */}
          <section className="col-span-6 flex flex-col overflow-hidden">
            <VideoFeed detections={detection ? [detection] : []} />
          </section>

          {/* Right Column: Alerts */}
          <section className="col-span-3 h-full overflow-hidden">
            <AlertPanel detection={detection} />
          </section>
        </main>
      </div>

      <ControlPanel />
    </div>
  );
}


