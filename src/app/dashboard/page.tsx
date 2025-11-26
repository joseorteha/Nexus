// 🏠 DASHBOARD HOME
// Resumen general de la aplicación
// URL: /dashboard

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">🏠 Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">📊 Resumen</h3>
          <p className="text-gray-600">Vista general de la aplicación</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">🛒 Ventas</h3>
          <p className="text-gray-600">Estadísticas de ventas</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">💘 Matches</h3>
          <p className="text-gray-600">Conexiones activas</p>
        </div>
      </div>
    </div>
  );
}
