"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Package, Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  unidad: string;
  categoria: string;
  imagen_url?: string;
}

export default function MisProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadProductos();
  }, []);

  async function loadProductos() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // TODO: Implementar carga de productos del usuario
      // const { data } = await supabase.from("productos").select("*").eq("user_id", user.id);
      
      setProductos([]);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
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
          onClick={() => setShowAddModal(true)}
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
            onClick={() => setShowAddModal(true)}
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
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="text-xl font-bold text-primary">
                      ${producto.precio}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Stock</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {producto.stock} {producto.unidad}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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
