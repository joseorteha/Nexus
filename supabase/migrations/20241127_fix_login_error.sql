-- =====================================================
-- 🔧 FIX: Error 500 en Login
-- =====================================================
-- El trigger handle_new_user() está causando problemas
-- Lo deshabilitamos y creamos uno mejor
-- =====================================================

-- 1. Ver qué triggers existen
SELECT 
  trigger_name, 
  event_object_table, 
  action_statement 
FROM information_schema.triggers 
WHERE event_object_schema = 'auth'
  AND event_object_table = 'users';

-- 2. Eliminar el trigger problemático si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Eliminar la función si existe
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 4. Crear una función mejorada (solo para nuevos registros, no login)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo insertar si el usuario no existe en public.usuarios
  IF NOT EXISTS (SELECT 1 FROM public.usuarios WHERE id = NEW.id) THEN
    INSERT INTO public.usuarios (
      id,
      nombre,
      apellidos,
      telefono,
      avatar_url,
      rol,
      tipo_usuario,
      onboarding_completed
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
      COALESCE(NEW.raw_user_meta_data->>'apellidos', ''),
      COALESCE(NEW.raw_user_meta_data->>'telefono', ''),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
      COALESCE(NEW.raw_user_meta_data->>'rol', 'normal_user'),
      COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'normal'),
      COALESCE((NEW.raw_user_meta_data->>'onboarding_completed')::boolean, false)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Recrear el trigger solo para INSERT (no UPDATE)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. Verificar que ahora funcione
SELECT 'Trigger recreado correctamente. Prueba login ahora.' as mensaje;
