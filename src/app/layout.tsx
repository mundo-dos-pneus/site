import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mundo dos Pneus | Pneu para todo mundo.",
  description: "Do asfalto ao campo, o pneu certo para cada caminho. Conheça o Mundo dos Pneus e solicite sua cotação.",
  openGraph: {
    title: "Mundo dos Pneus | Pneu para todo mundo.",
    description: "Do asfalto ao campo, o pneu certo para cada caminho.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
