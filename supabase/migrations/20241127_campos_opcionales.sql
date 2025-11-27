-- ============================================
-- ACTUALIZACIÓN: Hacer campos opcionales (nullable)
-- Permite omitir pasos individuales del onboarding
-- ============================================

-- ==========================================
-- 1. ONBOARDING_NORMAL - Hacer campos opcionales
-- ==========================================

-- Campos OBLIGATORIOS para matching:
-- - productos (para saber qué ofrece)
-- - categorias (para matching)

-- Campos OPCIONALES (pueden omitirse):
-- - capacidad_produccion
-- - region
-- - objetivo

ALTER TABLE public.onboarding_normal 
ALTER COLUMN capacidad_produccion DROP NOT NULL;

ALTER TABLE public.onboarding_normal 
ALTER COLUMN region DROP NOT NULL;

-- El objetivo también puede ser opcional
ALTER TABLE public.onboarding_normal 
ALTER COLUMN objetivo DROP NOT NULL;

-- ==========================================
-- 2. ONBOARDING_EMPRESA - Hacer campos opcionales
-- ==========================================

-- Campos OBLIGATORIOS para matching:
-- - nombre_empresa
-- - rfc
-- - productos_necesitados (qué busca comprar)
-- - categorias (para matching)

-- Campos OPCIONALES (pueden omitirse):
-- - volumen_compra
-- - frecuencia_compra
-- - presupuesto
-- - requisitos
-- - region

ALTER TABLE public.onboarding_empresa 
ALTER COLUMN volumen_compra DROP NOT NULL;

ALTER TABLE public.onboarding_empresa 
ALTER COLUMN frecuencia_compra DROP NOT NULL;

ALTER TABLE public.onboarding_empresa 
ALTER COLUMN presupuesto DROP NOT NULL;

ALTER TABLE public.onboarding_empresa 
ALTER COLUMN requisitos DROP NOT NULL;

ALTER TABLE public.onboarding_empresa 
ALTER COLUMN region DROP NOT NULL;

-- ==========================================
-- 3. SOLICITUDES_COOPERATIVAS - Hacer descripción opcional
-- ==========================================

-- La descripción puede ser breve inicialmente y completarse después
COMMENT ON COLUMN public.solicitudes_cooperativas.datos_cooperativa IS 
'JSONB con datos de la cooperativa. Campos opcionales pueden completarse después';

-- ==========================================
-- 4. CREAR TABLA DE TRACKING DE PERFIL INCOMPLETO
-- ==========================================

CREATE TABLE IF NOT EXISTS public.perfil_incompleto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campos_pendientes JSONB NOT NULL DEFAULT '[]'::jsonb,
  ultima_actualizacion TIMESTAMPTZ DEFAULT NOW(),
  recordatorios_enviados INTEGER DEFAULT 0,
  UNIQUE(user_id)
);

-- RLS para perfil_incompleto
ALTER TABLE public.perfil_incompleto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven su propio perfil incompleto"
  ON public.perfil_incompleto
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios actualizan su propio perfil incompleto"
  ON public.perfil_incompleto
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Sistema crea registros de perfil incompleto"
  ON public.perfil_incompleto
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Índice para búsquedas rápidas
CREATE INDEX idx_perfil_incompleto_user ON public.perfil_incompleto(user_id);

-- ==========================================
-- 5. ACTUALIZAR COMENTARIOS
-- ==========================================

COMMENT ON COLUMN public.onboarding_normal.productos IS 
'OBLIGATORIO - Productos que ofrece el usuario (para sistema de matching)';

COMMENT ON COLUMN public.onboarding_normal.categorias IS 
'OBLIGATORIO - Categorías de productos (para sistema de matching)';

COMMENT ON COLUMN public.onboarding_normal.region IS 
'OPCIONAL - Región del usuario (para matching geográfico mejorado)';

COMMENT ON COLUMN public.onboarding_normal.capacidad_produccion IS 
'OPCIONAL - Capacidad de producción mensual (puede omitirse)';

COMMENT ON COLUMN public.onboarding_normal.objetivo IS 
'OPCIONAL - Objetivo del usuario (crear cooperativa, unirse, vender individual)';

COMMENT ON COLUMN public.onboarding_empresa.productos_necesitados IS 
'OBLIGATORIO - Productos que busca comprar la empresa (para matching)';

COMMENT ON COLUMN public.onboarding_empresa.categorias IS 
'OBLIGATORIO - Categorías de interés (para matching)';

COMMENT ON COLUMN public.onboarding_empresa.region IS 
'OPCIONAL - Región de operación (para matching geográfico mejorado)';

COMMENT ON COLUMN public.onboarding_empresa.volumen_compra IS 
'OPCIONAL - Volumen de compra mensual estimado';

COMMENT ON COLUMN public.onboarding_empresa.frecuencia_compra IS 
'OPCIONAL - Frecuencia de compra (semanal, mensual, etc.)';

COMMENT ON COLUMN public.onboarding_empresa.presupuesto IS 
'OPCIONAL - Presupuesto disponible para compras';

COMMENT ON COLUMN public.onboarding_empresa.requisitos IS 
'OPCIONAL - Requisitos específicos (puede omitirse)';

-- ==========================================
-- 6. FIN DE ACTUALIZACIÓN
-- ==========================================

COMMENT ON TABLE public.perfil_incompleto IS 
'Tracking de campos que el usuario omitió durante onboarding y puede completar después';

DO $$ 
BEGIN
  RAISE NOTICE '✅ Campos opcionales configurados correctamente';
  RAISE NOTICE '✅ Solo productos y categorías son obligatorios (para matching básico)';
  RAISE NOTICE '✅ Los usuarios pueden omitir pasos individuales';
  RAISE NOTICE '✅ Tabla perfil_incompleto creada para tracking';
  RAISE NOTICE '✅ Los usuarios pueden completar su perfil después';
END $$;
