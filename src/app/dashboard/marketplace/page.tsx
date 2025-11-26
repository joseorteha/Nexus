// 🛒 MARKETPLACE - CATÁLOGO
// Responsable: David
// URL: /dashboard/marketplace

export default function MarketplacePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">🛒 Marketplace</h1>
      <p className="text-gray-600 mb-4">Responsable: David</p>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📝 Tareas:</h2>
        <ul className="space-y-2">
          <li>✅ Crear componentes en: src/components/modules/marketplace/</li>
          <li>✅ ProductCard - Tarjeta de producto</li>
          <li>✅ FilterBar - Barra de filtros</li>
          <li>✅ CartDrawer - Carrito lateral</li>
          <li>✅ Integrar con market-actions.ts</li>
        </ul>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded">Producto 1</div>
        <div className="bg-gray-100 p-4 rounded">Producto 2</div>
        <div className="bg-gray-100 p-4 rounded">Producto 3</div>
      </div>
    </div>
  );
}
