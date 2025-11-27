-- Crear usuario admin en el sistema de autenticación
-- IMPORTANTE: Cambia el email y password según necesites

-- 1. Insertar en auth.users (tabla de autenticación)
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
  'db905aed-8fad-4ef9-9eec-5caad7120268', -- Mismo ID que en la tabla usuarios
  '00000000-0000-0000-0000-000000000000',
  'admin@nexus.com', -- ⚠️ CAMBIA ESTE EMAIL
  crypt('Admin123!', gen_salt('bf')), -- ⚠️ CAMBIA ESTE PASSWORD
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin"}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  ''
) ON CONFLICT (id) DO NOTHING;

-- 2. Insertar identidad en auth.identities
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
  'db905aed-8fad-4ef9-9eec-5caad7120268',
  jsonb_build_object(
    'sub', 'db905aed-8fad-4ef9-9eec-5caad7120268',
    'email', 'admin@nexus.com' -- ⚠️ MISMO EMAIL DE ARRIBA
  ),
  'email',
  now(),
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- 3. Actualizar o insertar en la tabla usuarios
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
  'db905aed-8fad-4ef9-9eec-5caad7120268',
  'Admin',
  'Nexus',
  '5551234567',
  'admin',
  'admin',
  now(),
  true,
  false
) ON CONFLICT (id) DO UPDATE SET
  rol = 'admin',
  tipo_usuario = 'admin',
  onboarding_completed = true;

-- Verificar que se creó correctamente
SELECT 
  u.email,
  us.nombre,
  us.apellidos,
  us.rol,
  us.tipo_usuario
FROM auth.users u
LEFT JOIN public.usuarios us ON u.id = us.id
WHERE u.id = 'db905aed-8fad-4ef9-9eec-5caad7120268';

COMMENT ON TABLE public.usuarios IS 'Usuario admin creado con email: admin@nexus.com y password: Admin123!';
