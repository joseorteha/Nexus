import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { TipoUsuario } from "./permissions";

/**
 * HOC (Higher Order Component) para proteger páginas fácilmente
 * 
 * Uso:
 * export default withAuth(MiembrosPage, { requiredRole: "cooperativa" });
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredRole?: TipoUsuario | TipoUsuario[];
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute requiredRole={options?.requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Shortcuts para roles comunes
 */
export const withNormal = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { requiredRole: "normal" });

export const withCooperativa = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { requiredRole: "cooperativa" });

export const withEmpresa = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { requiredRole: "empresa" });

export const withAdmin = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { requiredRole: "admin" });



