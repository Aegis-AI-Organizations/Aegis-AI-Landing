import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "../../i18n/Language";

type TriggerConfig = { onUpdate?: (self: { progress: number }) => void };
const triggers = vi.hoisted(() => [] as TriggerConfig[]);
const lenisScroll = vi.hoisted(() => vi.fn());

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    fromTo: vi.fn(() => ({ kill: vi.fn(), scrollTrigger: { kill: vi.fn() } })),
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
  },
}));
vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    update: vi.fn(),
    create: vi.fn((config: TriggerConfig) => {
      triggers.push(config);
      return { kill: vi.fn(), start: 1000, end: 6000, progress: 0 };
    }),
  },
}));
vi.mock("lenis", () => ({
  default: class {
    on = vi.fn();
    raf = vi.fn();
    destroy = vi.fn();
    scrollTo = lenisScroll;
  },
}));

import LandingPage from "./LandingPage";
import PlatformPage from "./PlatformPage";
import { ConsoleDemo, CONSOLE_VIEWS } from "./ConsoleDemo";

/** Avance le temps par petits pas pour laisser React planifier les minuteries suivantes. */
const advance = (ms: number) => {
  for (let t = 0; t < ms; t += 100) act(() => vi.advanceTimersByTime(100));
};

beforeEach(() => {
  triggers.length = 0;
  // Contexte 2D factice : chaque méthode est un no-op, chaque propriété est mémorisée.
  const ctx = new Proxy({} as Record<string | symbol, unknown>, {
    get: (target, key) => (key in target ? target[key] : () => undefined),
    set: (target, key, value) => ((target[key] = value), true),
  });
  HTMLCanvasElement.prototype.getContext = (() => ctx) as never;
  HTMLCanvasElement.prototype.getBoundingClientRect = () =>
    ({ width: 400, height: 300 }) as DOMRect;
  Element.prototype.animate = function () {
    const animation = { onfinish: null as null | (() => void) };
    window.setTimeout(() => animation.onfinish?.(), 900);
    return animation as unknown as Animation;
  };
  window.matchMedia = ((query: string) => ({
    matches: query.includes("pointer: fine") || query.includes("min-width"),
  })) as never;
  vi.useFakeTimers({
    toFake: [
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "requestAnimationFrame",
      "cancelAnimationFrame",
      "performance",
      "Date",
    ],
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("landing", () => {
  it("sells the product in plain language and links to the pilot", () => {
    render(<LandingPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Attaquez le clone\.\s*Jamais la production\./,
    );
    expect(
      screen.getAllByRole("link", { name: /Démarrer un pilote/ })[0],
    ).toHaveAttribute("href", "/fr#pilote");
    expect(
      screen.getAllByRole("link", { name: "Plateforme" })[0],
    ).toHaveAttribute("href", "/fr/plateforme");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en",
    );
    expect(screen.queryByText(/CVSS/)).not.toBeInTheDocument();
  });

  it("animates the hero prism through search, finding and fix", () => {
    render(<LandingPage />);
    expect(screen.getByText("Recherche de failles…")).toBeInTheDocument();
    advance(3300);
    expect(
      screen.getByText("Faille critique trouvée", { selector: ".anno b" }),
    ).toBeInTheDocument();
    advance(2500);
    expect(
      screen.getByText("Corrigée avant la production"),
    ).toBeInTheDocument();
  });

  it("tells the story step by step as the page scrolls", () => {
    const { container } = render(<LandingPage />);
    const story = triggers[0];
    act(() => story.onUpdate?.({ progress: 0.6 }));
    expect(container.querySelector(".cap.on")).toHaveTextContent(
      "Vous voyez ce qui est vraiment dangereux.",
    );
    act(() => story.onUpdate?.({ progress: 0.9 }));
    expect(container.querySelector(".cap.on")).toHaveTextContent(
      "Vous recevez la correction, déjà testée.",
    );
  });

  it("puts the console on the step you click, and follows the scroll otherwise", () => {
    render(<LandingPage />);
    const tabs = screen.getByRole("tablist", { name: "Étapes de la console" });
    fireEvent.click(
      within(tabs).getByRole("tab", { name: /Les failles trouvées/ }),
    );
    expect(
      within(tabs).getByRole("tab", { name: /Les failles trouvées/ }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("heading", { name: "Failles trouvées" }),
    ).toBeInTheDocument();
    expect(lenisScroll).toHaveBeenCalled();
    const tour = triggers[1];
    advance(1700);
    act(() => tour.onUpdate?.({ progress: 0.25 }));
    expect(
      within(tabs).getByRole("tab", { name: /Votre infrastructure/ }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("opens one FAQ answer at a time", () => {
    render(<LandingPage />);
    const question = screen.getByRole("button", {
      name: /Quelles données sortent/,
    });
    fireEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the prism under attack and reacts to the pointer and scroll", () => {
    const { container } = render(<LandingPage />);
    advance(2000);
    expect(container.querySelectorAll(".hero .plate.clone .tile").length).toBe(
      9,
    );
    const cta = screen.getAllByRole("link", { name: /Démarrer un pilote/ })[1];
    const move = (el: Element, x: number, y: number) =>
      el.dispatchEvent(
        new MouseEvent("pointermove", {
          clientX: x,
          clientY: y,
          bubbles: true,
        }),
      );
    move(cta, 10, 10);
    expect(cta.style.transform).toContain("translate");
    fireEvent.pointerLeave(cta);
    const card = container.querySelector(".stat") as HTMLElement;
    move(card, 20, 30);
    expect(card.style.getPropertyValue("--x")).toBe("20px");
    act(() => {
      window.scrollY = 400;
      window.dispatchEvent(new Event("scroll"));
    });
    advance(200);
    expect(container.querySelector(".hdr.scrolled")).toBeInTheDocument();
  });

  it("toggles the mobile menu and drives the pilot timeline", () => {
    const { container } = render(<LandingPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    expect(
      screen.getByRole("button", { name: "Fermer le menu" }),
    ).toHaveAttribute("aria-expanded", "true");
    act(() => triggers[2].onUpdate?.({ progress: 1 }));
    expect(container.querySelectorAll(".step.on")).toHaveLength(4);
  });

  it("renders the English landing", () => {
    render(
      <LanguageProvider locale="en">
        <LandingPage />
      </LanguageProvider>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Attack the clone\.\s*Never production\./,
    );
    expect(
      screen.getAllByRole("link", { name: "Platform" })[0],
    ).toHaveAttribute("href", "/en/plateforme");
  });
});

describe("console demo", () => {
  it("plays every view with sample data", () => {
    const onNavigate = vi.fn();
    const { rerender } = render(
      <ConsoleDemo view="overview" onNavigate={onNavigate} />,
    );
    advance(5000);
    expect(screen.getByText("Activité de l'agent")).toBeInTheDocument();
    for (const view of CONSOLE_VIEWS) {
      rerender(<ConsoleDemo view={view} onNavigate={onNavigate} />);
      advance(6000);
    }
    expect(
      screen.getByText("Correction envoyée à votre équipe").parentElement,
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Rapports/ }));
    expect(onNavigate).toHaveBeenCalledWith("report");
  });

  it("walks through a finding from proof to fix", () => {
    const { container } = render(<ConsoleDemo view="findings" />);
    advance(5500);
    expect(container.querySelector(".drawer.on")).toBeInTheDocument();
    expect(container.querySelector(".toast-pr.on")).toBeInTheDocument();
    expect(screen.getAllByText("corrigée").length).toBeGreaterThan(2);
    fireEvent.click(
      screen.getByText("Base clients exposée", { selector: ".frow span" }),
    );
    expect(container.querySelector(".toast-pr.on")).not.toBeInTheDocument();
  });
});

describe("platform page", () => {
  it("presents the technical details on their own page", () => {
    render(<PlatformPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Sous le capot d'Aegis.",
    );
    expect(
      screen.getAllByRole("link", { name: "Plateforme" })[0],
    ).toHaveAttribute("aria-current", "page");
    advance(6000);
    expect(screen.getByText("Isolation gVisor")).toBeInTheDocument();
    expect(
      screen.getByText(/aegis clone --cluster staging/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Couper/ }),
    ).not.toBeInTheDocument();
  });
});
