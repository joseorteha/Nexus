"use client";

import { useEffect, useState } from "react";
import { Home, ShoppingCart, Heart, User, BarChart3, Package, Users, Store, Map, Settings, TrendingUp } from "lucide-react";
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

      setTipoUsuario(userData?.tipo_usuario || "normal");
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
