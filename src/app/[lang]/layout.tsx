import type { Metadata } from "next";
import "../globals.css";
import {
  Inter,
  JetBrains_Mono,
  Orbitron,
  Space_Grotesk,
} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

import { notFound } from "next/navigation";
import { LanguageProvider, type Locale } from "../../i18n/Language";
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(process.env.SITE_URL || "http://localhost:3001"),
    title:
      lang === "en"
        ? "Aegis AI — Attack the clone. Never production."
        : "Aegis AI — Attaquez le clone. Jamais la production.",
    description:
      lang === "en"
        ? "AI agents continuously test an isolated copy of your infrastructure. Find your vulnerabilities before attackers do, with the fix ready to apply."
        : "Des agents IA testent en continu une copie isolée de votre infrastructure. Trouvez vos failles avant les attaquants, avec la correction prête à appliquer.",
    alternates: { languages: { fr: "/fr", en: "/en" } },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "fr" && lang !== "en") notFound();
  return (
    <html
      lang={lang}
      className={`${inter.variable} ${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <LanguageProvider key={lang} locale={lang as Locale}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
