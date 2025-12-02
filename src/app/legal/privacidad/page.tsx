"use client";
import React from "react";

// Ícono Nexus (estilo Soft-Glow)
const LockIcon = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-xl shadow-inner shadow-green-300/40 mr-3">
    <svg
      className="w-4 h-4 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  </div>
);

export default function PrivacidadPage() {
  const lastUpdated = "27 de Noviembre de 2025";
  const contactEmail = "privacidad@nexus.com";
  const responsableName = "Nexus Soluciones Empresariales S.A. de C.V.";
  const responsableAddress =
    "Av. Paseo de la Reforma #100, Col. Juárez, Ciudad de México, C.P. 06600";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-20 px-6 flex justify-center">
      <div className="max-w-5xl w-full bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-200/60 rounded-3xl p-10 md:p-16">
        
        {/* ENCABEZADO */}
        <header className="text-center mb-10 pb-10 border-b border-gray-200">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-sm">
            Aviso de Privacidad
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Su información está protegida. Seguridad y confianza en cada dato.
          </p>

          <p className="text-sm text-blue-600 font-semibold mt-3">
            Última actualización: {lastUpdated}
          </p>
        </header>

        {/* INTRO */}
        <section className="text-lg text-gray-700 leading-relaxed mb-14">
          <p>
            <strong className="text-gray-900">{responsableName}</strong> 
            {" "} (en adelante, “Nexus”), con domicilio en{" "}
            <strong className="text-gray-900">{responsableAddress}</strong>, 
            es el responsable del tratamiento de sus datos personales conforme a la LFPDPPP.
          </p>
        </section>

        {/* SECCIÓN 1 */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-blue-700 mb-6">
            1. Datos Personales Recopilados
          </h2>

          <p className="text-gray-700 mb-4">
            Los datos que recopilamos son indispensables para operar los servicios del ecosistema Nexus:
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
            1.1. Identificación y Contacto
          </h3>
          <ul className="ml-6 list-disc text-gray-700 space-y-1">
            <li>Nombre, correo electrónico, teléfono.</li>
            <li>Contraseña cifrada (no accesible para Nexus).</li>
            <li>Datos empresariales (Razón social, RFC, domicilio).</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-10 mb-3">
            1.2. Datos Operacionales (Marketplace, ERP y Geolocalización)
          </h3>
          <ul className="ml-6 list-disc text-gray-700 space-y-1">
            <li><strong>Geolocalización:</strong> Solo con permiso del usuario.</li>
            <li><strong>Datos financieros operativos:</strong> Inventarios, ventas y costos.</li>
            <li><strong>Datos de interacción:</strong> Uso del sistema y conexiones empresariales.</li>
          </ul>
        </section>

        {/* SECCIÓN 2 */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-blue-700 mb-6">
            2. Finalidades del Tratamiento
          </h2>

          <h3 className="text-2xl font-semibold mt-6 mb-3">2.1. Finalidades Primarias</h3>
          <p className="text-gray-700 mb-2">Necesarias para operar los servicios Nexus:</p>

          <ul className="space-y-3">
            <li className="flex items-start"><LockIcon /> Operación del Marketplace.</li>
            <li className="flex items-start"><LockIcon /> Funciones ERP: inventario, ventas y facturación.</li>
            <li className="flex items-start"><LockIcon /> Análisis y rutas por geolocalización.</li>
            <li className="flex items-start"><LockIcon /> Verificación y autenticación de empresas.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-10 mb-3">2.2. Finalidades Secundarias</h3>
          <ul className="ml-6 list-disc text-gray-700 space-y-1">
            <li>Envío de publicidad o promociones.</li>
            <li>Encuestas de calidad del servicio.</li>
          </ul>

          <p className="mt-2 text-sm text-gray-600">
            Puede solicitar la suspensión de estas finalidades escribiendo a:{" "}
            <strong className="text-blue-600">{contactEmail}</strong>
          </p>
        </section>

        {/* SECCIÓN 3 */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-blue-700 mb-6">
            3. Derechos ARCO y Revocación
          </h2>

          <p className="text-gray-700 mb-4">
            Usted puede ejercer sus derechos ARCO: Acceso, Rectificación, Cancelación y Oposición.
          </p>

          <h3 className="text-xl font-semibold mb-2">Procedimiento:</h3>
          <ol className="ml-6 list-decimal text-gray-700 space-y-2">
            <li>Enviar un correo a <strong>{contactEmail}</strong>.</li>
            <li>Adjuntar identificación oficial.</li>
            <li>Describir el derecho que desea ejercer.</li>
            <li>Tiempo de respuesta máximo: 20 días hábiles.</li>
          </ol>
        </section>

        {/* CONTACTO */}
        <footer className="pt-10 border-t text-center border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Contacto</h3>
          <p className="text-gray-700">Departamento de Privacidad</p>
          <p className="text-blue-600 text-xl font-bold mt-2">{contactEmail}</p>
        </footer>
      </div>
    </div>
  );
}



