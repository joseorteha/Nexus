"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Map, MapPin, TrendingUp, Users, Package } from "lucide-react";
import { MapaPolosEconomicos } from "@/components/modules/admin/MapaPolosEconomicos";

export default function PolosEconomicosPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Map className="w-8 h-8 text-primary" />
            Polos Económicos de Veracruz
          </h1>
          <p className="text-gray-600">
            Visualiza y gestiona los polos económicos, cooperativas y productores en las regiones
          </p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Polos Activos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Cooperativas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Productos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">156</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600">Crecimiento</span>
            </div>
            <p className="text-2xl font-bold text-green-600">+23%</p>
          </div>
        </div>

        {/* Mapa Interactivo 3D */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Map className="w-5 h-5" />
            Mapa Interactivo 3D de Polos Económicos
          </h2>
          
          <MapaPolosEconomicos height="600px" showLegend={true} />
        </div>

        {/* Lista de Polos Económicos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Polos Económicos Registrados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ejemplo de Polo Económico */}
            {[
              { nombre: "Zongolica", cooperativas: 8, productos: "Café, Artesanías", color: "blue" },
              { nombre: "Orizaba", cooperativas: 6, productos: "Textiles, Miel", color: "green" },
              { nombre: "Córdoba", cooperativas: 5, productos: "Café, Alimentos", color: "purple" },
              { nombre: "Fortín", cooperativas: 3, productos: "Bebidas, Orgánicos", color: "orange" },
            ].map((polo, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <MapPin className={`w-5 h-5 text-${polo.color}-600`} />
                      {polo.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{polo.productos}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${polo.color}-100 text-${polo.color}-700`}>
                    {polo.cooperativas} cooperativas
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="text-sm text-primary hover:underline">
                    Ver en mapa
                  </button>
                  <span className="text-gray-300">•</span>
                  <button className="text-sm text-primary hover:underline">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}



