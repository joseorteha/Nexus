-- =====================================================
-- 👥 USUARIOS DE PRUEBA PARA DESARROLLO
-- =====================================================
-- Este script crea usuarios de prueba para cada tipo:
-- 1. Admin
-- 2. Usuario Normal
-- 3. Cooperativa
-- 4. Empresa
-- =====================================================

-- ⚠️ IMPORTANTE: Este script es solo para desarrollo/testing
-- Los usuarios reales deben crearse mediante Supabase Auth

-- =====================================================
-- PASO 1: Crear usuarios en Supabase Dashboard
-- =====================================================
-- Ve a: Authentication > Users > Add User
-- Crea los siguientes usuarios:

-- 1. ADMIN
-- Email: admin@nexus.com
-- Password: Admin123!
-- Confirm Email: Yes

-- 2. USUARIO NORMAL
-- Email: normal@nexus.com
-- Password: Normal123!
-- Confirm Email: Yes

-- 3. COOPERATIVA
-- Email: cooperativa@nexus.com
-- Password: Coop123!
-- Confirm Email: Yes

-- 4. EMPRESA
-- Email: empresa@nexus.com
-- Password: Empresa123!
-- Confirm Email: Yes

-- =====================================================
-- PASO 2: Obtener los UUIDs generados
-- =====================================================
-- Después de crear los usuarios en Supabase Dashboard,
-- ejecuta esta query para ver los IDs:

-- SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 4;

-- Copia los UUIDs y reemplázalos abajo

-- =====================================================
-- PASO 3: Insertar datos en la tabla usuarios
-- =====================================================
-- ⚠️ REEMPLAZA LOS UUIDs CON LOS REALES DE TU SUPABASE

-- Declarar variables con los IDs (ajusta estos valores)
-- Para ejecutar este script, primero obtén los IDs reales de auth.users

DO $$
DECLARE
  admin_id uuid;
  normal_id uuid;
  coop_id uuid;
  empresa_id uuid;
  cooperativa_id uuid;
BEGIN
  -- Obtener IDs de usuarios por email
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@nexus.com';
  SELECT id INTO normal_id FROM auth.users WHERE email = 'normal@nexus.com';
  SELECT id INTO coop_id FROM auth.users WHERE email = 'cooperativa@nexus.com';
  SELECT id INTO empresa_id FROM auth.users WHERE email = 'empresa@nexus.com';

  -- Solo continuar si los usuarios existen
  IF admin_id IS NULL OR normal_id IS NULL OR coop_id IS NULL OR empresa_id IS NULL THEN
    RAISE EXCEPTION 'Primero debes crear los usuarios en Supabase Dashboard (Authentication > Users)';
  END IF;

  -- =====================================================
  -- 1️⃣ USUARIO ADMIN
  -- =====================================================
  INSERT INTO public.usuarios (
    id,
    nombre,
    apellidos,
    telefono,
    rol,
    tipo_usuario,
    onboarding_completed
  ) VALUES (
    admin_id,
    'Admin',
    'Nexus',
    '5551234567',
    'admin',
    'admin',
    true
  ) ON CONFLICT (id) DO UPDATE SET
    rol = 'admin',
    tipo_usuario = 'admin';

  -- =====================================================
  -- 2️⃣ USUARIO NORMAL
  -- =====================================================
  INSERT INTO public.usuarios (
    id,
    nombre,
    apellidos,
    telefono,
    rol,
    tipo_usuario,
    onboarding_completed
  ) VALUES (
    normal_id,
    'Juan',
    'Pérez',
    '5557654321',
    'normal_user',
    'normal',
    true
  ) ON CONFLICT (id) DO UPDATE SET
    rol = 'normal_user',
    tipo_usuario = 'normal';

  -- Crear algunos productos para el usuario normal
  INSERT INTO public.productos (
    nombre,
    descripcion,
    precio,
    categoria,
    propietario_id,
    tipo_propietario,
    estado,
    unidad_medida,
    stock_actual
  ) VALUES
    ('Café Orgánico', 'Café de altura cultivado en Chiapas', 150.00, 'Alimentos', normal_id, 'individual', 'activo', 'kg', 100),
    ('Miel de Abeja', 'Miel pura sin procesar', 80.00, 'Alimentos', normal_id, 'individual', 'activo', 'kg', 50),
    ('Aguacate Hass', 'Aguacate fresco de Michoacán', 45.00, 'Alimentos', normal_id, 'individual', 'activo', 'kg', 200)
  ON CONFLICT DO NOTHING;

  -- =====================================================
  -- 3️⃣ USUARIO COOPERATIVA
  -- =====================================================
  INSERT INTO public.usuarios (
    id,
    nombre,
    apellidos,
    telefono,
    rol,
    tipo_usuario,
    onboarding_completed
  ) VALUES (
    coop_id,
    'María',
    'González',
    '5559876543',
    'normal_user',
    'cooperativa',
    true
  ) ON CONFLICT (id) DO UPDATE SET
    rol = 'normal_user',
    tipo_usuario = 'cooperativa';

  -- Crear una cooperativa de ejemplo
  INSERT INTO public.cooperativas (
    nombre,
    descripcion,
    creada_por,
    categoria,
    region,
    estado,
    total_miembros,
    productos_ofrecidos
  ) VALUES (
    'Cooperativa Café de la Sierra',
    'Cooperativa de productores de café orgánico',
    coop_id,
    ARRAY['Café', 'Alimentos Orgánicos'],
    'Chiapas',
    'active',
    5,
    ARRAY['Café', 'Miel', 'Cacao']
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO cooperativa_id;

  -- Agregar el usuario como miembro de la cooperativa
  IF cooperativa_id IS NOT NULL THEN
    INSERT INTO public.cooperativa_miembros (
      cooperativa_id,
      user_id,
      rol
    ) VALUES (
      cooperativa_id,
      coop_id,
      'administrador'
    ) ON CONFLICT DO NOTHING;

    -- Crear productos para la cooperativa
    INSERT INTO public.productos (
      nombre,
      descripcion,
      precio,
      categoria,
      propietario_id,
      tipo_propietario,
      estado,
      unidad_medida,
      stock_actual
    ) VALUES
      ('Café Orgánico Premium', 'Café cultivado por la cooperativa', 180.00, 'Alimentos', cooperativa_id, 'cooperativa', 'activo', 'kg', 500),
      ('Miel de Café', 'Miel de flores de café', 120.00, 'Alimentos', cooperativa_id, 'cooperativa', 'activo', 'kg', 100)
    ON CONFLICT DO NOTHING;
  END IF;

  -- =====================================================
  -- 4️⃣ USUARIO EMPRESA
  -- =====================================================
  INSERT INTO public.usuarios (
    id,
    nombre,
    apellidos,
    telefono,
    rol,
    tipo_usuario,
    onboarding_completed
  ) VALUES (
    empresa_id,
    'Carlos',
    'Ramírez',
    '5558765432',
    'normal_user',
    'empresa',
    true
  ) ON CONFLICT (id) DO UPDATE SET
    rol = 'normal_user',
    tipo_usuario = 'empresa';

  -- Crear empresa
  INSERT INTO public.empresas (
    user_id,
    razon_social,
    rfc,
    sector,
    telefono
  ) VALUES (
    empresa_id,
    'Distribuidora Alimentos Orgánicos S.A. de C.V.',
    'DAO010101ABC',
    'Distribución',
    '5558765432'
  ) ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Usuarios de prueba creados exitosamente!';
  RAISE NOTICE '📧 Admin: admin@nexus.com / Admin123!';
  RAISE NOTICE '📧 Normal: normal@nexus.com / Normal123!';
  RAISE NOTICE '📧 Cooperativa: cooperativa@nexus.com / Coop123!';
  RAISE NOTICE '📧 Empresa: empresa@nexus.com / Empresa123!';

END $$;
