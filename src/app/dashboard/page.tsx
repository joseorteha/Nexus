"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Store, ArrowRight, Award, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardNormal } from "@/components/dashboard/DashboardNormal";
import { DashboardEmpresa } from "@/components/dashboard/DashboardEmpresa";
import { TipoUsuario } from "@/lib/permissions";

export default function DashboardPage() {
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("normal");
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

      console.log("🔍 Usuario cargado:", userData);
      console.log("🔍 Tipo de usuario:", userData?.tipo_usuario);

      setTipoUsuario(userData?.tipo_usuario || "normal");

      // Si es empresa, cargar el nombre de la empresa
      if (userData?.tipo_usuario === "empresa") {
        const { data: empresaData } = await supabase
          .from("empresas")
          .select("razon_social")
          .eq("user_id", user.id)
          .single();
        
        setUserName(empresaData?.razon_social || "Empresa");
      } else if (userData?.tipo_usuario === "cooperativa") {
        // Si es cooperativa, cargar el nombre de la cooperativa
        const { data: coopData } = await supabase
          .from("cooperativas")
          .select("nombre")
          .eq("creada_por", user.id)
          .single();
        
        setUserName(coopData?.nombre || `${userData?.nombre || ""} ${userData?.apellidos || ""}`.trim());
      } else {
        // Usuario normal o admin
        setUserName(`${userData?.nombre || ""} ${userData?.apellidos || ""}`.trim() || "Usuario");
      }

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
        .eq("propietario_id", userId)
        .eq("tipo_propietario", "individual");

      // Obtener IDs de productos del usuario
      const { data: misProductos } = await supabase
        .from("productos")
        .select("id")
        .eq("propietario_id", userId)
        .eq("tipo_propietario", "individual");

      // Calcular ventas reales de mis productos
      let totalVentas = 0;
      if (misProductos && misProductos.length > 0) {
        const productosIds = misProductos.map(p => p.id);
        
        const { data: ventasData } = await supabase
          .from("pedidos_items")
          .select("subtotal")
          .in("producto_id", productosIds);

        if (ventasData) {
          totalVentas = ventasData.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
        }
      }

      // Verificar si pertenece a una cooperativa
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
        ventas: totalVentas,
        cooperativa: (cooperativaData?.cooperativas as any)?.nombre || null,
        rolCooperativa: cooperativaData?.rol || null
      });
    } catch (error) {
      console.log("No se pudieron cargar las estadísticas", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <Sparkles className="w-6 h-6 text-cyan-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <DashboardHeader
          userName={userName}
          tipoUsuario={tipoUsuario}
          cooperativa={stats.cooperativa}
          rolCooperativa={stats.rolCooperativa}
        />

        {/* Dashboard específico por tipo de usuario */}
        {tipoUsuario === "normal" && <DashboardNormal stats={stats} />}
        {tipoUsuario === "empresa" && <DashboardEmpresa />}

        {/* Cooperativa Success Banner */}
        {tipoUsuario === "normal" && stats.cooperativa && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  ¡Eres parte de {stats.cooperativa}! 🎉
                </h3>
                <p className="text-gray-600">
                  Como {stats.rolCooperativa}, tienes acceso a herramientas avanzadas
                </p>
              </div>
            </div>
            
            <Link
              href="/dashboard/mi-cooperativa"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              <Store className="w-5 h-5" />
              Ir a Mi Cooperativa
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

