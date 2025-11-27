"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Phone, 
  Mail,
  Building2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Solicitud {
  id: string;
  tipo: "crear" | "unirse";
  user_id: string;
  nombre_usuario: string;
  email_usuario: string;
  cooperativa_id?: string;
  nombre_cooperativa: string;
  datos_cooperativa: any;
  estado: "pendiente" | "en_revision" | "aprobada" | "rechazada";
  fecha_solicitud: string;
  notas_revision?: string;
}

export default function SolicitudesCooperativasPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("pendiente");
  const [loading, setLoading] = useState(true);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<Solicitud | null>(null);

  useEffect(() => {
    loadSolicitudes();
  }, [filtroEstado]);

  async function loadSolicitudes() {
    try {
      let query = supabase
        .from("solicitudes_cooperativas")
        .select("*")
        .order("fecha_solicitud", { ascending: false });

      if (filtroEstado !== "todas") {
        query = query.eq("estado", filtroEstado);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSolicitudes(data || []);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function aprobarSolicitud(solicitud: Solicitud) {
    if (!confirm(`¿Aprobar la solicitud de ${solicitud.nombre_usuario} para crear "${solicitud.nombre_cooperativa}"?`)) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      // 1. Crear la cooperativa
      const { data: cooperativa, error: errorCooperativa } = await supabase
        .from("cooperativas")
        .insert({
          nombre: solicitud.datos_cooperativa.nombre,
          descripcion: solicitud.datos_cooperativa.descripcion,
          creada_por: solicitud.user_id,
          categoria: solicitud.datos_cooperativa.categorias,
          region: solicitud.datos_cooperativa.region,
          capacidad_produccion: solicitud.datos_cooperativa.capacidad_produccion,
          productos_ofrecidos: solicitud.datos_cooperativa.productos_ofrecidos,
          certificaciones: solicitud.datos_cooperativa.certificaciones,
          buscando_miembros: true,
          miembros_objetivo: 10,
          total_miembros: 1,
          estado: "active"
        })
        .select()
        .single();

      if (errorCooperativa) throw errorCooperativa;

      // 2. Agregar al fundador como miembro
      const { error: miembroError } = await supabase
        .from("cooperativa_miembros")
        .insert({
          cooperativa_id: cooperativa.id,
          user_id: solicitud.user_id,
          rol: "fundador"
        });

      if (miembroError) throw miembroError;

      // 3. Actualizar tipo de usuario a cooperativa
      console.log(`🔄 Convirtiendo usuario ${solicitud.user_id} a cooperativa...`);
      
      const { data: updateData, error: updateUserError } = await supabase
        .from("usuarios")
        .update({ 
          tipo_usuario: "cooperativa",
          rol: "normal_user" // Mantener rol normal_user pero cambiar tipo
        })
        .eq("id", solicitud.user_id)
        .select();

      if (updateUserError) {
        console.error("❌ Error actualizando tipo de usuario:", updateUserError);
        throw updateUserError;
      }

      console.log("✅ Usuario convertido a cooperativa:", updateData);

      // 4. Actualizar la solicitud
      const { error: solicitudError } = await supabase
        .from("solicitudes_cooperativas")
        .update({
          estado: "aprobada",
          revisada_por: user.id,
          fecha_revision: new Date().toISOString(),
          cooperativa_id: cooperativa.id
        })
        .eq("id", solicitud.id);

      if (solicitudError) throw solicitudError;

      alert("✅ ¡Solicitud aprobada!\n\n" +
            `• Cooperativa "${solicitud.nombre_cooperativa}" creada\n` +
            `• ${solicitud.nombre_usuario} ahora es fundador\n` +
            `• Cuenta convertida a tipo: cooperativa\n` +
            `• Ahora verá el dashboard de cooperativa`);
      loadSolicitudes();
      setSolicitudSeleccionada(null);
    } catch (error: any) {
      console.error("Error aprobando solicitud:", error);
      alert("Error al aprobar: " + error.message);
    }
  }

  async function rechazarSolicitud(solicitud: Solicitud) {
    const notas = prompt("Motivo del rechazo (será enviado al usuario):");
    if (!notas) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      await supabase
        .from("solicitudes_cooperativas")
        .update({
          estado: "rechazada",
          revisada_por: user.id,
          fecha_revision: new Date().toISOString(),
          notas_revision: notas
        })
        .eq("id", solicitud.id);

      alert("Solicitud rechazada. El usuario recibirá feedback.");
      loadSolicitudes();
      setSolicitudSeleccionada(null);
    } catch (error: any) {
      console.error("Error rechazando solicitud:", error);
      alert("Error al rechazar: " + error.message);
    }
  }

  async function marcarEnRevision(solicitud: Solicitud) {
    try {
      await supabase
        .from("solicitudes_cooperativas")
        .update({ estado: "en_revision" })
        .eq("id", solicitud.id);

      alert("Marcado como 'en revisión'");
      loadSolicitudes();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const estadoBadge = (estado: string) => {
    const badges = {
      pendiente: "bg-yellow-100 text-yellow-800",
      en_revision: "bg-blue-100 text-blue-800",
      aprobada: "bg-green-100 text-green-800",
      rechazada: "bg-red-100 text-red-800",
    };
    return badges[estado as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-primary" />
            Solicitudes de Cooperativas
          </h1>
          <p className="text-gray-600">
            Gestiona y aprueba solicitudes de creación de cooperativas
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filtroEstado === "pendiente" ? "default" : "outline"}
            onClick={() => setFiltroEstado("pendiente")}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Pendientes
          </Button>
          <Button
            variant={filtroEstado === "en_revision" ? "default" : "outline"}
            onClick={() => setFiltroEstado("en_revision")}
          >
            En Revisión
          </Button>
          <Button
            variant={filtroEstado === "aprobada" ? "default" : "outline"}
            onClick={() => setFiltroEstado("aprobada")}
          >
            Aprobadas
          </Button>
          <Button
            variant={filtroEstado === "rechazada" ? "default" : "outline"}
            onClick={() => setFiltroEstado("rechazada")}
          >
            Rechazadas
          </Button>
          <Button
            variant={filtroEstado === "todas" ? "default" : "outline"}
            onClick={() => setFiltroEstado("todas")}
          >
            Todas
          </Button>
        </div>

        {/* Lista de Solicitudes */}
        {solicitudes.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay solicitudes {filtroEstado !== "todas" ? filtroEstado + "s" : ""}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {solicitudes.map((solicitud) => (
              <div key={solicitud.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {solicitud.nombre_cooperativa}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoBadge(solicitud.estado)}`}>
                        {solicitud.estado}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {solicitud.nombre_usuario}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {solicitud.email_usuario}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {solicitud.datos_cooperativa?.descripcion}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {solicitud.datos_cooperativa?.categorias?.map((cat: string) => (
                        <span key={cat} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {cat}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500">
                      Solicitado: {new Date(solicitud.fecha_solicitud).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {solicitud.estado === "pendiente" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => marcarEnRevision(solicitud)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          En Revisión
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => aprobarSolicitud(solicitud)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => rechazarSolicitud(solicitud)}
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </Button>
                      </>
                    )}

                    {solicitud.estado === "en_revision" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => aprobarSolicitud(solicitud)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => rechazarSolicitud(solicitud)}
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSolicitudSeleccionada(solicitud)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>

                {solicitud.notas_revision && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Notas de Revisión:</p>
                    <p className="text-sm text-gray-600">{solicitud.notas_revision}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalles */}
        {solicitudSeleccionada && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">{solicitudSeleccionada.nombre_cooperativa}</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Descripción</h3>
                  <p className="text-gray-600">{solicitudSeleccionada.datos_cooperativa?.descripcion}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Región</h3>
                  <p className="text-gray-600">{solicitudSeleccionada.datos_cooperativa?.region}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Capacidad de Producción</h3>
                  <p className="text-gray-600">{solicitudSeleccionada.datos_cooperativa?.capacidad_produccion}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Productos Ofrecidos</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {solicitudSeleccionada.datos_cooperativa?.productos_ofrecidos?.map((prod: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Contacto</h3>
                  <p className="text-gray-600">
                    {solicitudSeleccionada.nombre_usuario}<br />
                    {solicitudSeleccionada.email_usuario}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSolicitudSeleccionada(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
