import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  editable: true,
  setValue: vi.fn(),
  addFieldRow: vi.fn(),
  removeFieldRow: vi.fn(),
  fields: {} as Record<string, { value?: unknown; rows?: { id: string }[] }>,
}));
vi.mock("@payloadcms/ui", () => ({
  useField: ({ path }: { path: string }) => ({
    value: state.fields[path]?.value,
    setValue: (value: unknown) => state.setValue(path, value),
  }),
  useFormFields: (select: (args: unknown[]) => unknown) =>
    select([state.fields]),
  useForm: () => ({
    addFieldRow: state.addFieldRow,
    removeFieldRow: state.removeFieldRow,
  }),
}));
vi.mock("@lexical/react/useLexicalEditable", () => ({
  useLexicalEditable: () => state.editable,
}));
vi.mock("@payloadcms/richtext-lexical/client", () => ({
  useBlockComponentContext: () => ({
    RemoveButton: () => <button>Retirer le bloc</button>,
    errorCount: 0,
  }),
}));
import { CalloutBlock, TableBlock, FAQBlock } from "./ArticleBlocks";

beforeEach(() => {
  vi.clearAllMocks();
  state.editable = true;
  state.fields = {
    headers: { rows: [{ id: "h1" }, { id: "h2" }, { id: "h3" }] },
    rows: { rows: [{ id: "r1" }, { id: "r2" }] },
    "rows.0.cells.1.text": { value: "Conserver ce contenu" },
    tone: { value: "warning" },
    title: { value: "Attention" },
    body: { value: "Texte existant" },
    items: { rows: [{ id: "q1" }] },
  };
});
afterEach(cleanup);
it("edits a table cell at its existing Payload path and removes a column from every row", () => {
  render(<TableBlock />);
  const cell = screen.getByRole("textbox", { name: "Ligne 1, colonne 2" });
  expect(cell).toHaveValue("Conserver ce contenu");
  fireEvent.change(cell, { target: { value: "Nouveau contenu" } });
  expect(state.setValue).toHaveBeenCalledWith(
    "rows.0.cells.1.text",
    "Nouveau contenu",
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Supprimer la colonne 2" }),
  );
  expect(state.removeFieldRow.mock.calls).toEqual([
    [{ path: "headers", rowIndex: 1 }],
    [{ path: "rows.0.cells", rowIndex: 1 }],
    [{ path: "rows.1.cells", rowIndex: 1 }],
  ]);
});
it("adds a complete row matching the number of columns", () => {
  render(<TableBlock />);
  fireEvent.click(screen.getByRole("button", { name: "+ Ligne" }));
  const { subFieldState } = state.addFieldRow.mock.calls[0][0];
  expect(subFieldState.cells.rows).toHaveLength(3);
  expect(subFieldState["cells.2.text"].value).toBe("");
});
it("renders an existing callout with its tone and edits the actual body", () => {
  render(<CalloutBlock />);
  expect(screen.getByRole("complementary")).toHaveAttribute(
    "data-tone",
    "warning",
  );
  fireEvent.change(
    screen.getByRole("textbox", { name: "Texte de l’encadré" }),
    { target: { value: "Une nouvelle idée" } },
  );
  expect(state.setValue).toHaveBeenCalledWith("body", "Une nouvelle idée");
});
it("keeps read-only block content non-editable and hides destructive actions", () => {
  state.editable = false;
  render(<TableBlock />);
  expect(
    screen.getByRole("textbox", { name: "Ligne 1, colonne 2" }),
  ).toBeDisabled();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
it("adds a question with the same schema as existing FAQ blocks", () => {
  render(<FAQBlock />);
  fireEvent.click(screen.getByRole("button", { name: "+ Question" }));
  expect(state.addFieldRow.mock.calls[0][0]).toMatchObject({
    path: "items",
    subFieldState: { question: { value: "" }, answer: { value: "" } },
  });
});
