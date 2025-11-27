-- ============================================
-- ACTUALIZAR USUARIO EXISTENTE A ADMIN
-- ============================================

DO $$
DECLARE
  admin_email TEXT := 'admin@nexus.com';
  admin_id UUID;
BEGIN
  
  -- Buscar el ID del usuario con ese email
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = admin_email;
  
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró usuario con email: %', admin_email;
  END IF;
  
  -- Actualizar/Crear en tabla usuarios
  INSERT INTO public.usuarios (
    id,
    nombre,
    apellidos,
    telefono,
    rol,
    tipo_usuario,
    created_at,
    onboarding_completed,
    onboarding_skipped
  ) VALUES (
    admin_id,
    'Admin',
    'Nexus',
    '5551234567',
    'admin',
    'admin',
    now(),
    true,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    rol = 'admin',
    tipo_usuario = 'admin',
    onboarding_completed = true,
    onboarding_skipped = false;
  
  -- Actualizar metadata del usuario en auth
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_build_object('role', 'admin')
  WHERE id = admin_id;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ ¡USUARIO ACTUALIZADO A ADMIN!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📧 Email: %', admin_email;
  RAISE NOTICE '🆔 ID:    %', admin_id;
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '⚠️  Si no recuerdas la contraseña, resetéala en Supabase Dashboard';
  RAISE NOTICE '';
  
END $$;

-- Verificar
SELECT 
  '✅ USUARIO ADMIN ACTUALIZADO' as status,
  u.email,
  us.nombre || ' ' || us.apellidos as nombre_completo,
  us.rol,
  us.tipo_usuario,
  u.email_confirmed_at as email_confirmado,
  u.created_at as fecha_creacion
FROM auth.users u
JOIN public.usuarios us ON u.id = us.id
WHERE u.email = 'admin@nexus.com';
