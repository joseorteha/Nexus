"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Bot } from "lucide-react";

export default function ChatSoporte() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([
    { 
      sender: "bot", 
      text: "Hola, soy el asistente virtual de Nexus. Estoy aquí para responder tus preguntas sobre nuestra plataforma de integración productiva para los PODECOBI. ¿En qué puedo ayudarte?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      const botMsg = { 
        sender: "bot", 
        text: data.reply || "Lo siento, ocurrió un error. Por favor intenta de nuevo."
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = { 
        sender: "bot", 
        text: "Lo siento, estoy teniendo problemas para conectarme. Por favor intenta más tarde o contacta a soporte@nexus.com"
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante profesional y compacto */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
          aria-label="Abrir chat de soporte"
        >
          <MessageCircle className="w-6 h-6" strokeWidth={2.5} />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse border-2 border-white"></span>
          
          {/* Tooltip profesional */}
          <span className="absolute bottom-full right-0 mb-2.5 px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg font-medium">
            ¿Preguntas sobre Nexus?
          </span>
        </button>
      )}

      {/* Ventana de chat profesional */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-[380px] h-[550px]'
          }`}
        >
          {/* Header con diseño premium */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-4 rounded-t-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30">
                <Bot className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-semibold text-base">Asistente Nexus</h3>
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <p className="text-xs text-blue-100">En línea • Respuesta inmediata</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="Minimizar chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Área de mensajes mejorada */}
              <div className="h-[390px] overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                  >
                    {m.sender === "bot" && (
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                        <Bot className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] p-3 rounded-xl shadow-sm ${
                        m.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                      <Bot className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="bg-white p-3 rounded-xl rounded-bl-none shadow-sm border border-gray-200">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input mejorado */}
              <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Pregunta sobre Nexus..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-2.5 rounded-full transition-all hover:scale-105 shadow-md disabled:shadow-none"
                    aria-label="Enviar mensaje"
                  >
                    <Send className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2.5 text-center">
                  Powered by OpenAI • Respuestas sobre Nexus y PODECOBI
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}