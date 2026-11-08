"use client";

import { useState } from "react";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { useLanguage } from "../i18n/Language";
import { PilotButton, SiteFooter, SiteNav } from "./landing/Chrome";
import { Reveal, trackSpot } from "./landing/motion";
import { plans, pricingContent } from "./pricingContent";
import "./landing/landing.css";
import styles from "./Pricing.module.css";

/** Nombre de barres allumées sur 20 pour illustrer le volume de chaque offre. */
const VOLUME_BARS = [2, 6, 20];

export default function Pricing() {
  const { locale } = useLanguage();
  const copy = pricingContent[locale];
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
  const fill = ((budget - 100) / (2500 - 100)) * 100;

  return (
    <div className={`lp ${styles.page} ${quiet ? styles.quiet : ""}`}>
      <a className={styles.skip} href="#plans">
        {copy.skip}
      </a>
      <SiteNav page="pricing" />
      <main id="main-content">
        <div className="wrap">
          <header className={styles.hero}>
            <span className="label acc">{copy.label}</span>
            <h1 className="h1 two-tone">
              {copy.title} <em>{copy.accent}</em>
            </h1>
            <p className="lead">{copy.intro}</p>
            <div className={styles.heroFoot}>
              <span className="chip">
                <span className="dot" /> {copy.status}
              </span>
              <a href="#comparison" className="btn plain sm">
                {copy.compare} <ArrowDown size={15} />
              </a>
            </div>
          </header>

          <section id="plans" className={styles.plans} aria-label={copy.label}>
            {plans.map((plan, i) => (
              <Reveal
                as="article"
                key={plan.name}
                delay={i * 0.08}
                className={`surface spot ${styles.card} ${
                  i === 1 ? styles.featured : ""
                }`}
                onPointerMove={trackSpot}
              >
                <div className={styles.cardTop}>
                  <h2 className="h3">{plan.name}</h2>
                  {i === 1 && <span className="chip">{copy.focus}</span>}
                </div>
                <p className={styles.description}>{copy.descriptions[i]}</p>
                <div className={styles.price}>
                  {money(plan.price)}
                  <span>{copy.month}</span>
                </div>
                <div className={styles.tokens}>
                  <span className="mono">~{number(plan.tokens)}</span>{" "}
                  {copy.tokens}
                </div>
                <div className={styles.tokenTrack} aria-hidden="true">
                  {Array.from({ length: 20 }, (_, n) => (
                    <i
                      key={n}
                      className={n < VOLUME_BARS[i] ? styles.lit : ""}
                    />
                  ))}
                </div>
                <ul>
                  {copy.features[i].map((feature) => (
                    <li key={feature}>
                      <Check size={15} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  className={`btn ${i === 1 ? "ghost" : "plain"} sm ${
                    styles.cardLink
                  }`}
                  href="#comparison"
                  onClick={() => setSelected(i)}
                  aria-label={`${copy.details} ${plan.name}`}
                >
                  {copy.details}
                  <ArrowUpRight size={15} />
                </a>
              </Reveal>
            ))}
          </section>
          <p className={`src ${styles.note}`}>{copy.note}</p>

          <section className={styles.model}>
            <div className={styles.modelCopy}>
              <span className="label">{copy.modelLabel}</span>
              <h2 className="h2 two-tone">
                {copy.modelTitle} <em>{copy.modelAccent}</em>
              </h2>
              <p className="lead">{copy.modelText}</p>
            </div>
            <Reveal className={`surface ${styles.estimator}`}>
              <span className="label">{copy.simulator}</span>
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
                style={{ "--fill": `${fill}%` } as React.CSSProperties}
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
              <p className="src">{copy.simulatorNote}</p>
            </Reveal>
          </section>

          <section id="comparison" className={styles.comparison}>
            <div className={styles.sectionHead}>
              <span className="label">{copy.tableLabel}</span>
              <h2 className="h2 two-tone">
                {copy.tableTitle} <em>{copy.tableAccent}</em>
              </h2>
            </div>
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
                    <th scope="col">
                      <span className="src">AEGIS AI</span>
                    </th>
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
                    <tr key={label}>
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
            <p className={`src ${styles.note}`}>{copy.tableNote}</p>
          </section>

          <section className="faq-wrap">
            <div className="faq-side">
              <span className="label">{copy.faqLabel}</span>
              <h2 className="h2">{copy.faqTitle}</h2>
            </div>
            <div className={styles.faq}>
              {copy.faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <span className={styles.ic} aria-hidden="true" />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <Reveal className={`surface ${styles.closing}`}>
            <h2 className="h2 two-tone">
              {copy.closing} <em>{copy.closingAccent}</em>
            </h2>
            <PilotButton label={copy.demo} href={`/${locale}#console`} />
          </Reveal>

          <div className={styles.motionToggle}>
            <button
              className="btn plain sm"
              onClick={() => setQuiet(!quiet)}
              aria-pressed={quiet}
            >
              {quiet ? copy.enable : copy.reduce}
            </button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
