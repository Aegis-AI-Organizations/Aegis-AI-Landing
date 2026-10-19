import type { DefaultCellComponentProps } from "payload";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  role: "admin",
}));
vi.mock("next/navigation", () => ({ useRouter: () => mocks }));
vi.mock("@payloadcms/ui", () => ({
  useAuth: () => ({ user: { role: mocks.role } }),
}));
import { ArticleActions } from "./ArticleActions";
const show = () =>
  render(
    <table>
      <tbody>
        <tr>
          <td>Mon article</td>
          <td>
            <input type="checkbox" aria-label="Sélectionner" />
          </td>
          <td>
            <ArticleActions
              {...({
                rowData: { id: 5, title: "Mon article" },
              } as Pick<DefaultCellComponentProps, "rowData">)}
            />
          </td>
        </tr>
      </tbody>
    </table>,
  );
beforeEach(() => {
  vi.clearAllMocks();
  mocks.role = "admin";
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it("opens the row but leaves selection and action buttons independent", () => {
  show();
  fireEvent.click(screen.getByText("Mon article"));
  expect(mocks.push).toHaveBeenCalledWith("/admin/collections/posts/5");
  mocks.push.mockClear();
  fireEvent.click(screen.getByRole("checkbox"));
  vi.spyOn(window, "confirm").mockReturnValue(false);
  const request = vi.fn();
  vi.stubGlobal("fetch", request);
  fireEvent.click(
    screen.getByRole("button", { name: "Supprimer : Mon article" }),
  );
  expect(mocks.push).not.toHaveBeenCalled();
  expect(request).not.toHaveBeenCalled();
});
it("deletes only after confirmation, refreshes on success and keeps the user on the list", async () => {
  show();
  vi.spyOn(window, "confirm").mockReturnValue(true);
  const request = vi.fn().mockResolvedValue({ ok: true });
  vi.stubGlobal("fetch", request);
  fireEvent.click(
    screen.getByRole("button", { name: "Supprimer : Mon article" }),
  );
  await waitFor(() => expect(mocks.refresh).toHaveBeenCalled());
  expect(request).toHaveBeenCalledWith("/api/posts/5", {
    method: "DELETE",
    credentials: "same-origin",
  });
  expect(mocks.push).not.toHaveBeenCalled();
});
it("does not offer deletion to editors", () => {
  mocks.role = "editor";
  show();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Modifier : Mon article" }),
  ).toHaveAttribute("href", "/admin/collections/posts/5");
});
it("shows a failed deletion without navigating away", async () => {
  show();
  vi.spyOn(window, "confirm").mockReturnValue(true);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  fireEvent.click(
    screen.getByRole("button", { name: "Supprimer : Mon article" }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "La suppression a échoué",
  );
  expect(mocks.refresh).not.toHaveBeenCalled();
});
