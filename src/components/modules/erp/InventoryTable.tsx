// 📦 TABLA DE INVENTARIO - Componente reutilizable
"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { InventoryItem } from "@/types/nexus";
import { Edit, Trash2, Package, AlertTriangle } from "lucide-react";

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (itemId: string) => void;
}

export function InventoryTable({ items, onEdit, onDelete }: InventoryTableProps) {
  const getStockStatus = (item: InventoryItem) => {
    if (item.stock <= item.minStock * 0.5) {
      return { label: "Crítico", variant: "danger" as const, icon: AlertTriangle };
    } else if (item.stock <= item.minStock) {
      return { label: "Bajo", variant: "warning" as const, icon: AlertTriangle };
    }
    return { label: "OK", variant: "success" as const, icon: Package };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left p-4 font-semibold text-gray-700">Producto</th>
            <th className="text-left p-4 font-semibold text-gray-700">Categoría</th>
            <th className="text-left p-4 font-semibold text-gray-700">SKU</th>
            <th className="text-center p-4 font-semibold text-gray-700">Stock</th>
            <th className="text-right p-4 font-semibold text-gray-700">Precio Compra</th>
            <th className="text-right p-4 font-semibold text-gray-700">Precio Venta</th>
            <th className="text-center p-4 font-semibold text-gray-700">Estado</th>
            <th className="text-center p-4 font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const status = getStockStatus(item);
            const StatusIcon = status.icon;
            
            return (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.supplier && (
                        <p className="text-xs text-gray-500">{item.supplier}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="default" size="sm">
                    {item.category}
                  </Badge>
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-gray-600">{item.sku}</span>
                </td>
                <td className="p-4 text-center">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.stock} {item.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      Mín: {item.minStock} {item.unit}
                    </p>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className="text-gray-600">{formatCurrency(item.costPrice)}</span>
                </td>
                <td className="p-4 text-right">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(item.salePrice)}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <Badge variant={status.variant} size="sm" className="flex items-center gap-1 w-fit mx-auto">
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {items.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No hay productos en el inventario</p>
          <p className="text-gray-400 text-sm">Agrega tu primer producto para comenzar</p>
        </div>
      )}
    </div>
  );
}



