-- ============================================
-- SCRIPT PARA CREAR USUARIO ADMIN EN SUPABASE
-- ============================================
-- 
-- INSTRUCCIONES:
-- 1. Abre Supabase Dashboard
-- 2. Ve a SQL Editor
-- 3. Copia y pega este script COMPLETO
-- 4. CAMBIA el email y password abajo
-- 5. Click en "Run" o F5
--
-- ============================================

-- ⚠️ CAMBIAR ESTOS VALORES ⚠️
DO $$
DECLARE
  admin_email TEXT := 'admin@nexus.com';  -- 👈 CAMBIA ESTE EMAIL
  admin_password TEXT := 'Admin123!';      -- 👈 CAMBIA ESTE PASSWORD
  admin_id UUID := 'db905aed-8fad-4ef9-9eec-5caad7120268';
BEGIN
  
  -- PASO 1: Eliminar usuario existente si existe (limpieza)
  DELETE FROM auth.identities WHERE user_id = admin_id;
  DELETE FROM auth.users WHERE id = admin_id;
  
  -- PASO 2: Crear usuario en auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    aud,
    confirmation_token
  ) VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('role', 'admin'),
    now(),
    now(),
    'authenticated',
    'authenticated',
    ''
  );
  
  -- PASO 3: Crear identidad
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    admin_id,
    jsonb_build_object('sub', admin_id, 'email', admin_email),
    'email',
    now(),
    now(),
    now()
  );
  
  -- PASO 4: Actualizar tabla usuarios
  UPDATE public.usuarios 
  SET 
    rol = 'admin',
    tipo_usuario = 'admin',
    onboarding_completed = true,
    onboarding_skipped = false
  WHERE id = admin_id;
  
  -- Si no existe en usuarios, crearlo
  IF NOT FOUND THEN
    INSERT INTO public.usuarios (
      id,
      nombre,
      apellidos,
      telefono,
      rol,
      tipo_usuario,
      created_at,
      onboarding_completed
    ) VALUES (
      admin_id,
      'Admin',
      'Nexus',
      '5551234567',
      'admin',
      'admin',
      now(),
      true
    );
  END IF;
  
  RAISE NOTICE '✅ Usuario admin creado exitosamente!';
  RAISE NOTICE 'Email: %', admin_email;
  RAISE NOTICE 'Password: %', admin_password;
  RAISE NOTICE 'ID: %', admin_id;
  
END $$;

-- Verificar que se creó correctamente
SELECT 
  '✅ USUARIO ADMIN CREADO' as status,
  u.email,
  us.nombre || ' ' || us.apellidos as nombre_completo,
  us.rol,
  us.tipo_usuario,
  u.email_confirmed_at as email_confirmado
FROM auth.users u
JOIN public.usuarios us ON u.id = us.id
WHERE u.id = 'db905aed-8fad-4ef9-9eec-5caad7120268';
