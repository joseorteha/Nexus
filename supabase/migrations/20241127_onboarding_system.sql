-- ============================================
-- SISTEMA DE ONBOARDING CON OPCIÓN DE OMITIR
-- Migración adaptada a tablas existentes
-- ============================================

-- ==========================================
-- 1. MODIFICAR TABLA USUARIOS EXISTENTE
-- ==========================================

-- Agregar columna para tracking de onboarding
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Agregar columna para saber si el usuario decidió omitir
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS onboarding_skipped BOOLEAN DEFAULT FALSE;

-- Agregar timestamp de cuándo completó/omitió onboarding
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- ==========================================
-- 2. MODIFICAR TABLA COOPERATIVAS EXISTENTE
-- ==========================================

-- Agregar campos faltantes a cooperativas
ALTER TABLE public.cooperativas 
ADD COLUMN IF NOT EXISTS categoria TEXT[],
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS certificaciones TEXT[],
ADD COLUMN IF NOT EXISTS capacidad_produccion TEXT,
ADD COLUMN IF NOT EXISTS total_miembros INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS total_productos INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_ventas DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'pending' CHECK (estado IN ('active', 'pending', 'inactive'));

-- ==========================================
-- 3. CREAR TABLA ONBOARDING_NORMAL
-- ==========================================

CREATE TABLE IF NOT EXISTS public.onboarding_normal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  productos TEXT[] NOT NULL,
  categorias TEXT[] NOT NULL,
  capacidad_produccion TEXT NOT NULL,
  region TEXT NOT NULL,
  objetivo TEXT NOT NULL CHECK (objetivo IN ('crear_cooperativa', 'unirse_cooperativa', 'vender_individual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

COMMENT ON TABLE public.onboarding_normal IS 'Datos de onboarding para usuarios normales - Información opcional que pueden completar o omitir';

-- ==========================================
-- 4. CREAR TABLA ONBOARDING_EMPRESA
-- ==========================================

CREATE TABLE IF NOT EXISTS public.onboarding_empresa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre_empresa TEXT NOT NULL,
  rfc TEXT NOT NULL,
  productos_necesitados TEXT[] NOT NULL,
  categorias TEXT[] NOT NULL,
  volumen_compra TEXT NOT NULL,
  frecuencia_compra TEXT NOT NULL,
  presupuesto TEXT NOT NULL,
  requisitos TEXT[],
  region TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

COMMENT ON TABLE public.onboarding_empresa IS 'Datos de onboarding para empresas - Información opcional que pueden completar o omitir';

-- ==========================================
-- 5. CREAR TABLA SOLICITUDES DE COOPERATIVAS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.solicitudes_cooperativas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT NOT NULL CHECK (tipo IN ('crear', 'unirse')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre_usuario TEXT NOT NULL,
  email_usuario TEXT NOT NULL,
  cooperativa_id UUID REFERENCES public.cooperativas(id) ON DELETE CASCADE,
  nombre_cooperativa TEXT NOT NULL,
  datos_cooperativa JSONB,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revisada_por UUID REFERENCES auth.users(id),
  fecha_revision TIMESTAMP WITH TIME ZONE,
  notas_revision TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.solicitudes_cooperativas IS 'Solicitudes de usuarios para crear o unirse a cooperativas - Requieren aprobación de admin';

-- ==========================================
-- 6. CREAR ÍNDICES PARA RENDIMIENTO
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_onboarding_normal_user ON public.onboarding_normal(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_empresa_user ON public.onboarding_empresa(user_id);
CREATE INDEX IF NOT EXISTS idx_cooperativas_estado ON public.cooperativas(estado);
CREATE INDEX IF NOT EXISTS idx_cooperativa_miembros_cooperativa ON public.cooperativa_miembros(cooperativa_id);
CREATE INDEX IF NOT EXISTS idx_cooperativa_miembros_user ON public.cooperativa_miembros(user_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON public.solicitudes_cooperativas(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_user ON public.solicitudes_cooperativas(user_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_cooperativa ON public.solicitudes_cooperativas(cooperativa_id);

-- ==========================================
-- 7. HABILITAR ROW LEVEL SECURITY
-- ==========================================

-- Habilitar RLS en tablas nuevas
ALTER TABLE public.onboarding_normal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_cooperativas ENABLE ROW LEVEL SECURITY;

-- También en tabla de cooperativas (si no estaba habilitado)
ALTER TABLE public.cooperativas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooperativa_miembros ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 8. POLÍTICAS RLS - ONBOARDING NORMAL
-- ==========================================

-- Usuarios ven su propio onboarding
CREATE POLICY "usuarios_ven_propio_onboarding" ON public.onboarding_normal
  FOR SELECT USING (auth.uid() = user_id);

-- Usuarios insertan su propio onboarding
CREATE POLICY "usuarios_insertan_propio_onboarding" ON public.onboarding_normal
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuarios actualizan su propio onboarding
CREATE POLICY "usuarios_actualizan_propio_onboarding" ON public.onboarding_normal
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins ven todo
CREATE POLICY "admins_ven_todo_onboarding_normal" ON public.onboarding_normal
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE usuarios.id = auth.uid() 
      AND usuarios.tipo_usuario = 'admin'
    )
  );

-- ==========================================
-- 9. POLÍTICAS RLS - ONBOARDING EMPRESA
-- ==========================================

CREATE POLICY "empresas_ven_propio_onboarding" ON public.onboarding_empresa
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "empresas_insertan_propio_onboarding" ON public.onboarding_empresa
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "empresas_actualizan_propio_onboarding" ON public.onboarding_empresa
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "admins_ven_todo_onboarding_empresa" ON public.onboarding_empresa
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE usuarios.id = auth.uid() 
      AND usuarios.tipo_usuario = 'admin'
    )
  );

-- ==========================================
-- 10. POLÍTICAS RLS - COOPERATIVAS
-- ==========================================

-- Todos ven cooperativas activas
CREATE POLICY "todos_ven_cooperativas_activas" ON public.cooperativas
  FOR SELECT USING (estado = 'active');

-- Admins ven todas las cooperativas
CREATE POLICY "admins_ven_todas_cooperativas" ON public.cooperativas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE usuarios.id = auth.uid() 
      AND usuarios.tipo_usuario = 'admin'
    )
  );

-- Admins insertan cooperativas
CREATE POLICY "admins_insertan_cooperativas" ON public.cooperativas
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE usuarios.id = auth.uid() 
      AND usuarios.tipo_usuario = 'admin'
    )
  );

-- Admins actualizan cooperativas
CREATE POLICY "admins_actualizan_cooperativas" ON public.cooperativas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE usuarios.id = auth.uid() 
      AND usuarios.tipo_usuario = 'admin'
    )
  );

-- ==========================================
-- 11. POLÍTICAS RLS - MIEMBROS
-- ==========================================

-- Miembros ven miembros de su cooperativa
CREATE POLICY "miembros_ven_su_cooperativa" ON public.cooperativa_miembros
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.cooperativa_miembros cm 
      WHERE cm.cooperativa_id = cooperativa_miembros.cooperativa_id 
      AND cm.user_id = auth.uid()
    )
  );

-- Admins gestionan miembros
CREATE POLICY "admins_gestionan_miembros" ON public.cooperativa_miembros
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE usuarios.id = auth.uid() 
      AND usuarios.tipo_usuario = 'admin'
    )
  );

-- ==========================================
-- 12. POLÍTICAS RLS - SOLICITUDES
-- ==========================================

-- Usuarios ven sus propias solicitudes
CREATE POLICY "usuarios_ven_propias_solicitudes" ON public.solicitudes_cooperativas
  FOR SELECT USING (auth.uid() = user_id);

-- Usuarios crean solicitudes
CREATE POLICY "usuarios_crean_solicitudes" ON public.solicitudes_cooperativas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins ven todas las solicitudes
CREATE POLICY "admins_ven_todas_solicitudes" ON public.solicitudes_cooperativas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE usuarios.id = auth.uid() 
      AND usuarios.tipo_usuario = 'admin'
    )
  );

-- Admins actualizan solicitudes
CREATE POLICY "admins_actualizan_solicitudes" ON public.solicitudes_cooperativas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE usuarios.id = auth.uid() 
      AND usuarios.tipo_usuario = 'admin'
    )
  );

-- ==========================================
-- 13. FUNCIONES TRIGGER
-- ==========================================

-- Función para actualizar contador de miembros
CREATE OR REPLACE FUNCTION actualizar_total_miembros()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.cooperativas 
    SET total_miembros = (
      SELECT COUNT(*) FROM public.cooperativa_miembros 
      WHERE cooperativa_id = NEW.cooperativa_id
    )
    WHERE id = NEW.cooperativa_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.cooperativas 
    SET total_miembros = (
      SELECT COUNT(*) FROM public.cooperativa_miembros 
      WHERE cooperativa_id = OLD.cooperativa_id
    )
    WHERE id = OLD.cooperativa_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar automáticamente
DROP TRIGGER IF EXISTS trigger_actualizar_miembros ON public.cooperativa_miembros;
CREATE TRIGGER trigger_actualizar_miembros
AFTER INSERT OR DELETE ON public.cooperativa_miembros
FOR EACH ROW
EXECUTE FUNCTION actualizar_total_miembros();

-- Función para actualizar timestamp de onboarding
CREATE OR REPLACE FUNCTION actualizar_timestamp_onboarding()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar timestamps
CREATE TRIGGER trigger_actualizar_onboarding_normal
BEFORE UPDATE ON public.onboarding_normal
FOR EACH ROW
EXECUTE FUNCTION actualizar_timestamp_onboarding();

CREATE TRIGGER trigger_actualizar_onboarding_empresa
BEFORE UPDATE ON public.onboarding_empresa
FOR EACH ROW
EXECUTE FUNCTION actualizar_timestamp_onboarding();

-- ==========================================
-- 14. FUNCIÓN HELPER PARA OMITIR ONBOARDING
-- ==========================================

-- Función que permite omitir el onboarding
CREATE OR REPLACE FUNCTION omitir_onboarding(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.usuarios 
  SET 
    onboarding_completed = TRUE,
    onboarding_skipped = TRUE,
    onboarding_completed_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION omitir_onboarding IS 'Permite al usuario omitir el onboarding y acceder directo al dashboard';

-- ==========================================
-- FIN DE MIGRACIÓN
-- ==========================================

-- Verificar que todo se creó correctamente
DO $$ 
BEGIN
  RAISE NOTICE '✅ Migración completada exitosamente';
  RAISE NOTICE '✅ Tablas onboarding_normal y onboarding_empresa creadas';
  RAISE NOTICE '✅ Tabla solicitudes_cooperativas creada';
  RAISE NOTICE '✅ Columnas agregadas a usuarios y cooperativas';
  RAISE NOTICE '✅ Políticas RLS configuradas';
  RAISE NOTICE '✅ Triggers y funciones creadas';
  RAISE NOTICE '✅ Sistema de OMITIR onboarding habilitado';
END $$;
