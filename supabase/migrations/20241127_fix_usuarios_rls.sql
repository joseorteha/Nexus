-- ==========================================
-- FIX: Políticas RLS para tabla usuarios
-- ==========================================
-- Problema: Los usuarios no pueden crear su perfil porque
-- no hay políticas RLS que lo permitan.

-- Habilitar RLS en usuarios si no está habilitado
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "usuarios_ven_propio_perfil" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_insertan_propio_perfil" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_actualizan_propio_perfil" ON public.usuarios;
DROP POLICY IF EXISTS "admins_todo_usuarios" ON public.usuarios;

-- ==========================================
-- POLÍTICAS PARA USUARIOS
-- ==========================================

-- 1. Los usuarios pueden VER su propio perfil
CREATE POLICY "usuarios_ven_propio_perfil" ON public.usuarios
  FOR SELECT 
  USING (auth.uid() = id);

-- 2. Los usuarios pueden CREAR su propio perfil (al registrarse)
CREATE POLICY "usuarios_insertan_propio_perfil" ON public.usuarios
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 3. Los usuarios pueden ACTUALIZAR su propio perfil
CREATE POLICY "usuarios_actualizan_propio_perfil" ON public.usuarios
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- POLÍTICAS PARA ADMINS
-- ==========================================

-- 4. Los admins pueden hacer TODO con usuarios
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
-- NOTA: Con estas políticas:
-- - Los usuarios pueden crear y gestionar su propio perfil
-- - Los admins pueden ver y modificar cualquier usuario
-- - Nadie puede ver/modificar perfiles de otros usuarios (excepto admins)
-- ==========================================
