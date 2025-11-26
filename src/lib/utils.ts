// 🛠️ FUNCIONES UTILITARIAS
// Funciones de ayuda reutilizables en toda la aplicación

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Función para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear fecha
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Formatear moneda
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}
