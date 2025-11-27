-- Sistema de Chat para Match de Cooperativas
-- Permite conversaciones entre usuarios y cooperativas antes de unirse

-- Tabla de conversaciones de chat
CREATE TABLE IF NOT EXISTS public.chat_conversaciones (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  cooperativa_id uuid NOT NULL,
  estado text DEFAULT 'activa'::text CHECK (estado = ANY (ARRAY['activa'::text, 'cerrada'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_conversaciones_pkey PRIMARY KEY (id),
  CONSTRAINT chat_conversaciones_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT chat_conversaciones_cooperativa_id_fkey FOREIGN KEY (cooperativa_id) REFERENCES public.cooperativas(id) ON DELETE CASCADE,
  -- Una conversación única por usuario y cooperativa
  CONSTRAINT chat_conversaciones_unique UNIQUE (user_id, cooperativa_id)
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS public.chat_mensajes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  conversacion_id uuid NOT NULL,
  user_id uuid NOT NULL,
  mensaje text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_mensajes_pkey PRIMARY KEY (id),
  CONSTRAINT chat_mensajes_conversacion_id_fkey FOREIGN KEY (conversacion_id) REFERENCES public.chat_conversaciones(id) ON DELETE CASCADE,
  CONSTRAINT chat_mensajes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_chat_conversaciones_user ON public.chat_conversaciones(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversaciones_cooperativa ON public.chat_conversaciones(cooperativa_id);
CREATE INDEX IF NOT EXISTS idx_chat_mensajes_conversacion ON public.chat_mensajes(conversacion_id);
CREATE INDEX IF NOT EXISTS idx_chat_mensajes_created ON public.chat_mensajes(created_at DESC);

-- RLS Policies para chat_conversaciones
ALTER TABLE public.chat_conversaciones ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver sus propias conversaciones
CREATE POLICY "Usuarios pueden ver sus conversaciones"
  ON public.chat_conversaciones FOR SELECT
  USING (auth.uid() = user_id);

-- Creadores de cooperativas pueden ver conversaciones de su cooperativa
CREATE POLICY "Creadores ven conversaciones de su cooperativa"
  ON public.chat_conversaciones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cooperativas
      WHERE id = cooperativa_id AND creada_por = auth.uid()
    )
  );

-- Usuarios pueden crear conversaciones
CREATE POLICY "Usuarios pueden crear conversaciones"
  ON public.chat_conversaciones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies para chat_mensajes
ALTER TABLE public.chat_mensajes ENABLE ROW LEVEL SECURITY;

-- Usuarios en la conversación pueden ver mensajes
CREATE POLICY "Ver mensajes de conversación"
  ON public.chat_mensajes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversaciones
      WHERE id = conversacion_id 
      AND (user_id = auth.uid() OR 
           cooperativa_id IN (
             SELECT id FROM public.cooperativas WHERE creada_por = auth.uid()
           ))
    )
  );

-- Usuarios pueden enviar mensajes en sus conversaciones
CREATE POLICY "Enviar mensajes"
  ON public.chat_mensajes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.chat_conversaciones
      WHERE id = conversacion_id 
      AND (user_id = auth.uid() OR 
           cooperativa_id IN (
             SELECT id FROM public.cooperativas WHERE creada_por = auth.uid()
           ))
    )
  );

-- Función para actualizar el timestamp de la conversación
CREATE OR REPLACE FUNCTION update_conversacion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_conversaciones
  SET updated_at = now()
  WHERE id = NEW.conversacion_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar timestamp cuando hay nuevo mensaje
DROP TRIGGER IF EXISTS trigger_update_conversacion ON public.chat_mensajes;
CREATE TRIGGER trigger_update_conversacion
  AFTER INSERT ON public.chat_mensajes
  FOR EACH ROW
  EXECUTE FUNCTION update_conversacion_timestamp();

-- Agregar campos opcionales a empresas que faltan
ALTER TABLE public.empresas 
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS ciudad text,
  ADD COLUMN IF NOT EXISTS estado text,
  ADD COLUMN IF NOT EXISTS categoria_productos text[],
  ADD COLUMN IF NOT EXISTS descripcion_necesidades text,
  ADD COLUMN IF NOT EXISTS volumen_demanda text,
  ADD COLUMN IF NOT EXISTS frecuencia_compra text;

COMMENT ON TABLE public.chat_conversaciones IS 'Conversaciones entre usuarios y cooperativas durante el proceso de match';
COMMENT ON TABLE public.chat_mensajes IS 'Mensajes dentro de conversaciones de chat';
