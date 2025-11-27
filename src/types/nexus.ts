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
  conversationId: string;    // ID de la conversación
  senderId: string;          // ID de la empresa que envía
  receiverId: string;        // ID de la empresa que recibe
  content: string;
  timestamp: string;         // ISO string
  read: boolean;
}

// === CONVERSACIÓN DE CHAT ===
export interface ChatConversation {
  id: string;
  companyId: string;         // ID de la otra empresa
  lastMessage: string;
  lastMessageTime: string;   // ISO string
  unreadCount: number;
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

// ============================================
// 📊 TIPOS PARA EL MÓDULO ERP (Sistema Simulado)
// ============================================

// === PRODUCTO EN INVENTARIO ===
export interface InventoryItem {
  id: string;
  companyId: string;         // Empresa dueña del producto
  name: string;
  category: string;          // "Café", "Empaques", "Materia Prima", etc.
  sku: string;               // Código único
  stock: number;
  unit: string;              // "kg", "pz", "litros", "cajas"
  costPrice: number;         // Precio de compra
  salePrice: number;         // Precio de venta
  minStock: number;          // Stock mínimo (alerta)
  maxStock: number;          // Stock máximo
  supplier?: string;         // Proveedor principal
  lastRestockDate?: string;  // ISO string
  expirationDate?: string;   // Para productos perecederos
  imageUrl?: string;
  createdAt: string;         // ISO string
  updatedAt: string;         // ISO string
}

// === CLIENTE ===
export interface Customer {
  id: string;
  companyId: string;         // Empresa dueña del cliente
  name: string;
  type: "Individual" | "Empresa";
  rfc?: string;
  email?: string;
  phone: string;
  address?: string;
  city: string;
  creditLimit?: number;      // Límite de crédito
  currentDebt: number;       // Deuda actual
  totalPurchases: number;    // Total comprado histórico
  lastPurchaseDate?: string; // ISO string
  notes?: string;
  createdAt: string;         // ISO string
}

// === PROVEEDOR ===
export interface Supplier {
  id: string;
  companyId: string;
  name: string;
  rfc?: string;
  email?: string;
  phone: string;
  address?: string;
  city: string;
  totalPurchases: number;    // Total comprado histórico
  currentDebt: number;       // Deuda actual
  notes?: string;
  createdAt: string;
}

// === ITEM DE VENTA (Producto en una venta) ===
export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

// === VENTA ===
export interface Sale {
  id: string;
  companyId: string;
  saleNumber: string;        // "VTA-001", "VTA-002"
  customerId: string;
  customerName: string;
  saleDate: string;          // ISO string
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: "Efectivo" | "Transferencia" | "Tarjeta" | "Crédito";
  paymentStatus: "Pagado" | "Pendiente" | "Parcial";
  notes?: string;
  createdAt: string;         // ISO string
  createdBy: string;         // Usuario que registró
}

// === ITEM DE COMPRA ===
export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

// === COMPRA ===
export interface Purchase {
  id: string;
  companyId: string;
  purchaseNumber: string;    // "CMP-001"
  supplierId: string;
  supplierName: string;
  purchaseDate: string;      // ISO string
  items: PurchaseItem[];
  total: number;
  paymentStatus: "Pagado" | "Pendiente" | "Parcial";
  dueDate?: string;          // ISO string
  notes?: string;
  createdAt: string;
  createdBy: string;
}

// === ESTADÍSTICAS DEL ERP (Dashboard) ===
export interface ERPStats {
  companyId: string;
  period: "today" | "week" | "month" | "year";
  totalSales: number;
  salesCount: number;
  totalPurchases: number;
  purchasesCount: number;
  inventoryValue: number;    // Valor total del inventario
  lowStockItems: number;     // Productos con stock bajo
  totalCustomers: number;
  totalSuppliers: number;
  pendingPayments: number;   // Pagos pendientes por cobrar
  pendingDebts: number;      // Deudas pendientes por pagar
}

// === MOVIMIENTO DE INVENTARIO ===
export interface InventoryMovement {
  id: string;
  companyId: string;
  productId: string;
  productName: string;
  type: "entrada" | "salida"; // Entrada = compra, Salida = venta
  quantity: number;
  reason: string;            // "venta", "compra", "ajuste", "devolución"
  referenceId?: string;      // ID de la venta o compra
  date: string;              // ISO string
  createdBy: string;
}

// ===========================
// USER ROLES & COOPERATIVAS
// ===========================

export type UserRole = "normal" | "cooperativa" | "empresa" | "admin";

export interface Cooperative {
  id: string;
  name: string;
  description: string;
  category: string[];
  region: string;
  foundedDate: string;
  logo?: string;
  certifications?: string[];
  productionCapacity: string;
  totalMembers: number;
  totalProducts: number;
  totalSales: number;
  status: "active" | "pending" | "inactive";
  createdAt: string;
}

export interface CooperativeMember {
  id: string;
  cooperativeId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: "founder" | "member";
  joinedAt: string;
  status: "active" | "pending";
}

export interface CooperativeRequest {
  id: string;
  type: "create" | "join";
  userId: string;
  userName: string;
  userEmail: string;
  cooperativeId?: string;
  cooperativeName?: string;
  cooperativeData?: Partial<Cooperative>;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

// === ONBOARDING DATA ===

export interface OnboardingUsuarioNormal {
  userId: string;
  products: string[];
  categories: string[];
  productionCapacity: string;
  region: string;
  goal: "create_cooperative" | "join_cooperative" | "sell_individual";
  completedAt: string;
}

export interface OnboardingCooperativa {
  cooperativeId: string;
  name: string;
  description: string;
  products: string[];
  categories: string[];
  productionCapacity: string;
  region: string;
  certifications: string[];
  foundingMembers: string[];
  completedAt: string;
}

export interface OnboardingEmpresa {
  empresaId: string;
  companyName: string;
  rfc: string;
  productsNeeded: string[];
  categories: string[];
  purchaseVolume: string;
  purchaseFrequency: string;
  budget: string;
  requirements: string[];
  region: string;
  completedAt: string;
}

// ===========================
// SUBSCRIPTION & PLANS
// ===========================

export type PlanType = "Free" | "Premium" | "Plus";

export interface PlanFeatures {
  maxProducts: number;
  maxCustomers: number;
  maxSalesPerMonth: number;
  advancedReports: boolean;
  apiAccess: boolean;
  multiUser: boolean;
  emailSupport: boolean;
  prioritySupport: boolean;
}

export interface Subscription {
  id: string;
  companyId: string;
  planType: PlanType;
  status: "active" | "trial" | "expired" | "cancelled";
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  autoRenew: boolean;
  paymentMethod?: string;
  features: PlanFeatures;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  Free: {
    maxProducts: 50,
    maxCustomers: 20,
    maxSalesPerMonth: 100,
    advancedReports: false,
    apiAccess: false,
    multiUser: false,
    emailSupport: false,
    prioritySupport: false,
  },
  Premium: {
    maxProducts: 500,
    maxCustomers: 200,
    maxSalesPerMonth: 1000,
    advancedReports: true,
    apiAccess: false,
    multiUser: true,
    emailSupport: true,
    prioritySupport: false,
  },
  Plus: {
    maxProducts: -1, // Ilimitado
    maxCustomers: -1,
    maxSalesPerMonth: -1,
    advancedReports: true,
    apiAccess: true,
    multiUser: true,
    emailSupport: true,
    prioritySupport: true,
  },
};

export const PLAN_PRICES: Record<PlanType, { monthly: number; yearly: number }> = {
  Free: { monthly: 0, yearly: 0 },
  Premium: { monthly: 299, yearly: 2990 },
  Plus: { monthly: 599, yearly: 5990 },
};
