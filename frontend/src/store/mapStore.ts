import { create } from "zustand";
import { SignalInfo, StationInfo } from "@/types";

interface MapState {
  center: [number, number]; // [lat, lng]
  zoom: number;
  stations: StationInfo[];
  signals: SignalInfo[];
  selectedFeatureId: string | null;
  gpsTrail: [number, number][]; // History of train coordinates
  obstacleMarkers: { id: string; lat: number; lng: number; label: string; severity: "WARNING" | "DANGER" }[];
  
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setSelectedFeatureId: (id: string | null) => void;
  addGpsTrailPoint: (point: [number, number]) => void;
  addObstacleMarker: (marker: { id: string; lat: number; lng: number; label: string; severity: "WARNING" | "DANGER" }) => void;
  clearObstacleMarkers: () => void;
  setStations: (stations: StationInfo[]) => void;
  setSignals: (signals: SignalInfo[]) => void;
}

// Sample route data (points between Hazrat Nizamuddin and Mathura Junction)
const sampleTrail: [number, number][] = [
  [28.6139, 77.2090],
  [28.5839, 77.2290],
  [28.5539, 77.2490],
  [28.5239, 77.2690],
  [28.4939, 77.2890],
];

export const useMapStore = create<MapState>((set) => ({
  center: [28.6139, 77.2090],
  zoom: 13,
  selectedFeatureId: null,
  gpsTrail: sampleTrail,
  obstacleMarkers: [],
  stations: [
    {
      id: "STN-001",
      name: "Hazrat Nizamuddin",
      distance: 0,
      eta: "00:00:00",
      platform: "PF-4",
      scheduledArrival: "10:30 AM",
      speedRestriction: 30,
      latitude: 28.5888,
      longitude: 77.2536,
    },
    {
      id: "STN-002",
      name: "Faridabad",
      distance: 21000,
      eta: "00:15:30",
      platform: "PF-1",
      scheduledArrival: "10:48 AM",
      speedRestriction: 80,
      latitude: 28.4079,
      longitude: 77.3133,
    },
    {
      id: "STN-003",
      name: "Mathura Junction",
      distance: 141000,
      eta: "01:25:00",
      platform: "PF-3",
      scheduledArrival: "11:58 AM",
      speedRestriction: 50,
      latitude: 27.4924,
      longitude: 77.6737,
    },
  ],
  signals: [
    {
      id: "SIG-104A",
      name: "Nizamuddin Outer-1",
      aspect: "GREEN",
      distance: 850,
      status: "ACTIVE",
      trackId: "TK-UP-1",
      route: "MAIN_LINE",
      latitude: 28.5721,
      longitude: 77.2612,
    },
    {
      id: "SIG-104B",
      name: "Faridabad Approach",
      aspect: "YELLOW",
      distance: 2450,
      status: "ACTIVE",
      trackId: "TK-UP-1",
      route: "MAIN_LINE",
      latitude: 28.4215,
      longitude: 77.3098,
    },
    {
      id: "SIG-105",
      name: "Palwal Main Sector",
      aspect: "RED",
      distance: 4200,
      status: "ACTIVE",
      trackId: "TK-UP-2",
      route: "LOOP_LINE",
      latitude: 28.1456,
      longitude: 77.3267,
    },
  ],

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setSelectedFeatureId: (id) => set({ selectedFeatureId: id }),
  addGpsTrailPoint: (point) =>
    set((state) => ({
      gpsTrail: [...state.gpsTrail, point],
    })),
  addObstacleMarker: (marker) =>
    set((state) => ({
      obstacleMarkers: [...state.obstacleMarkers.filter((m) => m.id !== marker.id), marker],
    })),
  clearObstacleMarkers: () => set({ obstacleMarkers: [] }),
  setStations: (stations) => set({ stations }),
  setSignals: (signals) => set({ signals }),
}));
