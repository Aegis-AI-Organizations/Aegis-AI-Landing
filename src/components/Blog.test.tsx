import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Post } from "@/payload-types";
const { getBlog, getPost, auth, find } = vi.hoisted(() => ({
  getBlog: vi.fn(),
  getPost: vi.fn(),
  auth: vi.fn(),
  find: vi.fn(),
}));
vi.mock("@/cms/blog", () => ({
  getBlog,
  getPost,
  categoryLabel: (x: string) => x,
}));
vi.mock("@payload-config", () => ({ default: {} }));
vi.mock("payload", () => ({ getPayload: async () => ({ auth, find }) }));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@payloadcms/richtext-lexical/react", () => ({
  RichText: () => <div>Article body</div>,
}));
vi.mock("./SiteHeader", () => ({ SiteHeader: () => <nav>Navigation</nav> }));
import BlogPage, {
  generateMetadata as blogMetadata,
} from "@/app/[lang]/blog/page";
import ArticlePage, {
  generateMetadata as articleMetadata,
} from "@/app/[lang]/blog/[slug]/page";
import PreviewPage from "@/app/(payload)/preview/[id]/page";
import { BlogArticle } from "./BlogArticle";
import { Brand, Icon, LoginIntro } from "./cms/Brand";
import { EditorialHome } from "./cms/EditorialHome";
const post = {
  id: 1,
  createdAt: "2026-09-30T12:00:00Z",
  updatedAt: "2026-09-30T12:00:00Z",
  title: "Test article",
  slug: "test-article",
  language: "fr",
  excerpt: "A useful summary",
  authorName: "Aegis",
  category: "research",
  publishedAt: "2026-09-30T12:00:00Z",
  content: {
    root: {
      type: "root",
      children: [],
      direction: null,
      format: "",
      indent: 0,
      version: 1,
    },
  },
  cover: {
    id: 1,
    createdAt: "2026-09-30T12:00:00Z",
    updatedAt: "2026-09-30T12:00:00Z",
    url: "/test.jpg",
    alt: "Test cover",
    width: 1200,
    height: 750,
  },
  seo: { title: "SEO title", description: "SEO description" },
} as Post;
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
describe("public editorial pages", () => {
  it.each(["fr", "en"])(
    "renders the empty state and metadata in %s",
    async (lang) => {
      getBlog.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 1 });
      render(
        await BlogPage({
          params: Promise.resolve({ lang }),
          searchParams: Promise.resolve({}),
        }),
      );
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        lang === "fr" ? "Comprendre" : "Understand",
      );
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        lang === "fr" ? "bientôt" : "soon",
      );
      expect(
        (await blogMetadata({ params: Promise.resolve({ lang }) })).alternates
          ?.canonical,
      ).toBe(`/${lang}/blog`);
    },
  );
  it("renders published articles and pagination", async () => {
    getBlog.mockResolvedValue({
      docs: [post, { ...post, id: 2, cover: null }],
      totalDocs: 20,
      totalPages: 3,
      hasPrevPage: true,
      hasNextPage: true,
    });
    render(
      await BlogPage({
        params: Promise.resolve({ lang: "fr" }),
        searchParams: Promise.resolve({ page: "2" }),
      }),
    );
    expect(screen.getByRole("link", { name: "← Précédent" })).toHaveAttribute(
      "href",
      "/fr/blog?page=1",
    );
    expect(screen.getByRole("link", { name: "Suivant →" })).toHaveAttribute(
      "href",
      "/fr/blog?page=3",
    );
    expect(screen.getByAltText("Test cover")).toBeVisible();
  });
  it("does not render missing or unpublished articles", async () => {
    getPost.mockResolvedValue(null);
    const args = { params: Promise.resolve({ lang: "fr", slug: "missing" }) };
    await expect(ArticlePage(args)).rejects.toThrow();
    expect((await articleMetadata(args)).title).toBe("Article — Aegis AI");
  });
  it("renders an article and uses its SEO fields", async () => {
    getPost.mockResolvedValue(post);
    const args = {
      params: Promise.resolve({ lang: "fr", slug: "test-article" }),
    };
    render(await ArticlePage(args));
    expect(screen.getByText("Article body")).toBeVisible();
    const meta = await articleMetadata(args);
    expect(meta.title).toBe("SEO title — Aegis AI");
    expect(meta.description).toBe("SEO description");
  });
  it("labels a draft preview and provides a return to the editor", () => {
    render(
      <BlogArticle
        post={{ ...post, language: "en", publishedAt: null, cover: null }}
        preview
      />,
    );
    expect(screen.getByText(/Private preview/)).toBeVisible();
    expect(screen.getByText("Unpublished")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Back to editor" }),
    ).toHaveAttribute("href", "/admin/collections/posts/1");
  });
  it("authenticates preview requests before looking up any drafts", async () => {
    auth.mockResolvedValue({ user: null });
    await expect(
      PreviewPage({ params: Promise.resolve({ id: "1" }) }),
    ).rejects.toThrow();
    expect(find).not.toHaveBeenCalled();
    auth.mockResolvedValue({ user: { id: 7, role: "editor" } });
    find.mockResolvedValue({ docs: [post] });
    render(await PreviewPage({ params: Promise.resolve({ id: "1" }) }));
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        draft: true,
        overrideAccess: false,
        user: { id: 7, role: "editor" },
      }),
    );
    expect(screen.getByText(/Prévisualisation privée/)).toBeVisible();
    find.mockResolvedValue({ docs: [] });
    await expect(
      PreviewPage({ params: Promise.resolve({ id: "9" }) }),
    ).rejects.toThrow();
  });
  it("opens the article index as the admin home", () => {
    expect(() => EditorialHome()).toThrow();
  });
  it("identifies the editorial studio", () => {
    render(
      <>
        <Brand />
        <Icon />
        <LoginIntro />
      </>,
    );
    expect(screen.getByText("Administration")).toBeVisible();
    expect(screen.getByRole("heading")).toHaveTextContent("Connexion");
  });
});
