
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Heart, 
  Store, 
  ArrowRight, 
  Award,
  Sparkles,
  Target,
  Zap
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    productos: 0,
    ventas: 0,
    cooperativa: null as string | null,
    rolCooperativa: null as string | null
  });

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("usuarios")
        .select("tipo_usuario, nombre, apellidos")
        .eq("id", user.id)
        .single();

      setTipoUsuario(userData?.tipo_usuario || "normal");
      setUserName(`${userData?.nombre || ""} ${userData?.apellidos || ""}`.trim() || "Usuario");

      if (userData?.tipo_usuario === "normal") {
        await loadStats(user.id);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats(userId: string) {
    try {
      const { count: productosCount } = await supabase
        .from("productos")
        .select("*", { count: 'exact', head: true })
        .eq("propietario_id", userId)
        .eq("tipo_propietario", "individual");

      const { data: cooperativaData } = await supabase
        .from("cooperativa_miembros")
        .select(`
          rol,
          cooperativas (
            nombre
          )
        `)
        .eq("user_id", userId)
        .single();

      setStats({
        productos: productosCount || 0,
        ventas: 0,
        cooperativa: (cooperativaData?.cooperativas as any)?.nombre || null,
        rolCooperativa: cooperativaData?.rol || null
      });
    } catch (error) {
      console.log("No se pudieron cargar las estadísticas", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <Sparkles className="w-6 h-6 text-cyan-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
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
              
              {stats.cooperativa ? (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
                  <Award className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {stats.cooperativa} · {stats.rolCooperativa}
                  </span>
                </div>
              ) : (
                <p className="text-cyan-50 text-lg">
                  Gestiona tus productos y encuentra oportunidades de negocio
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {tipoUsuario === "normal" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <StatsCard
              icon={<Package className="w-6 h-6" />}
              label="Mis Productos"
              value={stats.productos}
              color="cyan"
              trend="+12%"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Ventas"
              value={`$${stats.ventas.toLocaleString()}`}
              color="blue"
              trend="+8%"
            />
            <StatsCard
              icon={<ShoppingBag className="w-6 h-6" />}
              label="En Marketplace"
              value={stats.productos}
              color="purple"
            />
            <StatsCard
              icon={<Users className="w-6 h-6" />}
              label="Cooperativa"
              value={stats.cooperativa || "Sin cooperativa"}
              color="green"
              isText
            />
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-600" />
            Acciones Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard
              icon={<Package />}
              title="Mis Productos"
              description="Gestiona tu inventario personal"
              href="/dashboard/productos"
              gradient="from-cyan-500 to-blue-500"
            />
            <ActionCard
              icon={<ShoppingBag />}
              title="Marketplace"
              description="Explora productos disponibles"
              href="/dashboard/marketplace"
              gradient="from-blue-500 to-purple-500"
            />
            <ActionCard
              icon={<Heart />}
              title="Match"
              description="Encuentra cooperativas"
              href="/dashboard/match"
              gradient="from-purple-500 to-pink-500"
            />
          </div>
        </motion.div>

        {/* Cooperativa Section */}
        {tipoUsuario === "normal" && !stats.cooperativa && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border border-cyan-100 shadow-xl"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Store className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Potencia tu negocio en equipo
                </h3>
                <p className="text-gray-600 mb-6">
                  Las cooperativas te permiten acceder a mejores precios, compartir recursos y aumentar tu volumen de venta
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  <BenefitItem text="Mejores precios" />
                  <BenefitItem text="Recursos compartidos" />
                  <BenefitItem text="Mayor volumen" />
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/dashboard/cooperativas/crear"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Store className="w-5 h-5" />
                    Crear Cooperativa
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/dashboard/match"
                    className="inline-flex items-center gap-2 bg-white text-cyan-600 px-6 py-3 rounded-xl font-semibold border-2 border-cyan-200 hover:border-cyan-300 transition-all hover:scale-105"
                  >
                    <Users className="w-5 h-5" />
                    Unirse a Cooperativa
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cooperativa Success */}
        {stats.cooperativa && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  ¡Eres parte de {stats.cooperativa}! 🎉
                </h3>
                <p className="text-gray-600">
                  Como {stats.rolCooperativa}, tienes acceso a herramientas avanzadas
                </p>
              </div>
            </div>
            
            <Link
              href="/dashboard/mi-cooperativa"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              <Store className="w-5 h-5" />
              Ir a Mi Cooperativa
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Components
type ColorType = "cyan" | "blue" | "purple" | "green";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: ColorType;
  trend?: string;
  isText?: boolean;
}

function StatsCard({ icon, label, value, color, trend, isText = false }: StatsCardProps) {
  const colors: Record<ColorType, string> = {
    cyan: "from-cyan-500 to-cyan-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-xl flex items-center justify-center text-white mb-4 shadow-md`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className={`${isText ? 'text-lg' : 'text-3xl'} font-bold text-gray-900`}>
          {value}
        </p>
        {trend && (
          <span className="text-sm text-green-600 font-semibold">{trend}</span>
        )}
      </div>
    </div>
  );
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  gradient: string;
}

function ActionCard({ icon, title, description, href, gradient }: ActionCardProps) {
  return (
    <Link href={href}>
      <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center text-cyan-600 font-semibold text-sm group-hover:gap-2 transition-all">
          Ver más
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
}
