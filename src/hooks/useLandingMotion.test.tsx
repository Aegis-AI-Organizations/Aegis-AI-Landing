import { act, renderHook, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLandingMotion } from "./useLandingMotion";

const state = vi.hoisted(() => ({
  desktop: true,
  reduce: false,
  revert: vi.fn(),
}));
vi.mock("@gsap/react", async () => {
  const React = await import("react");
  return {
    useGSAP: (callback: () => () => void) =>
      React.useEffect(() => callback(), [callback]),
  };
});
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { refresh: vi.fn() } }));
vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    matchMedia: () => ({
      add: (_queries: unknown, callback: (ctx: unknown) => void) =>
        callback({ conditions: state }),
      revert: state.revert,
    }),
    utils: {
      toArray: (selector: string) =>
        Array.from(document.querySelectorAll(selector)),
    },
    from: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
    to: vi.fn(),
    timeline: vi.fn(() => {
      const timeline = {
        to: vi.fn(() => timeline),
        fromTo: vi.fn(() => timeline),
      };
      return timeline;
    }),
  },
}));
let root: { current: HTMLElement };
beforeEach(() => {
  vi.clearAllMocks();
  state.desktop = true;
  state.reduce = false;
  root = { current: document.createElement("main") };
  root.current.innerHTML =
    '<div class="tour-window"></div><div class="reveal"></div><div class="scroll-color"><span class="scroll-color-ink"></span></div><div class="operation-step"></div>';
  document.body.append(root.current);
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
});
afterEach(() => {
  cleanup();
  root.current.remove();
});

it("maps desktop scroll progress to dashboard views and releases animation state", async () => {
  const select = vi.fn();
  const { unmount } = renderHook(() =>
    useLandingMotion(root, false, "fr", select),
  );
  const tour = vi
    .mocked(gsap.to)
    .mock.calls.find(([target]) => target === ".tour-meter-fill");
  const update = (
    tour?.[1].scrollTrigger as {
      onUpdate: (self: { progress: number }) => void;
    }
  ).onUpdate;
  act(() => {
    update({ progress: 0 });
    update({ progress: 0.5 });
    update({ progress: 1 });
  });
  expect(select.mock.calls.map(([view]) => view)).toEqual([0, 1, 2]);
  expect(
    root.current
      .querySelector<HTMLElement>(".tour-window")
      ?.style.getPropertyValue("--dash-phase"),
  ).toBe("1");
  await act(async () => {
    await document.fonts.ready;
  });
  expect(ScrollTrigger.refresh).toHaveBeenCalledOnce();
  unmount();
  expect(state.revert).toHaveBeenCalledOnce();
  expect(
    root.current
      .querySelector<HTMLElement>(".tour-window")
      ?.style.getPropertyValue("--dash-phase"),
  ).toBe("");
});
it.each(["system", "button"])(
  "disables animation for the %s motion preference",
  (source) => {
    state.reduce = source === "system";
    renderHook(() =>
      useLandingMotion(root, source === "button", "en", vi.fn()),
    );
    expect(gsap.to).not.toHaveBeenCalled();
    expect(gsap.timeline).not.toHaveBeenCalled();
  },
);
it("keeps mobile reveals without pinning a desktop timeline", () => {
  state.desktop = false;
  renderHook(() => useLandingMotion(root, false, "en", vi.fn()));
  expect(gsap.from).toHaveBeenCalledWith(".tour-window", expect.any(Object));
  expect(gsap.timeline).not.toHaveBeenCalled();
});
it("does not refresh scroll triggers after unmount", async () => {
  const { unmount } = renderHook(() =>
    useLandingMotion(root, false, "fr", vi.fn()),
  );
  unmount();
  await document.fonts.ready;
  expect(ScrollTrigger.refresh).not.toHaveBeenCalled();
});
