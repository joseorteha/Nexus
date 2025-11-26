// 🚀 DASHBOARD LAYOUT
// Layout principal de la aplicación con Sidebar y Navbar

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">Nexus</h2>
        </div>
        <nav className="mt-6">
          <a href="/dashboard" className="block px-6 py-3 text-gray-700 hover:bg-blue-50">
            🏠 Dashboard
          </a>
          <a href="/dashboard/marketplace" className="block px-6 py-3 text-gray-700 hover:bg-blue-50">
            🛒 Marketplace
          </a>
          <a href="/dashboard/match" className="block px-6 py-3 text-gray-700 hover:bg-blue-50">
            💘 Match
          </a>
          <a href="/dashboard/profile" className="block px-6 py-3 text-gray-700 hover:bg-blue-50">
            👤 Perfil
          </a>
          <a href="/dashboard/erp" className="block px-6 py-3 text-gray-700 hover:bg-blue-50">
            📊 ERP
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
