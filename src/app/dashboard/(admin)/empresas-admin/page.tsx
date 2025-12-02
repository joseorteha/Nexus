"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Building2, MapPin, TrendingUp, Calendar, ShoppingCart } from "lucide-react";

interface Empresa {
  id: string;
  nombre_empresa: string;
  ubicacion: string;
  necesidades: string;
  volumen_demanda: string;
  frecuencia_compra: string;
  telefono: string;
  email: string;
  created_at: string;
}

export default function EmpresasAdminPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmpresas();
  }, []);

  async function loadEmpresas() {
    try {
      const { data, error } = await supabase
        .from("empresas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmpresas(data || []);
    } catch (error) {
      console.error("Error cargando empresas:", error);
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
            <Building2 className="w-8 h-8 text-purple-600" />
            Gestión de Empresas
          </h1>
          <p className="text-gray-600">Monitorea empresas compradoras</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Empresas</p>
            <p className="text-3xl font-bold text-gray-900">{empresas.length}</p>
          </div>
          <div className="bg-purple-50 rounded-xl shadow p-6">
            <p className="text-sm text-purple-600 mb-1">Con Alta Demanda</p>
            <p className="text-3xl font-bold text-purple-900">
              {empresas.filter(e => e.volumen_demanda === "alto").length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl shadow p-6">
            <p className="text-sm text-blue-600 mb-1">Compra Frecuente</p>
            <p className="text-3xl font-bold text-blue-900">
              {empresas.filter(e => e.frecuencia_compra === "semanal").length}
            </p>
          </div>
        </div>

        {/* Lista */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {empresas.map((empresa) => (
            <div key={empresa.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{empresa.nombre_empresa}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    {empresa.ubicacion}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{empresa.necesidades}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  {empresa.volumen_demanda}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  {empresa.frecuencia_compra}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {new Date(empresa.created_at).toLocaleDateString("es-MX")}
              </div>
            </div>
          ))}
        </div>

        {empresas.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No hay empresas registradas</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}



