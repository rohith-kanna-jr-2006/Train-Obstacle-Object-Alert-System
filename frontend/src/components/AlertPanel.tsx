import React from "react";

interface Detection {
    object: string;
    distance: number;
    confidence: number;
    timestamp: string;
}

interface AlertPanelProps {
    detection: Detection | null;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ detection = null }) => {
  const isDanger = detection && detection.distance < 300;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className={`p-4 border-l-4 ${isDanger ? 'bg-error-container/20 border-error animate-pulse' : 'bg-surface-container-low border-primary/30'} h-full flex flex-col transition-colors duration-500`}>
        <div className="flex items-center gap-3 mb-6">
          <span className={`material-symbols-outlined text-3xl ${isDanger ? 'text-error' : 'text-primary'}`}>
            {isDanger ? 'report' : 'check_circle_outline'}
          </span>
          <div>
            <h2 className={`${isDanger ? 'text-error' : 'text-primary'} font-headline font-black text-xl leading-none uppercase`}>
                {isDanger ? 'DANGER' : 'SECURE'}
            </h2>
            <p className={`text-[10px] font-headline font-bold uppercase ${isDanger ? 'text-error/80' : 'text-outline'}`}>
                {isDanger ? 'Collision Imminent' : 'Clear Track Scanning'}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className={`bg-surface-container-highest p-4 border ${isDanger ? 'border-error/30' : 'border-outline-variant/30'}`}>
            <h4 className="text-[10px] font-headline font-bold text-primary uppercase mb-2">Object Analysis</h4>
            <p className="text-xs text-on-surface leading-relaxed">
                {detection 
                    ? `AI identifies a ${detection.object.toLowerCase()} directly on track path. High thermal signature detected. Movement predicted: STAGNANT.`
                    : "No obstacles currently detected within the specified safety perimeter. Scanning continues at 60Hz."}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-headline font-bold text-primary uppercase border-b border-outline-variant pb-1">Automated Protocol</h4>
            {[
              { name: 'Horn Blast (Auto)', status: isDanger ? 'EXECUTING' : 'IDLE', color: isDanger ? 'text-tertiary' : 'text-outline' },
              { name: 'Headlights Max', status: isDanger ? 'ACTIVE' : 'READY', color: isDanger ? 'text-tertiary' : 'text-outline' },
              { name: 'Sand Applicator', status: 'READY', color: 'text-outline' }
            ].map((p) => (
              <div key={p.name} className="flex justify-between items-center">
                <span className="text-[11px] font-headline text-on-surface-variant">{p.name}</span>
                <span className={`text-[11px] font-mono ${p.color}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button className="w-full bg-surface-container-highest text-primary border border-primary/30 py-3 font-headline font-bold text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-primary/10 transition-all">
            <span className="material-symbols-outlined text-sm">mic</span>
            Declare External Emergency
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertPanel;

