-- ============================================
-- CONVERTIR USUARIO EXISTENTE A ADMIN
-- Email: joseortegahacc@gmail.com
-- ID: 7e20cf4f-198b-4689-a51e-c18bf94edc07
-- ============================================

-- Actualizar en tabla usuarios
UPDATE public.usuarios 
SET 
  rol = 'admin',
  tipo_usuario = 'admin',
  onboarding_completed = true
WHERE id = '7e20cf4f-198b-4689-a51e-c18bf94edc07';

-- Actualizar metadata en auth.users
UPDATE auth.users
SET 
  raw_user_meta_data = raw_user_meta_data || jsonb_build_object('rol', 'admin', 'tipo_usuario', 'admin'),
  raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', 'admin')
WHERE id = '7e20cf4f-198b-4689-a51e-c18bf94edc07';

-- Verificar cambios
SELECT 
  '✅ USUARIO CONVERTIDO A ADMIN' as status,
  u.id,
  u.email,
  us.nombre || ' ' || us.apellidos as nombre_completo,
  us.rol,
  us.tipo_usuario,
  u.raw_user_meta_data->>'rol' as metadata_rol
FROM auth.users u
JOIN public.usuarios us ON u.id = us.id
WHERE u.id = '7e20cf4f-198b-4689-a51e-c18bf94edc07';
