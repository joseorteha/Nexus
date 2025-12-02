import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  // Seguridad: nunca expongas tu API key en el cliente
  const apiKey = process.env.OPENAI_API_KEY;

  const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un asistente de soporte técnico de la plataforma NEXUS. Responde siempre en español, con un tono profesional, claro y amable."
        },
        { role: "user", content: message }
      ]
    })
  });

  const json = await respuesta.json();
  const text = json.choices?.[0]?.message?.content || "Error procesando la respuesta.";

  return NextResponse.json({ reply: text });
}



