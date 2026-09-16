import type { LeadDestination } from "@/lib/leads/destination";
import { parseLeadInput } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/submit";
import { GoogleScriptDestination } from "@/lib/leads/google-script-destination";

const json = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function handleLeadRequest(request: Request, destinations: LeadDestination[]): Promise<Response> {
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ ok: false, code: "INVALID_REQUEST" }, 400);
  const raw = await request.text();
  if (raw.length > 4096) return json({ ok: false, code: "INVALID_REQUEST" }, 400);
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return json({ ok: false, code: "INVALID_REQUEST" }, 400); }
  if (body && typeof body === "object" && "website" in body && Boolean((body as { website?: unknown }).website)) return json({ ok: false, code: "INVALID_REQUEST" }, 400);
  const parsed = parseLeadInput(body);
  if (!parsed.ok) return json({ ok: false, code: "INVALID_LEAD", errors: parsed.errors }, 422);
  const outcome = await submitLead(parsed.value, destinations, crypto.randomUUID());
  if (outcome.ok) return json({ ok: true }, 201);
  return json(outcome, outcome.code === "NO_DESTINATION" ? 503 : 502);
}

export async function POST(request: Request): Promise<Response> {
  const destinations: LeadDestination[] = [];
  
  if (process.env.GOOGLE_LEADS_WEBHOOK_URL && process.env.GOOGLE_LEADS_API_SECRET) {
    destinations.push(
      new GoogleScriptDestination(
        process.env.GOOGLE_LEADS_WEBHOOK_URL,
        process.env.GOOGLE_LEADS_API_SECRET
      )
    );
  }

  return handleLeadRequest(request, destinations);
}

