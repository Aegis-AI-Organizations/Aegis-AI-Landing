import { describe, expect, it, vi } from "vitest";
import RootLayout, {
  generateMetadata,
  generateStaticParams,
} from "./[lang]/layout";
vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "inter" }),
  Orbitron: () => ({ variable: "orbitron" }),
}));
describe("localized root layout", () => {
  it.each(["fr", "en"])("sets the document language to %s", async (lang) => {
    const layout = await RootLayout({
      children: <div>landing-child</div>,
      params: Promise.resolve({ lang }),
    });
    expect(layout.props.lang).toBe(lang);
    expect(layout.props.children.props.children.props.locale).toBe(lang);
  });
  it("localizes metadata and exposes both language alternatives", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "en" }),
    });
    expect(metadata.title).toContain("Your infrastructure");
    expect(metadata.alternates?.languages).toEqual({ fr: "/fr", en: "/en" });
  });
});

it("generates both supported routes and rejects unknown locales", async () => {
  expect(generateStaticParams()).toEqual([{ lang: "fr" }, { lang: "en" }]);
  await expect(
    RootLayout({ children: null, params: Promise.resolve({ lang: "de" }) }),
  ).rejects.toThrow();
});
