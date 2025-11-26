// 💰 VENTAS
// URL: /dashboard/erp/sales

export default function SalesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">💰 Ventas</h1>
      
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Ventas del mes</p>
          <p className="text-3xl font-bold">$10,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Órdenes</p>
          <p className="text-3xl font-bold">45</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Productos vendidos</p>
          <p className="text-3xl font-bold">120</p>
        </div>
      </div>
    </div>
  );
}
