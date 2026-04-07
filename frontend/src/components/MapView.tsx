import React from "react";

const MapView: React.FC = () => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/10 p-4 h-full flex flex-col">
      <h3 className="font-headline font-bold uppercase text-[10px] text-primary mb-4 tracking-[0.2em] opacity-80">Geospatial Mapping</h3>
      <div className="flex-1 bg-background/50 border border-outline-variant/5 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* Grid lines */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>
        <div className="text-center space-y-2">
          <span className="material-symbols-outlined text-4xl text-primary/40 animate-pulse">map</span>
          <p className="text-[10px] font-headline font-black uppercase text-outline tracking-widest leading-tight">GPS Signal: Locked<br/>Sector: Salem-Central</p>
        </div>
      </div>
    </div>
  );
};

export default MapView;
