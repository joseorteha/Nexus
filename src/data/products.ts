// src/app/data/products.ts

// 1. Definición de la Interfaz (Type Safety)
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: 'electronics' | 'books' | 'home'; // Ejemplo de categorías para filtros
}

// 2. Array de Productos (Los datos que la aplicación consumirá)
export const products: Product[] = [
  {
    id: 1,
    name: 'Laptop Ultraligera X2000',
    price: 1299.99,
    imageUrl: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Laptop', // Placeholder
    description: 'La nueva generación con procesador de 12 núcleos y 32GB de RAM.',
    category: 'electronics',
  },
  {
    id: 2,
    name: 'El Gran Libro de Next.js',
    price: 49.50,
    imageUrl: 'https://via.placeholder.com/600x400/9333EA/FFFFFF?text=Libro',
    description: 'Aprende el App Router, Server Components y más en 500 páginas.',
    category: 'books',
  },
  {
    id: 3,
    name: 'Set de Tazas Premium',
    price: 25.00,
    imageUrl: 'https://via.placeholder.com/600x400/059669/FFFFFF?text=Tazas',
    description: 'Juego de 4 tazas de cerámica artesanal, perfecto para el café.',
    category: 'home',
  },
];