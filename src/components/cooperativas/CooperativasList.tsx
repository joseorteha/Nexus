"use client";

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Search, 
  Filter,
  Users,
  MapPin,
  Package,
  Award,
  X
} from 'lucide-react';
import { Cooperative } from '@/types/nexus';
import { CooperativaCard } from './CooperativaCard';

interface CooperativasListProps {
  cooperativas: Cooperative[];
  onVerDetalles?: (id: string) => void;
  onSolicitarUnirse?: (id: string) => void;
  showFilters?: boolean;
  compact?: boolean;
}

const CATEGORIAS = [
  'Café',
  'Artesanías',
  'Textiles',
  'Miel',
  'Orgánicos',
  'Alimentos Procesados',
  'Bebidas',
  'Cosméticos Naturales',
  'Otros'
];

const REGIONES = [
  'Zongolica',
  'Orizaba',
  'Córdoba',
  'Fortín',
  'PODECOBI',
  'Otra región'
];

const CERTIFICACIONES = [
  'Orgánico Certificado',
  'Comercio Justo',
  'Denominación de Origen',
  'Certificación de Calidad',
  'Certificación Ambiental'
];

export const CooperativasList: React.FC<CooperativasListProps> = ({
  cooperativas,
  onVerDetalles,
  onSolicitarUnirse,
  showFilters = true,
  compact = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Filtrar cooperativas
  const filteredCooperativas = useMemo(() => {
    return cooperativas.filter(coop => {
      // Solo mostrar activas
      if (coop.status !== 'active') return false;

      // Búsqueda por texto
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          coop.name.toLowerCase().includes(searchLower) ||
          coop.description.toLowerCase().includes(searchLower) ||
          coop.region.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtro por categorías
      if (selectedCategories.length > 0) {
        const hasCategory = selectedCategories.some(cat => 
          coop.category.includes(cat)
        );
        if (!hasCategory) return false;
      }

      // Filtro por regiones
      if (selectedRegions.length > 0) {
        if (!selectedRegions.includes(coop.region)) return false;
      }

      // Filtro por certificaciones
      if (selectedCertifications.length > 0) {
        const hasCertification = selectedCertifications.some(cert =>
          coop.certifications?.includes(cert)
        );
        if (!hasCertification) return false;
      }

      return true;
    });
  }, [cooperativas, searchTerm, selectedCategories, selectedRegions, selectedCertifications]);

  const toggleFilter = (type: 'category' | 'region' | 'certification', value: string) => {
    switch(type) {
      case 'category':
        setSelectedCategories(prev => 
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        break;
      case 'region':
        setSelectedRegions(prev =>
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        break;
      case 'certification':
        setSelectedCertifications(prev =>
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedRegions([]);
    setSelectedCertifications([]);
    setSearchTerm('');
  };

  const activeFiltersCount = 
    selectedCategories.length + 
    selectedRegions.length + 
    selectedCertifications.length;

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cooperativas por nombre, descripción o región..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Botón de filtros */}
          {showFilters && (
            <Button
              variant="default"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="relative"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="info" 
                  className="ml-2 bg-purple-600 text-white h-5 w-5 p-0 flex items-center justify-center rounded-full"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {/* Panel de filtros expandible */}
        {showFilters && showFilterPanel && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Filtro por Categorías */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Categorías
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map(cat => (
                  <Badge
                    key={cat}
                    variant="default"
                    className={`cursor-pointer transition-colors ${
                      selectedCategories.includes(cat)
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'hover:bg-purple-50'
                    }`}
                    onClick={() => toggleFilter('category', cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Filtro por Regiones */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Regiones
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {REGIONES.map(region => (
                  <Badge
                    key={region}
                    variant="default"
                    className={`cursor-pointer transition-colors ${
                      selectedRegions.includes(region)
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'hover:bg-blue-50'
                    }`}
                    onClick={() => toggleFilter('region', region)}
                  >
                    {region}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Filtro por Certificaciones */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certificaciones
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {CERTIFICACIONES.map(cert => (
                  <Badge
                    key={cert}
                    variant="default"
                    className={`cursor-pointer transition-colors ${
                      selectedCertifications.includes(cert)
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'hover:bg-green-50'
                    }`}
                    onClick={() => toggleFilter('certification', cert)}
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Limpiar filtros */}
            {activeFiltersCount > 0 && (
              <div className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar todos los filtros
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Resultados */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            {filteredCooperativas.length} Cooperativa{filteredCooperativas.length !== 1 ? 's' : ''} Disponible{filteredCooperativas.length !== 1 ? 's' : ''}
          </h3>
        </div>

        {filteredCooperativas.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No se encontraron cooperativas</h3>
            <p className="text-muted-foreground mb-4">
              {activeFiltersCount > 0 
                ? 'Intenta ajustar los filtros para ver más resultados'
                : 'No hay cooperativas activas disponibles en este momento'
              }
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
            )}
          </Card>
        ) : (
          <div className={compact ? "space-y-3" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
            {filteredCooperativas.map(coop => (
              <CooperativaCard
                key={coop.id}
                cooperativa={coop}
                onVerDetalles={onVerDetalles}
                onSolicitarUnirse={onSolicitarUnirse}
                compact={compact}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

