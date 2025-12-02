// Utility para debugging de onboarding
import { supabase } from "@/app/lib/supabase/client";

export async function checkOnboardingStatus(userId: string) {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("onboarding_completed, onboarding_skipped, tipo_usuario, nombre, apellidos")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("❌ Error al verificar onboarding:", error);
      return null;
    }

    console.log("✅ Status de onboarding:", {
      userId,
      nombre: data.nombre,
      tipo_usuario: data.tipo_usuario,
      onboarding_completed: data.onboarding_completed,
      onboarding_skipped: data.onboarding_skipped,
    });

    return data;
  } catch (error) {
    console.error("❌ Error en checkOnboardingStatus:", error);
    return null;
  }
}

export async function getOnboardingData(userId: string, tipo: "normal" | "empresa") {
  try {
    const tableName = tipo === "normal" ? "onboarding_normal" : "onboarding_empresa";
    
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.log(`ℹ️ No hay datos de onboarding en ${tableName} para usuario ${userId}`);
      return null;
    }

    console.log(`✅ Datos de onboarding encontrados en ${tableName}:`, data);
    return data;
  } catch (error) {
    console.error("❌ Error en getOnboardingData:", error);
    return null;
  }
}



