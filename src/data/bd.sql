-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.carritos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  producto_id uuid NOT NULL,
  cantidad integer NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  precio_unitario numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT carritos_pkey PRIMARY KEY (id),
  CONSTRAINT carritos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT carritos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id)
);
CREATE TABLE public.chat_conversaciones (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  cooperativa_id uuid NOT NULL,
  estado text DEFAULT 'activa'::text CHECK (estado = ANY (ARRAY['activa'::text, 'cerrada'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_conversaciones_pkey PRIMARY KEY (id),
  CONSTRAINT chat_conversaciones_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT chat_conversaciones_cooperativa_id_fkey FOREIGN KEY (cooperativa_id) REFERENCES public.cooperativas(id)
);
CREATE TABLE public.chat_mensajes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  conversacion_id uuid NOT NULL,
  user_id uuid NOT NULL,
  mensaje text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_mensajes_pkey PRIMARY KEY (id),
  CONSTRAINT chat_mensajes_conversacion_id_fkey FOREIGN KEY (conversacion_id) REFERENCES public.chat_conversaciones(id),
  CONSTRAINT chat_mensajes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.cooperativa_miembros (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  cooperativa_id uuid NOT NULL,
  user_id uuid NOT NULL,
  rol text DEFAULT 'miembro'::text,
  fecha_ingreso timestamp with time zone DEFAULT now(),
  CONSTRAINT cooperativa_miembros_pkey PRIMARY KEY (id),
  CONSTRAINT cooperativa_miembros_cooperativa_id_fkey FOREIGN KEY (cooperativa_id) REFERENCES public.cooperativas(id),
  CONSTRAINT cooperativa_miembros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.cooperativas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nombre text NOT NULL,
  descripcion text,
  fecha_creacion timestamp with time zone DEFAULT now(),
  creada_por uuid,
  categoria ARRAY,
  region text,
  logo text,
  certificaciones ARRAY,
  capacidad_produccion text,
  total_miembros integer DEFAULT 1,
  total_productos integer DEFAULT 0,
  total_ventas numeric DEFAULT 0,
  estado text DEFAULT 'active'::text CHECK (estado = ANY (ARRAY['active'::text, 'pending'::text, 'inactive'::text])),
  buscando_miembros boolean DEFAULT true,
  miembros_objetivo integer DEFAULT 10,
  productos_ofrecidos ARRAY,
  CONSTRAINT cooperativas_pkey PRIMARY KEY (id),
  CONSTRAINT cooperativas_creada_por_fkey FOREIGN KEY (creada_por) REFERENCES auth.users(id)
);
CREATE TABLE public.empresas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  razon_social text NOT NULL,
  rfc text NOT NULL,
  sector text,
  telefono text,
  direccion text,
  created_at timestamp with time zone DEFAULT now(),
  email text,
  ciudad text,
  estado text,
  categoria_productos ARRAY,
  descripcion_necesidades text,
  volumen_demanda text,
  frecuencia_compra text,
  CONSTRAINT empresas_pkey PRIMARY KEY (id),
  CONSTRAINT empresas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.onboarding_empresa (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE,
  nombre_empresa text NOT NULL,
  rfc text NOT NULL,
  productos_necesitados ARRAY NOT NULL,
  categorias ARRAY NOT NULL,
  volumen_compra text,
  frecuencia_compra text,
  presupuesto text,
  requisitos ARRAY,
  region text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT onboarding_empresa_pkey PRIMARY KEY (id),
  CONSTRAINT onboarding_empresa_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.onboarding_normal (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE,
  productos ARRAY NOT NULL,
  categorias ARRAY NOT NULL,
  capacidad_produccion text,
  region text,
  objetivo text CHECK (objetivo = ANY (ARRAY['crear_cooperativa'::text, 'unirse_cooperativa'::text, 'vender_individual'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT onboarding_normal_pkey PRIMARY KEY (id),
  CONSTRAINT onboarding_normal_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.pedidos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  total numeric NOT NULL CHECK (total >= 0::numeric),
  estado text NOT NULL DEFAULT 'pendiente'::text CHECK (estado = ANY (ARRAY['pendiente'::text, 'procesando'::text, 'completado'::text, 'cancelado'::text])),
  direccion_envio text,
  notas text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pedidos_pkey PRIMARY KEY (id),
  CONSTRAINT pedidos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.pedidos_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  pedido_id uuid NOT NULL,
  producto_id uuid NOT NULL,
  cantidad integer NOT NULL CHECK (cantidad > 0),
  precio_unitario numeric NOT NULL,
  subtotal numeric NOT NULL,
  CONSTRAINT pedidos_items_pkey PRIMARY KEY (id),
  CONSTRAINT pedidos_items_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id),
  CONSTRAINT pedidos_items_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id)
);
CREATE TABLE public.perfil_incompleto (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  campos_pendientes jsonb NOT NULL DEFAULT '[]'::jsonb,
  ultima_actualizacion timestamp with time zone DEFAULT now(),
  recordatorios_enviados integer DEFAULT 0,
  CONSTRAINT perfil_incompleto_pkey PRIMARY KEY (id),
  CONSTRAINT perfil_incompleto_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.productos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nombre text NOT NULL,
  descripcion text,
  categoria text NOT NULL,
  precio numeric NOT NULL CHECK (precio >= 0::numeric),
  unidad_medida text NOT NULL DEFAULT 'unidad'::text CHECK (unidad_medida = ANY (ARRAY['kg'::text, 'litro'::text, 'pieza'::text, 'unidad'::text, 'caja'::text, 'tonelada'::text])),
  imagen_url text,
  tipo_propietario text NOT NULL CHECK (tipo_propietario = ANY (ARRAY['individual'::text, 'cooperativa'::text])),
  propietario_id uuid NOT NULL,
  stock_actual integer NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
  stock_minimo integer NOT NULL DEFAULT 5 CHECK (stock_minimo >= 0),
  estado text NOT NULL DEFAULT 'activo'::text CHECK (estado = ANY (ARRAY['activo'::text, 'agotado'::text, 'inactivo'::text])),
  sku text,
  certificaciones ARRAY,
  region text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT productos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.solicitudes_cooperativas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['crear'::text, 'unirse'::text])),
  user_id uuid NOT NULL,
  nombre_usuario text NOT NULL,
  email_usuario text NOT NULL,
  cooperativa_id uuid,
  nombre_cooperativa text NOT NULL,
  datos_cooperativa jsonb,
  estado text NOT NULL DEFAULT 'pendiente'::text CHECK (estado = ANY (ARRAY['pendiente'::text, 'aprobada'::text, 'rechazada'::text])),
  fecha_solicitud timestamp with time zone DEFAULT now(),
  revisada_por uuid,
  fecha_revision timestamp with time zone,
  notas_revision text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT solicitudes_cooperativas_pkey PRIMARY KEY (id),
  CONSTRAINT solicitudes_cooperativas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT solicitudes_cooperativas_cooperativa_id_fkey FOREIGN KEY (cooperativa_id) REFERENCES public.cooperativas(id),
  CONSTRAINT solicitudes_cooperativas_revisada_por_fkey FOREIGN KEY (revisada_por) REFERENCES auth.users(id)
);
CREATE TABLE public.usuarios (
  id uuid NOT NULL,
  nombre text,
  apellidos text,
  telefono text,
  avatar_url text,
  rol text NOT NULL DEFAULT 'normal_user'::text,
  tipo_usuario text NOT NULL DEFAULT 'normal'::text,
  created_at timestamp with time zone DEFAULT now(),
  onboarding_completed boolean DEFAULT false,
  onboarding_skipped boolean DEFAULT false,
  onboarding_completed_at timestamp with time zone,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);