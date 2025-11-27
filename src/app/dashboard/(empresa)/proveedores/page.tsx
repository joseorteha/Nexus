"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Users, Store, User, DollarSign, ShoppingCart, Package } from "lucide-react";

interface Proveedor {
  id: string;
  nombre: string;
  tipo: "cooperativa" | "individual";
  totalComprado: number;
  cantidadPedidos: number;
  ultimaCompra: string;
}

export default function ProveedoresPage() {
  const [loading, setLoading] = useState(true);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  useEffect(() => {
    cargarProveedores();
  }, []);

  async function cargarProveedores() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener todos los pedidos del usuario
      const { data: pedidos } = await supabase
        .from("pedidos")
        .select(`
          id,
          created_at,
          pedidos_items (
            id,
            subtotal,
            productos (
              propietario_id,
              tipo_propietario
            )
          )
        `)
        .eq("user_id", user.id);

      if (!pedidos) return;

      // Agrupar por proveedor
      const proveedoresMap = new Map<string, {
        id: string;
        tipo: "cooperativa" | "individual";
        totalComprado: number;
        pedidos: Set<string>;
        ultimaCompra: string;
      }>();

      pedidos.forEach(pedido => {
        pedido.pedidos_items?.forEach((item: any) => {
          const proveedorId = item.productos?.propietario_id;
          const tipo = item.productos?.tipo_propietario;
          
          if (!proveedorId) return;

          if (!proveedoresMap.has(proveedorId)) {
            proveedoresMap.set(proveedorId, {
              id: proveedorId,
              tipo: tipo || "individual",
              totalComprado: 0,
              pedidos: new Set(),
              ultimaCompra: pedido.created_at,
            });
          }

          const proveedor = proveedoresMap.get(proveedorId)!;
          proveedor.totalComprado += parseFloat(item.subtotal || 0);
          proveedor.pedidos.add(pedido.id);
          
          // Actualizar última compra si es más reciente
          if (new Date(pedido.created_at) > new Date(proveedor.ultimaCompra)) {
            proveedor.ultimaCompra = pedido.created_at;
          }
        });
      });

      // Cargar nombres de proveedores
      const proveedoresArray = await Promise.all(
        Array.from(proveedoresMap.values()).map(async (prov) => {
          let nombre = "";
          
          if (prov.tipo === "cooperativa") {
            const { data } = await supabase
              .from("cooperativas")
              .select("nombre")
              .eq("id", prov.id)
              .single();
            nombre = data?.nombre || "Cooperativa Desconocida";
          } else {
            const { data } = await supabase
              .from("usuarios")
              .select("nombre, apellidos")
              .eq("id", prov.id)
              .single();
            nombre = data ? `${data.nombre} ${data.apellidos}` : "Productor Desconocido";
          }

          return {
            id: prov.id,
            nombre,
            tipo: prov.tipo,
            totalComprado: prov.totalComprado,
            cantidadPedidos: prov.pedidos.size,
            ultimaCompra: prov.ultimaCompra,
          };
        })
      );

      // Ordenar por total comprado (descendente)
      proveedoresArray.sort((a, b) => b.totalComprado - a.totalComprado);
      setProveedores(proveedoresArray);

    } catch (error) {
      console.error("Error cargando proveedores:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="w-8 h-8 text-purple-600" />
          Mis Proveedores
        </h1>
        <p className="text-gray-600 mt-2">
          Proveedores con los que has trabajado
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Proveedores</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{proveedores.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cooperativas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {proveedores.filter(p => p.tipo === "cooperativa").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Individuales</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {proveedores.filter(p => p.tipo === "individual").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Proveedores */}
      {proveedores.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No tienes proveedores registrados
          </h3>
          <p className="text-gray-600 mb-6">
            Realiza compras en el marketplace para comenzar a trabajar con proveedores
          </p>
          <a
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Explorar Marketplace
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proveedores.map((proveedor) => (
            <div
              key={proveedor.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${proveedor.tipo === "cooperativa" ? "bg-green-100" : "bg-blue-100"} rounded-lg flex items-center justify-center`}>
                    {proveedor.tipo === "cooperativa" ? (
                      <Store className="w-6 h-6 text-green-600" />
                    ) : (
                      <User className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{proveedor.nombre}</h3>
                    <span className={`text-xs font-semibold ${proveedor.tipo === "cooperativa" ? "text-green-600" : "text-blue-600"}`}>
                      {proveedor.tipo === "cooperativa" ? "Cooperativa" : "Productor Individual"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <p className="text-xs text-gray-600">Total Comprado</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    ${proveedor.totalComprado.toFixed(2)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                    <p className="text-xs text-gray-600">Pedidos</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {proveedor.cantidadPedidos}
                  </p>
                </div>
              </div>

              {/* Última compra */}
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Última compra:</span>{" "}
                {new Date(proveedor.ultimaCompra).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
