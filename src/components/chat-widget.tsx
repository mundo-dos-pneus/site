import Script from "next/script";

export function ChatWidget({ scriptUrl }: { scriptUrl?: string }) {
  if (!scriptUrl) return null;
  return <Script src={scriptUrl} strategy="afterInteractive" />;
}
