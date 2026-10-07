import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { fr } from "@payloadcms/translations/languages/fr";
import { en } from "@payloadcms/translations/languages/en";
import sharp from "sharp";
import { migrations } from "./migrations";
import { adminOnly, authenticated } from "./cms/access";
import { Media, Posts, Users } from "./cms/collections";

const dirname = path.dirname(fileURLToPath(import.meta.url));
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "",
  admin: {
    user: "users",
    theme: "dark",
    meta: { titleSuffix: "— Aegis Editorial" },
    importMap: { baseDir: path.resolve(dirname, "..") },
    components: {
      graphics: {
        Logo: "/src/components/cms/Brand#Brand",
        Icon: "/src/components/cms/Brand#Icon",
      },
      Nav: "/src/components/cms/Sidebar#Sidebar",
      views: {
        media: {
          Component: "/src/components/cms/MediaView#MediaView",
          meta: { title: "Médias" },
          path: "/media",
          exact: true,
        },
        dashboard: {
          Component: "/src/components/cms/EditorialHome#EditorialHome",
        },
      },
      beforeLogin: ["/src/components/cms/Brand#LoginIntro"],
    },
  },
  i18n: {
    supportedLanguages: { fr, en },
    fallbackLanguage: "fr",
    translations: {
      fr: {
        general: { createNew: "Créer", createNewLabel: "Créer : {{label}}" },
      },
    },
  },
  folders: {
    collectionOverrides: [
      ({ collection }) => ({
        ...collection,
        labels: { singular: "Dossier", plural: "Dossiers" },
        access: {
          ...collection.access,
          read: authenticated,
          create: authenticated,
          update: authenticated,
          delete: adminOnly,
        },
        fields: collection.fields.map((field) =>
          "name" in field && field.name === "name"
            ? { ...field, label: "Nom du dossier" }
            : field,
        ),
      }),
    ],
  },
  collections: [Users, Posts, Media],
  editor: lexicalEditor(),
  db: sqliteAdapter({
    prodMigrations: migrations,
    client: { url: process.env.DATABASE_URI || "file:./aegis-content.db" },
  }),
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  upload: { limits: { fileSize: 10000000 } },
});
