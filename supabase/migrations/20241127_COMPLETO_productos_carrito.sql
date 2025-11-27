-- =====================================================
-- MIGRACIÓN COMPLETA: Productos, Inventario y Carrito
-- Fecha: 2024-11-27
-- Descripción: Sistema completo de marketplace
-- =====================================================

-- =====================================================
-- TABLA: productos
-- =====================================================
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
  sku text,
  certificaciones text[],
  region text,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT productos_pkey PRIMARY KEY (id)
);

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_productos_propietario ON public.productos(propietario_id, tipo_propietario);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON public.productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_estado ON public.productos(estado);

-- Trigger para actualizar updated_at en productos
CREATE OR REPLACE FUNCTION update_productos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS productos_updated_at ON public.productos;
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

DROP TRIGGER IF EXISTS trigger_actualizar_estado_producto ON public.productos;
CREATE TRIGGER trigger_actualizar_estado_producto
  BEFORE INSERT OR UPDATE OF stock_actual ON public.productos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_estado_producto();

-- =====================================================
-- TABLA: carritos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.carritos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  producto_id uuid NOT NULL,
  cantidad integer NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  precio_unitario numeric(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT carritos_pkey PRIMARY KEY (id),
  CONSTRAINT carritos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT carritos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE,
  CONSTRAINT carritos_unique_user_producto UNIQUE (user_id, producto_id)
);

-- Índices para carritos
CREATE INDEX IF NOT EXISTS idx_carritos_user_id ON public.carritos(user_id);
CREATE INDEX IF NOT EXISTS idx_carritos_producto_id ON public.carritos(producto_id);

-- Trigger para actualizar updated_at en carritos
CREATE OR REPLACE FUNCTION update_carritos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS carritos_updated_at ON public.carritos;
CREATE TRIGGER carritos_updated_at
  BEFORE UPDATE ON public.carritos
  FOR EACH ROW
  EXECUTE FUNCTION update_carritos_updated_at();

-- =====================================================
-- TABLA: pedidos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.pedidos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  total numeric(10,2) NOT NULL CHECK (total >= 0),
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesando', 'completado', 'cancelado')),
  direccion_envio text,
  notas text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT pedidos_pkey PRIMARY KEY (id),
  CONSTRAINT pedidos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para pedidos
CREATE INDEX IF NOT EXISTS idx_pedidos_user_id ON public.pedidos(user_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON public.pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON public.pedidos(created_at DESC);

-- =====================================================
-- TABLA: pedidos_items
-- =====================================================
CREATE TABLE IF NOT EXISTS public.pedidos_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  pedido_id uuid NOT NULL,
  producto_id uuid NOT NULL,
  cantidad integer NOT NULL CHECK (cantidad > 0),
  precio_unitario numeric(10,2) NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  
  CONSTRAINT pedidos_items_pkey PRIMARY KEY (id),
  CONSTRAINT pedidos_items_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE CASCADE,
  CONSTRAINT pedidos_items_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id)
);

-- Índices para pedidos_items
CREATE INDEX IF NOT EXISTS idx_pedidos_items_pedido_id ON public.pedidos_items(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_items_producto_id ON public.pedidos_items(producto_id);

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

-- Productos: Todos pueden ver, solo propietarios pueden editar
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active products" ON public.productos;
CREATE POLICY "Anyone can view active products"
  ON public.productos
  FOR SELECT
  USING (estado = 'activo');

DROP POLICY IF EXISTS "Owners can insert their products" ON public.productos;
CREATE POLICY "Owners can insert their products"
  ON public.productos
  FOR INSERT
  WITH CHECK (
    (tipo_propietario = 'individual' AND propietario_id = auth.uid()) OR
    (tipo_propietario = 'cooperativa')
  );

DROP POLICY IF EXISTS "Owners can update their products" ON public.productos;
CREATE POLICY "Owners can update their products"
  ON public.productos
  FOR UPDATE
  USING (
    (tipo_propietario = 'individual' AND propietario_id = auth.uid()) OR
    (tipo_propietario = 'cooperativa')
  );

-- Carritos: Solo el usuario puede ver y modificar su carrito
ALTER TABLE public.carritos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own cart" ON public.carritos;
CREATE POLICY "Users can view their own cart"
  ON public.carritos FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert into their own cart" ON public.carritos;
CREATE POLICY "Users can insert into their own cart"
  ON public.carritos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cart" ON public.carritos;
CREATE POLICY "Users can update their own cart"
  ON public.carritos FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from their own cart" ON public.carritos;
CREATE POLICY "Users can delete from their own cart"
  ON public.carritos FOR DELETE
  USING (auth.uid() = user_id);

-- Pedidos: Solo el usuario puede ver sus pedidos
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own orders" ON public.pedidos;
CREATE POLICY "Users can view their own orders"
  ON public.pedidos FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own orders" ON public.pedidos;
CREATE POLICY "Users can create their own orders"
  ON public.pedidos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Pedidos Items
ALTER TABLE public.pedidos_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own order items" ON public.pedidos_items;
CREATE POLICY "Users can view their own order items"
  ON public.pedidos_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pedidos
      WHERE pedidos.id = pedidos_items.pedido_id
      AND pedidos.user_id = auth.uid()
    )
  );

-- =====================================================
-- DATOS DE PRUEBA
-- =====================================================

-- Insertar productos de ejemplo (ajusta los propietario_id según tus usuarios)
INSERT INTO public.productos (nombre, descripcion, categoria, precio, unidad_medida, tipo_propietario, propietario_id, stock_actual, region, certificaciones, imagen_url)
SELECT 
  'Café Orgánico de Chiapas',
  'Café de altura cultivado en las montañas de Chiapas. Proceso 100% orgánico.',
  'Alimentos',
  150.00,
  'kg',
  'individual',
  id,
  100,
  'Chiapas',
  ARRAY['Orgánico', 'Comercio Justo'],
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500'
FROM auth.users LIMIT 1;

INSERT INTO public.productos (nombre, descripcion, categoria, precio, unidad_medida, tipo_propietario, propietario_id, stock_actual, region, certificaciones, imagen_url)
SELECT 
  'Miel de Abeja Pura',
  'Miel 100% pura de flores silvestres. Sin aditivos ni conservadores.',
  'Alimentos',
  80.00,
  'litro',
  'individual',
  id,
  50,
  'Yucatán',
  ARRAY['Orgánico'],
  'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=500'
FROM auth.users LIMIT 1;

INSERT INTO public.productos (nombre, descripcion, categoria, precio, unidad_medida, tipo_propietario, propietario_id, stock_actual, region, certificaciones, imagen_url)
SELECT 
  'Textil Artesanal Oaxaqueño',
  'Textil tejido a mano con técnicas tradicionales zapotecas.',
  'Artesanías',
  350.00,
  'pieza',
  'individual',
  id,
  20,
  'Oaxaca',
  ARRAY['Hecho a Mano', 'Comercio Justo'],
  'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500'
FROM auth.users LIMIT 1;

-- Verificar creación
SELECT 'Sistema completo creado exitosamente ✅' as mensaje;
SELECT 'Productos de ejemplo insertados: ' || COUNT(*)::text FROM public.productos;
