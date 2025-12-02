import { Building2, Handshake, Truck, Shield } from "lucide-react";

// Definición de colores para los íconos
const IconStyles = [
  { Icon: Building2, color: "text-blue-500", bg: "bg-blue-50" }, // Empresas
  { Icon: Handshake, color: "text-green-500", bg: "bg-green-50" }, // Cooperativas
  { Icon: Truck, color: "text-orange-500", bg: "bg-orange-50" }, // Transportistas
  { Icon: Shield, color: "text-red-500", bg: "bg-red-50" }, // Gobierno y Polos
];

// Componente para manejar el estilo del ícono
const IconBox = ({ Icon, color, bg }) => (
    <div className={`p-4 rounded-xl ${bg} inline-flex justify-center items-center mb-4`}>
        <Icon className={`w-10 h-10 ${color}`} />
    </div>
);


export default function WhoIsFor() {
    const data = [
        {
            title: "Empresas Comerciales",
            desc: "Optimiza ventas, automatiza compras y digitaliza la operación diaria.",
            Icon: IconStyles[0].Icon,
            color: IconStyles[0].color,
            bg: IconStyles[0].bg,
        },
        {
            title: "Cooperativas y Asociaciones",
            desc: "Conecta con nuevos mercados, negocia mejores condiciones y aumenta tu visibilidad colectiva.",
            Icon: IconStyles[1].Icon,
            color: IconStyles[1].color,
            bg: IconStyles[1].bg,
        },
        {
            title: "Operadores Logísticos y Transportistas",
            desc: "Gestiona eficientemente cargas, optimiza rutas y asegura entregas en tiempo real mediante geolocalización.",
            Icon: IconStyles[2].Icon,
            color: IconStyles[2].color,
            bg: IconStyles[2].bg,
        },
        {
            title: "Gobierno y Polos de Desarrollo",
            desc: "Accede a datos territoriales y económicos consolidados para la planificación estratégica y apoyo al crecimiento regional.",
            Icon: IconStyles[3].Icon,
            color: IconStyles[3].color,
            bg: IconStyles[3].bg,
        }
    ];

    return (
        <section className="py-24 md:py-32 bg-gray-50"> {/* Fondo gris muy sutil */}
            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-gray-800 mb-6 tracking-tight">
                    ¿Quién Impulsa su Crecimiento con Nexus?
                </h2>
                <p className="text-xl text-center text-gray-500 mb-16 max-w-3xl mx-auto">
                    Nuestra plataforma está diseñada para satisfacer las necesidades específicas de los principales actores del ecosistema regional.
                </p>

                <div className="grid lg:grid-cols-4 gap-8 md:gap-10">
                    {data.map((d, i) => (
                        <div
                            key={i}
                            className={`
                                p-8 rounded-3xl bg-white shadow-xl ring-1 ring-black/5
                                text-center transition duration-300 hover:shadow-2xl hover:scale-[1.02] 
                                border-t-4 ${d.color} // Borde superior para distinción
                                opacity-0 animate-fadeUp
                            `}
                            style={{ animationDelay: `${i * 0.12}s` }}
                        >
                            {/* Icono mejorado */}
                            <IconBox Icon={d.Icon} color={d.color} bg={d.bg} /> 
                            
                            <h3 className="text-xl font-bold text-gray-900">
                                {d.title}
                            </h3>
                            <p className="mt-3 text-gray-600 leading-normal">{d.desc}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}