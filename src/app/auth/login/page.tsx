"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // 🔥 CUANDO EL LOGIN ES CORRECTO → Redirige al onboarding
    router.push("/auth/onboarding");
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

          <div className="mt-16 space-y-3">
            <h3 className="text-white text-3xl font-bold leading-snug">
              Bienvenido a Nexus
            </h3>
            <p className="text-slate-900">
              Inicia sesión y conéctate al ecosistema económico de tu región.
            </p>

            <div className="flex items-center -space-x-2 overflow-hidden">
              <img src="https://randomuser.me/api/portraits/women/79.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" className="w-10 h-10 rounded-full border-2 border-white" />
              <p className="text-sm text-gray-800 font-medium translate-x-5">
                Miles de usuarios ya forman parte de Nexus.
              </p>
            </div>
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
      <div className="flex-1 flex items-center justify-center h-screen bg-gray-50">
        <div className="mx-auto w-full max-w-md py-10 px-4">
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 text-gray-600">
            
            {/* Logo placeholder - reemplazar con tu logo */}
            <div className="mx-auto w-40 h-20 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">NEXUS</span>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold">Iniciar Sesión</h3>

              <p>
                ¿Aún no tienes una cuenta?
                <a href="/auth/register" className="font-medium text-primary hover:text-primary-hover">
                  {" "}Regístrate ahora
                </a>
              </p>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm">{errorMsg}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-medium">Correo</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full mt-2 px-3 py-2 border rounded-lg focus:border-primary"
                />
              </div>

              <div>
                <label className="font-medium">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full mt-2 px-3 py-2 border rounded-lg focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-white bg-primary rounded-lg hover:bg-primary-hover"
              >
                {loading ? "Cargando..." : "Iniciar sesión"}
              </button>
            </form>

          </div>
        </div>
      </div>
    </main>
  );
}



