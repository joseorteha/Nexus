"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Users, 
  Package, 
  MapPin, 
  Award, 
  TrendingUp,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { Cooperative } from '@/types/nexus';

interface CooperativaCardProps {
  cooperativa: Cooperative;
  onVerDetalles?: (id: string) => void;
  onSolicitarUnirse?: (id: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const CooperativaCard: React.FC<CooperativaCardProps> = ({
  cooperativa,
  onVerDetalles,
  onSolicitarUnirse,
  showActions = true,
  compact = false
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getStatusConfig = (status: Cooperative['status']) => {
    switch(status) {
      case 'active':
        return { label: 'Activa', color: 'bg-green-500/10 text-green-700 border-green-300' };
      case 'pending':
        return { label: 'Pendiente', color: 'bg-orange-500/10 text-orange-700 border-orange-300' };
      case 'inactive':
        return { label: 'Inactiva', color: 'bg-gray-500/10 text-gray-700 border-gray-300' };
    }
  };

  const statusConfig = getStatusConfig(cooperativa.status);

  if (compact) {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{cooperativa.name}</h3>
              <Badge variant="default" className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {cooperativa.description}
            </p>

            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{cooperativa.totalMembers} miembros</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5" />
                <span>{cooperativa.totalProducts} productos</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{cooperativa.region}</span>
              </div>
            </div>
          </div>

          {showActions && cooperativa.status === 'active' && (
            <Button 
              size="sm"
              onClick={() => onSolicitarUnirse?.(cooperativa.id)}
              className="shrink-0"
            >
              Unirse
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{cooperativa.name}</h3>
            <div className="flex items-center gap-2 text-purple-100">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Fundada en {formatDate(cooperativa.foundedDate)}</span>
            </div>
          </div>
          <Badge variant="info" className="bg-white/20 text-white border-white/30">
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-6">
        {/* Descripción */}
        <div>
          <p className="text-muted-foreground leading-relaxed">
            {cooperativa.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Users className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <div className="font-bold text-lg text-purple-600">{cooperativa.totalMembers}</div>
            <div className="text-xs text-muted-foreground">Miembros</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Package className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <div className="font-bold text-lg text-blue-600">{cooperativa.totalProducts}</div>
            <div className="text-xs text-muted-foreground">Productos</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <div className="font-bold text-lg text-green-600">{formatCurrency(cooperativa.totalSales)}</div>
            <div className="text-xs text-muted-foreground">Ventas</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Package className="h-5 w-5 text-orange-600 mx-auto mb-1" />
            <div className="font-bold text-lg text-orange-600">{cooperativa.productionCapacity}</div>
            <div className="text-xs text-muted-foreground">Capacidad</div>
          </div>
        </div>

        {/* Categorías */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Categorías de Productos
          </h4>
          <div className="flex flex-wrap gap-2">
            {cooperativa.category.map((cat, index) => (
              <Badge key={index} variant="info" className="bg-purple-100 text-purple-700">
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Certificaciones */}
        {cooperativa.certifications && cooperativa.certifications.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certificaciones
            </h4>
            <div className="flex flex-wrap gap-2">
              {cooperativa.certifications?.map((cert, index) => (
                <Badge 
                  key={index} 
                  variant="default" 
                  className="bg-green-50 text-green-700 border-green-300"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {cert}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Las certificaciones garantizan calidad y responsabilidad
            </p>
          </div>
        )}

        {/* Región */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Ubicación
          </h4>
          <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-300">
            {cooperativa.region}
          </Badge>
        </div>

        {/* Actions */}
        {showActions && cooperativa.status === 'active' && (
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="default" 
              className="flex-1"
              onClick={() => onVerDetalles?.(cooperativa.id)}
            >
              Ver Detalles
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => onSolicitarUnirse?.(cooperativa.id)}
            >
              <Users className="h-4 w-4 mr-2" />
              Solicitar Unirse
            </Button>
          </div>
        )}

        {cooperativa.status === 'pending' && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
            Esta cooperativa está en proceso de revisión por un administrador.
          </div>
        )}

        {cooperativa.status === 'inactive' && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
            Esta cooperativa no está activa actualmente.
          </div>
        )}
      </div>
    </Card>
  );
};



