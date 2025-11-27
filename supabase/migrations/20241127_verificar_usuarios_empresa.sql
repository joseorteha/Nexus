-- Verificar usuarios empresa
SELECT 
  u.email,
  us.nombre,
  us.apellidos,
  us.tipo_usuario,
  us.rol,
  e.razon_social,
  e.rfc
FROM auth.users u
LEFT JOIN public.usuarios us ON u.id = us.id
LEFT JOIN public.empresas e ON u.id = e.user_id
WHERE e.user_id IS NOT NULL
ORDER BY u.created_at DESC;

-- Si encuentras usuarios con tipo_usuario != 'empresa', corrígelos:
UPDATE public.usuarios
SET tipo_usuario = 'empresa'
WHERE id IN (
  SELECT user_id FROM public.empresas
)
AND tipo_usuario != 'empresa';

-- Verificar el resultado
SELECT 
  us.nombre,
  us.tipo_usuario,
  e.razon_social
FROM public.usuarios us
JOIN public.empresas e ON us.id = e.user_id;
