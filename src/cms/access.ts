import type { Access } from "payload";

export const authenticated: Access = ({ req }) => Boolean(req.user);
export const adminOnly: Access = ({ req }) => req.user?.role === "admin";
export const ownAccountOrAdmin: Access = ({ req }) =>
  req.user?.role === "admin"
    ? true
    : req.user
      ? { id: { equals: req.user.id } }
      : false;
export const publishedOrTeam: Access = ({ req }) =>
  req.user ? true : { _status: { equals: "published" } };
