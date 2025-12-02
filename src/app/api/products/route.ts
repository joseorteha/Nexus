import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

// GET /api/products - Obtener todos los productos del marketplace
export async function GET(request: NextRequest) {
  try {
    const { data: products, error } = await supabase
      .from("productos")
      .select(`
        *,
        usuarios:propietario_id(nombre, apellidos),
        cooperativas:propietario_id(nombre)
      `)
      .eq("estado", "activo");

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Error al obtener productos" },
        { status: 500 }
      );
    }

    // Transformar productos al formato esperado por el frontend
    const formattedProducts = (products || []).map((product) => ({
      id: product.id,
      name: product.nombre,
      description: product.descripcion,
      price: parseFloat(product.precio) || 0,
      polo: product.categoria || "General",
      category: product.categoria,
      imageUrl: product.imagen_url || "/placeholder.png",
      logoUrl: product.imagen_url || "/placeholder.png",
      offers: product.caracteristicas || [],
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/products - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, polo, category, imageUrl, logoUrl } = body;

    // Validaciones básicas
    if (!name || !price) {
      return NextResponse.json(
        { error: "Nombre y precio son requeridos" },
        { status: 400 }
      );
    }

    // Obtener usuario autenticado (esto requiere configuración adicional con auth)
    // Por ahora usamos un ID de ejemplo
    const userId = "user-id-placeholder";

    const { data: product, error } = await supabase
      .from("productos")
      .insert({
        nombre: name,
        descripcion: description,
        precio: price,
        categoria: category || polo || "General",
        imagen_url: imageUrl || logoUrl,
        propietario_id: userId,
        tipo_propietario: "individual",
        estado: "activo",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
        { error: "Error al crear producto" },
        { status: 500 }
      );
    }

    // Retornar en el formato esperado
    const formattedProduct = {
      id: product.id,
      name: product.nombre,
      description: product.descripcion,
      price: parseFloat(product.precio),
      polo: product.categoria,
      category: product.categoria,
      imageUrl: product.imagen_url,
      logoUrl: product.imagen_url,
    };

    return NextResponse.json({ product: formattedProduct }, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}



