"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import logo from "../../../assets/logo.webp";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <a href="/" className="flex items-center space-x-2">
            <Image
              src={logo}
              alt="Nexus Logo"
              className="h-10 w-auto object-contain drop-shadow-lg"
            />
          </a>

          {/* MENÚ DESKTOP */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className={`font-medium transition-colors hover:text-blue-600 ${
                scrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Características
            </a>
            <a 
              href="/auth/login" 
              className={`font-medium transition-colors hover:text-blue-600 ${
                scrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Iniciar sesión
            </a>
            <a 
              href="/auth/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Registrarse
            </a>
          </div>

          {/* BOTÓN MOBILE MENU */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
            }`}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* MENÚ MOBILE */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-fadeIn">
            <a 
              href="#features" 
              className={`block font-medium py-2 px-4 rounded-lg transition-colors ${
                scrolled 
                  ? "text-gray-700 hover:bg-gray-100" 
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Características
            </a>
            <a 
              href="/auth/login" 
              className={`block font-medium py-2 px-4 rounded-lg transition-colors ${
                scrolled 
                  ? "text-gray-700 hover:bg-gray-100" 
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Iniciar sesión
            </a>
            <a 
              href="/auth/register" 
              className="block bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-2.5 rounded-lg font-semibold transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Registrarse
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
