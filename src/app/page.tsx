// 🏠 LANDING PAGE (Página pública)
// Responsable: Guille
// URL: /

export default function Home() {
  return (
    <div className="min-h-screen">
      <h1 className="text-4xl font-bold text-center pt-20">
        🚀 Nexus - Landing Page
      </h1>
      <p className="text-center text-gray-600 mt-4">
        Responsable: Guille
      </p>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📝 Tareas:</h2>
        <ul className="space-y-2">
          <li>✅ Crear componentes en: src/components/modules/landing/</li>
          <li>✅ Hero Section, Features, Footer</li>
          <li>✅ Links a /login y /register</li>
        </ul>
      </div>
    </div>
  );
}
