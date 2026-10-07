"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Layers,
  Network,
  ScanLine,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SiteHeader } from "./SiteHeader";
import { useLanguage } from "../i18n/Language";
import { plans, pricingContent } from "./pricingContent";
import styles from "./Pricing.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ColorText({ children }: { children: string }) {
  return (
    <span className={styles.colorText}>
      <span>{children}</span>
      <span data-price-ink aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

export default function Pricing() {
  const { locale } = useLanguage();
  const copy = pricingContent[locale];
  const root = useRef<HTMLElement>(null);
  const [quiet, setQuiet] = useState(false);
  const [budget, setBudget] = useState(600);
  const [selected, setSelected] = useState(1);
  const recommendation = plans.find((plan) => plan.tokens >= budget);
  const number = (value: number) =>
    new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB").format(value);
  const money = (value: number) =>
    new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-IE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  useGSAP(
    () => {
      if (quiet) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils
          .toArray<HTMLElement>("[data-price-reveal]")
          .forEach((element) => {
            gsap.from(element, {
              y: 38,
              opacity: 0.18,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top 96%",
                end: "top 72%",
                scrub: true,
              },
            });
          });
        gsap.utils
          .toArray<HTMLElement>("[data-price-ink]")
          .forEach((element) => {
            gsap.fromTo(
              element,
              { clipPath: "inset(0 100% 0 0)" },
              {
                clipPath: "inset(0 0% 0 0)",
                ease: "none",
                scrollTrigger: {
                  trigger: element.parentElement,
                  start: "top 90%",
                  end: "top 50%",
                  scrub: true,
                },
              },
            );
          });
      });
      let active = true;
      document.fonts.ready.then(() => {
        if (active) ScrollTrigger.refresh();
      });
      return () => {
        active = false;
        media.revert();
      };
    },
    { scope: root, dependencies: [quiet, locale], revertOnUpdate: true },
  );

  return (
    <main ref={root} className={`${styles.page} ${quiet ? styles.quiet : ""}`}>
      <a className="skip" href="#plans">
        {copy.skip}
      </a>
      <SiteHeader pricing />
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.topline}>
            <span className="eyebrow">
              <i className="status-dot" /> {copy.label}
            </span>
            <span className={styles.serial}>AEGIS AI / 02</span>
          </div>
          <div className={styles.heroGrid}>
            <h1>
              {copy.title}
              <br />
              <span>{copy.accent}</span>
            </h1>
            <div>
              <p>{copy.intro}</p>
              <a href="#comparison" className={styles.inlineLink}>
                {copy.compare}
                <ArrowDown size={15} />
              </a>
            </div>
          </div>
          <div className={styles.status}>
            <span />
            {copy.status}
          </div>
        </section>
        <section id="plans" className={styles.plans} aria-label={copy.label}>
          {plans.map((plan, i) => {
            const Icon = [ScanLine, Layers, Network][i];
            return (
              <article
                key={plan.name}
                className={`${styles.card} ${i === 1 ? styles.featured : ""}`}
                data-price-reveal
              >
                <div className={styles.cardTop}>
                  <span>
                    0{i + 1} / <Icon size={17} />
                  </span>
                  {i === 1 && (
                    <span className={styles.badge}>{copy.focus}</span>
                  )}
                </div>
                <h2>{plan.name}</h2>
                <p className={styles.description}>{copy.descriptions[i]}</p>
                <div className={styles.price}>
                  {money(plan.price)}
                  <span>{copy.month}</span>
                </div>
                <div className={styles.tokens}>
                  <b>~{number(plan.tokens)}</b>
                  <span>{copy.tokens}</span>
                </div>
                <div className={styles.tokenTrack} aria-hidden="true">
                  {Array.from({ length: 20 }, (_, n) => (
                    <i
                      key={n}
                      className={n < [2, 6, 20][i] ? styles.lit : ""}
                    />
                  ))}
                </div>
                <ul>
                  {copy.features[i].map((feature) => (
                    <li key={feature}>
                      <Check size={14} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  className={styles.cardLink}
                  href="#comparison"
                  onClick={() => setSelected(i)}
                  aria-label={`${copy.details} ${plan.name}`}
                >
                  {copy.details}
                  <ArrowUpRight size={17} />
                </a>
              </article>
            );
          })}
        </section>
        <p className={styles.note}>{copy.note}</p>
        <section className={styles.model}>
          <div className={styles.modelCopy}>
            <p className="section-label">{copy.modelLabel}</p>
            <h2>
              {copy.modelTitle}
              <br />
              <ColorText>{copy.modelAccent}</ColorText>
            </h2>
            <p>{copy.modelText}</p>
          </div>
          <div className={styles.estimator} data-price-reveal>
            <div className={styles.estimatorLabel}>
              <span>{copy.simulator}</span>
              <Layers size={18} />
            </div>
            <label htmlFor="token-budget">{copy.budget}</label>
            <output htmlFor="token-budget">
              {number(budget)} <span>tokens</span>
            </output>
            <input
              id="token-budget"
              type="range"
              min="100"
              max="2500"
              step="50"
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
            />
            <div className={styles.rangeLabels}>
              <span>100</span>
              <span>2 500</span>
            </div>
            <div className={styles.recommendation} aria-live="polite">
              <span>{recommendation ? copy.suggestion : copy.beyond}</span>
              {recommendation ? (
                <p>
                  <b>{recommendation.name}</b>
                  <span>
                    {money(recommendation.price)} {copy.month}
                  </span>
                </p>
              ) : (
                <p className={styles.beyond}>{copy.beyondText}</p>
              )}
            </div>
            <p className={styles.note}>{copy.simulatorNote}</p>
          </div>
        </section>
        <section id="comparison" className={styles.comparison}>
          <p className="section-label">{copy.tableLabel}</p>
          <h2>
            {copy.tableTitle}
            <br />
            <ColorText>{copy.tableAccent}</ColorText>
          </h2>
          <div
            className={styles.tableScroll}
            tabIndex={0}
            role="region"
            aria-label={copy.compare}
          >
            <table>
              <caption className={styles.srOnly}>{copy.compare}</caption>
              <thead>
                <tr>
                  <th scope="col">AEGIS AI</th>
                  {plans.map((plan, i) => (
                    <th
                      scope="col"
                      key={plan.name}
                      className={selected === i ? styles.selected : ""}
                    >
                      <button
                        onClick={() => setSelected(i)}
                        aria-pressed={selected === i}
                      >
                        {plan.name}
                        {selected === i && (
                          <Check size={14} aria-label={copy.selected} />
                        )}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [copy.monthly, ...plans.map((plan) => money(plan.price))],
                  [
                    copy.volume,
                    ...plans.map((plan) => `~${number(plan.tokens)}`),
                  ],
                  [copy.audience, ...copy.audiences],
                  [copy.scope, ...copy.scopes],
                  [copy.cadence, ...copy.cadences],
                ].map(([label, ...values]) => (
                  <tr key={label} data-price-reveal>
                    <th scope="row">{label}</th>
                    {values.map((value, i) => (
                      <td
                        key={i}
                        className={selected === i ? styles.selected : ""}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>{copy.tableNote}</p>
        </section>
        <section className={styles.faq}>
          <div>
            <p className="section-label">{copy.faqLabel}</p>
            <h2>{copy.faqTitle}</h2>
          </div>
          <div>
            {copy.faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={styles.closing}>
          <span className={styles.closingIndex}>AEGIS / NEXT</span>
          <h2>
            {copy.closing}
            <br />
            <ColorText>{copy.closingAccent}</ColorText>
          </h2>
          <Link href={`/${locale}#dashboard`} className="button primary">
            {copy.demo}
            <ArrowUpRight size={17} />
          </Link>
        </section>
      </div>
      <footer>
        <Link href={`/${locale}`} className="brand">
          AEGIS<span className="brand-ai">AI</span>
        </Link>
        <Link href={`/${locale}`}>{copy.back}</Link>
        <button onClick={() => setQuiet(!quiet)} aria-pressed={quiet}>
          {quiet ? copy.enable : copy.reduce}
        </button>
        <span>© {new Date().getFullYear()} Aegis AI</span>
      </footer>
    </main>
  );
}
