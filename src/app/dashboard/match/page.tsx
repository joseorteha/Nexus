// 💘 MATCH - SWIPE
// Responsable: Jose
// URL: /dashboard/match

export default function MatchPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">💘 Match</h1>
      <p className="text-gray-600 mb-4">Responsable: Jose</p>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📝 Tareas:</h2>
        <ul className="space-y-2">
          <li>✅ Crear componentes en: src/components/modules/match/</li>
          <li>✅ SwipeCard - Tarjeta de empresa para swipe</li>
          <li>✅ MatchList - Lista de matches</li>
          <li>✅ ChatWindow - Ventana de chat</li>
          <li>✅ Integrar con match-actions.ts</li>
        </ul>
      </div>

      <div className="mt-6 max-w-md mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-center mb-4">
            <div className="w-full h-64 bg-gray-300 rounded-lg mb-4"></div>
            <h3 className="text-2xl font-bold">Empresa Ejemplo</h3>
            <p className="text-gray-600">Categoría: Tecnología</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button className="bg-red-500 text-white px-8 py-3 rounded-lg">❌ Pass</button>
            <button className="bg-green-500 text-white px-8 py-3 rounded-lg">✅ Like</button>
          </div>
        </div>
      </div>
    </div>
  );
}
