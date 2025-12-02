
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  bio?: string;
  role?: string;
  avatar_url?: string;
};

export default function Page() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    // Cargar perfil existente (si existe endpoint `/api/perfil`)
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/perfil");
        if (!res.ok) return; // si no existe, ignorar
        const data = await res.json();
        if (mounted) {
          setProfile(data);
          if (data?.avatar_url) setPreview(data.avatar_url);
        }
      } catch {
        // silenciar error de fetch si no hay endpoint
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return setPreview(profile?.avatar_url ?? null);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const form = formRef.current;
      if (!form) throw new Error("Formulario no encontrado");
      const formData = new FormData(form);

      const res = await fetch("/api/perfil/update", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al guardar perfil");
      }

      // Enviar exitoso: redirigir
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err ?? "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Editar Perfil</h1>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4"
      >
        <div>
          <label className="block text-gray-700 font-medium">Nombre</label>
          <input
            type="text"
            name="nombre"
            defaultValue={profile?.nombre ?? ""}
            required
            className="w-full text-slate-600 mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            defaultValue={profile?.apellidos ?? ""}
            className="w-full text-slate-600 mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            defaultValue={profile?.telefono ?? ""}
            className="w-full text-slate-600 mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Biografía</label>
          <textarea
            name="bio"
            rows={3}
            defaultValue={profile?.bio ?? ""}
            className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Rol</label>
          <select
            name="role"
            defaultValue={profile?.role ?? "usuario"}
            className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="usuario">Usuario</option>
            <option value="vendedor">Vendedor</option>
            <option value="agencia">Agencia</option>
            <option value="organizacion">Organización</option>
            <option value="guia">Guía</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Foto de perfil</label>
          {preview && (
            <img src={preview} alt="Avatar" className="w-16 h-16 rounded-full mb-2 object-cover" />
          )}
          <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} />
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
          <a
            href="/dashboard"
            className="flex-1 py-2 text-center bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
          >
            Cancelar
          </a>
        </div>
      </form>
    </main>
  );
}



