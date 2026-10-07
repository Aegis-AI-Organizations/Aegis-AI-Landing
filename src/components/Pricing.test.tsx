import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Pricing from "./Pricing";
import { LanguageProvider } from "../i18n/Language";

vi.mock("gsap", () => ({ default: { registerPlugin: vi.fn() } }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
vi.mock("@gsap/react", () => ({ useGSAP: vi.fn() }));
afterEach(cleanup);

it("shows the proposed prices and preserves the pricing route when switching language", () => {
  render(<Pricing />);
  expect(screen.getAllByText(/99\s*€/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/249\s*€/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/699\s*€/).length).toBeGreaterThan(0);
  expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
    "href",
    "/en/pricing",
  );
  expect(screen.getByText(/Volumes de tokens indicatifs/)).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("link", { name: "Comparer cette offre Starter" }),
  );
  expect(screen.getByRole("button", { name: /Starter/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
it("recommends only published volumes and handles requirements above the largest plan", () => {
  render(
    <LanguageProvider locale="en">
      <Pricing />
    </LanguageProvider>,
  );
  const slider = screen.getByRole("slider", {
    name: "Your monthly token requirement",
  });
  fireEvent.change(slider, { target: { value: "150" } });
  expect(
    screen.getByText("Plan matching this volume").parentElement,
  ).toHaveTextContent("Starter");
  fireEvent.change(slider, { target: { value: "1000" } });
  expect(
    screen.getByText("Plan matching this volume").parentElement,
  ).toHaveTextContent("Scale / Business");
  fireEvent.change(slider, { target: { value: "2500" } });
  expect(screen.getByText("Beyond the proposed plans")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Reduce animations" }));
  expect(
    screen.getByRole("button", { name: "Enable animations" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    screen.getByRole("link", { name: "Explore the demo" }),
  ).toHaveAttribute("href", "/en#dashboard");
});

it("closes the navigation when moving back to the product", () => {
  render(<Pricing />);
  fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
  const platform = screen.getByRole("link", { name: "La plateforme" });
  platform.addEventListener("click", (event) => event.preventDefault(), {
    once: true,
  });
  fireEvent.click(platform);
  expect(
    screen.getByRole("button", { name: "Ouvrir le menu" }),
  ).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
  const pricing = screen.getByRole("link", { name: "Tarifs" });
  pricing.addEventListener("click", (event) => event.preventDefault(), {
    once: true,
  });
  fireEvent.click(pricing);
  expect(
    screen.getByRole("button", { name: "Ouvrir le menu" }),
  ).toHaveAttribute("aria-expanded", "false");
});
