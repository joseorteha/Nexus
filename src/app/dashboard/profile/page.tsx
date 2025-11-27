"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Building2, Mail, Phone, MapPin, Calendar, FileText, User } from "lucide-react";
import { TipoUsuario } from "@/lib/permissions";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("normal");
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Cargar datos base del usuario
      const { data: userData } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", user.id)
        .single();

      setTipoUsuario(userData?.tipo_usuario || "normal");

      // Cargar datos específicos según tipo
      if (userData?.tipo_usuario === "empresa") {
        const { data: empresaData } = await supabase
          .from("empresas")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setProfileData({
          ...userData,
          empresa: empresaData,
          email: user.email,
        });
      } else if (userData?.tipo_usuario === "cooperativa") {
        const { data: coopData } = await supabase
          .from("cooperativas")
          .select("*")
          .eq("creada_por", user.id)
          .single();

        setProfileData({
          ...userData,
          cooperativa: coopData,
          email: user.email,
        });
      } else {
        setProfileData({
          ...userData,
          email: user.email,
        });
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl mb-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            {tipoUsuario === "empresa" ? (
              <Building2 className="w-12 h-12" />
            ) : (
              <User className="w-12 h-12" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {tipoUsuario === "empresa"
                ? profileData?.empresa?.razon_social
                : tipoUsuario === "cooperativa"
                ? profileData?.cooperativa?.nombre
                : `${profileData?.nombre} ${profileData?.apellidos}`}
            </h1>
            <p className="text-cyan-100 mb-4">
              {tipoUsuario === "empresa"
                ? "Empresa"
                : tipoUsuario === "cooperativa"
                ? "Cooperativa"
                : "Usuario Normal"}
            </p>
            <div className="flex gap-4">
              <a
                href="/dashboard/profile/editar"
                className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Editar Perfil
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Información según tipo de usuario */}
      {tipoUsuario === "empresa" && profileData?.empresa && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de la Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              icon={<Building2 className="w-5 h-5" />}
              label="Razón Social"
              value={profileData.empresa.razon_social}
            />
            <InfoItem
              icon={<FileText className="w-5 h-5" />}
              label="RFC"
              value={profileData.empresa.rfc}
            />
            <InfoItem
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value={profileData.email}
            />
            <InfoItem
              icon={<Phone className="w-5 h-5" />}
              label="Teléfono"
              value={profileData.empresa.telefono || "No especificado"}
            />
            <InfoItem
              icon={<FileText className="w-5 h-5" />}
              label="Sector"
              value={profileData.empresa.sector || "No especificado"}
            />
            <InfoItem
              icon={<MapPin className="w-5 h-5" />}
              label="Dirección"
              value={profileData.empresa.direccion || "No especificada"}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Representante Legal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                icon={<User className="w-5 h-5" />}
                label="Nombre"
                value={`${profileData.nombre} ${profileData.apellidos}`}
              />
              <InfoItem
                icon={<Phone className="w-5 h-5" />}
                label="Teléfono"
                value={profileData.telefono || "No especificado"}
              />
            </div>
          </div>
        </div>
      )}

      {tipoUsuario === "normal" && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              icon={<User className="w-5 h-5" />}
              label="Nombre"
              value={`${profileData?.nombre} ${profileData?.apellidos}`}
            />
            <InfoItem
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value={profileData?.email}
            />
            <InfoItem
              icon={<Phone className="w-5 h-5" />}
              label="Teléfono"
              value={profileData?.telefono || "No especificado"}
            />
            <InfoItem
              icon={<Calendar className="w-5 h-5" />}
              label="Miembro desde"
              value={new Date(profileData?.created_at).toLocaleDateString()}
            />
          </div>
        </div>
      )}

      {tipoUsuario === "cooperativa" && profileData?.cooperativa && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de la Cooperativa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              icon={<Building2 className="w-5 h-5" />}
              label="Nombre"
              value={profileData.cooperativa.nombre}
            />
            <InfoItem
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value={profileData.email}
            />
            <InfoItem
              icon={<MapPin className="w-5 h-5" />}
              label="Región"
              value={profileData.cooperativa.region || "No especificada"}
            />
            <InfoItem
              icon={<Calendar className="w-5 h-5" />}
              label="Fecha de creación"
              value={new Date(profileData.cooperativa.fecha_creacion).toLocaleDateString()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
