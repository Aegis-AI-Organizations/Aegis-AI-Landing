import { describe, expect, it, vi } from "vitest";
const { find } = vi.hoisted(() => ({ find: vi.fn() }));
vi.mock("payload", () => ({ getPayload: vi.fn(async () => ({ find })) }));
vi.mock("@payload-config", () => ({ default: {} }));
import { getBlog, getPost, categoryLabel } from "./blog";
describe("public blog queries", () => {
  it("enforces access control for both listing and article resolution", async () => {
    find.mockResolvedValue({ docs: [{ id: 1 }] });
    await getBlog("en", 2);
    expect(find).toHaveBeenLastCalledWith(
      expect.objectContaining({
        overrideAccess: false,
        page: 2,
        where: { language: { equals: "en" } },
      }),
    );
    expect(await getPost("fr", "article")).toEqual({ id: 1 });
    expect(find).toHaveBeenLastCalledWith(
      expect.objectContaining({
        overrideAccess: false,
        where: {
          and: [
            { language: { equals: "fr" } },
            { slug: { equals: "article" } },
          ],
        },
      }),
    );
    find.mockResolvedValue({ docs: [] });
    expect(await getPost("en", "missing")).toBeNull();
  });
  it("localizes editorial categories", () => {
    expect(categoryLabel("research", "en")).toBe("Research");
    expect(categoryLabel("product", "fr")).toBe("Produit");
    expect(categoryLabel("guides", "en")).toBe("Guides");
    expect(categoryLabel("other", "fr")).toBe("other");
  });
});
