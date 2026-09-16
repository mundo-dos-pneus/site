import { describe, expect, it } from "vitest";
import { POST, handleLeadRequest } from "./route";

const valid = { name: "Maria Silva", whatsapp: "(16) 99999-1234", city: "Ribeirão Preto", uf: "SP", category: "carro", tireDescription: "205/55 R16, 4 pneus" };
const request = (body: unknown) => new Request("http://localhost/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

describe("POST /api/leads", () => {
  it("returns 503 without a real destination", async () => {
    const response = await POST(request(valid));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, code: "NO_DESTINATION" });
  });
  it("returns 422 for invalid fields", async () => {
    const response = await POST(request({ ...valid, whatsapp: "123" }));
    expect(response.status).toBe(422);
  });
  it("does not dispatch a honeypot submission", async () => {
    let calls = 0;
    const response = await handleLeadRequest(request({ ...valid, website: "spam.example" }), [{ name: "target", send: async () => { calls++; return { accepted: true }; } }]);
    expect(response.status).toBe(400);
    expect(calls).toBe(0);
  });
  it("returns 400 for malformed JSON", async () => {
    const response = await POST(new Request("http://localhost/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }));
    expect(response.status).toBe(400);
  });
  it("returns 201 only after a destination confirms", async () => {
    const response = await handleLeadRequest(request(valid), [{ name: "confirmed", send: async () => ({ accepted: true }) }]);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true });
  });
  it("returns 502 when the destination fails", async () => {
    const response = await handleLeadRequest(request(valid), [{ name: "failed", send: async () => { throw new Error("down"); } }]);
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ ok: false, code: "DELIVERY_FAILED" });
  });
});

