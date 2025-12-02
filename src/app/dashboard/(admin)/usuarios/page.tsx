"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Users, Search, Filter, Mail, Phone, Calendar, Shield, Building2, Store } from "lucide-react";

interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  rol: string;
  tipo_usuario: string;
  created_at: string;
  onboarding_completed: boolean;
  email?: string;
}

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    filterUsuarios();
  }, [searchTerm, filterTipo, usuarios]);

  async function loadUsuarios() {
    try {
      // Obtener usuarios de la tabla
      const { data: usuariosData, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Obtener emails de auth.users
      const usuariosConEmail = await Promise.all(
        (usuariosData || []).map(async (usuario) => {
          const { data: authData } = await supabase
            .from("usuarios")
            .select("id")
            .eq("id", usuario.id)
            .single();
          
          // Obtener email de auth
          const { data: { user } } = await supabase.auth.admin.getUserById(usuario.id);
          
          return {
            ...usuario,
            email: user?.email || "No disponible"
          };
        })
      );

      setUsuarios(usuariosConEmail);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  }

  function filterUsuarios() {
    let filtered = [...usuarios];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (filterTipo !== "todos") {
      filtered = filtered.filter(u => u.tipo_usuario === filterTipo);
    }

    setFilteredUsuarios(filtered);
  }

  const getTipoBadge = (tipo: string) => {
    const styles = {
      normal: "bg-blue-100 text-blue-700",
      cooperativa: "bg-green-100 text-green-700",
      empresa: "bg-purple-100 text-purple-700",
      admin: "bg-red-100 text-red-700"
    };

    const icons = {
      normal: Users,
      cooperativa: Store,
      empresa: Building2,
      admin: Shield
    };

    const Icon = icons[tipo as keyof typeof icons] || Users;
    const style = styles[tipo as keyof typeof styles] || styles.normal;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
        <Icon className="w-3 h-3" />
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </span>
    );
  };

  const stats = {
    total: usuarios.length,
    normal: usuarios.filter(u => u.tipo_usuario === "normal").length,
    cooperativa: usuarios.filter(u => u.tipo_usuario === "cooperativa").length,
    empresa: usuarios.filter(u => u.tipo_usuario === "empresa").length,
    admin: usuarios.filter(u => u.tipo_usuario === "admin").length,
  };

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
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600">Administra todos los usuarios del sistema</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-blue-50 rounded-xl shadow p-4">
            <p className="text-sm text-blue-600 mb-1">Normales</p>
            <p className="text-2xl font-bold text-blue-900">{stats.normal}</p>
          </div>
          <div className="bg-green-50 rounded-xl shadow p-4">
            <p className="text-sm text-green-600 mb-1">Cooperativas</p>
            <p className="text-2xl font-bold text-green-900">{stats.cooperativa}</p>
          </div>
          <div className="bg-purple-50 rounded-xl shadow p-4">
            <p className="text-sm text-purple-600 mb-1">Empresas</p>
            <p className="text-2xl font-bold text-purple-900">{stats.empresa}</p>
          </div>
          <div className="bg-red-50 rounded-xl shadow p-4">
            <p className="text-sm text-red-600 mb-1">Admins</p>
            <p className="text-2xl font-bold text-red-900">{stats.admin}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="todos">Todos los tipos</option>
                <option value="normal">Normal</option>
                <option value="cooperativa">Cooperativa</option>
                <option value="empresa">Empresa</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Onboarding
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                          {usuario.nombre.charAt(0)}{usuario.apellidos.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {usuario.nombre} {usuario.apellidos}
                          </p>
                          <p className="text-sm text-gray-500">{usuario.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {usuario.email}
                        </div>
                        {usuario.telefono && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {usuario.telefono}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getTipoBadge(usuario.tipo_usuario)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(usuario.created_at).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {usuario.onboarding_completed ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          Completado
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                          Pendiente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsuarios.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No se encontraron usuarios con los filtros aplicados
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500 text-center">
          Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
        </div>
      </div>
    </ProtectedRoute>
  );
}



