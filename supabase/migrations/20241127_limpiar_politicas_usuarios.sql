-- ==========================================
-- LIMPIAR POLÍTICAS DUPLICADAS DE USUARIOS
-- ==========================================

-- Eliminar TODAS las políticas antiguas (en inglés y español)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.usuarios;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.usuarios;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_ven_propio_perfil" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_insertan_propio_perfil" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_actualizan_propio_perfil" ON public.usuarios;
DROP POLICY IF EXISTS "admins_todo_usuarios" ON public.usuarios;

-- ==========================================
-- CREAR POLÍTICAS CORRECTAS Y ÚNICAS
-- ==========================================

-- 1. Ver propio perfil
CREATE POLICY "usuarios_ven_propio_perfil" ON public.usuarios
  FOR SELECT 
  USING (auth.uid() = id);

-- 2. Insertar propio perfil (CON validación)
CREATE POLICY "usuarios_insertan_propio_perfil" ON public.usuarios
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 3. Actualizar propio perfil
CREATE POLICY "usuarios_actualizan_propio_perfil" ON public.usuarios
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Admins pueden hacer TODO
CREATE POLICY "admins_todo_usuarios" ON public.usuarios
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid()
      AND tipo_usuario = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid()
      AND tipo_usuario = 'admin'
    )
  );

-- ==========================================
-- VERIFICACIÓN
-- ==========================================
-- Ejecuta este query para verificar que solo hay 4 políticas:
-- 
-- SELECT policyname, cmd 
-- FROM pg_policies 
-- WHERE tablename = 'usuarios' 
-- ORDER BY policyname;
--
-- Deberías ver:
-- 1. admins_todo_usuarios (ALL)
-- 2. usuarios_actualizan_propio_perfil (UPDATE)
-- 3. usuarios_insertan_propio_perfil (INSERT)
-- 4. usuarios_ven_propio_perfil (SELECT)
-- ==========================================
