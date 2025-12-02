"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Store, User, Package, Filter, Search } from "lucide-react";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  unidad_medida: string;
  imagen_url: string;
  tipo_propietario: "individual" | "cooperativa";
  propietario_id: string;
  stock_actual: number;
  estado: string;
  region: string;
  propietario_nombre?: string;
}

export function MarketplaceEmpresas() {
  const { getItemCount } = useCart();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      // Cargar productos activos con stock
      let query = supabase
        .from("productos")
        .select("*")
        .eq("estado", "activo")
        .gt("stock_actual", 0);

      const { data, error } = await query;

      if (error) throw error;

      // Cargar nombres de propietarios
      const productosConPropietarios = await Promise.all(
        (data || []).map(async (producto) => {
          let nombrePropietario = "";
          
          if (producto.tipo_propietario === "cooperativa") {
            const { data: coop } = await supabase
              .from("cooperativas")
              .select("nombre")
              .eq("id", producto.propietario_id)
              .single();
            nombrePropietario = coop?.nombre || "Cooperativa";
          } else {
            const { data: usuario } = await supabase
              .from("usuarios")
              .select("nombre, apellidos")
              .eq("id", producto.propietario_id)
              .single();
            nombrePropietario = usuario
              ? `${usuario.nombre} ${usuario.apellidos}`
              : "Productor Individual";
          }

          return {
            ...producto,
            propietario_nombre: nombrePropietario,
          };
        })
      );

      setProductos(productosConPropietarios);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  }

  const productosFiltrados = productos.filter((p) => {
    const matchBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchCategoria =
      categoriaFiltro === "todas" || p.categoria === categoriaFiltro;
    
    const matchTipo =
      tipoFiltro === "todos" || p.tipo_propietario === tipoFiltro;

    return matchBusqueda && matchCategoria && matchTipo;
  });

  const categorias = Array.from(new Set(productos.map((p) => p.categoria)));

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <Store className="w-8 h-8 text-blue-600" />
            Catálogo de Productos
          </h1>
          <p className="text-gray-600">
            Explora productos de cooperativas y productores locales
          </p>
        </div>
        
        {/* Botón Carrito */}
        <a
          href="/dashboard/marketplace/cart"
          className="relative bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Mi Carrito
          {getItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {getItemCount()}
            </span>
          )}
        </a>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro Categoría */}
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Filtro Tipo */}
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos los proveedores</option>
            <option value="cooperativa">Cooperativas</option>
            <option value="individual">Productores Individuales</option>
          </select>
        </div>
      </div>

      {/* Grid de Productos */}
      {productosFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hay productos disponibles
          </h3>
          <p className="text-gray-600">
            Intenta cambiar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ producto }: { producto: Producto }) {
  const { addToCart } = useCart();
  const [agregando, setAgregando] = useState(false);

  async function handleAddToCart() {
    setAgregando(true);
    try {
      await addToCart(producto.id, 1);
      alert(`${producto.nombre} agregado al carrito`);
    } catch (error: any) {
      alert(error.message || "Error al agregar al carrito");
    } finally {
      setAgregando(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group">
      {/* Imagen */}
      <div className="relative h-48 bg-gray-200">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              producto.tipo_propietario === "cooperativa"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {producto.tipo_propietario === "cooperativa"
              ? "Cooperativa"
              : "Individual"}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {producto.nombre}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {producto.descripcion || "Sin descripción"}
        </p>

        {/* Proveedor */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          {producto.tipo_propietario === "cooperativa" ? (
            <Store className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span>{producto.propietario_nombre}</span>
        </div>

        {/* Precio y Stock */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              ${producto.precio}
            </p>
            <p className="text-xs text-gray-500">por {producto.unidad_medida}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {producto.stock_actual} {producto.unidad_medida}
            </p>
            <p className="text-xs text-gray-500">disponibles</p>
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={handleAddToCart}
          disabled={agregando || producto.stock_actual === 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          {agregando ? "Agregando..." : producto.stock_actual === 0 ? "Sin stock" : "Agregar al Carrito"}
        </button>
      </div>
    </div>
  );
}




