import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const COMPANIES_FILE = join(process.cwd(), "src/app/data", "companies.json");

export async function GET() {
  try {
    const fileContent = await readFile(COMPANIES_FILE, "utf-8");
    const data = JSON.parse(fileContent);

    return Response.json(data);
  } catch (error) {
    console.error("Error al leer empresas:", error);
    return Response.json(
      { error: "No se pudieron cargar las empresas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newCompany = await request.json();

    // Validar campos requeridos
    if (!newCompany.name || !newCompany.description) {
      return Response.json(
        { error: "El nombre y descripción son requeridos" },
        { status: 400 }
      );
    }

    // Leer empresas existentes
    const fileContent = await readFile(COMPANIES_FILE, "utf-8");
    const companies = JSON.parse(fileContent);

    // Generar nuevo ID
    const maxId = Math.max(...companies.map((c: any) => parseInt(c.id) || 0), 0);
    const newId = (maxId + 1).toString();

    // Agregar empresa con ID generado
    const companyToAdd = {
      id: newId,
      name: newCompany.name,
      description: newCompany.description,
      category: newCompany.category || "General",
      rating: parseFloat(newCompany.rating) || 0,
      ownerId: newCompany.ownerId || "unknown",
      logo: newCompany.logo || "",
      imageUrl: newCompany.imageUrl || "",
      website: newCompany.website || "",
      phone: newCompany.phone || "",
      email: newCompany.email || "",
      address: newCompany.address || "",
    };

    companies.push(companyToAdd);

    // Guardar empresas actualizadas
    await writeFile(COMPANIES_FILE, JSON.stringify(companies, null, 2), "utf-8");

    return Response.json(
      { success: true, company: companyToAdd },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al agregar empresa:", error);
    return Response.json(
      { error: "Error al agregar la empresa" },
      { status: 500 }
    );
  }
}
