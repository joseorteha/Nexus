"use client";

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Search,
  Filter,
  FileText,
  Users,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  X
} from 'lucide-react';
import { CooperativeRequest } from '@/types/nexus';

interface SolicitudesPendientesProps {
  solicitudes: CooperativeRequest[];
  onVerDetalles: (solicitud: CooperativeRequest) => void;
  onAprobar?: (id: string) => void;
  onRechazar?: (id: string) => void;
  showActions?: boolean;
}

export const SolicitudesPendientes: React.FC<SolicitudesPendientesProps> = ({
  solicitudes,
  onVerDetalles,
  onAprobar,
  onRechazar,
  showActions = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'create' | 'join'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeConfig = (type: CooperativeRequest['type']) => {
    switch(type) {
      case 'create':
        return {
          label: 'Crear Cooperativa',
          color: 'bg-purple-500/10 text-purple-700 border-purple-300',
          icon: Building2
        };
      case 'join':
        return {
          label: 'Unirse a Cooperativa',
          color: 'bg-blue-500/10 text-blue-700 border-blue-300',
          icon: Users
        };
    }
  };

  const getStatusConfig = (status: CooperativeRequest['status']) => {
    switch(status) {
      case 'pending':
        return {
          label: 'Pendiente',
          color: 'bg-orange-500/10 text-orange-700 border-orange-300',
          icon: Clock
        };
      case 'approved':
        return {
          label: 'Aprobada',
          color: 'bg-green-500/10 text-green-700 border-green-300',
          icon: CheckCircle
        };
      case 'rejected':
        return {
          label: 'Rechazada',
          color: 'bg-red-500/10 text-red-700 border-red-300',
          icon: XCircle
        };
    }
  };

  // Filtrado
  const filteredSolicitudes = useMemo(() => {
    return solicitudes.filter(sol => {
      // Búsqueda
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matches = 
          sol.userName.toLowerCase().includes(searchLower) ||
          sol.userEmail.toLowerCase().includes(searchLower) ||
          sol.cooperativeName?.toLowerCase().includes(searchLower);
        
        if (!matches) return false;
      }

      // Filtro por tipo
      if (filterType !== 'all' && sol.type !== filterType) return false;

      // Filtro por estado
      if (filterStatus !== 'all' && sol.status !== filterStatus) return false;

      return true;
    });
  }, [solicitudes, searchTerm, filterType, filterStatus]);

  // Ordenar: pendientes primero, luego por fecha
  const sortedSolicitudes = [...filteredSolicitudes].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });

  const pendingCount = solicitudes.filter(s => s.status === 'pending').length;
  const activeFiltersCount = (filterType !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Header con contador */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-orange-600" />
            Solicitudes
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {pendingCount} solicitud{pendingCount !== 1 ? 'es' : ''} pendiente{pendingCount !== 1 ? 's' : ''} de revisión
          </p>
        </div>
        
        {pendingCount > 0 && (
          <Badge className="bg-orange-500 text-white">
            {pendingCount} Pendiente{pendingCount !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Barra de búsqueda y filtros */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o cooperativa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Botón de filtros */}
          <Button
            variant="default"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge 
                variant="info" 
                className="ml-2 bg-orange-600 text-white h-5 w-5 p-0 flex items-center justify-center rounded-full"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div>
              <label className="text-sm font-semibold mb-2 block">Tipo de Solicitud</label>
              <div className="flex flex-wrap gap-2">
                <div onClick={() => setFilterType('all')} className="cursor-pointer">
                  <Badge
                    variant="default"
                    className=""
                  >
                    Todas
                  </Badge>
                </div>
                <div onClick={() => setFilterType('create')} className="cursor-pointer">
                  <Badge
                    variant="default"
                    className={`${filterType === 'create' ? 'bg-purple-600' : 'hover:bg-purple-50'}`}
                  >
                    <Building2 className="h-3 w-3 mr-1" />
                    Crear Cooperativa
                  </Badge>
                </div>
                <div onClick={() => setFilterType('join')} className="cursor-pointer">
                  <Badge
                    variant="default"
                    className={`${filterType === 'join' ? 'bg-blue-600' : 'hover:bg-blue-50'}`}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Unirse a Cooperativa
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Estado</label>
              <div className="flex flex-wrap gap-2">
                <div onClick={() => setFilterStatus('all')} className="cursor-pointer">
                  <Badge
                    variant="default"
                    className=""
                  >
                    Todos
                  </Badge>
                </div>
                <div onClick={() => setFilterStatus('pending')} className="cursor-pointer">
                  <Badge
                    variant="default"
                    className={`${filterStatus === 'pending' ? 'bg-orange-600' : 'hover:bg-orange-50'}`}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Pendientes
                  </Badge>
                </div>
                <div onClick={() => setFilterStatus('approved')} className="cursor-pointer">
                  <Badge
                    variant="default"
                    className={`${filterStatus === 'approved' ? 'bg-green-600' : 'hover:bg-green-50'}`}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aprobadas
                  </Badge>
                </div>
                <div onClick={() => setFilterStatus('rejected')} className="cursor-pointer">
                  <Badge
                    variant="default"
                    className={`${filterStatus === 'rejected' ? 'bg-red-600' : 'hover:bg-red-50'}`}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Rechazadas
                  </Badge>
                </div>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterType('all');
                  setFilterStatus('all');
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Lista de solicitudes */}
      <div className="space-y-3">
        {sortedSolicitudes.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No se encontraron solicitudes</h3>
            <p className="text-muted-foreground">
              {activeFiltersCount > 0 
                ? 'Intenta ajustar los filtros para ver más resultados'
                : 'No hay solicitudes en este momento'
              }
            </p>
          </Card>
        ) : (
          sortedSolicitudes.map((solicitud) => {
            const typeConfig = getTypeConfig(solicitud.type);
            const statusConfig = getStatusConfig(solicitud.status);
            const TypeIcon = typeConfig.icon;
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={solicitud.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Info principal */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {solicitud.userName.charAt(0).toUpperCase()}
                      </div>

                      {/* Detalles */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold">{solicitud.userName}</h3>
                          <Badge variant="default" className={typeConfig.color}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {typeConfig.label}
                          </Badge>
                          <Badge variant="default" className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            {solicitud.userEmail}
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5" />
                            {solicitud.cooperativeName}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(solicitud.requestDate)}
                          </div>
                        </div>

                        {/* Info de revisión */}
                        {solicitud.reviewedBy && solicitud.reviewedAt && (
                          <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                            Revisado por <span className="font-medium">{solicitud.reviewedBy}</span> el {formatDate(solicitud.reviewedAt)}
                            {solicitud.reviewNotes && (
                              <div className="mt-1 italic">"{solicitud.reviewNotes}"</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex md:flex-col gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onVerDetalles(solicitud)}
                      className="flex-1 md:flex-none"
                    >
                      Ver Detalles
                    </Button>

                    {showActions && solicitud.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => onAprobar?.(solicitud.id)}
                          className="flex-1 md:flex-none bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 md:mr-2" />
                          <span className="hidden md:inline">Aprobar</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onRechazar?.(solicitud.id)}
                          className="flex-1 md:flex-none"
                        >
                          <XCircle className="h-4 w-4 md:mr-2" />
                          <span className="hidden md:inline">Rechazar</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};



