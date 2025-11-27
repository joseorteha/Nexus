// 🏠 DASHBOARD HOME - Adaptado según tipo de usuario
// URL: /dashboard

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Package, ShoppingBag, Users, TrendingUp, Heart, Store, ArrowRight, Award } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    productos: 0,
    ventas: 0,
    cooperativa: null as string | null,
    rolCooperativa: null as string | null
  });

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("usuarios")
        .select("tipo_usuario, nombre, apellidos")
        .eq("id", user.id)
        .single();

      setTipoUsuario(userData?.tipo_usuario || "normal");
      setUserName(`${userData?.nombre || ""} ${userData?.apellidos || ""}`.trim() || "Usuario");

      // Cargar estadísticas si es usuario normal
      if (userData?.tipo_usuario === "normal") {
        await loadStats(user.id);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats(userId: string) {
    try {
      // Contar productos del usuario
      const { count: productosCount } = await supabase
        .from("productos")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userId);

      // Verificar si es miembro de alguna cooperativa
      const { data: cooperativaData } = await supabase
        .from("cooperativa_miembros")
        .select(`
          rol,
          cooperativas (
            nombre
          )
        `)
        .eq("user_id", userId)
        .single();

      setStats({
        productos: productosCount || 0,
        ventas: 0, // TODO: Implementar cuando haya tabla de ventas
        cooperativa: (cooperativaData?.cooperativas as any)?.nombre || null,
        rolCooperativa: cooperativaData?.rol || null
      });
    } catch (error) {
      console.log("No se pudieron cargar las estadísticas", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Dashboard para Usuario Normal
  if (tipoUsuario === "normal") {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            ¡Bienvenido, {userName}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            {stats.cooperativa 
              ? `Miembro de ${stats.cooperativa} · ${stats.rolCooperativa}` 
              : "Gestiona tus productos y encuentra oportunidades de negocio"
            }
          </p>
        </div>

        {/* Tarjetas de Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Mis Productos */}
          <Link href="/dashboard/productos" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-transparent hover:border-primary transition-all hover:shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Mis Productos</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Administra tu inventario y agrega nuevos productos
              </p>
              <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                Gestionar
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Marketplace */}
          <Link href="/dashboard/marketplace" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-transparent hover:border-green-500 transition-all hover:shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Marketplace</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Vende tus productos y explora el mercado
              </p>
              <div className="flex items-center text-green-600 font-medium group-hover:gap-2 transition-all">
                Explorar
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Match con Cooperativas */}
          <Link href="/dashboard/match" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-transparent hover:border-pink-500 transition-all hover:shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Match</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Descubre cooperativas buscando miembros en tu región
              </p>
              <div className="flex items-center text-pink-600 font-medium group-hover:gap-2 transition-all">
                Ver convocatorias
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Sección de Cooperativas */}
        {!stats.cooperativa && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border border-blue-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🚀 Potencia tu negocio en equipo
                </h2>
                <p className="text-gray-700 mb-4">
                  Las cooperativas en Nexus te permiten <strong>unir fuerzas con otros productores</strong> de tu región para:
                  <br />✓ Acceder a mejores precios y contratos con empresas grandes
                  <br />✓ Compartir recursos y reducir costos de producción
                  <br />✓ Aumentar tu volumen de venta y visibilidad en el mercado
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/dashboard/cooperativas/crear">
                <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-500">
                  <Store className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    🏢 Crear Cooperativa
                  </h3>
                  <p className="text-sm text-gray-600">
                    Lanza una convocatoria y reúne miembros para tu cooperativa
                  </p>
                </div>
              </Link>

              <Link href="/dashboard/match">
                <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-cyan-500">
                  <Heart className="w-8 h-8 text-pink-600 mb-3" />
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    💼 Unirse a Cooperativa
                  </h3>
                  <p className="text-sm text-gray-600">
                    Explora convocatorias activas en el Match y solicita unirte
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Si ya es miembro de cooperativa */}
        {stats.cooperativa && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Eres parte de {stats.cooperativa}! 🎉
                </h2>
                <p className="text-gray-700 mb-4">
                  Como <strong>{stats.rolCooperativa}</strong>, ahora tienes acceso a herramientas avanzadas para gestionar la cooperativa.
                </p>
                <Link href="/dashboard/erp">
                  <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-lg hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-green-500">
                    <Package className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Ir al ERP Cooperativo</span>
                    <ArrowRight className="w-4 h-4 text-green-600" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-primary" />
              <span className="text-sm text-gray-600">Mis Productos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.productos}</p>
            <p className="text-xs text-gray-500 mt-1">en inventario</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Ventas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${stats.ventas}</p>
            <p className="text-xs text-gray-500 mt-1">este mes</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Marketplace</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.productos}</p>
            <p className="text-xs text-gray-500 mt-1">publicados</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Cooperativa</span>
            </div>
            {stats.cooperativa ? (
              <>
                <p className="text-sm font-bold text-gray-900 truncate">{stats.cooperativa}</p>
                <p className="text-xs text-blue-600 mt-1">{stats.rolCooperativa}</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-400">Sin cooperativa</p>
                <p className="text-xs text-gray-500 mt-1">explora el Match</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard genérico para otros roles (por ahora)
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">🏠 Dashboard</h1>
      <p className="text-gray-600">
        Dashboard para tipo de usuario: <strong>{tipoUsuario}</strong>
      </p>
    </div>
  );
}
