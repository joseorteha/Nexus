"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { DollarSign, Package, TrendingUp, Calendar, Eye, ShoppingCart } from "lucide-react";

interface Venta {
  id: string;
  pedido_id: string;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  fecha: string;
  comprador_nombre: string;
}

interface EstadisticasVentas {
  totalVentas: number;
  cantidadPedidos: number;
  productoMasVendido: { nombre: string; cantidad: number } | null;
  ventasUltimoMes: number;
}

export default function VentasPage() {
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [stats, setStats] = useState<EstadisticasVentas>({
    totalVentas: 0,
    cantidadPedidos: 0,
    productoMasVendido: null,
    ventasUltimoMes: 0,
  });

  useEffect(() => {
    cargarVentas();
  }, []);

  async function cargarVentas() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener IDs de mis productos
      const { data: misProductos } = await supabase
        .from("productos")
        .select("id, nombre")
        .eq("propietario_id", user.id)
        .eq("tipo_propietario", "individual");

      if (!misProductos || misProductos.length === 0) {
        setLoading(false);
        return;
      }

      const productosIds = misProductos.map(p => p.id);
      const productosMap = new Map(misProductos.map(p => [p.id, p.nombre]));

      // Obtener ventas de mis productos
      const { data: ventasData, error } = await supabase
        .from("pedidos_items")
        .select(`
          id,
          pedido_id,
          producto_id,
          cantidad,
          precio_unitario,
          subtotal,
          pedidos (
            created_at,
            user_id
          )
        `)
        .in("producto_id", productosIds);

      if (error) throw error;

      // Cargar nombres de compradores
      const ventasConCompradores = await Promise.all(
        (ventasData || []).map(async (venta: any) => {
          const { data: comprador } = await supabase
            .from("usuarios")
            .select("nombre, apellidos")
            .eq("id", venta.pedidos.user_id)
            .single();

          return {
            id: venta.id,
            pedido_id: venta.pedido_id,
            producto_nombre: productosMap.get(venta.producto_id) || "Producto",
            cantidad: venta.cantidad,
            precio_unitario: venta.precio_unitario,
            subtotal: venta.subtotal,
            fecha: venta.pedidos.created_at,
            comprador_nombre: comprador ? `${comprador.nombre} ${comprador.apellidos}` : "Cliente",
          };
        })
      );

      setVentas(ventasConCompradores);

      // Calcular estadísticas
      const totalVentas = ventasConCompradores.reduce((sum, v) => sum + v.subtotal, 0);
      const pedidosUnicos = new Set(ventasConCompradores.map(v => v.pedido_id));
      const cantidadPedidos = pedidosUnicos.size;

      // Producto más vendido
      const productosVendidos = new Map<string, number>();
      ventasConCompradores.forEach(v => {
        productosVendidos.set(
          v.producto_nombre,
          (productosVendidos.get(v.producto_nombre) || 0) + v.cantidad
        );
      });

      let productoMasVendido = null;
      if (productosVendidos.size > 0) {
        const [nombre, cantidad] = Array.from(productosVendidos.entries()).reduce((a, b) =>
          a[1] > b[1] ? a : b
        );
        productoMasVendido = { nombre, cantidad };
      }

      // Ventas último mes
      const unMesAtras = new Date();
      unMesAtras.setMonth(unMesAtras.getMonth() - 1);
      const ventasUltimoMes = ventasConCompradores
        .filter(v => new Date(v.fecha) >= unMesAtras)
        .reduce((sum, v) => sum + v.subtotal, 0);

      setStats({
        totalVentas,
        cantidadPedidos,
        productoMasVendido,
        ventasUltimoMes,
      });

    } catch (error) {
      console.error("Error cargando ventas:", error);
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
          <DollarSign className="w-8 h-8 text-green-600" />
          Mis Ventas
        </h1>
        <p className="text-gray-600 mt-2">
          Historial de ventas de tus productos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Vendido</h3>
            <DollarSign className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-3xl font-bold">${stats.totalVentas.toFixed(2)}</p>
          <p className="text-xs opacity-80 mt-2">Históricamente</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Pedidos</h3>
            <ShoppingCart className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats.cantidadPedidos}</p>
          <p className="text-xs opacity-80 mt-2">Que incluyeron tus productos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Promedio por Venta</h3>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-3xl font-bold">
            ${stats.cantidadPedidos > 0 ? (stats.totalVentas / ventas.length).toFixed(2) : "0"}
          </p>
          <p className="text-xs opacity-80 mt-2">Por producto vendido</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Este Mes</h3>
            <Calendar className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-3xl font-bold">${stats.ventasUltimoMes.toFixed(2)}</p>
          <p className="text-xs opacity-80 mt-2">Últimos 30 días</p>
        </div>
      </div>

      {/* Producto más vendido */}
      {stats.productoMasVendido && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Producto Más Vendido</h2>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {stats.productoMasVendido.nombre}
            </p>
            <p className="text-lg text-green-600 font-semibold">
              {stats.productoMasVendido.cantidad} unidades vendidas
            </p>
          </div>
        </div>
      )}

      {/* Lista de ventas */}
      {ventas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No tienes ventas aún
          </h3>
          <p className="text-gray-600 mb-6">
            Tus productos aparecerán aquí cuando sean comprados en el marketplace
          </p>
          <a
            href="/dashboard/productos"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Gestionar mis productos
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comprador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Unit.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ventas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(venta.fecha).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{venta.producto_nombre}</div>
                      <div className="text-xs text-gray-500">Pedido #{venta.pedido_id.slice(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {venta.comprador_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {venta.cantidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${venta.precio_unitario.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                      ${venta.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}



