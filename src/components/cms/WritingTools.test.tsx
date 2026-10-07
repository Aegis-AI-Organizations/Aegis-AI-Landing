import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
vi.mock("@payloadcms/ui", () => ({
  useFormFields: (select: (state: unknown) => unknown) =>
    select([
      {
        content: {
          value: {
            root: {
              children: [
                { text: "Un article de test" },
                { fields: { body: "Un encadré" } },
              ],
            },
          },
        },
      },
    ]),
}));
import { WritingTools } from "./WritingTools";
afterEach(cleanup);
it("counts writing content and restores normal layout when leaving focus mode", () => {
  const { unmount } = render(<WritingTools />);
  expect(screen.getByText("6 mots · 1 min de lecture")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Mode rédaction" }));
  expect(document.body).toHaveClass("cms-writing-focus");
  expect(
    screen.getByRole("button", { name: "Afficher les réglages" }),
  ).toHaveAttribute("aria-pressed", "true");
  unmount();
  expect(document.body).not.toHaveClass("cms-writing-focus");
});
