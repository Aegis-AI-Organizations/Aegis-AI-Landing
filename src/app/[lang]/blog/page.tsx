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
        ? "Recherche, produit et guides de sécurité par l’équipe Aegis AI."
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
    <BlogShell language={lang}>
      <div className={styles.main}>
        <span className={styles.eyebrow}>
          AEGIS / {fr ? "LE JOURNAL" : "THE JOURNAL"}
        </span>
        <div className={styles.hero}>
          <h1>
            {fr ? "Comprendre." : "Understand."}
            <br />
            <span>{fr ? "Puis agir." : "Then act."}</span>
          </h1>
          <p>
            {fr
              ? "Ce que nous apprenons, ce que nous construisons. Regards de terrain sur la sécurité et les infrastructures qui évoluent."
              : "What we learn. What we build. Field notes on security and the infrastructure that keeps changing."}
          </p>
        </div>
        <div className={styles.sectionTop}>
          <span>{fr ? "Dernières publications" : "Latest stories"}</span>
          <span>
            {posts.totalDocs.toString().padStart(2, "0")}{" "}
            {fr ? "ARTICLES" : "STORIES"}
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
                        AEGIS /{" "}
                        {categoryLabel(post.category, lang).toUpperCase()}
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
          <div className={styles.empty}>
            <BookOpen size={28} strokeWidth={1} />
            <h2>
              {fr ? "Le journal s’ouvre bientôt." : "The journal opens soon."}
            </h2>
            <p>
              {fr
                ? "Nos premiers articles sont en préparation. En attendant, découvrez comment Aegis met votre infrastructure à l’épreuve."
                : "Our first stories are in progress. In the meantime, discover how Aegis puts your infrastructure to the test."}
            </p>
            <Link href={`/${lang}#dashboard`}>
              {fr ? "Découvrir la plateforme" : "Explore the platform"}{" "}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
        {posts.totalPages > 1 && (
          <nav
            className={styles.pagination}
            aria-label={fr ? "Pagination" : "Pagination"}
          >
            {posts.hasPrevPage && (
              <Link href={`/${lang}/blog?page=${page - 1}`}>
                ← {fr ? "Précédent" : "Previous"}
              </Link>
            )}
            <span>
              {page} / {posts.totalPages}
            </span>
            {posts.hasNextPage && (
              <Link href={`/${lang}/blog?page=${page + 1}`}>
                {fr ? "Suivant" : "Next"} →
              </Link>
            )}
          </nav>
        )}
      </div>
    </BlogShell>
  );
}
