// 📊 ERP SERVICE - Sistema de Gestión Empresarial (Simulado con JSONs)
// Este servicio maneja TODA la lógica del ERP por empresa

import type {
  InventoryItem,
  Customer,
  Supplier,
  Sale,
  Purchase,
  ERPStats,
  SaleItem,
  PurchaseItem,
} from "@/types/nexus";

// ============================================
// 📦 INVENTARIO
// ============================================

/**
 * Obtener todos los productos del inventario de una empresa
 */
export async function getInventory(companyId: string): Promise<InventoryItem[]> {
  try {
    // TODO: En producción, esto vendría de Supabase
    // Por ahora, cargamos el JSON de la empresa
    const response = await fetch(`/api/erp/inventory?companyId=${companyId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al cargar inventario:", error);
    // Fallback: cargar JSON local
    const inventoryModule = await import(`@/data/erp/company-${companyId}-inventory.json`);
    return inventoryModule.default;
  }
}

/**
 * Agregar producto al inventario
 */
export async function addInventoryItem(
  companyId: string,
  item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">
): Promise<InventoryItem> {
  const newItem: InventoryItem = {
    ...item,
    id: `inv-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // TODO: Guardar en backend/JSON
  console.log("Producto agregado:", newItem);
  return newItem;
}

/**
 * Actualizar producto del inventario
 */
export async function updateInventoryItem(
  companyId: string,
  itemId: string,
  updates: Partial<InventoryItem>
): Promise<InventoryItem> {
  // TODO: Actualizar en backend/JSON
  const updatedItem = {
    ...updates,
    id: itemId,
    updatedAt: new Date().toISOString(),
  } as InventoryItem;

  console.log("Producto actualizado:", updatedItem);
  return updatedItem;
}

/**
 * Eliminar producto del inventario
 */
export async function deleteInventoryItem(
  companyId: string,
  itemId: string
): Promise<void> {
  // TODO: Eliminar de backend/JSON
  console.log("Producto eliminado:", itemId);
}

/**
 * Obtener productos con stock bajo
 */
export async function getLowStockItems(companyId: string): Promise<InventoryItem[]> {
  const inventory = await getInventory(companyId);
  return inventory.filter((item) => item.stock <= item.minStock);
}

// ============================================
// 👥 CLIENTES
// ============================================

/**
 * Obtener todos los clientes de una empresa
 */
export async function getCustomers(companyId: string): Promise<Customer[]> {
  try {
    const customersModule = await import(`@/data/erp/company-${companyId}-customers.json`);
    return customersModule.default;
  } catch (error) {
    console.error("Error al cargar clientes:", error);
    return [];
  }
}

/**
 * Agregar cliente
 */
export async function addCustomer(
  companyId: string,
  customer: Omit<Customer, "id" | "createdAt" | "totalPurchases" | "currentDebt">
): Promise<Customer> {
  const newCustomer: Customer = {
    ...customer,
    id: `cust-${Date.now()}`,
    totalPurchases: 0,
    currentDebt: 0,
    createdAt: new Date().toISOString(),
  };

  console.log("Cliente agregado:", newCustomer);
  return newCustomer;
}

/**
 * Actualizar cliente
 */
export async function updateCustomer(
  companyId: string,
  customerId: string,
  updates: Partial<Customer>
): Promise<Customer> {
  const updatedCustomer = {
    ...updates,
    id: customerId,
  } as Customer;

  console.log("Cliente actualizado:", updatedCustomer);
  return updatedCustomer;
}

/**
 * Eliminar cliente
 */
export async function deleteCustomer(
  companyId: string,
  customerId: string
): Promise<void> {
  console.log("Cliente eliminado:", customerId);
}

// ============================================
// 👷 PROVEEDORES
// ============================================

/**
 * Obtener todos los proveedores de una empresa
 */
export async function getSuppliers(companyId: string): Promise<Supplier[]> {
  try {
    const suppliersModule = await import(`@/data/erp/company-${companyId}-suppliers.json`);
    return suppliersModule.default;
  } catch (error) {
    console.error("Error al cargar proveedores:", error);
    return [];
  }
}

/**
 * Agregar proveedor
 */
export async function addSupplier(
  companyId: string,
  supplier: Omit<Supplier, "id" | "createdAt" | "totalPurchases" | "currentDebt">
): Promise<Supplier> {
  const newSupplier: Supplier = {
    ...supplier,
    id: `supp-${Date.now()}`,
    totalPurchases: 0,
    currentDebt: 0,
    createdAt: new Date().toISOString(),
  };

  console.log("Proveedor agregado:", newSupplier);
  return newSupplier;
}

// ============================================
// 💰 VENTAS
// ============================================

/**
 * Obtener todas las ventas de una empresa
 */
export async function getSales(companyId: string): Promise<Sale[]> {
  try {
    const salesModule = await import(`@/data/erp/company-${companyId}-sales.json`);
    return salesModule.default;
  } catch (error) {
    console.error("Error al cargar ventas:", error);
    return [];
  }
}

/**
 * Crear nueva venta
 */
export async function createSale(
  companyId: string,
  customerId: string,
  customerName: string,
  items: SaleItem[],
  paymentMethod: Sale["paymentMethod"],
  paymentStatus: Sale["paymentStatus"],
  discount: number = 0,
  notes?: string,
  createdBy: string = "user-1"
): Promise<Sale> {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal - discount;

  // Obtener número de venta
  const sales = await getSales(companyId);
  const saleNumber = `VTA-${String(sales.length + 1).padStart(3, "0")}`;

  const newSale: Sale = {
    id: `sale-${Date.now()}`,
    companyId,
    saleNumber,
    customerId,
    customerName,
    saleDate: new Date().toISOString(),
    items,
    subtotal,
    discount,
    tax: 0,
    total,
    paymentMethod,
    paymentStatus,
    notes: notes || "",
    createdAt: new Date().toISOString(),
    createdBy,
  };

  console.log("Venta creada:", newSale);

  // TODO: Actualizar stock del inventario
  // TODO: Actualizar deuda del cliente si es a crédito

  return newSale;
}

/**
 * Obtener ventas por período
 */
export async function getSalesByPeriod(
  companyId: string,
  startDate: Date,
  endDate: Date
): Promise<Sale[]> {
  const sales = await getSales(companyId);
  return sales.filter((sale) => {
    const saleDate = new Date(sale.saleDate);
    return saleDate >= startDate && saleDate <= endDate;
  });
}

// ============================================
// 🛒 COMPRAS
// ============================================

/**
 * Obtener todas las compras de una empresa
 */
export async function getPurchases(companyId: string): Promise<Purchase[]> {
  try {
    const purchasesModule = await import(`@/data/erp/company-${companyId}-purchases.json`);
    return purchasesModule.default;
  } catch (error) {
    console.error("Error al cargar compras:", error);
    return [];
  }
}

/**
 * Crear nueva compra
 */
export async function createPurchase(
  companyId: string,
  supplierId: string,
  supplierName: string,
  items: PurchaseItem[],
  paymentStatus: Purchase["paymentStatus"],
  dueDate?: string,
  notes?: string,
  createdBy: string = "user-1"
): Promise<Purchase> {
  const total = items.reduce((sum, item) => sum + item.total, 0);

  // Obtener número de compra
  const purchases = await getPurchases(companyId);
  const purchaseNumber = `CMP-${String(purchases.length + 1).padStart(3, "0")}`;

  const newPurchase: Purchase = {
    id: `purch-${Date.now()}`,
    companyId,
    purchaseNumber,
    supplierId,
    supplierName,
    purchaseDate: new Date().toISOString(),
    items,
    total,
    paymentStatus,
    dueDate,
    notes: notes || "",
    createdAt: new Date().toISOString(),
    createdBy,
  };

  console.log("Compra creada:", newPurchase);

  // TODO: Actualizar stock del inventario
  // TODO: Actualizar deuda con proveedor

  return newPurchase;
}

// ============================================
// 📊 ESTADÍSTICAS (Dashboard)
// ============================================

/**
 * Obtener estadísticas del ERP
 */
export async function getERPStats(
  companyId: string,
  period: ERPStats["period"] = "month"
): Promise<ERPStats> {
  const [inventory, sales, purchases, customers, suppliers] = await Promise.all([
    getInventory(companyId),
    getSales(companyId),
    getPurchases(companyId),
    getCustomers(companyId),
    getSuppliers(companyId),
  ]);

  // Calcular fechas según período
  const now = new Date();
  let startDate: Date;
  
  switch (period) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "week":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "month":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "year":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
  }

  // Filtrar ventas y compras por período
  const periodSales = sales.filter(
    (sale) => new Date(sale.saleDate) >= startDate
  );
  const periodPurchases = purchases.filter(
    (purchase) => new Date(purchase.purchaseDate) >= startDate
  );

  // Calcular totales
  const totalSales = periodSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalPurchases = periodPurchases.reduce((sum, purchase) => sum + purchase.total, 0);
  const inventoryValue = inventory.reduce(
    (sum, item) => sum + item.stock * item.salePrice,
    0
  );
  const lowStockItems = inventory.filter((item) => item.stock <= item.minStock).length;
  
  const pendingPayments = sales
    .filter((sale) => sale.paymentStatus === "Pendiente" || sale.paymentStatus === "Parcial")
    .reduce((sum, sale) => sum + sale.total, 0);
    
  const pendingDebts = purchases
    .filter((purchase) => purchase.paymentStatus === "Pendiente" || purchase.paymentStatus === "Parcial")
    .reduce((sum, purchase) => sum + purchase.total, 0);

  return {
    companyId,
    period,
    totalSales,
    salesCount: periodSales.length,
    totalPurchases,
    purchasesCount: periodPurchases.length,
    inventoryValue,
    lowStockItems,
    totalCustomers: customers.length,
    totalSuppliers: suppliers.length,
    pendingPayments,
    pendingDebts,
  };
}

/**
 * Obtener productos más vendidos
 */
export async function getTopSellingProducts(
  companyId: string,
  limit: number = 5
): Promise<Array<{ productName: string; quantity: number; revenue: number }>> {
  const sales = await getSales(companyId);
  
  const productStats = new Map<string, { quantity: number; revenue: number }>();
  
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      const existing = productStats.get(item.productName) || { quantity: 0, revenue: 0 };
      productStats.set(item.productName, {
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + item.total,
      });
    });
  });
  
  return Array.from(productStats.entries())
    .map(([productName, stats]) => ({ productName, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}



