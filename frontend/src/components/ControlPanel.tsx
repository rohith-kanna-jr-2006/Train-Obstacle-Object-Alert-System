import React from "react";

interface ControlPanelProps {
  systemActive: boolean;
  onStart: () => void;
  onStop: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ systemActive, onStart, onStop }) => {
  return (
    <footer className="bg-surface-container-low p-1 grid grid-cols-12 gap-1 border-t border-outline-variant/10">
      <div className="col-span-3 flex gap-1">
        <button 
          onClick={onStart}
          className={`flex-1 ${systemActive ? 'bg-tertiary/20 text-tertiary cursor-default' : 'bg-tertiary-container text-on-tertiary-container hover:brightness-110 active:scale-95'} font-headline font-bold text-[10px] py-4 uppercase tracking-widest transition-all`}
        >
          {systemActive ? 'System Active' : 'Start Detection'}
        </button>
        <button 
          onClick={onStop}
          className={`flex-1 ${!systemActive ? 'bg-error/20 text-error cursor-default' : 'bg-error-container text-on-error-container hover:brightness-110 active:scale-95'} font-headline font-bold text-[10px] py-4 uppercase tracking-widest transition-all`}
        >
          Stop System
        </button>
      </div>

      <div className="col-span-6 flex items-center justify-center bg-background px-8 border-x border-outline-variant/10">
        <div className="flex items-center gap-12 w-full max-w-2xl">
          <div className="flex-1">
            <span className="text-[10px] font-bold text-outline block mb-2 text-center uppercase tracking-widest leading-none">Alert Sensitivity</span>
            <div className="flex bg-surface-container-high p-1">
              <button className="flex-1 py-1 text-[9px] font-bold uppercase hover:bg-surface-bright transition-colors text-outline">Low</button>
              <button className="flex-1 py-1 text-[9px] font-bold uppercase bg-primary text-on-primary shadow-[0_0_10px_rgba(177,197,255,0.4)]">Med</button>
              <button className="flex-1 py-1 text-[9px] font-bold uppercase hover:bg-surface-bright transition-colors text-outline">High</button>
            </div>
          </div>
          <div className="h-8 w-px bg-outline-variant/30"></div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Sound</span>
              <div className="w-10 h-5 bg-tertiary/20 rounded-full relative p-1 cursor-pointer">
                <div className={`absolute ${systemActive ? 'right-1' : 'left-1'} top-1 bottom-1 w-3 bg-tertiary rounded-full shadow-[0_0_8px_#82db7e] transition-all`}></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <span className="text-[10px] font-black uppercase tracking-widest">REC</span>
              <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-3 flex gap-1">
        <div className="flex-1 flex flex-col justify-center items-center bg-surface-container-high px-4 font-mono text-[10px] border border-white/5">
          <span className="text-outline uppercase text-[8px] tracking-[0.2em] mb-1">Session Time</span>
          <span className="text-on-surface font-black tracking-widest tabular-nums">04:22:15:88</span>
        </div>
        <button className="bg-surface-container-highest text-primary px-6 flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest hover:bg-surface-bright transition-colors group">
          <span className="material-symbols-outlined text-base group-hover:rotate-180 transition-transform duration-700">history_edu</span>
          LOGS
        </button>
      </div>
    </footer>
  );
};

export default ControlPanel;
