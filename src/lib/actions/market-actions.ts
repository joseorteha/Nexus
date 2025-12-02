"use server";

// 🛒 SERVER ACTIONS - MARKETPLACE
// Responsable: David

export async function getProducts() {
  // TODO: Obtener productos del marketplace
  return [];
}

export async function addToCart(productId: string) {
  // TODO: Agregar producto al carrito
  console.log("Add to cart:", productId);
}

export async function checkout(cartItems: any[]) {
  // TODO: Procesar compra
  console.log("Checkout:", cartItems);
}



