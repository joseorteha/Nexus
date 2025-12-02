"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/app/lib/supabase/client";

interface CartItem {
  id: string;
  producto_id: string;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  imagen_url?: string;
  unidad_medida: string;
  stock_disponible: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productoId: string, cantidad?: number) => Promise<void>;
  removeFromCart: (carritoId: string) => Promise<void>;
  updateQuantity: (carritoId: string, cantidad: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setItems([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("carritos")
        .select(`
          id,
          producto_id,
          cantidad,
          precio_unitario,
          productos (
            nombre,
            imagen_url,
            unidad_medida,
            stock_actual
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        producto_id: item.producto_id,
        nombre: item.productos?.nombre || "Producto",
        precio_unitario: parseFloat(item.precio_unitario),
        cantidad: item.cantidad,
        imagen_url: item.productos?.imagen_url,
        unidad_medida: item.productos?.unidad_medida || "unidad",
        stock_disponible: item.productos?.stock_actual || 0,
      }));

      setItems(cartItems);
    } catch (error) {
      console.error("Error cargando carrito:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productoId: string, cantidad: number = 1) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      // Obtener información del producto
      const { data: producto, error: productoError } = await supabase
        .from("productos")
        .select("precio, stock_actual")
        .eq("id", productoId)
        .single();

      if (productoError) throw productoError;
      if (!producto) throw new Error("Producto no encontrado");

      // Verificar stock
      if (producto.stock_actual < cantidad) {
        throw new Error("Stock insuficiente");
      }

      // Verificar si ya existe en el carrito
      const { data: existingItem } = await supabase
        .from("carritos")
        .select("id, cantidad")
        .eq("user_id", user.id)
        .eq("producto_id", productoId)
        .single();

      if (existingItem) {
        // Actualizar cantidad
        const nuevaCantidad = existingItem.cantidad + cantidad;
        
        if (producto.stock_actual < nuevaCantidad) {
          throw new Error("Stock insuficiente");
        }

        const { error: updateError } = await supabase
          .from("carritos")
          .update({ cantidad: nuevaCantidad })
          .eq("id", existingItem.id);

        if (updateError) throw updateError;
      } else {
        // Insertar nuevo item
        const { error: insertError } = await supabase
          .from("carritos")
          .insert({
            user_id: user.id,
            producto_id: productoId,
            cantidad,
            precio_unitario: producto.precio,
          });

        if (insertError) throw insertError;
      }

      await loadCart();
    } catch (error: any) {
      console.error("Error agregando al carrito:", error);
      throw error;
    }
  }

  async function removeFromCart(carritoId: string) {
    try {
      const { error } = await supabase
        .from("carritos")
        .delete()
        .eq("id", carritoId);

      if (error) throw error;

      await loadCart();
    } catch (error) {
      console.error("Error eliminando del carrito:", error);
      throw error;
    }
  }

  async function updateQuantity(carritoId: string, cantidad: number) {
    try {
      if (cantidad <= 0) {
        await removeFromCart(carritoId);
        return;
      }

      // Verificar stock
      const item = items.find(i => i.id === carritoId);
      if (item && item.stock_disponible < cantidad) {
        throw new Error("Stock insuficiente");
      }

      const { error } = await supabase
        .from("carritos")
        .update({ cantidad })
        .eq("id", carritoId);

      if (error) throw error;

      await loadCart();
    } catch (error) {
      console.error("Error actualizando cantidad:", error);
      throw error;
    }
  }

  async function clearCart() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("carritos")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error("Error limpiando carrito:", error);
      throw error;
    }
  }

  function getTotal(): number {
    return items.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
  }

  function getItemCount(): number {
    return items.reduce((sum, item) => sum + item.cantidad, 0);
  }

  async function refreshCart() {
    await loadCart();
  }

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}



