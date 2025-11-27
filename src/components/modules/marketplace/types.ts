// src/components/modules/marketplace/types.ts
export interface Company {
  id: string;
  name: string;
  /* ...resto de campos... */
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

/* editado para subir */