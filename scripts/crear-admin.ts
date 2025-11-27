/**
 * Script para crear usuario admin programáticamente
 * 
 * USO:
 * 1. Asegúrate de tener las variables de entorno configuradas (.env.local)
 * 2. Ejecuta: npx tsx scripts/crear-admin.ts
 */

import { createClient } from '@supabase/supabase-js';

// Configuración
const ADMIN_EMAIL = 'admin@nexus.com'; // 👈 CAMBIA ESTE EMAIL
const ADMIN_PASSWORD = 'Admin123!';     // 👈 CAMBIA ESTE PASSWORD
const ADMIN_ID = 'db905aed-8fad-4ef9-9eec-5caad7120268';

async function crearAdmin() {
  // Usar Supabase Admin (requiere service_role key)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ⚠️ Solo en backend/scripts

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('🔧 Creando usuario admin...');

  try {
    // 1. Crear usuario en auth.users usando Admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        role: 'admin'
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario en auth:', authError);
      process.exit(1);
    }

    console.log('✅ Usuario creado en auth.users:', authData.user.id);

    // 2. Crear/actualizar en tabla usuarios
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .upsert({
        id: authData.user.id,
        nombre: 'Admin',
        apellidos: 'Nexus',
        telefono: '5551234567',
        rol: 'admin',
        tipo_usuario: 'admin',
        onboarding_completed: true,
        onboarding_skipped: false,
        created_at: new Date().toISOString()
      });

    if (usuarioError) {
      console.error('❌ Error creando en tabla usuarios:', usuarioError);
      process.exit(1);
    }

    console.log('✅ Usuario admin creado exitosamente!');
    console.log('');
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('🆔 ID:', authData.user.id);
    console.log('');
    console.log('🎉 Ahora puedes iniciar sesión con estas credenciales');

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

// Ejecutar
crearAdmin();
