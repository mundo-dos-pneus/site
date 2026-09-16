export type LeadInput = {
  name: string;
  whatsapp: string;
  city: string;
  uf: string;
  category: "moto" | "carro" | "suv-picape" | "caminhao" | "agricola";
  tireDescription: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export type LeadDestination = {
  name: string;
  send(lead: LeadInput, requestId: string): Promise<{ accepted: boolean; receiptId?: string }>;
};
