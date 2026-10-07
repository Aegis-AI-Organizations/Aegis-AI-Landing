import { expect, it, vi } from "vitest";
import { generateMetadata } from "./page";
vi.mock("../../../components/Pricing", () => ({ default: () => null }));

it.each(["fr", "en"])(
  "keeps %s pricing metadata on pricing routes",
  async (lang) => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang }),
    });
    expect(metadata.title).toBe(
      lang === "fr" ? "Tarifs — Aegis AI" : "Pricing — Aegis AI",
    );
    expect(metadata.description).toContain("99");
    expect(metadata.alternates?.languages).toEqual({
      fr: "/fr/pricing",
      en: "/en/pricing",
    });
  },
);
