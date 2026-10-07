import { readFile } from "node:fs/promises";
import type { Payload } from "payload";

export async function initializeCMS(payload: Payload) {
  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32)
  ) {
    throw new Error(
      "Production requires a persistent PAYLOAD_SECRET of at least 32 characters.",
    );
  }
  const email = process.env.CMS_BOOTSTRAP_EMAIL;
  const passwordFile = process.env.CMS_BOOTSTRAP_PASSWORD_FILE;
  if (!email && !passwordFile) return;
  if (!email || !passwordFile)
    throw new Error(
      "Provide both CMS_BOOTSTRAP_EMAIL and CMS_BOOTSTRAP_PASSWORD_FILE.",
    );
  if (
    (await payload.count({ collection: "users", overrideAccess: true }))
      .totalDocs
  )
    return;
  const password = (await readFile(passwordFile, "utf8")).replace(/\r?\n$/, "");
  if (password.length < 16)
    throw new Error(
      "The bootstrap password must contain at least 16 characters.",
    );
  await payload.create({
    collection: "users",
    overrideAccess: true,
    context: { bootstrapCMS: true },
    data: {
      email,
      password,
      name: process.env.CMS_BOOTSTRAP_NAME || "Administration Aegis",
      role: "admin",
    },
  });
  payload.logger.info(
    "Initial CMS administrator created. Remove the bootstrap configuration and secret file.",
  );
}
