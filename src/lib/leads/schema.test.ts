import { describe, expect, it } from "vitest";
import { parseLeadInput } from "./schema";

const valid = {
  name: "Maria Silva",
  whatsapp: "(16) 99999-1234",
  city: "Ribeirão Preto",
  uf: "SP",
  category: "carro",
  tireDescription: "205/55 R16, 4 pneus",
};

describe("parseLeadInput", () => {
  it("normalizes a valid lead", () => {
    expect(parseLeadInput(valid)).toEqual({ ok: true, value: { ...valid, whatsapp: "16999991234", utmSource: "", utmMedium: "", utmCampaign: "" } });
  });
  it("rejects missing fields", () => {
    const result = parseLeadInput({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors)).toHaveLength(6);
  });
  it("rejects invalid WhatsApp and category", () => {
    const result = parseLeadInput({ ...valid, whatsapp: "123", category: "bicicleta" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toHaveProperty("whatsapp");
    if (!result.ok) expect(result.errors).toHaveProperty("category");
  });
  it("rejects oversized tire descriptions", () => {
    const result = parseLeadInput({ ...valid, tireDescription: "x".repeat(301) });
    expect(result.ok).toBe(false);
  });
});
