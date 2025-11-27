-- =====================================================
-- 🔧 SOLUCIÓN: Crear usuarios directamente en auth.users
-- =====================================================
-- Ejecuta este script en SQL Editor de Supabase
-- =====================================================

-- Habilitar extensión si no existe
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Deshabilitar RLS temporalmente para evitar errores
ALTER TABLE IF EXISTS public.usuarios DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- FUNCIÓN HELPER: Crear usuario completo
-- =====================================================
CREATE OR REPLACE FUNCTION crear_usuario_completo(
  p_email text,
  p_password text,
  p_nombre text,
  p_apellidos text,
  p_telefono text,
  p_tipo_usuario text,
  p_rol text DEFAULT 'normal_user'
) RETURNS uuid AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Generar nuevo UUID
  v_user_id := gen_random_uuid();
  
  -- Insertar en auth.users (el trigger handle_new_user se encarga de crear en usuarios)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    is_sso_user
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    NOW(),
    '',
    '',
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    jsonb_build_object(
      'nombre', p_nombre, 
      'apellidos', p_apellidos,
      'rol', p_rol,
      'tipo_usuario', p_tipo_usuario
    ),
    NOW(),
    NOW(),
    false
  );

  -- Actualizar campos adicionales que el trigger no maneja
  UPDATE public.usuarios
  SET 
    telefono = p_telefono,
    onboarding_completed = true
  WHERE id = v_user_id;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- CREAR LOS 4 USUARIOS
-- =====================================================

DO $$
DECLARE
  admin_id uuid;
  normal_id uuid;
  coop_id uuid;
  empresa_id uuid;
BEGIN
  -- Verificar si ya existen
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@nexus.com') THEN
    RAISE NOTICE '⚠️  admin@nexus.com ya existe';
  ELSE
    admin_id := crear_usuario_completo(
      'admin@nexus.com',
      'Admin123!',
      'Admin',
      'Nexus',
      '5551234567',
      'admin',
      'admin'
    );
    RAISE NOTICE '✅ Admin creado: admin@nexus.com / Admin123!';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'normal@nexus.com') THEN
    RAISE NOTICE '⚠️  normal@nexus.com ya existe';
  ELSE
    normal_id := crear_usuario_completo(
      'normal@nexus.com',
      'Normal123!',
      'Juan',
      'Pérez',
      '5557654321',
      'normal',
      'normal_user'
    );
    RAISE NOTICE '✅ Normal creado: normal@nexus.com / Normal123!';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'cooperativa@nexus.com') THEN
    RAISE NOTICE '⚠️  cooperativa@nexus.com ya existe';
  ELSE
    coop_id := crear_usuario_completo(
      'cooperativa@nexus.com',
      'Coop123!',
      'María',
      'González',
      '5559876543',
      'cooperativa',
      'normal_user'
    );
    RAISE NOTICE '✅ Cooperativa creado: cooperativa@nexus.com / Coop123!';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'empresa@nexus.com') THEN
    RAISE NOTICE '⚠️  empresa@nexus.com ya existe';
  ELSE
    empresa_id := crear_usuario_completo(
      'empresa@nexus.com',
      'Empresa123!',
      'Carlos',
      'Ramírez',
      '5558765432',
      'empresa',
      'normal_user'
    );
    RAISE NOTICE '✅ Empresa creado: empresa@nexus.com / Empresa123!';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎉 USUARIOS CREADOS EXITOSAMENTE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Puedes iniciar sesión con:';
  RAISE NOTICE '  • admin@nexus.com / Admin123!';
  RAISE NOTICE '  • normal@nexus.com / Normal123!';
  RAISE NOTICE '  • cooperativa@nexus.com / Coop123!';
  RAISE NOTICE '  • empresa@nexus.com / Empresa123!';
  RAISE NOTICE '========================================';
END $$;

-- Rehabilitar RLS
ALTER TABLE IF EXISTS public.usuarios ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- VERIFICAR USUARIOS CREADOS
-- =====================================================
SELECT 
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmado,
  us.nombre,
  us.apellidos,
  us.tipo_usuario,
  us.rol,
  us.onboarding_completed
FROM auth.users u
JOIN public.usuarios us ON u.id = us.id
WHERE u.email LIKE '%@nexus.com'
ORDER BY us.tipo_usuario;
