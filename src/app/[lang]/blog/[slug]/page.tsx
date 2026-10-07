import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/cms/blog";
import { BlogShell } from "@/components/BlogShell";
import { BlogArticle } from "@/components/BlogArticle";
export const dynamic = "force-dynamic";
export const dynamicParams = true;
type Args = { params: Promise<{ lang: string; slug: string }> };
export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getPost(lang, slug);
  if (!post) return { title: "Article — Aegis AI" };
  const cover = typeof post.cover === "object" ? post.cover : null;
  return {
    title: `${post.seo?.title || post.title} — Aegis AI`,
    description: post.seo?.description || post.excerpt,
    alternates: { canonical: `/${lang}/blog/${slug}`, languages: {} },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt || undefined,
      authors: [post.authorName],
      images: cover?.url ? [{ url: cover.url, alt: cover.alt }] : [],
    },
  };
}
export default async function ArticlePage({ params }: Args) {
  const { lang, slug } = await params;
  const post = await getPost(lang, slug);
  if (!post) notFound();
  return (
    <BlogShell language={lang}>
      <BlogArticle post={post} />
    </BlogShell>
  );
}
