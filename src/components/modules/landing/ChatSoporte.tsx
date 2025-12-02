"use client";

import { useState } from "react";

export default function ChatSoporte() {
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: userMsg.text })
    });

    const data = await res.json();

    const botMsg = { sender: "bot", text: data.reply };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="w-full bg-white border border-indigo-200 rounded-xl p-4 shadow-lg">

      {/* Caja de mensajes */}
      <div className="h-64 overflow-y-auto p-3 rounded-lg bg-indigo-50 mb-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] ${
              m.sender === "user"
                ? "bg-indigo-600 text-white ml-auto"
                : "bg-white border border-indigo-200 text-gray-800"
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="p-3 bg-white border border-indigo-200 rounded-xl w-fit text-gray-500">
            Escribiendo…
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 border border-indigo-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Escribe tu mensaje…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}



