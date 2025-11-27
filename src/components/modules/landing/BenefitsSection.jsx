// Componente placeholder para los iconos de los actores
const RoleIcon = ({ children, colorClass }) => (
    <div className={`text-5xl ${colorClass} bg-opacity-10 p-4 rounded-xl mb-4 inline-block`}>
        {children}
    </div>
);

// Iconos Placeholders (reemplaza con tus iconos reales)
const BusinessIcon = () => <RoleIcon colorClass="text-blue-600 bg-blue-600">🏢</RoleIcon>; // Edificio
const CooperativeIcon = () => <RoleIcon colorClass="text-green-600 bg-green-600">🔗</RoleIcon>; // Red/Cadena
const GovernmentIcon = () => <RoleIcon colorClass="text-red-600 bg-red-600">🛡️</RoleIcon>; // Escudo/Gobierno


export default function BenefitsSection() {
    const benefitsData = [
        {
            title: "Empresas",
            icon: BusinessIcon,
            color: "border-blue-500",
            benefits: [
                "Optimización de Costos Operativos y Logísticos.",
                "Gestión Digital Unificada de Ventas, Compras y Flujo de Trabajo.",
                "Acceso directo y validado a una red de Proveedores Confiables."
            ]
        },
        {
            title: "Cooperativas",
            icon: CooperativeIcon,
            color: "border-green-500",
            benefits: [
                "Aumento de Visibilidad y Transparencia en la cadena de valor.",
                "Facilidad para establecer Precios Justos y negociación colectiva.",
                "Expansión rápida y segura a Nuevos Mercados Regionales."
            ]
        },
        {
            title: "Gobierno y Polos",
            icon: GovernmentIcon,
            color: "border-red-500",
            benefits: [
                "Visibilidad Territorial en tiempo real para planificación urbana y económica.",
                "Obtención de Datos Fidedignos para la toma de Decisiones Estratégicas.",
                "Herramientas Analíticas potentes para impulsar el Desarrollo Económico local."
            ]
        }
    ];

    return (
        <section className="py-24 md:py-32 bg-gray-50"> {/* Mantenemos el fondo sutil */}
            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-gray-800 mb-6 tracking-tight">
                    Valor Estratégico para Cada Actor
                </h2>

                <p className="text-xl text-center text-gray-500 mb-16 max-w-3xl mx-auto">
                    Nexus está diseñado para generar una
                    <strong className="font-semibold text-gray-700"> sinergia de triple impacto </strong>,
                    beneficiando a todo el ecosistema del Polo.
                </p>

                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                    {benefitsData.map((actor, i) => (
                        <div
                            key={i}
                            className={`
                                bg-white p-8 rounded-3xl shadow-xl 
                                transition duration-300 hover:shadow-2xl hover:-translate-y-1 
                                border-t-8 ${actor.color} // Borde superior para distinción de color
                            `}
                        >
                            {/* Renderiza el Icono */}
                            <actor.icon />

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {actor.title}
                            </h3>

                            <ul className="mt-4 text-gray-700 space-y-3">
                                {actor.benefits.map((benefit, j) => (
                                    <li key={j} className="flex items-start">
                                        <span className="text-green-500 font-bold mr-2 mt-1">✔</span>
                                        <span className="leading-normal">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}