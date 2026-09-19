import type { LeadDestination, LeadInput } from "./destination";

export class SupabaseDestination implements LeadDestination {
  name = "supabase-rpc";

  constructor(
    private readonly supabaseUrl: string,
    private readonly serviceRoleKey: string,
    private readonly organizationId: string,
    private readonly sourceId: string
  ) {}

  async send(lead: LeadInput, fallbackRequestId: string): Promise<{ accepted: boolean; receiptId?: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // The frontend should pass requestId via the form submission, but we have fallback
      const requestId = lead.requestId || fallbackRequestId;

      const payload = {
        organization_id: this.organizationId,
        source_id: this.sourceId,
        request_id: requestId,
        name: lead.name,
        whatsapp: lead.whatsapp,
        fields: {
          city: lead.city,
          uf: lead.uf,
          category: lead.category,
          tireDescription: lead.tireDescription,
        },
        utm: {
          utmSource: lead.utmSource,
          utmMedium: lead.utmMedium,
          utmCampaign: lead.utmCampaign,
          utmContent: lead.utmContent,
          utmTerm: lead.utmTerm,
          gclid: lead.gclid,
          fbclid: lead.fbclid,
        },
        origin: lead.landingPage || "",
        remote_ip: lead.remoteIp || "",
        user_agent: lead.userAgent || "", 
      };

      const response = await fetch(`${this.supabaseUrl}/rest/v1/rpc/capture_quote_request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": this.serviceRoleKey,
          "Authorization": `Bearer ${this.serviceRoleKey}`,
        },
        body: JSON.stringify({ p_payload: payload }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[SupabaseDestination] RPC failed with status ${response.status}`);
        const errorText = await response.text();
        console.error(`[SupabaseDestination] Error: ${errorText}`);
        return { accepted: false };
      }

      const data = await response.json();

      if (data && data.ok === true) {
        console.log(`[SupabaseDestination] Capture successful. Status: ${data.status}. Capture ID: ${data.capture_id}`);
        return { accepted: true, receiptId: data.capture_id };
      }

      console.warn(`[SupabaseDestination] Capture rejected by RPC:`, data);
      return { accepted: false };
    } catch (error) {
      console.error(`[SupabaseDestination] Error sending to Supabase:`, error);
      return { accepted: false };
    }
  }
}
