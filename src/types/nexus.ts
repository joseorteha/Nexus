//  TIPOS DE NEXUS - Sistema de Match y Marketplace B2B

// === FASE 1 y 2: Estrategia de Crecimiento Regional ===
export type PoloName = 
  | "Zongolica" 
  | "Orizaba" 
  | "Córdoba" 
  | "Tehuipango" 
  | "Altas Montañas (General)";

// === TIPOS DE EMPRESA (Estrategia NODESS) ===
export type CompanyType = 
  | "PYME" 
  | "Cooperativa" 
  | "Startup" 
  | "Empresa Social" 
  | "Gobierno/Institución";

// === INDUSTRIAS DEL POLO ===
export type Industry = 
  | "Agroindustria" 
  | "Comercio" 
  | "Artesanía" 
  | "Logística" 
  | "Servicios" 
  | "Tecnología";

// === NIVELES DE SUSCRIPCIÓN ===
export type TierLevel = "Free" | "Pro" | "Premium";

// === URGENCIA DE NECESIDADES ===
export type UrgencyLevel = "Baja" | "Media" | "Alta";

// === ESTADO DE FINANCIAMIENTO ===
export type FinancingStatus = "Busca" | "Ofrece" | "Ninguno";

// === ESTADO DE MATCH ===
export type MatchStatus = "pending" | "accepted" | "rejected";

// === INTERFACE PRINCIPAL: EMPRESA ===
export interface Company {
  id: string;
  name: string;
  type: CompanyType; // Vital para estrategia NODESS
  polo: PoloName;
  industry: Industry;
  tier: TierLevel;
  
  // === ALGORITMO DE MATCH ===
  offers: string[];          // Ej: ["Café de Altura", "Muebles de Madera"]
  needs: string[];           // Ej: ["Envases Biodegradables", "Crédito"]
  urgency: UrgencyLevel;     // Prioridad en el algoritmo
  financing: FinancingStatus; // Para matching financiero
  
  // === DATOS VISUALES ===
  description: string;       // Descripción tipo "Tinder empresarial"
  logoUrl: string;           // URL del logo (placeholder por ahora)
  
  // === DATOS DE CONTACTO ===
  email?: string;
  phone?: string;
  address?: string;
  
  // === SISTEMA DE REPUTACIÓN ===
  rating?: number;           // 0-5 estrellas
  reviewCount?: number;      // Número de reseñas
}

// === MATCH ENTRE EMPRESAS ===
export interface Match {
  id: string;
  company1Id: string;
  company2Id: string;
  status: MatchStatus;
  matchReason: string;       // Ej: "Oferta coincide con necesidad"
  compatibilityScore: number; // 0-100
  createdAt: Date;
}

// === MENSAJE EN CHAT ===
export interface Message {
  id: string;
  matchId: string;
  senderId: string;          // ID de la empresa que envía
  content: string;
  createdAt: Date;
  read: boolean;
}

// === PRODUCTO EN MARKETPLACE ===
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  companyId: string;
  category: Industry;
  stock: number;
  createdAt: Date;
  featured?: boolean;        // Para destacar en el marketplace
}

// === USUARIO DEL SISTEMA ===
export interface User {
  id: string;
  email: string;
  name: string;
  role: "owner" | "admin" | "employee"; // Roles dentro de la empresa
  companyId: string;
  createdAt: Date;
}

// === FILTROS DE BÚSQUEDA ===
export interface MatchFilters {
  polo?: PoloName[];
  industry?: Industry[];
  companyType?: CompanyType[];
  urgency?: UrgencyLevel[];
  financing?: FinancingStatus[];
  searchQuery?: string;
}

// === RESULTADO DE ALGORITMO DE MATCH ===
export interface MatchResult {
  company: Company;
  score: number;             // Puntuación de compatibilidad 0-100
  reasons: string[];         // Razones del match
  matchType: "provider" | "client" | "partner" | "financing";
}
