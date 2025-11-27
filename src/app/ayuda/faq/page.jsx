
import React from 'react';


export default function FAQPage() {

  const faqs = [
    {
      q: "¿Qué es Nexus y cuál es su principal ventaja?",
      a: "Nexus es una plataforma digital de ecosistema empresarial. Integra Marketplace, ERP ligero, geolocalización, red social de negocios y análisis de datos en una sola herramienta. Su ventaja principal es la eliminación de silos de información entre las áreas de su empresa."
    },
    {
      q: "¿Cómo funciona la geolocalización empresarial?",
      a: "Utiliza datos de ubicación (con consentimiento explícito) para optimizar rutas logísticas, identificar proveedores o clientes cercanos, y generar análisis de mercado basados en densidad geográfica."
    },
    {
      q: "¿Tiene costo el servicio o hay planes de suscripción?",
      a: "Nexus ofrece un plan 'Basic' gratuito con funciones esenciales para startups y pequeñas empresas. También contamos con planes 'Pro' y 'Enterprise' (Premium) que desbloquean funciones avanzadas de ERP, análisis de datos profundos y soporte prioritario."
    },
    {
      q: "¿Cómo se garantiza la seguridad de mis datos financieros en el ERP?",
      a: "Implementamos cifrado de extremo a extremo (AES-256) para la transmisión y almacenamiento de datos sensibles. Además, utilizamos autenticación multifactor (MFA) obligatoria y cumplimos con las normativas de protección de datos (como la LFPDPPP en México)."
    },
    {
      q: "¿Puedo registrar varias unidades de negocio o sucursales bajo una misma cuenta?",
      a: "Sí. Los planes Premium de Nexus están diseñados para gestionar múltiples unidades, sucursales o empresas filiales desde un único panel de control, facilitando la consolidación de reportes y la gestión centralizada de inventarios."
    },
    {
      q: "¿Requiere alguna instalación de software local?",
      a: "No. Nexus es una plataforma 100% basada en la nube (SaaS). Puede acceder a todos los servicios desde cualquier navegador web moderno o a través de nuestra aplicación móvil, sin necesidad de instalaciones complejas o mantenimiento de servidores."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8 lg:p-12">
        
        {/* Encabezado */}
        <div className="text-center pb-8 border-b border-indigo-100 mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
            Preguntas Frecuentes (FAQ)
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            Respuestas rápidas a las dudas más comunes sobre la plataforma Nexus.
          </p>
        </div>

        {/* Lista de FAQs como Acordeón (simulado) */}
        <div className="space-y-6">
          {faqs.map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300">
              
              {/* Pregunta */}
              <div className="flex justify-between items-center cursor-pointer group">
                <h3 className="text-xl font-semibold text-gray-800 pr-4">
                  {item.q}
                </h3>
                
              </div>

              {/* Respuesta (siempre visible para simplificar, pero estilizada) */}
              <div className="mt-4 pt-4 border-t border-indigo-50 border-dashed">
                <p className="text-gray-600 leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Llamada a la acción si no encuentran su respuesta */}
        <div className="mt-12 p-6 bg-indigo-50 rounded-xl text-center border-2 border-indigo-200 border-dashed">
            <h3 className="text-2xl font-bold text-indigo-800 mb-2">¿Aún tienes dudas?</h3>
            <p className="text-indigo-600 mb-4">
                Si no encontraste tu respuesta, nuestro equipo de soporte está listo para ayudarte.
            </p>
            <a 
              href="#" 
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
            >
                Contactar a Soporte
            </a>
        </div>

      </div>
    </div>
  );
}
