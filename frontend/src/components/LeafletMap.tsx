"use client";

import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapStore } from "@/store/mapStore";
import { useGPSStore } from "@/store/gpsStore";

export default function LeafletMap() {
  const { stations, signals, gpsTrail, obstacleMarkers } = useMapStore();
  const { gpsData } = useGPSStore();

  useEffect(() => {
    // 1. Initialize map centered on the train
    const map = L.map("leaflet-gis-container", {
      center: [gpsData.latitude, gpsData.longitude],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    // 2. Load CartoDB Dark Matter Tiles (Industrial Cyber Dark Aesthetic)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    // 3. Add GPS trail polyline
    const trailCoords = gpsTrail.map((p) => L.latLng(p[0], p[1]));
    L.polyline(trailCoords, {
      color: "#b1c5ff",
      weight: 3,
      opacity: 0.6,
      dashArray: "4, 6",
    }).addTo(map);

    // Custom icons
    const stationIcon = L.divIcon({
      className: "custom-station-icon",
      html: `<div class="w-6 h-6 rounded-lg bg-[#0b3d91]/80 border-2 border-[#b1c5ff] flex items-center justify-center text-[9px] font-bold text-white font-mono shadow-[0_0_8px_#b1c5ff]">STN</div>`,
      iconSize: [24, 24],
    });

    const signalRedIcon = L.divIcon({
      className: "custom-signal-icon-red",
      html: `<div class="w-4 h-4 rounded-full bg-red-600 border border-white/40 animate-ping absolute opacity-50"></div>
             <div class="w-4 h-4 rounded-full bg-red-700 border border-white/20 relative z-10 flex items-center justify-center text-[7px] text-white font-mono font-bold">SIG</div>`,
      iconSize: [16, 16],
    });

    const signalGreenIcon = L.divIcon({
      className: "custom-signal-icon-green",
      html: `<div class="w-4 h-4 rounded-full bg-green-500 border border-white/20 relative z-10 flex items-center justify-center text-[7px] text-white font-mono font-bold">SIG</div>`,
      iconSize: [16, 16],
    });

    const trainIcon = L.divIcon({
      className: "custom-train-icon",
      html: `<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-white shadow-[0_0_12px_#b1c5ff] animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 text-[#002c71]"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
             </div>`,
      iconSize: [32, 32],
    });

    // 4. Draw Stations
    stations.forEach((stn) => {
      L.marker([stn.latitude, stn.longitude], { icon: stationIcon })
        .addTo(map)
        .bindPopup(`<strong class="text-black font-mono font-bold">${stn.name}</strong><br/><span class="text-black text-xs font-mono">Platform: ${stn.platform}<br/>Restr: ${stn.speedRestriction} km/h</span>`);
    });

    // 5. Draw Signals
    signals.forEach((sig) => {
      const icon = sig.aspect === "RED" ? signalRedIcon : signalGreenIcon;
      L.marker([sig.latitude, sig.longitude], { icon })
        .addTo(map)
        .bindPopup(`<strong class="text-black font-mono font-bold">${sig.id} (${sig.name})</strong><br/><span class="text-black text-xs font-mono">Aspect: ${sig.aspect}<br/>Track: ${sig.trackId}</span>`);
    });

    // 6. Draw Train marker at current coordinates
    const trainMarker = L.marker([gpsData.latitude, gpsData.longitude], { icon: trainIcon }).addTo(map);

    // 7. Draw simulated Obstacle Marker if train is decelerating / warning active
    if (gpsData.speed < 55) {
      // Draw warning marker in front of train (approx +0.01 lng)
      const obstacleIcon = L.divIcon({
        className: "custom-obstacle-icon",
        html: `<div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center animate-ping absolute opacity-60"></div>
               <div class="w-8 h-8 rounded-lg bg-red-700 border-2 border-red-500 relative z-10 flex items-center justify-center text-[8px] text-white font-mono font-bold shadow-[0_0_15px_#ef4444]">OBST</div>`,
        iconSize: [32, 32],
      });

      L.marker([gpsData.latitude + 0.005, gpsData.longitude + 0.005], { icon: obstacleIcon })
        .addTo(map)
        .bindPopup(`<strong class="text-black font-mono font-bold">OBSTACLE COLLISION WARNING</strong><br/><span class="text-black text-xs font-mono">Boulder obstruction spotted. Apply full braking force immediately.</span>`)
        .openPopup();
    }

    // Clean up
    return () => {
      map.remove();
    };
  }, [gpsData, stations, signals, gpsTrail]);

  return <div id="leaflet-gis-container" className="w-full h-full min-h-[450px]" />;
}
