declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackLeadConversion() {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    try {
      window.gtag("event", "generate_lead");
    } catch {
      // Falha silenciosamente para não interromper fluxo comercial
    }
  }
}
