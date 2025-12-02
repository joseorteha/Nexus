"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Settings, Database, Shield, Bell, Mail, Globe } from "lucide-react";

export default function ConfiguracionAdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-gray-600" />
            Configuración del Sistema
          </h1>
          <p className="text-gray-600">Administra la configuración general</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base de Datos */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Base de Datos</h3>
                <p className="text-sm text-gray-600">Gestión de datos</p>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                <p className="font-semibold text-gray-900">Respaldos</p>
                <p className="text-sm text-gray-600">Crear y restaurar backups</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                <p className="font-semibold text-gray-900">Migraciones</p>
                <p className="text-sm text-gray-600">Ver historial de cambios</p>
              </button>
            </div>
          </div>

          {/* Seguridad */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Seguridad</h3>
                <p className="text-sm text-gray-600">Protección del sistema</p>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                <p className="font-semibold text-gray-900">RLS Policies</p>
                <p className="text-sm text-gray-600">Gestionar permisos</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                <p className="font-semibold text-gray-900">Logs de Acceso</p>
                <p className="text-sm text-gray-600">Ver actividad del sistema</p>
              </button>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Notificaciones</h3>
                <p className="text-sm text-gray-600">Alertas del sistema</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900">Email</p>
                  <input type="checkbox" className="toggle" />
                </div>
                <p className="text-sm text-gray-600">Notificaciones por correo</p>
              </div>
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900">Push</p>
                  <input type="checkbox" className="toggle" />
                </div>
                <p className="text-sm text-gray-600">Notificaciones push</p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Email</h3>
                <p className="text-sm text-gray-600">Configuración SMTP</p>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                <p className="font-semibold text-gray-900">Servidor SMTP</p>
                <p className="text-sm text-gray-600">Configurar envío de emails</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                <p className="font-semibold text-gray-900">Plantillas</p>
                <p className="text-sm text-gray-600">Editar templates de email</p>
              </button>
            </div>
          </div>

          {/* Sistema */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Sistema</h3>
                <p className="text-sm text-gray-600">Configuración general</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">Versión</p>
                <p className="text-sm text-gray-600">v1.0.0</p>
              </div>
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">Entorno</p>
                <p className="text-sm text-gray-600">Desarrollo</p>
              </div>
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">Framework</p>
                <p className="text-sm text-gray-600">Next.js 16</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">⚙️ Configuración Avanzada</h3>
          <p className="text-gray-600 mb-4">
            Estas configuraciones afectan el funcionamiento global del sistema. Realiza cambios con precaución.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Acceder a Configuración Avanzada
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}



