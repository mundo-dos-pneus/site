import { describe, it, expect } from "vitest";
import { normalizePhoneBR } from "./phone";

describe("normalizePhoneBR", () => {
  it("normalizes standard inputs to E.164", () => {
    expect(normalizePhoneBR("(16) 98226-5352")).toBe("+5516982265352");
    expect(normalizePhoneBR("16 98226-5352")).toBe("+5516982265352");
    expect(normalizePhoneBR("16982265352")).toBe("+5516982265352");
    expect(normalizePhoneBR("5516982265352")).toBe("+5516982265352");
    expect(normalizePhoneBR("+5516982265352")).toBe("+5516982265352");
  });

  it("handles missing 9th digit", () => {
    expect(normalizePhoneBR("16 8226-5352")).toBe("+5516982265352");
  });

  it("handles invalid inputs", () => {
    expect(normalizePhoneBR("123")).toBeNull();
    expect(normalizePhoneBR("abcdef")).toBeNull();
    expect(normalizePhoneBR(null)).toBeNull();
  });
});
