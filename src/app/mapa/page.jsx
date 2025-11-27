"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// ==========================
//  CONFIGURACIÓN MAPBOX
// ==========================
mapboxgl.accessToken = "pk.eyJ1IjoibWVndWluIiwiYSI6ImNtaWdkbGZsNTA1MmEzZm9mY25pMjAwa2kifQ.Hn5lWQQeld2x2xb01PxFVw";
// Reemplaza por tu token real

export default function Mapa3D() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [status, setStatus] = useState("Buscando tu ubicación...");
  const [userLocation, setUserLocation] = useState(null);
  const [nearestPole, setNearestPole] = useState(null);

  // ==========================
  //  DATOS MOCK DE POLOS
  // ==========================
  const POLOS = [
    { id: 1, name: "Puerto Lázaro Cárdenas", lng: -102.213, lat: 17.935 },
    { id: 2, name: "Salina Cruz (CIIT)", lng: -95.204, lat: 16.208 },
    { id: 3, name: "Puerto de Veracruz", lng: -96.136, lat: 19.208 },
    { id: 4, name: "Monterrey Hub", lng: -100.315, lat: 25.686 },
    { id: 5, name: "Valle de México (Tizayuca)", lng: -98.783, lat: 20.088 },
    { id: 6, name: "Cancún / Riviera Maya", lng: -86.851, lat: 21.161 },
  ];

  // ==========================
  //   FUNCIÓN DISTANCIA
  // ==========================
  const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // ==========================
  //   INICIALIZAR MAPA
  // ==========================
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-102, 23.5],
      zoom: 4,
      pitch: 0,
      bearing: 0,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.current.on("load", () => {
      // Modo terreno 3D
      map.current.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });

      map.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      placePolos();
      getUserPosition();
    });
  }, []);

  // ==========================
  //   MARCADORES DE POLOS
  // ==========================
  const placePolos = () => {
    POLOS.forEach((pole) => {
      const el = document.createElement("div");
      el.className =
        "w-4 h-4 bg-blue-600 border-2 border-blue-200 rounded-full shadow-lg transition cursor-pointer";

      // Tooltip
      const tooltip = document.createElement("span");
      tooltip.className =
        "absolute px-2 py-1 text-xs rounded-lg bg-gray-800 text-white -translate-x-1/2 left-1/2 hidden";
      tooltip.textContent = pole.name;

      el.appendChild(tooltip);

      el.onmouseenter = () => {
        tooltip.style.display = "block";
      };
      el.onmouseleave = () => {
        tooltip.style.display = "none";
      };

      pole.marker = new mapboxgl.Marker(el)
        .setLngLat([pole.lng, pole.lat])
        .addTo(map.current);

      pole.element = el;
    });
  };

  // ==========================
  //  MARCADOR DEL USUARIO
  // ==========================
  const placeUserMarker = (lng, lat) => {
    const el = document.createElement("div");
    el.className =
      "w-5 h-5 bg-green-500 border-4 border-green-300 rounded-full shadow-xl animate-pulse";

    new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map.current);
  };

  // ==========================
  //  GEOLOCALIZACIÓN
  // ==========================
  const getUserPosition = () => {
    if (!navigator.geolocation) {
      setStatus("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ latitude, longitude });

        placeUserMarker(longitude, latitude);

        calculateNearestPole(latitude, longitude);
      },
      (err) => {
        setStatus("No se pudo obtener ubicación.");
        console.error(err);
      },
      { enableHighAccuracy: true }
    );
  };

  // ==========================
  //  ENCONTRAR POLO MÁS CERCANO
  // ==========================
  const calculateNearestPole = (lat, lng) => {
    let minDist = Infinity;
    let closest = null;

    POLOS.forEach((pole) => {
      const dist = calcDistance(lat, lng, pole.lat, pole.lng);

      if (dist < minDist) {
        minDist = dist;
        closest = pole;
        closest.distance = dist;
      }
    });

    setNearestPole(closest);

    // Resaltar marcador
    if (closest?.element) {
      closest.element.classList.add("scale-150", "bg-red-600", "border-white");
    }

    // Animación 3D al polo
    map.current.flyTo({
      center: [closest.lng, closest.lat],
      zoom: 12,
      pitch: 60,
      bearing: -40,
      duration: 3000,
    });

    setStatus(
      `Polo más cercano: ${closest.name} a ${closest.distance.toFixed(1)} km`
    );
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-2">
        Geo-Análisis de Polos de Desarrollo (3D)
      </h1>

      <p className="text-center text-sm text-gray-600 mb-4">{status}</p>

      <div
        ref={mapContainer}
        className="w-full h-[75vh] rounded-2xl shadow-2xl overflow-hidden"
      ></div>

      <p className="mt-4 text-center text-gray-500 text-xs">
        Demo con Mapbox + Terreno 3D + geolocalización
      </p>
    </main>
  );
}
