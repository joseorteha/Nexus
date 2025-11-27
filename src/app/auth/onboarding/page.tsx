"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";
import { OnboardingUsuarioNormal } from "@/components/onboarding/OnboardingUsuarioNormal";
import { OnboardingCooperativa } from "@/components/onboarding/OnboardingCooperativa";
import { OnboardingEmpresa } from "@/components/onboarding/OnboardingEmpresa";
import type { UserRole, OnboardingUsuarioNormal as OnboardingNormalData, OnboardingCooperativa as OnboardingCoopData, OnboardingEmpresa as OnboardingEmpresaData } from "@/types/nexus";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    checkUserAndRole();
  }, []);

  async function checkUserAndRole() {
    try {
      console.log("🔍 Verificando usuario y rol...");
      
      // Obtener usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Error al obtener usuario:", userError);
        router.push("/auth/login");
        return;
      }

      console.log("✅ Usuario autenticado:", user.email);

      // Verificar si ya completó onboarding (usando tabla usuarios)
      const { data: userData, error: userDataError } = await supabase
        .from("usuarios")
        .select("onboarding_completed, tipo_usuario, nombre, apellidos")
        .eq("id", user.id)
        .single();

      if (userDataError) {
        console.error("❌ Error al obtener datos de usuario:", userDataError);
        // Si no existe en tabla usuarios, podría ser usuario recién creado
        if (userDataError.code === 'PGRST116') {
          console.log("⚠️ Usuario no encontrado en tabla usuarios, creando entrada...");
          // Intentar crear entrada en tabla usuarios
          const { error: insertError } = await supabase
            .from("usuarios")
            .insert({
              id: user.id,
              nombre: user.user_metadata?.nombre || "",
              apellidos: user.user_metadata?.apellidos || "",
              telefono: user.user_metadata?.telefono || "",
              avatar_url: user.user_metadata?.avatar_url || null,
              rol: "normal_user",
              tipo_usuario: user.user_metadata?.tipo_usuario || "normal",
              onboarding_completed: false,
              onboarding_skipped: false,
            });

          if (insertError) {
            console.error("❌ Error al crear usuario:", insertError);
            alert("Error al configurar tu cuenta. Por favor contacta soporte.");
            return;
          }

          console.log("✅ Entrada de usuario creada exitosamente");
          // Recargar para obtener datos frescos
          window.location.reload();
          return;
        }
      }

      // Si ya completó onboarding, redirigir al dashboard
      if (userData?.onboarding_completed) {
        console.log("✅ Onboarding ya completado, redirigiendo a dashboard...");
        router.push("/dashboard");
        return;
      }

      // Obtener rol del usuario (puede venir de user.user_metadata o de la tabla usuarios)
      const role = userData?.tipo_usuario || user.user_metadata?.tipo_usuario || "normal";
      
      console.log("✅ Rol detectado:", role);

      setUserRole(role as UserRole);
      setUserId(user.id);
      setUserName(`${userData?.nombre || ""} ${userData?.apellidos || ""}`.trim() || user.email?.split("@")[0] || "Usuario");
      setUserEmail(user.email || "");
      setLoading(false);

      console.log("✅ Estado inicializado correctamente");

    } catch (error) {
      console.error("❌ Error en checkUserAndRole:", error);
      router.push("/auth/login");
    }
  }

  async function handleSkipOnboarding() {
    // ELIMINADA: Esta función ya no se usa
    // Los usuarios pueden omitir PASOS individuales dentro del wizard
    // pero deben completar el onboarding con campos mínimos obligatorios
  }

  async function handleOnboardingComplete(data: OnboardingNormalData | OnboardingCoopData | OnboardingEmpresaData) {
    try {
      setLoading(true);
      console.log("💾 Guardando datos de onboarding...", { userRole, data });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay usuario autenticado");

      // Array para trackear campos omitidos
      const camposOmitidos: string[] = [];

      // Guardar datos de onboarding en la tabla correspondiente
      if (userRole === "normal") {
        const normalData = data as OnboardingNormalData;
        
        console.log("📝 Insertando en onboarding_normal...");

        // Trackear campos omitidos
        if (!normalData.productionCapacity) camposOmitidos.push("capacidad_produccion");
        if (!normalData.region) camposOmitidos.push("region");
        if (!normalData.goal) camposOmitidos.push("objetivo");
        
        // Guardar en tabla onboarding_normal (columnas en español)
        // Campos opcionales pueden ser null si el usuario los omitió
        const { error: onboardingError } = await supabase
          .from("onboarding_normal")
          .insert({
            user_id: user.id,
            productos: normalData.products,
            categorias: normalData.categories,
            capacidad_produccion: normalData.productionCapacity || null, // OPCIONAL
            region: normalData.region || null, // OPCIONAL
            objetivo: normalData.goal ? 
              (normalData.goal === "create_cooperative" ? "crear_cooperativa" :
               normalData.goal === "join_cooperative" ? "unirse_cooperativa" : 
               "vender_individual") : null // OPCIONAL
          });

        if (onboardingError) {
          console.error("❌ Error al guardar onboarding_normal:", onboardingError);
          throw onboardingError;
        }

        console.log("✅ Datos guardados en onboarding_normal");

        // Si el objetivo es crear cooperativa, crear solicitud
        if (normalData.goal === "create_cooperative") {
          console.log("🏢 Objetivo: crear cooperativa, redirigiendo...");
          
          // Marcar onboarding como completado primero
          await supabase
            .from("usuarios")
            .update({
              onboarding_completed: true,
              onboarding_skipped: false,
              onboarding_completed_at: new Date().toISOString()
            })
            .eq("id", user.id);

          alert("¡Perfil completado! Ahora completa la solicitud para crear tu cooperativa.");
          router.push("/dashboard/cooperativas/crear");
          return;
        }

      } else if (userRole === "cooperativa") {
        const coopData = data as OnboardingCoopData;
        
        console.log("🏢 Creando solicitud de cooperativa...");

        // Trackear campos omitidos
        if (!coopData.productionCapacity) camposOmitidos.push("capacidad_produccion");
        if (!coopData.region) camposOmitidos.push("region");
        if (!coopData.certifications || coopData.certifications.length === 0) camposOmitidos.push("certificaciones");
        
        // Crear solicitud de creación de cooperativa (nombres en español)
        const { error: requestError } = await supabase
          .from("solicitudes_cooperativas")
          .insert({
            tipo: "crear",
            user_id: user.id,
            nombre_usuario: userName,
            email_usuario: userEmail,
            nombre_cooperativa: coopData.name,
            datos_cooperativa: coopData,
            estado: "pendiente"
          });

        if (requestError) {
          console.error("❌ Error al crear solicitud:", requestError);
          throw requestError;
        }

        console.log("✅ Solicitud de cooperativa creada");

        // Mostrar mensaje de espera
        alert("Tu solicitud de crear cooperativa ha sido enviada. Un administrador la revisará pronto.");

      } else if (userRole === "empresa") {
        const empresaData = data as OnboardingEmpresaData;
        
        console.log("📝 Insertando en onboarding_empresa...");

        // Trackear campos omitidos
        if (!empresaData.purchaseVolume) camposOmitidos.push("volumen_compra");
        if (!empresaData.purchaseFrequency) camposOmitidos.push("frecuencia_compra");
        if (!empresaData.budget) camposOmitidos.push("presupuesto");
        if (!empresaData.requirements || empresaData.requirements.length === 0) camposOmitidos.push("requisitos");
        if (!empresaData.region) camposOmitidos.push("region");
        
        // Guardar en tabla onboarding_empresa (columnas en español)
        // Campos opcionales pueden ser null si el usuario los omitió
        const { error: onboardingError } = await supabase
          .from("onboarding_empresa")
          .insert({
            user_id: user.id,
            nombre_empresa: empresaData.companyName,
            rfc: empresaData.rfc,
            productos_necesitados: empresaData.productsNeeded,
            categorias: empresaData.categories,
            volumen_compra: empresaData.purchaseVolume || null, // OPCIONAL
            frecuencia_compra: empresaData.purchaseFrequency || null, // OPCIONAL
            presupuesto: empresaData.budget || null, // OPCIONAL
            requisitos: empresaData.requirements || null, // OPCIONAL
            region: empresaData.region || null // OPCIONAL
          });

        if (onboardingError) {
          console.error("❌ Error al guardar onboarding_empresa:", onboardingError);
          throw onboardingError;
        }

        console.log("✅ Datos guardados en onboarding_empresa");
      }

      // Si hay campos omitidos, guardar en perfil_incompleto
      if (camposOmitidos.length > 0) {
        console.log("📋 Guardando campos omitidos:", camposOmitidos);
        
        await supabase
          .from("perfil_incompleto")
          .upsert({
            user_id: user.id,
            campos_pendientes: camposOmitidos,
            ultima_actualizacion: new Date().toISOString()
          });
      }

      // Marcar onboarding como completado (tabla usuarios)
      console.log("✅ Marcando onboarding como completado...");
      
      const { error: updateError } = await supabase
        .from("usuarios")
        .update({
          onboarding_completed: true,
          onboarding_skipped: false,
          onboarding_completed_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("❌ Error al actualizar usuario:", updateError);
        throw updateError;
      }

      console.log("✅ Onboarding completado exitosamente!");

      // Mostrar mensaje diferente si hay campos pendientes
      if (camposOmitidos.length > 0) {
        alert(`¡Perfil completado! Puedes completar los campos opcionales más tarde desde tu perfil.`);
      } else {
        alert("¡Perfil completado exitosamente!");
      }
      
      router.push("/dashboard");

    } catch (error) {
      console.error("❌ Error al completar onboarding:", error);
      alert("Error al guardar tus datos. Por favor intenta de nuevo o contacta soporte.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Renderizar el onboarding correspondiente según el rol
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Componentes de onboarding (con opción de omitir pasos individuales) */}
      {userRole === "normal" && (
        <OnboardingUsuarioNormal onComplete={handleOnboardingComplete} />
      )}
      
      {userRole === "cooperativa" && (
        <OnboardingCooperativa onComplete={handleOnboardingComplete} />
      )}
      
      {userRole === "empresa" && (
        <OnboardingEmpresa onComplete={handleOnboardingComplete} />
      )}

      {!userRole && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rol no definido</h2>
            <p className="text-gray-600 mb-6">No pudimos determinar tu tipo de usuario.</p>
            <button 
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Ir al Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
