import type { LeadInput } from "./destination";

const categories = new Set(["moto", "carro", "suv-picape", "caminhao", "agricola"]);
const ufs = new Set(["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]);

export function parseLeadInput(value: unknown): { ok: true; value: LeadInput } | { ok: false; errors: Record<string, string> } {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const errors: Record<string, string> = {};
  const text = (key: string, min: number, max: number) => {
    const raw = input[key];
    const normalized = typeof raw === "string" ? raw.trim().replace(/\s+/g, " ") : "";
    if (normalized.length < min || normalized.length > max) errors[key] = "Informe um valor válido.";
    return normalized;
  };
  const name = text("name", 2, 100);
  const city = text("city", 2, 100);
  const tireDescription = text("tireDescription", 3, 300);
  const whatsapp = typeof input.whatsapp === "string" ? input.whatsapp.replace(/\D/g, "") : "";
  if (!/^\d{10,11}$/.test(whatsapp)) errors.whatsapp = "Informe um WhatsApp válido com DDD.";
  
  const category = input.category;
  if (typeof category !== "string" || !categories.has(category)) errors.category = "Selecione uma categoria válida.";
  
  const uf = typeof input.uf === "string" ? input.uf.trim().toUpperCase() : "";
  if (!ufs.has(uf)) errors.uf = "Selecione um estado válido.";

  const utmSource = typeof input.utmSource === "string" ? input.utmSource.slice(0, 100) : "";
  const utmMedium = typeof input.utmMedium === "string" ? input.utmMedium.slice(0, 100) : "";
  const utmCampaign = typeof input.utmCampaign === "string" ? input.utmCampaign.slice(0, 100) : "";

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { name, whatsapp, city, uf, category: category as LeadInput["category"], tireDescription, utmSource, utmMedium, utmCampaign } };
}

