"use client";
import { useEffect, useRef, type Ref } from "react";
import { useLanguage } from "../../i18n/Language";
import { prefersReducedMotion } from "./motion";

export type TileState = "crit" | "fixed";

const TILE_COUNT = 9;

/**
 * Le « prisme » : votre production en bas, sa copie isolée qui flotte au-dessus.
 * Les paquets d'attaque tombent uniquement sur la copie.
 */
export function PrismScene({
  ref,
  attackEvery = 0,
  states = {},
  lift = 150,
  cloneOpacity = 1,
}: {
  ref?: Ref<HTMLDivElement>;
  attackEvery?: number;
  states?: Record<number, TileState>;
  lift?: number;
  cloneOpacity?: number;
}) {
  const { t } = useLanguage();
  const iso = useRef<HTMLDivElement>(null);
  const liftRef = useRef(lift);
  useEffect(() => {
    liftRef.current = lift;
  }, [lift]);

  useEffect(() => {
    if (!attackEvery || prefersReducedMotion()) return;
    const root = iso.current;
    if (!root) return;
    const tiles = [...root.querySelectorAll<HTMLElement>(".plate.clone .tile")];
    const timer = window.setInterval(() => {
      const tile = tiles[Math.floor(Math.random() * tiles.length)];
      if (!tile || typeof tile.animate !== "function") return;
      const d = document.createElement("span");
      d.className = "drop";
      d.style.left = `${tile.offsetLeft + tile.offsetWidth / 2 + 26}px`;
      d.style.top = `${tile.offsetTop + tile.offsetHeight / 2 + 26}px`;
      root.append(d);
      const z = liftRef.current;
      d.animate(
        [
          { transform: `translateZ(${z + 260}px)`, opacity: 0 },
          { transform: `translateZ(${z + 200}px)`, opacity: 1, offset: 0.2 },
          { transform: `translateZ(${z + 18}px)`, opacity: 1 },
        ],
        { duration: 900, easing: "cubic-bezier(.55,0,.9,.4)" },
      ).onfinish = () => {
        d.remove();
        if (tile.classList.contains("crit") || tile.classList.contains("fixed"))
          return;
        tile.classList.add("hit");
        window.setTimeout(() => tile.classList.remove("hit"), 650);
      };
    }, attackEvery);
    return () => window.clearInterval(timer);
  }, [attackEvery]);

  const tiles = (clone: boolean) =>
    Array.from({ length: TILE_COUNT }, (_, i) => (
      <div key={i} className={`tile ${clone ? (states[i] ?? "") : ""}`}>
        <i />
      </div>
    ));

  return (
    <div
      ref={ref}
      className="scene"
      style={{ "--lift": `${lift}px` } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="iso" ref={iso}>
        <div className="plate prod">
          <div className="tiles">{tiles(false)}</div>
          <span className="plbl">{t("Votre production")}</span>
        </div>
        <span className="pillar a" />
        <span className="pillar b" />
        <span className="pillar c" />
        <span className="pillar d" />
        <div className="plate clone" style={{ opacity: cloneOpacity }}>
          <div className="tiles">{tiles(true)}</div>
          <span className="plbl">{t("Copie isolée")}</span>
          <span className="scan" />
        </div>
      </div>
    </div>
  );
}
