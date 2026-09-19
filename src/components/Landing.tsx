"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../i18n/Language";
import { DashboardPreview, dashboardViews } from "./DashboardPreview";
import { useLandingMotion } from "../hooks/useLandingMotion";
import {
  ArrowUpRight,
  ArrowDown,
  Network,
  ShieldCheck,
  ScanLine,
  FileCheck2,
  ChevronRight,
  Terminal,
  Layers,
  Menu,
  X,
} from "lucide-react";

const docs = "https://aegis-ai-organizations.github.io/Aegis-AI-Documentation";
const steps = [
  {
    title: "Comprendre le terrain.",
    text: "Les services, leurs dépendances et leurs connexions. Une cartographie pour définir ce que vous allez tester.",
    label: "Cartographier",
    icon: Network,
  },
  {
    title: "Déplacer le risque.",
    text: "Une copie fonctionnelle dans un environnement isolé devient le terrain de vos tests offensifs.",
    label: "Isoler",
    icon: Layers,
  },
  {
    title: "Mettre à l’épreuve.",
    text: "Les tests ciblent les surfaces identifiées. Chaque résultat doit pouvoir être relié à une preuve.",
    label: "Tester",
    icon: ScanLine,
  },
  {
    title: "Passer aux faits.",
    text: "Un point d’entrée, une vulnérabilité, une preuve. Votre équipe dispose d’un résultat concret à examiner.",
    label: "Analyser",
    icon: FileCheck2,
  },
];

function Graph({ sandbox = false }: { sandbox?: boolean }) {
  const { t } = useLanguage();
  return (
    <div
      className={`graph ${sandbox ? "sandbox-graph" : ""}`}
      aria-label={
        sandbox
          ? t("Copie isolée de l’infrastructure de démonstration")
          : t("Cartographie de démonstration")
      }
    >
      <svg viewBox="0 0 650 340" className="connections" aria-hidden="true">
        <path d="M325 62V128M325 128H130V195M325 128H520V195M325 128V195M130 220V290H325V245M520 220V290H325" />
        <path className="attack-line" d="M325 62V128H130V195" />
      </svg>
      <div className="graph-node gateway">
        <Network size={19} />
        <span>
          Ingress<small>api.acme.demo</small>
        </span>
        <i />
      </div>
      <div className="graph-node service one">
        <Terminal size={18} />
        <span>
          API users<small>Node.js · :8080</small>
        </span>
        <i />
      </div>
      <div className="graph-node service two">
        <Layers size={18} />
        <span>
          PostgreSQL<small>Database · :5432</small>
        </span>
        <i />
      </div>
      <div className="graph-node service three">
        <Terminal size={18} />
        <span>
          Web app<small>Frontend · :3000</small>
        </span>
        <i />
      </div>
      <span className="graph-caption">
        {sandbox
          ? t("SANDBOX / ENVIRONNEMENT ISOLÉ")
          : "ACME / KUBERNETES CLUSTER"}
      </span>
    </div>
  );
}

function Console({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  return (
    <div className={`console ${compact ? "compact-console" : ""}`}>
      <div className="console-bar">
        <span className="console-brand">
          Æ <b>AEGIS</b>
        </span>
        <span>Workspace / Acme</span>
        <span className="demo-tag">{t("DONNÉES FICTIVES")}</span>
      </div>
      <div className="console-body">
        <aside>
          <Network />
          <ScanLine />
          <ShieldCheck />
          <FileCheck2 />
          <span>AC</span>
        </aside>
        <div className="console-main">
          <div className="console-heading">
            <div>
              <span className="eyebrow">{t("VOTRE INFRASTRUCTURE")}</span>
              <h3>{t("Une vue d’ensemble.")}</h3>
            </div>
            <span className="connected">
              <i />
              {t("Agent connecté")}
            </span>
          </div>
          <Graph />
          <div className="console-bottom">
            <span>
              <i />
              {t("3 services identifiés")}
            </span>
            <span>
              Kubernetes <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScrollColor({ children }: { children: string }) {
  return (
    <span className="scroll-color">
      <span className="scroll-color-base">{children}</span>
      <span className="scroll-color-ink" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

export default function Home() {
  const { t, locale } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const [menu, setMenu] = useState(false);
  const [finding, setFinding] = useState<"sqli" | "xss">("sqli");
  const [quiet, setQuiet] = useState(false);
  const [dashboardView, setDashboardView] = useState(0);
  useLandingMotion(root, quiet, locale, setDashboardView);

  return (
    <main ref={root} className={quiet ? "quiet" : ""}>
      <a className="skip" href="#experience">
        {t("Aller à la démonstration")}
      </a>
      <header className="nav">
        <a href="#" className="brand" aria-label={t("Aegis AI — accueil")}>
          <Image src="/logo.png" alt="" width={42} height={42} />
          <span>
            AEGIS<span className="brand-ai">AI</span>
          </span>
        </a>
        <nav
          className={menu ? "open" : ""}
          aria-label={t("Navigation principale")}
        >
          <a href="#dashboard" onClick={() => setMenu(false)}>
            {t("La plateforme")}
          </a>
          <a href="#preuves" onClick={() => setMenu(false)}>
            {t("Les preuves")}
          </a>
          <a href={docs} target="_blank" rel="noreferrer">
            Documentation <ArrowUpRight size={13} />
          </a>
        </nav>
        <div
          className="language-switch"
          aria-label={locale === "fr" ? "Langue du site" : "Site language"}
        >
          <Link
            href="/fr"
            lang="fr"
            hrefLang="fr"
            aria-label="Français"
            aria-current={locale === "fr" ? "page" : undefined}
          >
            FR
          </Link>
          <Link
            href="/en"
            lang="en"
            hrefLang="en"
            aria-label="English"
            aria-current={locale === "en" ? "page" : undefined}
          >
            EN
          </Link>
        </div>
        <a className="nav-cta" href="https://app.aegis-ai.fr">
          {t("Ouvrir le dashboard")}
          <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-toggle"
          aria-label={menu ? t("Fermer le menu") : t("Ouvrir le menu")}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <section className="hero">
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> PENTEST · DIGITAL TWIN
            </p>
            <h1>
              {t("Votre infrastructure.")}
              <br />
              <span>{t("Mise à l’épreuve.")}</span>
            </h1>
            <p className="hero-description">
              {t(
                "Cartographiez vos services, testez leur copie isolée et examinez les preuves. Un espace de travail pour passer de la découverte à l’action.",
              )}
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#dashboard">
                {t("Découvrir le dashboard")}
                <ArrowDown size={16} />
              </a>
              <a className="hero-secondary" href="#experience">
                {t("Voir le fonctionnement")}
                <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="hero-capabilities">
              <span>
                <Network size={13} />
                {t("Cartographie")}
              </span>
              <span>
                <Layers size={13} />
                {t("Jumeau isolé")}
              </span>
              <span>
                <FileCheck2 size={13} />
                {t("Preuves vérifiables")}
              </span>
            </div>
          </div>
          <div className="hero-console">
            <DashboardPreview />
          </div>
        </div>
        <div className="hero-foot">
          <span>{t("CONÇU POUR LES ÉQUIPES QUI CONSTRUISENT.")}</span>
          <span>{t("ET CELLES QUI LES PROTÈGENT.")}</span>
        </div>
      </section>
      <section className="manifesto paper">
        <div className="section-label">{t("01 / CHANGER DE RYTHME")}</div>
        <div>
          <h2>
            <span className="manifesto-line">
              <ScrollColor>{t("Un audit photographie")}</ScrollColor>
            </span>
            <span className="manifesto-line">
              <ScrollColor>{t("un instant.")}</ScrollColor>
            </span>
            <span className="manifesto-line accent-line">
              <ScrollColor>{t("Votre infrastructure")}</ScrollColor>
            </span>
            <span className="manifesto-line accent-line">
              <ScrollColor>{t("continue de bouger.")}</ScrollColor>
            </span>
          </h2>
          <div className="manifesto-copy reveal">
            <span className="large-arrow">↳</span>
            <p>
              {t(
                "Un nouveau service. Une dépendance mise à jour. Une route exposée. Entre deux audits, votre surface d’attaque évolue.",
              )}
              <br />
              <br />
              {t(
                "Aegis AI développe une approche de pentest régulier : comprendre votre environnement, le mettre à l’épreuve dans une copie isolée, puis vous donner les éléments pour agir.",
              )}
            </p>
          </div>
        </div>
      </section>
      <section className="dashboard-tour" id="dashboard">
        <div className="tour-stage">
          <div className="section-label">
            {t("02 / À L’INTÉRIEUR DU DASHBOARD")}{" "}
            <span>{t("SCROLLEZ OU CHOISISSEZ UNE VUE")}</span>
          </div>
          <div className="tour-heading">
            <h2>
              {t("Un seul endroit.")}
              <br />
              <ScrollColor>{t("Toute la perspective.")}</ScrollColor>
            </h2>
            <p>
              {t("Les agents, les cibles, les analyses.")}
              <br />
              {t("Entrez dans votre espace de sécurité.")}
            </p>
          </div>
          <div className="tour-layout">
            <div
              className="tour-nav"
              role="tablist"
              aria-label={t("Vues de la démonstration")}
              aria-orientation="vertical"
            >
              {dashboardViews.map((view, i) => (
                <button
                  role="tab"
                  id={`view-tab-${i}`}
                  aria-controls="dashboard-panel"
                  aria-selected={dashboardView === i}
                  tabIndex={dashboardView === i ? 0 : -1}
                  key={t(view.label)}
                  className={dashboardView === i ? "selected" : ""}
                  onClick={() => {
                    setDashboardView(i);
                    const window =
                      root.current?.querySelector<HTMLElement>(".tour-window");
                    window?.style.setProperty("--dash-phase", "1");
                    window?.style.setProperty("--dash-exit", "0");
                  }}
                  onKeyDown={(e) => {
                    if (
                      ["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)
                    ) {
                      e.preventDefault();
                      const next =
                        e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? 2
                            : (i + (e.key === "ArrowDown" ? 1 : 2)) % 3;
                      setDashboardView(next);
                      const window =
                        root.current?.querySelector<HTMLElement>(
                          ".tour-window",
                        );
                      window?.style.setProperty("--dash-phase", "1");
                      window?.style.setProperty("--dash-exit", "0");
                      document.getElementById(`view-tab-${next}`)?.focus();
                    }
                  }}
                >
                  <span className="tour-tab-number">0{i + 1}</span>
                  <view.icon size={18} />
                  <div>
                    <b>{t(view.label)}</b>
                    <p>{t(view.description)}</p>
                  </div>
                  <ChevronRight size={14} />
                </button>
              ))}
              <div className="tour-caption">
                {t(
                  "Interface réinterprétée à partir du dashboard Aegis AI. Données de démonstration.",
                )}
              </div>
            </div>
            <div
              className="tour-window"
              role="tabpanel"
              id="dashboard-panel"
              aria-labelledby={`view-tab-${dashboardView}`}
            >
              <DashboardPreview view={dashboardView} interactive />
            </div>
          </div>
          <div className="tour-meter">
            <div className="tour-meter-fill" />
          </div>
        </div>
      </section>
      <section className="story" id="experience">
        <div className="story-stage">
          <div className="section-label">
            {t("03 / DU TERRAIN À LA PREUVE")}{" "}
            <span>{t("FAITES DÉFILER POUR EXPLORER ↓")}</span>
          </div>
          <div className="story-layout">
            <div className="story-copy">
              {steps.map((s, i) => (
                <article className={`story-step step-${i}`} key={t(s.label)}>
                  <span className="step-number">0{i + 1} / 04</span>
                  <h2>{t(s.title)}</h2>
                  <p>{t(s.text)}</p>
                  <div className="step-label">
                    <s.icon size={18} />
                    {t(s.label)}
                  </div>
                </article>
              ))}
            </div>
            <div className="story-visual">
              <div className="story-console">
                <Console />
              </div>
              <div className="sandbox-layer">
                <div className="sandbox-top">
                  <ShieldCheck size={17} />
                  {t("JUMEAU NUMÉRIQUE")}
                  <span>{t("ISOLÉ")}</span>
                </div>
                <Graph sandbox />
                <div className="scan-result">
                  <span className="red-dot" />
                  {t("Injection SQL identifiée")}{" "}
                  <span>{t("Voir la preuve ↗")}</span>
                </div>
              </div>
              <div className="proof-peek">
                <span className="eyebrow">{t("RÉSULTAT / 001")}</span>
                <span className="severity">{t("ÉLEVÉE")}</span>
                <h3>{t("Injection SQL")}</h3>
                <code>GET /api/users</code>
                <p>
                  {t(
                    "Une réponse différentielle indique un comportement à examiner.",
                  )}
                </p>
                <div>
                  <FileCheck2 size={17} />
                  {t("Preuve jointe au résultat")}
                </div>
              </div>
            </div>
          </div>
          <div className="story-rail">
            {steps.map((s, i) => (
              <span key={t(s.label)}>
                0{i + 1} <b>{t(s.label)}</b>
              </span>
            ))}
            <div className="story-progress" />
          </div>
        </div>
      </section>
      <section className="operations">
        <div className="section-label">{t("04 / SUIVRE L’OPÉRATION")}</div>
        <div className="operations-heading">
          <h2 className="reveal">
            {t("Un pentest n’est pas")}
            <br />
            <ScrollColor>{t("une boîte noire.")}</ScrollColor>
          </h2>
          <p className="reveal">
            {t(
              "Le dashboard suit les phases de l’analyse. Vous savez où en est l’opération, de la préparation à la restitution.",
            )}
          </p>
        </div>
        <div className="operation-track">
          <div className="operation-line">
            <div className="operation-fill" />
          </div>
          {[
            {
              title: t("Préparer"),
              detail: t(
                "Provisionnement du jumeau et reconnaissance des services.",
              ),
              icon: Layers,
            },
            {
              title: t("Éprouver"),
              detail: t(
                "Exécution des tests sur les cibles de l’environnement isolé.",
              ),
              icon: ScanLine,
            },
            {
              title: t("Restituer"),
              detail: t("Consolidation des constats et génération du rapport."),
              icon: FileCheck2,
            },
            {
              title: t("Nettoyer"),
              detail: t("Nettoyage de l’environnement créé pour le test."),
              icon: ShieldCheck,
            },
          ].map((phase, i) => (
            <article className="operation-step" key={phase.title}>
              <div className="operation-icon">
                <phase.icon size={22} />
              </div>
              <span>0{i + 1}</span>
              <h3>{phase.title}</h3>
              <p>{phase.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="evidence paper" id="preuves">
        <div className="section-label">
          {t("05 / MOINS DE BRUIT. PLUS DE CONTEXTE.")}
        </div>
        <div className="evidence-intro">
          <h2 className="reveal">
            {t("Une alerte ne suffit pas.")}
            <br />
            <ScrollColor>{t("Montrez-moi la preuve.")}</ScrollColor>
          </h2>
          <p>
            {t(
              "De la cartographie au résultat, gardez le fil. Une lecture claire pour les équipes sécurité et les personnes qui vont corriger.",
            )}
          </p>
        </div>
        <div className="evidence-demo reveal">
          <div className="findings">
            <div className="demo-heading">
              {t("Résultats du pentest")}
              <span>{t("DÉMONSTRATION")}</span>
            </div>
            <button
              className={finding === "sqli" ? "selected" : ""}
              onClick={() => setFinding("sqli")}
              aria-pressed={finding === "sqli"}
            >
              <span className="finding-icon">!</span>
              <span>
                <b>{t("Injection SQL")}</b>
                <small>API users · /api/users</small>
              </span>
              <ChevronRight size={16} />
            </button>
            <button
              className={finding === "xss" ? "selected" : ""}
              onClick={() => setFinding("xss")}
              aria-pressed={finding === "xss"}
            >
              <span className="finding-icon amber">!</span>
              <span>
                <b>Cross-site scripting</b>
                <small>Web app · /search</small>
              </span>
              <ChevronRight size={16} />
            </button>
            <p>
              {t("Données fictives. Aucun test n’est lancé depuis cette page.")}
            </p>
          </div>
          <div className="finding-detail" aria-live="polite">
            <div className="detail-meta">
              <span>
                {t("PREUVE /")} {finding === "sqli" ? "001" : "002"}
              </span>
              <span className="severity">
                {finding === "sqli" ? t("ÉLEVÉE") : t("MOYENNE")}
              </span>
            </div>
            <h3>
              {finding === "sqli"
                ? t("Une entrée. Un comportement inattendu.")
                : t("Une entrée reflétée dans la page.")}
            </h3>
            <div className="code">
              <span>{t("POINT D’ENTRÉE")}</span>
              <code>
                GET {finding === "sqli" ? "/api/users?id=…" : "/search?q=…"}
              </code>
              <hr />
              <span>OBSERVATION</span>
              <p>
                {finding === "sqli"
                  ? t(
                      "La réponse varie selon la condition injectée dans le paramètre id.",
                    )
                  : t(
                      "La valeur du paramètre q est restituée sans neutralisation dans le document HTML.",
                    )}
              </p>
            </div>
            <div className="detail-footer">
              <FileCheck2 size={18} />
              <span>
                {t("Contexte, point d’entrée et observation")}
                <br />
                <b>{t("Un résultat à examiner et à traiter.")}</b>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="control">
        <div className="section-label">{t("06 / GARDER LA MAIN")}</div>
        <h2 className="reveal">
          {t("Offensif dans les tests.")}
          <br />
          <ScrollColor>{t("Précis dans le cadre.")}</ScrollColor>
        </h2>
        <div className="control-list">
          {[
            {
              n: "01",
              title: t("Un périmètre explicite"),
              text: t(
                "La cartographie rend les services et leurs relations visibles avant de définir les cibles du test.",
              ),
            },
            {
              n: "02",
              title: t("Un environnement isolé"),
              text: t(
                "Les scénarios s’exécutent sur une copie fonctionnelle. La fidélité dépend des services et des données disponibles.",
              ),
            },
            {
              n: "03",
              title: t("Des résultats examinables"),
              text: t(
                "Les preuves et les rapports aident votre équipe à qualifier les constats et à décider de la suite.",
              ),
            },
          ].map((item) => (
            <article className="reveal" key={item.n}>
              <span>{item.n}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <ArrowUpRight size={25} />
            </article>
          ))}
        </div>
      </section>
      <section className="faq paper">
        <div>
          <div className="section-label">{t("07 / EN TOUTE TRANSPARENCE")}</div>
          <h2>
            {t("Les bonnes")}
            <br /> {t("questions.")}
          </h2>
        </div>
        <div className="questions">
          {[
            [
              t("Où en est Aegis AI aujourd’hui ?"),
              t(
                "La plateforme est en développement. Cette page présente son approche et une démonstration illustrative ; les capacités disponibles dépendent de la version et de l’environnement déployés.",
              ),
            ],
            [
              t("Quels environnements sont visés ?"),
              t(
                "Le premier périmètre est centré sur Kubernetes et les vulnérabilités d’injection. Les autres environnements et des scénarios plus larges font partie de la vision du projet.",
              ),
            ],
            [
              t("Est-ce un remplacement d’un pentest humain ?"),
              t(
                "L’objectif est de compléter les audits spécialisés par des tests plus réguliers. L’analyse métier et l’expertise humaine restent nécessaires.",
              ),
            ],
            [
              t("La démonstration accède-t-elle à mon infrastructure ?"),
              t(
                "Non. Les services, les vulnérabilités et les preuves affichés ici sont fictifs. Cette démonstration publique n’est connectée à aucune infrastructure.",
              ),
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="closing">
        <p className="eyebrow">{t("COMPRENDRE. ÉPROUVER. AGIR.")}</p>
        <h2>
          {t("Voyez votre infrastructure")}
          <br />
          {t("sous un autre")} <em>{t("angle.")}</em>
        </h2>
        <a className="button primary" href="#experience">
          {t("Rejouer l’expérience")}
          <ArrowUpRight size={18} />
        </a>
        <a className="text-link" href={docs} target="_blank" rel="noreferrer">
          {t("Lire la documentation")}
          <ArrowUpRight size={15} />
        </a>
        <span className="closing-mark" aria-hidden="true">
          ↗
        </span>
      </section>
      <footer>
        <a href="#" className="brand">
          AEGIS<span className="brand-ai">AI</span>
        </a>
        <span>{t("La sécurité se démontre.")}</span>
        <button onClick={() => setQuiet(!quiet)} aria-pressed={quiet}>
          {quiet ? t("Activer les animations") : t("Réduire les animations")}
        </button>
        <span>© {new Date().getFullYear()} Aegis AI</span>
      </footer>
    </main>
  );
}
