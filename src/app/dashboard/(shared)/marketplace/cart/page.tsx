"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/app/lib/supabase/client";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Package, CreditCard } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items, loading, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const [procesando, setProcesando] = useState(false);

  async function handleCheckout() {
    if (items.length === 0) return;
    
    setProcesando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const total = getTotal();

      // 1. Crear pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .insert({
          user_id: user.id,
          total,
          estado: "pendiente",
        })
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // 2. Crear items del pedido
      const pedidoItems = items.map(item => ({
        pedido_id: pedido.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.precio_unitario * item.cantidad,
      }));

      const { error: itemsError } = await supabase
        .from("pedidos_items")
        .insert(pedidoItems);

      if (itemsError) throw itemsError;

      // 3. Actualizar stock de productos
      for (const item of items) {
        const { data: producto } = await supabase
          .from("productos")
          .select("stock_actual")
          .eq("id", item.producto_id)
          .single();
        
        if (producto) {
          await supabase
            .from("productos")
            .update({ stock_actual: producto.stock_actual - item.cantidad })
            .eq("id", item.producto_id);
        }
      }

      // 4. Vaciar carrito
      await clearCart();

      alert("¡Pedido realizado exitosamente! 🎉");
      router.push("/dashboard/pedidos");
    } catch (error: any) {
      console.error("Error en checkout:", error);
      alert(error.message || "Error al procesar el pedido");
    } finally {
      setProcesando(false);
    }
  }

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
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al marketplace
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          Mi Carrito
        </h1>
        <p className="text-gray-600 mt-2">
          {items.length} {items.length === 1 ? "producto" : "productos"} en tu carrito
        </p>
      </div>

      {items.length === 0 ? (
        /* Carrito vacío */
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-gray-600 mb-6">
            Explora el marketplace y agrega productos
          </p>
          <button
            onClick={() => router.push("/dashboard/marketplace")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Ir al Marketplace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-6 flex gap-6"
              >
                {/* Imagen */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.imagen_url ? (
                    <img
                      src={item.imagen_url}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    ${item.precio_unitario} / {item.unidad_medida}
                  </p>

                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-bold w-12 text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.stock_disponible}
                        className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>

                  {item.cantidad >= item.stock_disponible && (
                    <p className="text-orange-600 text-xs mt-2">
                      Stock máximo alcanzado
                    </p>
                  )}
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ${(item.precio_unitario * item.cantidad).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="font-semibold text-green-600">Gratis</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={procesando}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition mb-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" />
                {procesando ? "Procesando..." : "Realizar Pedido"}
              </button>

              <button
                onClick={clearCart}
                disabled={procesando}
                className="w-full bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
              >
                Vaciar Carrito
              </button>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-semibold mb-2">
                  ✓ Compra segura
                </p>
                <p className="text-xs text-green-700">
                  Tu pedido será procesado inmediatamente y podrás ver el historial en "Mis Pedidos"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



