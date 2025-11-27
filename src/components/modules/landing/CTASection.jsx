export default function CTASection() {
  return (
    <section
      className="
        relative
        py-24 md:py-32 
        bg-blue-600 
        text-white 
        text-center 
        overflow-hidden
      "
    >
      {/* Fondo con degradado dinámico */}
      <div
        className="
          absolute inset-0 
          bg-gradient-to-br from-blue-700 to-blue-500 
          opacity-90
        "
      ></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">

        <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">
          Da el Salto: Conecta tu Negocio al Futuro
        </h2>

        <p className="mb-12 text-xl opacity-90 font-light max-w-3xl mx-auto">
          Aprovecha tu 
          <strong className="font-semibold text-white"> cuenta gratuita </strong> 
          hoy mismo y únete a la red que está redefiniendo la forma de 
          <strong className="font-semibold text-white"> comprar, vender y gestionar </strong> 
          dentro de tu región.
        </p>

        <a
          href="/auth/login"
          className="inline-block bg-white text-blue-600 font-extrabold px-12 py-5 rounded-xl text-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition duration-300 transform hover:scale-[1.05]hover:bg-gray-100 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
        >
          ¡Crea tu Cuenta Gratuita Ahora!
        </a>

        <p className="mt-4 text-sm opacity-70">
          Empieza en minutos. No se requiere tarjeta de crédito.
        </p>

      </div>
    </section>
  );
}
