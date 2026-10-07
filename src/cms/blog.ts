import { getPayload } from "payload";
import config from "@payload-config";
import { cache } from "react";

export const getBlog = cache(async (language: string, page = 1) => {
  const payload = await getPayload({ config });
  return payload.find({
    collection: "posts",
    overrideAccess: false,
    depth: 1,
    limit: 9,
    page,
    sort: "-publishedAt",
    where: { language: { equals: language } },
  });
});
export const getPost = cache(async (language: string, slug: string) => {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "posts",
    overrideAccess: false,
    depth: 1,
    limit: 1,
    where: {
      and: [{ language: { equals: language } }, { slug: { equals: slug } }],
    },
  });
  return result.docs[0] || null;
});
export const categoryLabel = (category: string, language: string) =>
  ({
    research: language === "fr" ? "Recherche" : "Research",
    product: language === "fr" ? "Produit" : "Product",
    guides: "Guides",
  })[category] || category;
