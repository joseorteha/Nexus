"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const nombre = form.get("nombre") as string;
    const apellidos = form.get("apellidos") as string;
    const telefono = form.get("telefono") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const avatarFile = form.get("avatar") as File;

    // ------------------------------
    // 1. Subir avatar opcional
    // ------------------------------
    let avatar_url = null;

    if (avatarFile && avatarFile.size > 0) {
const fileName = `profile/${Date.now()}-${avatarFile.name}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatarFile);

  if (uploadError) {
    alert("Error subiendo imagen de perfil");
    setLoading(false);
    return;
  }

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(uploadData.path);

  avatar_url = urlData.publicUrl;
}


    // ------------------------------
    // 2. Crear usuario en Supabase Auth
    // ------------------------------
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          apellidos,
          telefono,
          avatar_url,
          rol: "normal_user",
          tipo_usuario: "normal"
        },
        emailRedirectTo: `${window.location.origin}/auth/onboarding`
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // ------------------------------
    // 3. Crear entrada en tabla usuarios
    // ------------------------------
    if (authData.user) {
      // Verificar si ya existe el usuario
      const { data: existingUser } = await supabase
        .from("usuarios")
        .select("id")
        .eq("id", authData.user.id)
        .single();

      // Si ya existe, solo redirigir
      if (existingUser) {
        console.log("Usuario ya existe en la tabla, redirigiendo...");
        alert("¡Bienvenido de vuelta! Completa tu perfil.");
        window.location.href = "/auth/onboarding";
        setLoading(false);
        return;
      }

      // Si no existe, crear nuevo registro
      const { error: insertError } = await supabase
        .from("usuarios")
        .insert({
          id: authData.user.id,
          nombre,
          apellidos,
          telefono,
          avatar_url,
          rol: "normal_user",
          tipo_usuario: "normal",
          onboarding_completed: false,
          onboarding_skipped: false,
        });

      if (insertError) {
        // Si es error de duplicado, ignorar y continuar
        if (insertError.code === "23505") {
          console.log("Usuario ya existía, continuando...");
        } else {
          console.error("Error al crear perfil:", insertError);
          alert("Error al crear perfil. Por favor contacta soporte.");
          setLoading(false);
          return;
        }
      }

      // Redirigir a onboarding
      alert("¡Cuenta creada exitosamente! Ahora completa tu perfil.");
      window.location.href = "/auth/onboarding";
    } else {
      alert("Cuenta creada. Revisa tu correo para confirmarla.");
    }
    
    setLoading(false);
  }

  return (
    <main className="w-full flex">
      {/* IZQUIERDA */}
      <div className="relative flex-1 hidden lg:flex items-center justify-center h-screen bg-primary px-20 overflow-hidden">
        <div className="relative z-10 w-full max-w-md">
          {/* Logo lateral - reemplazar con tu logo */}
          <div className="mb-8 w-40 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">NEXUS</span>
          </div>

          <h3 className="text-white text-3xl font-bold leading-snug">
            Bienvenido a Nexus
          </h3>

          <p className="mt-3 text-slate-800 font-medium">
            Digitaliza tu potencial y conéctate con el ecosistema económico de tu región.
          </p>

          <div className="flex items-center -space-x-2 overflow-hidden mt-4">
            <img src="https://randomuser.me/api/portraits/women/79.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
            <img src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" className="w-10 h-10 rounded-full border-2 border-white" />
            <img src="https://randomuser.me/api/portraits/men/86.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
            <img src="https://images.unsplash.com/photo-1510227272981-87123e259b17" className="w-10 h-10 rounded-full border-2 border-white" />
            <p className="text-sm text-gray-800 font-medium translate-x-5">
              Más de 5,000 usuarios ya forman parte del ecosistema Nexus.
            </p>
          </div>
        </div>

        <div
          className="absolute inset-0 my-auto h-[500px]"
          style={{
            background:
              "linear-gradient(152.92deg,rgba(6,182,212,0.25) 4.54%,rgba(59,130,246,0.26) 34.2%,rgba(14,165,233,0.18) 77.55%)",
            filter: "blur(118px)",
          }}
        ></div>
      </div>

      {/* DERECHA */}
      <div className="flex-1 h-screen overflow-y-auto bg-gray-50">
        <div className="mx-auto w-full max-w-md py-10 px-4">
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 text-gray-600">
            {/* Logo placeholder - reemplazar con tu logo */}
            <div className="mx-auto w-40 h-20 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">NEXUS</span>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold">Crear cuenta en Nexus</h3>

              <p className="text-sm">
                ¿Ya tienes una cuenta?
                <a href="/auth/login" className="font-medium text-primary hover:text-primary-hover">
                  {" "}Iniciar Sesión
                </a>
              </p>
            </div>

            {/* Banner Empresas */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-gray-700 text-center">
                🏢 <span className="font-semibold">¿Eres una empresa?</span>
                <a 
                  href="/auth/register/empresa" 
                  className="block mt-2 text-blue-600 font-bold hover:text-blue-700 hover:underline"
                >
                  Regístrate aquí →
                </a>
              </p>
            </div>

            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

              <div>
                <label className="font-medium text-gray-800">Nombre</label>
                <input type="text" name="nombre" placeholder="Juan Carlos" required className="w-full px-3 py-2 mt-1 border rounded-lg" />
              </div>

              <div>
                <label className="font-medium text-gray-800">Apellidos</label>
                <input type="text" name="apellidos" placeholder="Ramírez Torres" className="w-full px-3 py-2 mt-1 border rounded-lg" />
              </div>

              <div>
                <label className="font-medium text-gray-800">Teléfono</label>
                <input type="tel" name="telefono" placeholder="272 123 4567" className="w-full px-3 py-2 mt-1 border rounded-lg" />
              </div>

              <div>
                <label className="font-medium text-gray-800">Avatar</label>
                <input type="file" name="avatar" accept="image/*" className="w-full mt-1 text-sm" />
              </div>

              <div>
                <label className="font-medium text-gray-800">Correo</label>
                <input type="email" name="email" placeholder="usuario@correo.com" required className="w-full px-3 py-2 mt-1 border rounded-lg" />
              </div>

              <div>
                <label className="font-medium text-gray-800">Contraseña</label>
                <input type="password" name="password" placeholder="Crea una contraseña segura" required className="w-full px-3 py-2 mt-1 border rounded-lg" />
              </div>

              <button type="submit" disabled={loading} className="w-full py-2 text-white font-medium bg-primary hover:bg-primary-hover rounded-lg">
                {loading ? "Creando cuenta..." : "Crear Cuenta en Nexus"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
