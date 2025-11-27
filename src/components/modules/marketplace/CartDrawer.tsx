// src/components/modules/marketplace/CartDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "../../../app/dashboard/marketplace/market-actions";
import { getCart, removeFromCart, checkoutCart } from "../../../app/dashboard/marketplace/market-actions";

interface Props {
  open: boolean;
  onClose: () => void;
  onCheckedOut?: () => void;
}

export default function CartDrawer({ open, onClose, onCheckedOut }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    const c = await getCart();
    setItems(c);
  };

  useEffect(() => {
    if (open) reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleRemove = async (id: string) => {
    await removeFromCart(id);
    await reload();
  };

  const handleCheckout = async () => {
    setLoading(true);
    const res = await checkoutCart();
    setLoading(false);
    if (res.success) {
      await reload();
      if (onCheckedOut) onCheckedOut();
      onClose();
    } else {
      alert(res.message ?? "Error en el pago");
    }
  };

  const total = items.reduce((acc, it) => acc + it.qty * it.product.price, 0);

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm transform bg-slate-950 text-slate-50 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
          <div>
            <h2 className="text-lg font-semibold">Carrito</h2>
            <p className="text-xs text-slate-400">{items.length} producto(s)</p>
          </div>
          <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:border-[var(--color-primary)]">
            ✕
          </button>
        </div>

        <div className="flex h-[calc(100%-4rem)] flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-slate-400">Tu carrito está vacío.</p>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-50">{item.product.name}</p>
                    <p className="text-xs text-slate-400">Cantidad: {item.qty}</p>
                    <p className="text-xs text-[var(--color-primary-light)]">${item.product.price} c/u</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-semibold text-[var(--color-primary-light)]">${item.qty * item.product.price}</span>
                    <button onClick={() => handleRemove(item.product.id)} className="text-xs text-slate-400 hover:text-[var(--color-accent)]">Quitar</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-800 px-4 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Total</span>
              <span className="text-lg font-bold text-[var(--color-primary-light)]">${total}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={items.length === 0 || loading}
              className={`mt-4 w-full rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg ${items.length === 0 ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)]"}`}
            >
              {loading ? "Procesando..." : "Proceder al pago"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
