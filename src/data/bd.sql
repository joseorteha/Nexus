-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

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
CREATE TABLE public.perfil_incompleto (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  campos_pendientes jsonb NOT NULL DEFAULT '[]'::jsonb,
  ultima_actualizacion timestamp with time zone DEFAULT now(),
  recordatorios_enviados integer DEFAULT 0,
  CONSTRAINT perfil_incompleto_pkey PRIMARY KEY (id),
  CONSTRAINT perfil_incompleto_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
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