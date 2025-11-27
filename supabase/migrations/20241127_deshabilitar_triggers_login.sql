-- =====================================================
-- 🚨 SOLUCIÓN EMERGENCIA: Deshabilitar TODOS los triggers
-- =====================================================

-- 1. Ver TODOS los triggers en auth.users
SELECT 
  tgname as trigger_name,
  tgtype,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth' AND c.relname = 'users';

-- 2. DESHABILITAR TODOS LOS TRIGGERS EN auth.users
DO $$
DECLARE
  trigger_record RECORD;
BEGIN
  FOR trigger_record IN 
    SELECT tgname
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'auth' AND c.relname = 'users'
      AND NOT tgisinternal
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users', trigger_record.tgname);
    RAISE NOTICE 'Eliminado trigger: %', trigger_record.tgname;
  END LOOP;
END $$;

-- 3. Verificar que no queden triggers
SELECT COUNT(*) as triggers_restantes
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth' 
  AND c.relname = 'users'
  AND NOT tgisinternal;

-- 4. Mensaje
SELECT '✅ Triggers eliminados. Prueba login ahora.' as resultado;
