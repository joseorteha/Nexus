// 📝 FORMULARIO DE INVENTARIO - Agregar/Editar productos
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { InventoryItem } from "@/types/nexus";
import { X, Save, Package } from "lucide-react";

interface InventoryFormProps {
  item?: InventoryItem | null;
  companyId: string;
  onSubmit: (data: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function InventoryForm({ item, companyId, onSubmit, onCancel }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sku: "",
    stock: 0,
    unit: "pz",
    costPrice: 0,
    salePrice: 0,
    minStock: 0,
    maxStock: 0,
    supplier: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        sku: item.sku,
        stock: item.stock,
        unit: item.unit,
        costPrice: item.costPrice,
        salePrice: item.salePrice,
        minStock: item.minStock,
        maxStock: item.maxStock,
        supplier: item.supplier || "",
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      companyId,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-primary to-secondary text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">
              {item ? "Editar Producto" : "Nuevo Producto"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Café orgánico 1kg"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Producto terminado">Producto terminado</option>
                  <option value="Materia prima">Materia prima</option>
                  <option value="Insumos">Insumos</option>
                  <option value="Herramientas">Herramientas</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Código) *
                </label>
                <Input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Ej: CAFE-ORG-1KG"
                  required
                  className="w-full uppercase"
                />
              </div>
            </div>
          </div>

          {/* Stock */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventario</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Actual *
                </label>
                <Input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad de Medida *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pz">Piezas (pz)</option>
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="litros">Litros</option>
                  <option value="cajas">Cajas</option>
                  <option value="paquetes">Paquetes</option>
                  <option value="metros">Metros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Mínimo *
                </label>
                <Input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Máximo *
                </label>
                <Input
                  type="number"
                  name="maxStock"
                  value={formData.maxStock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Precios */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Precios</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio de Compra *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="w-full pl-8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio de Venta *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="w-full pl-8"
                  />
                </div>
                {formData.costPrice > 0 && formData.salePrice > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Margen:{" "}
                    {(
                      ((formData.salePrice - formData.costPrice) / formData.costPrice) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Proveedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proveedor
            </label>
            <Input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Nombre del proveedor principal"
              className="w-full"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="default"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1 bg-linear-to-r from-primary to-secondary text-white hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              {item ? "Guardar Cambios" : "Agregar Producto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}



