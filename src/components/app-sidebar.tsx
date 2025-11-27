"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  ShoppingCart, 
  Heart, 
  User, 
  BarChart3, 
  Package, 
  Users, 
  Store, 
  Map, 
  Settings, 
  TrendingUp, 
  FileText,
  ChevronUp,
  ChevronRight,
  LogOut,
  UserCircle,
  BadgeCheck,
  Building2,
  List
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/app/lib/supabase/client";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [tipoUsuario, setTipoUsuario] = useState<string>("normal");
  const [perteneceCooperativa, setPerteneceCooperativa] = useState(false);
  const [cooperativaNombre, setCooperativaNombre] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  
  useEffect(() => {
    loadUserType();
  }, []);

  async function loadUserType() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserEmail(user.email || "");

      const { data: userData } = await supabase
        .from("usuarios")
        .select("tipo_usuario, nombre, apellidos")
        .eq("id", user.id)
        .single();

      console.log("🔧 Sidebar - Tipo de usuario:", userData?.tipo_usuario);
      setTipoUsuario(userData?.tipo_usuario || "normal");

      // Setear nombre del usuario
      if (userData?.tipo_usuario === "empresa") {
        const { data: empresaData } = await supabase
          .from("empresas")
          .select("razon_social")
          .eq("user_id", user.id)
          .single();
        setUserName(empresaData?.razon_social || "Empresa");
      } else if (userData?.tipo_usuario === "cooperativa") {
        const { data: coopData } = await supabase
          .from("cooperativas")
          .select("nombre")
          .eq("creada_por", user.id)
          .single();
        setUserName(coopData?.nombre || "Cooperativa");
      } else {
        setUserName(`${userData?.nombre || ""} ${userData?.apellidos || ""}`.trim() || "Usuario");
      }

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

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  function getRoleBadgeText() {
    switch (tipoUsuario) {
      case "admin": return "Administrador";
      case "cooperativa": return "Cooperativa";
      case "empresa": return "Empresa";
      case "normal": return perteneceCooperativa ? "Productor" : "Productor Individual";
      default: return "Usuario";
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
    <Sidebar collapsible="icon">
      {/* Header con logo mejorado */}
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold text-sidebar-foreground">Nexus</span>
            <span className="text-xs text-sidebar-foreground/60">B2B Platform</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Menú Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url || 
                  (item.url !== "/dashboard" && pathname.startsWith(item.url));
                
                // Si es Marketplace, renderizar con submenú
                if (item.title === "Marketplace" || item.title === "Buscar Productos" || item.title === "Oportunidades") {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={pathname.includes("/marketplace")}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={pathname.includes("/marketplace")}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton 
                                asChild
                                isActive={pathname === "/dashboard/marketplace"}
                              >
                                <a href="/dashboard/marketplace">
                                  <List className="h-4 w-4" />
                                  <span>Productos</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton 
                                asChild
                                isActive={pathname === "/dashboard/marketplace/catalogo"}
                              >
                                <a href="/dashboard/marketplace/catalogo">
                                  <Building2 className="h-4 w-4" />
                                  <span>Catálogo de Empresas</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }
                
                // Resto de items normales
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname.includes("/mi-cooperativa")}
                    >
                      <a href="/dashboard/mi-cooperativa">
                        <Store className="h-4 w-4" />
                        <span>Mi Cooperativa</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <>
                    {menuCooperativas.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild
                          isActive={pathname === item.url}
                        >
                          <a href={item.url}>
                            <item.icon className="h-4 w-4" />
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

      {/* Footer con menú de usuario */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                    <UserCircle className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userName}</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {userEmail}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                      <UserCircle className="h-4 w-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userName}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {userEmail}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">{getRoleBadgeText()}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/dashboard/profile" className="gap-2 cursor-pointer">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Mi Perfil
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/dashboard/profile/settings" className="gap-2 cursor-pointer">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Configuración
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

