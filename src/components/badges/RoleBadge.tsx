"use client";

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { 
  UserCircle,
  Users,
  Building2,
  Shield
} from 'lucide-react';
import { UserRole } from '@/types/nexus';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  variant?: 'default' | 'outline';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'md',
  showIcon = true,
  variant = 'default'
}) => {
  const getRoleConfig = (role: UserRole) => {
    switch(role) {
      case 'normal':
        return {
          label: 'Usuario Normal',
          icon: UserCircle,
          color: variant === 'outline' 
            ? 'bg-cyan-50 text-cyan-700 border-cyan-300 hover:bg-cyan-100'
            : 'bg-cyan-600 text-white hover:bg-cyan-700',
          iconColor: 'text-cyan-600'
        };
      case 'cooperativa':
        return {
          label: 'Cooperativa',
          icon: Users,
          color: variant === 'outline'
            ? 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100'
            : 'bg-purple-600 text-white hover:bg-purple-700',
          iconColor: 'text-purple-600'
        };
      case 'empresa':
        return {
          label: 'Empresa',
          icon: Building2,
          color: variant === 'outline'
            ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
            : 'bg-blue-600 text-white hover:bg-blue-700',
          iconColor: 'text-blue-600'
        };
      case 'admin':
        return {
          label: 'Administrador',
          icon: Shield,
          color: variant === 'outline'
            ? 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100'
            : 'bg-orange-600 text-white hover:bg-orange-700',
          iconColor: 'text-orange-600'
        };
    }
  };

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch(size) {
      case 'sm':
        return {
          badge: 'text-xs px-2 py-0.5',
          icon: 'h-3 w-3'
        };
      case 'md':
        return {
          badge: 'text-sm px-2.5 py-1',
          icon: 'h-3.5 w-3.5'
        };
      case 'lg':
        return {
          badge: 'text-base px-3 py-1.5',
          icon: 'h-4 w-4'
        };
    }
  };

  const config = getRoleConfig(role);
  const sizeClasses = getSizeClasses(size);
  const Icon = config.icon;

  return (
    <Badge 
      variant="default"
      className={`${variant === 'outline' ? 'bg-transparent border' : ''} ${config.color} ${sizeClasses.badge} font-medium transition-colors`}
    >
      {showIcon && (
        <Icon 
          className={`${sizeClasses.icon} mr-1 ${
            variant === 'outline' ? config.iconColor : ''
          }`} 
        />
      )}
      <span>{config.label}</span>
    </Badge>
  );
};

// Componente de ejemplo para mostrar todos los roles
export const RoleBadgeShowcase: React.FC = () => {
  const roles: UserRole[] = ['normal', 'cooperativa', 'empresa', 'admin'];
  const sizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg'];

  return (
    <div className="space-y-8 p-8">
      {/* Default variant */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Variante Default (Filled)</h3>
        <div className="space-y-4">
          {sizes.map(size => (
            <div key={size} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-16">
                {size.toUpperCase()}:
              </span>
              {roles.map(role => (
                <RoleBadge 
                  key={role} 
                  role={role} 
                  size={size}
                  variant="default"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Outline variant */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Variante Outline</h3>
        <div className="space-y-4">
          {sizes.map(size => (
            <div key={size} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-16">
                {size.toUpperCase()}:
              </span>
              {roles.map(role => (
                <RoleBadge 
                  key={role} 
                  role={role} 
                  size={size}
                  variant="default"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Sin iconos */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Sin Iconos</h3>
        <div className="flex items-center gap-3">
          {roles.map(role => (
            <RoleBadge 
              key={role} 
              role={role} 
              showIcon={false}
              variant="default"
            />
          ))}
        </div>
      </div>
    </div>
  );
};



