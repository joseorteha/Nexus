import { ReactNode } from "react";

interface ProblemIconProps {
  children: ReactNode;
}

const ProblemIcon = ({ children }: ProblemIconProps) => (
  <div className="text-4xl text-blue-500 bg-blue-50 p-3 rounded-xl mb-4 inline-block shadow-inner">
    {children}
  </div>
);

// Iconos placeholders (reemplaza con tus iconos reales)
const IntegrationIcon = () => <ProblemIcon>🔗</ProblemIcon>; // Ejemplo: Link/Chain Icon
const VisibilityIcon = () => <ProblemIcon>👁️</ProblemIcon>;   // Ejemplo: Eye/Search Icon
const ManualIcon = () => <ProblemIcon>📝</ProblemIcon>;     // Ejemplo: File/Document Icon

export default function ProblemSection() {
  const problems = [
    {
      title: "Fragmentación Operativa",
      desc: "Las empresas operan en silos, impidiendo la colaboración eficiente, el flujo de información y la sinergia comercial dentro del Polo.",
      icon: IntegrationIcon,
    },
    {
      title: "Alcance de Mercado Limitado",
      desc: "Los productos y servicios no tienen la visibilidad digital ni el alcance geolocalizado necesario para conectar con la demanda real y expandir sus ventas.",
      icon: VisibilityIcon,
    },
    {
      title: "Ineficiencia de Procesos",
      desc: "La gestión se basa en procesos manuales y documentación obsoleta, resultando en lentitud, errores y falta de datos clave para la toma de decisiones estratégicas.",
      icon: ManualIcon,
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-gray-50/50"> {/* Fondo más sutil */}
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-gray-800 mb-6 tracking-tight">
          El Desafío Actual en los Polos de Desarrollo
        </h2>
        <p className="text-xl text-center text-gray-500 mb-16 max-w-3xl mx-auto">
          Identificamos las barreras que impiden la conectividad y el crecimiento económico de la región.
        </p>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {problems.map((item, i) => (
            <div
              key={i}
              className="
                p-8 rounded-3xl bg-white shadow-xl ring-1 ring-black/5
                transition duration-300 hover:shadow-2xl hover:border-blue-400
                border-2 border-transparent transform hover:-translate-y-1
                // Clases de animación si las mantienes:
                opacity-0 animate-fadeUp
              "
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Renderiza el Icono */}
              <item.icon /> 
              
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {item.title}
              </h3>
              <p className="mt-3 text-gray-600 leading-normal">{item.desc}</p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}



