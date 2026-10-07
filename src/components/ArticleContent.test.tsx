import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ArticleContent } from "./ArticleContent";
import type { Post } from "@/payload-types";
afterEach(cleanup);
const content = (children: unknown[]): Post["content"] =>
  ({
    root: {
      type: "root",
      version: 1,
      direction: null,
      format: "",
      indent: 0,
      children,
    },
  }) as Post["content"];
const block = (fields: Record<string, unknown>) => ({
  type: "block",
  version: 2,
  format: "",
  fields,
});
describe("article content", () => {
  it("renders editorial blocks, preserves code as text and aligns table cells", () => {
    render(
      <ArticleContent
        content={content([
          block({
            blockType: "callout",
            tone: "warning",
            title: "Attention",
            body: "Un périmètre autorisé.",
          }),
          block({
            blockType: "codeSnippet",
            filename: "example.html",
            code: '<script>alert("test")</script>',
          }),
          block({
            blockType: "articleTable",
            caption: "Comparaison",
            headers: [{ text: "Service" }, { text: "État" }],
            rows: [{ cells: [{ text: "API" }] }],
          }),
          block({
            blockType: "articleFAQ",
            items: [
              {
                question: "Comment commencer ?",
                answer: "Définir le périmètre.",
              },
            ],
          }),
        ])}
      />,
    );
    expect(screen.getByText("Un périmètre autorisé.")).toBeVisible();
    expect(screen.getByText('<script>alert("test")</script>')).toBeVisible();
    expect(document.querySelector("script")).toBeNull();
    expect(screen.getAllByRole("cell")).toHaveLength(2);
    expect(screen.getByRole("table")).toHaveAccessibleName("Comparaison");
    expect(screen.getByText("Comment commencer ?").tagName).toBe("SUMMARY");
  });
  it("renders inline media with its caption and safely skips unpopulated media", () => {
    render(
      <ArticleContent
        content={content([
          {
            type: "upload",
            version: 3,
            relationTo: "media",
            value: {
              id: 1,
              url: "/logo.png",
              alt: "Aegis",
              width: 100,
              height: 100,
            },
            fields: { caption: "Vue de la plateforme" },
          },
          { type: "upload", version: 3, relationTo: "media", value: 2 },
        ])}
      />,
    );
    expect(screen.getByAltText("Aegis")).toBeVisible();
    expect(screen.getByText("Vue de la plateforme").tagName).toBe("FIGCAPTION");
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });
});
