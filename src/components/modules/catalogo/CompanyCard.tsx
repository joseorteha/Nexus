"use client";

import React from "react";
import Image from "next/image";

interface Company {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  logo?: string;
  imageUrl?: string;
  website?: string;
  phone?: string;
  email?: string;
}

interface CompanyCardProps {
  company: Company;
  onViewDetails: (id: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group">
      {/* Imagen de portada */}
      <div className="h-40 bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center overflow-hidden">
        {company.imageUrl ? (
          <img
            src={company.imageUrl}
            alt={company.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-white text-center">
            <p className="text-3xl font-bold">🏢</p>
          </div>
        )}
      </div>

      {/* Información de la empresa */}
      <div className="p-4">
        {/* Logo y nombre */}
        <div className="flex items-start gap-3 mb-3">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
              {company.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
              {company.name}
            </h3>
            <p className="text-xs text-indigo-600 font-medium">{company.category}</p>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {company.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400">★</span>
          <span className="text-sm font-semibold text-gray-700">
            {company.rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">(Calificación)</span>
        </div>

        {/* Contacto */}
        {(company.phone || company.email) && (
          <div className="bg-gray-50 rounded p-2 mb-3 text-xs">
            {company.phone && (
              <p className="text-gray-600">
                <span className="font-semibold">Tel:</span> {company.phone}
              </p>
            )}
            {company.email && (
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span> {company.email}
              </p>
            )}
          </div>
        )}

        {/* Botón Ver Detalles */}
        <button
          onClick={() => onViewDetails(company.id)}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default CompanyCard;
