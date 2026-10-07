import type { Metadata } from "next";
import Pricing from "../../../components/Pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Tarifs — Aegis AI" : "Pricing — Aegis AI",
    description:
      lang === "fr"
        ? "Comparez les offres Starter, Pro et Scale / Business d’Aegis AI, à partir de 99 € par mois."
        : "Compare Aegis AI Starter, Pro and Scale / Business plans, starting at €99 per month.",
    alternates: { languages: { fr: "/fr/pricing", en: "/en/pricing" } },
  };
}
export default function PricingPage() {
  return <Pricing />;
}
