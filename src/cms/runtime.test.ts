import { afterEach, expect, it, vi } from "vitest";
import { initializeCMS } from "./runtime";
vi.mock("node:fs/promises", () => ({
  default: { readFile: vi.fn(async () => "a-long-private-test-password\n") },
  readFile: vi.fn(async () => "a-long-private-test-password\n"),
}));
afterEach(() => vi.unstubAllEnvs());
const mock = () => ({
  count: vi.fn(async () => ({ totalDocs: 0 })),
  create: vi.fn(),
  logger: { info: vi.fn() },
});
it("requires a persistent production secret", async () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("PAYLOAD_SECRET", "short");
  await expect(initializeCMS(mock() as never)).rejects.toThrow(
    "PAYLOAD_SECRET",
  );
});
it("provisions only an empty installation through a private context", async () => {
  vi.stubEnv("CMS_BOOTSTRAP_EMAIL", "admin@example.test");
  vi.stubEnv("CMS_BOOTSTRAP_PASSWORD_FILE", "/private/password");
  const p = mock();
  await initializeCMS(p as never);
  expect(p.create).toHaveBeenCalledWith(
    expect.objectContaining({
      context: { bootstrapCMS: true },
      data: expect.objectContaining({
        email: "admin@example.test",
        role: "admin",
      }),
    }),
  );
  p.create.mockClear();
  p.count.mockResolvedValue({ totalDocs: 1 });
  await initializeCMS(p as never);
  expect(p.create).not.toHaveBeenCalled();
});
it("rejects partial bootstrap configuration", async () => {
  vi.stubEnv("CMS_BOOTSTRAP_EMAIL", "admin@example.test");
  vi.stubEnv("CMS_BOOTSTRAP_PASSWORD_FILE", "");
  await expect(initializeCMS(mock() as never)).rejects.toThrow("both");
});
it("does nothing without explicit provisioning", async () => {
  vi.stubEnv("CMS_BOOTSTRAP_EMAIL", "");
  vi.stubEnv("CMS_BOOTSTRAP_PASSWORD_FILE", "");
  const p = mock();
  await initializeCMS(p as never);
  expect(p.create).not.toHaveBeenCalled();
});
