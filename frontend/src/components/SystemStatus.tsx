import React from "react";

const SystemStatus: React.FC = () => {
  return (
    <section className="col-span-3 flex flex-col gap-4 overflow-y-auto no-scrollbar">
      {/* Weather Feed */}
      <div className="hud-glass tactical-border p-5">
        <h3 className="font-headline font-black uppercase text-[10px] text-primary mb-5 tracking-[0.3em] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">filter_drama</span>
            ENVIRONMENTAL FEED
        </h3>
        <div className="space-y-5">
          {[
            { label: 'Visibility', value: '1.2 KM', icon: 'visibility', color: 'text-tertiary' },
            { label: 'Track Temp', value: '4.2°C', icon: 'thermostat', color: 'text-primary' },
            { label: 'Air Humid', value: '62%', icon: 'water_drop', color: 'text-primary' }
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center bg-white/[0.03] p-3 border-l border-white/10">
              <div>
                <p className="text-[8px] text-primary/40 font-black uppercase tracking-widest mb-1">{item.label}</p>
                <p className="font-mono text-lg text-white tabular-nums">{item.value}</p>
              </div>
              <span className={`material-symbols-outlined ${item.color} text-xl opacity-60`}>{item.icon}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Systems */}
      <div className="hud-glass tactical-border p-5 flex-1 flex flex-col">
        <h3 className="font-headline font-black uppercase text-[10px] text-primary mb-5 tracking-[0.3em] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">memory</span>
            SYSTEM ARCHITECTURE
        </h3>
        <div className="space-y-4 flex-1 overflow-y-auto pr-1 no-scrollbar">
          {[
            { name: 'LIDAR-7 ARRAY', val: 94, icon: 'sensors', status: 'NOMINAL' },
            { name: 'SAT-LINK UPLINK', val: 88, icon: 'satellite_alt', status: 'NOMINAL' },
            { name: 'HYDRAULIC COIL', val: 12, icon: 'warning', danger: true, status: 'CRITICAL' },
            { name: 'NEURAL CORE', val: 99, icon: 'psychology', status: 'MAX' }
          ].map((sys) => (
            <div key={sys.name} className="bg-white/[0.02] p-4 border border-white/5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                   <span className={`material-symbols-outlined ${sys.danger ? 'text-error animate-pulse' : 'text-primary'} text-lg`}>{sys.icon}</span>
                   <span className={`text-[10px] font-black tracking-widest ${sys.danger ? 'text-error' : 'text-white'}`}>{sys.name}</span>
                </div>
                <span className={`text-[8px] font-mono font-bold ${sys.danger ? 'text-error' : 'text-tertiary'}`}>{sys.status}</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                <div 
                  className={`${sys.danger ? 'bg-error shadow-[0_0_10px_#ffb4ab]' : 'bg-primary shadow-[0_0_10px_#b1c5ff]'} h-full transition-all duration-[2000ms] ease-out`} 
                  style={{ width: `${sys.val}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* External Controls */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="font-headline font-black uppercase text-[10px] text-primary/40 mb-4 tracking-[0.3em]">Quick Access</h3>
          <div className="grid grid-cols-2 gap-3">
             <button className="bg-white/5 p-3 tactical-border border-none text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">Toggle Beam</button>
             <button className="bg-white/5 p-3 tactical-border border-none text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">Reset AI</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemStatus;
