// 🚨 CORRECCIÓN: Usar la directiva "use client" para habilitar la interactividad
"use client";

import React from 'react';

// Define la interfaz (tipo) para tu producto
interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    
  // Función que maneja el evento de click (Event Handler)
  const handleAddToCart = () => {
    console.log(`Producto ID: ${product.id} (${product.name}) añadido al carrito.`);
    // Aquí es donde iría la lógica real para añadir al estado global del carrito.
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      
      {/* Imagen del Producto */}
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-4">
        
        {/* Nombre del Producto */}
        <h3 className="text-xl font-semibold text-gray-800 truncate mb-2">
          {product.name}
        </h3>
        
        {/* Precio */}
        <p className="text-2xl font-bold text-indigo-600 mb-4">
          ${product.price.toFixed(2)} 
        </p>

        {/* Botón de Acción: Ahora el onClick funciona correctamente */}
        <button
          className="w-full bg-indigo-500 text-white py-2 rounded-lg font-medium hover:bg-indigo-600 transition duration-150"
          onClick={handleAddToCart} // <--- Usa el handler definido arriba
        >
          Añadir al Carrito
        </button>

        {/* Enlace para ver detalles (Opcional) */}
        <a 
          href={`/dashboard/marketplace/${product.id}`} 
          className="block mt-2 text-center text-sm text-indigo-500 hover:text-indigo-700 transition"
        >
          Ver Detalles
        </a>
        
      </div>
    </div>
  );
};

export default ProductCard;



/* editado para subir */
