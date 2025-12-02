"use client";

export default function SolutionSection() {
    const solutions = [
        { title: "Marketplace inteligente", icon: "🛒" },
        { title: "Mini ERP automatizado", icon: "📊" },
        { title: "Logística integrada", icon: "🚚" },
        { title: "Geolocalización avanzada", icon: "📍" },
        { title: "Red social empresarial", icon: "🔗" },
        { title: "Alertas y predicción", icon: "🔮" }
    ];

    return (
        <section className="py-28 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">

            {/* ⭐ LÍNEAS decorativas de fondo */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 text-center relative">

                {/* TITULO */}
                <h2 className="text-5xl font-bold text-primary-dark mb-6 opacity-0 animate-fadeUp">
                    Una solución integral en una sola plataforma
                </h2>

                <p className="text-lg text-gray-700 max-w-3xl mx-auto opacity-0 animate-fadeUp delay-150">
                    Nexus combina marketplace, ERP, logística, geolocalización avanzada y herramientas
                    sociales para impulsar la digitalización y el crecimiento económico.
                </p>

                {/* CARDS */}
                <div className="grid md:grid-cols-3 gap-8 mt-16">

                    {solutions.map((item, i) => (
                        <div
                            key={i}
                            className="group p-10 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-[0_0_40px_rgba(0,150,255,0.20)] hover:-translate-y-3 hover:border-primary/50 transition-all duration-300 opacity-0 animate-fadeUp"
                            style={{ animationDelay: `${0.2 + i * 0.12}s` }}
                        >
                            {/* ICONO */}
                            <div
                                className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110"
                            >
                                {item.icon}
                            </div>

                            <h3 className="text-xl font-semibold text-primary-dark">
                                {item.title}
                            </h3>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}




