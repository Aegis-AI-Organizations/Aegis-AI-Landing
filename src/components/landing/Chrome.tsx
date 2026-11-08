"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useLanguage } from "../../i18n/Language";
import { useMagnetic } from "./motion";

export const DASHBOARD_URL = "https://app.aegis-ai.fr";

export function docsUrl(locale: string) {
  return `https://aegis-ai-organizations.github.io/Aegis-AI-Documentation${
    locale === "fr" ? "/fr" : ""
  }/docs/Agent/architecture/`;
}

/** Logo Aegis (bouclier hexagonal) aux couleurs de la charte. */
export function Mark({ size = 22 }: { size?: number }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2fb6ff" />
          <stop offset=".55" stopColor="#4f6bff" />
          <stop offset="1" stopColor="#6a2cf5" />
        </linearGradient>
      </defs>
      <g fill={`url(#${id})`}>
        <path d="M29.5 4.5 9 16.3a3 3 0 0 0-1.5 2.6V43l7-4V22.3l15-8.7Z" />
        <path d="M34.5 4.5 55 16.3a3 3 0 0 1 1.5 2.6V43l-7-4V22.3l-15-8.7Z" />
        <path d="m10.5 46.5 20 11.6a3 3 0 0 0 3 0l20-11.6-6.6-3.8L32 51.8l-14.9-9.1Z" />
        <path d="m32 21.5 10 5.8v11.4l-10 5.8-10-5.8V27.3Z" />
      </g>
    </svg>
  );
}

export function PilotButton({
  label,
  href,
  className = "btn primary",
}: {
  label: string;
  href: string;
  className?: string;
}) {
  const ref = useMagnetic<HTMLAnchorElement>();
  return (
    <a ref={ref} className={className} href={href}>
      {label} <ArrowRight className="arr" size={15} />
    </a>
  );
}

export function SiteNav({ page }: { page: "home" | "platform" }) {
  const { locale, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const home = `/${locale}`;
  const close = () => setOpen(false);
  const path = page === "platform" ? "/plateforme" : "";
  return (
    <header className={`hdr ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap">
        <Link
          className="brand"
          href={home}
          aria-label={t("Aegis AI — accueil")}
        >
          <Mark />
          AEGIS AI
        </Link>
        <nav
          className={`links ${open ? "open" : ""}`}
          aria-label={t("Navigation principale")}
        >
          <a href={`${home}#fonctionnement`} onClick={close}>
            {t("Fonctionnement")}
          </a>
          <Link
            href={`${home}/plateforme`}
            aria-current={page === "platform" ? "page" : undefined}
            onClick={close}
          >
            {t("Plateforme")}
          </Link>
          <Link href={`${home}/pricing`} onClick={close}>
            {t("Tarifs")}
          </Link>
          <Link href={`${home}/blog`} onClick={close}>
            {t("Journal")}
          </Link>
          <a href={docsUrl(locale)} target="_blank" rel="noreferrer">
            Documentation
          </a>
        </nav>
        <div className="hdr-cta">
          <div
            className="lang"
            aria-label={locale === "fr" ? "Langue du site" : "Site language"}
          >
            <Link
              href={`/fr${path}`}
              hrefLang="fr"
              aria-label="Français"
              aria-current={locale === "fr" ? "page" : undefined}
            >
              FR
            </Link>
            <Link
              href={`/en${path}`}
              hrefLang="en"
              aria-label="English"
              aria-current={locale === "en" ? "page" : undefined}
            >
              EN
            </Link>
          </div>
          <a className="btn plain sm" href={DASHBOARD_URL}>
            {t("Se connecter")}
          </a>
          <a className="btn ghost sm" href={`${home}#pilote`}>
            {t("Démarrer un pilote")}
          </a>
          <button
            className="menu-btn"
            aria-label={open ? t("Fermer le menu") : t("Ouvrir le menu")}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { locale, t } = useLanguage();
  const home = `/${locale}`;
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
            <Link className="brand" href={home}>
              <Mark />
              AEGIS AI
            </Link>
            <p className="small" style={{ maxWidth: "32ch" }}>
              {t(
                "Des agents IA qui attaquent une copie de votre infrastructure, pour que la vraie ne le soit jamais.",
              )}
            </p>
          </div>
          <div>
            <h4>{t("Produit")}</h4>
            <a href={`${home}#fonctionnement`}>{t("Fonctionnement")}</a>
            <Link href={`${home}/plateforme`}>{t("Plateforme")}</Link>
            <Link href={`${home}/pricing`}>{t("Tarifs")}</Link>
          </div>
          <div>
            <h4>{t("Ressources")}</h4>
            <a href={docsUrl(locale)} target="_blank" rel="noreferrer">
              Documentation
            </a>
            <Link href={`${home}/blog`}>{t("Journal")}</Link>
          </div>
          <div>
            <h4>{t("Entreprise")}</h4>
            <a href={`${home}#pilote`}>{t("Programme design partner")}</a>
            <a href={DASHBOARD_URL}>{t("Se connecter")}</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span className="src">© 2026 AEGIS AI · Epitech Lyon</span>
          <span className="src">
            {t("Données de démonstration, aucun test réel depuis cette page")}
          </span>
        </div>
      </div>
    </footer>
  );
}
