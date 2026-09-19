import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import Home from "../components/Landing";

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

vi.mock("gsap", () => ({ default: { registerPlugin: vi.fn() } }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
vi.mock("@gsap/react", () => ({ useGSAP: vi.fn() }));

afterEach(cleanup);

describe("landing demo", () => {
  it("switches evidence without launching a test", () => {
    render(<Home />);
    expect(screen.getByText("GET /api/users?id=…")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /Cross-site scripting/ }),
    );
    expect(screen.getByText("GET /search?q=…")).toBeInTheDocument();
    expect(screen.queryByText("GET /api/users?id=…")).not.toBeInTheDocument();
    expect(screen.getByText(/Aucun test n’est lancé/)).toBeInTheDocument();
  });
  it("explores dashboard views and selects targets without calling an API", () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("checkbox", { name: /postgres-db/ }));
    expect(screen.getByText("3 cible(s) sélectionnée(s)")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: /Cartographier/ }));
    expect(
      screen.getByRole("heading", { name: "Topologie de l’infrastructure" }),
    ).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("tab", { name: /Cartographier/ }), {
      key: "ArrowDown",
    });
    expect(screen.getByRole("tab", { name: /Investiguer/ })).toHaveFocus();
    expect(
      screen.getByRole("heading", { name: "Historique des scans" }),
    ).toBeInTheDocument();
  });
  it("offers a motion preference and an accessible mobile menu", () => {
    render(<Home />);
    fireEvent.click(
      screen.getByRole("button", { name: "Réduire les animations" }),
    );
    expect(
      screen.getByRole("button", { name: "Activer les animations" }),
    ).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    expect(
      screen.getByRole("button", { name: "Fermer le menu" }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});

// Exercise the full English interface, including translated interactive results.
import { LanguageProvider } from "../i18n/Language";
it("renders the English site and keeps its interactions translated", () => {
  render(
    <LanguageProvider locale="en">
      <Home />
    </LanguageProvider>,
  );
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Your infrastructure.Put to the test.",
  );
  expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  fireEvent.click(screen.getByRole("tab", { name: /Investigate/ }));
  expect(
    screen.getByRole("heading", { name: "Scan history" }),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: /Cross-site scripting Web app/ }),
  );
  expect(
    screen.getByRole("heading", { name: "An input reflected in the page." }),
  ).toBeInTheDocument();
  expect(screen.queryByText("La plateforme")).not.toBeInTheDocument();
});
