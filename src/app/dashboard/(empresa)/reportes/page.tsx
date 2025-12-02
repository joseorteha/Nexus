"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { BarChart3, TrendingUp, Package, DollarSign, ShoppingCart, Calendar } from "lucide-react";

interface Estadisticas {
  totalComprado: number;
  totalPedidos: number;
  promedioCompra: number;
  productoMasComprado: {
    nombre: string;
    cantidad: number;
  } | null;
  categorias: { categoria: string; total: number }[];
  ultimoMes: {
    total: number;
    pedidos: number;
  };
}

export default function ReportesPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Estadisticas>({
    totalComprado: 0,
    totalPedidos: 0,
    promedioCompra: 0,
    productoMasComprado: null,
    categorias: [],
    ultimoMes: { total: 0, pedidos: 0 },
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  async function cargarEstadisticas() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Cargar todos los pedidos
      const { data: pedidos } = await supabase
        .from("pedidos")
        .select(`
          id,
          total,
          created_at,
          pedidos_items (
            id,
            cantidad,
            subtotal,
            productos (
              nombre,
              categoria
            )
          )
        `)
        .eq("user_id", user.id);

      if (!pedidos || pedidos.length === 0) {
        setLoading(false);
        return;
      }

      // Calcular totales
      const totalComprado = pedidos.reduce((sum, p) => sum + parseFloat(p.total.toString()), 0);
      const totalPedidos = pedidos.length;
      const promedioCompra = totalComprado / totalPedidos;

      // Producto más comprado
      const productosMap = new Map<string, number>();
      pedidos.forEach(pedido => {
        pedido.pedidos_items?.forEach((item: any) => {
          const nombre = item.productos?.nombre || "Desconocido";
          productosMap.set(nombre, (productosMap.get(nombre) || 0) + item.cantidad);
        });
      });

      let productoMasComprado = null;
      if (productosMap.size > 0) {
        const [nombre, cantidad] = Array.from(productosMap.entries()).reduce((a, b) => 
          a[1] > b[1] ? a : b
        );
        productoMasComprado = { nombre, cantidad };
      }

      // Categorías
      const categoriasMap = new Map<string, number>();
      pedidos.forEach(pedido => {
        pedido.pedidos_items?.forEach((item: any) => {
          const categoria = item.productos?.categoria || "Sin categoría";
          categoriasMap.set(categoria, (categoriasMap.get(categoria) || 0) + parseFloat(item.subtotal || 0));
        });
      });

      const categorias = Array.from(categoriasMap.entries())
        .map(([categoria, total]) => ({ categoria, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      // Último mes
      const unMesAtras = new Date();
      unMesAtras.setMonth(unMesAtras.getMonth() - 1);
      
      const pedidosUltimoMes = pedidos.filter(p => 
        new Date(p.created_at) >= unMesAtras
      );

      const ultimoMes = {
        total: pedidosUltimoMes.reduce((sum, p) => sum + parseFloat(p.total.toString()), 0),
        pedidos: pedidosUltimoMes.length,
      };

      setStats({
        totalComprado,
        totalPedidos,
        promedioCompra,
        productoMasComprado,
        categorias,
        ultimoMes,
      });

    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-cyan-600" />
          Reportes y Análisis
        </h1>
        <p className="text-gray-600 mt-2">
          Estadísticas de tus compras y proveedores
        </p>
      </div>

      {/* Stats Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Invertido</h3>
            <DollarSign className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-3xl font-bold">${stats.totalComprado.toFixed(2)}</p>
          <p className="text-xs opacity-80 mt-2">Históricamente</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Pedidos</h3>
            <ShoppingCart className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats.totalPedidos}</p>
          <p className="text-xs opacity-80 mt-2">Realizados</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Promedio por Compra</h3>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-3xl font-bold">${stats.promedioCompra.toFixed(2)}</p>
          <p className="text-xs opacity-80 mt-2">Por pedido</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Este Mes</h3>
            <Calendar className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-3xl font-bold">${stats.ultimoMes.total.toFixed(2)}</p>
          <p className="text-xs opacity-80 mt-2">{stats.ultimoMes.pedidos} pedidos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Producto más comprado */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Producto Más Comprado</h2>
          </div>
          {stats.productoMasComprado ? (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {stats.productoMasComprado.nombre}
              </p>
              <p className="text-lg text-blue-600 font-semibold">
                {stats.productoMasComprado.cantidad} unidades compradas
              </p>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No hay datos suficientes</p>
          )}
        </div>

        {/* Top Categorías */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Top Categorías</h2>
          </div>
          {stats.categorias.length > 0 ? (
            <div className="space-y-3">
              {stats.categorias.map((cat, idx) => (
                <div key={cat.categoria}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">
                      {idx + 1}. {cat.categoria}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      ${cat.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(cat.total / stats.totalComprado) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No hay datos suficientes</p>
          )}
        </div>
      </div>

      {/* Empty State */}
      {stats.totalPedidos === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center mt-6">
          <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-10 h-10 text-cyan-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hay datos para mostrar
          </h3>
          <p className="text-gray-600 mb-6">
            Realiza compras para ver estadísticas y reportes detallados
          </p>
          <a
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition"
          >
            Ir al Marketplace
          </a>
        </div>
      )}
    </div>
  );
}



