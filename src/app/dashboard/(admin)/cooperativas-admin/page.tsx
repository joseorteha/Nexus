"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Users, MapPin, Package, TrendingUp, Calendar, Eye } from "lucide-react";

interface Cooperativa {
  id: string;
  nombre: string;
  descripcion: string;
  region: string;
  categoria: string[];
  total_miembros: number;
  total_productos: number;
  created_at: string;
  buscando_miembros: boolean;
  estado: string;
}

export default function CooperativasAdminPage() {
  const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCooperativas();
  }, []);

  async function loadCooperativas() {
    try {
      const { data, error } = await supabase
        .from("cooperativas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCooperativas(data || []);
    } catch (error) {
      console.error("Error cargando cooperativas:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-green-600" />
            Gestión de Cooperativas
          </h1>
          <p className="text-gray-600">Monitorea y administra todas las cooperativas</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Cooperativas</p>
            <p className="text-3xl font-bold text-gray-900">{cooperativas.length}</p>
          </div>
          <div className="bg-green-50 rounded-xl shadow p-6">
            <p className="text-sm text-green-600 mb-1">Activas</p>
            <p className="text-3xl font-bold text-green-900">
              {cooperativas.filter(c => c.estado === "active").length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl shadow p-6">
            <p className="text-sm text-blue-600 mb-1">Total Miembros</p>
            <p className="text-3xl font-bold text-blue-900">
              {cooperativas.reduce((sum, c) => sum + (c.total_miembros || 0), 0)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl shadow p-6">
            <p className="text-sm text-purple-600 mb-1">Buscando Miembros</p>
            <p className="text-3xl font-bold text-purple-900">
              {cooperativas.filter(c => c.buscando_miembros).length}
            </p>
          </div>
        </div>

        {/* Lista de Cooperativas */}
        <div className="grid grid-cols-1 gap-4">
          {cooperativas.map((coop) => (
            <div key={coop.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{coop.nombre}</h3>
                    {coop.buscando_miembros && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Buscando Miembros
                      </span>
                    )}
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      coop.estado === "active" 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {coop.estado}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{coop.descripcion}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {coop.categoria?.map((cat, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {coop.region || "No especificado"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {coop.total_miembros} miembros
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {coop.total_productos || 0} productos
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(coop.created_at).toLocaleDateString("es-MX")}
                    </div>
                  </div>
                </div>

                <button className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {cooperativas.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No hay cooperativas registradas</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}



