"use client";

import React from "react";

interface CatalogFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  minRating: number;
  onMinRatingChange: (value: number) => void;
}

const CatalogFilter: React.FC<CatalogFilterProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  minRating,
  onMinRatingChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Filtros</h2>

      {/* Búsqueda */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar Empresa
        </label>
        <input
          type="text"
          placeholder="Nombre de la empresa..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Categoría */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoría
        </label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Calificación mínima */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calificación Mínima: {minRating.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={minRating}
          onChange={(e) => onMinRatingChange(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>5</span>
        </div>
      </div>

      {/* Información de filtros activos */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p>Filtros activos: {search ? 1 : 0} + {category ? 1 : 0}</p>
      </div>
    </div>
  );
};

export default CatalogFilter;

/* editado para subir */