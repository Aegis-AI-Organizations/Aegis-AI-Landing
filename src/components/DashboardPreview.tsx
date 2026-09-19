"use client";

import {
  Activity,
  Box,
  Check,
  ChevronRight,
  FileText,
  History,
  LayoutDashboard,
  Network,
  RadioTower,
  Search,
  Server,
  Settings,
  ShieldAlert,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "../i18n/Language";
import { useState } from "react";

export const dashboardViews = [
  {
    label: "Piloter",
    title: "Votre point de départ.",
    description:
      "Vérifiez l’état des agents et choisissez les composants à analyser depuis le tableau de bord.",
    icon: LayoutDashboard,
  },
  {
    label: "Cartographier",
    title: "Les connexions deviennent visibles.",
    description:
      "Passez des hôtes aux conteneurs et identifiez les composants concernés par une vulnérabilité.",
    icon: Network,
  },
  {
    label: "Investiguer",
    title: "Chaque analyse garde sa trace.",
    description:
      "Retrouvez les pentests, ouvrez leurs résultats et consultez les preuves avant de prioriser une correction.",
    icon: History,
  },
];

export function DashboardPreview({
  view = 0,
  interactive = false,
}: {
  view?: number;
  interactive?: boolean;
}) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState([true, true, false]);
  const [detail, setDetail] = useState(false);
  return (
    <div className="product-screen">
      <div className="product-topbar">
        <span>
          <Image src="/logo.png" alt="" width={27} height={27} /> AEGIS AI
        </span>
        <span className="product-search">
          <Search size={11} />
          {t("Rechercher…")}
          <kbd>⌘ K</kbd>
        </span>
        <span className="product-avatar">AC</span>
      </div>
      <div className="product-shell">
        <aside
          className="product-sidebar"
          aria-label={t("Aperçu de la navigation du dashboard")}
        >
          {[
            LayoutDashboard,
            History,
            Network,
            Users,
            Server,
            ShieldAlert,
            Settings,
          ].map((Icon, i) => (
            <span className={i === [0, 2, 1][view] ? "active" : ""} key={i}>
              <Icon size={17} />
            </span>
          ))}
          <small>V.01</small>
        </aside>
        <div className="product-content">
          <div className="product-title">
            <div>
              <h3>
                {
                  [
                    t("Tableau de bord sécurité"),
                    t("Topologie de l’infrastructure"),
                    t("Historique des scans"),
                  ][view]
                }
              </h3>
              <p>
                {
                  [
                    t(
                      "Aperçu de votre posture de sécurité et des opérations de pentest.",
                    ),
                    t(
                      "Visualisez les hôtes, les conteneurs et leurs dépendances.",
                    ),
                    t(
                      "Consultez vos analyses et explorez les vulnérabilités détectées.",
                    ),
                  ][view]
                }
              </p>
            </div>
            <span className="product-demo">{t("DÉMO FICTIVE")}</span>
          </div>
          {view === 0 && (
            <>
              <div className="product-grid">
                <section>
                  <h4>{t("ÉTAT DES AGENTS")}</h4>
                  <div className="product-card">
                    <div className="agent-total">
                      <div>
                        <small>{t("AGENTS DÉPLOYÉS")}</small>
                        <strong>2</strong>
                      </div>
                      <RadioTower size={25} />
                    </div>
                    <div className="agent-stats">
                      <div>
                        <Activity size={13} />
                        {t("Actifs")}
                        <b>2</b>
                      </div>
                      <div>
                        <Server size={13} />
                        {t("Inactifs")}
                        <b>0</b>
                      </div>
                    </div>
                    <div className="agent-row">
                      <i /> aegis-staging <span>{t("Connecté")}</span>
                    </div>
                    <div className="agent-row">
                      <i /> aegis-development <span>{t("Connecté")}</span>
                    </div>
                    <div className="product-card-foot">
                      {t("Dernière remontée")}
                      <b>{t("Il y a quelques secondes")}</b>
                    </div>
                  </div>
                </section>
                <section>
                  <h4>{t("NOUVELLE ANALYSE")}</h4>
                  <div className="product-card target-card">
                    <p>
                      {t(
                        "Sélectionnez les composants remontés par les agents.",
                      )}
                    </p>
                    <div className="targets-title">
                      {t("Topologie détectée")}
                      <span>{t("1 hôte · 3 conteneurs")}</span>
                    </div>
                    {["api-users", "web-frontend", "postgres-db"].map(
                      (name, i) =>
                        interactive ? (
                          <label className="target-row" key={name}>
                            <input
                              type="checkbox"
                              checked={selected[i]}
                              onChange={() =>
                                setSelected(
                                  selected.map((v, n) => (n === i ? !v : v)),
                                )
                              }
                            />
                            <Box size={13} />
                            {name}
                            <span>Container</span>
                          </label>
                        ) : (
                          <div className="target-row" key={name}>
                            <span
                              className={`fake-check ${
                                selected[i] ? "checked" : ""
                              }`}
                            >
                              {selected[i] && <Check size={10} />}
                            </span>
                            <Box size={13} />
                            {name}
                            <span>Container</span>
                          </div>
                        ),
                    )}
                    <div className="target-action">
                      {interactive
                        ? `${selected.filter(Boolean).length} ${t(
                            "cible(s) sélectionnée(s)",
                          )}`
                        : t("2 cibles sélectionnées")}
                      <span>{t("APERÇU DU PÉRIMÈTRE")}</span>
                    </div>
                  </div>
                </section>
              </div>
              <div className="product-history">
                <h4>{t("DERNIERS PENTESTS")}</h4>
                <div>
                  <span className="mini-complete">
                    <Check size={11} />
                    {t("Terminé")}
                  </span>
                  <span>{t("Cluster staging")}</span>
                  <span>{t("2 constats")}</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            </>
          )}
          {view === 1 && (
            <div className="product-topology">
              <div className="topology-tools">
                <span>
                  <i /> Acme · Staging
                </span>
                <span>{t("1 hôte / 3 conteneurs")}</span>
              </div>
              <svg
                viewBox="0 0 650 280"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M325 65V125H110V185M325 125V185M325 125H540V185" />
              </svg>
              <div className="topo-host">
                <Server size={19} />
                <span>
                  staging-cluster<small>HOST · LINUX</small>
                </span>
                <i />
              </div>
              {["api-users", "web-frontend", "postgres-db"].map((name, i) => (
                <div
                  className={`topo-container topo-${i} ${
                    i === 0 ? "vulnerable" : ""
                  }`}
                  key={name}
                >
                  <div>
                    <Box size={15} />
                    {name}
                  </div>
                  <small>
                    {["NODE.JS · 8080", "REACT · 3000", "POSTGRES · 5432"][i]}
                  </small>
                  <span>
                    {i === 0 ? (
                      <>
                        <ShieldAlert size={11} />
                        {t("1 vulnérabilité")}
                      </>
                    ) : (
                      t("Aucun constat associé")
                    )}
                  </span>
                </div>
              ))}
              <div className="topology-legend">
                <span>
                  <i />
                  {t("Composant")}
                </span>
                <span>
                  <i />
                  {t("Vulnérabilité associée")}
                </span>
              </div>
            </div>
          )}
          {view === 2 && (
            <div className="product-scans">
              <div className="scan-table-head">
                <span>{t("ANALYSE")}</span>
                <span>{t("STATUT")}</span>
                <span>{t("CONSTATS")}</span>
              </div>
              <button
                className="scan-table-row"
                onClick={() => setDetail(!detail)}
                aria-expanded={detail}
              >
                <span>
                  <Box size={16} />
                  <b>
                    {t("Cluster staging")}
                    <small>api-users · web-frontend</small>
                  </b>
                </span>
                <span className="mini-complete">{t("Terminé")}</span>
                <span>
                  2 <ChevronRight size={14} />
                </span>
              </button>
              <div className="scan-mini-results">
                <div>
                  <ShieldAlert size={15} />
                  <span>
                    {t("Injection SQL")}
                    <small>GET /api/users</small>
                  </span>
                  <b>{t("ÉLEVÉE")}</b>
                </div>
                <div>
                  <ShieldAlert size={15} />
                  <span>
                    Cross-site scripting<small>GET /search</small>
                  </span>
                  <b className="medium">{t("MOYENNE")}</b>
                </div>
              </div>
              {detail && (
                <div className="scan-inline-detail">
                  <FileText size={17} />
                  <span>
                    {t(
                      "Preuves disponibles : point d’entrée, description et observation.",
                    )}
                    <a href="#preuves">{t("Explorer les preuves →")}</a>
                  </span>
                </div>
              )}
              <div className="product-report-note">
                <FileText size={19} />
                <p>
                  {t("Du scan au rapport.")}
                  <span>{t("Retrouvez le contexte de chaque constat.")}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
