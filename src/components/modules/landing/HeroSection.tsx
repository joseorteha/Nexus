"use client";

import { useEffect, useState } from "react";

// Colores de referencia para mayor coherencia
const PRIMARY_COLOR = "text-blue-600";
const ACCENT_COLOR = "bg-blue-600";

export default function HeroSection() {
    const [fade, setFade] = useState(1);
    const [gray, setGray] = useState(0);
    const [whiteLayer, setWhiteLayer] = useState(0);
    const [contentColor, setContentColor] = useState("text-white");

    useEffect(() => {
        const onScroll = () => {
            const maxHeight = window.innerHeight * 1.0;
            const y = window.scrollY;

            // 1. Efecto Fade-out del Contenido y Traslación
            let f = 1 - y / (maxHeight * 0.8);
            if (f < 0) f = 0;
            if (f > 1) f = 1;

            // 2. Efecto Grayscale/Brightness en la Imagen de Fondo
            let g = y / (maxHeight * 0.7);
            if (g < 0) g = 0;
            if (g > 1) g = 1;

            // 3. Capa Blanca de Transición (Opacidad)
            let w = y / (maxHeight * 0.9);
            if (w < 0) w = 0;
            if (w > 1) w = 1;

            setFade(f);
            setGray(g);
            setWhiteLayer(w);

            // Cambiar color del texto cuando la capa blanca supera el 50%
            if (w > 0.5) {
                setContentColor("text-gray-800");
            } else {
                setContentColor("text-white");
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden">

            {/* 1. FONDO IMAGEN CON EFECTOS DE SCROLL (GRAYSCALE / BRIGHTNESS) */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: "url('/paisaje.jpg')",
                    filter: `grayscale(${gray}) brightness(${1 - gray * 0.5})`,
                    transition: "filter 0.3s ease-out", // Aumentamos la transición
                    transform: `scale(${1 + gray * 0.05})`, // Agregamos un ligero zoom
                }}
            />

            {/* 2. CAPA BLANCA DE TRANSICIÓN PARA EL TEXTO */}
            <div
                className="absolute inset-0 z-10"
                style={{
                    background: `rgba(255,255,255,${whiteLayer})`,
                    transition: "background 0.3s ease-out", // Aumentamos la transición
                }}
            />

            {/* 3. CAPA DE GRADIENTE OSCURO INICIAL PARA CONTRASTE DEL TEXTO */}
            <div className="absolute inset-0 bg-black/30 z-[5]"></div>

            {/* 4. CONTENIDO PRINCIPAL */}
            <div
                className="relative z-30 h-full flex flex-col justify-center px-8 max-w-7xl mx-auto"
                style={{
                    opacity: fade,
                    transform: `translateY(${(1 - fade) * 40}px)`, // Ligero movimiento hacia arriba
                    transition: "all 0.3s ease-out",
                }}
            >
                <h1
                    className={`text-6xl md:text-7xl font-extrabold drop-shadow-lg leading-tight ${contentColor} transition-colors duration-300`}
                >
                    Conectamos la <strong>Economía Real</strong>
                    <br />
                    con Oportunidades Digitales.
                </h1>

                <p
                    className={`drop-shadow mt-4 max-w-2xl text-xl font-light ${contentColor} transition-colors duration-300`}
                >
                    Nexus es la plataforma que integra coincidencias, marketplace, ERP y geolocalización para
                    <strong> digitalizar e impulsar </strong>
                    la productividad de tu Polo de Desarrollo.
                </p>

                <div className="flex gap-4 mt-8">
                    <a
                        href="/auth/login"
                        className={`
                            ${ACCENT_COLOR} text-white font-bold 
                            px-8 py-3 rounded-lg text-lg shadow-xl 
                            hover:scale-105 transition transform 
                            hover:bg-blue-700
                        `}
                    >
                        Comenzar Ahora
                    </a>
                    <a
                        href="/demo"
                        className={`
                            border border-white/80 ${contentColor} 
                            px-8 py-3 rounded-lg text-lg 
                            hover:bg-white/20 hover:scale-105 transition transform
                        `}
                    >
                        Ver Demo
                    </a>
                </div>
            </div>
        </section>
    );
}