"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Package, Calendar, DollarSign, Eye } from "lucide-react";

interface Pedido {
  id: string;
  total: number;
  estado: string;
  created_at: string;
  pedidos_items: PedidoItem[];
  items: PedidoItem[];
}

interface PedidoItem {
  id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  productos: {
    nombre: string;
    imagen_url: string;
    unidad_medida: string;
  };
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cargarPedidos() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
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
              unidad_medida
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Pedidos cargados:", data);
      const pedidosFormateados = (data || []).map(pedido => ({
        ...pedido,
        items: pedido.pedidos_items || []
      }));
      console.log("Pedidos formateados:", pedidosFormateados);
      setPedidos(pedidosFormateados as any);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    } finally {
      setLoading(false);
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-700";
      case "procesando":
        return "bg-blue-100 text-blue-700";
      case "completado":
        return "bg-green-100 text-green-700";
      case "cancelado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "procesando":
        return "En Proceso";
      case "completado":
        return "Completado";
      case "cancelado":
        return "Cancelado";
      default:
        return estado;
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600" />
          Mis Pedidos
        </h1>
        <p className="text-gray-600 mt-2">
          Historial completo de tus compras
        </p>
      </div>

      {pedidos.length === 0 ? (
        /* Sin pedidos */
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No tienes pedidos aún
          </h3>
          <p className="text-gray-600 mb-6">
            Explora el marketplace y realiza tu primera compra
          </p>
          <button
            onClick={() => window.location.href = "/dashboard/marketplace"}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Ir al Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      Pedido #{pedido.id.slice(0, 8)}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(
                        pedido.estado
                      )}`}
                    >
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
                      {pedido.items?.length || 0} productos
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ${pedido.total.toFixed(2)}
                  </p>
                  <button
                    onClick={() =>
                      setSelectedPedido(
                        selectedPedido?.id === pedido.id ? null : pedido
                      )
                    }
                    className="mt-2 text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-semibold"
                  >
                    <Eye className="w-4 h-4" />
                    {selectedPedido?.id === pedido.id
                      ? "Ocultar detalles"
                      : "Ver detalles"}
                  </button>
                </div>
              </div>

              {/* Detalles expandibles */}
              {selectedPedido?.id === pedido.id && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Productos:
                  </h4>
                  <div className="space-y-3">
                    {pedido.items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
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
                          <p className="font-semibold text-gray-900">
                            {item.productos?.nombre}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.cantidad} {item.productos?.unidad_medida} × $
                            {item.precio_unitario}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ${item.subtotal.toFixed(2)}
                          </p>
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


