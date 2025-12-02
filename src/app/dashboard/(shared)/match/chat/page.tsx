"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";
import { MessageCircle, Send, Users, MapPin, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

interface Cooperativa {
  id: string;
  nombre: string;
  descripcion: string;
  region: string;
  categoria: string[];
  total_miembros: number;
}

interface Mensaje {
  id: string;
  user_id: string;
  mensaje: string;
  created_at: string;
}

function ChatCooperativaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cooperativaId = searchParams.get("cooperativa");
  
  const [cooperativa, setCooperativa] = useState<Cooperativa | null>(null);
  const [conversacionId, setConversacionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Mensaje[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cooperativaId) {
      router.push("/dashboard/match");
      return;
    }
    inicializarChat();
  }, [cooperativaId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Suscripción en tiempo real a nuevos mensajes
  useEffect(() => {
    if (!conversacionId) return;

    const channel = supabase
      .channel(`chat:${conversacionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_mensajes',
          filter: `conversacion_id=eq.${conversacionId}`
        },
        (payload) => {
          const nuevoMensaje = payload.new as Mensaje;
          // Solo agregar si no es del usuario actual (para evitar duplicados)
          if (nuevoMensaje.user_id !== userId) {
            setMessages(prev => [...prev, nuevoMensaje]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversacionId, userId]);

  async function inicializarChat() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUserId(user.id);

      // Cargar info de la cooperativa
      const { data: coopData, error: coopError } = await supabase
        .from("cooperativas")
        .select("*")
        .eq("id", cooperativaId)
        .single();

      if (coopError) throw coopError;
      setCooperativa(coopData);

      // Buscar o crear conversación
      let { data: conversacion, error: convError } = await supabase
        .from("chat_conversaciones")
        .select("id")
        .eq("user_id", user.id)
        .eq("cooperativa_id", cooperativaId)
        .single();

      if (convError && convError.code !== "PGRST116") { // No encontrado
        throw convError;
      }

      if (!conversacion) {
        // Crear nueva conversación
        const { data: newConv, error: createError } = await supabase
          .from("chat_conversaciones")
          .insert({
            user_id: user.id,
            cooperativa_id: cooperativaId
          })
          .select("id")
          .single();

        if (createError) throw createError;
        conversacion = newConv;
      }

      setConversacionId(conversacion.id);

      // Cargar mensajes
      const { data: mensajes, error: msgError } = await supabase
        .from("chat_mensajes")
        .select("*")
        .eq("conversacion_id", conversacion.id)
        .order("created_at", { ascending: true });

      if (msgError) throw msgError;
      setMessages(mensajes || []);

    } catch (error) {
      console.error("Error inicializando chat:", error);
      alert("Error al cargar el chat");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !conversacionId || !userId || isSending) return;

    setIsSending(true);
    try {
      const { data, error } = await supabase
        .from("chat_mensajes")
        .insert({
          conversacion_id: conversacionId,
          user_id: userId,
          mensaje: newMessage.trim()
        })
        .select()
        .single();

      if (error) throw error;

      // Agregar mensaje localmente
      setMessages(prev => [...prev, data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      alert("Error al enviar mensaje");
    } finally {
      setIsSending(false);
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando chat...</p>
        </div>
      </div>
    );
  }

  if (!cooperativa) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Cooperativa no encontrada</p>
        <Link href="/dashboard/match" className="text-purple-600 hover:text-purple-700 mt-4 inline-block">
          Volver al Match
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/dashboard/match" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Match
        </Link>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{cooperativa.nombre}</h1>
              <p className="text-purple-100 text-sm mb-2">{cooperativa.descripcion}</p>
              <div className="flex items-center gap-4 text-sm text-purple-100">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {cooperativa.region}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {cooperativa.total_miembros} miembros
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-semibold">Chat Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 400px)' }}>
        {/* Mensajes */}
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">No hay mensajes aún</p>
                  <p className="text-gray-400 text-sm">Inicia la conversación con la cooperativa</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.user_id === userId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                        message.user_id === userId
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.mensaje}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.user_id === userId ? "text-purple-100" : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input de mensaje */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatCooperativaPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <ChatCooperativaContent />
    </Suspense>
  );
}
