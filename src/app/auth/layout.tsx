import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexus - Autenticación",
  description: "Inicia sesión o regístrate en Nexus",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
