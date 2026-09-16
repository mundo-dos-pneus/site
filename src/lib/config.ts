function validHttpUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function getPublicConfig() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER?.replace(/\D/g, "");
  return {
    a2maxUrl: validHttpUrl(process.env.NEXT_PUBLIC_A2MAX_URL),
    chatScriptUrl: validHttpUrl(process.env.NEXT_PUBLIC_CHAT_SCRIPT_URL),
    whatsappNumber: whatsapp && /^55\d{10,11}$/.test(whatsapp) ? whatsapp : undefined,
    instagramUrl: validHttpUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    facebookUrl: validHttpUrl(process.env.NEXT_PUBLIC_FACEBOOK_URL),
    youtubeUrl: validHttpUrl(process.env.NEXT_PUBLIC_YOUTUBE_URL),
  };
}
