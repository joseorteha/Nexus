// Importa tus iconos de Redes Sociales (ej. FontAwesome, Lucide o SVGs)
const SocialIcon = ({ children }: { children: React.ReactNode }) => (
    <a href="#" className="text-white hover:text-blue-400 transition">
        {children}
    </a>
);

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-10">

            {/* 1. BRANDING Y MISIÓN */}
            <div className="md:col-span-2">
                <div className="flex items-center mb-3">
                    <img src="/NEXUS_LOGOTIPO.png" alt="Nexus Logo" className="h-44"/>
                </div>
                
                <p className="mt-2 text-sm text-gray-400 max-w-sm leading-relaxed">
                    Impulsamos el crecimiento económico conectando empresas y fortaleciendo cadenas productivas en los PODECOBI.
                </p>

            </div>

            {/* 2. EXPLORAR / PRODUCTOS */}
            <div>
                <h4 className="font-bold mb-4 text-lg">Plataforma</h4>
                <ul className="space-y-3 text-gray-300 text-base">
                    <li><a href="/marketplace" className="hover:text-blue-400 transition">Marketplace Inteligente</a></li>
                    <li><a href="/match" className="hover:text-blue-400 transition">Match Empresarial</a></li>
                    <li><a href="/erp" className="hover:text-blue-400 transition">ERP Ligero</a></li>
                    <li><a href="/geolocalizacion" className="hover:text-blue-400 transition">Geolocalización</a></li>
                </ul>
            </div>

            {/* 3. LEGAL Y AYUDA */}
            <div>
                <h4 className="font-bold mb-4 text-lg">Legal y Ayuda</h4>
                <ul className="space-y-3 text-gray-300 text-base">
                    <li><a href="/legal/terminos" className="hover:text-blue-400 transition">Términos de Servicio</a></li>
                    <li><a href="/legal/privacidad" className="hover:text-blue-400 transition">Política de Privacidad</a></li>
                    <li><a href="/ayuda/faq" className="hover:text-blue-400 transition">Preguntas Frecuentes</a></li>
                    <li><a href="/ayuda/contacto" className="hover:text-blue-400 transition">Contacto y Soporte</a></li>
                </ul>
            </div>

            {/* 4. INFORMACIÓN DE CONTACTO */}
            <div>
                <h4 className="font-bold mb-4 text-lg">Contáctanos</h4>
                <ul className="space-y-3 text-gray-300 text-base">
                    <li className="flex items-center space-x-2">
                         <span>📧</span> 
                         <a href="mailto:info@nexus.com" className="hover:text-blue-400 transition">
                           info@nexus.com
                         </a>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span>📞</span> 
                        <a href="tel:+521234567890" className="hover:text-blue-400 transition">
                          +52 1 234 567 890
                        </a>
                    </li>
                </ul>
            </div>

        </div>

        {/* Derechos de Autor */}
        <div className="mt-12 pt-6 border-t border-gray-700 max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Nexus. Todos los derechos reservados.
            </p>
        </div>
    </footer>
  );
}
