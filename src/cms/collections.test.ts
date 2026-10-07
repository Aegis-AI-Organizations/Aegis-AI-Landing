import { describe, it, expect, vi } from "vitest";
import { Users, Posts, Media } from "./collections";
describe("editorial model safeguards", () => {
  it("promotes only the initial anonymous bootstrap account", async () => {
    const hook = Users.hooks!.beforeChange![0];
    const count = vi.fn(async () => ({ totalDocs: 0 }));
    const req = { user: null, payload: { count } };
    expect(
      await hook({
        data: { role: "editor" },
        operation: "create",
        req,
      } as never),
    ).toEqual({ role: "admin" });
    count.mockResolvedValue({ totalDocs: 1 });
    await expect(
      hook({ data: { role: "admin" }, operation: "create", req } as never),
    ).rejects.toThrow();
    const data = { role: "editor" };
    expect(
      await hook({
        data,
        operation: "create",
        req: { user: { id: 1 } },
      } as never),
    ).toBe(data);
  });
  it("protects role changes at field level", () => {
    const role = Users.fields.find((f) => "name" in f && f.name === "role")!;
    if (!("access" in role)) throw new Error("Missing field access");
    for (const operation of ["create", "update"] as const) {
      expect(
        role.access![operation]!({
          req: { user: { role: "editor" } },
        } as never),
      ).toBe(false);
      expect(
        role.access![operation]!({ req: { user: { role: "admin" } } } as never),
      ).toBe(true);
    }
  });
  it("validates routable slugs and preview links", async () => {
    const slug = Posts.fields.find((f) => "name" in f && f.name === "slug")!;
    if (!("validate" in slug)) throw new Error("Missing validator");
    const validate = slug.validate as (value: unknown) => boolean | string;
    expect(validate("a-valid-slug-42")).toBe(true);
    expect(validate("../admin")).not.toBe(true);
    expect(validate("")).not.toBe(true);
    const preview = Posts.admin!.preview as (data: {
      id?: number;
    }) => string | null;
    expect(preview({ id: 3 })).toBe("/preview/3");
    expect(preview({})).toBeNull();
  });
  it("sets the publication date once without replacing a chosen date", async () => {
    const hook = Posts.hooks!.beforeChange![0];
    const first = await hook({
      data: { _status: "published" },
      originalDoc: {},
    } as never);
    expect(first.publishedAt).toBeTruthy();
    const draft = await hook({
      data: { _status: "draft" },
      originalDoc: {},
    } as never);
    expect(draft.publishedAt).toBeUndefined();
    const chosen = await hook({
      data: { _status: "published", publishedAt: "2026-09-01" },
      originalDoc: {},
    } as never);
    expect(chosen.publishedAt).toBe("2026-09-01");
  });
  it("serves media for public article rendering", () => {
    expect(Media.access!.read!({} as never)).toBe(true);
  });
});
