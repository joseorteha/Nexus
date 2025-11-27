"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { InventoryTable } from "@/components/modules/erp/InventoryTable";
import { InventoryForm } from "@/components/modules/erp/InventoryForm";
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
} from "@/lib/services/erp/erp-service";
import { getSubscription, canAddMore } from "@/lib/services/erp/subscription-service";
import type { InventoryItem, Subscription } from "@/types/nexus";
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  TrendingUp,
  AlertTriangle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  // TODO: Obtener del contexto de autenticación
  const companyId = "1";

  useEffect(() => {
    loadInventory();
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await getSubscription(companyId);
      setSubscription(data);
    } catch (error) {
      console.error("Error al cargar suscripción:", error);
    }
  };

  useEffect(() => {
    filterInventory();
  }, [inventory, searchQuery, categoryFilter, stockFilter]);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const data = await getInventory(companyId);
      setInventory(data);
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = [...inventory];

    // Filtro de búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro de categoría
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Filtro de stock
    if (stockFilter === "low") {
      filtered = filtered.filter((item) => item.stock <= item.minStock);
    } else if (stockFilter === "ok") {
      filtered = filtered.filter((item) => item.stock > item.minStock);
    }

    setFilteredInventory(filtered);
  };

  const handleAddProduct = () => {
    // Verificar límite del plan
    if (subscription) {
      const check = canAddMore(subscription, "products", inventory.length);
      if (!check.allowed) {
        alert(check.reason);
        return;
      }
    }
    
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditProduct = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteProduct = async (itemId: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteInventoryItem(companyId, itemId);
        setInventory((prev) => prev.filter((item) => item.id !== itemId));
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    }
  };

  const handleSubmitForm = async (data: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingItem) {
        // Editar
        const updated = await updateInventoryItem(companyId, editingItem.id, data);
        setInventory((prev) =>
          prev.map((item) => (item.id === editingItem.id ? updated : item))
        );
      } else {
        // Agregar
        const newItem = await addInventoryItem(companyId, data);
        setInventory((prev) => [...prev, newItem]);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  const categories = Array.from(new Set(inventory.map((item) => item.category)));
  const totalValue = inventory.reduce((sum, item) => sum + item.stock * item.salePrice, 0);
  const lowStockCount = inventory.filter((item) => item.stock <= item.minStock).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/dashboard/erp"
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Inventario
            </h1>
            <p className="text-gray-600">Gestión de productos y stock</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <Badge variant="default">{inventory.length}</Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Productos</h3>
            <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Valor Inventario</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              {lowStockCount > 0 && (
                <Badge variant="warning">{lowStockCount}</Badge>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Stock Bajo</h3>
            <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="shadow-lg border-gray-200 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, SKU o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Filtro de categoría */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Filtro de stock */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todos los stocks</option>
              <option value="low">Stock bajo</option>
              <option value="ok">Stock OK</option>
            </select>

            {/* Botón Agregar */}
            <Button
              variant="default"
              onClick={handleAddProduct}
              className="bg-linear-to-r from-primary to-secondary text-white hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar Producto
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Inventario */}
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-linear-to-r from-primary/5 to-secondary/5 border-b border-gray-200">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Productos ({filteredInventory.length})
            </span>
            <Button variant="default" size="sm" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <InventoryTable
            items={filteredInventory}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </CardContent>
      </Card>

      {/* Formulario Modal */}
      {showForm && (
        <InventoryForm
          item={editingItem}
          companyId={companyId}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

