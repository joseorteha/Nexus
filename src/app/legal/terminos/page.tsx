import React from 'react';

// Componente de Ícono de Check para listas importantes
const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-indigo-500 flex-shrink-0 mr-3"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

// Componente principal de la página de Términos y Condiciones
export default function TerminosPage() {
  const lastUpdated = "27 de Noviembre de 2025";
  const contactEmail = "legal@nexus.com";
  const jurisdiction = "Ciudad de México, México";

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-8 lg:p-12">
        
        {/* Encabezado */}
        <div className="pb-8 border-b border-indigo-100">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
            Términos de Servicio y Políticas de Privacidad
          </h1>
          <p className="text-sm text-indigo-500 font-medium uppercase tracking-wider">
            **Nexus** - El ecosistema empresarial integrado
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            Última actualización: {lastUpdated}
          </p>
        </div>

        {/* Introducción */}
        <div className="mt-8">
          <p className="mb-6 text-lg text-gray-700 leading-relaxed">
            Bienvenido a <strong>Nexus</strong>. Al registrarse, acceder o utilizar nuestra plataforma, usted celebra un acuerdo legal vinculante con nosotros y acepta estar sujeto a estos Términos de Servicio ("Términos") y nuestra Política de Privacidad. Si no está de acuerdo con estos términos, no utilice la Plataforma.
          </p>
        </div>

        {/* SECCIÓN 1: TÉRMINOS DE SERVICIO */}
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b pb-2 border-indigo-200">
            Términos de Servicio (TDS)
          </h2>
          
          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">1. Descripción y Componentes de Nexus</h3>
          <p className="text-gray-700 mb-4">
            Nexus es una plataforma unificada que ofrece las siguientes funcionalidades (los "Servicios"):
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start text-gray-700"><CheckIcon /> Marketplace: Compra y venta de bienes y servicios.</li>
            <li className="flex items-start text-gray-700"><CheckIcon /> ERP Ligero: Gestión de inventario, finanzas básicas y procesos internos.</li>
            <li className="flex items-start text-gray-700"><CheckIcon /> Geolocalización: Ubicación de empresas, rutas logísticas y análisis de mercado por zona.</li>
            <li className="flex items-start text-gray-700"><CheckIcon /> Red Social de Negocios: Conexión, colaboración y generación de alianzas estratégicas.</li>
            <li className="flex items-start text-gray-700"><CheckIcon /> Análisis de Datos: Paneles de rendimiento y métricas empresariales.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">2. Uso de la Cuenta y Responsabilidad</h3>
          <p className="text-gray-700 mb-4">
            Usted es responsable de mantener la confidencialidad de su información de acceso y de todas las actividades que ocurran bajo su cuenta. Usted acepta notificarnos inmediatamente cualquier uso no autorizado.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">3. Contenido del Usuario y Licencia</h3>
          <p className="text-gray-700 mb-4">
            Al subir o publicar contenido (listados de productos, perfiles de empresa, mensajes) en Nexus, usted nos otorga una licencia mundial, no exclusiva, libre de regalías, sublicenciable y transferible para usar, reproducir, distribuir, preparar trabajos derivados y exhibir dicho contenido en relación con la operación de la Plataforma.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">4. Prohibiciones</h3>
          <p className="text-gray-700 mb-2">
            Usted acepta NO realizar ninguna de las siguientes acciones:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
            <li>Publicar contenido ilegal, difamatorio, fraudulento, o que viole derechos de propiedad intelectual de terceros.</li>
            <li>Utilizar datos de geolocalización o de perfil para acosar, abusar o enviar spam a otros usuarios.</li>
            <li>Realizar ingeniería inversa, descompilar o intentar acceder al código fuente de Nexus.</li>
            <li>Interferir con la infraestructura del sistema (ataques DoS, virus, etc.).</li>
          </ul>
        </div>

        {/* SECCIÓN 2: POLÍTICA DE PRIVACIDAD */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b pb-2 border-indigo-200">
            Política de Privacidad
          </h2>
          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">1. Datos Recopilados</h3>
          <p className="text-gray-700 mb-2">
            Recopilamos los siguientes tipos de información:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
            <li>**Información de Registro:** Nombre de la empresa, RFC, dirección fiscal, nombre del contacto, correo electrónico, contraseña.</li>
            <li>**Datos Operacionales (ERP/Marketplace):** Historial de transacciones, inventario, datos financieros introducidos por el usuario.</li>
            <li>**Datos de Geolocalización:** Ubicación en tiempo real del usuario o de los activos empresariales (si el servicio está habilitado).</li>
            <li>**Datos de Uso:** Interacciones en la red social, métricas de rendimiento y uso de la plataforma.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">2. Uso de la Información</h3>
          <p className="text-gray-700 mb-4">
            La información recopilada se utiliza exclusivamente para:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
            <li>**Proveer los Servicios:** Operar el Marketplace, calcular rutas logísticas y ejecutar las funciones del ERP.</li>
            <li>**Seguridad y Verificación:** Validar la identidad de los usuarios y prevenir fraudes.</li>
            <li>**Análisis y Mejora:** Generar análisis de datos y métricas para mejorar la experiencia del usuario y los servicios de la plataforma.</li>
            <li>**Comunicación:** Enviar avisos de servicio, actualizaciones y, si se acepta, material promocional.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">3. Compartición de Datos</h3>
          <p className="text-gray-700 mb-4">
            Compartimos datos solo en las siguientes circunstancias:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
            <li>**Con otros Usuarios:** Información de perfil y Marketplace (nombre de la empresa, ubicación pública) necesaria para facilitar las transacciones y la conexión en la red social.</li>
            <li>**Cumplimiento Legal:** Cuando sea requerido por ley, orden judicial o autoridad gubernamental.</li>
            <li>**Proveedores de Servicios:** Con terceros que nos ayudan a operar la plataforma (alojamiento, análisis), sujetos a acuerdos de confidencialidad.</li>
          </ul>
        </div>

        {/* SECCIÓN 3: DISPOSICIONES FINALES */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b pb-2 border-indigo-200">
            Disposiciones Generales
          </h2>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">1. Modificaciones de los Términos</h3>
          <p className="text-gray-700 mb-4">
            Nos reservamos el derecho de modificar estos Términos y Políticas en cualquier momento. Si realizamos cambios sustanciales, se lo notificaremos a través de la plataforma o por correo electrónico. El uso continuado de Nexus después de dichas modificaciones constituye su aceptación de los nuevos términos.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">2. Terminación</h3>
          <p className="text-gray-700 mb-4">
            Podemos suspender o terminar su acceso a la plataforma de inmediato, sin previo aviso, si usted incumple gravemente estos Términos. Usted puede terminar su cuenta en cualquier momento a través de la configuración de la misma.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">3. Ley Aplicable y Jurisdicción</h3>
          <p className="text-gray-700 mb-4">
            Estos Términos se regirán e interpretarán de acuerdo con las leyes de **{jurisdiction}**. Las partes acuerdan someter cualquier disputa o reclamo a la jurisdicción exclusiva de los tribunales de **{jurisdiction}**, renunciando a cualquier otro fuero que pudiera corresponderles.
          </p>
        </div>

        {/* Footer / Contacto */}
        <div className="mt-12 pt-8 border-t border-indigo-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Contacto</h3>
          <p className="text-gray-700">
            Para preguntas sobre estos Términos o las Políticas de Privacidad, por favor, contáctenos en:
          </p>
          <p className="text-indigo-600 font-bold mt-1 text-lg">
            {contactEmail}
          </p>
        </div>

      </div>
    </div>
  );
}



