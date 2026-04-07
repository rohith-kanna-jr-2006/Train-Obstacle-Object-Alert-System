import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Detection {
  id: string;
  object: string;
  distance: number;
  confidence: number;
  timestamp: string;
}

interface VideoFeedProps {
  detections: Detection[];
}

const VideoFeed: React.FC<VideoFeedProps> = ({ detections = [] }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Webcam access error:", err);
        });
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col relative border border-outline-variant/30 overflow-hidden bg-black font-body">
      {/* Top Static Badge Overlays */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="bg-error px-2 py-0.5 animate-pulse">
            <span className="text-[10px] font-headline font-black text-on-error uppercase">REC ● AI ACTIVE</span>
        </div>
        <div className="bg-surface-container-highest/80 backdrop-blur px-3 py-0.5 border border-outline-variant/50">
            <span className="text-[10px] font-mono text-primary uppercase">INFRARED MODE / 0.7μm - 14μm</span>
        </div>
        <div className="hidden lg:flex items-center gap-3 bg-surface-container-highest/80 backdrop-blur px-3 py-0.5 border border-outline-variant/50">
            <span className="text-[9px] font-headline font-bold text-outline uppercase mr-2 tracking-widest">THERMAL VIEW</span>
            <div className="w-8 h-4 bg-tertiary shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] relative">
                <div className="absolute right-0.5 top-0.5 bottom-0.5 w-3 bg-white"></div>
            </div>
        </div>
      </div>

      {/* Main Track View (Thermal Filter) */}
      <div className="relative flex-1 thermal-gradient">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen scale-x-[-1] grayscale contrast-[1.5] brightness-[1.1]"
        />
        <div className="absolute inset-0 scanline opacity-30"></div>

        {/* AI Detection Overlays */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence>
            {detections.map((d) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className={`w-56 h-56 border-2 border-error relative danger-pulse`}
              >
                <div className="absolute -top-6 left-0 bg-error px-2 text-[10px] font-headline font-black text-on-error uppercase whitespace-nowrap">
                  OBSTACLE: {d.object.toUpperCase()}
                </div>
                <div className="absolute top-0 right-0 p-1">
                  <span className="text-[10px] font-mono text-error font-bold">{d.distance}m</span>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-error text-6xl opacity-60 animate-pulse fill-current">
                        {d.object === "Animal" ? "pets" : d.object === "Person" ? "person" : "warning"}
                    </span>
                </div>

                {/* Bounding Corner Accents */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-error"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-error"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-error"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-error"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* HUD: HUD elements */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
          <div className="space-y-1">
            <p className="text-[10px] font-headline font-bold text-outline opacity-80 tracking-widest uppercase">Auto Brake Armed</p>
            <div className="flex gap-1">
              <div className="w-6 h-1 bg-tertiary"></div>
              <div className="w-6 h-1 bg-tertiary"></div>
              <div className="w-6 h-1 bg-tertiary"></div>
              <div className="w-6 h-1 bg-outline-variant/30"></div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-6xl font-headline font-black text-primary tracking-tighter italic">
                84 <span className="text-xl not-italic opacity-40">KM/H</span>
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar (Below Video) */}
      <div className="bg-surface-container-high h-16 flex items-center justify-between px-6 border-t border-outline-variant/30">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[9px] font-headline font-bold text-outline uppercase tracking-widest">AI Confidence</span>
            <span className="font-mono text-sm text-tertiary">{detections.length > 0 ? (detections[0].confidence * 100).toFixed(1) : '---'}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-headline font-bold text-outline uppercase tracking-widest">Time to Impact</span>
            <span className="font-mono text-sm text-error">06.4s</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-primary-container text-on-primary-container px-6 py-2 font-headline font-bold text-[10px] uppercase hover:bg-primary transition-all border border-primary/20">
              Manual Override
          </button>
          <button className="bg-error-container text-on-error-container px-6 py-2 font-headline font-bold text-[10px] uppercase hover:bg-error transition-all border border-error/20">
              Emergency Brake
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
