import React, { useEffect, useRef } from "react";

interface AudioAlertProps {
  level: number;
}

const AudioAlert: React.FC<AudioAlertProps> = ({ level }) => {
  const lastLevel = useRef<number>(0);
  const repeatInterval = useRef<NodeJS.Timeout | null>(null);

  const speak = (text: string, rate = 1.0, pitch = 1.0) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop current speech
      const msg = new SpeechSynthesisUtterance(text);
      msg.rate = rate;
      msg.pitch = pitch;
      msg.volume = 1.0;
      window.speechSynthesis.speak(msg);
    }
  };

  useEffect(() => {
    if (level !== lastLevel.current) {
      // Clear any repeat loops when level changes
      if (repeatInterval.current) {
         clearInterval(repeatInterval.current);
         repeatInterval.current = null;
      }

      if (level === 3) {
        speak("CRITICAL ALERT! OBSTACLE DETECTED IN IMPACT ZONE. APPLY EMERGENCY BRAKES IMMEDIATELY.", 1.2, 0.85);
        // Repeated warning for critical danger
        repeatInterval.current = setInterval(() => {
           speak("CRITICAL ALERT! APPLY BRAKES.", 1.3, 0.85);
        }, 4000);
      } 
      else if (level === 2) {
        speak("DANGER. OBSTACLE ON TRACKPATH. ALERT LEVEL TWO. REDUCE SPEED.", 1.1, 0.9);
      } 
      else if (level === 1) {
        speak("CAUTION. DISTANT TRACK OBSTRUCTION DETECTED.", 1.0, 1.0);
      }

      lastLevel.current = level;
    }

    return () => {
      if (repeatInterval.current) clearInterval(repeatInterval.current);
    };
  }, [level]);

  return <div className="hidden" aria-hidden="true" />;
};

export default AudioAlert;
