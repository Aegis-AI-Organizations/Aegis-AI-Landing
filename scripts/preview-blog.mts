/** Disposable visual fixture. Never reads or seeds the real CMS database. */
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { getPayload } from "payload";
const dir = await mkdtemp(`${tmpdir()}/aegis-blog-preview-`);
process.env.DATABASE_URI = `file:${dir}/preview.db`;
process.env.MEDIA_DIR = `${dir}/media`;
process.env.PAYLOAD_SECRET = randomBytes(32).toString("hex");
process.env.SITE_URL = "http://localhost:3002";
delete process.env.CMS_BOOTSTRAP_EMAIL;
delete process.env.CMS_BOOTSTRAP_PASSWORD_FILE;
const { default: config } = await import("../src/payload.config");
const payload = await getPayload({ config });
const text = (value: string) => ({
  type: "text",
  version: 1,
  text: value,
  format: 0,
  detail: 0,
  mode: "normal",
  style: "",
});
const paragraph = (value: string) => ({
  type: "paragraph",
  version: 1,
  direction: null,
  format: "",
  indent: 0,
  children: [text(value)],
});
try {
  const cover = await payload.create({
    collection: "media",
    data: { alt: "Logo Aegis AI — contenu de validation" },
    filePath: "public/logo.png",
  });
  for (const language of ["fr", "en"] as const) {
    const fr = language === "fr";
    await payload.create({
      collection: "posts",
      data: {
        language,
        slug: `validation-${language}`,
        title: fr
          ? "Comprendre son infrastructure avant de lancer une campagne de sécurité : du périmètre aux preuves"
          : "Understand your infrastructure before starting a security assessment: from scope to evidence",
        excerpt: fr
          ? "Article de validation locale. Un contenu représentatif pour vérifier les titres longs, les illustrations et la lecture sur mobile."
          : "Local validation article. Representative content to check long titles, illustrations and reading on mobile.",
        authorName: "Équipe Aegis · Démonstration",
        category: "guides",
        cover: cover.id,
        _status: "published",
        content: {
          root: {
            type: "root",
            version: 1,
            direction: null,
            format: "",
            indent: 0,
            children: [
              { type: "block", version: 2, format: "", fields: { blockType: "callout", title: fr ? "À retenir" : "Key takeaway", body: fr ? "Un encadré pour mettre une idée en évidence." : "A callout to highlight an idea.", tone: "tip" } },
              { type: "block", version: 2, format: "", fields: { blockType: "codeSnippet", filename: "example.json", code: '{ "environment": "demo" }' } },
              { type: "block", version: 2, format: "", fields: { blockType: "articleTable", caption: fr ? "Périmètre" : "Scope", headers: [{ text: "Service" }, { text: fr ? "État" : "Status" }], rows: [{ cells: [{ text: "API" }, { text: "Demo" }] }] } },
              { type: "block", version: 2, format: "", fields: { blockType: "articleFAQ", items: [{ question: fr ? "Des données réelles ?" : "Real data?", answer: fr ? "Non, uniquement une démonstration." : "No, demonstration content only." }] } },
              paragraph(
                fr
                  ? "Ce contenu est une démonstration locale et ne décrit aucun résultat de scan réel."
                  : "This is local demonstration content and does not describe any real scan findings.",
              ),
              {
                ...paragraph(fr ? "Définir le périmètre" : "Define the scope"),
                type: "heading",
                tag: "h2",
              },
              paragraph(
                fr
                  ? "Identifiez les services, leurs dépendances et les limites de l’environnement autorisé avant toute analyse."
                  : "Identify services, dependencies and the boundaries of the authorized environment before any assessment.",
              ),
              {
                type: "list",
                version: 1,
                listType: "bullet",
                tag: "ul",
                start: 1,
                direction: null,
                format: "",
                indent: 0,
                children: [
                  fr
                    ? "Définir les services à observer."
                    : "Define the services to observe.",
                  fr
                    ? "Examiner les preuves et leur contexte."
                    : "Review evidence and its context.",
                ].map((s, i) => ({
                  type: "listitem",
                  version: 1,
                  value: i + 1,
                  direction: null,
                  format: "",
                  indent: 0,
                  children: [text(s)],
                })),
              },
              {
                ...paragraph(""),
                children: [
                  {
                    type: "link",
                    version: 3,
                    direction: null,
                    format: "",
                    indent: 0,
                    fields: {
                      linkType: "custom",
                      newTab: false,
                      url: `/${language}/blog`,
                    },
                    children: [
                      text(fr ? "Revenir au journal" : "Return to the journal"),
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    });
  }
  await payload.destroy();
  console.log(
    "Isolated blog preview: http://localhost:3002/fr/blog and /en/blog",
  );
  const server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3002",
    ],
    { env: process.env, stdio: "inherit" },
  );
  process.on("SIGINT", () => server.kill("SIGINT"));
  process.on("SIGTERM", () => server.kill("SIGTERM"));
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.once("exit", () => resolve());
  });
} finally {
  await rm(dir, { recursive: true, force: true });
}
