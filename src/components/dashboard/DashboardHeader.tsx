"use client";

import { motion } from "framer-motion";
import { Sparkles, Award } from "lucide-react";
import { TipoUsuario } from "@/lib/permissions";

interface DashboardHeaderProps {
  userName: string;
  tipoUsuario: TipoUsuario;
  cooperativa?: string | null;
  rolCooperativa?: string | null;
}

export function DashboardHeader({ userName, tipoUsuario, cooperativa, rolCooperativa }: DashboardHeaderProps) {
  const getSubtitle = () => {
    switch (tipoUsuario) {
      case "empresa":
        return "Encuentra proveedores y gestiona tus compras eficientemente";
      case "cooperativa":
        return "Administra tu cooperativa y conecta con compradores";
      case "admin":
        return "Panel de administración del ecosistema Nexus";
      case "normal":
      default:
        return "Gestiona tus productos y encuentra oportunidades de negocio";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-cyan-100 text-sm font-medium">Bienvenido de vuelta</p>
              <h1 className="text-3xl md:text-4xl font-bold">{userName}</h1>
            </div>
          </div>
          
          {tipoUsuario === "normal" && cooperativa ? (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">
                {cooperativa} · {rolCooperativa}
              </span>
            </div>
          ) : (
            <p className="text-cyan-50 text-lg">
              {getSubtitle()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
