import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { getBlog, categoryLabel } from "@/cms/blog";
import { BlogShell } from "@/components/BlogShell";
import styles from "@/components/Blog.module.css";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Le journal — Aegis AI" : "Journal — Aegis AI",
    description:
      lang === "fr"
        ? "Retours de terrain, guides et nouveautés pour sécuriser votre infrastructure avec Aegis AI."
        : "Security research, product updates and guides from Aegis AI.",
    alternates: {
      canonical: `/${lang}/blog`,
      languages: { fr: "/fr/blog", en: "/en/blog" },
    },
  };
}
export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { lang } = await params;
  const query = await searchParams;
  const page = Math.max(
    1,
    Math.min(10000, Number.parseInt(query.page || "1", 10) || 1),
  );
  const posts = await getBlog(lang, page);
  const fr = lang === "fr";
  return (
    <BlogShell>
      <div className="wrap">
        <header className={styles.hero}>
          <span className="label acc">{fr ? "Le journal" : "The journal"}</span>
          <h1 className="h1 two-tone">
            {fr ? "Comprendre." : "Understand."}{" "}
            <em>{fr ? "Puis agir." : "Then act."}</em>
          </h1>
          <p className="lead">
            {fr
              ? "Des retours de terrain pour sécuriser votre infrastructure : les attaques qui marchent, les erreurs fréquentes et la façon de les corriger."
              : "Field notes to secure your infrastructure: the attacks that work, the common mistakes and how to fix them."}
          </p>
        </header>
        <div className={styles.sectionTop}>
          <span className="label">
            {fr ? "Dernières publications" : "Latest stories"}
          </span>
          <span className="src">
            {posts.totalDocs.toString().padStart(2, "0")}{" "}
            {fr ? "articles" : "stories"}
          </span>
        </div>
        {posts.docs.length ? (
          <div className={styles.grid}>
            {posts.docs.map((post) => {
              const cover = typeof post.cover === "object" ? post.cover : null;
              return (
                <Link
                  key={post.id}
                  className={styles.card}
                  href={`/${lang}/blog/${post.slug}`}
                >
                  <div className={styles.art}>
                    {cover?.url ? (
                      <Image
                        src={cover.sizes?.card?.url || cover.url}
                        alt={cover.alt}
                        width={960}
                        height={600}
                        unoptimized
                      />
                    ) : (
                      <span className={styles.fallback} aria-hidden="true">
                        {categoryLabel(post.category, lang)}
                      </span>
                    )}
                  </div>
                  <div className={styles.meta}>
                    <span>{categoryLabel(post.category, lang)}</span>
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString(
                          fr ? "fr-FR" : "en-GB",
                        )}
                      </time>
                    )}
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <span className={styles.read}>
                    {fr ? "Lire l’article" : "Read story"}{" "}
                    <ArrowUpRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={`surface ${styles.empty}`}>
            <span className={styles.emptyIcon} aria-hidden="true">
              <BookOpen size={20} strokeWidth={1.5} />
            </span>
            <h2 className="h3">
              {fr ? "Le journal s’ouvre bientôt." : "The journal opens soon."}
            </h2>
            <p className="small">
              {fr
                ? "Les premiers articles sont en préparation. En attendant, voyez comment Aegis met votre infrastructure à l’épreuve, sans jamais toucher à la production."
                : "The first stories are in progress. In the meantime, see how Aegis puts your infrastructure to the test without ever touching production."}
            </p>
            <Link className="btn ghost sm" href={`/${lang}#console`}>
              {fr ? "Découvrir la console" : "Explore the console"}{" "}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        )}
        {posts.totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Pagination">
            {posts.hasPrevPage && (
              <Link
                className="btn plain sm"
                href={`/${lang}/blog?page=${page - 1}`}
              >
                ← {fr ? "Précédent" : "Previous"}
              </Link>
            )}
            <span className="src">
              {page} / {posts.totalPages}
            </span>
            {posts.hasNextPage && (
              <Link
                className="btn plain sm"
                href={`/${lang}/blog?page=${page + 1}`}
              >
                {fr ? "Suivant" : "Next"} →
              </Link>
            )}
          </nav>
        )}
      </div>
    </BlogShell>
  );
}
