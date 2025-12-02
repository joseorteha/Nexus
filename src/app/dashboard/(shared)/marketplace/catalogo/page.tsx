"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Building2, MapPin, Search, Filter, Package, TrendingUp, Phone, Mail, ChevronRight } from "lucide-react";

interface EmpresaDemanda {
  id: string;
  razon_social: string;
  rfc: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  estado: string;
  categoria_productos: string[];
  descripcion_necesidades: string;
  volumen_demanda: string;
  frecuencia_compra: string;
  created_at: string;
}

export default function CatalogoEmpresasPage() {
  const [loading, setLoading] = useState(true);
  const [empresas, setEmpresas] = useState<EmpresaDemanda[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("todas");
  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    cargarEmpresas();
  }, []);

  async function cargarEmpresas() {
    try {
      // Obtener todas las empresas registradas
      const { data: empresasData, error } = await supabase
        .from("empresas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEmpresas(empresasData || []);

      // Extraer categorías únicas
      const todasCategorias = new Set<string>();
      empresasData?.forEach((empresa) => {
        if (empresa.categoria_productos) {
          empresa.categoria_productos.forEach((cat: string) => todasCategorias.add(cat));
        }
      });
      setCategorias(Array.from(todasCategorias));

    } catch (error) {
      console.error("Error cargando empresas:", error);
    } finally {
      setLoading(false);
    }
  }

  const empresasFiltradas = empresas.filter((empresa) => {
    const matchSearch = 
      empresa.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.estado?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategoria =
      categoriaFilter === "todas" ||
      empresa.categoria_productos?.includes(categoriaFilter);

    return matchSearch && matchCategoria;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Catálogo de Empresas
          </h1>
        </div>
        <p className="text-gray-600 ml-[60px]">
          Descubre empresas que buscan productos y ofrece tus soluciones
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por empresa, ciudad o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de categoría */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Empresas</p>
              <p className="text-xl font-bold text-gray-900">{empresas.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Resultados</p>
              <p className="text-xl font-bold text-gray-900">{empresasFiltradas.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Categorías</p>
              <p className="text-xl font-bold text-gray-900">{categorias.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Empresas */}
      {empresasFiltradas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No se encontraron empresas
          </h3>
          <p className="text-gray-600">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {empresasFiltradas.map((empresa) => (
            <div
              key={empresa.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header de la empresa */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {empresa.razon_social}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {empresa.ciudad}, {empresa.estado}
                        </span>
                      </div>
                      {empresa.categoria_productos && empresa.categoria_productos.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {empresa.categoria_productos.map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
                    <span>Ver más</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Necesidades */}
                {empresa.descripcion_necesidades && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4 text-purple-600" />
                      Necesidades de Productos
                    </h4>
                    <p className="text-gray-700 text-sm">{empresa.descripcion_necesidades}</p>
                  </div>
                )}

                {/* Información adicional */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {empresa.volumen_demanda && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Volumen Demanda</p>
                      <p className="font-semibold text-gray-900">{empresa.volumen_demanda}</p>
                    </div>
                  )}
                  {empresa.frecuencia_compra && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Frecuencia de Compra</p>
                      <p className="font-semibold text-gray-900">{empresa.frecuencia_compra}</p>
                    </div>
                  )}
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Contacto</p>
                    <div className="flex flex-col gap-1">
                      {empresa.telefono && (
                        <a 
                          href={`tel:${empresa.telefono}`}
                          className="text-sm font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {empresa.telefono}
                        </a>
                      )}
                      {empresa.email && (
                        <a 
                          href={`mailto:${empresa.email}`}
                          className="text-sm font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          {empresa.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



