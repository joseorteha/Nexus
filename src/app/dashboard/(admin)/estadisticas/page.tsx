"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { TrendingUp, Users, Building2, Store, ShoppingCart, Package } from "lucide-react";

export default function EstadisticasAdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Estadísticas del Sistema
          </h1>
          <p className="text-gray-600">Panel de métricas y analytics</p>
        </div>

        {/* Placeholder Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 text-white">
            <Users className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Usuarios Activos</p>
            <p className="text-3xl font-bold">--</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
            <Store className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Cooperativas</p>
            <p className="text-3xl font-bold">--</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
            <Building2 className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Empresas</p>
            <p className="text-3xl font-bold">--</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Transacciones</h3>
              <ShoppingCart className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-gray-500 text-center py-8">Gráfico de transacciones próximamente...</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Productos</h3>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-gray-500 text-center py-8">Gráfico de productos próximamente...</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">📊 Estadísticas Avanzadas</h3>
          <p className="text-gray-600">
            Esta sección mostrará análisis detallados, gráficos de crecimiento, métricas de engagement y reportes personalizados.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
