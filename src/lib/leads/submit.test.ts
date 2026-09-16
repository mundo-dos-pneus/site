import { describe, expect, it } from "vitest";
import { submitLead } from "./submit";
import type { LeadDestination, LeadInput } from "./destination";

const lead: LeadInput = { name: "Maria Silva", whatsapp: "16999991234", city: "Ribeirão Preto", uf: "SP", category: "carro", tireDescription: "205/55 R16, 4 pneus" };

describe("submitLead", () => {
  it("rejects an empty destination list", async () => {
    expect(await submitLead(lead, [], "request-1")).toEqual({ ok: false, code: "NO_DESTINATION" });
  });
  it("does not claim success when a destination fails", async () => {
    const destination: LeadDestination = { name: "failed", send: async () => { throw new Error("down"); } };
    expect(await submitLead(lead, [destination], "request-1")).toEqual({ ok: false, code: "DELIVERY_FAILED" });
  });
  it("confirms only an accepted destination", async () => {
    const destination: LeadDestination = { name: "accepted", send: async () => ({ accepted: true, receiptId: "receipt-1" }) };
    expect(await submitLead(lead, [destination], "request-1")).toEqual({ ok: true });
  });
  it("does not claim success for a rejection", async () => {
    const destination: LeadDestination = { name: "rejected", send: async () => ({ accepted: false }) };
    expect(await submitLead(lead, [destination], "request-1")).toEqual({ ok: false, code: "DELIVERY_FAILED" });
  });
});
