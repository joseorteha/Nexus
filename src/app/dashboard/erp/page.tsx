// 📊 ERP - MÓDULO PRINCIPAL
// Pendiente de asignar
// URL: /dashboard/erp

export default function ERPPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">📊 ERP</h1>
      <p className="text-yellow-600 mb-4">⚠️ Módulo pendiente de asignar</p>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Submódulos:</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <a href="/dashboard/erp/inventory" className="p-4 border rounded hover:bg-gray-50">
            📦 Inventario
          </a>
          <a href="/dashboard/erp/sales" className="p-4 border rounded hover:bg-gray-50">
            💰 Ventas
          </a>
        </div>
      </div>
    </div>
  );
}
