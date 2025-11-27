"use client";

import React, { useEffect, useState } from "react";
import type { Company, CartItem } from "@/components/modules/marketplace/types";
import * as marketActions from "@/lib/actions/market-actions";

const DATA_URL = "/api/products";

interface ExtendedCompany extends Company {
  price?: number;
  polo?: string;
  description?: string;
  offers?: string[];
  logoUrl?: string;
  imageUrl?: string;
}

const MarketplacePage: React.FC = () => {
  const [products, setProducts] = useState<ExtendedCompany[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErrorText, setFetchErrorText] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    polo: "",
    category: "",
    imageUrl: "",
    logoUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchErrorText(null);

    const loadData = async () => {
      try {
        const res = await fetch(DATA_URL, { cache: "no-store" });

        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
          setFetchErrorText(
            `Error al cargar datos (${res.status} ${res.statusText || "Error JSON"})`
          );
          setLoading(false);
          return;
        }

        const data = (await res.json()) as ExtendedCompany[];

        if (!cancelled) {
          if (!Array.isArray(data)) {
            setFetchErrorText("El archivo JSON no es un array de productos.");
            setLoading(false);
            return;
          }
          setProducts(data);
          setLoading(false);
        }
      } catch (err) {
        setFetchErrorText(`Error de conexión: ${String(err)}`);
        setLoading(false);
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const polos = Array.from(
    new Set(products.map((p) => (p.polo ?? "").toString().trim()).filter(Boolean))
  );

  const filtered = products.filter((p) => {
    const q = (search ?? "").toString().trim().toLowerCase();
    const name = (p.name ?? "").toString().toLowerCase();
    const description = (p.description ?? "").toString().toLowerCase();
    const offersText = (p.offers ?? []).join(" ").toLowerCase();

    const matchesSearch =
      q === "" || name.includes(q) || description.includes(q) || offersText.includes(q);
    const matchesPolo =
      category === "all" || (p.polo ?? "").toString().trim() === category;
    const price = p.price ?? 0;
    const matchesMin = minPrice === undefined || price >= minPrice;
    const matchesMax = maxPrice === undefined || price <= maxPrice;

    return matchesSearch && matchesPolo && matchesMin && matchesMax;
  });

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price ?? 0,
          quantity: 1,
          imageUrl: product.logoUrl || product.imageUrl || "",
        },
      ];
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          polo: formData.polo || "General",
          category: formData.category || "General",
          imageUrl: formData.imageUrl,
          logoUrl: formData.logoUrl,
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts((prev) => [...prev, newProduct.product]);
        setFormData({
          name: "",
          description: "",
          price: "",
          polo: "",
          category: "",
          imageUrl: "",
          logoUrl: "",
        });
        setShowAddModal(false);
        alert("¡Producto agregado exitosamente!");
      } else {
        alert("Error al agregar el producto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al agregar el producto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
    );
  };

  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Cargando productos...</p>
      </div>
    );
  }

  if (fetchErrorText) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{fetchErrorText}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Sidebar de Filtros */}
      <div className="w-80 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Filtros</h2>
        
        {/* Búsqueda */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Nombre o descripción"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Categoría */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Todas</option>
            {polos.map((polo) => (
              <option key={polo} value={polo}>
                {polo}
              </option>
            ))}
          </select>
        </div>

        {/* Precio Mínimo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio Mínimo
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={minPrice ?? ""}
            onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Precio Máximo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio Máximo
          </label>
          <input
            type="number"
            min="0"
            placeholder="Sin límite"
            value={maxPrice ?? ""}
            onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Botón Limpiar Filtros */}
        <button
          onClick={() => {
            setSearch("");
            setCategory("all");
            setMinPrice(undefined);
            setMaxPrice(undefined);
          }}
          className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-400"
        >
          Limpiar Filtros
        </button>
      </div>

      {/* Grid de Productos */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600">
            {filtered.length} de {products.length} productos encontrados
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron productos que coincidan con tus filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="h-48 w-full overflow-hidden">
                  <img 
                    src={product.imageUrl || product.logoUrl || "/placeholder.png"} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 truncate mb-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <p className="text-2xl font-bold text-indigo-600 mb-4">
                    ${(product.price ?? 0).toFixed(2)}
                  </p>
                  <button
                    className="w-full bg-indigo-500 text-white py-2 rounded-lg font-medium hover:bg-indigo-600 transition duration-150"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Carrito Flotante */}
      {cartOpen && (
        <div className="fixed right-0 top-0 z-50 h-full w-96 bg-white shadow-2xl transform transition-transform">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Carrito</h2>
            <button
              onClick={() => setCartOpen(false)}
              className="text-2xl text-gray-500 hover:text-gray-800"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 max-h-[calc(100vh-200px)]">
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Tu carrito está vacío.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 border-b pb-4 mb-4"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="px-2 py-1 bg-red-200 text-red-600 rounded text-sm hover:bg-red-300"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">
                ${totalCartPrice.toFixed(2)}
              </span>
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
              Proceder al Pago
            </button>
          </div>
        </div>
      )}

      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Modal para agregar producto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Agregar Producto</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-2xl text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Nombre del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Descripción del producto"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  name="polo"
                  value={formData.polo}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Ej: Alimentos Orgánicos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Logo
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="https://ejemplo.com/logo.jpg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {submitting ? "Guardando..." : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Botón para agregar producto */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 left-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 flex items-center gap-2"
      >
        ➕ Agregar Producto
      </button>

      {/* Botón para abrir carrito */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2"
      >
        🛒 ({cartItems.length})
      </button>
    </div>
  );
};

export default MarketplacePage;