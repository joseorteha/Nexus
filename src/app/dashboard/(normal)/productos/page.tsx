"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";
import { Package, Plus, Edit, Trash2, Search, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  obtenerProductos, 
  obtenerProductosStockBajo,
  obtenerEstadisticas,
  eliminarProducto,
  formatearPrecio,
  type Producto,
  type EstadisticasProductos
} from "@/lib/productos";

export default function MisProductosPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosStockBajo, setProductosStockBajo] = useState<Producto[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasProductos | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadProductos();
  }, []);

  async function loadProductos() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      // Cargar productos
      const productos = await obtenerProductos(user.id, "individual");
      setProductos(productos);

      // Cargar productos con stock bajo
      const stockBajo = await obtenerProductosStockBajo(user.id, "individual");
      setProductosStockBajo(stockBajo);

      // Cargar estadísticas
      const stats = await obtenerEstadisticas(user.id, "individual");
      setEstadisticas(stats);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminar(id: string) {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    
    try {
      await eliminarProducto(id);
      await loadProductos();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("Error al eliminar el producto");
    }
  }

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Mis Productos
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Gestiona tu inventario personal
        </p>
      </div>

      {/* Estadísticas */}
      {estadisticas && productos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-600 mb-1">Total Productos</p>
            <p className="text-2xl font-bold text-gray-900">{estadisticas.total_productos}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-600 mb-1">Valor Inventario</p>
            <p className="text-2xl font-bold text-green-600">
              {formatearPrecio(estadisticas.valor_total_inventario)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-600 mb-1">Stock Bajo</p>
            <p className="text-2xl font-bold text-orange-600">{estadisticas.productos_stock_bajo}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-600 mb-1">Agotados</p>
            <p className="text-2xl font-bold text-red-600">{estadisticas.productos_agotados}</p>
          </div>
        </div>
      )}

      {/* Alertas de stock bajo */}
      {productosStockBajo.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">Productos con stock bajo</h3>
              <p className="text-sm text-orange-800 mb-2">
                Tienes {productosStockBajo.length} producto(s) con stock por debajo del mínimo
              </p>
              <div className="flex flex-wrap gap-2">
                {productosStockBajo.slice(0, 3).map((p) => (
                  <span key={p.id} className="text-xs bg-white px-2 py-1 rounded-full text-orange-900">
                    {p.nombre}: {p.stock_actual} {p.unidad_medida}
                  </span>
                ))}
                {productosStockBajo.length > 3 && (
                  <span className="text-xs text-orange-700">+{productosStockBajo.length - 3} más</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda y botón agregar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => router.push("/dashboard/productos/nuevo")}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Agregar Producto
        </Button>
      </div>

      {/* Lista de productos */}
      {filteredProductos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes productos registrados
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Comienza agregando los productos que ofreces para que las empresas puedan encontrarte
          </p>
          <Button
            onClick={() => router.push("/dashboard/productos/nuevo")}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar mi primer producto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProductos.map((producto) => (
            <div
              key={producto.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {producto.imagen_url ? (
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {producto.nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {producto.descripcion}
                </p>
                
                <div className="mb-3">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {producto.categoria}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="text-xl font-bold text-primary">
                      {formatearPrecio(producto.precio)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Stock</p>
                    <p className={`text-lg font-semibold ${
                      producto.stock_actual <= producto.stock_minimo ? "text-orange-600" : "text-gray-900"
                    }`}>
                      {producto.stock_actual} {producto.unidad_medida}
                    </p>
                    {producto.stock_actual <= producto.stock_minimo && (
                      <p className="text-xs text-orange-600">¡Stock bajo!</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => router.push(`/dashboard/productos/${producto.id}`)}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleEliminar(producto.id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tip</h3>
        <p className="text-blue-800 text-sm">
          Agrega fotos de calidad y descripciones detalladas de tus productos para aumentar
          las posibilidades de hacer match con empresas compradoras.
        </p>
      </div>
    </div>
  );
}



