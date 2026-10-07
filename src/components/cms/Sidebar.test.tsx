import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";
const state = vi.hoisted(() => ({ role: "admin", close: vi.fn() }));
vi.mock("@payloadcms/ui", () => ({
  useAuth: () => ({ user: { role: state.role } }),
  useNav: () => ({ navOpen: true, setNavOpen: state.close }),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/collections/posts/1",
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
it("highlights articles while editing and closes the mobile navigation", () => {
  state.role = "admin";
  render(<Sidebar />);
  expect(screen.getByRole("link", { name: "Articles" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(screen.getByRole("link", { name: "Équipe" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Fermer le menu" }));
  expect(state.close).toHaveBeenCalledWith(false);
});
it("only shows team administration to administrators", () => {
  state.role = "editor";
  render(<Sidebar />);
  expect(
    screen.queryByRole("link", { name: "Équipe" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Médias" })).toBeInTheDocument();
});
