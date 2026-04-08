import React from "react";

interface Detection {
    object: string;
    distance: number;
    confidence: number;
    timestamp: string;
}

interface AlertPanelProps {
  detection: Detection | null;
  level: number;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ detection = null, level: alertLevel }) => {
  const levelText = ["SECURE", "CAUTION", "WARNING", "CRITICAL"][alertLevel];
  const levelColor = ["text-tertiary", "text-secondary", "text-error", "text-error animate-pulse"][alertLevel];

  return (
    <aside className="col-span-3 flex flex-col gap-1 h-full overflow-hidden">
      {/* Status Display */}
      <section className={`${alertLevel >= 2 ? 'bg-error-container' : 'bg-surface-container-low'} p-6 flex flex-col items-center justify-center gap-4 flex-1 transition-colors duration-500`}>
        <span className={`material-symbols-outlined text-6xl ${alertLevel >= 2 ? 'text-on-error-container animate-pulse' : 'text-primary/20'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
          {alertLevel >= 2 ? 'warning' : 'shield_with_heart'}
        </span>
        <div className="text-center">
          <h2 className={`font-headline text-5xl font-black tracking-tighter ${alertLevel >= 2 ? 'text-on-error-container' : 'text-primary-container opacity-20'}`}>
            {alertLevel >= 2 ? 'DANGER' : 'SECURE'}
          </h2>
          <p className={`${alertLevel >= 2 ? 'text-on-error-container' : 'text-primary/20'} text-[10px] font-bold tracking-[0.2em] mt-2 opacity-80 uppercase`}>
            {alertLevel >= 3 ? 'IMMEDIATE IMPACT RISK' : alertLevel === 2 ? 'OBSTACLE ON TRACK' : 'CLEAR TRACK SCANNING'}
          </p>
        </div>
      </section>

      {/* Detection Metrics */}
      <section className="bg-surface-container-low p-6 flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-outline block mb-1 uppercase tracking-widest">Object</span>
              <div className="text-2xl font-headline font-bold text-on-surface uppercase tracking-tight italic">
                {detection ? detection.object : 'NONE'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-outline block mb-1 uppercase tracking-widest">Alert Level</span>
              <div className={`text-xl font-headline font-black uppercase tracking-widest ${levelColor}`}>
                LVL {alertLevel}: {levelText}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-outline block mb-1 uppercase tracking-widest uppercase">Distance</span>
              <div className={`text-3xl font-headline font-black ${alertLevel >= 2 ? 'text-error' : 'text-primary/40'}`}>
                {detection ? detection.distance : '---'}<span className="text-sm ml-1 font-bold">m</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-outline block mb-1 uppercase tracking-widest">Confidence</span>
              <div className={`text-3xl font-headline font-black ${detection ? 'text-primary' : 'text-primary/20'}`}>
                {detection ? (detection.confidence * 100).toFixed(0) : '---'}<span className="text-sm ml-1 font-bold">%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${detection ? 'bg-error/20 border-error/50' : 'bg-primary/5 border-primary/10'} flex items-center justify-center border`}>
              <span className={`material-symbols-outlined ${detection ? 'text-error animate-pulse' : 'text-primary/20'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                volume_up
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold block uppercase tracking-wide">Audio Alert</span>
              <span className={`text-[10px] ${detection ? 'text-tertiary font-bold' : 'text-outline/40'}`}>
                {detection ? 'ACTIVE - 110dB' : 'STANDBY'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-outline opacity-40">REF: #774-A</span>
        </div>
      </section>

      {/* Operator Identity */}
      <section className="bg-surface-container-highest p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-primary-container flex items-center justify-center overflow-hidden">
           <span className="material-symbols-outlined text-primary text-2xl">account_circle</span>
        </div>
        <div>
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider">COMMANDER</h3>
          <p className="text-[10px] text-outline uppercase tracking-widest opacity-60">SECTOR-04 STATION</p>
        </div>
      </section>
    </aside>
  );
};

export default AlertPanel;

