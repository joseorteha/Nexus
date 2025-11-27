-- =====================================================
-- FIX: Agregar política INSERT para pedidos_items
-- =====================================================

-- Política para permitir que los usuarios creen items de sus propios pedidos
DROP POLICY IF EXISTS "Users can create their own order items" ON public.pedidos_items;
CREATE POLICY "Users can create their own order items"
  ON public.pedidos_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pedidos
      WHERE pedidos.id = pedidos_items.pedido_id
      AND pedidos.user_id = auth.uid()
    )
  );

-- Verificar políticas
SELECT 'Política de INSERT para pedidos_items creada exitosamente ✅' as mensaje;
