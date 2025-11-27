/**
 * Script Node.js simple para crear usuario admin
 * 
 * USO:
 * 1. Instala dependencias: npm install @supabase/supabase-js dotenv
 * 2. Configura .env.local con SUPABASE_SERVICE_ROLE_KEY
 * 3. Ejecuta: node scripts/crear-admin.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// ⚠️ CONFIGURACIÓN - CAMBIA ESTOS VALORES ⚠️
const CONFIG = {
  email: 'admin@nexus.com',
  password: 'Admin123!',
  nombre: 'Admin',
  apellidos: 'Nexus',
  telefono: '5551234567'
};

async function main() {
  console.log('\n🔧 Iniciando creación de usuario admin...\n');

  // Validar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('❌ Error: Falta NEXT_PUBLIC_SUPABASE_URL en .env.local');
    process.exit(1);
  }

  if (!supabaseServiceKey) {
    console.error('❌ Error: Falta SUPABASE_SERVICE_ROLE_KEY en .env.local');
    console.error('💡 Obtén esta key en: Dashboard > Settings > API > service_role key');
    process.exit(1);
  }

  // Crear cliente de Supabase Admin
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Paso 1: Verificar si el email ya existe
    console.log(`📧 Verificando si ${CONFIG.email} ya existe...`);
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.find(u => u.email === CONFIG.email);

    if (userExists) {
      console.log('⚠️  Usuario ya existe en auth.users');
      console.log('🔄 Actualizando rol en tabla usuarios...');
      
      // Solo actualizar la tabla usuarios
      const { error: updateError } = await supabase
        .from('usuarios')
        .upsert({
          id: userExists.id,
          nombre: CONFIG.nombre,
          apellidos: CONFIG.apellidos,
          telefono: CONFIG.telefono,
          rol: 'admin',
          tipo_usuario: 'admin',
          onboarding_completed: true,
          onboarding_skipped: false
        });

      if (updateError) throw updateError;
      
      console.log('✅ Rol actualizado a admin');
      console.log('\n📋 Credenciales:');
      console.log(`   Email: ${CONFIG.email}`);
      console.log(`   ID: ${userExists.id}`);
      return;
    }

    // Paso 2: Crear usuario en auth.users
    console.log('👤 Creando usuario en sistema de autenticación...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: CONFIG.email,
      password: CONFIG.password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        nombre: CONFIG.nombre,
        apellidos: CONFIG.apellidos
      }
    });

    if (authError) {
      console.error('❌ Error en auth:', authError.message);
      throw authError;
    }

    console.log('✅ Usuario creado en auth:', authData.user.id);

    // Paso 3: Crear en tabla usuarios
    console.log('📝 Creando registro en tabla usuarios...');
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        nombre: CONFIG.nombre,
        apellidos: CONFIG.apellidos,
        telefono: CONFIG.telefono,
        rol: 'admin',
        tipo_usuario: 'admin',
        onboarding_completed: true,
        onboarding_skipped: false,
        created_at: new Date().toISOString()
      });

    if (usuarioError) {
      console.error('❌ Error en usuarios:', usuarioError.message);
      throw usuarioError;
    }

    console.log('✅ Registro creado en tabla usuarios');

    // Resultado final
    console.log('\n🎉 ¡ADMIN CREADO EXITOSAMENTE!\n');
    console.log('═══════════════════════════════════════');
    console.log('📋 CREDENCIALES DE ACCESO:');
    console.log('═══════════════════════════════════════');
    console.log(`📧 Email:    ${CONFIG.email}`);
    console.log(`🔑 Password: ${CONFIG.password}`);
    console.log(`🆔 ID:       ${authData.user.id}`);
    console.log(`👤 Nombre:   ${CONFIG.nombre} ${CONFIG.apellidos}`);
    console.log('═══════════════════════════════════════\n');
    console.log('✨ Ahora puedes iniciar sesión en:');
    console.log('   http://localhost:3000/auth/login\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verifica que SUPABASE_SERVICE_ROLE_KEY esté correcta');
    console.error('   2. Asegúrate de que .env.local esté en la raíz del proyecto');
    console.error('   3. Verifica que las tablas auth.users y usuarios existan');
    process.exit(1);
  }
}

// Ejecutar
main().catch(console.error);
