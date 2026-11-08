import type { Metadata } from "next";
import PlatformPage from "../../../components/landing/PlatformPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Platform — Aegis AI" : "Plateforme — Aegis AI",
    description:
      lang === "en"
        ? "Exploitation evidence, validated fixes, audit log and architecture: how Aegis AI works under the hood."
        : "Preuves d’exploitation, correctifs validés, journal d’audit et architecture : le fonctionnement d’Aegis AI en détail.",
    alternates: {
      languages: { fr: "/fr/plateforme", en: "/en/plateforme" },
    },
  };
}
export default function Page() {
  return <PlatformPage />;
}
