import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-[#041329] text-[#B1C5FF] font-headline font-bold uppercase tracking-tighter flex justify-between items-center w-full px-6 py-4 border-b-0">
      <div className="flex items-center gap-4">
        <span className="text-xl font-black text-[#B1C5FF] italic">RAIL-AI SENTINEL</span>
        <div className="h-6 w-px bg-outline-variant/30"></div>
        <h1 className="text-sm tracking-widest opacity-80">INDIAN RAILWAYS – OBSTACLE ALERT SYSTEM</h1>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-xs">
        <div className="flex flex-col">
          <span className="text-[10px] text-outline opacity-70">TRAIN-ID</span>
          <span className="text-[#B1C5FF] border-b-2 border-[#B1C5FF]">IR-12845</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-outline opacity-70">SPEED</span>
          <span className="text-[#434652]">72 KM/H</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-outline opacity-70">MODE</span>
          <span className="text-[#434652]">AUTO-TACTICAL</span>
        </div>
      </nav>
      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined hover:bg-[#1C2A41] transition-colors duration-150 p-2">notifications_active</button>
        <button className="material-symbols-outlined hover:bg-[#1C2A41] transition-colors duration-150 p-2">settings</button>
      </div>
    </header>
  );
};

export default Header;
