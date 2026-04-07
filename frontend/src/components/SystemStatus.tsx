import React from "react";

const SystemStatus: React.FC = () => {
  return (
    <aside className="col-span-3 flex flex-col gap-1 overflow-y-auto no-scrollbar">
      {/* System Health */}
      <section className="bg-surface-container-low p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <h2 className="font-headline text-xs font-bold tracking-widest text-primary uppercase">SYSTEM HEALTH</h2>
          <span className="material-symbols-outlined text-xs text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Camera Array', status: 'NOMINAL', color: 'text-tertiary', dot: 'bg-tertiary' },
            { label: 'AI Inference Engine', status: 'ACTIVE', color: 'text-tertiary', dot: 'bg-tertiary' },
            { label: 'Backend API', status: 'SYNCED', color: 'text-tertiary', dot: 'bg-tertiary' },
            { label: 'Database Node', status: 'SECURE', color: 'text-tertiary', dot: 'bg-tertiary' }
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center bg-surface-container-high p-2">
              <span className="text-xs font-medium uppercase opacity-70">{item.label}</span>
              <span className={`flex items-center gap-2 text-[10px] ${item.color}`}>
                <span className={`w-1.5 h-1.5 ${item.dot} rounded-full animate-pulse`}></span> {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Weather Mode */}
      <section className="bg-surface-container-low p-4">
        <h2 className="font-headline text-xs font-bold tracking-widest text-primary uppercase mb-4">WEATHER ADAPTATION</h2>
        <div className="grid grid-cols-3 gap-1">
          <button className="bg-primary-container text-primary p-3 flex flex-col items-center gap-1 border border-primary/30">
            <span className="material-symbols-outlined text-lg">wb_sunny</span>
            <span className="text-[9px] font-bold uppercase">CLEAR</span>
          </button>
          <button className="bg-surface-container-high text-on-surface-variant p-3 flex flex-col items-center gap-1 hover:bg-surface-bright transition-colors">
            <span className="material-symbols-outlined text-lg">cloud</span>
            <span className="text-[9px] font-bold uppercase">FOG</span>
          </button>
          <button className="bg-surface-container-high text-on-surface-variant p-3 flex flex-col items-center gap-1 hover:bg-surface-bright transition-colors">
            <span className="material-symbols-outlined text-lg">dark_mode</span>
            <span className="text-[9px] font-bold uppercase">NIGHT</span>
          </button>
        </div>
      </section>

      {/* GPS Telemetry */}
      <section className="bg-surface-container-low p-4 flex-1">
        <h2 className="font-headline text-xs font-bold tracking-widest text-primary uppercase mb-4">GPS TELEMETRY</h2>
        <div className="space-y-4 font-mono">
          <div>
            <span className="text-[10px] text-outline block mb-1">COORDINATES</span>
            <div className="bg-background p-2 border-l-2 border-primary">
              <p className="text-sm">LAT: 28.6139° N</p>
              <p className="text-sm">LONG: 77.2090° E</p>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-outline block mb-1 uppercase">Track Section ID</span>
            <p className="text-xl font-headline font-black text-secondary tracking-tighter">NCR-DL-204-X</p>
          </div>
          <div className="mt-4 opacity-30 pointer-events-none">
            <div className="w-full h-32 bg-surface-container-high relative overflow-hidden flex items-center justify-center border border-outline-variant/20">
               <span className="material-symbols-outlined text-primary/20 text-6xl animate-spin-slow">radar</span>
               <div className="absolute inset-0 scanline opacity-40"></div>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default SystemStatus;
