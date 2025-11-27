"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";
import { Store, Users, Package, MapPin, Award, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default function CrearCooperativaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    productos: [] as string[],
    categorias: [] as string[],
    region: "",
    capacidadProduccion: "",
    certificaciones: [] as string[],
  });

  const categorias = [
    "Café", "Artesanías", "Textiles", "Miel", "Productos Orgánicos",
    "Alimentos Procesados", "Bebidas", "Cosméticos Naturales", "Otros"
  ];

  const regiones = ["Zongolica", "Orizaba", "Córdoba", "Fortín", "Otra región"];

  const toggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categorias: prev.categorias.includes(cat)
        ? prev.categorias.filter(c => c !== cat)
        : [...prev.categorias, cat]
    }));
  };

  const addProduct = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = e.currentTarget.value.trim();
      if (value) {
        setFormData(prev => ({
          ...prev,
          productos: [...prev.productos, value]
        }));
        e.currentTarget.value = "";
      }
    }
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index)
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay usuario autenticado");

      const { data: userData } = await supabase
        .from("usuarios")
        .select("nombre, apellidos")
        .eq("id", user.id)
        .single();

      // Crear cooperativa directamente (convocatoria activa)
      const { data: cooperativa, error } = await supabase
        .from("cooperativas")
        .insert({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          creada_por: user.id,
          categoria: formData.categorias,
          region: formData.region,
          capacidad_produccion: formData.capacidadProduccion,
          productos_ofrecidos: formData.productos,
          buscando_miembros: true,
          miembros_objetivo: 10,
          total_miembros: 1,
          estado: "active"
        })
        .select()
        .single();

      if (error) throw error;

      // Agregar al creador como primer miembro
      await supabase
        .from("cooperativa_miembros")
        .insert({
          cooperativa_id: cooperativa.id,
          user_id: user.id,
          rol: "fundador"
        });

      alert("¡Cooperativa creada! Ahora aparecerá en Match para que otros usuarios se unan.");
      router.push("/dashboard/match");
    } catch (error: any) {
      console.error("Error:", error);
      alert("Error al crear cooperativa: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Crear Cooperativa
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Inicia tu propia cooperativa y lidera un grupo de productores
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Cooperativa *
            </label>
            <Input
              type="text"
              placeholder="Ej: Cooperativa Café de la Sierra"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
              placeholder="Describe la visión y objetivos de la cooperativa..."
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              required
            />
          </div>

          {/* Productos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Productos que ofrecerá *
            </label>
            <Input
              type="text"
              placeholder="Escribe un producto y presiona Enter"
              onKeyDown={addProduct}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.productos.map((producto, index) => (
                <Badge
                  key={index}
                  variant="default"
                  className="flex items-center gap-2 px-3 py-2"
                >
                  {producto}
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Categorías */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorías *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.categorias.includes(cat)
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Región */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Región
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {regiones.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, region }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.region === region
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Capacidad de Producción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-1" />
              Capacidad de Producción Estimada
            </label>
            <Input
              type="text"
              placeholder="Ej: 500 kg al mes"
              value={formData.capacidadProduccion}
              onChange={(e) => setFormData(prev => ({ ...prev, capacidadProduccion: e.target.value }))}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.nombre || formData.productos.length === 0 || formData.categorias.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500"
            >
              {loading ? "Creando..." : "Crear Cooperativa"}
            </Button>
          </div>
        </div>
      </form>

      {/* Información */}
      <div className="mt-8 max-w-3xl bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Award className="w-5 h-5" />
          ¿Cómo funciona?
        </h3>
        <ul className="text-blue-800 text-sm space-y-2">
          <li>• Tu cooperativa aparecerá inmediatamente en Match como convocatoria</li>
          <li>• Otros usuarios normales verán tu proyecto y podrán unirse</li>
          <li>• Podrás gestionar tu cooperativa desde el dashboard</li>
          <li>• Tendrás acceso al ERP compartido con todos los miembros</li>
        </ul>
      </div>
    </div>
  );
}
