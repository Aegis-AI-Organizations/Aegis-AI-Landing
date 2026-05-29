import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "./layout";

describe("landing root layout", () => {
  it("wraps children with the html shell", () => {
    const layout = RootLayout({ children: <div>landing-child</div> });

    expect(layout.props.lang).toBe("fr");
    expect(layout.props.children.props.children.props.children).toBe(
      "landing-child",
    );
  });

  it("keeps metadata export stable", () => {
    expect(metadata.title).toBe("Aegis AI");
    expect(metadata.description).toBe(
      "Le site Aegis AI est en cours de construction.",
    );
  });
});
