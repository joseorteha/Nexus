"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// ===============================
// TIPOS
// ===============================
interface Polo {
  id: number;
  name: string;
  lng: number;
  lat: number;
  estado: string;
  sector_principal: string;
}

interface CompanyFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    giro: string;
  };
}

export default function PageMapa() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [polesData, setPolesData] = useState<Polo[] | null>(null);
  const [companiesData, setCompaniesData] = useState<any>(null);

  // ===============================
  // CARGAR GEODATOS REALES
  // ===============================
  useEffect(() => {
    // Cargar polos
    fetch("/data/poles.geojson")
      .then((res) => res.json())
      .then((json) => {
        const polosParsed = json.features.map((f: any) => ({
          id: f.properties.id,
          name: f.properties.name,
          estado: f.properties.estado,
          sector_principal: f.properties.sector_principal,
          lng: f.geometry.coordinates[0],
          lat: f.geometry.coordinates[1],
        }));
        setPolesData(polosParsed);
      });

    // Cargar empresas
    fetch("/data/companies.geojson")
      .then((res) => res.json())
      .then((json) => setCompaniesData(json));
  }, []);

  // ===============================
  // INICIALIZAR MAPA
  // ===============================
  useEffect(() => {
    if (!polesData || !companiesData) return;
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-102, 23.5],
      zoom: 4,
      pitch: 45,
      bearing: -20,
      antialias: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      if (!map.current) return;

      // ======================
      // Terreno 3D
      // ======================
      map.current.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
      });

      map.current.setTerrain({
        source: "mapbox-dem",
        exaggeration: 1.5,
      });

      // ======================
      // Edificios 3D
      // ======================
      map.current.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 12,
        paint: {
          "fill-extrusion-color": "#aaaaaa",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-opacity": 0.6,
        },
      });

      // ====================================
      // EMPRESAS DESDE GEOJSON REAL
      // ====================================
      map.current.addSource("companies", {
        type: "geojson",
        data: companiesData,
      });

      // Capa heatmap
      map.current.addLayer({
        id: "companies-heat",
        type: "heatmap",
        source: "companies",
        maxzoom: 12,
        paint: {
          "heatmap-radius": 30,
          "heatmap-opacity": 0.5,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0,0,255,0)",
            0.5,
            "rgba(0,255,0,0.8)",
            1,
            "rgba(255,0,0,1)",
          ],
        },
      });

      // Puntos de empresas
      map.current.addLayer({
        id: "companies-points",
        type: "circle",
        source: "companies",
        paint: {
          "circle-radius": 6,
          "circle-color": [
            "match",
            ["get", "giro"],
            "logistica",
            "#2563EB",
            "manufactura",
            "#9333EA",
            "automotriz",
            "#F59E0B",
            "energia",
            "#EF4444",
            "servicios",
            "#10B981",
            "turismo",
            "#06B6D4",
            "#aaa",
          ],
          "circle-stroke-width": 1.2,
          "circle-stroke-color": "#fff",
        },
      });

      // ====================================
      // POLOS DESDE GEOJSON REAL
      // ====================================
      polesData.forEach((p) => {
        const el = document.createElement("div");
        el.className =
          "w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow cursor-pointer";

        el.onclick = () => {
          map.current?.flyTo({
            center: [p.lng, p.lat],
            zoom: 12,
            pitch: 60,
            bearing: -40,
            duration: 1800,
          });
        };

        new mapboxgl.Marker(el).setLngLat([p.lng, p.lat]).addTo(map.current!);
      });

      // ====================================
      // UBICACIÓN DEL USUARIO
      // ====================================
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { longitude, latitude } = pos.coords;
          new mapboxgl.Marker({ color: "#10B981" })
            .setLngLat([longitude, latitude])
            .addTo(map.current!);

          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: 9,
            duration: 2000,
          });
        });
      }
    });
  }, [polesData, companiesData]);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Mapa 3D de Polos y Actividad Empresarial
      </h1>

      <div className="flex gap-6 max-w-7xl mx-auto">
        <div className="flex-1 rounded-2xl shadow-xl h-[75vh] overflow-hidden">
          <div ref={mapContainer} className="w-full h-full" />
        </div>

        {/* LEYENDA */}
        <div className="w-64 p-6 bg-gray-50 rounded-2xl shadow self-start">
          <h3 className="font-bold text-lg mb-4">Simbología</h3>

          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-600 rounded-full"></span> Logística
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-purple-600 rounded-full"></span> Manufactura
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-500 rounded-full"></span> Automotriz
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-500 rounded-full"></span> Energía
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-500 rounded-full"></span> Servicios
            </div>
          </div>

          <hr className="my-4" />

          <p className="text-sm text-gray-600">
            Se muestra un mapa de calor basado en la concentración empresarial.
          </p>
        </div>
      </div>
    </div>
  );
}
