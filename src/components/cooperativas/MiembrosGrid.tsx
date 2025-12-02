"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Users,
  Mail,
  Calendar,
  Crown,
  CheckCircle,
  Clock
} from 'lucide-react';
import { CooperativeMember } from '@/types/nexus';

interface MiembrosGridProps {
  miembros: CooperativeMember[];
  showEmail?: boolean;
  compact?: boolean;
}

export const MiembrosGrid: React.FC<MiembrosGridProps> = ({
  miembros,
  showEmail = true,
  compact = false
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleConfig = (role: CooperativeMember['role']) => {
    switch(role) {
      case 'founder':
        return {
          label: 'Fundador',
          color: 'bg-purple-500/10 text-purple-700 border-purple-300',
          icon: Crown
        };
      case 'member':
        return {
          label: 'Miembro',
          color: 'bg-blue-500/10 text-blue-700 border-blue-300',
          icon: Users
        };
    }
  };

  const getStatusConfig = (status: CooperativeMember['status']) => {
    switch(status) {
      case 'active':
        return {
          label: 'Activo',
          color: 'bg-green-500/10 text-green-700 border-green-300',
          icon: CheckCircle
        };
      case 'pending':
        return {
          label: 'Pendiente',
          color: 'bg-orange-500/10 text-orange-700 border-orange-300',
          icon: Clock
        };
      default:
        return {
          label: 'Inactivo',
          color: 'bg-gray-500/10 text-gray-700 border-gray-300',
          icon: Users
        };
    }
  };

  // Ordenar: fundadores primero, luego por fecha de ingreso
  const sortedMiembros = [...miembros].sort((a, b) => {
    if (a.role === 'founder' && b.role !== 'founder') return -1;
    if (a.role !== 'founder' && b.role === 'founder') return 1;
    return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
  });

  if (compact) {
    return (
      <div className="space-y-2">
        {sortedMiembros.map((miembro) => {
          const roleConfig = getRoleConfig(miembro.role);
          const statusConfig = getStatusConfig(miembro.status);
          
          return (
            <div 
              key={miembro.id}
              className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Avatar placeholder */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold shrink-0">
                  {miembro.userName.charAt(0).toUpperCase()}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{miembro.userName}</div>
                  {showEmail && (
                    <div className="text-xs text-muted-foreground truncate">
                      {miembro.userEmail}
                    </div>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="default" className={roleConfig.color}>
                  {roleConfig.label}
                </Badge>
                <Badge variant="default" className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedMiembros.map((miembro) => {
        const roleConfig = getRoleConfig(miembro.role);
        const statusConfig = getStatusConfig(miembro.status);
        const RoleIcon = roleConfig.icon;
        const StatusIcon = statusConfig.icon;

        return (
          <Card key={miembro.id} className="p-4 hover:shadow-md transition-shadow">
            {/* Avatar y nombre */}
            <div className="flex items-start gap-3 mb-4">
              {/* Avatar placeholder con gradiente */}
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                {miembro.userName.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{miembro.userName}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge variant="default" className={`${roleConfig.color} text-xs`}>
                    <RoleIcon className="h-3 w-3 mr-1" />
                    {roleConfig.label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
              {showEmail && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{miembro.userEmail}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>Se unió el {formatDate(miembro.joinedAt)}</span>
              </div>

              <div className="pt-2 border-t">
                <Badge variant="default" className={statusConfig.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
            </div>

            {/* Indicador especial para fundadores */}
            {miembro.role === 'founder' && (
              <div className="mt-3 p-2 bg-purple-50 rounded-lg text-xs text-purple-700 text-center font-medium">
                ✨ Miembro Fundador
              </div>
            )}
          </Card>
        );
      })}

      {/* Empty state */}
      {sortedMiembros.length === 0 && (
        <div className="col-span-full">
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="font-semibold mb-1">Sin miembros</h3>
            <p className="text-sm text-muted-foreground">
              Aún no hay miembros en esta cooperativa
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
