import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
const file = ".env.local";
let content = existsSync(file) ? readFileSync(file, "utf8") : "";
if (!/^PAYLOAD_SECRET=.+/m.test(content))
  content += `\nPAYLOAD_SECRET=${randomBytes(32).toString("hex")}\n`;
if (!/^DATABASE_URI=/m.test(content))
  content += "DATABASE_URI=file:./aegis-content.db\n";
if (!/^SMTP_HOST=/m.test(content))
  content +=
    "SMTP_HOST=127.0.0.1\nSMTP_PORT=1025\nSMTP_FROM_ADDRESS=noreply@aegis.test\n";
writeFileSync(file, content, { mode: 0o600 });
console.log("CMS local configuré. Lancez npm run dev, puis ouvrez /admin.");
