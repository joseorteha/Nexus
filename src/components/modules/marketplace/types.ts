// src/components/modules/marketplace/types.ts
export interface Company {
  id: string;
  name: string;
  price?: number;
  polo?: string;
  description?: string;
  offers?: string[];
  logoUrl?: string;
  imageUrl?: string;
  category?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

/* editado para subir */



