// 👤 PERFIL DE USUARIO
// Responsable: Jesus
// URL: /dashboard/profile

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">👤 Mi Perfil</h1>
      <p className="text-gray-600 mb-4">Responsable: Jesus</p>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📝 Tareas:</h2>
        <ul className="space-y-2">
          <li>✅ Crear componentes en: src/components/modules/profile/</li>
          <li>✅ ProfileHeader - Cabecera con foto y nombre</li>
          <li>✅ EditProfileForm - Formulario de edición</li>
          <li>✅ Vista de empresa</li>
        </ul>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
          <div>
            <h3 className="text-2xl font-bold">Usuario</h3>
            <p className="text-gray-600">email@ejemplo.com</p>
          </div>
        </div>
        <button className="text-blue-600">Editar perfil</button>
      </div>
    </div>
  );
}
