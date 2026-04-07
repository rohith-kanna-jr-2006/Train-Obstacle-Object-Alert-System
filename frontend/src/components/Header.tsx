import React from "react";

const Header: React.FC = () => {
  return (
    <header className="h-16 flex justify-between items-center px-6 z-50 bg-[#041329] border-b border-outline-variant/10">
      <div className="flex items-center gap-8">
        <span className="text-xl font-black text-primary tracking-tighter font-headline italic">IR-COMMANDER V1.0</span>
        <nav className="hidden md:flex gap-6">
          {['Telemetry', 'Traction', 'Braking', 'Vigilance'].map((item, idx) => (
            <a 
              key={item} 
              className={`font-headline font-bold uppercase tracking-wider text-[10px] ${idx === 0 ? 'text-primary border-b-2 border-primary pb-1' : 'text-outline hover:text-on-surface'}`} 
              href="#"
            >
              {item}
            </a>
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
  );
};

export default Header;
