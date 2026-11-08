"use client";
import { useEffect, useRef, useState } from "react";
import { Boxes, Cpu, Network, RotateCcw } from "lucide-react";
import { useLanguage } from "../../i18n/Language";
import { SiteFooter, SiteNav } from "./Chrome";
import { FinalCta } from "./LandingPage";
import {
  Reveal,
  ScrollText,
  SmoothScroll,
  SplitTitle,
  prefersReducedMotion,
  trackSpot,
  useInView,
} from "./motion";
import "./landing.css";

/** Rejoue une séquence d'étapes en boucle tant que le bloc est visible. */
function useLoop(count: number, stepMs: number, pauseMs: number) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, 0.35);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) {
      const id = window.setTimeout(() => setStep(count));
      return () => window.clearTimeout(id);
    }
    let s = 0;
    let timer = 0;
    const tick = () => {
      s = s >= count ? 0 : s + 1;
      setStep(s);
      timer = window.setTimeout(tick, s >= count ? pauseMs : stepMs);
    };
    timer = window.setTimeout(tick, 300);
    return () => window.clearTimeout(timer);
  }, [seen, count, stepMs, pauseMs]);
  return { ref, step };
}

function Feature({
  label,
  title,
  text,
  points,
  reverse = false,
  children,
}: {
  label: string;
  title: [string, string];
  text: string;
  points: string[];
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`feature ${reverse ? "rev" : ""}`}>
      <div className="feature-copy">
        <span className="label">{label}</span>
        <ScrollText
          className="h2 two-tone"
          parts={[title[0], { text: title[1], tone: "em" }]}
        />
        <p>{text}</p>
        <ul>
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <Reveal className="surface feature-visual spot" onPointerMove={trackSpot}>
        {children}
      </Reveal>
    </div>
  );
}

function ReplayVisual() {
  const { t } = useLanguage();
  const { ref, step } = useLoop(3, 900, 2800);
  return (
    <div ref={ref} style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <b style={{ fontWeight: 500 }}>{t("Injection SQL · api-users")}</b>
        <span className="sev crit">CVSS 9.8</span>
      </div>
      <div className="replay">
        <div className={`row ${step >= 1 ? "on" : ""}`}>
          <span>{t("requête")}</span>
          <span>
            GET /api/users?id=<span className="w">1 OR 1=1</span>
          </span>
        </div>
        <div className={`row ${step >= 2 ? "on" : ""}`}>
          <span>{t("réponse")}</span>
          <span>
            200 · <span className="w">{t("4 812 lignes au lieu de 1")}</span>
          </span>
        </div>
        <div className={`row ${step >= 3 ? "on" : ""}`}>
          <span>{t("preuve")}</span>
          <span className="c">
            {t("table users lue, sur le clone uniquement")}
          </span>
        </div>
      </div>
    </div>
  );
}

function FixVisual() {
  const { t } = useLanguage();
  const { ref, step } = useLoop(4, 450, 3000);
  return (
    <div ref={ref} style={{ display: "grid", gap: 16 }}>
      <div className="diff">
        <div className="diff-h">
          <span>services/users/repo.py</span>
          <span>+2 −1</span>
        </div>
        <div className={`ln del ${step >= 1 ? "in" : ""}`}>
          - rows = db.execute(f&quot;SELECT * FROM users WHERE id = {"{uid}"}
          &quot;)
        </div>
        <div className={`ln add ${step >= 2 ? "in" : ""}`}>
          + rows = db.execute(&quot;SELECT * FROM users WHERE id = %s&quot;,
        </div>
        <div className={`ln add ${step >= 3 ? "in" : ""}`}>+ (uid,))</div>
      </div>
      <span
        className="chip"
        style={{ opacity: step >= 4 ? 1 : 0.3, transition: "opacity .4s" }}
      >
        <span className="dot" />
        {t("Attaque rejouée : échec · PR #318 prête")}
      </span>
    </div>
  );
}

const LOG: [string, string][] = [
  ["p", "$ aegis clone --cluster staging"],
  ["", "  37 ressources lues · 0 donnée copiée"],
  ["ok", "  ✓ jumeau #14 prêt · gVisor · 41 s"],
  ["p", "$ aegis assault --target clone#14"],
  ["w", "  ! api-users · réponse différentielle"],
  ["c", "  ✗ SQLi confirmée · CVSS 9.8"],
  ["p", "$ aegis fix 0142"],
  ["ok", "  ✓ attaque rejouée : échec"],
  ["ok", "  ✓ PR #318 ouverte · impact prod : 0"],
];

function LogVisual() {
  const { ref, step } = useLoop(LOG.length, 420, 3200);
  return (
    <div ref={ref} className="term" aria-label="Journal de l'agent">
      {LOG.slice(0, step).map(([cls, line], i) => (
        <div key={i} className={cls}>
          {line}
        </div>
      ))}
      <span className="caret" />
    </div>
  );
}

function ChartVisual() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, 0.35);
  const bars = [6, 9, 7, 12, 10, 14, 11, 15, 13, 16, 14, 17];
  return (
    <div ref={ref} className={`chart ${seen ? "in" : ""}`}>
      <svg
        viewBox="0 0 600 200"
        fill="none"
        role="img"
        aria-label={t("Exemple : failles ouvertes en baisse sur 12 semaines")}
      >
        <g stroke="oklch(94% .008 250 / .06)">
          <path d="M0 50H600M0 100H600M0 150H600" />
        </g>
        <g fill="oklch(58% .15 142 / .35)">
          {bars.map((v, i) => (
            <rect
              key={i}
              x={i * 50 + 14}
              y={180 - v * 6}
              width="22"
              height={v * 6}
              rx="3"
              style={{ transitionDelay: `${i * 60}ms` }}
            />
          ))}
        </g>
        <path
          className="ln"
          d="M0 40 C 60 46, 90 60, 130 66 S 210 84, 250 100 S 330 118, 380 128 S 470 146, 520 150 S 580 158, 600 160"
          stroke="oklch(94% .008 250 / .85)"
          strokeWidth="1.6"
        />
      </svg>
      <div
        style={{
          display: "flex",
          gap: 18,
          font: "11.5px var(--mono)",
          color: "var(--faint)",
          marginTop: 10,
        }}
      >
        <span>— {t("failles ouvertes")}</span>
        <span style={{ color: "var(--success-ink)" }}>▮ {t("corrigées")}</span>
        <span style={{ marginLeft: "auto" }}>
          {t("données de démonstration")}
        </span>
      </div>
    </div>
  );
}

export default function PlatformPage() {
  const { t } = useLanguage();
  const arch = [
    {
      icon: Cpu,
      title: t("Agent Rust sans garbage collector"),
      text: t(
        "Moins de 50 Mo de mémoire et moins de 1 % de CPU sur vos nœuds. Aucune pause imprévisible.",
      ),
    },
    {
      icon: Boxes,
      title: t("Isolation gVisor"),
      text: t(
        "Chaque attaque tourne dans son propre noyau en espace utilisateur. Rien n'atteint l'hôte.",
      ),
    },
    {
      icon: RotateCcw,
      title: t("Orchestration Temporal"),
      text: t(
        "L'état de chaque analyse est sauvegardé en continu : après une panne, elle reprend là où elle s'est arrêtée.",
      ),
    },
    {
      icon: Network,
      title: t("Zero-trust de bout en bout"),
      text: t(
        "mTLS entre composants, politiques réseau Cilium, aucun accès permanent à la production.",
      ),
    },
  ];
  const security = [
    [
      t("Périmètre verrouillé dans le code"),
      t(
        "L'agent ne peut opérer que dans le clone. Ce n'est pas un réglage : c'est une contrainte du code.",
      ),
    ],
    [
      t("Kill switch"),
      t(
        "Toute l'infrastructure d'attaque s'arrête en un clic depuis la console.",
      ),
    ],
    [
      t("Métadonnées uniquement"),
      t(
        "Schémas, versions et ports. Jamais le contenu des bases. Journaux chiffrés au repos (KMS).",
      ),
    ],
    [
      t("Infrastructure éphémère"),
      t("Le clone et les sandboxes sont détruits après chaque session."),
    ],
  ];
  const phases = [
    [
      t("Aujourd'hui"),
      t("Kubernetes"),
      t(
        "Clonage déterministe des clusters déclaratifs. Injections SQL et exécution de code à distance.",
      ),
    ],
    [
      t("Ensuite"),
      t("VM et Linux classiques"),
      t(
        "Un agent universel hors conteneur. Ports ouverts, stockages publics, chiffrements faibles.",
      ),
    ],
    [
      t("Vision"),
      t("Hyperviseurs et logique métier"),
      t(
        "ESXi, Proxmox, bare metal, et des failles métier comme l'accès aux commandes d'un autre client.",
      ),
    ],
  ];
  return (
    <SmoothScroll>
      <div className="lp">
        <SiteNav page="platform" />
        <main>
          <div className="wrap">
            <section className="phero">
              <Reveal as="span" className="label acc">
                {t("La plateforme")}
              </Reveal>
              <SplitTitle
                as="h1"
                className="h1"
                parts={[t("Sous le capot d'Aegis.")]}
              />
              <Reveal as="p" className="lead" delay={0.3}>
                {t(
                  "Ce que vous recevez à chaque faille, comment l'isolation fonctionne et comment l'architecture tient la charge. La version détaillée, pour vos équipes techniques.",
                )}
              </Reveal>
            </section>

            <section className="sec" style={{ paddingTop: 72 }}>
              <Feature
                label={t("La preuve")}
                title={[
                  t("Ce que l'agent a réellement pu faire."),
                  t("Rejouable pas à pas."),
                ]}
                text={t(
                  "Chaque constat contient la requête, la réponse et ce qu'elle a permis d'obtenir sur le clone. Vous qualifiez la faille sur des faits.",
                )}
                points={[
                  t("Vecteur d'attaque documenté"),
                  t("Replay horodaté"),
                  t("Score CVSS calculé"),
                ]}
              >
                <ReplayVisual />
              </Feature>
              <Feature
                reverse
                label={t("Le correctif")}
                title={[t("La ligne à changer."), t("Déjà validée.")]}
                text={t(
                  "Aegis propose le correctif de code ou d'IaC, rejoue l'attaque pour vérifier qu'elle échoue, puis ouvre une pull request dans votre pipeline.",
                )}
                points={[
                  t("Patch code ou IaC"),
                  t("Attaque rejouée avant la PR"),
                  t("Intégration GitHub et GitLab"),
                ]}
              >
                <FixVisual />
              </Feature>
              <Feature
                label={t("Le journal")}
                title={[
                  t("Chaque action de l'agent."),
                  t("Lisible et audité."),
                ]}
                text={t(
                  "Clonage, attaques, résultats et corrections : tout est horodaté et conservé dans un journal d'audit complet.",
                )}
                points={[
                  t("Journal d'audit exportable"),
                  t("Traçabilité de chaque scénario"),
                  t("Aucune boîte noire"),
                ]}
              >
                <LogVisual />
              </Feature>
              <Feature
                reverse
                label={t("L'historique")}
                title={[t("Un risque mesuré"), t("semaine après semaine.")]}
                text={t(
                  "Failles ouvertes, corrigées et validées dans le temps : de quoi piloter la sécurité et rendre compte à la direction.",
                )}
                points={[
                  t("Score d'exposition"),
                  t("Export PDF"),
                  t("Suivi par service"),
                ]}
              >
                <ChartVisual />
              </Feature>
            </section>

            <section className="sec" style={{ paddingTop: 40 }}>
              <div className="head">
                <ScrollText
                  className="h2 two-tone"
                  parts={[
                    t("Une architecture distribuée,"),
                    {
                      text: t("zero-trust et tolérante aux pannes."),
                      tone: "em",
                    },
                  ]}
                />
                <div className="side">
                  <span className="label">{t("Architecture")}</span>
                  <p>
                    {t(
                      "Quatre briques choisies pour une empreinte minimale sur vos nœuds et une isolation stricte.",
                    )}
                  </p>
                </div>
              </div>
              <div className="arch">
                {arch.map((a, i) => (
                  <Reveal
                    key={a.title}
                    className="surface spot"
                    delay={i * 0.06}
                    onPointerMove={trackSpot}
                  >
                    <span className="ic-box">
                      <a.icon size={19} />
                    </span>
                    <h3 className="h3">{a.title}</h3>
                    <p>{a.text}</p>
                  </Reveal>
                ))}
              </div>
            </section>

            <section className="sec" style={{ paddingTop: 40 }}>
              <div className="faq-wrap">
                <div className="faq-side">
                  <span className="label">{t("Sécurité et conformité")}</span>
                  <ScrollText
                    className="h2"
                    parts={[t("Offensif sur le clone. Inoffensif pour vous.")]}
                  />
                  <p className="small">
                    {t("Pensé pour RGPD, SOC 2 et ISO 27001.")}
                  </p>
                </div>
                <div>
                  {security.map(([title, text]) => (
                    <Reveal key={title} className="qa open" as="div">
                      <div style={{ padding: "22px 0" }}>
                        <h3 className="h3" style={{ marginBottom: 6 }}>
                          {title}
                        </h3>
                        <p className="small">{text}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            <section className="sec" style={{ paddingTop: 40 }}>
              <div className="head">
                <ScrollText
                  className="h2 two-tone"
                  parts={[
                    t("Kubernetes d'abord."),
                    {
                      text: t("Toute votre infrastructure ensuite."),
                      tone: "em",
                    },
                  ]}
                />
                <div className="side">
                  <span className="label">{t("Périmètre")}</span>
                  <p>
                    {t("Ce qu'Aegis couvre aujourd'hui, et ce qui arrive.")}
                  </p>
                </div>
              </div>
              <div className="phases">
                {phases.map(([when, title, text], i) => (
                  <Reveal
                    key={title}
                    className="surface spot"
                    delay={i * 0.06}
                    onPointerMove={trackSpot}
                  >
                    <span
                      className={`chip`}
                      style={
                        i === 0 ? { color: "var(--success-ink)" } : undefined
                      }
                    >
                      {when}
                    </span>
                    <h3 className="h3">{title}</h3>
                    <p>{text}</p>
                  </Reveal>
                ))}
              </div>
            </section>
          </div>
          <FinalCta />
        </main>
        <SiteFooter />
      </div>
    </SmoothScroll>
  );
}
