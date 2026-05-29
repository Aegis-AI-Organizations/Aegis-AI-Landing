import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("next/image", () => ({
  default: ({
    priority,
    alt = "",
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    void priority;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} {...props} />
    );
  },
}));

describe("landing home page", () => {
  it("renders the construction landing page", () => {
    render(<Home />);

    expect(screen.getByAltText("Aegis AI")).toHaveAttribute(
      "src",
      "/logo.svg",
    );
    expect(screen.getByText("Lancement en cours")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Le site Aegis AI est en construction.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/La landing page publique arrive prochainement/i),
    ).toBeInTheDocument();
    expect(screen.queryByText("Deploy Now")).not.toBeInTheDocument();
    expect(screen.queryByText("Documentation")).not.toBeInTheDocument();
  });
});
