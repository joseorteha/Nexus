"use server";

// 💘 SERVER ACTIONS - MATCH
// Responsable: Jose

export async function getMatches() {
  // TODO: Obtener matches disponibles
  return [];
}

export async function swipeAction(companyId: string, action: "like" | "pass") {
  // TODO: Procesar swipe
  console.log("Swipe:", companyId, action);
}

export async function sendMessage(matchId: string, message: string) {
  // TODO: Enviar mensaje en chat
  console.log("Message sent:", matchId, message);
}
