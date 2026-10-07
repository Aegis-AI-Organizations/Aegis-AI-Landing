import Image from "next/image";
import Link from "next/link";
import { ArticleContent } from "./ArticleContent";
import type { Post } from "@/payload-types";
import { categoryLabel } from "@/cms/blog";
import styles from "./Blog.module.css";
export function BlogArticle({
  post,
  preview = false,
}: {
  post: Post;
  preview?: boolean;
}) {
  const fr = post.language === "fr";
  const cover = typeof post.cover === "object" ? post.cover : null;
  return (
    <>
      {preview && (
        <div className={styles.preview}>
          <span>
            {fr
              ? "Prévisualisation privée — ce contenu peut être un brouillon."
              : "Private preview — this content may be a draft."}
          </span>
          <a href={`/admin/collections/posts/${post.id}`}>
            {fr ? "Retour à l’éditeur" : "Back to editor"}
          </a>
        </div>
      )}
      <article className={styles.article}>
        <Link className={styles.back} href={`/${post.language}/blog`}>
          ← {fr ? "Le journal" : "The journal"}
        </Link>
        <div className={styles.meta}>
          <span>{categoryLabel(post.category, post.language)}</span>
        </div>
        <h1>{post.title}</h1>
        <p className={styles.lead}>{post.excerpt}</p>
        <div className={styles.byline}>
          <span>{post.authorName}</span>
          <time dateTime={post.publishedAt || undefined}>
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString(
                  fr ? "fr-FR" : "en-GB",
                  { day: "numeric", month: "long", year: "numeric" },
                )
              : fr
                ? "Non publié"
                : "Unpublished"}
          </time>
        </div>
        {cover?.url && (
          <Image
            className={styles.cover}
            src={cover.url}
            alt={cover.alt}
            width={cover.width || 1200}
            height={cover.height || 750}
            unoptimized
          />
        )}
        {post.content && <ArticleContent content={post.content} />}
      </article>
    </>
  );
}
