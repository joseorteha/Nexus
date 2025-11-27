import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const form = await req.formData();
  const empresa = form.get("empresa") as string;
  const rfc = form.get("rfc") as string;
  const email = form.get("email") as string;
  const file = form.get("csf") as File;

  if (!file) {
    return NextResponse.json({ message: "No se envió la constancia SAT." });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // 🔍 VALIDACIÓN CON IA
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const resp = await client.responses.parse({
    model: "gpt-4o-mini",
    input: [
      { type: "input_text", text: "Analiza esta Constancia de Situación Fiscal y verifica autenticidad, RFC y nombre." },
      { type: "input_file", file: buffer },
    ],
    schema: {
      type: "object",
      properties: {
        rfc: { type: "string" },
        nombre: { type: "string" },
        esValida: { type: "boolean" },
      }
    }
  });

  const csf: any = resp.output;

  if (!csf.esValida || csf.rfc !== rfc) {
    return NextResponse.json({
      message: "La constancia no es válida o no coincide con el RFC.",
    });
  }

  // 🔐 CREACIÓN DEL USUARIO EN SUPABASE
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: false,
    user_metadata: {
      empresa,
      rfc,
      tipo: "empresa_verificada",
    },
  });

  if (error) {
    return NextResponse.json({ message: "Error creando usuario.", error });
  }

  return NextResponse.json({
    message: "Empresa registrada correctamente. Revisa tu correo.",
  });
}
