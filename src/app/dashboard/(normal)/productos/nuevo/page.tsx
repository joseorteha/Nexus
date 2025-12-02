"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";
import { Package, ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { crearProducto, type UnidadMedida } from "@/lib/productos";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);

  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
    unidad_medida: "kg" as UnidadMedida,
    stock_actual: "",
    stock_minimo: "5",
    sku: "",
    region: "",
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  async function loadCategorias() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener categorías del onboarding
      const { data } = await supabase
        .from("onboarding_normal")
        .select("categorias")
        .eq("user_id", user.id)
        .single();

      if (data?.categorias) {
        setCategorias(data.categorias);
        // Set primera categoría como default
        if (data.categorias.length > 0 && !formData.categoria) {
          setFormData(prev => ({ ...prev, categoria: data.categorias[0] }));
        }
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      // Validaciones
      if (!formData.nombre || !formData.categoria || !formData.precio || !formData.stock_actual) {
        alert("Por favor completa todos los campos obligatorios");
        setLoading(false);
        return;
      }

      // Crear producto
      await crearProducto({
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        categoria: formData.categoria,
        precio: parseFloat(formData.precio),
        unidad_medida: formData.unidad_medida,
        stock_actual: parseInt(formData.stock_actual),
        stock_minimo: parseInt(formData.stock_minimo),
        sku: formData.sku || undefined,
        region: formData.region || undefined,
        tipo_propietario: "individual",
        propietario_id: user.id,
      });

      alert("¡Producto creado exitosamente!");
      router.push("/dashboard/productos");
    } catch (error) {
      console.error("Error creando producto:", error);
      alert("Error al crear el producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="default"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Agregar Producto</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Completa la información de tu producto
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
        {/* Información Básica */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Información Básica</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <Input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Ej: Café orgánico de altura"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                placeholder="Describe tu producto..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {categorias.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No hay categorías del onboarding. Puedes escribir una personalizada.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Código)
                </label>
                <Input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  placeholder="Opcional"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Precio e Inventario */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Precio e Inventario</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio por Unidad *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({...formData, precio: e.target.value})}
                  placeholder="0.00"
                  className="pl-8"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidad de Medida *
              </label>
              <select
                value={formData.unidad_medida}
                onChange={(e) => setFormData({...formData, unidad_medida: e.target.value as UnidadMedida})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="kg">Kilogramo (kg)</option>
                <option value="litro">Litro</option>
                <option value="pieza">Pieza</option>
                <option value="unidad">Unidad</option>
                <option value="caja">Caja</option>
                <option value="tonelada">Tonelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Inicial *
              </label>
              <Input
                type="number"
                value={formData.stock_actual}
                onChange={(e) => setFormData({...formData, stock_actual: e.target.value})}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Mínimo (Alerta)
              </label>
              <Input
                type="number"
                value={formData.stock_minimo}
                onChange={(e) => setFormData({...formData, stock_minimo: e.target.value})}
                placeholder="5"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recibirás una alerta cuando el stock esté por debajo de este número
              </p>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Información Adicional</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Región de Producción
            </label>
            <Input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              placeholder="Ej: Veracruz, Orizaba"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="default"
            onClick={() => router.back()}
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Producto"}
          </Button>
        </div>
      </form>

      {/* Información */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Consejos</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Usa nombres claros y descriptivos para tus productos</li>
          <li>• Define un precio competitivo basado en el mercado</li>
          <li>• Establece un stock mínimo para evitar quedarte sin inventario</li>
          <li>• Actualiza el stock regularmente para mantener información precisa</li>
        </ul>
      </div>
    </div>
  );
}



