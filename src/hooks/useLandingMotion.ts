"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Locale } from "../i18n/Language";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useLandingMotion(
  root: RefObject<HTMLElement | null>,
  quiet: boolean,
  locale: Locale,
  setDashboardView: (view: number) => void,
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 900px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions?.reduce || quiet) return;
          gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) =>
            gsap.from(el, {
              y: 44,
              opacity: 0.15,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 96%",
                end: "top 69%",
                scrub: true,
              },
            }),
          );
          gsap.utils.toArray<HTMLElement>(".scroll-color").forEach((line) => {
            gsap.fromTo(
              line.querySelector(".scroll-color-ink"),
              { clipPath: "inset(0 100% 0 0)" },
              {
                clipPath: "inset(0 0% 0 0)",
                ease: "none",
                scrollTrigger: {
                  trigger: line,
                  start: "top 84%",
                  end: "top 42%",
                  scrub: true,
                },
              },
            );
          });
          if (!context.conditions?.desktop) {
            gsap.from(".tour-window", {
              y: -45,
              opacity: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: ".tour-window",
                start: "top 95%",
                end: "top 50%",
                scrub: true,
              },
            });
          }
          gsap.from(".operation-fill", {
            scaleX: 0,
            transformOrigin: "left",
            ease: "none",
            scrollTrigger: {
              trigger: ".operations",
              start: "top 75%",
              end: "bottom 65%",
              scrub: true,
            },
          });
          gsap.utils.toArray<HTMLElement>(".operation-step").forEach((el, i) =>
            gsap.from(el, {
              opacity: 0.18,
              y: 24,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: `top ${94 - i * 3}%`,
                end: `top ${72 - i * 3}%`,
                scrub: true,
              },
            }),
          );
          if (!context.conditions?.desktop) return;
          gsap.set(".tour-window", { "--dash-phase": 0, "--dash-exit": 0 });
          let previousView = -1;
          gsap.to(".tour-meter-fill", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".dashboard-tour",
              start: "top top",
              end: "+=2700",
              pin: ".tour-stage",
              scrub: 0.4,
              anticipatePin: 1,
              onUpdate: (self) => {
                const position = self.progress * 3;
                const next = Math.min(2, Math.floor(position));
                const phase = Math.min(1, position - next);
                const window =
                  root.current?.querySelector<HTMLElement>(".tour-window");
                window?.style.setProperty("--dash-phase", String(phase));
                window?.style.setProperty(
                  "--dash-exit",
                  String(next < 2 ? Math.max(0, (phase - 0.88) / 0.12) : 0),
                );
                if (next !== previousView) {
                  previousView = next;
                  setDashboardView(next);
                }
              },
            },
          });
          gsap.from(".tour-window", {
            y: 55,
            scale: 0.96,
            ease: "none",
            scrollTrigger: {
              trigger: ".dashboard-tour",
              start: "top 90%",
              end: "top top",
              scrub: true,
            },
          });
          gsap.from(".finding-detail", {
            x: 80,
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: ".evidence-demo",
              start: "top 90%",
              end: "top 38%",
              scrub: true,
            },
          });
          gsap.to(".closing-mark", {
            y: -90,
            rotation: 12,
            ease: "none",
            scrollTrigger: {
              trigger: ".closing",
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          });
          gsap.to(".hero-console", {
            y: -45,
            rotateX: 0,
            scale: 1.025,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: ".story",
              start: "top top",
              end: "+=2400",
              pin: ".story-stage",
              scrub: 0.6,
              anticipatePin: 1,
            },
          });
          timeline.to(
            ".story-progress",
            { scaleX: 1, duration: 4, ease: "none" },
            0,
          );
          timeline
            .to(
              ".story-console",
              { scale: 0.89, xPercent: -4, duration: 0.7 },
              0.75,
            )
            .fromTo(
              ".sandbox-layer",
              { autoAlpha: 0, y: 80, x: 40 },
              { autoAlpha: 1, y: 0, x: 0, duration: 0.65 },
              0.9,
            )
            .to(
              ".sandbox-layer .attack-line",
              { opacity: 1, duration: 0.35 },
              1.9,
            )
            .fromTo(
              ".scan-result",
              { autoAlpha: 0, y: 24 },
              { autoAlpha: 1, y: 0, duration: 0.5 },
              2,
            )
            .to(".sandbox-layer", { xPercent: -12, duration: 0.6 }, 2.9)
            .fromTo(
              ".proof-peek",
              { autoAlpha: 0, x: 90 },
              { autoAlpha: 1, x: 0, duration: 0.65 },
              2.9,
            );
          Array.from({ length: 4 }, (_, i) => {
            if (i)
              timeline.fromTo(
                `.step-${i}`,
                { autoAlpha: 0, y: 25 },
                { autoAlpha: 1, y: 0, duration: 0.25 },
                i,
              );
            if (i < 3)
              timeline.to(
                `.step-${i}`,
                { autoAlpha: 0, y: -20, duration: 0.2 },
                i + 0.8,
              );
          });
        },
      );
      let active = true;
      const tourWindow =
        root.current?.querySelector<HTMLElement>(".tour-window");
      document.fonts.ready.then(() => {
        if (active) ScrollTrigger.refresh();
      });
      return () => {
        active = false;
        mm.revert();
        tourWindow?.style.removeProperty("--dash-phase");
        tourWindow?.style.removeProperty("--dash-exit");
      };
    },
    { scope: root, dependencies: [quiet, locale], revertOnUpdate: true },
  );
}
