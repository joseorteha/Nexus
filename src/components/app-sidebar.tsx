"use client";

import { useEffect, useState } from "react";
import { Home, ShoppingCart, Heart, User, BarChart3, Package, Users, Store, Map, Settings, TrendingUp, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { supabase } from "@/app/lib/supabase/client";

export function AppSidebar() {
  const [tipoUsuario, setTipoUsuario] = useState<string>("normal");
  const [perteneceCooperativa, setPerteneceCooperativa] = useState(false);
  const [cooperativaNombre, setCooperativaNombre] = useState<string>("");
  
  useEffect(() => {
    loadUserType();
  }, []);

  async function loadUserType() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("usuarios")
        .select("tipo_usuario")
        .eq("id", user.id)
        .single();

      console.log("🔧 Sidebar - Tipo de usuario:", userData?.tipo_usuario);
      setTipoUsuario(userData?.tipo_usuario || "normal");

      // Si es usuario normal, verificar si pertenece a una cooperativa
      if (userData?.tipo_usuario === "normal") {
        const { data: miembro } = await supabase
          .from("cooperativa_miembros")
          .select(`
            rol,
            cooperativas (
              nombre
            )
          `)
          .eq("user_id", user.id)
          .single();

        if (miembro) {
          setPerteneceCooperativa(true);
          setCooperativaNombre((miembro.cooperativas as any)?.nombre || "");
        }
      }
    } catch (error) {
      console.error("Error cargando tipo de usuario:", error);
    }
  }

  // Menú para Usuario Normal
  const menuUsuarioNormal = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Mis Productos",
      url: "/dashboard/productos",
      icon: Package,
    },
    {
      title: "Mis Ventas",
      url: "/dashboard/ventas",
      icon: TrendingUp,
    },
    {
      title: "Marketplace",
      url: "/dashboard/marketplace",
      icon: ShoppingCart,
    },
    {
      title: "Match",
      url: "/dashboard/match",
      icon: Heart,
    },
    {
      title: "Perfil",
      url: "/dashboard/profile",
      icon: User,
    },
  ];

  const menuCooperativas = [
    {
      title: "Crear Cooperativa",
      url: "/dashboard/cooperativas/crear",
      icon: Store,
    },
    {
      title: "Unirse a Cooperativa",
      url: "/dashboard/cooperativas/unirse",
      icon: Users,
    },
  ];

  // Menú para Cooperativa
  const menuCooperativa = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Productos",
      url: "/dashboard/productos",
      icon: Package,
    },
    {
      title: "Oportunidades",
      url: "/dashboard/marketplace",
      icon: ShoppingCart,
    },
    {
      title: "Mi Cooperativa",
      url: "/dashboard/cooperativa",
      icon: Users,
    },
    {
      title: "ERP",
      url: "/dashboard/erp",
      icon: BarChart3,
    },
    {
      title: "Perfil",
      url: "/dashboard/profile",
      icon: User,
    },
  ];

  // Menú para Empresa
  const menuEmpresa = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Mis Compras",
      url: "/dashboard/compras",
      icon: ShoppingCart,
    },
    {
      title: "Mis Pedidos",
      url: "/dashboard/pedidos",
      icon: Package,
    },
    {
      title: "Buscar Productos",
      url: "/dashboard/marketplace",
      icon: Store,
    },
    {
      title: "Proveedores",
      url: "/dashboard/proveedores",
      icon: Users,
    },
    {
      title: "Contratos",
      url: "/dashboard/contratos",
      icon: FileText,
    },
    {
      title: "Reportes",
      url: "/dashboard/reportes",
      icon: BarChart3,
    },
    {
      title: "Perfil",
      url: "/dashboard/profile",
      icon: User,
    },
  ];

  // Menú para Admin
  const menuAdmin = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Usuarios",
      url: "/dashboard/usuarios",
      icon: Users,
    },
    {
      title: "Solicitudes",
      url: "/dashboard/solicitudes-cooperativas",
      icon: Store,
    },
    {
      title: "Polos Económicos",
      url: "/dashboard/polos-economicos",
      icon: Map,
    },
    {
      title: "Estadísticas",
      url: "/dashboard/estadisticas",
      icon: TrendingUp,
    },
    {
      title: "Configuración",
      url: "/dashboard/configuracion",
      icon: Settings,
    },
    {
      title: "Perfil",
      url: "/dashboard/profile",
      icon: User,
    },
  ];

  // Seleccionar menú según tipo de usuario
  const menuItems = 
    tipoUsuario === "admin" ? menuAdmin :
    tipoUsuario === "cooperativa" ? menuCooperativa :
    tipoUsuario === "empresa" ? menuEmpresa :
    menuUsuarioNormal;

  console.log("🔧 Sidebar - Menú seleccionado para tipo:", tipoUsuario);
  console.log("🔧 Sidebar - Items del menú:", menuItems.map(i => i.title));

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h2 className="text-xl font-bold text-sidebar-foreground">Nexus</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sección de Cooperativas solo para Usuario Normal */}
        {tipoUsuario === "normal" && (
          <SidebarGroup>
            <SidebarGroupLabel>Cooperativas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {perteneceCooperativa ? (
                  // Si ya pertenece a una cooperativa
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard/mi-cooperativa">
                        <Store />
                        <span>Mi Cooperativa</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  // Si no pertenece, mostrar opciones de crear/unirse
                  <>
                    {menuCooperativas.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/50 text-center">
          Nexus B2B Platform
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

