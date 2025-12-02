"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Users, Package, TrendingUp, ShoppingCart, UserCheck, Clock, Award } from "lucide-react";
import Link from "next/link";

interface CooperativaInfo {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string[];
  region: string;
  total_miembros: number;
  total_productos: number;
  total_ventas: number;
  miembros_objetivo: number;
}

interface Stats {
  miembros_activos: number;
  productos_activos: number;
  solicitudes_pendientes: number;
  ventas_mes: number;
}

export default function CooperativaDashboard() {
  const [cooperativa, setCooperativa] = useState<CooperativaInfo | null>(null);
  const [stats, setStats] = useState<Stats>({
    miembros_activos: 0,
    productos_activos: 0,
    solicitudes_pendientes: 0,
    ventas_mes: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener cooperativa del usuario (es el creador)
      const { data: coopData, error: coopError } = await supabase
        .from("cooperativas")
        .select("*")
        .eq("creada_por", user.id)
        .single();

      if (coopError) throw coopError;
      if (!coopData) {
        alert("No tienes una cooperativa creada");
        return;
      }

      setCooperativa(coopData);

      // Obtener estadísticas
      // Miembros activos
      const { count: miembrosCount } = await supabase
        .from("cooperativa_miembros")
        .select("*", { count: "exact", head: true })
        .eq("cooperativa_id", coopData.id);

      // Productos activos
      const { count: productosCount } = await supabase
        .from("productos")
        .select("*", { count: "exact", head: true })
        .eq("cooperativa_id", coopData.id)
        .eq("estado", "disponible");

      // Solicitudes pendientes
      const { count: solicitudesCount } = await supabase
        .from("solicitudes_cooperativas")
        .select("*", { count: "exact", head: true })
        .eq("cooperativa_id", coopData.id)
        .eq("estado", "pendiente");

      setStats({
        miembros_activos: miembrosCount || 0,
        productos_activos: productosCount || 0,
        solicitudes_pendientes: solicitudesCount || 0,
        ventas_mes: coopData.total_ventas || 0
      });

    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!cooperativa) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No tienes una cooperativa</h2>
        <Link href="/dashboard/cooperativas/crear" className="text-cyan-600 hover:text-cyan-700">
          Crear una cooperativa
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{cooperativa.nombre}</h1>
            <p className="text-gray-600">{cooperativa.descripcion}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          {cooperativa.categoria && cooperativa.categoria.map((cat, idx) => (
            <span key={idx} className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm font-medium rounded-full">
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/dashboard/miembros" className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            {stats.solicitudes_pendientes > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {stats.solicitudes_pendientes}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.miembros_activos}</h3>
          <p className="text-gray-600 text-sm">Miembros Activos</p>
          <div className="mt-2 text-xs text-gray-500">
            Objetivo: {cooperativa.miembros_objetivo}
          </div>
        </Link>

        <Link href="/dashboard/productos" className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.productos_activos}</h3>
          <p className="text-gray-600 text-sm">Productos Activos</p>
        </Link>

        <Link href="/dashboard/solicitudes" className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            {stats.solicitudes_pendientes > 0 && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                ¡Nuevo!
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.solicitudes_pendientes}</h3>
          <p className="text-gray-600 text-sm">Solicitudes Pendientes</p>
        </Link>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">${stats.ventas_mes.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Ventas Totales</p>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-600" />
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/solicitudes"
            className="p-4 border-2 border-cyan-200 rounded-lg hover:border-cyan-400 hover:bg-cyan-50 transition flex items-center gap-3"
          >
            <UserCheck className="w-5 h-5 text-cyan-600" />
            <div>
              <p className="font-semibold text-gray-900">Revisar Solicitudes</p>
              <p className="text-xs text-gray-600">Aprobar nuevos miembros</p>
            </div>
          </Link>

          <Link
            href="/dashboard/productos"
            className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition flex items-center gap-3"
          >
            <Package className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-gray-900">Gestionar Productos</p>
              <p className="text-xs text-gray-600">Ver y editar productos</p>
            </div>
          </Link>

          <Link
            href="/dashboard/miembros"
            className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition flex items-center gap-3"
          >
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900">Ver Miembros</p>
              <p className="text-xs text-gray-600">Gestionar tu equipo</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Info de la Cooperativa */}
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl shadow-sm border border-cyan-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Información de la Cooperativa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Región</p>
            <p className="font-semibold text-gray-900">{cooperativa.region || "No especificada"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Miembros / Objetivo</p>
            <p className="font-semibold text-gray-900">
              {stats.miembros_activos} / {cooperativa.miembros_objetivo}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Productos Totales</p>
            <p className="font-semibold text-gray-900">{cooperativa.total_productos}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Estado</p>
            <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Activa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}



