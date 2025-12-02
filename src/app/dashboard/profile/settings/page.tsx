// ⚙️ CONFIGURACIÓN DE PERFIL
// URL: /dashboard/profile/settings

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">⚙️ Configuración</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Preferencias</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Notificaciones</label>
            <input type="checkbox" /> Recibir notificaciones por email
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Idioma</label>
            <select className="border rounded px-3 py-2">
              <option>Español</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}



