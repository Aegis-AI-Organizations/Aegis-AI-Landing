import { describe, expect, it } from "vitest";
import type { AccessArgs } from "payload";
import {
  adminOnly,
  authenticated,
  ownAccountOrAdmin,
  publishedOrTeam,
} from "./access";
const args = (role?: string) =>
  ({ req: { user: role ? { id: 7, role } : null } }) as AccessArgs;
describe("editorial access", () => {
  it("only exposes published documents to anonymous visitors", () => {
    expect(publishedOrTeam(args())).toEqual({
      _status: { equals: "published" },
    });
    expect(publishedOrTeam(args("editor"))).toBe(true);
    expect(authenticated(args())).toBe(false);
    expect(authenticated(args("editor"))).toBe(true);
  });
  it("reserves destructive and team management actions for administrators", () => {
    expect(adminOnly(args())).toBe(false);
    expect(adminOnly(args("editor"))).toBe(false);
    expect(adminOnly(args("admin"))).toBe(true);
  });
  it("prevents editors from reading or updating other accounts", () => {
    expect(ownAccountOrAdmin(args())).toBe(false);
    expect(ownAccountOrAdmin(args("editor"))).toEqual({ id: { equals: 7 } });
    expect(ownAccountOrAdmin(args("admin"))).toBe(true);
  });
});
