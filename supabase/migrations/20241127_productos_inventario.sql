-- =============================================
-- MIGRACIÓN: Sistema de Productos e Inventario
-- Fecha: 2024-11-27
-- Descripción: Tablas para gestión de productos, inventario y ventas
-- =============================================

-- =============================================
-- TABLA: productos
-- =============================================
CREATE TABLE IF NOT EXISTS public.productos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nombre text NOT NULL,
  descripcion text,
  categoria text NOT NULL,
  precio numeric(10,2) NOT NULL CHECK (precio >= 0),
  unidad_medida text NOT NULL DEFAULT 'unidad' CHECK (unidad_medida IN ('kg', 'litro', 'pieza', 'unidad', 'caja', 'tonelada')),
  imagen_url text,
  
  -- Propietario del producto
  tipo_propietario text NOT NULL CHECK (tipo_propietario IN ('individual', 'cooperativa')),
  propietario_id uuid NOT NULL,
  
  -- Control de inventario
  stock_actual integer NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
  stock_minimo integer NOT NULL DEFAULT 5 CHECK (stock_minimo >= 0),
  
  -- Estado del producto
  estado text NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'agotado', 'inactivo')),
  
  -- Información adicional
  sku text, -- Código de producto (opcional)
  certificaciones text[], -- Array de certificaciones
  region text, -- Región de producción
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT productos_pkey PRIMARY KEY (id)
);

-- Índices para mejorar performance
CREATE INDEX idx_productos_propietario ON public.productos(propietario_id, tipo_propietario);
CREATE INDEX idx_productos_categoria ON public.productos(categoria);
CREATE INDEX idx_productos_estado ON public.productos(estado);
CREATE INDEX idx_productos_stock_bajo ON public.productos(stock_actual, stock_minimo) WHERE stock_actual <= stock_minimo;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_productos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER productos_updated_at
  BEFORE UPDATE ON public.productos
  FOR EACH ROW
  EXECUTE FUNCTION update_productos_updated_at();

-- Trigger para actualizar estado según stock
CREATE OR REPLACE FUNCTION actualizar_estado_producto()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_actual = 0 THEN
    NEW.estado = 'agotado';
  ELSIF NEW.stock_actual > 0 AND NEW.estado = 'agotado' THEN
    NEW.estado = 'activo';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_estado_producto
  BEFORE INSERT OR UPDATE OF stock_actual ON public.productos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_estado_producto();

-- =============================================
-- TABLA: inventario_movimientos
-- =============================================
CREATE TABLE IF NOT EXISTS public.inventario_movimientos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  producto_id uuid NOT NULL,
  
  -- Tipo de movimiento
  tipo_movimiento text NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste')),
  cantidad integer NOT NULL CHECK (cantidad > 0),
  motivo text NOT NULL CHECK (motivo IN ('venta', 'produccion', 'devolucion', 'ajuste', 'merma', 'stock_inicial')),
  
  -- Estado del stock
  stock_anterior integer NOT NULL,
  stock_nuevo integer NOT NULL,
  
  -- Información adicional
  notas text,
  referencia text, -- ID de venta u otra referencia
  
  -- Quién realizó el movimiento
  realizado_por uuid NOT NULL,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT inventario_movimientos_pkey PRIMARY KEY (id),
  CONSTRAINT inventario_movimientos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE,
  CONSTRAINT inventario_movimientos_realizado_por_fkey FOREIGN KEY (realizado_por) REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_inventario_movimientos_producto ON public.inventario_movimientos(producto_id);
CREATE INDEX idx_inventario_movimientos_fecha ON public.inventario_movimientos(created_at DESC);
CREATE INDEX idx_inventario_movimientos_tipo ON public.inventario_movimientos(tipo_movimiento);

-- =============================================
-- TABLA: ventas (SIMULADO - para stats y reportes)
-- =============================================
CREATE TABLE IF NOT EXISTS public.ventas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  producto_id uuid NOT NULL,
  
  -- Vendedor
  vendedor_tipo text NOT NULL CHECK (vendedor_tipo IN ('individual', 'cooperativa')),
  vendedor_id uuid NOT NULL,
  
  -- Comprador
  comprador_tipo text CHECK (comprador_tipo IN ('empresa', 'cooperativa', 'publico')),
  comprador_id uuid,
  comprador_nombre text,
  
  -- Detalles de la venta
  cantidad integer NOT NULL CHECK (cantidad > 0),
  precio_unitario numeric(10,2) NOT NULL CHECK (precio_unitario >= 0),
  total numeric(10,2) NOT NULL CHECK (total >= 0),
  
  -- Estado
  estado text NOT NULL DEFAULT 'completada' CHECK (estado IN ('pendiente', 'completada', 'cancelada')),
  
  -- Información adicional
  metodo_pago text CHECK (metodo_pago IN ('efectivo', 'transferencia', 'tarjeta')),
  notas text,
  
  -- Timestamps
  fecha_venta timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT ventas_pkey PRIMARY KEY (id),
  CONSTRAINT ventas_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_ventas_vendedor ON public.ventas(vendedor_id, vendedor_tipo);
CREATE INDEX idx_ventas_producto ON public.ventas(producto_id);
CREATE INDEX idx_ventas_fecha ON public.ventas(fecha_venta DESC);
CREATE INDEX idx_ventas_estado ON public.ventas(estado);

-- =============================================
-- FUNCIONES HELPER
-- =============================================

-- Función para registrar movimiento de inventario
CREATE OR REPLACE FUNCTION registrar_movimiento_inventario(
  p_producto_id uuid,
  p_tipo_movimiento text,
  p_cantidad integer,
  p_motivo text,
  p_realizado_por uuid,
  p_notas text DEFAULT NULL,
  p_referencia text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_stock_anterior integer;
  v_stock_nuevo integer;
  v_movimiento_id uuid;
BEGIN
  -- Obtener stock actual
  SELECT stock_actual INTO v_stock_anterior
  FROM public.productos
  WHERE id = p_producto_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Producto no encontrado';
  END IF;
  
  -- Calcular nuevo stock
  IF p_tipo_movimiento = 'entrada' THEN
    v_stock_nuevo := v_stock_anterior + p_cantidad;
  ELSIF p_tipo_movimiento = 'salida' THEN
    v_stock_nuevo := v_stock_anterior - p_cantidad;
    IF v_stock_nuevo < 0 THEN
      RAISE EXCEPTION 'Stock insuficiente. Stock actual: %, Cantidad solicitada: %', v_stock_anterior, p_cantidad;
    END IF;
  ELSIF p_tipo_movimiento = 'ajuste' THEN
    v_stock_nuevo := p_cantidad; -- En ajuste, p_cantidad es el nuevo stock total
  END IF;
  
  -- Actualizar stock del producto
  UPDATE public.productos
  SET stock_actual = v_stock_nuevo
  WHERE id = p_producto_id;
  
  -- Registrar el movimiento
  INSERT INTO public.inventario_movimientos (
    producto_id,
    tipo_movimiento,
    cantidad,
    motivo,
    stock_anterior,
    stock_nuevo,
    notas,
    referencia,
    realizado_por
  ) VALUES (
    p_producto_id,
    p_tipo_movimiento,
    p_cantidad,
    p_motivo,
    v_stock_anterior,
    v_stock_nuevo,
    p_notas,
    p_referencia,
    p_realizado_por
  ) RETURNING id INTO v_movimiento_id;
  
  RETURN v_movimiento_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener productos con stock bajo
CREATE OR REPLACE FUNCTION obtener_productos_stock_bajo(
  p_propietario_id uuid,
  p_tipo_propietario text
)
RETURNS TABLE (
  id uuid,
  nombre text,
  stock_actual integer,
  stock_minimo integer,
  diferencia integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.nombre,
    p.stock_actual,
    p.stock_minimo,
    (p.stock_minimo - p.stock_actual) as diferencia
  FROM public.productos p
  WHERE p.propietario_id = p_propietario_id
    AND p.tipo_propietario = p_tipo_propietario
    AND p.stock_actual <= p.stock_minimo
    AND p.estado = 'activo'
  ORDER BY diferencia DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas de productos
CREATE OR REPLACE FUNCTION obtener_estadisticas_productos(
  p_propietario_id uuid,
  p_tipo_propietario text
)
RETURNS json AS $$
DECLARE
  v_resultado json;
BEGIN
  SELECT json_build_object(
    'total_productos', COUNT(*),
    'productos_activos', COUNT(*) FILTER (WHERE estado = 'activo'),
    'productos_agotados', COUNT(*) FILTER (WHERE estado = 'agotado'),
    'valor_total_inventario', COALESCE(SUM(stock_actual * precio), 0),
    'productos_stock_bajo', COUNT(*) FILTER (WHERE stock_actual <= stock_minimo)
  )
  INTO v_resultado
  FROM public.productos
  WHERE propietario_id = p_propietario_id
    AND tipo_propietario = p_tipo_propietario;
  
  RETURN v_resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario_movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;

-- Políticas para productos
CREATE POLICY "Usuarios pueden ver sus propios productos"
  ON public.productos FOR SELECT
  USING (
    tipo_propietario = 'individual' AND propietario_id = auth.uid()
    OR
    tipo_propietario = 'cooperativa' AND propietario_id IN (
      SELECT cooperativa_id FROM public.cooperativa_miembros WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden crear sus propios productos"
  ON public.productos FOR INSERT
  WITH CHECK (
    tipo_propietario = 'individual' AND propietario_id = auth.uid()
  );

CREATE POLICY "Cooperativas pueden crear productos"
  ON public.productos FOR INSERT
  WITH CHECK (
    tipo_propietario = 'cooperativa' AND propietario_id IN (
      SELECT cooperativa_id FROM public.cooperativa_miembros WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden actualizar sus productos"
  ON public.productos FOR UPDATE
  USING (
    tipo_propietario = 'individual' AND propietario_id = auth.uid()
    OR
    tipo_propietario = 'cooperativa' AND propietario_id IN (
      SELECT cooperativa_id FROM public.cooperativa_miembros WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden eliminar sus productos"
  ON public.productos FOR DELETE
  USING (
    tipo_propietario = 'individual' AND propietario_id = auth.uid()
    OR
    tipo_propietario = 'cooperativa' AND propietario_id IN (
      SELECT cooperativa_id FROM public.cooperativa_miembros WHERE user_id = auth.uid()
    )
  );

-- Política para ver todos los productos en marketplace (público)
CREATE POLICY "Todos pueden ver productos activos en marketplace"
  ON public.productos FOR SELECT
  USING (estado = 'activo');

-- Políticas para inventario_movimientos
CREATE POLICY "Usuarios pueden ver movimientos de sus productos"
  ON public.inventario_movimientos FOR SELECT
  USING (
    producto_id IN (
      SELECT id FROM public.productos 
      WHERE propietario_id = auth.uid() AND tipo_propietario = 'individual'
      OR propietario_id IN (
        SELECT cooperativa_id FROM public.cooperativa_miembros WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Usuarios pueden crear movimientos de sus productos"
  ON public.inventario_movimientos FOR INSERT
  WITH CHECK (
    producto_id IN (
      SELECT id FROM public.productos 
      WHERE propietario_id = auth.uid() AND tipo_propietario = 'individual'
      OR propietario_id IN (
        SELECT cooperativa_id FROM public.cooperativa_miembros WHERE user_id = auth.uid()
      )
    )
    AND realizado_por = auth.uid()
  );

-- Políticas para ventas
CREATE POLICY "Usuarios pueden ver sus ventas"
  ON public.ventas FOR SELECT
  USING (
    vendedor_tipo = 'individual' AND vendedor_id = auth.uid()
    OR
    vendedor_tipo = 'cooperativa' AND vendedor_id IN (
      SELECT cooperativa_id FROM public.cooperativa_miembros WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden crear ventas"
  ON public.ventas FOR INSERT
  WITH CHECK (
    vendedor_tipo = 'individual' AND vendedor_id = auth.uid()
    OR
    vendedor_tipo = 'cooperativa' AND vendedor_id IN (
      SELECT cooperativa_id FROM public.cooperativa_miembros WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- =============================================
COMMENT ON TABLE public.productos IS 'Productos de usuarios individuales y cooperativas';
COMMENT ON TABLE public.inventario_movimientos IS 'Historial de movimientos de inventario (entradas, salidas, ajustes)';
COMMENT ON TABLE public.ventas IS 'Registro de ventas realizadas (puede ser simulado para reportes)';

COMMENT ON COLUMN public.productos.tipo_propietario IS 'Tipo de propietario: individual o cooperativa';
COMMENT ON COLUMN public.productos.propietario_id IS 'ID del usuario (individual) o cooperativa (cooperativa)';
COMMENT ON COLUMN public.productos.stock_actual IS 'Stock disponible en este momento';
COMMENT ON COLUMN public.productos.stock_minimo IS 'Stock mínimo para generar alertas';

COMMENT ON FUNCTION registrar_movimiento_inventario IS 'Función helper para registrar movimientos de inventario y actualizar stock automáticamente';
COMMENT ON FUNCTION obtener_productos_stock_bajo IS 'Obtiene productos con stock menor o igual al mínimo';
COMMENT ON FUNCTION obtener_estadisticas_productos IS 'Obtiene estadísticas generales de productos de un propietario';
