import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QuoteForm } from "./quote-form";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const fill = () => {
  fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Maria Silva" } });
  fireEvent.change(screen.getByLabelText("WhatsApp"), { target: { value: "(16) 99999-1234" } });
  fireEvent.change(screen.getByLabelText("Cidade"), { target: { value: "Ribeirão Preto" } });
  fireEvent.change(screen.getByLabelText("UF"), { target: { value: "SP" } });
  fireEvent.change(screen.getByLabelText("Categoria do veículo"), { target: { value: "carro" } });
  fireEvent.change(screen.getByLabelText("Medida ou descrição do pneu"), { target: { value: "205/55 R16, 4 pneus" } });
};

describe("QuoteForm", () => {
  it("shows the approved fields and categories", () => {
    render(<QuoteForm />);
    expect(screen.getByLabelText("Nome")).toBeTruthy();
    expect(screen.getByLabelText("WhatsApp")).toBeTruthy();
    expect(screen.getByLabelText("Cidade")).toBeTruthy();
    expect(screen.getByLabelText("UF")).toBeTruthy();
    expect(screen.getByLabelText("Categoria do veículo")).toBeTruthy();
    expect(screen.getByLabelText("Medida ou descrição do pneu")).toBeTruthy();
    expect(screen.getByPlaceholderText("205/55 R16, 4 pneus")).toBeTruthy();
  });
  it("preserves values and never claims success on 503", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({ ok: false, code: "NO_DESTINATION" }) }));
    render(<QuoteForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "QUERO MINHA COTAÇÃO" }));
    await waitFor(() => expect(screen.getByText(/Não foi possível enviar sua solicitação/i)).toBeTruthy());
    expect((screen.getByLabelText("Nome") as HTMLInputElement).value).toBe("Maria Silva");
    expect(screen.queryByText(/solicitação recebida/i)).toBeNull();
  });
  it("prevents double submission while pending", async () => {
    let release: ((value: unknown) => void) | undefined;
    const fetch = vi.fn().mockReturnValue(new Promise((resolve) => { release = resolve; }));
    vi.stubGlobal("fetch", fetch);
    render(<QuoteForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "QUERO MINHA COTAÇÃO" }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    release?.({ ok: false, status: 503, json: async () => ({ ok: false, code: "NO_DESTINATION" }) });
    await waitFor(() => expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(false));
  });
  it("shows success only after a confirmed response and fires generate_lead", async () => {
    const gtagMock = vi.fn();
    vi.stubGlobal("gtag", gtagMock);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ ok: true }) }));
    render(<QuoteForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "QUERO MINHA COTAÇÃO" }));
    await waitFor(() => expect(screen.getByText(/solicitação recebida/i)).toBeTruthy());
    expect(gtagMock).toHaveBeenCalledTimes(1);
    expect(gtagMock).toHaveBeenCalledWith("event", "generate_lead");
  });
  it("does not fire generate_lead if API returns error", async () => {
    const gtagMock = vi.fn();
    vi.stubGlobal("gtag", gtagMock);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({ ok: false }) }));
    render(<QuoteForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "QUERO MINHA COTAÇÃO" }));
    await waitFor(() => expect(screen.getByText(/Não foi possível enviar sua solicitação/i)).toBeTruthy());
    expect(gtagMock).not.toHaveBeenCalled();
  });
  it("works normally even if Analytics is unavailable", async () => {
    // gtag explicitly undefined
    vi.stubGlobal("gtag", undefined);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ ok: true }) }));
    render(<QuoteForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "QUERO MINHA COTAÇÃO" }));
    await waitFor(() => expect(screen.getByText(/solicitação recebida/i)).toBeTruthy());
  });
  it("works normally even if Analytics throws an exception", async () => {
    // gtag explicitly throws
    const gtagThrowsMock = vi.fn().mockImplementation(() => {
      throw new Error("Analytics blocked by browser extension");
    });
    vi.stubGlobal("gtag", gtagThrowsMock);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ ok: true }) }));
    render(<QuoteForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "QUERO MINHA COTAÇÃO" }));
    await waitFor(() => expect(screen.getByText(/solicitação recebida/i)).toBeTruthy());
  });
});
