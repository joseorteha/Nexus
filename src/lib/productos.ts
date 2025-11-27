import { supabase } from "@/app/lib/supabase/client";

// =============================================
// TIPOS
// =============================================

export type TipoPropietario = "individual" | "cooperativa";
export type EstadoProducto = "activo" | "agotado" | "inactivo";
export type UnidadMedida = "kg" | "litro" | "pieza" | "unidad" | "caja" | "tonelada";
export type TipoMovimiento = "entrada" | "salida" | "ajuste";
export type MotivoMovimiento = "venta" | "produccion" | "devolucion" | "ajuste" | "merma" | "stock_inicial";

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  precio: number;
  unidad_medida: UnidadMedida;
  imagen_url?: string;
  tipo_propietario: TipoPropietario;
  propietario_id: string;
  stock_actual: number;
  stock_minimo: number;
  estado: EstadoProducto;
  sku?: string;
  certificaciones?: string[];
  region?: string;
  created_at: string;
  updated_at: string;
}

export interface MovimientoInventario {
  id: string;
  producto_id: string;
  tipo_movimiento: TipoMovimiento;
  cantidad: number;
  motivo: MotivoMovimiento;
  stock_anterior: number;
  stock_nuevo: number;
  notas?: string;
  referencia?: string;
  realizado_por: string;
  created_at: string;
}

export interface EstadisticasProductos {
  total_productos: number;
  productos_activos: number;
  productos_agotados: number;
  valor_total_inventario: number;
  productos_stock_bajo: number;
}

// =============================================
// FUNCIONES DE PRODUCTOS
// =============================================

/**
 * Obtener productos de un propietario
 */
export async function obtenerProductos(
  propietarioId: string,
  tipoPropietario: TipoPropietario
) {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("propietario_id", propietarioId)
    .eq("tipo_propietario", tipoPropietario)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Producto[];
}

/**
 * Obtener un producto por ID
 */
export async function obtenerProductoPorId(id: string) {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Producto;
}

/**
 * Crear un nuevo producto
 */
export async function crearProducto(producto: Omit<Producto, "id" | "created_at" | "updated_at" | "estado">) {
  const { data, error } = await supabase
    .from("productos")
    .insert(producto)
    .select()
    .single();

  if (error) throw error;

  // Registrar movimiento inicial de stock
  if (data && producto.stock_actual > 0) {
    await registrarMovimiento({
      producto_id: data.id,
      tipo_movimiento: "entrada",
      cantidad: producto.stock_actual,
      motivo: "stock_inicial",
      realizado_por: producto.propietario_id,
    });
  }

  return data as Producto;
}

/**
 * Actualizar un producto
 */
export async function actualizarProducto(id: string, cambios: Partial<Producto>) {
  const { data, error } = await supabase
    .from("productos")
    .update(cambios)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Producto;
}

/**
 * Eliminar un producto
 */
export async function eliminarProducto(id: string) {
  const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * Obtener productos con stock bajo
 */
export async function obtenerProductosStockBajo(
  propietarioId: string,
  tipoPropietario: TipoPropietario
) {
  // Obtener todos los productos y filtrar en cliente
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("propietario_id", propietarioId)
    .eq("tipo_propietario", tipoPropietario)
    .eq("estado", "activo")
    .order("stock_actual", { ascending: true });

  if (error) throw error;
  
  // Filtrar productos con stock <= stock_minimo
  const productosStockBajo = (data as Producto[]).filter(
    (p) => p.stock_actual <= p.stock_minimo
  );
  
  return productosStockBajo;
}

/**
 * Obtener estadísticas de productos
 */
export async function obtenerEstadisticas(
  propietarioId: string,
  tipoPropietario: TipoPropietario
): Promise<EstadisticasProductos> {
  const { data, error } = await supabase.rpc("obtener_estadisticas_productos", {
    p_propietario_id: propietarioId,
    p_tipo_propietario: tipoPropietario,
  });

  if (error) throw error;
  return data as EstadisticasProductos;
}

// =============================================
// FUNCIONES DE INVENTARIO
// =============================================

/**
 * Registrar movimiento de inventario
 */
export async function registrarMovimiento(movimiento: {
  producto_id: string;
  tipo_movimiento: TipoMovimiento;
  cantidad: number;
  motivo: MotivoMovimiento;
  realizado_por: string;
  notas?: string;
  referencia?: string;
}) {
  const { data, error } = await supabase.rpc("registrar_movimiento_inventario", {
    p_producto_id: movimiento.producto_id,
    p_tipo_movimiento: movimiento.tipo_movimiento,
    p_cantidad: movimiento.cantidad,
    p_motivo: movimiento.motivo,
    p_realizado_por: movimiento.realizado_por,
    p_notas: movimiento.notas || null,
    p_referencia: movimiento.referencia || null,
  });

  if (error) throw error;
  return data;
}

/**
 * Obtener movimientos de un producto
 */
export async function obtenerMovimientos(productoId: string, limit = 50) {
  const { data, error } = await supabase
    .from("inventario_movimientos")
    .select("*")
    .eq("producto_id", productoId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as MovimientoInventario[];
}

/**
 * Obtener todos los movimientos de un propietario
 */
export async function obtenerTodosMovimientos(
  propietarioId: string,
  tipoPropietario: TipoPropietario,
  limit = 100
) {
  // Primero obtener los IDs de productos del propietario
  const { data: productos } = await supabase
    .from("productos")
    .select("id")
    .eq("propietario_id", propietarioId)
    .eq("tipo_propietario", tipoPropietario);

  if (!productos || productos.length === 0) return [];

  const productosIds = productos.map((p) => p.id);

  const { data, error } = await supabase
    .from("inventario_movimientos")
    .select(`
      *,
      productos (
        nombre,
        unidad_medida
      )
    `)
    .in("producto_id", productosIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// =============================================
// FUNCIONES DE VENTAS (SIMULADO)
// =============================================

/**
 * Generar ventas simuladas para dashboard
 */
export function generarVentasSimuladas(cantidadDias = 30) {
  const ventas = [];
  const hoy = new Date();

  for (let i = 0; i < cantidadDias; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - i);

    // Generar entre 1-5 ventas por día
    const ventasPorDia = Math.floor(Math.random() * 5) + 1;

    for (let j = 0; j < ventasPorDia; j++) {
      const cantidad = Math.floor(Math.random() * 50) + 1;
      const precioUnitario = parseFloat((Math.random() * 100 + 10).toFixed(2));

      ventas.push({
        id: `sim-${i}-${j}`,
        fecha: fecha.toISOString(),
        cantidad,
        precio_unitario: precioUnitario,
        total: cantidad * precioUnitario,
        comprador: `Cliente ${Math.floor(Math.random() * 100)}`,
        estado: "completada",
      });
    }
  }

  return ventas;
}

/**
 * Obtener estadísticas de ventas simuladas
 */
export function obtenerEstadisticasVentas(ventas: any[]) {
  const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
  const totalUnidades = ventas.reduce((sum, v) => sum + v.cantidad, 0);
  const promedioVenta = ventas.length > 0 ? totalVentas / ventas.length : 0;

  // Ventas por día (últimos 7 días)
  const hoy = new Date();
  const ventasPorDia = [];
  
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - i);
    const fechaStr = fecha.toISOString().split('T')[0];
    
    const ventasDia = ventas.filter(v => 
      v.fecha.split('T')[0] === fechaStr
    );
    
    ventasPorDia.push({
      fecha: fechaStr,
      ventas: ventasDia.length,
      total: ventasDia.reduce((sum, v) => sum + v.total, 0),
    });
  }

  return {
    totalVentas,
    totalUnidades,
    promedioVenta,
    ventasPorDia,
    cantidadVentas: ventas.length,
  };
}

// =============================================
// UTILIDADES
// =============================================

/**
 * Formatear precio
 */
export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(precio);
}

/**
 * Obtener badge de estado
 */
export function obtenerBadgeEstado(estado: EstadoProducto) {
  const badges = {
    activo: { color: "green", texto: "Activo" },
    agotado: { color: "red", texto: "Agotado" },
    inactivo: { color: "gray", texto: "Inactivo" },
  };
  return badges[estado];
}

/**
 * Verificar si el stock está bajo
 */
export function esStockBajo(stockActual: number, stockMinimo: number): boolean {
  return stockActual <= stockMinimo;
}

/**
 * Calcular porcentaje de stock
 */
export function calcularPorcentajeStock(stockActual: number, stockMinimo: number): number {
  if (stockMinimo === 0) return 100;
  return Math.min(100, (stockActual / stockMinimo) * 100);
}
