"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getSales } from "@/lib/services/erp/erp-service";
import type { Sale } from "@/types/nexus";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Calendar,
  ArrowLeft,
  Loader2,
  User,
  CreditCard,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Obtener del contexto de autenticación
  const companyId = "1";

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    setIsLoading(true);
    try {
      const data = await getSales(companyId);
      setSales(data.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()));
    } catch (error) {
      console.error("Error al cargar ventas:", error);
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

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const avgTicket = sales.length > 0 ? totalSales / sales.length : 0;
  const pendingSales = sales.filter((s) => s.paymentStatus === "Pendiente").length;

  const getPaymentStatusBadge = (status: Sale["paymentStatus"]) => {
    switch (status) {
      case "Pagado":
        return { variant: "success" as const, icon: CheckCircle, label: "Pagado" };
      case "Pendiente":
        return { variant: "warning" as const, icon: Clock, label: "Pendiente" };
      case "Parcial":
        return { variant: "default" as const, icon: Clock, label: "Parcial" };
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
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/dashboard/erp"
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Ventas
            </h1>
            <p className="text-gray-600">Historial y estadísticas</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Ventas</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSales)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <Badge variant="default">{sales.length}</Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Ticket Promedio</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgTicket)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              {pendingSales > 0 && <Badge variant="warning">{pendingSales}</Badge>}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Pagos Pendientes</h3>
            <p className="text-2xl font-bold text-gray-900">{pendingSales}</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Ventas */}
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-linear-to-r from-green-50 to-blue-50 border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-green-600" />
            Historial de Ventas ({sales.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {sales.map((sale) => {
              const statusInfo = getPaymentStatusBadge(sale.paymentStatus);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div
                  key={sale.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shrink-0">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{sale.saleNumber}</h3>
                          <Badge variant={statusInfo.variant} size="sm" className="flex items-center gap-1">
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {sale.customerName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(sale.saleDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            {sale.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(sale.total)}
                      </p>
                      <p className="text-sm text-gray-500">{sale.items.length} productos</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="ml-16 space-y-2">
                    {sale.items.map((item, idx) => (
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

                  {sale.notes && (
                    <p className="ml-16 mt-3 text-sm text-gray-500 italic">
                      Nota: {sale.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {sales.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay ventas registradas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}




