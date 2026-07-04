import { create } from "zustand";
import { GPSData } from "@/types";

interface GPSState {
  gpsData: GPSData;
  speedLimit: number;
  routeProgress: number; // percentage of route completed (0 - 100)
  totalRouteDistance: number; // in kilometers
  currentStationName: string;
  nextStationName: string;
  distanceToNextStation: number; // in meters
  etaToNextStation: string; // HH:MM:SS
  
  updateGPSData: (data: Partial<GPSData>) => void;
  setSpeedLimit: (limit: number) => void;
  setRouteProgress: (progress: number) => void;
  updateStationProgress: (
    currentStation: string,
    nextStation: string,
    distance: number,
    eta: string
  ) => void;
}

export const useGPSStore = create<GPSState>((set) => ({
  gpsData: {
    latitude: 28.6139, // Default: New Delhi railway coordinates
    longitude: 77.2090,
    altitude: 216.5,
    speed: 72.0, // km/h
    satellites: 12,
    status: "CONNECTED",
    heading: 90, // Degrees (East)
    timestamp: new Date().toISOString(),
  },
  speedLimit: 100, // km/h
  routeProgress: 35.4,
  totalRouteDistance: 240, // km
  currentStationName: "Hazrat Nizamuddin",
  nextStationName: "Mathura Junction",
  distanceToNextStation: 42300, // meters
  etaToNextStation: "00:35:12",

  updateGPSData: (data) =>
    set((state) => ({
      gpsData: {
        ...state.gpsData,
        ...data,
        timestamp: new Date().toISOString(),
      },
    })),
  setSpeedLimit: (speedLimit) => set({ speedLimit }),
  setRouteProgress: (routeProgress) => set({ routeProgress }),
  updateStationProgress: (currentStationName, nextStationName, distanceToNextStation, etaToNextStation) =>
    set({
      currentStationName,
      nextStationName,
      distanceToNextStation,
      etaToNextStation,
    }),
}));
