-- ==========================================
-- FIX: Eliminar recursión infinita en políticas de usuarios
-- ==========================================

-- Eliminar TODAS las políticas existentes
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.usuarios;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.usuarios;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_ven_propio_perfil" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_insertan_propio_perfil" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_actualizan_propio_perfil" ON public.usuarios;
DROP POLICY IF EXISTS "admins_todo_usuarios" ON public.usuarios;

-- ==========================================
-- POLÍTICAS SIMPLES SIN RECURSIÓN
-- ==========================================

-- 1. Los usuarios pueden VER su propio perfil
CREATE POLICY "usuarios_ven_propio_perfil" ON public.usuarios
  FOR SELECT 
  USING (auth.uid() = id);

-- 2. Los usuarios pueden CREAR su propio perfil
-- IMPORTANTE: Solo pueden crear si el ID coincide con su auth.uid()
CREATE POLICY "usuarios_insertan_propio_perfil" ON public.usuarios
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 3. Los usuarios pueden ACTUALIZAR su propio perfil
CREATE POLICY "usuarios_actualizan_propio_perfil" ON public.usuarios
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- NOTA IMPORTANTE:
-- No creamos política para admins aquí porque causaría recursión.
-- Los admins deben usar el Service Role Key (backend/server-side)
-- para operaciones administrativas que requieran acceso completo.
-- ==========================================

-- Verificar políticas creadas
SELECT 
  policyname, 
  cmd,
  CASE 
    WHEN qual IS NULL THEN 'Sin restricción'
    ELSE 'Con validación'
  END as tiene_validacion
FROM pg_policies 
WHERE tablename = 'usuarios' 
ORDER BY policyname;
