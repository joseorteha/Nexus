// 🎯 ONBOARDING PAGE
// Formulario post-registro para completar perfil
// URL: /onboarding

export default function OnboardingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6">🎯 Onboarding</h1>
        <p className="text-gray-600 mb-4">Completar perfil de empresa</p>
        <div className="bg-purple-50 p-4 rounded">
          <h2 className="font-semibold mb-2">📝 Formulario:</h2>
          <ul className="space-y-1 text-sm">
            <li>• Nombre de empresa</li>
            <li>• Categoría</li>
            <li>• Descripción</li>
            <li>• Logo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
