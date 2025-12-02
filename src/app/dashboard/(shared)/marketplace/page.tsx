"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { MarketplaceEmpresas } from "@/components/marketplace/MarketplaceEmpresas";
import { MarketplaceCooperativas } from "@/components/marketplace/MarketplaceCooperativas";
import type { TipoUsuario } from "@/lib/permissions";

export default function MarketplacePage() {
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTipoUsuario();
  }, []);

  async function cargarTipoUsuario() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("usuarios")
        .select("tipo_usuario")
        .eq("id", user.id)
        .single();

      console.log("🛒 Marketplace - Tipo de usuario:", userData?.tipo_usuario);
      setTipoUsuario((userData?.tipo_usuario as TipoUsuario) || "normal");
    } catch (error) {
      console.error("Error cargando tipo de usuario:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (tipoUsuario === "empresa") {
    return <MarketplaceEmpresas />;
  }

  if (tipoUsuario === "cooperativa") {
    return <MarketplaceCooperativas />;
  }

  return <MarketplaceEmpresas />;
}



