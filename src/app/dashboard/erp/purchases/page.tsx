"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getPurchases } from "@/lib/services/erp/erp-service";
import type { Purchase } from "@/types/nexus";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Calendar,
  ArrowLeft,
  Loader2,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Obtener del contexto de autenticación
  const companyId = "1";

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    setIsLoading(true);
    try {
      const data = await getPurchases(companyId);
      setPurchases(data.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()));
    } catch (error) {
      console.error("Error al cargar compras:", error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalPurchases = purchases.reduce((sum, p) => sum + p.total, 0);
  const pendingPurchases = purchases.filter((p) => p.paymentStatus === "Pendiente");
  const pendingAmount = pendingPurchases.reduce((sum, p) => sum + p.total, 0);

  const getPaymentStatusBadge = (status: Purchase["paymentStatus"]) => {
    switch (status) {
      case "Pagado":
        return { variant: "success" as const, icon: CheckCircle, label: "Pagado" };
      case "Pendiente":
        return { variant: "warning" as const, icon: Clock, label: "Pendiente" };
      case "Parcial":
        return { variant: "default" as const, icon: Clock, label: "Parcial" };
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
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
          <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Compras
            </h1>
            <p className="text-gray-600">Historial y pagos pendientes</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Compras</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPurchases)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <Badge variant="default">{purchases.length}</Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Órdenes de Compra</h3>
            <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              {pendingPurchases.length > 0 && (
                <Badge variant="danger">{pendingPurchases.length}</Badge>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Pagos Pendientes</h3>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(pendingAmount)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Compras */}
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-linear-to-r from-orange-50 to-red-50 border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-orange-600" />
            Historial de Compras ({purchases.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {purchases.map((purchase) => {
              const statusInfo = getPaymentStatusBadge(purchase.paymentStatus);
              const StatusIcon = statusInfo.icon;
              const overdue = purchase.paymentStatus === "Pendiente" && isOverdue(purchase.dueDate);
              
              return (
                <div
                  key={purchase.id}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                    overdue ? "bg-red-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{purchase.purchaseNumber}</h3>
                          <Badge variant={statusInfo.variant} size="sm" className="flex items-center gap-1">
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </Badge>
                          {overdue && (
                            <Badge variant="danger" size="sm" className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Vencido
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {purchase.supplierName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(purchase.purchaseDate)}
                          </span>
                          {purchase.dueDate && (
                            <span className={`flex items-center gap-1 ${overdue ? "text-red-600 font-medium" : ""}`}>
                              <Clock className="w-4 h-4" />
                              Vence: {formatDate(purchase.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${overdue ? "text-red-600" : "text-orange-600"}`}>
                        {formatCurrency(purchase.total)}
                      </p>
                      <p className="text-sm text-gray-500">{purchase.items.length} productos</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="ml-16 space-y-2">
                    {purchase.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg"
                      >
                        <span className="text-gray-900">
                          {item.productName} x{item.quantity} {item.unit}
                        </span>
                        <span className="font-medium text-gray-700">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {purchase.notes && (
                    <p className="ml-16 mt-3 text-sm text-gray-500 italic">
                      Nota: {purchase.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {purchases.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay compras registradas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
