import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
import { getPayload } from "payload";
import sharp from "sharp";

const dir = await mkdtemp(path.join(tmpdir(), "aegis-cms-test-"));
process.env.DATABASE_URI = `file:${dir}/test.db`;
process.env.PAYLOAD_SECRET = randomBytes(32).toString("hex");
process.env.MEDIA_DIR = `${dir}/media`;
const { default: config } = await import("../src/payload.config");
const payload = await getPayload({ config });
try {
  const password = randomBytes(24).toString("hex");
  if (process.env.NODE_ENV === "production") {
    await assert.rejects(
      payload.create({
        collection: "users",
        data: { email: "intruder@example.test", name: "Blocked", password },
      }),
      /bootstrap is disabled/,
    );
  }
  const admin = await payload.create({
    context: { bootstrapCMS: true },
    collection: "users",
    data: {
      name: "Test admin",
      email: "admin@example.test",
      password,
      role: "editor",
    },
  });
  assert.equal(admin.role, "admin", "First user must become administrator");
  const editor = await payload.create({
    collection: "users",
    user: admin,
    overrideAccess: false,
    data: {
      name: "Test editor",
      email: "editor@example.test",
      password,
      role: "editor",
    },
  });
  await assert.rejects(
    payload.create({
      collection: "users",
      user: editor,
      overrideAccess: false,
      data: {
        name: "Forbidden",
        email: "forbidden@example.test",
        password,
        role: "admin",
      },
    }),
  );
  const updated = await payload.update({
    collection: "users",
    id: editor.id,
    user: editor,
    overrideAccess: false,
    data: { role: "admin" },
  });
  assert.equal(updated.role, "editor", "Editors cannot elevate their own role");
  const own = await payload.find({
    collection: "users",
    user: editor,
    overrideAccess: false,
  });
  assert.equal(own.totalDocs, 1);
  assert.equal(own.docs[0].id, editor.id);
  const image = await sharp({
    create: { width: 4, height: 4, channels: 3, background: "#00f2ff" },
  })
    .png()
    .toBuffer();
  const media = await payload.create({
    collection: "media",
    user: editor,
    overrideAccess: false,
    data: { alt: "Integration test image" },
    file: {
      data: image,
      mimetype: "image/png",
      name: "test.png",
      size: image.length,
    },
  });
  const folder = await payload.create({
    collection: "payload-folders",
    user: editor,
    overrideAccess: false,
    data: { name: "Blog", folderType: ["media"] },
  });
  const child = await payload.create({
    collection: "payload-folders",
    user: editor,
    overrideAccess: false,
    data: { name: "Couvertures", folder: folder.id, folderType: ["media"] },
  });
  const moved = await payload.update({
    collection: "media",
    id: media.id,
    user: editor,
    overrideAccess: false,
    data: { folder: child.id },
    depth: 0,
  });
  assert.equal(moved.folder, child.id);
  assert.equal(
    moved.url,
    media.url,
    "Moving an image preserves published URLs",
  );
  await payload.update({
    collection: "payload-folders",
    id: child.id,
    user: editor,
    overrideAccess: false,
    data: { name: "Visuels", folder: null },
  });
  await assert.rejects(
    payload.create({
      collection: "payload-folders",
      overrideAccess: false,
      data: { name: "Unauthorized" },
    }),
  );
  await assert.rejects(
    payload.find({ collection: "payload-folders", overrideAccess: false }),
  );
  await assert.rejects(
    payload.delete({
      collection: "payload-folders",
      id: folder.id,
      user: editor,
      overrideAccess: false,
    }),
  );
  await payload.delete({
    collection: "payload-folders",
    id: child.id,
    user: admin,
    overrideAccess: false,
  });
  const preserved = await payload.findByID({
    collection: "media",
    id: media.id,
    depth: 0,
  });
  assert.equal(
    preserved.folder,
    null,
    "Deleting a folder keeps its images at the root",
  );
  assert.ok(media.url);
  assert.equal(media.alt, "Integration test image");
  await assert.rejects(
    payload.create({
      collection: "media",
      overrideAccess: false,
      data: { alt: "Unauthorized" },
      file: {
        data: image,
        mimetype: "image/png",
        name: "forbidden.png",
        size: image.length,
      },
    }),
  );
  const content = {
    root: {
      type: "root",
      version: 1,
      direction: null as null,
      format: "" as const,
      indent: 0,
      children: [
        {
          type: "paragraph",
          version: 1,
          direction: null,
          format: "",
          indent: 0,
          children: [
            {
              type: "text",
              version: 1,
              text: "Aegis integration test",
              format: 0,
              detail: 0,
              mode: "normal",
              style: "",
            },
          ],
        },
      ],
    },
  };
  const post = await payload.create({
    collection: "posts",
    user: editor,
    overrideAccess: false,
    draft: true,
    data: {
      title: "Private draft",
      slug: "private-draft",
      excerpt: "Test excerpt",
      language: "fr",
      authorName: "Aegis test",
      category: "research",
      content,
      _status: "draft",
    },
  });
  const enriched = await payload.update({
    collection: "posts", id: post.id, user: editor, overrideAccess: false, draft: true,
    data: { content: { ...content, root: { ...content.root, children: [...content.root.children,
      { type: "block", version: 2, format: "", fields: { blockType: "callout", title: "À retenir", tone: "tip", body: "Un conseil utile." } },
      { type: "block", version: 2, format: "", fields: { blockType: "codeSnippet", filename: "test.txt", code: "hello world" } },
      { type: "block", version: 2, format: "", fields: { blockType: "articleTable", caption: "Services", headers: [{ text: "Nom" }, { text: "État" }], rows: [{ cells: [{ text: "API" }, { text: "Prêt" }] }] } },
      { type: "block", version: 2, format: "", fields: { blockType: "articleFAQ", items: [{ question: "Pourquoi ?", answer: "Pour vérifier le rendu." }] } },
    ] } } },
  });
  assert.equal(enriched.content.root.children.length, 5, "Rich article blocks survive draft persistence");
  assert.equal(
    (await payload.find({ collection: "posts", overrideAccess: false }))
      .totalDocs,
    0,
    "Anonymous cannot read drafts",
  );
  await assert.rejects(
    payload.findByID({
      collection: "posts",
      id: post.id,
      overrideAccess: false,
      draft: true,
    }),
  );
  assert.equal(
    (
      await payload.findByID({
        collection: "posts",
        id: post.id,
        user: editor,
        overrideAccess: false,
        draft: true,
      })
    ).title,
    "Private draft",
  );
  await payload.update({
    collection: "posts",
    id: post.id,
    user: editor,
    overrideAccess: false,
    data: { _status: "published" },
  });
  const published = await payload.findByID({
    collection: "posts",
    id: post.id,
    overrideAccess: false,
  });
  assert.ok(published.publishedAt);
  assert.equal(published._status, "published");
  await payload.update({
    collection: "posts",
    id: post.id,
    user: editor,
    overrideAccess: false,
    draft: true,
    data: { title: "Unpublished revision", _status: "draft" },
  });
  assert.equal(
    (
      await payload.findByID({
        collection: "posts",
        id: post.id,
        overrideAccess: false,
      })
    ).title,
    "Private draft",
    "Draft revisions do not replace the live version",
  );
  assert.equal(
    (
      await payload.findByID({
        collection: "posts",
        id: post.id,
        user: editor,
        overrideAccess: false,
        draft: true,
      })
    ).title,
    "Unpublished revision",
  );
  const versions = await payload.findVersions({
    collection: "posts",
    user: editor,
    overrideAccess: false,
    where: { parent: { equals: post.id } },
  });
  assert.ok(versions.totalDocs >= 2);
  await assert.rejects(
    payload.delete({
      collection: "posts",
      id: post.id,
      user: editor,
      overrideAccess: false,
    }),
  );
  await payload.update({
    collection: "posts",
    id: post.id,
    user: editor,
    overrideAccess: false,
    data: { _status: "draft" },
  });
  assert.equal(
    (await payload.find({ collection: "posts", overrideAccess: false }))
      .totalDocs,
    0,
    "Unpublish removes public access",
  );
  console.log(
    "CMS integration passed: bootstrap, roles, draft privacy, preview access, publishing, revisions, unpublishing.",
  );
} finally {
  await payload.destroy();
  await rm(dir, { recursive: true, force: true });
}
