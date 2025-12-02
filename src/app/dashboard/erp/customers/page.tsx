"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getCustomers } from "@/lib/services/erp/erp-service";
import type { Customer } from "@/types/nexus";
import {
  Users,
  Building2,
  UserCircle,
  Phone,
  Mail,
  CreditCard,
  TrendingUp,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Obtener del contexto de autenticación
  const companyId = "1";

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await getCustomers(companyId);
      setCustomers(data.sort((a, b) => b.totalPurchases - a.totalPurchases));
    } catch (error) {
      console.error("Error al cargar clientes:", error);
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

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
  const totalDebt = customers.reduce((sum, c) => sum + c.currentDebt, 0);
  const empresaCustomers = customers.filter((c) => c.type === "Empresa").length;
  const individualCustomers = customers.filter((c) => c.type === "Individual").length;

  const getCustomerTypeBadge = (type: Customer["type"]) => {
    switch (type) {
      case "Empresa":
        return { variant: "default" as const, icon: Building2, label: "Empresa" };
      case "Individual":
        return { variant: "info" as const, icon: UserCircle, label: "Individual" };
    }
  };

  const getCreditUsage = (customer: Customer) => {
    if (!customer.creditLimit || customer.creditLimit === 0) return null;
    const percentage = (customer.currentDebt / customer.creditLimit) * 100;
    return {
      percentage: Math.min(percentage, 100),
      color: percentage >= 90 ? "text-red-600" : percentage >= 70 ? "text-orange-600" : "text-green-600",
    };
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
          <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Clientes
            </h1>
            <p className="text-gray-600">Directorio y estadísticas</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <Badge variant="default">{customers.length}</Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Clientes</h3>
            <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Ingresos Totales</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              {totalDebt > 0 && <Badge variant="warning">${(totalDebt / 1000).toFixed(0)}k</Badge>}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Cartera Pendiente</h3>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalDebt)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Empresas / Individuos</h3>
            <p className="text-2xl font-bold text-gray-900">
              {empresaCustomers} / {individualCustomers}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-linear-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Directorio de Clientes ({customers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {customers.map((customer) => {
              const typeInfo = getCustomerTypeBadge(customer.type);
              const TypeIcon = typeInfo.icon;
              const creditUsage = getCreditUsage(customer);
              
              return (
                <div
                  key={customer.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shrink-0">
                        <TypeIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
                          <Badge variant={typeInfo.variant} size="sm" className="flex items-center gap-1">
                            <TypeIcon className="w-3 h-3" />
                            {typeInfo.label}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          {customer.rfc && (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                {customer.rfc}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            {customer.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {customer.email}
                              </span>
                            )}
                            {customer.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {customer.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(customer.totalPurchases)}
                      </p>
                      <p className="text-sm text-gray-500">Compras totales</p>
                    </div>
                  </div>

                  {/* Crédito y Deuda */}
                  {(customer.creditLimit || customer.currentDebt > 0) && (
                    <div className="ml-16 grid md:grid-cols-2 gap-4">
                      {customer.creditLimit && customer.creditLimit > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-900 flex items-center gap-1">
                              <CreditCard className="w-4 h-4" />
                              Límite de Crédito
                            </span>
                            <span className="text-sm font-bold text-blue-700">
                              {formatCurrency(customer.creditLimit)}
                            </span>
                          </div>
                          {creditUsage && (
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className={creditUsage.color}>
                                  Usado: {creditUsage.percentage.toFixed(0)}%
                                </span>
                                <span className="text-gray-600">
                                  {formatCurrency(customer.currentDebt)}
                                </span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${
                                    creditUsage.percentage >= 90
                                      ? "bg-red-500"
                                      : creditUsage.percentage >= 70
                                      ? "bg-orange-500"
                                      : "bg-green-500"
                                  }`}
                                  style={{ width: `${creditUsage.percentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {customer.currentDebt > 0 && (
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-orange-900 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              Deuda Actual
                            </span>
                            <span className="text-sm font-bold text-orange-700">
                              {formatCurrency(customer.currentDebt)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {customers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay clientes registrados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



