import type { LeadDestination, LeadInput } from "./destination";

export class GoogleScriptDestination implements LeadDestination {
  name = "google-apps-script";

  constructor(
    private readonly webhookUrl: string,
    private readonly apiSecret: string
  ) {}

  async send(lead: LeadInput, _requestId: string): Promise<{ accepted: boolean; receiptId?: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: lead.name,
          whatsapp: lead.whatsapp,
          cidade: lead.city,
          uf: lead.uf,
          categoria: lead.category,
          medida: lead.tireDescription,
          origem: lead.utmSource || "SITE",
          utmSource: lead.utmSource || "",
          utmMedium: lead.utmMedium || "",
          utmCampaign: lead.utmCampaign || "",
          secret: this.apiSecret,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // We only accept ok response and the logic code
      if (!response.ok) {
        return { accepted: false };
      }

      const data = await response.json();
      
      if (data && data.ok === true && data.code === "LEAD_CREATED") {
        console.log(`[GoogleScriptDestination] Lead accepted: ${data.leadId}`);
        const emailStatus = data.emailSent !== undefined ? Boolean(data.emailSent) : "unknown";
        console.log(`[GoogleScriptDestination] Notification sent: ${emailStatus}`);
        return { accepted: true, receiptId: data.leadId };
      }

      console.warn(`[GoogleScriptDestination] Lead rejected by remote:`, { code: data?.code });
      return { accepted: false };
    } catch (error) {
      console.error(`[GoogleScriptDestination] Error sending lead:`, error);
      return { accepted: false };
    }
  }
}
