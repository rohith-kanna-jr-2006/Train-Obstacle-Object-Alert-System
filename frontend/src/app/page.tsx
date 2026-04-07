"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Import custom components
import VideoFeed from "@/components/VideoFeed";
import AlertPanel from "@/components/AlertPanel";
import AudioAlert from "@/components/AudioAlert";

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
    return (
      <main className="h-screen bg-background flex items-center justify-center font-headline overflow-hidden relative">
        <div className="absolute inset-0 scanline opacity-20"></div>
        <div className="z-10 flex flex-col items-center gap-12 max-w-4xl w-full px-12">
            <div className="text-center space-y-2">
                <p className="text-primary font-bold tracking-[0.4em] text-[10px] uppercase opacity-60 font-label">Indian Railways AI Division</p>
                <h1 className="text-7xl font-black text-primary tracking-tighter italic">RAIL-AI SENTINEL</h1>
                <p className="text-outline text-xs uppercase tracking-widest font-medium">Neural Obstacle Detection System V4.2.0-STABLE</p>
            </div>

            <div className="w-full bg-surface-container-low border border-outline-variant/30 p-8 space-y-8 relative overflow-hidden group shadow-2xl shadow-primary/5">
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-primary flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary group-hover:animate-spin-slow">terminal</span>
                            Initialize Cockpit
                        </h2>
                        <ul className="space-y-2 text-[10px] text-outline uppercase font-bold tracking-widest">
                            <li className="flex items-center gap-2">
                                <span className={`w-2 h-2 ${startupProgress > 20 ? 'bg-tertiary shadow-[0_0_8px_rgba(130,219,126,0.6)]' : 'bg-outline-variant'} rounded-full`}></span> 
                                Camera System: {startupProgress > 20 ? 'OK' : 'Standby'}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={`w-2 h-2 ${startupProgress > 50 ? 'bg-tertiary shadow-[0_0_8px_rgba(130,219,126,0.6)]' : 'bg-outline-variant'} rounded-full`}></span> 
                                AI Core Engine: {startupProgress > 50 ? 'OK' : 'Standby'}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={`w-2 h-2 ${startupProgress > 80 ? 'bg-tertiary shadow-[0_0_8px_rgba(130,219,126,0.6)]' : 'bg-outline-variant'} rounded-full`}></span> 
                                API Uplink: {startupProgress > 80 ? 'OK' : 'Standby'}
                            </li>
                        </ul>
                    </div>
                    <div className="text-right">
                        <span className="text-5xl font-black text-primary/20 tracking-tighter italic">{startupProgress}%</span>
                    </div>
                </div>

                <div className="w-full h-1 bg-surface-container-highest relative overflow-hidden">
                    <motion.div 
                        className="h-full bg-primary shadow-[0_0_15px_rgba(177,197,255,0.6)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${startupProgress}%` }}
                    />
                </div>

                {startupProgress === 0 && (
                    <button 
                        onClick={handleStart}
                        className="w-full py-4 bg-primary text-on-primary font-black uppercase text-xs tracking-widest hover:bg-white transition-all transform active:scale-[0.98] shadow-lg shadow-primary/10"
                    >
                        Begin System Check
                    </button>
                )}
            </div>
            
            <p className="text-outline text-[9px] uppercase font-bold opacity-40 italic tracking-[0.2em]">Classification: Sector-04 Restricted Access</p>
        </div>
      </main>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background font-body text-on-surface overflow-hidden">
      <AudioAlert status={detection && detection.distance < 300 ? "DANGER" : "SAFE"} />
      
      {/* Top Header */}
      <header className="h-16 flex justify-between items-center px-6 z-50 bg-[#041329] border-b border-outline-variant/10">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black text-primary tracking-tighter font-headline italic">IR-COMMANDER V1.0</span>
          <nav className="hidden md:flex gap-6">
            {['Telemetry', 'Traction', 'Braking', 'Vigilance'].map((item, idx) => (
              <a key={item} className={`font-headline font-bold uppercase tracking-wider text-[10px] ${idx === 0 ? 'text-primary border-b-2 border-primary pb-1' : 'text-outline hover:text-on-surface'}`} href="#">{item}</a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 mr-4">
            <button className="material-symbols-outlined text-primary p-2 hover:bg-surface-container-highest transition-all">settings</button>
            <button className="material-symbols-outlined text-primary p-2 hover:bg-surface-container-highest transition-all">notifications_active</button>
          </div>
          <div className="flex flex-col items-end mr-3">
            <span className="font-headline font-bold text-[10px] text-primary">PILOT ID 7724</span>
            <span className="font-mono text-[9px] text-outline">STATUS: NOMINAL</span>
          </div>
          <div className="w-10 h-10 bg-surface-container-highest border border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">account_circle</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
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
          <section className="col-span-3 flex flex-col gap-4 overflow-y-auto no-scrollbar">
            <div className="bg-surface-container-low p-4 border border-outline-variant/10">
              <h3 className="font-headline font-bold uppercase text-[10px] text-primary mb-4 tracking-[0.2em] opacity-80">Night Weather Feed</h3>
              <div className="space-y-4">
                {[
                  { label: 'Visibility', value: '1.2 KM', icon: 'partly_cloudy_night', color: 'text-tertiary' },
                  { label: 'Track Temp', value: '4.2°C', icon: 'device_thermostat', color: 'text-primary' },
                  { label: 'Precipitation', value: 'LOW (2%)', icon: 'water_drop', color: 'text-primary' }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-end border-b border-outline-variant/10 pb-2">
                    <div>
                      <p className="text-[9px] text-outline font-headline font-bold uppercase tracking-wider">{item.label}</p>
                      <p className="font-mono text-xl text-on-surface">{item.value}</p>
                    </div>
                    <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-low p-4 flex-1 border border-outline-variant/10 flex flex-col">
              <h3 className="font-headline font-bold uppercase text-[10px] text-primary mb-4 tracking-[0.2em] opacity-80">Sub-Systems</h3>
              <div className="space-y-3 flex-1 overflow-y-auto pr-1 no-scrollbar">
                {[
                  { name: 'LIDAR-7 Rangefinder', val: 94, icon: 'sensors' },
                  { name: 'Sat-Link Uplink', val: 88, icon: 'network_check' },
                  { name: 'Aux Hydraulic Tank', val: 12, icon: 'warning', danger: true },
                  { name: 'Core AI Unit', val: 99, icon: 'memory' }
                ].map((sys) => (
                  <div key={sys.name} className="flex items-center gap-3 bg-surface-container-high/50 p-3 border border-white/[0.02]">
                    <span className={`material-symbols-outlined ${sys.danger ? 'text-error' : 'text-tertiary'} text-lg`}>{sys.icon}</span>
                    <div className="flex-1">
                      <p className={`text-[9px] font-headline font-black uppercase tracking-tighter ${sys.danger ? 'text-error' : ''}`}>{sys.name}</p>
                      <div className="w-full bg-surface-container-lowest h-1 mt-2">
                        <div className={`${sys.danger ? 'bg-error shadow-[0_0_8px_rgba(255,180,171,0.4)]' : 'bg-tertiary shadow-[0_0_8px_rgba(130,219,126,0.4)]'} h-full transition-all duration-1000`} style={{ width: `${sys.val}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-outline-variant/10 pt-6">
                <h3 className="font-headline font-bold uppercase text-[10px] text-primary mb-4 tracking-[0.2em] opacity-80">External Controls</h3>
                <div className="flex items-center justify-between bg-surface-container-high/50 p-4 border border-outline-variant/10">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">highlight</span>
                    <span className="text-[9px] font-headline font-black uppercase tracking-tighter">Manual Track Light</span>
                  </div>
                  <div className="w-12 h-6 bg-primary relative cursor-pointer shadow-inner">
                    <div className="absolute right-0.5 top-0.5 bottom-0.5 w-5 bg-white shadow-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Center Column: Video Feed */}
          <section className="col-span-6 flex flex-col overflow-hidden">
            <VideoFeed detections={detection ? [detection] : []} />
          </section>

          {/* Right Column: Alerts */}
          <AlertPanel detection={detection} />
        </main>
      </div>

      {/* Bottom Control Bar */}
      <footer className="h-24 bg-surface-container-low px-8 flex items-center justify-between border-t border-outline-variant/10 z-50">
        <div className="flex items-center gap-12">
          <div className="flex flex-col">
            <label className="text-[9px] font-headline font-black text-outline uppercase mb-2 tracking-[0.2em] opacity-80">AI Sensitivity</label>
            <div className="flex items-center gap-4">
              <input className="w-40 accent-primary h-1 bg-surface-container-highest appearance-none cursor-pointer" type="range" defaultValue={85}/>
              <span className="font-mono text-xs text-primary font-bold">0.85</span>
            </div>
          </div>
          <div className="h-10 w-px bg-outline-variant/10"></div>
          <div className="flex flex-col">
            <label className="text-[9px] font-headline font-black text-outline uppercase mb-2 tracking-[0.2em] opacity-80">Alarm Volume</label>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-outline text-lg">volume_up</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-2.5 h-4 bg-primary shadow-[0_0_5px_rgba(177,197,255,0.4)]"></div>)}
                <div className="w-2.5 h-4 bg-surface-container-highest opacity-50"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {[
            { label: 'Latency', value: '14ms', color: 'text-tertiary' },
            { label: 'CPU Temp', value: '52°C', color: 'text-on-surface' },
            { label: 'PWR Load', value: '64%', color: 'text-on-surface' }
          ].map(stat => (
            <div key={stat.label} className="bg-surface-container-highest/30 px-5 py-3 border border-outline-variant/10 flex flex-col items-center min-w-[120px] shadow-sm">
              <span className="text-[9px] font-headline font-bold text-outline tracking-widest uppercase mb-1 opacity-80">{stat.label}</span>
              <span className={`font-mono text-sm ${stat.color} font-black`}>{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-headline font-black text-xs text-primary italic tracking-tight">UTC 21:42:08</p>
            <p className="text-[9px] font-mono text-outline font-bold tracking-widest opacity-60">STATION DIST: 12.4KM</p>
          </div>
          <button className="bg-[#1C2A41] p-3 hover:bg-surface-container-highest transition-all border border-primary/20 shadow-lg shadow-black/20">
            <span className="material-symbols-outlined text-primary text-xl">fullscreen</span>
          </button>
        </div>
      </footer>
    </div>
  );
}


