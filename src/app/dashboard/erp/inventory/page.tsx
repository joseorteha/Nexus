// 📦 INVENTARIO
// URL: /dashboard/erp/inventory

export default function InventoryPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">📦 Inventario</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Producto</th>
              <th className="text-left p-2">Stock</th>
              <th className="text-left p-2">Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">Producto 1</td>
              <td className="p-2">100</td>
              <td className="p-2">$50.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
