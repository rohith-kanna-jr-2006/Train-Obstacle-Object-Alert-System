import React from "react";
import { motion } from "framer-motion";

interface SetupScreenProps {
  startupProgress: number;
  onStart: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ startupProgress, onStart }) => {
  const [systemHash, setSystemHash] = React.useState("");

  React.useEffect(() => {
    setSystemHash(Math.random().toString(16).slice(2, 10).toUpperCase());
  }, []);

  return (
    <main className="h-screen bg-background flex items-center justify-center font-headline overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 scanline opacity-30 z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(177,197,255,0.05)_0%,transparent_70%)]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 animate-scan z-0"></div>

      <div className="z-10 flex flex-col items-center gap-10 max-w-5xl w-full px-6">
        {/* Branding Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-primary/20 bg-primary/5 rounded-full mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <p className="text-primary font-bold tracking-[0.3em] text-[9px] uppercase font-label">Indian Railways AI Division</p>
          </div>
          <h1 className="text-8xl font-black text-white tracking-tighter italic filter drop-shadow-[0_0_15px_rgba(177,197,255,0.3)]">
            RAIL-AI <span className="text-primary">SENTINEL</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
             <div className="h-px w-12 bg-primary/30"></div>
             <p className="text-primary/60 text-xs uppercase tracking-[0.4em] font-medium">Neural Obstacle Detection System V4.2.0</p>
             <div className="h-px w-12 bg-primary/30"></div>
          </div>
        </motion.div>

        {/* Tactical Cockpit Initialization Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl hud-glass p-10 tactical-border space-y-10 relative overflow-hidden group shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]"
        >
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-primary flex items-center gap-4 italic tracking-tight">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin-slow">settings_heart</span>
                INITIALIZE COCKPIT
              </h2>
              
              <div className="grid grid-cols-1 gap-4 w-64">
                {[
                  { label: 'Camera Array', progress: 20 },
                  { label: 'AI Core Engine', progress: 50 },
                  { label: 'Uplink Satellite', progress: 80 }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-[2px] transition-all duration-500 ${startupProgress > item.progress ? 'bg-tertiary shadow-[0_0_10px_#82db7e]' : 'bg-white/10'}`}></div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${startupProgress > item.progress ? 'text-white' : 'text-white/30'}`}>
                      {item.label}: {startupProgress > item.progress ? 'ACTIVE' : 'IDLE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <div className="text-6xl font-black text-primary/10 tracking-tighter italic tabular-nums leading-none">
                {startupProgress}%
              </div>
              <span className="text-[10px] font-headline font-bold text-primary/40 uppercase tracking-[0.2em] mt-2">Buffer Status</span>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="space-y-3">
             <div className="flex justify-between items-end mb-1">
                <span className="text-[9px] font-black text-primary/50 uppercase tracking-[0.2em]">Core Link Integrity</span>
                <span className="text-[9px] font-mono text-primary/50 tabular-nums uppercase">HASH: {systemHash || "GENERATING..."}</span>
             </div>
             <div className="w-full h-2 bg-white/5 relative overflow-hidden backdrop-blur-sm border border-white/10">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary/40 via-primary to-white shadow-[0_0_20px_rgba(177,197,255,0.6)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${startupProgress}%` }}
                />
             </div>
          </div>

          {startupProgress === 0 && (
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: 'white', color: '#041329' }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="w-full py-5 bg-primary text-on-primary font-black uppercase text-sm tracking-[0.3em] transition-all shadow-[0_10px_30px_rgba(177,197,255,0.15)] tactical-border border-none cursor-pointer"
            >
              BEGIN SYSTEM COCKPIT CHECK
            </motion.button>
          )}

          {/* Decorative Corner Text */}
          <div className="absolute top-4 right-4 pointer-events-none opacity-20">
             <span className="text-[7px] font-mono text-white vertical-text tracking-widest">SYSTEM_BOOT_V4.2</span>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-8 opacity-40">
           <p className="text-[9px] uppercase font-black text-white tracking-[0.3em]">Sector-04 Red Restricted</p>
           <div className="h-4 w-px bg-white/20"></div>
           <p className="text-[9px] uppercase font-black text-white tracking-[0.3em]">Auth: Pilot 7724</p>
           <div className="h-4 w-px bg-white/20"></div>
           <p className="text-[9px] uppercase font-black text-white tracking-[0.3em]">Salem Division</p>
        </div>
      </div>
    </main>
  );
};

export default SetupScreen;
