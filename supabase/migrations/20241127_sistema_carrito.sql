-- =====================================================
-- MIGRACIÓN: Sistema de Carrito de Compras
-- Fecha: 2024-11-27
-- Descripción: Tablas para gestión de carritos y pedidos
-- =====================================================

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

-- Índices
CREATE INDEX idx_carritos_user_id ON public.carritos(user_id);
CREATE INDEX idx_carritos_producto_id ON public.carritos(producto_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_carritos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Índices
CREATE INDEX idx_pedidos_user_id ON public.pedidos(user_id);
CREATE INDEX idx_pedidos_estado ON public.pedidos(estado);
CREATE INDEX idx_pedidos_created_at ON public.pedidos(created_at DESC);

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

-- Índices
CREATE INDEX idx_pedidos_items_pedido_id ON public.pedidos_items(pedido_id);
CREATE INDEX idx_pedidos_items_producto_id ON public.pedidos_items(producto_id);

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE public.carritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_items ENABLE ROW LEVEL SECURITY;

-- Políticas para carritos
CREATE POLICY "Users can view their own cart"
  ON public.carritos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own cart"
  ON public.carritos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart"
  ON public.carritos
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own cart"
  ON public.carritos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para pedidos
CREATE POLICY "Users can view their own orders"
  ON public.pedidos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.pedidos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para pedidos_items
CREATE POLICY "Users can view their own order items"
  ON public.pedidos_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pedidos
      WHERE pedidos.id = pedidos_items.pedido_id
      AND pedidos.user_id = auth.uid()
    )
  );

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para obtener el total del carrito de un usuario
CREATE OR REPLACE FUNCTION get_cart_total(p_user_id uuid)
RETURNS numeric AS $$
  SELECT COALESCE(SUM(cantidad * precio_unitario), 0)
  FROM public.carritos
  WHERE user_id = p_user_id;
$$ LANGUAGE sql STABLE;

-- Función para limpiar el carrito después de crear un pedido
CREATE OR REPLACE FUNCTION clear_cart(p_user_id uuid)
RETURNS void AS $$
  DELETE FROM public.carritos WHERE user_id = p_user_id;
$$ LANGUAGE sql;

-- =====================================================
-- DATOS DE PRUEBA (Opcional)
-- =====================================================
-- Descomentar para insertar productos de ejemplo
/*
INSERT INTO public.productos (nombre, descripcion, categoria, precio, unidad_medida, tipo_propietario, propietario_id, stock_actual, imagen_url)
VALUES 
  ('Café Orgánico', 'Café de altura cultivado en Chiapas', 'Alimentos', 150.00, 'kg', 'cooperativa', (SELECT id FROM auth.users LIMIT 1), 100, 'https://example.com/cafe.jpg'),
  ('Miel de Abeja', 'Miel pura de flores silvestres', 'Alimentos', 80.00, 'litro', 'individual', (SELECT id FROM auth.users LIMIT 1), 50, 'https://example.com/miel.jpg'),
  ('Textil Artesanal', 'Textil tejido a mano con técnicas tradicionales', 'Artesanías', 350.00, 'pieza', 'cooperativa', (SELECT id FROM auth.users LIMIT 1), 20, 'https://example.com/textil.jpg');
*/

-- Verificar creación
SELECT 'Sistema de carrito creado exitosamente' as mensaje;
