"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getConfirmedMatches, sendMessage } from "@/lib/actions/match-actions";
import type { Company } from "@/types/nexus";
import { MessageCircle, Send, Building2, Star, MapPin, Circle, Search, ArrowLeft } from "lucide-react";

export default function ChatPage() {
  const [matches, setMatches] = useState<Company[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Company | null>(null);
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: "me" | "them"; time: string }>>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMatches = async () => {
    const confirmedMatches = await getConfirmedMatches("1");
    setMatches(confirmedMatches);
    if (confirmedMatches.length > 0) {
      setSelectedMatch(confirmedMatches[0]);
      loadMessages(confirmedMatches[0].id);
    }
  };

  const loadMessages = (matchId: string) => {
    // TODO: Cargar mensajes reales de la base de datos
    // Por ahora usamos mensajes de ejemplo
    const exampleMessages = [
      {
        id: "1",
        text: "¡Hola! Vi que ofrecen servicios de logística. Necesitamos distribuir nuestro café.",
        sender: "me" as const,
        time: "10:30 AM"
      },
      {
        id: "2",
        text: "¡Hola! Sí, tenemos experiencia en transporte de productos agrícolas. ¿A dónde necesitan enviar?",
        sender: "them" as const,
        time: "10:35 AM"
      },
      {
        id: "3",
        text: "Principalmente a Orizaba y Córdoba. ¿Cuáles son sus tarifas?",
        sender: "me" as const,
        time: "10:40 AM"
      }
    ];
    setMessages(exampleMessages);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "me" as const,
      time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Enviar mensaje al servidor
    await sendMessage(selectedMatch.id, newMessage);
  };

  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Mis Matches
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Chatea con empresas compatibles</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 h-[calc(100%-100px)]">
        {/* Lista de conversaciones */}
        <Card className="overflow-hidden flex flex-col shadow-lg border-gray-200">
          <CardHeader className="bg-linear-to-r from-primary/5 to-secondary/5 border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Conversaciones
              </CardTitle>
              <Badge variant="default" size="sm">{matches.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {matches.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-2">No tienes matches aún</p>
                <p className="text-gray-400 text-sm mb-4">Comienza a hacer swipe para encontrar empresas</p>
                <a
                  href="/dashboard/match"
                  className="text-primary hover:text-primary-hover font-medium inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Buscar empresas
                </a>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {matches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => {
                      setSelectedMatch(match);
                      loadMessages(match.id);
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-all duration-200 ${
                      selectedMatch?.id === match.id ? "bg-primary/5 border-l-4 border-primary" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-sm truncate text-gray-900">
                            {match.name}
                          </h3>
                          <Badge variant="success" size="sm" className="ml-2 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            {match.rating}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <span className="font-medium">{match.type}</span>
                          <span className="text-gray-400">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {match.polo}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                          Disponible para chatear
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ventana de chat */}
        <Card className="md:col-span-2 overflow-hidden flex flex-col shadow-lg border-gray-200">
          {selectedMatch ? (
            <>
              {/* Header del chat */}
              <CardHeader className="bg-linear-to-r from-primary via-accent to-secondary text-white pb-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedMatch.name}</h3>
                      <div className="flex items-center gap-2 text-xs opacity-90">
                        <MapPin className="w-3 h-3" />
                        {selectedMatch.polo} • {selectedMatch.industry}
                      </div>
                    </div>
                  </div>
                  <Badge variant="success" className="bg-white/20 backdrop-blur-sm text-white border border-white/30 flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-green-400 text-green-400 animate-pulse" />
                    En línea
                  </Badge>
                </div>
              </CardHeader>

              {/* Mensajes */}
              <CardContent className="flex-1 overflow-y-auto p-6 bg-linear-to-br from-gray-50 to-white">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                          message.sender === "me"
                            ? "bg-linear-to-r from-primary to-accent text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === "me" ? "text-white/70" : "text-gray-500"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Input de mensaje */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-3"
                >
                  <Input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 rounded-xl border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    type="submit"
                    variant="default"
                    disabled={!newMessage.trim()}
                    className="rounded-xl px-6 bg-linear-to-r from-primary to-accent hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Selecciona una conversación</h3>
                <p className="text-gray-500">Elige un match para comenzar a chatear</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
