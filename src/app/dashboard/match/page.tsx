"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Heart, X, Sparkles, Users, MapPin, Package, RefreshCw, CheckCircle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface Cooperativa {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string[];
  region: string;
  productos_ofrecidos: string[];
  capacidad_produccion: string;
  total_miembros: number;
  miembros_objetivo: number;
  buscando_miembros: boolean;
  creada_por: string;
  fecha_creacion: string;
}

export default function MatchPage() {
  const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadCooperativas();
  }, []);

  async function loadCooperativas() {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserId(user.id);

      // Obtener cooperativas activas que buscan miembros
      const { data, error } = await supabase
        .from("cooperativas")
        .select("*")
        .eq("estado", "active")
        .eq("buscando_miembros", true)
        .neq("creada_por", user.id) // No mostrar las propias
        .order("fecha_creacion", { ascending: false });

      if (error) throw error;

      setCooperativas(data || []);
    } catch (error) {
      console.error("Error cargando cooperativas:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleJoin(cooperativaId: string) {
    if (!userId) return;

    try {
      // Agregar al usuario como miembro
      const { error } = await supabase
        .from("cooperativa_miembros")
        .insert({
          cooperativa_id: cooperativaId,
          user_id: userId,
          rol: "miembro"
        });

      if (error) throw error;

      // Actualizar contador de miembros
      const cooperativa = cooperativas[currentIndex];
      await supabase
        .from("cooperativas")
        .update({ total_miembros: cooperativa.total_miembros + 1 })
        .eq("id", cooperativaId);

      setShowJoinModal(true);
      setTimeout(() => {
        setShowJoinModal(false);
        nextCard();
      }, 2000);
    } catch (error: any) {
      console.error("Error al unirse:", error);
      alert("Error al unirse a la cooperativa: " + error.message);
    }
  }

  function handlePass() {
    nextCard();
  }

  function nextCard() {
    if (currentIndex < cooperativas.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }

  const currentCooperativa = cooperativas[currentIndex];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <Users className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Buscando cooperativas...</p>
          <p className="text-gray-400 text-sm mt-1">Cargando convocatorias activas</p>
        </div>
      </div>
    );
  }

  if (!currentCooperativa) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            {cooperativas.length === 0 ? "No hay cooperativas activas" : "¡Has visto todas las cooperativas!"}
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {cooperativas.length === 0 
              ? "Sé el primero en crear una cooperativa y empezar a formar tu equipo." 
              : "Revisa nuevamente o crea tu propia cooperativa."}
          </p>
          <div className="flex gap-3 justify-center">
            {cooperativas.length > 0 && (
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  loadCooperativas();
                }}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                Volver a ver
              </button>
            )}
            <Link
              href="/dashboard/cooperativas/crear"
              className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 font-medium"
            >
              <Users className="w-5 h-5" />
              Crear Cooperativa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Cooperativas Activas
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Descubre cooperativas buscando nuevos miembros
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Cooperativa <span className="font-bold text-gray-900">{currentIndex + 1}</span> de <span className="font-bold text-gray-900">{cooperativas.length}</span>
          </div>
          <Link
            href="/dashboard/cooperativas/crear"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Crear mi cooperativa →
          </Link>
        </div>
      </div>

      {/* Cooperativa Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 mb-6">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">{currentCooperativa.nombre}</h2>
          <p className="text-blue-100">{currentCooperativa.descripcion}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{currentCooperativa.total_miembros}</p>
              <p className="text-xs text-gray-600">Miembros</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <Package className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{currentCooperativa.productos_ofrecidos?.length || 0}</p>
              <p className="text-xs text-gray-600">Productos</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{currentCooperativa.miembros_objetivo}</p>
              <p className="text-xs text-gray-600">Objetivo</p>
            </div>
          </div>

          {/* Categorías */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Categorías</p>
            <div className="flex flex-wrap gap-2">
              {currentCooperativa.categoria?.map((cat, index) => (
                <Badge key={index} variant="default" className="bg-blue-100 text-blue-700">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* Productos */}
          {currentCooperativa.productos_ofrecidos && currentCooperativa.productos_ofrecidos.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Productos que ofrecen</p>
              <div className="flex flex-wrap gap-2">
                {currentCooperativa.productos_ofrecidos.map((prod, index) => (
                  <Badge key={index} variant="outline">
                    {prod}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Región */}
          {currentCooperativa.region && (
            <div className="flex items-center gap-2 text-gray-700 mb-6">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{currentCooperativa.region}</span>
            </div>
          )}

          {/* Capacidad */}
          {currentCooperativa.capacidad_produccion && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">Capacidad de producción</p>
              <p className="font-semibold text-gray-900">{currentCooperativa.capacidad_produccion}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 p-8 pt-0">
          <button
            onClick={handlePass}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Pasar
          </button>
          <button
            onClick={() => handleJoin(currentCooperativa.id)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-xl text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Unirme
          </button>
        </div>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 max-w-md mx-4 text-center shadow-2xl border border-gray-200 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              ¡Te has unido!
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Ahora eres parte de la cooperativa
            </p>
            <div className="flex gap-2 justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
