"use server";

// 🔐 SERVER ACTIONS - AUTENTICACIÓN
// Responsable: Jose

export async function loginAction(email: string, password: string) {
  // TODO: Implementar lógica de login
  console.log("Login attempt:", email);
}

export async function registerAction(userData: any) {
  // TODO: Implementar lógica de registro
  console.log("Register attempt:", userData);
}

export async function logoutAction() {
  // TODO: Implementar lógica de logout
  console.log("Logout");
}
