"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface Polo {
  id: number;
  name: string;
  lng: number;
  lat: number;
  estado: string;
  sector_principal: string;
}

interface MapaPolosEconomicosProps {
  height?: string;
  showLegend?: boolean;
}

export function MapaPolosEconomicos({ 
  height = "600px", 
  showLegend = true 
}: MapaPolosEconomicosProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [polesData, setPolesData] = useState<Polo[] | null>(null);
  const [companiesData, setCompaniesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos
  useEffect(() => {
    Promise.all([
      fetch("/data/poles.geojson").then((res) => res.json()),
      fetch("/data/companies.geojson").then((res) => res.json()),
    ])
      .then(([polesJson, companiesJson]) => {
        const polosParsed = polesJson.features.map((f: any) => ({
          id: f.properties.id,
          name: f.properties.name,
          estado: f.properties.estado,
          sector_principal: f.properties.sector_principal,
          lng: f.geometry.coordinates[0],
          lat: f.geometry.coordinates[1],
        }));
        setPolesData(polosParsed);
        setCompaniesData(companiesJson);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando datos del mapa:", err);
        setLoading(false);
      });
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!polesData || !companiesData) return;
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-102, 23.5], // Centro de México
      zoom: 4,
      pitch: 45,
      bearing: -20,
      antialias: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      if (!map.current) return;

      // Terreno 3D
      map.current.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
      });

      map.current.setTerrain({
        source: "mapbox-dem",
        exaggeration: 1.5,
      });

      // Edificios 3D
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

      // Empresas (heatmap + puntos)
      map.current.addSource("companies", {
        type: "geojson",
        data: companiesData,
      });

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

      // Polos Económicos (marcadores)
      polesData.forEach((p) => {
        const el = document.createElement("div");
        el.className =
          "w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform";
        el.title = p.name;

        el.onclick = () => {
          map.current?.flyTo({
            center: [p.lng, p.lat],
            zoom: 12,
            pitch: 60,
            bearing: -40,
            duration: 1800,
          });
        };

        // Popup con info del polo
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${p.name}</h3>
            <p class="text-xs text-gray-600">${p.estado}</p>
            <p class="text-xs text-gray-500">${p.sector_principal}</p>
          </div>
        `);

        new mapboxgl.Marker(el)
          .setLngLat([p.lng, p.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });
  }, [polesData, companiesData]);

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa interactivo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Mapa */}
      <div className="flex-1 rounded-xl shadow-xl overflow-hidden" style={{ height }}>
        <div ref={mapContainer} className="w-full h-full" />
      </div>

      {/* Leyenda */}
      {showLegend && (
        <div className="w-64 p-6 bg-white rounded-xl shadow-lg self-start">
          <h3 className="font-bold text-lg mb-4">Simbología</h3>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Empresas por Giro</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
                <span>Logística</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-purple-600 rounded-full"></span>
                <span>Manufactura</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                <span>Automotriz</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                <span>Energía</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                <span>Servicios</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-cyan-500 rounded-full"></span>
                <span>Turismo</span>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Polos Económicos</h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></span>
              <span>Click para ver detalle</span>
            </div>
          </div>

          <hr className="my-4" />

          <p className="text-xs text-gray-600 leading-relaxed">
            El mapa de calor muestra la concentración de actividad empresarial en cada región.
          </p>
        </div>
      )}
    </div>
  );
}
