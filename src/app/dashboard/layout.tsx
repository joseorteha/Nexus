"use client";

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 p-8 bg-gray-50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
