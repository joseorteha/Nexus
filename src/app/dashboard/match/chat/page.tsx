"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getConfirmedMatches } from "@/lib/actions/match-actions";
import { getConversations, getMessages, sendMessageToChat, subscribeToMessages } from "@/lib/services/chat-service";
import type { Company, Message, ChatConversation } from "@/types/nexus";
import { MessageCircle, Send, Building2, Star, MapPin, Circle, Search, ArrowLeft, Loader2 } from "lucide-react";

export default function ChatPage() {
  const [matches, setMatches] = useState<Company[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Company | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = "1"; // TODO: Obtener del contexto de autenticación cuando esté Supabase

  useEffect(() => {
    loadMatches();
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Suscribirse a mensajes nuevos cuando se selecciona un match
  useEffect(() => {
    if (!selectedMatch) return;

    const conversationId = `conv-${currentUserId}-${selectedMatch.id}`;
    const unsubscribe = subscribeToMessages(conversationId, (newMsg) => {
      setMessages(prev => [...prev, newMsg]);
    });

    return () => unsubscribe();
  }, [selectedMatch]);

  const loadMatches = async () => {
    try {
      const confirmedMatches = await getConfirmedMatches(currentUserId);
      setMatches(confirmedMatches);
    } catch (error) {
      console.error("Error loading matches:", error);
    }
  };

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const convs = await getConversations(currentUserId);
      setConversations(convs);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (companyId: string) => {
    try {
      const conversationId = `conv-${currentUserId}-${companyId}`;
      const msgs = await getMessages(conversationId);
      setMessages(msgs);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSelectMatch = (match: Company) => {
    setSelectedMatch(match);
    loadMessages(match.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch || isSending) return;

    setIsSending(true);
    try {
      const conversationId = `conv-${currentUserId}-${selectedMatch.id}`;
      const sentMessage = await sendMessageToChat(
        conversationId,
        currentUserId,
        selectedMatch.id,
        newMessage
      );

      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");
      
      // Actualizar lista de conversaciones
      loadConversations();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

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

  const getMatchForConversation = (conv: ChatConversation): Company | undefined => {
    return matches.find(m => m.id === conv.companyId);
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
              <Badge variant="default" size="sm">{conversations.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Cargando conversaciones...</p>
              </div>
            ) : conversations.length === 0 ? (
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
                {conversations.map((conv) => {
                  const match = getMatchForConversation(conv);
                  if (!match) return null;
                  
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectMatch(match)}
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
                            <span className="text-xs text-gray-500 ml-2 shrink-0">{formatTime(conv.lastMessageTime)}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate mb-1">{conv.lastMessage}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {match.polo}
                            </div>
                            {conv.unreadCount > 0 && (
                              <Badge variant="default" size="sm" className="bg-primary text-white">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
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
                      className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                          message.senderId === currentUserId
                            ? "bg-linear-to-r from-primary to-accent text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.senderId === currentUserId ? "text-white/70" : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.timestamp)}
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
                    disabled={!newMessage.trim() || isSending}
                    className="rounded-xl px-6 bg-linear-to-r from-primary to-accent hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
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
