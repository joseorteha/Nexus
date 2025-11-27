"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Users, TrendingUp, Package, Store, ArrowRight, Zap } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { ActionCard } from "./ActionCard";

export function DashboardEmpresa() {
  const { getItemCount } = useCart();
  const [stats, setStats] = useState({
    pedidosActivos: 0,
    proveedores: 0,
    totalInvertido: 0,
  });

  useEffect(() => {
    cargarStats();
  }, []);

  async function cargarStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Cargar pedidos
      const { data: pedidos } = await supabase
        .from("pedidos")
        .select("id, total, estado")
        .eq("user_id", user.id);

      const pedidosActivos = (pedidos || []).filter(
        p => p.estado === "pendiente" || p.estado === "procesando"
      ).length;

      const totalInvertido = (pedidos || []).reduce(
        (sum, p) => sum + parseFloat(p.total.toString()), 0
      );

      // Cargar proveedores únicos
      const { data: items } = await supabase
        .from("pedidos_items")
        .select("productos(propietario_id)")
        .in("pedido_id", (pedidos || []).map(p => p.id));

      const proveedoresUnicos = new Set(
        (items || []).map((i: any) => i.productos?.propietario_id).filter(Boolean)
      );

      setStats({
        pedidosActivos,
        proveedores: proveedoresUnicos.size,
        totalInvertido,
      });
    } catch (error) {
      console.error("Error cargando stats:", error);
    }
  }

  return (
    <>
      {/* Stats Grid Empresa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
      >
        <StatsCard
          icon={<ShoppingBag className="w-6 h-6" />}
          label="Pedidos Activos"
          value={stats.pedidosActivos}
          color="blue"
        />
        <StatsCard
          icon={<Users className="w-6 h-6" />}
          label="Proveedores"
          value={stats.proveedores}
          color="purple"
        />
        <StatsCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Total Invertido"
          value={`${stats.totalInvertido.toFixed(2)}`}
          color="cyan"
        />
        <StatsCard
          icon={<Package className="w-6 h-6" />}
          label="Productos en Carrito"
          value={getItemCount()}
          color="green"
        />
      </motion.div>

      {/* Acciones Rápidas Empresa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-600" />
          Acciones Rápidas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            icon={<ShoppingBag />}
            title="Mis Compras"
            description="Ver y gestionar pedidos"
            href="/dashboard/compras"
            gradient="from-blue-500 to-indigo-500"
          />
          <ActionCard
            icon={<Store />}
            title="Marketplace"
            description="Explorar productos disponibles"
            href="/dashboard/marketplace"
            gradient="from-indigo-500 to-purple-500"
          />
          <ActionCard
            icon={<Users />}
            title="Proveedores"
            description="Gestionar mis proveedores"
            href="/dashboard/proveedores"
            gradient="from-purple-500 to-pink-500"
          />
        </div>
      </motion.div>

      {/* Banner Catálogo Empresa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100 shadow-xl"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Catálogo de productos disponibles
            </h3>
            <p className="text-gray-600">
              Explora productos de cooperativas y productores locales
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">Productos certificados</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">Proveedores locales</span>
          </div>
        </div>
        
        <Link
          href="/dashboard/marketplace"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
        >
          <Store className="w-5 h-5" />
          Explorar Catálogo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </>
  );
}

