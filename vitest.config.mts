import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      "@payload-config": new URL("./src/payload.config.ts", import.meta.url)
        .pathname,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/payload-types.ts",
        "src/migrations/**",
        "src/payload.config.ts",
        "src/app/[(]payload[)]/admin/**",
        "src/app/[(]payload[)]/layout.tsx",
        "src/app/[(]payload[)]/api/**",
      ],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
      },
    },
  },
});
