import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const PRODUCTS_FILE = join(process.cwd(), "src/app/data", "products.json");

export async function GET() {
  try {
    const fileContent = await readFile(PRODUCTS_FILE, "utf-8");
    const data = JSON.parse(fileContent);

    return Response.json(data);
  } catch (error) {
    console.error("Error al leer productos:", error);
    return Response.json(
      { error: "No se pudieron cargar los productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();

    // Validar campos requeridos
    if (!newProduct.name || !newProduct.price) {
      return Response.json(
        { error: "El nombre y precio son requeridos" },
        { status: 400 }
      );
    }

    // Leer productos existentes
    const fileContent = await readFile(PRODUCTS_FILE, "utf-8");
    const products = JSON.parse(fileContent);

    // Generar nuevo ID
    const maxId = Math.max(...products.map((p: any) => parseInt(p.id) || 0), 0);
    const newId = (maxId + 1).toString();

    // Agregar producto con ID generado
    const productToAdd = {
      id: newId,
      name: newProduct.name,
      description: newProduct.description || "",
      category: newProduct.category || "General",
      rating: newProduct.rating || 0,
      ownerId: newProduct.ownerId || "unknown",
      price: newProduct.price,
      polo: newProduct.polo || "General",
      offers: newProduct.offers || [],
      imageUrl: newProduct.imageUrl || "",
      logoUrl: newProduct.logoUrl || "",
    };

    products.push(productToAdd);

    // Guardar productos actualizados
    await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");

    return Response.json(
      { success: true, product: productToAdd },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al agregar producto:", error);
    return Response.json(
      { error: "Error al agregar el producto" },
      { status: 500 }
    );
  }
}

