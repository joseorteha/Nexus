"use server";

// 💘 SERVER ACTIONS - MATCH
// Responsable: Jose

import companiesData from "@/data/companies.json";
import type { Company, MatchResult } from "@/types/nexus";

const companies: Company[] = companiesData as Company[];

/**
 * Obtiene matches potenciales para una empresa
 * Algoritmo: Coincidencia entre offers y needs + proximidad geográfica + urgencia
 */
export async function getMatches(currentCompanyId: string = "1"): Promise<MatchResult[]> {
  const currentCompany = companies.find(c => c.id === currentCompanyId);
  
  if (!currentCompany) {
    return [];
  }

  const matches: MatchResult[] = companies
    .filter(company => company.id !== currentCompanyId)
    .map(company => {
      let score = 0;
      const reasons: string[] = [];

      // 1. COINCIDENCIA OFERTA-NECESIDAD (40 puntos)
      const currentOffers = currentCompany.offers.map(o => o.toLowerCase());
      const currentNeeds = currentCompany.needs.map(n => n.toLowerCase());
      const companyOffers = company.offers.map(o => o.toLowerCase());
      const companyNeeds = company.needs.map(n => n.toLowerCase());

      // Lo que yo necesito está en lo que ellos ofrecen
      const needMatches = currentNeeds.filter(need =>
        companyOffers.some(offer => 
          offer.includes(need) || need.includes(offer)
        )
      );

      // Lo que yo ofrezco está en lo que ellos necesitan
      const offerMatches = currentOffers.filter(offer =>
        companyNeeds.some(need =>
          need.includes(offer) || offer.includes(need)
        )
      );

      if (needMatches.length > 0) {
        score += 20 * needMatches.length;
        reasons.push(`Ellos ofrecen lo que necesitas: ${needMatches.join(", ")}`);
      }

      if (offerMatches.length > 0) {
        score += 20 * offerMatches.length;
        reasons.push(`Ellos necesitan lo que ofreces: ${offerMatches.join(", ")}`);
      }

      // 2. PROXIMIDAD GEOGRÁFICA (15 puntos)
      if (company.polo === currentCompany.polo) {
        score += 15;
        reasons.push(`Mismo polo: ${company.polo}`);
      } else if (
        (currentCompany.polo === "Zongolica" && company.polo === "Orizaba") ||
        (currentCompany.polo === "Orizaba" && company.polo === "Córdoba")
      ) {
        score += 8;
        reasons.push(`Polo cercano: ${company.polo}`);
      }

      // 3. URGENCIA (15 puntos)
      if (company.urgency === "Alta" || currentCompany.urgency === "Alta") {
        score += 15;
        reasons.push("Urgencia alta detectada");
      } else if (company.urgency === "Media" || currentCompany.urgency === "Media") {
        score += 8;
      }

      // 4. FINANCIAMIENTO (20 puntos)
      if (
        (currentCompany.financing === "Busca" && company.financing === "Ofrece") ||
        (currentCompany.financing === "Ofrece" && company.financing === "Busca")
      ) {
        score += 20;
        reasons.push(
          company.financing === "Ofrece"
            ? "Pueden financiarte"
            : "Puedes financiarlos"
        );
      }

      // 5. INDUSTRIA COMPLEMENTARIA (10 puntos)
      const complementaryIndustries: Record<string, string[]> = {
        "Agroindustria": ["Logística", "Comercio"],
        "Logística": ["Agroindustria", "Comercio"],
        "Comercio": ["Agroindustria", "Artesanía"],
        "Artesanía": ["Comercio"],
        "Tecnología": ["Agroindustria", "Logística", "Servicios"]
      };

      if (complementaryIndustries[currentCompany.industry]?.includes(company.industry)) {
        score += 10;
        reasons.push("Industria complementaria");
      }

      // 6. TIPO DE EMPRESA (NODESS) (5 puntos bonus)
      if (company.type === "Cooperativa" || company.type === "Empresa Social") {
        score += 5;
        reasons.push(`${company.type} - Prioridad NODESS`);
      }

      // Determinar tipo de match
      let matchType: "provider" | "client" | "partner" | "financing" = "partner";
      if (needMatches.length > offerMatches.length) matchType = "provider";
      else if (offerMatches.length > needMatches.length) matchType = "client";
      else if (
        currentCompany.financing === "Busca" && company.financing === "Ofrece"
      ) matchType = "financing";

      return {
        company,
        score: Math.min(score, 100), // Cap a 100
        reasons: reasons.length > 0 ? reasons : ["Potencial aliado en la región"],
        matchType
      };
    })
    .filter(match => match.score > 0) // Solo matches con algún score
    .sort((a, b) => b.score - a.score); // Ordenar por score

  return matches;
}

/**
 * Registra un swipe (Like o Pass)
 */
export async function swipeAction(companyId: string, action: "like" | "pass") {
  // TODO: Guardar en base de datos cuando se implemente
  console.log(`Swipe ${action} on company ${companyId}`);
  
  // Si es "like", verificar si hay match mutuo
  if (action === "like") {
    // Aquí iría la lógica de verificar si la otra empresa también dio like
    return { matched: true, matchId: `match-${Date.now()}` };
  }
  
  return { matched: false };
}

/**
 * Obtiene la lista de matches confirmados
 */
export async function getConfirmedMatches(companyId: string = "1") {
  // TODO: Obtener de base de datos los matches mutuos
  // Por ahora retornamos las 3 primeras empresas como ejemplo
  return companies.slice(1, 4);
}

/**
 * Envía un mensaje en el chat
 */
export async function sendMessage(matchId: string, message: string) {
  // TODO: Guardar mensaje en base de datos
  console.log(`Message sent to match ${matchId}:`, message);
  return { success: true, messageId: `msg-${Date.now()}` };
}
