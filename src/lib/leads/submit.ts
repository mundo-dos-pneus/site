import type { LeadDestination, LeadInput } from "./destination";

export async function submitLead(lead: LeadInput, destinations: LeadDestination[], requestId: string): Promise<{ ok: true } | { ok: false; code: "NO_DESTINATION" | "DELIVERY_FAILED" }> {
  if (destinations.length === 0) return { ok: false, code: "NO_DESTINATION" };
  for (const destination of destinations) {
    try {
      const receipt = await destination.send(lead, requestId);
      if (receipt.accepted) return { ok: true };
    } catch {
      // Another configured destination may still confirm receipt.
    }
  }
  return { ok: false, code: "DELIVERY_FAILED" };
}

