"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";
import { canAccess, TipoUsuario } from "@/lib/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: TipoUsuario | TipoUsuario[];
}

/**
 * Componente que protege rutas según el tipo de usuario
 * 
 * Uso:
 * <ProtectedRoute requiredRole="cooperativa">
 *   <MiembrosPage />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<TipoUsuario | null>(null);

  useEffect(() => {
    checkAccess();
  }, [pathname]);

  async function checkAccess() {
    try {
      // 1. Verificar sesión
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // 2. Obtener tipo de usuario
      const { data: userData } = await supabase
        .from("usuarios")
        .select("tipo_usuario")
        .eq("id", user.id)
        .single();

      const tipo = userData?.tipo_usuario as TipoUsuario;
      setUserType(tipo);

      // 3. Verificar si requiere rol específico
      if (requiredRole) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        
        if (!allowedRoles.includes(tipo)) {
          console.warn(`Acceso denegado: Usuario ${tipo} intentó acceder a ruta que requiere ${requiredRole}`);
          router.push("/dashboard");
          return;
        }
      }

      // 4. Verificar si tiene permiso para la ruta actual
      if (!canAccess(tipo, pathname)) {
        console.warn(`Acceso denegado: Usuario ${tipo} no tiene permiso para ${pathname}`);
        router.push("/dashboard");
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error("Error verificando acceso:", error);
      router.push("/auth/login");
    }
  }

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Access denied
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-2">🚫 Acceso Denegado</h2>
          <p className="text-gray-700 mb-4">
            No tienes permisos para acceder a esta página.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Authorized
  return <>{children}</>;
}



