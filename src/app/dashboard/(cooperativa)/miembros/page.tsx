"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Users, Crown, UserCheck, Mail, Phone, Calendar, Trash2 } from "lucide-react";

interface Miembro {
  id: string;
  user_id: string;
  rol: string;
  fecha_ingreso: string;
  usuario: {
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
  };
}

export default function MiembrosCooperativaPage() {
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [cooperativaId, setCooperativaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarMiembros();
  }, []);

  async function cargarMiembros() {
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

      // Obtener miembros con datos de usuario
      const { data, error } = await supabase
        .from("cooperativa_miembros")
        .select(`
          id,
          user_id,
          rol,
          created_at,
          usuarios:user_id (
            nombre,
            apellidos,
            telefono
          )
        `)
        .eq("cooperativa_id", coopData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Obtener emails de auth.users
      const miembrosConEmail = await Promise.all(
        (data || []).map(async (miembro: any) => {
          const { data: userData } = await supabase.auth.admin.getUserById(miembro.user_id);
          return {
            id: miembro.id,
            user_id: miembro.user_id,
            rol: miembro.rol,
            fecha_ingreso: miembro.created_at,
            usuario: {
              nombre: miembro.usuarios.nombre,
              apellidos: miembro.usuarios.apellidos,
              telefono: miembro.usuarios.telefono,
              email: userData?.user?.email || "No disponible"
            }
          };
        })
      );

      setMiembros(miembrosConEmail);

    } catch (error) {
      console.error("Error cargando miembros:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function eliminarMiembro(miembro: Miembro) {
    if (miembro.rol === "fundador") {
      alert("No puedes eliminar al fundador de la cooperativa");
      return;
    }

    if (!confirm(`¿Eliminar a ${miembro.usuario.nombre} de la cooperativa?`)) return;

    try {
      const { error } = await supabase
        .from("cooperativa_miembros")
        .delete()
        .eq("id", miembro.id);

      if (error) throw error;

      // Actualizar contador
      if (cooperativaId) {
        const { data: coopData } = await supabase
          .from("cooperativas")
          .select("total_miembros")
          .eq("id", cooperativaId)
          .single();

        if (coopData) {
          await supabase
            .from("cooperativas")
            .update({ total_miembros: Math.max(0, (coopData.total_miembros || 1) - 1) })
            .eq("id", cooperativaId);
        }
      }

      // Cambiar tipo de usuario de vuelta a normal
      await supabase
        .from("usuarios")
        .update({ tipo_usuario: "normal" })
        .eq("id", miembro.user_id);

      alert("Miembro eliminado de la cooperativa");
      cargarMiembros();

    } catch (error: any) {
      console.error("Error eliminando miembro:", error);
      alert("Error al eliminar miembro: " + error.message);
    }
  }

  const getRolBadge = (rol: string) => {
    switch (rol) {
      case "fundador":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold rounded-full">
            <Crown className="w-3 h-3" />
            Fundador
          </span>
        );
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
            <UserCheck className="w-3 h-3" />
            Administrador
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            Miembro
          </span>
        );
    }
  };

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
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Miembros de la Cooperativa</h1>
            <p className="text-gray-600">Gestiona tu equipo</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Miembros</p>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{miembros.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Fundadores</p>
            <Crown className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {miembros.filter(m => m.rol === "fundador").length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Miembros Activos</p>
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {miembros.filter(m => m.rol === "miembro").length}
          </p>
        </div>
      </div>

      {/* Lista de Miembros */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Lista de Miembros</h2>
        </div>

        {miembros.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No hay miembros aún</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {miembros.map((miembro) => (
              <div key={miembro.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {miembro.usuario.nombre.charAt(0)}{miembro.usuario.apellidos.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {miembro.usuario.nombre} {miembro.usuario.apellidos}
                        </h3>
                        {getRolBadge(miembro.rol)}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {miembro.usuario.email}
                        </div>
                        {miembro.usuario.telefono && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {miembro.usuario.telefono}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Desde {new Date(miembro.fecha_ingreso).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  {miembro.rol !== "fundador" && (
                    <button
                      onClick={() => eliminarMiembro(miembro)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar miembro"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
