import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MediaExplorer } from "./MediaExplorer";
const navigation = vi.hoisted(() => ({ query: "", push: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: navigation.push }),
  useSearchParams: () => new URLSearchParams(navigation.query),
}));
const fetchMock = vi.fn();
const response = (data: unknown, ok = true) => ({ ok, json: async () => data });
beforeEach(() => {
  navigation.query = "";
  vi.stubGlobal("fetch", fetchMock);
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute("open");
  });
  fetchMock.mockResolvedValue(response({ docs: [], totalPages: 1 }));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});
it("opens only root items and exposes the two primary actions", async () => {
  render(<MediaExplorer />);
  await screen.findByText(/Ce dossier est vide/);
  expect(fetchMock.mock.calls[0][0]).toContain(
    "where%5Bfolder%5D%5Bexists%5D=false",
  );
  expect(
    screen.getByRole("button", { name: "Créer un dossier" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Importer un média" }),
  ).toBeInTheDocument();
});
it("creates a folder in the current directory and refreshes the listing", async () => {
  navigation.query = "folder=7";
  fetchMock.mockImplementation((url: string) =>
    Promise.resolve(
      response(
        url.includes("/payload-folders/7")
          ? { id: 7, name: "Blog", folder: null }
          : { docs: [], totalPages: 1 },
      ),
    ),
  );
  render(<MediaExplorer />);
  await screen.findByRole("link", { name: "Blog" });
  fireEvent.click(screen.getByRole("button", { name: "Créer un dossier" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Nom du dossier" }), {
    target: { value: "Couvertures" },
  });
  fireEvent.click(screen.getByRole("button", { name: /^Créer$/ }));
  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/payload-folders",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Couvertures",
          folderType: ["media"],
          folder: 7,
        }),
      }),
    ),
  );
});
it("shows a recoverable error instead of a misleading empty directory", async () => {
  fetchMock.mockResolvedValue(
    response({ errors: [{ message: "Connexion expirée" }] }, false),
  );
  render(<MediaExplorer />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Connexion expirée",
  );
  expect(screen.queryByText(/Ce dossier est vide/)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Réessayer" })).toBeInTheDocument();
});
