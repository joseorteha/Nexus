"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { TipoUsuario, canAccess } from "@/lib/permissions";

/**
 * Hook para obtener el tipo de usuario actual
 * 
 * Uso:
 * const { userType, loading, canAccessRoute } = useUserType();
 */
export function useUserType() {
  const [userType, setUserType] = useState<TipoUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from("usuarios")
        .select("tipo_usuario")
        .eq("id", user.id)
        .single();

      setUserType(data?.tipo_usuario as TipoUsuario);
    } catch (error) {
      console.error("Error loading user type:", error);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Verifica si el usuario puede acceder a una ruta específica
   */
  function canAccessRoute(route: string): boolean {
    if (!userType) return false;
    return canAccess(userType, route);
  }

  /**
   * Helpers para verificar roles específicos
   */
  const isNormal = userType === "normal";
  const isCooperativa = userType === "cooperativa";
  const isEmpresa = userType === "empresa";
  const isAdmin = userType === "admin";

  return {
    userType,
    userId,
    loading,
    canAccessRoute,
    isNormal,
    isCooperativa,
    isEmpresa,
    isAdmin,
  };
}
