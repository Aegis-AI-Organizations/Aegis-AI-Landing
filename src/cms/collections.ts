import type { CollectionConfig } from "payload";
import {
  adminOnly,
  authenticated,
  ownAccountOrAdmin,
  publishedOrTeam,
} from "./access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Membre", plural: "Équipe" },
  admin: { useAsTitle: "name", group: "Administration" },
  auth: { maxLoginAttempts: 5, lockTime: 600000 },
  access: {
    create: adminOnly,
    read: ownAccountOrAdmin,
    update: ownAccountOrAdmin,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Payload's first-user flow bypasses collection access. Only that first account becomes admin.
        if (operation === "create" && !req.user) {
          if (
            process.env.NODE_ENV === "production" &&
            !(req.payloadAPI === "local" && req.context?.bootstrapCMS === true)
          ) {
            throw new Error(
              "Public administrator bootstrap is disabled in production.",
            );
          }
          const { totalDocs } = await req.payload.count({
            collection: "users",
            req,
            overrideAccess: true,
          });
          if (totalDocs !== 0)
            throw new Error(
              "An administrator must create additional accounts.",
            );
          data.role = "admin";
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "name", label: "Nom", type: "text", required: true },
    {
      name: "role",
      label: "Rôle",
      type: "select",
      admin: { condition: (_data, _siblings, { user }) => Boolean(user) },
      defaultValue: "editor",
      required: true,
      options: [
        { label: "Administrateur", value: "admin" },
        { label: "Rédacteur", value: "editor" },
      ],
      access: {
        create: ({ req }) => req.user?.role === "admin",
        update: ({ req }) => req.user?.role === "admin",
      },
    },
  ],
};

export const Media: CollectionConfig = {
  slug: "media",
  folders: true,
  labels: { singular: "Média", plural: "Médias" },
  admin: { group: "Publication", useAsTitle: "alt" },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  upload: {
    staticDir: process.env.MEDIA_DIR || "media",
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    imageSizes: [{ name: "card", width: 960, height: 600, position: "centre" }],
    adminThumbnail: "card",
  },
  fields: [
    {
      name: "alt",
      label: "Description de l’image",
      type: "text",
      required: true,
    },
  ],
};

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Article", plural: "Articles" },
  admin: {
    useAsTitle: "title",
    group: "Publication",
    defaultColumns: ["title", "language", "_status", "updatedAt"],
    description:
      "Rédigez, prévisualisez, puis publiez. Chaque langue possède son propre brouillon.",
    preview: (data) => (data.id ? `/preview/${data.id}` : null),
  },
  access: {
    read: publishedOrTeam,
    create: authenticated,
    update: authenticated,
    delete: adminOnly,
    readVersions: authenticated,
  },
  versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 30 },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (
          data._status === "published" &&
          !data.publishedAt &&
          !originalDoc?.publishedAt
        )
          data.publishedAt = new Date().toISOString();
        return data;
      },
    ],
  },
  fields: [
    { name: "title", label: "Titre", type: "text", required: true },
    {
      name: "excerpt",
      label: "Résumé",
      type: "textarea",
      required: true,
      maxLength: 320,
    },
    {
      name: "cover",
      label: "Image de couverture",
      type: "upload",
      relationTo: "media",
    },
    { name: "content", label: "Contenu", type: "richText", required: true },
    {
      name: "language",
      label: "Langue",
      type: "select",
      required: true,
      defaultValue: "fr",
      options: [
        { label: "Français", value: "fr" },
        { label: "English", value: "en" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "slug",
      label: "Adresse de l’article",
      type: "text",
      required: true,
      unique: true,
      index: true,
      validate: (value: unknown) =>
        (typeof value === "string" &&
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
        "Utilisez des lettres minuscules, chiffres et tirets.",
      admin: {
        position: "sidebar",
        description:
          "Ex. comprendre-le-pentest. Adresse unique, y compris entre les langues.",
      },
    },
    {
      name: "authorName",
      label: "Auteur affiché",
      type: "text",
      required: true,
      defaultValue: "Équipe Aegis AI",
      admin: { position: "sidebar" },
    },
    {
      name: "category",
      label: "Rubrique",
      type: "select",
      required: true,
      defaultValue: "research",
      options: [
        { label: "Recherche / Research", value: "research" },
        { label: "Produit / Product", value: "product" },
        { label: "Guides", value: "guides" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "publishedAt",
      label: "Date de publication",
      type: "date",
      admin: {
        position: "sidebar",
        description:
          "Date affichée ; ce champ ne programme pas la publication.",
      },
    },
    {
      name: "seo",
      label: "Référencement",
      type: "group",
      fields: [
        { name: "title", label: "Titre SEO", type: "text", maxLength: 70 },
        {
          name: "description",
          label: "Description SEO",
          type: "textarea",
          maxLength: 170,
        },
      ],
    },
  ],
};
