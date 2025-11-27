"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Building2, Mail, Phone, MapPin, Search, FileText, TrendingUp } from "lucide-react";

interface Empresa {
  id: string;
  user_id: string;
  razon_social: string;
  rfc: string;
  sector: string;
  telefono: string;
  direccion: string;
  created_at: string;
  email?: string;
  onboarding?: {
    productos_necesitados?: string[];
    categorias?: string[];
    volumen_compra?: string;
    frecuencia_compra?: string;
    presupuesto?: string;
    region?: string;
  };
}

export function MarketplaceCooperativas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [sectorFiltro, setSectorFiltro] = useState("todos");

  useEffect(() => {
    cargarEmpresas();
  }, []);

  async function cargarEmpresas() {
    try {
      // Cargar empresas con sus datos de onboarding
      const { data: empresasData, error: empresasError } = await supabase
        .from("empresas")
        .select("*");

      if (empresasError) throw empresasError;

      // Cargar datos adicionales de cada empresa
      const empresasCompletas = await Promise.all(
        (empresasData || []).map(async (empresa) => {
          // Email del usuario
          const { data: userData } = await supabase
            .from("usuarios")
            .select("*")
            .eq("id", empresa.user_id)
            .single();

          const { data: { user } } = await supabase.auth.admin.getUserById(empresa.user_id);

          // Datos de onboarding
          const { data: onboardingData } = await supabase
            .from("onboarding_empresa")
            .select("*")
            .eq("user_id", empresa.user_id)
            .single();

          return {
            ...empresa,
            email: user?.email || userData?.email || "No disponible",
            onboarding: onboardingData || {},
          };
        })
      );

      setEmpresas(empresasCompletas);
    } catch (error) {
      console.error("Error cargando empresas:", error);
    } finally {
      setLoading(false);
    }
  }

  const empresasFiltradas = empresas.filter((e) => {
    const matchBusqueda =
      e.razon_social.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.sector?.toLowerCase().includes(busqueda.toLowerCase());

    const matchSector =
      sectorFiltro === "todos" || e.sector === sectorFiltro;

    return matchBusqueda && matchSector;
  });

  const sectores = Array.from(new Set(empresas.map((e) => e.sector).filter(Boolean)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <Building2 className="w-8 h-8 text-green-600" />
          Oportunidades de Negocio
        </h1>
        <p className="text-gray-600">
          Empresas buscando productos y proveedores
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Empresas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{empresas.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sectores</p>
              <p className="text-2xl font-bold text-gray-900">{sectores.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Oportunidades</p>
              <p className="text-2xl font-bold text-gray-900">
                {empresasFiltradas.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar empresas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filtro Sector */}
          <select
            value={sectorFiltro}
            onChange={(e) => setSectorFiltro(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="todos">Todos los sectores</option>
            {sectores.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Empresas */}
      {empresasFiltradas.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hay empresas disponibles
          </h3>
          <p className="text-gray-600">
            Intenta cambiar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {empresasFiltradas.map((empresa) => (
            <EmpresaCard key={empresa.id} empresa={empresa} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmpresaCard({ empresa }: { empresa: Empresa }) {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{empresa.razon_social}</h3>
            <p className="text-green-100 text-sm">RFC: {empresa.rfc}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
        {empresa.sector && (
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
            {empresa.sector}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Información de contacto */}
        <div className="space-y-3 mb-6">
          {empresa.email && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-green-600" />
              <span>{empresa.email}</span>
            </div>
          )}
          {empresa.telefono && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-green-600" />
              <span>{empresa.telefono}</span>
            </div>
          )}
          {empresa.direccion && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="line-clamp-1">{empresa.direccion}</span>
            </div>
          )}
        </div>

        {/* Necesidades */}
        {empresa.onboarding?.productos_necesitados &&
          empresa.onboarding.productos_necesitados.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Productos que busca:
              </h4>
              <div className="flex flex-wrap gap-2">
                {empresa.onboarding.productos_necesitados
                  .slice(0, mostrarDetalles ? undefined : 3)
                  .map((producto, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
                    >
                      {producto}
                    </span>
                  ))}
                {!mostrarDetalles &&
                  empresa.onboarding.productos_necesitados.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                      +{empresa.onboarding.productos_necesitados.length - 3} más
                    </span>
                  )}
              </div>
            </div>
          )}

        {/* Detalles adicionales */}
        {mostrarDetalles && empresa.onboarding && (
          <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
            {empresa.onboarding.volumen_compra && (
              <div>
                <p className="text-xs text-gray-600">Volumen de compra:</p>
                <p className="text-sm font-semibold text-gray-900">
                  {empresa.onboarding.volumen_compra}
                </p>
              </div>
            )}
            {empresa.onboarding.frecuencia_compra && (
              <div>
                <p className="text-xs text-gray-600">Frecuencia:</p>
                <p className="text-sm font-semibold text-gray-900">
                  {empresa.onboarding.frecuencia_compra}
                </p>
              </div>
            )}
            {empresa.onboarding.presupuesto && (
              <div>
                <p className="text-xs text-gray-600">Presupuesto:</p>
                <p className="text-sm font-semibold text-gray-900">
                  {empresa.onboarding.presupuesto}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={() => setMostrarDetalles(!mostrarDetalles)}
            className="flex-1 px-4 py-2 border border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            {mostrarDetalles ? "Ver menos" : "Ver detalles"}
          </button>
          <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
            Contactar
          </button>
        </div>
      </div>
    </div>
  );
}
