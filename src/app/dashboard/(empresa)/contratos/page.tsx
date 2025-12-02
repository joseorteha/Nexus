"use client";

import { FileText, Calendar, DollarSign } from "lucide-react";

export default function ContratosPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-8 h-8 text-green-600" />
          Contratos
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona tus acuerdos comerciales
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No tienes contratos activos
        </h3>
        <p className="text-gray-600">
          Los contratos con tus proveedores aparecerán aquí
        </p>
      </div>
    </div>
  );
}



