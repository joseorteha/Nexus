"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Building2, Mail, Lock, Phone, FileText, MapPin } from "lucide-react";

export default function RegisterEmpresaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const form = new FormData(e.currentTarget);

    // Datos del representante
    const nombre = form.get("nombre") as string;
    const apellidos = form.get("apellidos") as string;
    const telefono = form.get("telefono") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    // Datos de la empresa
    const razonSocial = form.get("razon_social") as string;
    const rfc = form.get("rfc") as string;
    const sector = form.get("sector") as string;
    const direccion = form.get("direccion") as string;

    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
            apellidos,
            telefono,
            rol: "normal_user",
            tipo_usuario: "empresa",
          },
          emailRedirectTo: `${window.location.origin}/auth/onboarding`,
        },
      });

      if (authError) {
        setErrorMsg(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setErrorMsg("Error al crear el usuario");
        setLoading(false);
        return;
      }

      // 2. Esperar un momento para que el trigger cree el usuario
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Verificar y actualizar/crear en tabla usuarios
      const { data: existingUser } = await supabase
        .from("usuarios")
        .select("id, tipo_usuario")
        .eq("id", authData.user.id)
        .single();

      if (existingUser) {
        // Si ya existe, actualizar a tipo empresa
        const { error: updateError } = await supabase
          .from("usuarios")
          .update({
            nombre,
            apellidos,
            telefono,
            tipo_usuario: "empresa",
            onboarding_completed: false,
          })
          .eq("id", authData.user.id);

        if (updateError) {
          console.error("Error al actualizar usuario:", updateError);
        }
      } else {
        // Si no existe, crear
        const { error: insertError } = await supabase
          .from("usuarios")
          .insert({
            id: authData.user.id,
            nombre,
            apellidos,
            telefono,
            rol: "normal_user",
            tipo_usuario: "empresa",
            onboarding_completed: false,
          });

        if (insertError) {
          console.error("Error al crear perfil:", insertError);
          setErrorMsg("Error al crear perfil de usuario");
          setLoading(false);
          return;
        }
      }

      // 4. Insertar datos de la empresa
      const { error: empresaError } = await supabase.from("empresas").insert({
        user_id: authData.user.id,
        razon_social: razonSocial,
        rfc: rfc.toUpperCase(),
        sector,
        telefono,
        direccion,
      });

      if (empresaError) {
        console.error("Error al crear empresa:", empresaError);
        setErrorMsg("Error al registrar datos de la empresa");
        setLoading(false);
        return;
      }

      // 5. Redirigir al onboarding para completar datos adicionales
      alert(
        "¡Registro exitoso! Por favor completa tu perfil de empresa."
      );
      router.push("/auth/onboarding");
    } catch (error) {
      console.error("Error en registro:", error);
      setErrorMsg("Error al registrar. Por favor intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registro de Empresa
          </h1>
          <p className="text-gray-600">
            Únete a Nexus y conecta con productores locales
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sección: Datos de la Empresa */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Datos de la Empresa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón Social *
                  </label>
                  <input
                    type="text"
                    name="razon_social"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Mi Empresa S.A. de C.V."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RFC *
                  </label>
                  <input
                    type="text"
                    name="rfc"
                    required
                    maxLength={13}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                    placeholder="ABC123456XYZ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Sector/Giro
                  </label>
                  <select
                    name="sector"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un sector</option>
                    <option value="Alimentos y Bebidas">Alimentos y Bebidas</option>
                    <option value="Retail">Retail/Comercio</option>
                    <option value="Restaurantes">Restaurantes</option>
                    <option value="Hoteles">Hoteles y Turismo</option>
                    <option value="Distribución">Distribución</option>
                    <option value="Manufactura">Manufactura</option>
                    <option value="Exportación">Exportación</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Calle, número, colonia, ciudad"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Datos del Representante */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Datos del Representante
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Juan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pérez García"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5512345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contacto@empresa.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/auth/register")}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? "Registrando..." : "Registrar Empresa"}
              </button>
            </div>
          </form>

          {/* Link alternativo */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <a
                href="/auth/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
