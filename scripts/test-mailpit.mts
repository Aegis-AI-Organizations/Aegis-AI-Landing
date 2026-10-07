import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
import { getPayload } from "payload";
const dir = await mkdtemp(`${tmpdir()}/aegis-mail-test-`);
process.env.DATABASE_URI = `file:${dir}/test.db`;
process.env.PAYLOAD_SECRET = randomBytes(32).toString("hex");
process.env.SMTP_HOST = "127.0.0.1";
process.env.SMTP_PORT = "1025";
process.env.SITE_URL = "http://localhost:3001";
const { default: config } = await import("../src/payload.config");
const p = await getPayload({ config });
const email = `cms-${randomBytes(6).toString("hex")}@example.test`;
let messageID: string | undefined;
try {
  const oldPassword = randomBytes(24).toString("hex");
  await p.create({
    collection: "users",
    context: { bootstrapCMS: true },
    data: { email, name: "Mailpit integration", password: oldPassword },
  });
  const token = await p.forgotPassword({
    collection: "users",
    data: { email },
  });
  assert.ok(token);
  const inbox = await fetch("http://127.0.0.1:8025/api/v1/messages").then((r) =>
    r.json(),
  );
  const msg = inbox.messages.find((m: { To: { Address: string }[] }) =>
    m.To.some((t) => t.Address === email),
  );
  assert.ok(msg, "Mailpit must capture the reset email");
  messageID = msg.ID;
  const detail = await fetch(
    `http://127.0.0.1:8025/api/v1/message/${messageID}`,
  ).then((r) => r.json());
  assert.ok(
    detail.HTML.includes(token),
    "Email must contain the actual reset token",
  );
  assert.ok(
    detail.HTML.includes("http://localhost:3001/admin/reset/"),
    "Reset URL must use the configured origin",
  );
  const newPassword = randomBytes(24).toString("hex");
  await p.resetPassword({
    collection: "users",
    overrideAccess: false,
    data: { token, password: newPassword },
  });
  await assert.rejects(
    p.login({ collection: "users", data: { email, password: oldPassword } }),
  );
  assert.ok(
    (
      await p.login({
        collection: "users",
        data: { email, password: newPassword },
      })
    ).token,
  );
  await assert.rejects(
    p.resetPassword({
      collection: "users",
      overrideAccess: false,
      data: { token, password: newPassword },
    }),
  );
  console.log(
    "Mailpit reset passed: delivery, configured origin, password change and token single use.",
  );
} finally {
  if (messageID)
    await fetch(`http://127.0.0.1:8025/api/v1/messages`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ IDs: [messageID] }),
    });
  await p.destroy();
  await rm(dir, { recursive: true, force: true });
}
