// 💬 CHAT
// URL: /dashboard/match/chat

export default function ChatPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">💬 Chat</h1>
      
      <div className="grid md:grid-cols-3 gap-4 h-[600px]">
        {/* Lista de conversaciones */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-4">Conversaciones</h3>
          <div className="space-y-2">
            <div className="p-3 bg-gray-100 rounded cursor-pointer">Empresa A</div>
            <div className="p-3 hover:bg-gray-100 rounded cursor-pointer">Empresa B</div>
            <div className="p-3 hover:bg-gray-100 rounded cursor-pointer">Empresa C</div>
          </div>
        </div>

        {/* Ventana de chat */}
        <div className="md:col-span-2 bg-white rounded-lg shadow flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Empresa A</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <p className="text-gray-500 text-center">Selecciona una conversación</p>
          </div>
          <div className="p-4 border-t">
            <input 
              type="text" 
              placeholder="Escribe un mensaje..."
              className="w-full border rounded px-4 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
