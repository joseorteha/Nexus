"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { MessageCircle, Send, User, Clock, Check, CheckCheck, Search } from "lucide-react";

interface Conversacion {
  id: string;
  user_id: string;
  cooperativa_id: string;
  estado: string;
  created_at: string;
  updated_at: string;
  usuario: {
    nombre: string;
    apellidos: string;
  };
  ultimo_mensaje?: {
    mensaje: string;
    created_at: string;
    user_id: string;
  };
  mensajes_no_leidos?: number;
}

interface Mensaje {
  id: string;
  conversacion_id: string;
  user_id: string;
  mensaje: string;
  created_at: string;
  usuario: {
    nombre: string;
    apellidos: string;
  };
}

export default function MensajesCooperativaPage() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionActiva, setConversacionActiva] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [cooperativaId, setCooperativaId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (conversacionActiva) {
      loadMensajes(conversacionActiva);
      
      // Suscribirse a nuevos mensajes en tiempo real
      const channel = supabase
        .channel(`mensajes-${conversacionActiva}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_mensajes',
            filter: `conversacion_id=eq.${conversacionActiva}`
          },
          (payload) => {
            loadMensajes(conversacionActiva);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversacionActiva]);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  async function init() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserId(user.id);

      // Obtener cooperativa del usuario
      const { data: coopData } = await supabase
        .from("cooperativas")
        .select("id")
        .eq("creada_por", user.id)
        .single();

      if (!coopData) {
        setLoading(false);
        return;
      }

      setCooperativaId(coopData.id);
      await loadConversaciones(coopData.id);
    } catch (error) {
      console.error("Error inicializando:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadConversaciones(coopId: string) {
    try {
      const { data, error } = await supabase
        .from("chat_conversaciones")
        .select(`
          id,
          user_id,
          cooperativa_id,
          estado,
          created_at,
          updated_at,
          usuarios:user_id (
            nombre,
            apellidos
          )
        `)
        .eq("cooperativa_id", coopId)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Obtener último mensaje de cada conversación
      const conversacionesConMensajes = await Promise.all(
        (data || []).map(async (conv: any) => {
          const { data: ultimoMsg } = await supabase
            .from("chat_mensajes")
            .select("mensaje, created_at, user_id")
            .eq("conversacion_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            usuario: conv.usuarios,
            ultimo_mensaje: ultimoMsg
          };
        })
      );

      setConversaciones(conversacionesConMensajes);
    } catch (error) {
      console.error("Error cargando conversaciones:", error);
    }
  }

  async function loadMensajes(conversacionId: string) {
    try {
      const { data, error } = await supabase
        .from("chat_mensajes")
        .select(`
          id,
          conversacion_id,
          user_id,
          mensaje,
          created_at,
          usuarios:user_id (
            nombre,
            apellidos
          )
        `)
        .eq("conversacion_id", conversacionId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const mensajesFormateados = (data || []).map((msg: any) => ({
        ...msg,
        usuario: msg.usuarios
      }));

      setMensajes(mensajesFormateados);
    } catch (error) {
      console.error("Error cargando mensajes:", error);
    }
  }

  async function enviarMensaje() {
    if (!nuevoMensaje.trim() || !conversacionActiva || !userId) return;

    try {
      const { error } = await supabase
        .from("chat_mensajes")
        .insert({
          conversacion_id: conversacionActiva,
          user_id: userId,
          mensaje: nuevoMensaje.trim()
        });

      if (error) throw error;

      setNuevoMensaje("");
      
      // Actualizar timestamp de conversación
      await supabase
        .from("chat_conversaciones")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversacionActiva);

      // Recargar conversaciones para actualizar orden
      if (cooperativaId) {
        loadConversaciones(cooperativaId);
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      alert("Error al enviar mensaje");
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const conversacionesFiltradas = conversaciones.filter(conv =>
    `${conv.usuario?.nombre} ${conv.usuario?.apellidos}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const conversacionSeleccionada = conversaciones.find(c => c.id === conversacionActiva);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cooperativaId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-600">No se encontró cooperativa</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Lista de Conversaciones */}
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            Mensajes
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversacionesFiltradas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No hay conversaciones</p>
              <p className="text-sm mt-2">
                Los usuarios te contactarán desde el Match
              </p>
            </div>
          ) : (
            conversacionesFiltradas.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setConversacionActiva(conv.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                  conversacionActiva === conv.id ? "bg-blue-50 border-l-4 border-l-primary" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                      {conv.usuario?.nombre?.charAt(0)}{conv.usuario?.apellidos?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {conv.usuario?.nombre} {conv.usuario?.apellidos}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(conv.updated_at).toLocaleDateString("es-MX")}
                      </p>
                    </div>
                  </div>
                </div>
                {conv.ultimo_mensaje && (
                  <p className="text-sm text-gray-600 truncate ml-15">
                    {conv.ultimo_mensaje.mensaje}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {conversacionActiva ? (
          <>
            {/* Header del Chat */}
            <div className="bg-white border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                  {conversacionSeleccionada?.usuario?.nombre?.charAt(0)}
                  {conversacionSeleccionada?.usuario?.apellidos?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {conversacionSeleccionada?.usuario?.nombre}{" "}
                    {conversacionSeleccionada?.usuario?.apellidos}
                  </h3>
                  <p className="text-xs text-gray-500">Conversación desde Match</p>
                </div>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {mensajes.map((mensaje) => {
                const esMio = mensaje.user_id === userId;
                return (
                  <div
                    key={mensaje.id}
                    className={`flex ${esMio ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${esMio ? "order-2" : "order-1"}`}>
                      {!esMio && (
                        <p className="text-xs text-gray-500 mb-1 ml-2">
                          {mensaje.usuario?.nombre}
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          esMio
                            ? "bg-primary text-white"
                            : "bg-white text-gray-900 border"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {mensaje.mensaje}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            esMio ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {new Date(mensaje.created_at).toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensaje */}
            <div className="bg-white border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && enviarMensaje()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-3 border rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={enviarMensaje}
                  disabled={!nuevoMensaje.trim()}
                  className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageCircle className="w-20 h-20 text-gray-300 mb-4" />
            <p className="text-lg font-semibold">Selecciona una conversación</p>
            <p className="text-sm mt-2">
              Elige un chat de la izquierda para comenzar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



