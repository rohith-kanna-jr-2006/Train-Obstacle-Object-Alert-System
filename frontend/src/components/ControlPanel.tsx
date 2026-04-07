import React from "react";

const ControlPanel: React.FC = () => {
  return (
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
        <button className="bg-[#1C2A41] p-3 hover:bg-surface-container-highest transition-all border border-tertiary/20 shadow-lg shadow-black/20 group" title="Sync with Repository">
          <span className="material-symbols-outlined text-tertiary text-xl group-hover:rotate-180 transition-transform duration-700">sync</span>
        </button>
        <button className="bg-[#1C2A41] p-3 hover:bg-surface-container-highest transition-all border border-primary/20 shadow-lg shadow-black/20">
          <span className="material-symbols-outlined text-primary text-xl">fullscreen</span>
        </button>
      </div>
    </footer>
  );
};

export default ControlPanel;
