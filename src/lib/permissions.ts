// 🔐 Sistema de permisos por tipo de usuario

export type TipoUsuario = "normal" | "cooperativa" | "empresa" | "admin";

// Definir qué rutas puede acceder cada tipo de usuario
// NOTA: Los Route Groups (normal), (shared), etc. son invisibles en las URLs
export const PERMISSIONS = {
  // Rutas compartidas (TODOS pueden acceder)
  shared: [
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/marketplace", // (shared)/marketplace - vista diferente según tipo
  ],

  // Solo Usuario Normal
  normal: [
    "/dashboard/productos",           // (normal)/productos
    "/dashboard/cooperativas",        // (normal)/cooperativas
    "/dashboard/cooperativas/crear",  // (normal)/cooperativas/crear
    "/dashboard/ventas",              // (normal)/ventas
    "/dashboard/match",               // (shared)/match - solo para encontrar cooperativas
  ],

  // Solo Cooperativa
  cooperativa: [
    "/dashboard/miembros",
    "/dashboard/solicitudes",
    "/dashboard/productos-cooperativa",
    "/dashboard/finanzas",
    "/dashboard/erp",
  ],

  // Solo Empresa
  empresa: [
    "/dashboard/compras",
    "/dashboard/proveedores",
    "/dashboard/contratos",
    "/dashboard/reportes",
    "/dashboard/erp",
  ],

  // Solo Admin
  admin: [
    "/dashboard/usuarios",
    "/dashboard/solicitudes-cooperativas",
    "/dashboard/cooperativas-admin",
    "/dashboard/empresas-admin",
    "/dashboard/configuracion",
    "/dashboard/estadisticas",
    "/dashboard/polos-economicos",
  ],
};

/**
 * Verifica si un usuario tiene permiso para acceder a una ruta
 */
export function canAccess(userType: TipoUsuario, route: string): boolean {
  // Admin tiene acceso a todo
  if (userType === "admin") return true;

  // Verificar rutas compartidas
  if (PERMISSIONS.shared.some(path => route.startsWith(path))) {
    return true;
  }

  // Verificar rutas específicas del tipo de usuario
  const allowedRoutes = PERMISSIONS[userType] || [];
  return allowedRoutes.some(path => route.startsWith(path));
}

/**
 * Obtiene todas las rutas permitidas para un tipo de usuario
 */
export function getAllowedRoutes(userType: TipoUsuario): string[] {
  if (userType === "admin") {
    // Admin tiene acceso a todo
    return [
      ...PERMISSIONS.shared,
      ...PERMISSIONS.normal,
      ...PERMISSIONS.cooperativa,
      ...PERMISSIONS.empresa,
      ...PERMISSIONS.admin,
    ];
  }

  return [...PERMISSIONS.shared, ...(PERMISSIONS[userType] || [])];
}

/**
 * Obtiene la ruta de redirección por defecto según tipo de usuario
 */
export function getDefaultRoute(userType: TipoUsuario): string {
  switch (userType) {
    case "normal":
      return "/dashboard";
    case "cooperativa":
      return "/dashboard/erp";
    case "empresa":
      return "/dashboard/compras";
    case "admin":
      return "/dashboard/usuarios";
    default:
      return "/dashboard";
  }
}
