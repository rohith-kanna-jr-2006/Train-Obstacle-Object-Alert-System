"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Camera,
  Flame,
  Radar,
  Map as MapIcon,
  Eye,
  TrafficCone,
  Train,
  GitCommit,
  Bell,
  FileText,
  Settings,
  HelpCircle,
  Clock,
  Compass,
  Wifi,
  Cpu,
  Zap,
  Battery,
  CloudSun,
  User,
  ShieldAlert,
  Volume2,
  VolumeX,
  Maximize,
  Minimize
} from "lucide-react";
import { useAlertStore } from "@/store/alertStore";
import { useGPSStore } from "@/store/gpsStore";
import { useSystemStore } from "@/store/systemStore";
import { useAuthStore } from "@/store/authStore";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Camera", href: "/camera", icon: Camera },
  { name: "Thermal", href: "/thermal", icon: Flame },
  { name: "LiDAR", href: "/lidar", icon: Radar },
  { name: "GIS Map", href: "/gis", icon: MapIcon },
  { name: "Object Detection", href: "/detection", icon: Eye },
  { name: "Signals", href: "/signals", icon: TrafficCone },
  { name: "Stations", href: "/stations", icon: Train },
  { name: "Track", href: "/track", icon: GitCommit },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { alerts, audioAlarmEnabled, toggleAudioAlarm, triggerEmergencyBrake, isEmergencyBrakeActive, isBrakeActive } = useAlertStore();
  const { gpsData, routeProgress } = useGPSStore();
  const { systemData } = useSystemStore();
  const { session } = useAuthStore();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const activeAlertsCount = alerts.filter((a) => !a.dismissed && (a.level === "DANGER" || a.level === "WARNING")).length;
  const criticalAlert = alerts.find((a) => !a.dismissed && a.level === "DANGER");

  return (
    <div className="h-screen w-screen bg-[#041329] text-[#d6e3ff] font-body overflow-hidden flex flex-col select-none relative">
      {/* SCANNING LINES FOR INDUSTRIAL EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,61,145,0.15),transparent_80%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none z-0" />

      {/* TOP NAVIGATION BAR */}
      <header className="h-14 border-b border-surface-container-high bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-primary-container border border-primary flex items-center justify-center font-bold text-primary text-sm shadow-[0_0_10px_rgba(177,197,255,0.3)]">
              IR
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest text-[#ffffff] font-headline flex items-center gap-2">
              OAVAS
              <span className="text-[10px] px-1.5 py-0.5 bg-[#004e11] text-tertiary border border-tertiary/20 rounded font-mono font-medium">
                V2.4_ACTIVE
              </span>
            </h1>
            <p className="text-[9px] text-outline uppercase tracking-wider font-mono">Onboard Augmented Vision Assistance System</p>
          </div>
        </div>

        {/* TOP STATUS ELEMENTS */}
        <div className="flex items-center gap-6 text-[11px] font-mono">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-surface-container-low rounded border border-surface-container-high">
            <CloudSun className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[#ffffff]">Foggy / 8°C</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Compass className={`w-3.5 h-3.5 ${gpsData.status === "CONNECTED" ? "text-primary animate-spin" : "text-error"}`} style={{ animationDuration: "10s" }} />
            <span className="text-outline">GPS:</span>
            <span className={gpsData.status === "CONNECTED" ? "text-tertiary" : "text-error"}>
              {gpsData.status} ({gpsData.satellites} SATs)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-primary" />
            <span className="text-outline">LTE-R:</span>
            <span className="text-tertiary">{systemData.networkLatency}ms</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#a3b5db]" />
            <span className="text-outline">JETSON AGX:</span>
            <span className={`font-semibold ${systemData.jetsonStatus === "NOMINAL" ? "text-tertiary" : "text-error"}`}>
              {systemData.jetsonStatus} ({systemData.gpuTemp}°C)
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-outline">CUDA:</span>
            <span className="text-primary font-semibold">TENSORRT ACTIVE</span>
          </div>

          <div className="flex items-center gap-1">
            <Battery className="w-3.5 h-3.5 text-tertiary" />
            <span className="text-tertiary">98%</span>
          </div>
        </div>

        {/* TIME, FULLSCREEN, PROFILE */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end pr-3 border-r border-surface-container-high font-mono">
            <div className="text-sm font-bold text-[#ffffff] tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {time}
            </div>
            <div className="text-[9px] text-outline uppercase">{date}</div>
          </div>

          {/* AUDIO ALARM CONTROLLER */}
          <button
            onClick={toggleAudioAlarm}
            className={`p-2 rounded bg-surface-container-low border border-surface-container-high transition-colors ${
              audioAlarmEnabled ? "text-tertiary hover:bg-surface-container-high" : "text-outline hover:bg-error/15"
            }`}
            title={audioAlarmEnabled ? "Mute Audio Alarms" : "Unmute Audio Alarms"}
          >
            {audioAlarmEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-error" />}
          </button>

          {/* FULL SCREEN */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded bg-surface-container-low border border-surface-container-high hover:bg-surface-container-high text-[#d6e3ff]"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* PROFILE */}
          <div className="hidden sm:flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center border border-outline/20">
              <User className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-left leading-none">
              <p className="text-[11px] font-bold text-[#ffffff]">{session.user?.name}</p>
              <span className="text-[9px] text-outline uppercase">{session.user?.role}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-[68px] md:w-60 bg-surface-container-lowest/60 border-r border-surface-container-high flex flex-col justify-between py-2 backdrop-blur-md transition-all">
          <nav className="flex-1 flex flex-col gap-1.5 px-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  href={item.href}
                  key={item.name}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                    isActive
                      ? "bg-primary-container/40 border border-primary/30 text-primary shadow-[0_0_15px_rgba(11,61,145,0.2)]"
                      : "text-outline hover:text-white hover:bg-surface-container-high/40 border border-transparent"
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? "text-primary" : "text-[#a3b5db]"}`} />
                  <span className="text-xs font-medium tracking-wide hidden md:block">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* SIDEBAR FOOTER */}
          <div className="px-2 pt-2 border-t border-surface-container-high/40 flex flex-col gap-1.5">
            <Link
              href="/help"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-outline hover:text-white hover:bg-surface-container-high/40 border border-transparent"
            >
              <HelpCircle className="w-5 h-5 text-[#a3b5db]" />
              <span className="text-xs hidden md:block">System Manual</span>
            </Link>
            <div className="px-3 py-2 text-[9px] font-mono text-outline hidden md:block">
              LOCO_ID: <span className="text-[#ffffff]">IR-WAP7-31012</span>
            </div>
          </div>
        </aside>

        {/* MAIN TELEMETRY WORKSPACE VIEW */}
        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          <div className="flex-1 overflow-y-auto p-3 relative">
            {children}
          </div>

          {/* BOTTOM STATUS BAR */}
          <footer className="h-10 border-t border-surface-container-high bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between px-4 text-xs font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <span className="text-outline">WS STATE:</span>
                <span className="text-tertiary">ONLINE</span>
              </span>
              <span className="hidden md:inline text-outline">|</span>
              <span className="hidden md:inline">
                <span className="text-outline">LATENCY:</span>{" "}
                <span className="text-primary">{systemData.networkLatency}ms</span>
              </span>
              <span className="hidden md:inline text-outline">|</span>
              <span className="hidden lg:inline">
                <span className="text-outline">FPS:</span>{" "}
                <span className="text-primary">{systemData.fps.toFixed(1)}</span>
              </span>
            </div>

            {/* LIVE DRIVING BRAKING SPEED RECOMMENDATION */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded border border-surface-container-high">
                <span className="text-outline text-[10px]">ROUTE PROGRESS:</span>
                <span className="text-primary text-[10px] font-bold">{routeProgress.toFixed(1)}%</span>
                <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden ml-1">
                  <div className="h-full bg-primary" style={{ width: `${routeProgress}%` }} />
                </div>
              </div>

              {isBrakeActive && (
                <div className="animate-pulse px-2 py-0.5 bg-error/25 border border-error/50 rounded text-error text-[10px] font-bold tracking-widest uppercase">
                  BRAKE APPLIED
                </div>
              )}

              {isEmergencyBrakeActive && (
                <div className="animate-ping px-2.5 py-0.5 bg-red-600 border border-red-500 rounded text-white text-[10px] font-black tracking-widest uppercase">
                  EMERGENCY STOP ACTIVE
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-outline">PILOT:</span>
              <span className="text-[#ffffff] font-semibold">{session.user?.name}</span>
            </div>
          </footer>
        </main>

        {/* RIGHT WARNINGS SIDEBAR (NOTIFICATIONS PANEL) */}
        <aside className="w-80 bg-surface-container-low/40 border-l border-surface-container-high backdrop-blur-md hidden xl:flex flex-col overflow-hidden">
          <div className="p-3 border-b border-surface-container-high flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffffff]">Telemetry Event Logs</h3>
            </div>
            {activeAlertsCount > 0 && (
              <span className="px-2 py-0.5 rounded bg-error-container text-white text-[10px] font-bold font-mono">
                {activeAlertsCount} ACTIVE
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-outline gap-2">
                <ShieldAlert className="w-8 h-8 text-outline/30" />
                <p className="text-xs">No notifications logged. Systems fully safe.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-lg border transition-all ${
                    alert.dismissed
                      ? "bg-surface-container-lowest/30 border-surface-container-high/40 opacity-50"
                      : alert.level === "DANGER"
                      ? "bg-red-950/20 border-red-500/50 hover:bg-red-950/30"
                      : alert.level === "WARNING"
                      ? "bg-yellow-950/20 border-yellow-500/50 hover:bg-yellow-950/30"
                      : "bg-surface-container-lowest/60 border-surface-container-high/60"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 text-[10px]">
                    <span
                      className={`font-bold font-mono ${
                        alert.level === "DANGER"
                          ? "text-red-400"
                          : alert.level === "WARNING"
                          ? "text-yellow-400"
                          : "text-primary"
                      }`}
                    >
                      [{alert.source}] {alert.level}
                    </span>
                    <span className="text-outline font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString("en-US", { hour12: false })}
                    </span>
                  </div>
                  <p className="text-xs text-[#ffffff] leading-normal font-sans">{alert.message}</p>
                  {alert.actionTaken && (
                    <div className="mt-1 text-[9px] font-mono text-tertiary bg-tertiary-container/10 p-1 border border-tertiary/20 rounded">
                      CMD: {alert.actionTaken}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-surface-container-high/60 bg-surface-container-lowest/40 flex flex-col gap-2">
            <button
              onClick={() => triggerEmergencyBrake()}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-headline text-xs font-black tracking-widest rounded-lg border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all uppercase flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <ShieldAlert className="w-4 h-4" />
              EMERGENCY BRAKE
            </button>
          </div>
        </aside>
      </div>

      {/* FLOATING EMERGENCY ALERT PANEL OVERLAY */}
      <AnimatePresence>
        {criticalAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[90%] max-w-xl bg-red-950/90 border-2 border-red-500 rounded-xl p-4 shadow-[0_0_40px_rgba(239,68,68,0.5)] z-50 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-ping absolute opacity-30" />
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center border border-red-500 z-10">
                <ShieldAlert className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black font-headline text-white tracking-widest uppercase">
                  CRITICAL THREAT DETECTED
                </h4>
                <p className="text-xs text-red-100 font-sans mt-0.5">{criticalAlert.message}</p>
                <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-[#ffffff]">
                  <span className="bg-red-900/60 px-2 py-0.5 border border-red-500/30 rounded">
                    BRAKE RECOMMENDATION: EMERGENCY FULL FORCE
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
