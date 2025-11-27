"use client";

import React from "react";

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
  address?: string;
}

interface CompanyModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ company, isOpen, onClose }) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{company.name}</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Imagen de portada */}
          {company.imageUrl && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img
                src={company.imageUrl}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Información básica */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 font-semibold mb-1">CATEGORÍA</p>
              <p className="text-lg font-bold text-gray-900">{company.category}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 font-semibold mb-1">CALIFICACIÓN</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl text-yellow-400">★</span>
                <p className="text-lg font-bold text-gray-900">
                  {company.rating.toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-600 leading-relaxed">{company.description}</p>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Información de Contacto</h3>
            <div className="space-y-3">
              {company.address && (
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">DIRECCIÓN</p>
                    <p className="text-gray-700">{company.address}</p>
                  </div>
                </div>
              )}
              {company.phone && (
                <div className="flex items-start gap-3">
                  <span className="text-xl">📱</span>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">TELÉFONO</p>
                    <a
                      href={`tel:${company.phone}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {company.phone}
                    </a>
                  </div>
                </div>
              )}
              {company.email && (
                <div className="flex items-start gap-3">
                  <span className="text-xl">📧</span>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">EMAIL</p>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {company.email}
                    </a>
                  </div>
                </div>
              )}
              {company.website && (
                <div className="flex items-start gap-3">
                  <span className="text-xl">🌐</span>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">SITIO WEB</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-400"
            >
              Cerrar
            </button>
            {company.email && (
              <a
                href={`mailto:${company.email}`}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 text-center"
              >
                Contactar
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;

/* editado para subir */