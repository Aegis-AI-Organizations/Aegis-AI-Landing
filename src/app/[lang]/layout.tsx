import type { Metadata } from "next";
import "../globals.css";
import { Inter, Orbitron } from "next/font/google";

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
    title:
      lang === "en"
        ? "Aegis AI — Your infrastructure. Put to the test."
        : "Aegis AI — Votre infrastructure. Mise à l’épreuve.",
    description:
      lang === "en"
        ? "Map your infrastructure, test an isolated copy and examine the evidence. Discover Aegis AI penetration testing."
        : "Cartographiez votre infrastructure, testez sa copie isolée et examinez les preuves. Découvrez l’approche de pentest Aegis AI.",
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
    <html lang={lang} className={`${inter.variable} ${orbitron.variable}`}>
      <body>
        <LanguageProvider key={lang} locale={lang as Locale}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
