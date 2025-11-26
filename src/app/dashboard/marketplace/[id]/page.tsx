// 📦 DETALLE DE PRODUCTO
// URL: /dashboard/marketplace/[id]

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">📦 Detalle del Producto</h1>
      <p className="text-gray-600 mb-4">ID: {params.id}</p>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-200 h-64 rounded">Imagen</div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Nombre del Producto</h2>
            <p className="text-gray-600 mb-4">Descripción detallada...</p>
            <p className="text-3xl font-bold text-green-600 mb-4">$999.99</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
