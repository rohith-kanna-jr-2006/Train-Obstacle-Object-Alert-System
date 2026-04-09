import React from "react";
import { ShieldCheck, ShieldAlert, ShieldEllipsis } from "lucide-react";

interface StatusIndicatorProps {
  distance: number | null;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ distance }) => {
  const getColor = (dist: number | null) => {
    if (dist === null) return "text-blue-500 shadow-blue-500/20";
    if (dist < 200) return "text-red-500 shadow-red-500/20 animate-pulse";
    if (dist < 500) return "text-amber-500 shadow-amber-500/20";
    return "text-emerald-500 shadow-emerald-500/20";
  };

  const getStatus = (dist: number | null) => {
    if (dist === null) return { text: "IDLE", icon: ShieldEllipsis, bg: "bg-blue-500/10", border: "border-blue-500/30" };
    if (dist < 200) return { text: "DANGER", icon: ShieldAlert, bg: "bg-red-500/20", border: "border-red-500/50" };
    if (dist < 500) return { text: "WARNING", icon: ShieldEllipsis, bg: "bg-amber-500/10", border: "border-amber-500/30" };
    return { text: "SAFE", icon: ShieldCheck, bg: "bg-emerald-500/10", border: "border-emerald-500/30" };
  };

  const status = getStatus(distance);
  const StatusIcon = status.icon;

  return (
    <div className={`flex items-center gap-4 px-6 py-3 rounded-full border ${status.border} ${status.bg} backdrop-blur-3xl shadow-2xl transition-all duration-700 ease-in-out`}>
      <StatusIcon className={`${getColor(distance)} transition-colors duration-500`} size={24} />
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 leading-none">Status Level</span>
        <span className={`text-xl font-black italic tracking-wider ${getColor(distance)} leading-none mt-1`}>
          {status.text}
        </span>
      </div>
    </div>
  );
};

export default StatusIndicator;
