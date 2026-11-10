"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
  type RefObject,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/** Scroll fluide (Lenis) synchronisé avec ScrollTrigger pour toute la page. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    lenis.current = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis.current = null;
    };
  }, []);
  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}

/** Fait défiler jusqu'à une position, avec Lenis s'il est actif. */
export function useScrollTo() {
  const lenis = useContext(LenisContext);
  return (target: number | string, onComplete?: () => void) => {
    const instance = lenis?.current;
    if (instance) {
      instance.scrollTo(target, { offset: -68, onComplete });
      return;
    }
    if (typeof target === "number") window.scrollTo({ top: target });
    else document.querySelector(target)?.scrollIntoView();
    onComplete?.();
  };
}

/** Passe à true la première fois que l'élément entre dans l'écran. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  threshold = 0.2,
) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(() => setSeen(true));
      return () => window.clearTimeout(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, threshold]);
  return seen;
}

/** Apparition douce (fondu + léger glissement) à l'entrée dans l'écran. */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref);
  return (
    <Tag
      ref={ref}
      className={`fade ${seen ? "in" : ""} ${className}`}
      style={{ "--d": `${delay}s` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

type Part = string | { text: string; tone: "em" | "hl" };

function toWords(parts: Part[], lines = false) {
  let i = 0;
  return parts.map((part, p) => {
    const text = typeof part === "string" ? part : part.text;
    const words = text.split(/\s+/).filter(Boolean);
    const spans = words.map((w, j) => (
      <span key={j}>
        <span className="w" style={{ "--i": i++ } as React.CSSProperties}>
          {w}
        </span>
        {j < words.length - 1 ? " " : ""}
      </span>
    ));
    const space = p < parts.length - 1 ? " " : "";
    return typeof part === "string" ? (
      <span key={p} style={lines ? { display: "block" } : undefined}>
        {spans}
        {space}
      </span>
    ) : (
      <span key={p} className={part.tone}>
        {spans}
        {space}
      </span>
    );
  });
}

/** Titre qui apparaît mot par mot, en sortant d'un flou. */
export function SplitTitle({
  as: Tag = "h2",
  parts,
  className = "",
  lines = false,
}: {
  as?: ElementType;
  parts: Part[];
  className?: string;
  /** Une ligne par élément de `parts`. */
  lines?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref);
  return (
    <Tag ref={ref} className={`split ${seen ? "in" : ""} ${className}`}>
      {toWords(parts, lines)}
    </Tag>
  );
}

/** Texte dont les mots s'allument au fil du scroll. */
export function ScrollText({
  as: Tag = "h2",
  parts,
  className = "",
  start = 0.9,
  end = 0.42,
}: {
  as?: ElementType;
  parts: Part[];
  className?: string;
  start?: number;
  end?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = [...el.querySelectorAll<HTMLElement>(".w")];
    const reduce = prefersReducedMotion();
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const p = reduce
        ? 1
        : Math.min(1, Math.max(0, (vh * start - top) / (vh * (start - end))));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("lit", i < lit));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [start, end]);
  return (
    <Tag ref={ref} className={`sc ${className}`}>
      {toWords(parts)}
    </Tag>
  );
}

/** Nombre qui compte jusqu'à sa valeur quand il devient visible. */
export function CountUp({
  to,
  decimals = 0,
  from = 0,
  duration = 1600,
}: {
  to: number;
  decimals?: number;
  from?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, 0.6);
  const [value, setValue] = useState(from);
  useEffect(() => {
    if (!seen) return;
    const length = prefersReducedMotion() ? 0 : duration;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = length ? Math.min(1, (now - t0) / length) : 1;
      setValue(from + (to - from) * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, from, duration]);
  return (
    <span ref={ref}>
      {value.toLocaleString("fr-FR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

/** Halo qui suit le pointeur sur les cartes .spot. */
export function trackSpot(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - r.left}px`);
  el.style.setProperty("--y", `${e.clientY - r.top}px`);
}

/** Bouton légèrement attiré par le pointeur. */
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      prefersReducedMotion() ||
      typeof window.matchMedia !== "function" ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${
        (e.clientX - r.left - r.width / 2) * 0.18
      }px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
    };
    const leave = () => {
      el.style.transition = "transform .5s cubic-bezier(.34,1.4,.64,1)";
      el.style.transform = "";
      window.setTimeout(() => (el.style.transition = ""), 500);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return ref;
}

export { gsap, ScrollTrigger };
