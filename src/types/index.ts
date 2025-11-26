// 📝 TIPOS Y INTERFACES GLOBALES

export interface User {
  id: string;
  email: string;
  name: string;
  role: "buyer" | "seller" | "admin";
  companyId?: string;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
  category: string;
  rating: number;
  ownerId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  companyId: string;
  category: string;
  stock: number;
  createdAt: Date;
}

export interface Match {
  id: string;
  company1Id: string;
  company2Id: string;
  status: "pending" | "matched" | "rejected";
  createdAt: Date;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}
