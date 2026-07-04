import { create } from "zustand";

interface CameraState {
  zoom: number;
  brightness: number;
  contrast: number;
  exposure: number;
  resolution: string;
  isRecording: boolean;
  showBoundingBoxes: boolean;
  showDistanceLabels: boolean;
  thermalPalette: "ironbow" | "rainbow" | "grayscale" | "hot-metal";
  thermalFusion: boolean;
  fusionOpacity: number;
  
  setZoom: (zoom: number) => void;
  setBrightness: (brightness: number) => void;
  setContrast: (contrast: number) => void;
  setExposure: (exposure: number) => void;
  setResolution: (resolution: string) => void;
  toggleRecording: () => void;
  toggleBoundingBoxes: () => void;
  toggleDistanceLabels: () => void;
  setThermalPalette: (palette: "ironbow" | "rainbow" | "grayscale" | "hot-metal") => void;
  toggleThermalFusion: () => void;
  setFusionOpacity: (opacity: number) => void;
  resetCameraSettings: () => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  zoom: 1.0,
  brightness: 50,
  contrast: 50,
  exposure: 0,
  resolution: "1920x1080 @ 60 FPS",
  isRecording: false,
  showBoundingBoxes: true,
  showDistanceLabels: true,
  thermalPalette: "ironbow",
  thermalFusion: false,
  fusionOpacity: 0.5,

  setZoom: (zoom) => set({ zoom }),
  setBrightness: (brightness) => set({ brightness }),
  setContrast: (contrast) => set({ contrast }),
  setExposure: (exposure) => set({ exposure }),
  setResolution: (resolution) => set({ resolution }),
  toggleRecording: () => set((state) => ({ isRecording: !state.isRecording })),
  toggleBoundingBoxes: () => set((state) => ({ showBoundingBoxes: !state.showBoundingBoxes })),
  toggleDistanceLabels: () => set((state) => ({ showDistanceLabels: !state.showDistanceLabels })),
  setThermalPalette: (thermalPalette) => set({ thermalPalette }),
  toggleThermalFusion: () => set((state) => ({ thermalFusion: !state.thermalFusion })),
  setFusionOpacity: (fusionOpacity) => set({ fusionOpacity }),
  resetCameraSettings: () =>
    set({
      zoom: 1.0,
      brightness: 50,
      contrast: 50,
      exposure: 0,
      resolution: "1920x1080 @ 60 FPS",
      showBoundingBoxes: true,
      showDistanceLabels: true,
      thermalPalette: "ironbow",
      thermalFusion: false,
      fusionOpacity: 0.5,
    }),
}));
