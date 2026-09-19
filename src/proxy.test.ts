import { expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";
it("redirects the root to French on the same origin", () => {
  const response = proxy(new NextRequest("https://example.com/"));
  expect(response.status).toBe(307);
  expect(response.headers.get("location")).toBe("https://example.com/fr");
});
