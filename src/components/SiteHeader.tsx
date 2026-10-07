"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useLanguage } from "../i18n/Language";

export function SiteHeader({
  pricing = false,
  blog = false,
}: {
  pricing?: boolean;
  blog?: boolean;
}) {
  const { locale, t } = useLanguage();
  const [menu, setMenu] = useState(false);
  const base = `https://aegis-ai-organizations.github.io/Aegis-AI-Documentation${
    locale === "fr" ? "/fr" : ""
  }/docs`;
  const docs = `${base}/Agent/architecture/`;
  const apiReference = `${base}/Swagger-API/aegis-ai-gateway-api/`;
  return (
    <header className="nav">
      <Link
        href={`/${locale}`}
        className="brand"
        aria-label={t("Aegis AI — accueil")}
      >
        <Image src="/logo.png" alt="" width={42} height={42} />
        <span>
          AEGIS<span className="brand-ai">AI</span>
        </span>
      </Link>
      <nav
        className={menu ? "open" : ""}
        aria-label={t("Navigation principale")}
      >
        <a href={`/${locale}#dashboard`} onClick={() => setMenu(false)}>
          {t("La plateforme")}
        </a>
        <a href={`/${locale}#preuves`} onClick={() => setMenu(false)}>
          {t("Les preuves")}
        </a>
        <Link
          href={`/${locale}/pricing`}
          aria-current={pricing ? "page" : undefined}
          onClick={() => setMenu(false)}
        >
          {t("Tarifs")}
        </Link>
        <Link
          href={`/${locale}/blog`}
          aria-current={blog ? "page" : undefined}
          onClick={() => setMenu(false)}
        >
          Journal
        </Link>
        <a href={docs} target="_blank" rel="noreferrer">
          Documentation <ArrowUpRight size={13} />
        </a>
        <a href={apiReference} target="_blank" rel="noreferrer">
          {t("API Swagger")} <ArrowUpRight size={13} />
        </a>
      </nav>
      <div
        className="language-switch"
        aria-label={locale === "fr" ? "Langue du site" : "Site language"}
      >
        <Link
          href={`/fr${pricing ? "/pricing" : blog ? "/blog" : ""}`}
          lang="fr"
          hrefLang="fr"
          aria-label="Français"
          aria-current={locale === "fr" ? "page" : undefined}
        >
          FR
        </Link>
        <Link
          href={`/en${pricing ? "/pricing" : blog ? "/blog" : ""}`}
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
  );
}
