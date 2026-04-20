# 🌍 Architecture de la Landing Page : Marketing et Centre de Confiance

La **Landing Page Aegis AI** est le visage public de la plateforme. Construite avec **Next.js** et optimisée pour la **Génération de Sites Statiques (SSG)**, elle sert de "Centre de Confiance" pour le marché de la cybersécurité des entreprises.

---

## 🏗️ Principes de Conception de Base

La Landing Page est conçue pour la **performance**, la **réduction de la surface d'attaque** et la **découvrabilité** :

1. **Isolation Stratégique** : Le site est complètement découplé du domaine applicatif (`app.aegis.ai`), offrant une séparation physique entre le trafic public et le cœur de l'orchestrateur privé.
2. **Interface Docs-as-Code** : Sert de point d'entrée public principal pour notre documentation technique, extrayant dynamiquement le contenu de l'ensemble de l'écosystème de microservices.
3. **Performance Extrême** : Utilisation de la **Génération de Sites Statiques (SSG)** pour garantir un Time-To-Interactive (TTI) inférieur à la seconde et un classement SEO maximal.

---

## 🔐 Sécurité et Réduction de la Surface

Aegis met en œuvre une stratégie "Surface Minimale" pour tous les composants exposés au public :

- **Zéro Dépendance à la Base de Données** : Le site Landing ne contient **aucune** connexion d'exécution aux bases de données de production Aegis ou au cœur Kubernetes. Toutes les données sont pré-extraites au moment du build.
- **Séparation Physique du Domaine** : Hébergé sur `www.aegis.ai`, sans état de session ni cookies partagés avec le Dashboard.
- **Immunité DDoS** : Exploitation des nœuds Edge CDN distribués mondialement pour absorber le trafic à haute intensité sans impacter le portail analyste privé.

---

## 🛰️ Pile Technique

| Composant   | Technologie           | Version |
| ----------- | --------------------- | ------- |
| Framework   | **Next.js** (SSG)     | 14.x    |
| Style       | **Tailwind CSS**      | 3.x     |
| Animation   | **Framer Motion**     | 10.x    |
| Hébergement | **Optimisé CDN Edge** | —       |

---

## 🌊 Flux Logique : Point d'Entrée

1. **Conversion** : Des copies marketing haute fidélité et des démos interactives dirigent le trafic vers la connexion au portail privé.
2. **Documentation** : Expose de manière transparente l'architecture de sécurité de la plateforme via le chemin `/docs`.
3. **Conformité** : Sections dédiées à la transparence des audits SOC2/ISO et aux rapports de disponibilité (uptime).

---

_Marketing et Ingénierie de la Confiance Aegis AI — 2026_
