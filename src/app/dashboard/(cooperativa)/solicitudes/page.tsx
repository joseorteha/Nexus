"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { UserCheck, UserX, Clock, CheckCircle, XCircle, Sparkles, MapPin, Package } from "lucide-react";

interface Solicitud {
  id: string;
  tipo: string;
  user_id: string;
  nombre_usuario: string;
  email_usuario: string;
  datos_cooperativa: {
    productos?: string[];
    categorias?: string[];
    region?: string;
    capacidad_produccion?: string;
    match_score?: number;
  } | null;
  estado: string;
  fecha_solicitud: string;
}

export default function SolicitudesCooperativaPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cooperativaId, setCooperativaId] = useState<string | null>(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  async function cargarSolicitudes() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener cooperativa del usuario
      const { data: coopData } = await supabase
        .from("cooperativas")
        .select("id")
        .eq("creada_por", user.id)
        .single();

      if (!coopData) return;
      setCooperativaId(coopData.id);

      // Obtener solicitudes pendientes
      const { data, error } = await supabase
        .from("solicitudes_cooperativas")
        .select("*")
        .eq("cooperativa_id", coopData.id)
        .eq("tipo", "unirse")
        .eq("estado", "pendiente")
        .order("fecha_solicitud", { ascending: false });

      if (error) throw error;
      setSolicitudes(data || []);

    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAprobar(solicitud: Solicitud) {
    if (!cooperativaId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Agregar al usuario como miembro
      const { error: miembroError } = await supabase
        .from("cooperativa_miembros")
        .insert({
          cooperativa_id: cooperativaId,
          user_id: solicitud.user_id,
          rol: "miembro"
        });

      if (miembroError) throw miembroError;

      // 2. Actualizar el contador de miembros
      const { data: coopData } = await supabase
        .from("cooperativas")
        .select("total_miembros")
        .eq("id", cooperativaId)
        .single();

      if (coopData) {
        await supabase
          .from("cooperativas")
          .update({ total_miembros: (coopData.total_miembros || 0) + 1 })
          .eq("id", cooperativaId);
      }

      // 3. Actualizar solicitud a aprobada
      const { error: updateError } = await supabase
        .from("solicitudes_cooperativas")
        .update({
          estado: "aprobada",
          revisada_por: user.id,
          fecha_revision: new Date().toISOString()
        })
        .eq("id", solicitud.id);

      if (updateError) throw updateError;

      // 4. Actualizar tipo de usuario a cooperativa
      await supabase
        .from("usuarios")
        .update({ tipo_usuario: "cooperativa" })
        .eq("id", solicitud.user_id);

      alert("✅ Solicitud aprobada! El usuario ahora es miembro de la cooperativa.");
      cargarSolicitudes();

    } catch (error: any) {
      console.error("Error aprobando solicitud:", error);
      alert("Error al aprobar solicitud: " + error.message);
    }
  }

  async function handleRechazar(solicitud: Solicitud) {
    if (!confirm("¿Estás seguro de rechazar esta solicitud?")) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("solicitudes_cooperativas")
        .update({
          estado: "rechazada",
          revisada_por: user.id,
          fecha_revision: new Date().toISOString()
        })
        .eq("id", solicitud.id);

      if (error) throw error;

      alert("Solicitud rechazada");
      cargarSolicitudes();

    } catch (error: any) {
      console.error("Error rechazando solicitud:", error);
      alert("Error al rechazar solicitud: " + error.message);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Solicitudes de Membresía
          </h1>
        </div>
        <p className="text-gray-600 ml-[60px]">
          Revisa y aprueba las solicitudes para unirse a tu cooperativa
        </p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Solicitudes Pendientes</p>
            <p className="text-2xl font-bold text-gray-900">{solicitudes.length}</p>
          </div>
          {solicitudes.length > 0 && (
            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Requieren atención
            </span>
          )}
        </div>
      </div>

      {/* Lista de Solicitudes */}
      {solicitudes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ¡Todo al día!
          </h3>
          <p className="text-gray-600">
            No hay solicitudes pendientes en este momento
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {solicitudes.map((solicitud) => (
            <div
              key={solicitud.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {solicitud.nombre_usuario}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{solicitud.email_usuario}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        Solicitó el {new Date(solicitud.fecha_solicitud).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric"
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Match Score */}
                  {solicitud.datos_cooperativa?.match_score && solicitud.datos_cooperativa.match_score > 0 && (
                    <div className="bg-green-100 rounded-full px-4 py-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-green-700">Compatibilidad</p>
                        <p className="text-lg font-bold text-green-900">
                          {solicitud.datos_cooperativa.match_score}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Información del Perfil */}
                {solicitud.datos_cooperativa && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Información del Solicitante</h4>
                    
                    {solicitud.datos_cooperativa.productos && solicitud.datos_cooperativa.productos.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          Productos
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {solicitud.datos_cooperativa.productos.map((prod, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              {prod}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {solicitud.datos_cooperativa.categorias && solicitud.datos_cooperativa.categorias.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Categorías</p>
                        <div className="flex flex-wrap gap-2">
                          {solicitud.datos_cooperativa.categorias.map((cat, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {solicitud.datos_cooperativa.region && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Región
                          </p>
                          <p className="font-medium text-gray-900 text-sm">{solicitud.datos_cooperativa.region}</p>
                        </div>
                      )}

                      {solicitud.datos_cooperativa.capacidad_produccion && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Capacidad de Producción</p>
                          <p className="font-medium text-gray-900 text-sm">{solicitud.datos_cooperativa.capacidad_produccion}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRechazar(solicitud)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleAprobar(solicitud)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Aprobar y Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
