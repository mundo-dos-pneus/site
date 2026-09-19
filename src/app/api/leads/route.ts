import type { LeadDestination } from "@/lib/leads/destination";
import { parseLeadInput } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/submit";
import { GoogleScriptDestination } from "@/lib/leads/google-script-destination";
import { SupabaseDestination } from "@/lib/leads/supabase-destination";

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
  
  // Inject request-level metadata if available
  const ip = request.headers.get("x-forwarded-for") || "";
  const ua = request.headers.get("user-agent") || "";
  if (!parsed.value.landingPage) parsed.value.landingPage = request.headers.get("referer") || "";
  parsed.value.remoteIp = ip;
  parsed.value.userAgent = ua;
  
  const outcome = await submitLead(parsed.value, destinations, parsed.value.requestId || crypto.randomUUID());
  if (outcome.ok) return json({ ok: true }, 201);
  return json(outcome, outcome.code === "NO_DESTINATION" ? 503 : 502);
}

export async function POST(request: Request): Promise<Response> {
  const destinations: LeadDestination[] = [];
  
  // New Supabase Destination
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_ORG_ID && process.env.SUPABASE_WEBHOOK_SOURCE_ID) {
    destinations.push(
      new SupabaseDestination(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        process.env.SUPABASE_ORG_ID,
        process.env.SUPABASE_WEBHOOK_SOURCE_ID
      )
    );
  } else if (process.env.GOOGLE_LEADS_WEBHOOK_URL && process.env.GOOGLE_LEADS_API_SECRET) {
    destinations.push(
      new GoogleScriptDestination(
        process.env.GOOGLE_LEADS_WEBHOOK_URL,
        process.env.GOOGLE_LEADS_API_SECRET
      )
    );
  }

  return handleLeadRequest(request, destinations);
}

