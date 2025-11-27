-- ============================================
-- RESETEAR PASSWORD DE ADMIN
-- ============================================
-- ⚠️ CAMBIA EL PASSWORD ABAJO ANTES DE EJECUTAR

DO $$
DECLARE
  admin_email TEXT := 'admin@nexus.com';
  nuevo_password TEXT := 'NuevoAdmin123!'; -- 👈 CAMBIA ESTE PASSWORD
  admin_id UUID;
BEGIN
  
  -- Buscar el ID del usuario
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = admin_email;
  
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró usuario con email: %', admin_email;
  END IF;
  
  -- Actualizar password
  UPDATE auth.users
  SET 
    encrypted_password = crypt(nuevo_password, gen_salt('bf')),
    updated_at = now()
  WHERE id = admin_id;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ ¡PASSWORD ACTUALIZADO!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📧 Email:        %', admin_email;
  RAISE NOTICE '🔑 Nuevo Password: %', nuevo_password;
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  
END $$;
