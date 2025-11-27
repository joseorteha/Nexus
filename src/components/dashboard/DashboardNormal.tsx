"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package, TrendingUp, ShoppingBag, Users, Heart, Store, ArrowRight, Zap } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { ActionCard } from "./ActionCard";

interface DashboardNormalProps {
  stats: {
    productos: number;
    ventas: number;
    cooperativa: string | null;
  };
}

export function DashboardNormal({ stats }: DashboardNormalProps) {
  return (
    <>
      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
      >
        <StatsCard
          icon={<Package className="w-6 h-6" />}
          label="Mis Productos"
          value={stats.productos}
          color="cyan"
          trend="+12%"
        />
        <StatsCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Ventas"
          value={`$${stats.ventas.toLocaleString()}`}
          color="blue"
          trend="+8%"
        />
        <StatsCard
          icon={<ShoppingBag className="w-6 h-6" />}
          label="En Marketplace"
          value={stats.productos}
          color="purple"
        />
        <StatsCard
          icon={<Users className="w-6 h-6" />}
          label="Cooperativa"
          value={stats.cooperativa || "Sin cooperativa"}
          color="green"
          isText
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-cyan-600" />
          Acciones Rápidas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            icon={<Package />}
            title="Mis Productos"
            description="Gestiona tu inventario personal"
            href="/dashboard/productos"
            gradient="from-cyan-500 to-blue-500"
          />
          <ActionCard
            icon={<ShoppingBag />}
            title="Marketplace"
            description="Explora productos disponibles"
            href="/dashboard/marketplace"
            gradient="from-blue-500 to-purple-500"
          />
          <ActionCard
            icon={<Heart />}
            title="Match"
            description="Encuentra cooperativas"
            href="/dashboard/match"
            gradient="from-purple-500 to-pink-500"
          />
        </div>
      </motion.div>

      {/* Cooperativa Section */}
      {!stats.cooperativa && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border border-cyan-100 shadow-xl"
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Potencia tu negocio en equipo
              </h3>
              <p className="text-gray-600 mb-6">
                Las cooperativas te permiten acceder a mejores precios, compartir recursos y aumentar tu volumen de venta
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <BenefitItem text="Mejores precios" />
                <BenefitItem text="Recursos compartidos" />
                <BenefitItem text="Mayor volumen" />
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/dashboard/cooperativas/crear"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                >
                  <Store className="w-5 h-5" />
                  Crear Cooperativa
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard/match"
                  className="inline-flex items-center gap-2 bg-white text-cyan-600 px-6 py-3 rounded-xl font-semibold border-2 border-cyan-200 hover:border-cyan-300 transition-all hover:scale-105"
                >
                  <Users className="w-5 h-5" />
                  Unirse a Cooperativa
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
}
