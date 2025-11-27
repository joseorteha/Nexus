"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../assets/logo.webp";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Navbar
      className={`
        top-0 left-0 z-50 px-6 transition-all duration-500 
        ${scrolled
          ? "fixed bg-primary-light/80 backdrop-blur-md shadow-md"
          : "absolute bg-transparent shadow-none backdrop-blur-none"
        }
      `}
      maxWidth="xl"
      isBordered={false}
    >
      {/* LOGO */}
      <NavbarBrand>
        <Image
          src={logo}
          alt="Nexus Logo"
          className="h-10 w-auto object-contain drop-shadow-lg"
        />
      </NavbarBrand>

      {/* MENÚ CENTRADO */}
      <NavbarContent
        className="hidden md:flex gap-8 text-neutral-900 font-semibold mx-auto"
        justify="center"
      >
        <NavbarItem>
          <a href="#features" className="hover:text-primary transition-colors">
            Características
          </a>
        </NavbarItem>
        <NavbarItem>
          <a href="/login" className="hover:text-primary transition-colors">
            Iniciar sesión
          </a>
        </NavbarItem>
        <NavbarItem>
          <a href="/register" className="hover:text-primary transition-colors">
            Registrarse
          </a>
        </NavbarItem>
      </NavbarContent>

      {/* BOTÓN MOBILE */}
      <NavbarContent className="md:hidden" justify="end">
        <NavbarItem>
          <a
            href="/register"
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
          >
            Crear cuenta
          </a>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
