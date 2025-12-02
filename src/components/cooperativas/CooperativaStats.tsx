"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Users,
  Package,
  TrendingUp,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { Cooperative } from '@/types/nexus';

interface CooperativaStatsProps {
  cooperativa: Cooperative;
  showCharts?: boolean;
  previousPeriodData?: {
    totalMembers: number;
    totalProducts: number;
    totalSales: number;
  };
}

export const CooperativaStats: React.FC<CooperativaStatsProps> = ({
  cooperativa,
  showCharts = false,
  previousPeriodData
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(value);
  };

  const calculateChange = (current: number, previous: number | undefined) => {
    if (!previous || previous === 0) return { percentage: 0, direction: 'neutral' as const };
    
    const change = ((current - previous) / previous) * 100;
    const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    
    return {
      percentage: Math.abs(change),
      direction
    };
  };

  const membersChange = calculateChange(cooperativa.totalMembers, previousPeriodData?.totalMembers);
  const productsChange = calculateChange(cooperativa.totalProducts, previousPeriodData?.totalProducts);
  const salesChange = calculateChange(cooperativa.totalSales, previousPeriodData?.totalSales);

  const stats = [
    {
      label: 'Miembros Totales',
      value: cooperativa.totalMembers.toString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      change: membersChange
    },
    {
      label: 'Productos Activos',
      value: cooperativa.totalProducts.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: productsChange
    },
    {
      label: 'Ventas Totales',
      value: formatCurrency(cooperativa.totalSales),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: salesChange
    },
    {
      label: 'Capacidad de Producción',
      value: cooperativa.productionCapacity,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      change: { percentage: 0, direction: 'neutral' as const }
    }
  ];

  const ChangeIndicator: React.FC<{ change: typeof membersChange }> = ({ change }) => {
    if (!previousPeriodData || change.direction === 'neutral') return null;

    const Icon = change.direction === 'up' ? ArrowUp : ArrowDown;
    const colorClass = change.direction === 'up' ? 'text-green-600' : 'text-red-600';

    return (
      <div className={`flex items-center gap-1 text-xs font-medium ${colorClass}`}>
        <Icon className="h-3 w-3" />
        {change.percentage.toFixed(1)}%
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <Card 
              key={index} 
              className={`p-4 border-2 ${stat.borderColor} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                {previousPeriodData && (
                  <ChangeIndicator change={stat.change} />
                )}
              </div>
              
              <div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Comparación con período anterior */}
      {previousPeriodData && (
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            Crecimiento vs. Período Anterior
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Miembros</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {previousPeriodData.totalMembers} → {cooperativa.totalMembers}
                </span>
                <ChangeIndicator change={membersChange} />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Productos</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {previousPeriodData.totalProducts} → {cooperativa.totalProducts}
                </span>
                <ChangeIndicator change={productsChange} />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ventas</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {formatCurrency(previousPeriodData.totalSales)} → {formatCurrency(cooperativa.totalSales)}
                </span>
                <ChangeIndicator change={salesChange} />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Placeholder para mini charts (Premium) */}
      {showCharts && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            Tendencias (Últimos 30 días)
          </h3>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Gráficos disponibles en Plan Premium</p>
          </div>
        </Card>
      )}
    </div>
  );
};



