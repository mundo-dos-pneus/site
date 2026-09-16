import { ChatWidget } from "@/components/chat-widget";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { QuoteForm } from "@/components/quote-form";
import { getPublicConfig } from "@/lib/config";

export default function Home() {
  const config = getPublicConfig();
  return (
    <>
      <main>
        <Hero />
        <QuoteForm whatsappNumber={config.whatsappNumber} />
      </main>
      <Footer 
        a2maxUrl={config.a2maxUrl} 
        instagramUrl={config.instagramUrl}
        facebookUrl={config.facebookUrl}
        youtubeUrl={config.youtubeUrl}
      />
      <ChatWidget scriptUrl={config.chatScriptUrl} />
    </>
  );
}
