import React, { useEffect, useRef } from "react";

interface AudioAlertProps {
  status: "SAFE" | "WARNING" | "DANGER";
}

const AudioAlert: React.FC<AudioAlertProps> = ({ status }) => {
  const lastStatus = useRef<string | null>(null);

  const speakAlert = (msg: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const speech = new SpeechSynthesisUtterance(msg);
      speech.rate = 1.1;
      speech.pitch = 0.9;
      window.speechSynthesis.speak(speech);
    }
  };

  useEffect(() => {
    if (status !== lastStatus.current) {
      if (status === "DANGER") {
        speakAlert("Critical Alert! Obstacle detected in danger zone. Apply brakes.");
      } else if (status === "WARNING") {
        speakAlert("Warning. Obstacle detected ahead. Reduce speed.");
      }
      lastStatus.current = status;
    }
  }, [status]);

  return null; // Logic only component
};

export default AudioAlert;
