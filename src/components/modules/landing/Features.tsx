"use client";

import { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles (importarlos aquí o en globals.css)
import "swiper/css";
import "swiper/css/pagination";

const FeatureIcon = ({ children }: { children: ReactNode }) => (
  <div className="text-4xl bg-blue-100 text-blue-600 p-3 rounded-2xl mb-4 inline-block shadow-md">
    {children}
  </div>
);

// Iconos placeholders
const Icons = {
  Marketplace: () => <FeatureIcon>🛒</FeatureIcon>,
  Match: () => <FeatureIcon>🤝</FeatureIcon>,
  ERP: () => <FeatureIcon>📊</FeatureIcon>,
  Geo: () => <FeatureIcon>📍</FeatureIcon>,
  Social: () => <FeatureIcon>👥</FeatureIcon>,
  Alerts: () => <FeatureIcon>🔔</FeatureIcon>,
};

export default function SolutionSection() {
  const features = [
    {
      title: "Marketplace Inteligente",
      desc: "Maximiza la visibilidad de tus productos y servicios dentro del Polo, utilizando filtros avanzados para conexiones de negocio más precisas.",
      icon: Icons.Marketplace,
    },
    {
      title: "Match Empresarial Automático",
      desc: "Identifica instantáneamente a socios comerciales, proveedores y oportunidades de financiamiento a través de un motor de coincidencia basado en datos.",
      icon: Icons.Match,
    },
    {
      title: "ERP de Gestión Simplificada",
      desc: "Controla tu inventario, registra ventas y administra actividades clave con un sistema de planificación ligero y accesible.",
      icon: Icons.ERP,
    },
    {
      title: "Geolocalización Estratégica",
      desc: "Visualiza la red empresarial completa del Polo en un mapa dinámico para optimizar rutas, identificar oportunidades y expandir tu área de influencia.",
      icon: Icons.Geo,
    },
    {
      title: "Red de Conexión Empresarial",
      desc: "Fomenta interacción, alianzas y flujo constante de información entre todas las empresas del ecosistema.",
      icon: Icons.Social,
    },
    {
      title: "Alertas Predictivas (IA)",
      desc: "Recibe notificaciones automáticas sobre demanda, escasez y tendencias del mercado cruciales para tu operación.",
      icon: Icons.Alerts,
    },
  ];

  return (
    <section
      id="solution"
      className="py-24 md:py-32 bg-white relative"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Título */}
        <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-gray-800 mb-6 tracking-tight opacity-0 animate-fadeUp">
          La Solución Integral que Conecta tu Potencial
        </h2>

        <p className="text-xl text-center text-gray-500 mb-16 max-w-4xl mx-auto opacity-0 animate-fadeUp delay-150">
          Nexus transforma la fragmentación en <span className="font-semibold text-blue-600">sinergia</span>
          y los procesos manuales en <span className="font-semibold text-blue-600">eficiencia inteligente</span>.
        </p>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          spaceBetween={32}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1.1, centeredSlides: true },
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
          }}
          className="w-full max-w-7xl mx-auto pb-12"
        >
          {features.map((f, i) => (
            <SwiperSlide key={i} className="!h-auto">
              <div
                className="h-full p-8 rounded-3xl bg-white shadow-xl ring-1 ring-black/5 transition duration-300 hover:shadow-2xl hover:border-blue-500 border-2 border-transparent cursor-pointer flex flex-col"
              >
                <f.icon />

                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  {f.title}
                </h3>
                <p className="mt-3 text-gray-600 flex-grow">
                  {f.desc}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Video demo */}
        <div className="flex justify-center mt-12">
          <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl ring-4 ring-blue-500/30">
            <video
              src="/videos/nexus_demo.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover aspect-video"
            />
          </div>
        </div>

      </div>
    </section>
  );
}



