"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  getERPStats,
  getLowStockItems,
  getTopSellingProducts,
  getSales,
} from "@/lib/services/erp/erp-service";
import { getSubscription } from "@/lib/services/erp/subscription-service";
import type { ERPStats, InventoryItem, Subscription } from "@/types/nexus";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  Calendar,
  ArrowUp,
  ArrowDown,
  Loader2,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { TrialBanner } from "@/components/modules/erp/TrialBanner";
import { PlanBadge } from "@/components/modules/erp/PlanBadge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ERPPage() {
  const [stats, setStats] = useState<ERPStats | null>(null);
  const [lowStock, setLowStock] = useState<InventoryItem[]>([]);
  const [topProducts, setTopProducts] = useState<
    Array<{ productName: string; quantity: number; revenue: number }>
  >([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [period, setPeriod] = useState<ERPStats["period"]>("month");
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Obtener del contexto de autenticación
  const companyId = "1";

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, lowStockData, topProductsData, subscriptionData, salesHistory] = await Promise.all([
        getERPStats(companyId, period),
        getLowStockItems(companyId),
        getTopSellingProducts(companyId, 5),
        getSubscription(companyId),
        getSales(companyId),
      ]);

      setStats(statsData);
      setLowStock(lowStockData);
      setTopProducts(topProductsData);
      setSubscription(subscriptionData);

      // Preparar datos para gráfica de ventas (últimos 7 días)
      const last7Days = salesHistory.slice(0, 7).reverse();
      const chartData = last7Days.map((sale) => ({
        date: new Date(sale.saleDate).toLocaleDateString("es-MX", { day: "2-digit", month: "short" }),
        ventas: sale.total,
        productos: sale.items.length,
      }));
      setSalesData(chartData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "today":
        return "Hoy";
      case "week":
        return "Esta Semana";
      case "month":
        return "Este Mes";
      case "year":
        return "Este Año";
    }
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
      {/* Trial Banner */}
      {subscription && <TrialBanner subscription={subscription} />}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  ERP - Dashboard
                </h1>
                {subscription && (
                  <PlanBadge planType={subscription.planType} status={subscription.status} />
                )}
              </div>
              <p className="text-gray-600">Sistema de Gestión Empresarial</p>
            </div>
          </div>

          {/* Filtro de período */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as ERPStats["period"])}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="today">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="year">Este Año</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Ventas */}
        <Card className="shadow-lg border-gray-200 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <Badge variant="success" size="sm" className="flex items-center gap-1">
                <ArrowUp className="w-3 h-3" />
                {stats?.salesCount || 0}
              </Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Ventas</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats?.totalSales || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        {/* Compras */}
        <Card className="shadow-lg border-gray-200 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
              <Badge variant="default" size="sm" className="flex items-center gap-1">
                {stats?.purchasesCount || 0}
              </Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Compras</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats?.totalPurchases || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        {/* Inventario */}
        <Card className="shadow-lg border-gray-200 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              {stats && stats.lowStockItems > 0 && (
                <Badge variant="warning" size="sm" className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {stats.lowStockItems}
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Inventario</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats?.inventoryValue || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Valor total</p>
          </CardContent>
        </Card>

        {/* Clientes */}
        <Card className="shadow-lg border-gray-200 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Clientes</h3>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalCustomers || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas - Solo para Premium y Plus */}
      {subscription && subscription.features.advancedReports && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Gráfica de Ventas */}
          <Card className="shadow-lg border-gray-200">
            <CardHeader className="bg-linear-to-r from-green-50 to-blue-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-green-600" />
                Evolución de Ventas (Últimos 7 días)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Line
                    type="monotone"
                    dataKey="ventas"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfica de Productos Vendidos */}
          <Card className="shadow-lg border-gray-200">
            <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5 text-purple-600" />
                Top Productos por Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="productName"
                    stroke="#6b7280"
                    fontSize={11}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Alertas de Stock Bajo */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-linear-to-r from-orange-50 to-red-50 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Alertas de Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {lowStock.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                ✅ Todos los productos tienen stock suficiente
              </p>
            ) : (
              <div className="space-y-3">
                {lowStock.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Stock: {item.stock} {item.unit} (Mín: {item.minStock})
                      </p>
                    </div>
                    <Badge variant="warning">Bajo</Badge>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/dashboard/erp/inventory"
              className="block mt-4 text-center text-primary hover:text-primary-hover font-medium"
            >
              Ver inventario completo →
            </Link>
          </CardContent>
        </Card>

        {/* Productos Más Vendidos */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-linear-to-r from-green-50 to-blue-50 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Productos Más Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {topProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay ventas registradas</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.productName}</p>
                      <p className="text-sm text-gray-600">
                        {product.quantity} unidades vendidas
                      </p>
                    </div>
                    <p className="font-bold text-green-600">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Accesos rápidos a módulos */}
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-linear-to-r from-primary/5 to-secondary/5 border-b border-gray-200">
          <CardTitle className="text-lg">Módulos del ERP</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/erp/inventory"
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <Package className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">Inventario</h3>
              <p className="text-sm text-gray-600">Gestión de productos</p>
            </Link>

            <Link
              href="/dashboard/erp/sales"
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <DollarSign className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">Ventas</h3>
              <p className="text-sm text-gray-600">Registrar y consultar</p>
            </Link>

            <Link
              href="/dashboard/erp/purchases"
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
            >
              <ShoppingCart className="w-8 h-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">Compras</h3>
              <p className="text-sm text-gray-600">Proveedores y gastos</p>
            </Link>

            <Link
              href="/dashboard/erp/customers"
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <Users className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">Clientes</h3>
              <p className="text-sm text-gray-600">Base de datos</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




