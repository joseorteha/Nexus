import React from 'react';
import ChatSoporte from "../../../components/modules/landing/ChatSoporte";



// Iconos funcionales para el componente de contacto
const MailIcon = (props) => (
  <svg {...props} className="w-6 h-6 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
  </svg>
);

const PhoneIcon = (props) => (
  <svg {...props} className="w-6 h-6 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
  </svg>
);

const ClockIcon = (props) => (
  <svg {...props} className="w-6 h-6 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const LocationIcon = (props) => (
  <svg {...props} className="w-6 h-6 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);

// Componente principal de la página de Contacto
export default function ContactoPage() {
  const contactEmail = "soporte@nexus.com";
  const contactPhone = "+52 55 1234 5678"; // Actualizado a un formato más común en CDMX
  const businessAddress = "Av. Paseo de la Reforma #100, Col. Juárez, C.P. 06600, Ciudad de México, México.";

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8 lg:p-12">

        {/* Encabezado */}
        <div className="text-center pb-8 border-b border-indigo-100 mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
            Contacto y Soporte
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            Estamos aquí para ayudarte a sacar el máximo provecho de la plataforma Nexus.
          </p>
        </div>

        <div className="text-center mb-10 p-6 bg-indigo-50 rounded-xl">
          <h2 className="text-2xl font-bold text-indigo-800 mb-2">¿Necesitas ayuda inmediata?</h2>
          <p className="text-indigo-600 mb-4">
            Nuestro asistente inteligente responde en tiempo real.
          </p>

          <ChatSoporte />
        </div>


        {/* Detalles de Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Columna 1: Contacto Directo */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-100">
              Información de Contacto
            </h3>

            {/* Email */}
            <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition">
              <MailIcon />
              <div>
                <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                <a href={`mailto:${contactEmail}`} className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
                  {contactEmail}
                </a>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition">
              <PhoneIcon />
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono (Llamadas y WhatsApp)</p>
                <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
                  {contactPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Columna 2: Horarios y Ubicación */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-100">
              Horario y Oficina
            </h3>

            {/* Horario */}
            <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition">
              <ClockIcon />
              <div>
                <p className="text-sm font-medium text-gray-500">Horario de Atención</p>
                <p className="text-lg font-semibold text-gray-900">
                  Lunes a Viernes, 9:00 a 18:00 hrs (GMT-6)
                </p>
              </div>
            </div>

            {/* Dirección */}
            <div className="flex items-start p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition">
              <LocationIcon className="mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Oficina Principal</p>
                <address className="text-lg font-semibold text-gray-900 not-italic">
                  {businessAddress}
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Tiempo de Respuesta */}
        <div className="mt-10 p-6 bg-gray-100 rounded-xl text-center">
          <p className="text-lg font-medium text-gray-700">
            Garantía de Respuesta:
            <strong className="text-indigo-600 ml-2">Menos de 24 horas hábiles</strong>.
          </p>
        </div>

      </div>
    </div>
  );
}