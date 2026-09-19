"use client";
import { createContext, useContext } from "react";
import english from "./en.json";
export type Locale = "fr" | "en";
const LanguageContext = createContext<Locale>("fr");
export function LanguageProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LanguageContext.Provider value={locale}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  const locale = useContext(LanguageContext);
  const t = (text: string) =>
    locale === "en" ? (english as Record<string, string>)[text] ?? text : text;
  return { locale, t };
}
