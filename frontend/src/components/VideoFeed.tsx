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
  speed: number;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ detections = [], speed }) => {
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
          if (err.name === "NotReadableError" || err.name === "TrackStartError") {
            console.warn("Camera is already in use by another application (likely the AI Module).");
          } else {
            console.error("Webcam access error:", err);
          }
        });
    }
  }, []);

  return (
    <div className="col-span-6 h-full flex flex-col relative bg-black overflow-hidden tactical-glow group">
      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen scale-x-[-1] grayscale contrast-[1.2]"
      />
      
      {/* AI Overlay Elements */}
      <div className="absolute inset-0 scanline pointer-events-none"></div>

      {/* Center Target Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-16 h-16 border border-primary/20 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#b1c5ff]"></div>
        </div>
      </div>

      <AnimatePresence>
        {detections.map((d) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-error animate-pulse flex flex-col items-start shadow-[0_0_20px_rgba(255,180,171,0.3)]"
          >
            <div className="bg-error text-on-error text-[10px] font-bold px-2 py-0.5 uppercase">OBSTACLE: {d.object.toUpperCase()}</div>
            <div className="mt-auto w-full bg-error/20 text-error text-[10px] font-bold p-1 text-center backdrop-blur-sm">DIST: {d.distance}M</div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Distance Markers */}
      <div className="absolute right-4 top-1/4 bottom-1/4 w-12 flex flex-col justify-between items-end border-r border-primary/40 text-[10px] text-primary/60 font-mono pr-2 pointer-events-none">
        <span>500M</span>
        <span>400M</span>
        <span className="text-error font-bold">300M</span>
        <span className="text-error font-bold underline">200M</span>
        <span>100M</span>
        <span>0M</span>
      </div>

      {/* FPS & Quality Metadata */}
      <div className="absolute bottom-4 left-4 flex gap-4 text-[10px] font-mono text-tertiary bg-background/60 backdrop-blur px-3 py-1 border border-white/5 pointer-events-none">
        <span>FPS: 60.2</span>
        <span>RES: 4K-RAW</span>
        <span>LATENCY: 12MS</span>
      </div>

      {/* Speed Overlay */}
      <div className="absolute bottom-6 right-6 text-right pointer-events-none">
         <p className="text-5xl font-headline font-black text-primary tracking-tighter italic leading-none">
            {speed} <span className="text-lg not-italic opacity-40">KM/H</span>
         </p>
      </div>
    </div>
  );
};

export default VideoFeed;
