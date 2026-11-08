"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Power, ShieldCheck, Trash2 } from "lucide-react";
import { useLanguage } from "../../i18n/Language";
import { ConsoleDemo, CONSOLE_VIEWS, type ConsoleView } from "./ConsoleDemo";
import {
  DASHBOARD_URL,
  Mark,
  PilotButton,
  SiteFooter,
  SiteNav,
} from "./Chrome";
import {
  CountUp,
  Reveal,
  ScrollText,
  ScrollTrigger,
  SmoothScroll,
  SplitTitle,
  gsap,
  prefersReducedMotion,
  trackSpot,
  useScrollTo,
} from "./motion";
import { PrismScene, type TileState } from "./PrismScene";
import "./landing.css";

const TECHS = [
  "Kubernetes",
  "Helm",
  "Terraform",
  "GitHub Actions",
  "GitLab CI",
  "Argo CD",
  "PostgreSQL",
  "AWS",
  "Google Cloud",
  "Azure",
];

/* ---------- Hero ---------- */
function Hero() {
  const { locale, t } = useLanguage();
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [attacks, setAttacks] = useState(1284);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const durations = [3200, 2400, 2600];
    let current: 0 | 1 | 2 = 0;
    let timer = 0;
    const next = () => {
      current = ((current + 1) % 3) as 0 | 1 | 2;
      setPhase(current);
      timer = window.setTimeout(next, durations[current]);
    };
    timer = window.setTimeout(next, durations[0]);
    const counter = window.setInterval(
      () => setAttacks((a) => a + Math.floor(Math.random() * 5) + 1),
      700,
    );
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(counter);
    };
  }, []);
  const states: Record<number, TileState> =
    phase === 1 ? { 2: "crit" } : phase === 2 ? { 2: "fixed" } : {};
  const finding = [
    [
      "var(--warn)",
      t("Recherche de failles…"),
      t("Les agents testent la copie"),
    ],
    [
      "var(--danger)",
      t("Faille critique trouvée"),
      t("Vos données clients étaient exposées"),
    ],
    [
      "var(--success)",
      t("Corrigée avant la production"),
      t("La correction est prête"),
    ],
  ][phase];

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <Reveal as="span" className="badge">
            <span className="dot live" />
            {t("Bêta privée · 3 places pour un pilote gratuit")}
          </Reveal>
          <SplitTitle
            as="h1"
            className="h1"
            lines
            parts={[t("Attaquez le clone."), t("Jamais la production.")]}
          />
          <Reveal as="p" className="lead" delay={0.35}>
            {t(
              "Des agents IA testent votre infrastructure en continu, sur une copie isolée. Vous découvrez vos failles avant les attaquants, avec la solution pour les corriger.",
            )}
          </Reveal>
          <Reveal className="actions" delay={0.5}>
            <PilotButton
              label={t("Démarrer un pilote")}
              href={`/${locale}#pilote`}
            />
            <a className="btn ghost" href={`/${locale}#console`}>
              {t("Voir la console")}
            </a>
          </Reveal>
          <Reveal className="hero-kpis" delay={0.65}>
            <div>
              <b>0</b>
              <span>{t("risque pour votre production")}</span>
            </div>
            <div>
              <b>24 h/24</b>
              <span>{t("tests en continu")}</span>
            </div>
            <div>
              <b>2 h</b>
              <span>{t("pour démarrer")}</span>
            </div>
          </Reveal>
        </div>
        <Reveal className="hero-stage" delay={0.4}>
          <PrismScene attackEvery={520} states={states} />
          <div className="anno a1">
            <b>
              <span
                className="dot live"
                style={{ background: "var(--warn)" }}
              />
              {t("Copie attaquée")}
            </b>
            <span>
              {attacks.toLocaleString("fr-FR")}{" "}
              {t("attaques testées aujourd'hui")}
            </span>
          </div>
          <div className="anno a2">
            <b>
              <span className="dot" style={{ background: finding[0] }} />
              {finding[1]}
            </b>
            <span>{finding[2]}</span>
          </div>
          <div className="anno a3">
            <b>
              <span className="dot" />
              {t("Votre production")}
            </b>
            <span>{t("Aucun impact, à aucun moment")}</span>
          </div>
        </Reveal>
      </div>
      <div className="wrap stack">
        <p className="small">
          {t("Fonctionne avec les outils que vous utilisez déjà")}
        </p>
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...TECHS, ...TECHS].map((name, i) => (
              <span className="tech" key={`${name}-${i}`}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Chiffres + manifeste ---------- */
function Context() {
  const { t } = useLanguage();
  const stats = [
    {
      label: t("Avant de détecter une intrusion"),
      to: 277,
      unit: t("jours"),
      text: t("en moyenne. Autant de temps offert à l'attaquant."),
      src: "IBM Cost of a Data Breach, 2023",
    },
    {
      label: t("Coût d'une brèche"),
      to: 4.45,
      decimals: 2,
      unit: "M$",
      text: t("en moyenne, tous secteurs confondus."),
      src: "IBM Cost of a Data Breach, 2023",
    },
    {
      label: t("Erreur humaine"),
      to: 68,
      unit: "%",
      text: t(
        "des violations viennent d'une simple erreur. Une configuration oubliée suffit.",
      ),
      src: "Verizon DBIR, 2024",
    },
  ];
  return (
    <section className="sec" style={{ paddingTop: 120 }}>
      <div className="wrap">
        <div className="stats">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              className="surface stat spot"
              delay={i * 0.08}
              onPointerMove={trackSpot}
            >
              <span className="label">{s.label}</span>
              <div className="n">
                <CountUp to={s.to} decimals={s.decimals} />
                <small>{s.unit}</small>
              </div>
              <p>{s.text}</p>
              <span className="src">{s.src}</span>
            </Reveal>
          ))}
        </div>
        <div className="mani" style={{ marginTop: 136 }}>
          <div className="side">
            <span className="label">{t("Pourquoi maintenant")}</span>
            <p>
              {t(
                "Les attaquants utilisent déjà l'IA pour trouver vos failles plus vite. Votre défense peut faire de même, sans aucun risque.",
              )}
            </p>
          </div>
          <ScrollText
            as="p"
            className="manifesto"
            end={0.42}
            parts={[
              t(
                "Un audit de sécurité photographie votre infrastructure un jour par an. Les 364 autres, vous avancez sans filet. Aegis la teste chaque jour,",
              ),
              { text: t("sur une copie,"), tone: "hl" },
              t("pour que votre production ne soit jamais touchée."),
            ]}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Comment ça marche (prisme épinglé) ---------- */
function Story() {
  const { t } = useLanguage();
  const section = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const bars = useRef<(HTMLElement | null)[]>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = section.current;
    const sc = scene.current;
    if (!el || !sc) return;
    const clone = sc.querySelector<HTMLElement>(".plate.clone");
    const wide = window.matchMedia?.("(min-width: 981px)").matches ?? true;
    if (!wide || prefersReducedMotion()) {
      sc.style.setProperty("--lift", "150px");
      if (clone) clone.style.opacity = "1";
      return;
    }
    const render = (p: number) => {
      sc.style.setProperty("--lift", `${Math.min(1, p / 0.2) * 150}px`);
      sc.style.setProperty("--rz", `${-42 + p * 14}deg`);
      if (clone) clone.style.opacity = String(Math.min(1, p / 0.14));
      bars.current.forEach((b, i) => {
        if (b)
          b.style.transform = `scaleX(${Math.min(1, Math.max(0, p * 4 - i))})`;
      });
      setStep(Math.min(3, Math.floor(p * 4)));
    };
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => render(self.progress),
    });
    render(trigger.progress);
    return () => trigger.kill();
  }, []);

  const caps = [
    {
      k: t("01 · La copie"),
      title: t("Aegis crée une copie de votre infrastructure."),
      text: t(
        "Vos services sont reproduits à l'identique, à côté de votre production, sans jamais y toucher.",
      ),
      chip: <span className="chip">{t("Prête en quelques minutes")}</span>,
    },
    {
      k: t("02 · Les attaques"),
      title: t("Des agents IA l'attaquent, jour et nuit."),
      text: t(
        "Ils testent des milliers de scénarios, exactement comme un pirate le ferait. Mais uniquement sur la copie.",
      ),
      chip: <span className="chip">{t("24 h/24, 7 j/7")}</span>,
    },
    {
      k: t("03 · Les failles"),
      title: t("Vous voyez ce qui est vraiment dangereux."),
      text: t(
        "Pas des centaines d'alertes : seulement les failles qu'un attaquant pourrait réellement exploiter, preuve à l'appui.",
      ),
      chip: <span className="sev crit">{t("Faille critique")}</span>,
    },
    {
      k: t("04 · La correction"),
      title: t("Vous recevez la correction, déjà testée."),
      text: t(
        "Aegis vérifie sur la copie que la correction fonctionne, avant que vous ne l'appliquiez en production.",
      ),
      chip: <span className="sev ok">{t("Aucun impact sur la prod")}</span>,
    },
  ];
  const states: Record<number, TileState> =
    step === 2 ? { 2: "crit" } : step === 3 ? { 2: "fixed" } : {};

  return (
    <section className="story" id="fonctionnement" ref={section}>
      <div className="wrap story-pin">
        <div>
          <div className="prog" aria-hidden="true">
            {caps.map((c, i) => (
              <i key={c.k}>
                <b
                  ref={(node) => {
                    bars.current[i] = node;
                  }}
                />
              </i>
            ))}
          </div>
          <div className="caps">
            {caps.map((c, i) => (
              <div key={c.k} className={`cap ${i === step ? "on" : ""}`}>
                <span className={`label ${i === 0 ? "acc" : ""}`}>{c.k}</span>
                <h2 className="h2">{c.title}</h2>
                <p>{c.text}</p>
                {c.chip}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <PrismScene
            ref={scene}
            attackEvery={step >= 1 && step <= 2 ? 160 : 0}
            states={states}
            cloneOpacity={0}
          />
          <div className={`ov card callout ${step === 2 ? "on" : ""}`}>
            <b>
              <span className="dot" style={{ background: "var(--danger)" }} />
              {t("Faille critique trouvée")}
            </b>
            <span>{t("Un attaquant pourrait lire vos données clients.")}</span>
          </div>
          <div className={`ov card prcard ${step === 3 ? "on" : ""}`}>
            <b>
              <span className="dot" />
              {t("Correction prête")}
            </b>
            <span>{t("Testée sur la copie : l'attaque échoue.")}</span>
          </div>
          <div className={`ov prodok ${step >= 1 ? "on" : ""}`}>
            <span className="chip">
              <span className="dot" />
              {t("Votre production : aucun impact")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- La console (épinglée) ---------- */
function Tour() {
  const { t } = useLanguage();
  const section = useRef<HTMLElement>(null);
  const dash = useRef<HTMLDivElement>(null);
  const bars = useRef<(HTMLElement | null)[]>([]);
  const trigger = useRef<ScrollTrigger | null>(null);
  const locked = useRef(false);
  const [view, setView] = useState<ConsoleView>("overview");
  const scrollTo = useScrollTo();

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const wide = window.matchMedia?.("(min-width: 981px)").matches ?? true;
    if (!wide) return;
    const tween = prefersReducedMotion()
      ? null
      : gsap.fromTo(
          dash.current,
          { rotateX: 16, scale: 0.94, y: 40 },
          {
            rotateX: 0,
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "top top",
              scrub: 0.6,
            },
          },
        );
    trigger.current = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress * CONSOLE_VIEWS.length;
        bars.current.forEach((b, i) => {
          if (b)
            b.style.transform = `scaleX(${Math.min(1, Math.max(0, p - i))})`;
        });
        if (!locked.current)
          setView(
            CONSOLE_VIEWS[Math.min(CONSOLE_VIEWS.length - 1, Math.floor(p))],
          );
      },
    });
    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      trigger.current?.kill();
      trigger.current = null;
    };
  }, []);

  /** Un clic affiche l'étape tout de suite, puis aligne le scroll dessus. */
  const select = (v: ConsoleView) => {
    setView(v);
    const st = trigger.current;
    if (!st) return;
    const i = CONSOLE_VIEWS.indexOf(v);
    locked.current = true;
    scrollTo(
      st.start + (st.end - st.start) * ((i + 0.5) / CONSOLE_VIEWS.length) + 68,
      () => {
        locked.current = false;
      },
    );
    window.setTimeout(() => (locked.current = false), 1600);
  };

  const steps: { view: ConsoleView; title: string; text: string }[] = [
    {
      view: "overview",
      title: t("Vue d'ensemble"),
      text: t("Votre niveau de risque, en un coup d'œil."),
    },
    {
      view: "topology",
      title: t("Votre infrastructure"),
      text: t("Vos services, et ce que l'IA teste en ce moment."),
    },
    {
      view: "pentest",
      title: t("Les attaques en direct"),
      text: t("Suivez chaque test pendant qu'il tourne."),
    },
    {
      view: "findings",
      title: t("Les failles trouvées"),
      text: t("La preuve, puis la correction prête à appliquer."),
    },
    {
      view: "report",
      title: t("Le rapport"),
      text: t("Un bilan clair à présenter à votre direction."),
    },
  ];
  return (
    <section className="tour" id="console" ref={section}>
      <div className="wrap tour-pin">
        <div className="head">
          <ScrollText
            className="h2 two-tone"
            start={0.95}
            end={0.55}
            parts={[
              t("Tout ce qui se passe."),
              { text: t("Dans une seule console."), tone: "em" },
            ]}
          />
          <div className="side">
            <span className="label acc">{t("La console Aegis")}</span>
            <p>
              {t(
                "Suivez les attaques, les failles trouvées et leurs corrections, sans être expert en sécurité.",
              )}
            </p>
          </div>
        </div>
        <div className="tour-grid">
          <div
            className="tour-list"
            role="tablist"
            aria-label={t("Étapes de la console")}
          >
            {steps.map((s, i) => (
              <button
                key={s.view}
                role="tab"
                aria-selected={view === s.view}
                className={view === s.view ? "on" : ""}
                onClick={() => select(s.view)}
              >
                <span className="n">0{i + 1}</span>
                <span>
                  <b>{s.title}</b>
                  <span className="desc">{s.text}</span>
                </span>
                <span className="bar">
                  <i
                    ref={(node) => {
                      bars.current[i] = node;
                    }}
                  />
                </span>
              </button>
            ))}
          </div>
          <div className="tour-stage">
            <div className="tour-dash" ref={dash}>
              <ConsoleDemo view={view} onNavigate={select} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Garanties ---------- */
function Guarantees() {
  const { locale, t } = useLanguage();
  const items = [
    {
      icon: ShieldCheck,
      title: t("Rien ne touche votre production"),
      text: t(
        "Toutes les attaques visent la copie. Votre infrastructure réelle n'en reçoit aucune.",
      ),
    },
    {
      icon: Lock,
      title: t("Vos données restent chez vous"),
      text: t(
        "Aegis ne lit que la structure de vos services, jamais le contenu de vos bases. Conforme RGPD.",
      ),
    },
    {
      icon: Power,
      title: t("Un arrêt d'urgence"),
      text: t(
        "Vous pouvez tout arrêter à tout moment, en un clic, depuis la console.",
      ),
    },
    {
      icon: Trash2,
      title: t("Une copie éphémère"),
      text: t(
        "La copie est détruite à la fin de chaque session. Rien ne traîne.",
      ),
    },
  ];
  return (
    <section className="sec" id="securite">
      <div className="wrap">
        <div className="head">
          <ScrollText
            className="h2 two-tone"
            parts={[
              t("Offensif sur la copie."),
              { text: t("Sans risque pour vous."), tone: "em" },
            ]}
          />
          <div className="side">
            <span className="label">{t("Sécurité")}</span>
            <p>
              {t(
                "Les garanties que vous êtes en droit d'attendre avant de confier votre infrastructure.",
              )}
            </p>
          </div>
        </div>
        <div className="guarantees">
          {items.map((g, i) => (
            <Reveal
              key={g.title}
              className="surface g spot"
              delay={i * 0.06}
              onPointerMove={trackSpot}
            >
              <span className="ic-box">
                <g.icon size={19} />
              </span>
              <h3 className="h3">{g.title}</h3>
              <p>{g.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="surface more">
          <p>
            <b>{t("Vous voulez les détails techniques ?")}</b>{" "}
            {t("Isolation, architecture, chiffrement : tout est expliqué.")}
          </p>
          <Link className="btn ghost sm" href={`/${locale}/plateforme`}>
            {t("Découvrir la plateforme")}{" "}
            <ArrowRight className="arr" size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Pilote + FAQ + CTA ---------- */
function Pilot() {
  const { t } = useLanguage();
  const steps = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLElement>(null);
  const [reached, setReached] = useState(-1);
  useEffect(() => {
    const el = steps.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      end: "bottom 45%",
      scrub: true,
      onUpdate: (self) => {
        if (rail.current)
          rail.current.style.transform = `scaleX(${self.progress})`;
        setReached(Math.floor(self.progress * 3 + 0.02));
      },
    });
    return () => st.kill();
  }, []);
  const items = [
    [
      t("Jour 1 · 2 h"),
      t("Vous installez Aegis"),
      t("Une installation guidée, sans rien changer à votre production."),
    ],
    [
      t("Jour 1 · 30 min"),
      t("La copie est prête"),
      t("Aegis reproduit votre infrastructure et lance les premiers tests."),
    ],
    [
      t("Jour 1"),
      t("Vos premières failles"),
      t("Avec la preuve et la correction, dans votre console."),
    ],
    [
      t("Jours 2 à 90"),
      t("Vous gardez tout"),
      t("Le pilote est gratuit. Les rapports restent à vous."),
    ],
  ];
  return (
    <section className="sec" id="pilote">
      <div className="wrap">
        <div className="head">
          <ScrollText
            className="h2 two-tone"
            parts={[
              t("Vos premières failles,"),
              { text: t("le jour même."), tone: "em" },
            ]}
          />
          <div className="side">
            <span className="label">{t("Votre pilote")}</span>
            <p>
              {t(
                "90 jours gratuits sur votre infrastructure. Sans engagement.",
              )}
            </p>
          </div>
        </div>
        <div className="steps" ref={steps}>
          <span className="rail" aria-hidden="true">
            <i ref={rail} />
          </span>
          {items.map(([k, title, text], i) => (
            <div key={title} className={`step ${i <= reached ? "on" : ""}`}>
              <span className="k">{i + 1}</span>
              <span className="src">{k}</span>
              <h3 className="h3">{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(0);
  const items = [
    [
      t("Aegis touche-t-il à ma production ?"),
      t(
        "Non. Aegis lit la structure de votre infrastructure pour en faire une copie, puis toutes les attaques visent cette copie isolée. Votre production ne reçoit aucun trafic d'attaque.",
      ),
    ],
    [
      t("Quelles données sortent de chez moi ?"),
      t(
        "Uniquement la description de vos services : leur nom, leur version, leurs connexions. Jamais le contenu de vos bases de données.",
      ),
    ],
    [
      t("Est-ce que ça remplace un audit humain ?"),
      t(
        "Non, ça le complète. Vos experts gardent les audits approfondis ; Aegis vous protège tous les autres jours de l'année.",
      ),
    ],
    [
      t("Où en est le produit ?"),
      t(
        "Aegis est en bêta privée. Trois entreprises l’utilisent pendant 90 jours pour façonner le produit avec l’équipe.",
      ),
    ],
  ];
  return (
    <section className="sec" style={{ paddingTop: 40 }}>
      <div className="wrap faq-wrap">
        <div className="faq-side">
          <span className="label">{t("Questions")}</span>
          <ScrollText className="h2" parts={[t("Avant de vous lancer.")]} />
          <p className="small">
            {t("Une autre question ? L'équipe vous répond sous 24 h.")}
          </p>
        </div>
        <div>
          {items.map(([q, a], i) => (
            <div key={q} className={`qa ${open === i ? "open" : ""}`}>
              <button
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                {q}
                <span className="ic" />
              </button>
              <div className="ans">
                <div>
                  <p>{a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  const { t } = useLanguage();
  return (
    <section className="sec" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <Reveal className="surface cta">
          <div className="cta-copy">
            <span className="label acc">
              {t("Programme design partner · 3 places")}
            </span>
            <ScrollText
              className="h2"
              parts={[
                t("Les attaquants n'attendent pas votre prochain audit."),
              ]}
            />
            <p className="lead">
              {t(
                "90 jours gratuits sur votre infrastructure. Vos premières failles trouvées en 30 minutes.",
              )}
            </p>
            <div className="actions">
              <PilotButton label={t("Candidater")} href={DASHBOARD_URL} />
              <a className="btn ghost" href={DASHBOARD_URL}>
                {t("Parler à l'équipe")}
              </a>
            </div>
          </div>
          <div className="orb" aria-hidden="true">
            <span className="ring" />
            <span className="ring r2" />
            <Mark size={68} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="lp">
        <SiteNav page="home" />
        <main>
          <Hero />
          <Context />
          <Story />
          <Tour />
          <Guarantees />
          <Pilot />
          <Faq />
          <FinalCta />
        </main>
        <SiteFooter />
      </div>
    </SmoothScroll>
  );
}
