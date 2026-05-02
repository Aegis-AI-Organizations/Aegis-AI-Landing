import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("next/image", () => ({
  default: ({
    priority: _priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    <img {...props} />
  ),
}));

describe("landing home page", () => {
  it("renders the public call-to-action content", () => {
    render(<Home />);

    expect(
      screen.getByText("To get started, edit the page.tsx file."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Deploy Now/ })).toHaveAttribute(
      "href",
      expect.stringContaining("vercel.com/new"),
    );
    expect(screen.getByRole("link", { name: "Documentation" })).toHaveAttribute(
      "href",
      expect.stringContaining("nextjs.org/docs"),
    );
  });
});
