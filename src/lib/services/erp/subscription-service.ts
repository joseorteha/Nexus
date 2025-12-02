// src/lib/services/erp/subscription-service.ts
// Servicio para gestionar suscripciones y planes del ERP

import type { Subscription, PlanType, PLAN_FEATURES } from "@/types/nexus";

/**
 * Obtiene la suscripción activa de una empresa
 */
export async function getSubscription(companyId: string): Promise<Subscription> {
  try {
    const data = await import(`@/data/erp/company-${companyId}-subscription.json`);
    return data.default;
  } catch (error) {
    console.error("Error cargando suscripción:", error);
    // Si no existe, devuelve plan Free por defecto
    return {
      id: `sub-${companyId}`,
      companyId,
      planType: "Free",
      status: "active",
      startDate: new Date().toISOString(),
      autoRenew: false,
      features: {
        maxProducts: 50,
        maxCustomers: 20,
        maxSalesPerMonth: 100,
        advancedReports: false,
        apiAccess: false,
        multiUser: false,
        emailSupport: false,
        prioritySupport: false,
      },
    };
  }
}

/**
 * Verifica si una suscripción está en período de prueba activo
 */
export function isTrialActive(subscription: Subscription): boolean {
  if (subscription.status !== "trial" || !subscription.trialEndDate) {
    return false;
  }
  return new Date(subscription.trialEndDate) > new Date();
}

/**
 * Calcula los días restantes de prueba
 */
export function getTrialDaysRemaining(subscription: Subscription): number {
  if (!subscription.trialEndDate) return 0;
  
  const now = new Date();
  const trialEnd = new Date(subscription.trialEndDate);
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Verifica si una acción está permitida según el plan actual
 */
export function isFeatureAllowed(
  subscription: Subscription,
  feature: keyof typeof PLAN_FEATURES.Free
): boolean {
  const featureValue = subscription.features[feature];
  
  // Si es un booleano, devuelve directamente
  if (typeof featureValue === "boolean") {
    return featureValue;
  }
  
  // Si es un número, -1 significa ilimitado
  if (typeof featureValue === "number") {
    return featureValue === -1 || featureValue > 0;
  }
  
  return false;
}

/**
 * Verifica si se puede agregar más de un recurso (productos, clientes, etc.)
 */
export function canAddMore(
  subscription: Subscription,
  resourceType: "products" | "customers" | "sales",
  currentCount: number
): { allowed: boolean; reason?: string } {
  const features = subscription.features;
  
  let limit: number;
  let resourceName: string;
  
  switch (resourceType) {
    case "products":
      limit = features.maxProducts;
      resourceName = "productos";
      break;
    case "customers":
      limit = features.maxCustomers;
      resourceName = "clientes";
      break;
    case "sales":
      limit = features.maxSalesPerMonth;
      resourceName = "ventas";
      break;
  }
  
  // -1 significa ilimitado
  if (limit === -1) {
    return { allowed: true };
  }
  
  if (currentCount >= limit) {
    return {
      allowed: false,
      reason: `Has alcanzado el límite de ${limit} ${resourceName} de tu plan ${subscription.planType}. Actualiza para continuar.`,
    };
  }
  
  return { allowed: true };
}

/**
 * Obtiene el mensaje de upgrade apropiado según la feature bloqueada
 */
export function getUpgradeMessage(feature: string, currentPlan: PlanType): string {
  const messages: Record<string, string> = {
    advancedReports: "Los reportes avanzados están disponibles en Premium y Plus",
    apiAccess: "El acceso API está disponible solo en el plan Plus",
    multiUser: "Múltiples usuarios están disponibles en Premium y Plus",
    prioritySupport: "Soporte prioritario está disponible solo en el plan Plus",
  };
  
  return messages[feature] || `Esta función requiere actualizar tu plan ${currentPlan}`;
}



