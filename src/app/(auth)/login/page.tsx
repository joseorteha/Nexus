// 🔐 LOGIN PAGE
// Responsable: Jose
// URL: /login

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6">🔐 Login</h1>
        <p className="text-gray-600 mb-4">Responsable: Jose</p>
        <div className="bg-yellow-50 p-4 rounded">
          <h2 className="font-semibold mb-2">📝 Tareas:</h2>
          <ul className="space-y-1 text-sm">
            <li>✅ Crear LoginForm en: src/components/modules/auth/</li>
            <li>✅ Integrar con auth-actions.ts</li>
            <li>✅ Validación de formulario</li>
            <li>✅ Link a /register</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
