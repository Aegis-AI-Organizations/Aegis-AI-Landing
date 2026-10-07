import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import styles from "@/components/Blog.module.css";
import { BlogArticle } from "@/components/BlogArticle";
export const metadata = {
  title: "Prévisualisation — Aegis AI",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login");
  const { id } = await params;
  const result = await payload.find({
    collection: "posts",
    where: { id: { equals: id } },
    draft: true,
    limit: 1,
    depth: 1,
    user,
    overrideAccess: false,
  });
  const post = result.docs[0];
  if (!post) notFound();
  return (
    <div className={styles.page}>
      <BlogArticle post={post} preview />
    </div>
  );
}
