"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { ShoppingCart, Package, Calendar, DollarSign, TrendingUp, Users, Store, Eye } from "lucide-react";

interface Pedido {
  id: string;
  total: number;
  estado: string;
  created_at: string;
  pedidos_items: any[];
}

interface Stats {
  pedidosActivos: number;
  totalInvertido: number;
  proveedores: number;
  crecimientoMes: number;
}

export default function ComprasPage() {
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [stats, setStats] = useState<Stats>({
    pedidosActivos: 0,
    totalInvertido: 0,
    proveedores: 0,
    crecimientoMes: 0,
  });
  const [selectedPedido, setSelectedPedido] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Cargar pedidos
      const { data: pedidosData, error } = await supabase
        .from("pedidos")
        .select(`
          id,
          total,
          estado,
          created_at,
          pedidos_items (
            id,
            cantidad,
            precio_unitario,
            subtotal,
            productos (
              nombre,
              imagen_url,
              unidad_medida,
              propietario_id
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPedidos(pedidosData || []);

      // Calcular stats
      const pedidosActivos = (pedidosData || []).filter(
        p => p.estado === "pendiente" || p.estado === "procesando"
      ).length;

      const totalInvertido = (pedidosData || []).reduce(
        (sum, p) => sum + parseFloat(p.total.toString()), 0
      );

      // Obtener proveedores únicos
      const proveedoresUnicos = new Set();
      (pedidosData || []).forEach(pedido => {
        pedido.pedidos_items?.forEach((item: any) => {
          if (item.productos?.propietario_id) {
            proveedoresUnicos.add(item.productos.propietario_id);
          }
        });
      });

      setStats({
        pedidosActivos,
        totalInvertido,
        proveedores: proveedoresUnicos.size,
        crecimientoMes: 0, // TODO: Calcular crecimiento
      });

    } catch (error) {
      console.error("Error cargando compras:", error);
    } finally {
      setLoading(false);
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente": return "bg-yellow-100 text-yellow-700";
      case "procesando": return "bg-blue-100 text-blue-700";
      case "completado": return "bg-green-100 text-green-700";
      case "cancelado": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "pendiente": return "Pendiente";
      case "procesando": return "En Proceso";
      case "completado": return "Completado";
      case "cancelado": return "Cancelado";
      default: return estado;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          Mis Compras
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona tus pedidos y órdenes de compra
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pedidos Activos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pedidosActivos}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Invertido</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${stats.totalInvertido.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Proveedores</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.proveedores}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pedidos.length}</p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {pedidos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No tienes compras aún
          </h3>
          <p className="text-gray-600 mb-6">
            Explora el marketplace y comienza a realizar pedidos
          </p>
          <a
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Store className="w-5 h-5" />
            Ir al Marketplace
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      Pedido #{pedido.id.slice(0, 8)}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(pedido.estado)}`}>
                      {getEstadoTexto(pedido.estado)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(pedido.created_at).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {pedido.pedidos_items?.length || 0} productos
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ${pedido.total.toFixed(2)}
                  </p>
                  <button
                    onClick={() => setSelectedPedido(selectedPedido === pedido.id ? null : pedido.id)}
                    className="mt-2 text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-semibold"
                  >
                    <Eye className="w-4 h-4" />
                    {selectedPedido === pedido.id ? "Ocultar" : "Ver detalles"}
                  </button>
                </div>
              </div>

              {/* Detalles expandibles */}
              {selectedPedido === pedido.id && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Productos:</h4>
                  <div className="space-y-3">
                    {pedido.pedidos_items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {item.productos?.imagen_url ? (
                            <img
                              src={item.productos.imagen_url}
                              alt={item.productos?.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.productos?.nombre}</p>
                          <p className="text-sm text-gray-600">
                            {item.cantidad} {item.productos?.unidad_medida} × ${item.precio_unitario}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${item.subtotal.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
