import { describe, expect, it, vi, afterEach } from "vitest";
import { GoogleScriptDestination } from "./google-script-destination";
import type { LeadInput } from "./destination";

const valid: LeadInput = {
  name: "Maria Silva",
  whatsapp: "16999991234",
  city: "Ribeirão Preto",
  uf: "SP",
  category: "carro",
  tireDescription: "205/55 R16, 4 pneus",
};

describe("GoogleScriptDestination", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns accepted on valid success response with emailSent: true", async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, code: "LEAD_CREATED", leadId: "MDP-123", emailSent: true }),
    });
    vi.stubGlobal("fetch", fetch);

    const dest = new GoogleScriptDestination("https://test", "secret-123");
    const result = await dest.send(valid);
    
    expect(result.accepted).toBe(true);
    expect(result.receiptId).toBe("MDP-123");

    expect(fetch).toHaveBeenCalledWith(
      "https://test",
      expect.objectContaining({
        body: expect.stringContaining(`"secret":"secret-123"`),
      })
    );
  });

  it("returns accepted on valid success response with emailSent: false", async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, code: "LEAD_CREATED", leadId: "MDP-124", emailSent: false }),
    });
    vi.stubGlobal("fetch", fetch);

    const dest = new GoogleScriptDestination("https://test", "secret-123");
    const result = await dest.send(valid);
    
    expect(result.accepted).toBe(true);
    expect(result.receiptId).toBe("MDP-124");
  });

  it("returns accepted on valid success response without emailSent", async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, code: "LEAD_CREATED", leadId: "MDP-125" }), // emailSent is missing
    });
    vi.stubGlobal("fetch", fetch);

    const dest = new GoogleScriptDestination("https://test", "secret-123");
    const result = await dest.send(valid);
    
    expect(result.accepted).toBe(true);
    expect(result.receiptId).toBe("MDP-125");
  });

  it("returns false on HTTP 200 with UNAUTHORIZED", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: false, code: "UNAUTHORIZED" }),
    }));

    const dest = new GoogleScriptDestination("https://test", "secret-123");
    const result = await dest.send(valid);
    expect(result.accepted).toBe(false);
  });

  it("returns false on invalid JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => { throw new Error("Invalid JSON"); },
    }));

    const dest = new GoogleScriptDestination("https://test", "secret-123");
    const result = await dest.send(valid);
    expect(result.accepted).toBe(false);
  });

  it("handles timeout properly", async () => {
    // Wait more than 10 seconds inside mock fetch to trigger abort, though we can't easily wait 10s in unit tests
    // so we mock an error being thrown (which is what AbortController does)
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("AbortError")));

    const dest = new GoogleScriptDestination("https://test", "secret-123");
    const result = await dest.send(valid);
    expect(result.accepted).toBe(false);
  });
});
