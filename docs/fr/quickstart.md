# 🚀 Quickstart : Landing Page

La landing page d'Aegis est un site statique **Next.js** (SSG). C'est le point
d'entrée public marketing et de confiance, totalement découplé du Dashboard
authentifié.

---

## Développement local

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
```

La sortie est statique et peut être servie depuis n'importe quel CDN ou hôte
edge.

---

## Liens de documentation

Les liens de documentation publics pointent vers le site Docusaurus :

```text
https://aegis-ai-organizations.github.io/Aegis-AI-Documentation
```

Ne dupliquez pas ici les étapes de configuration technique, d'API ou
d'architecture — faites un lien vers la documentation maintenue pour qu'elle
reste versionnée avec la plateforme.

---

## Rappel de frontière

La landing page ne doit pas partager les cookies du Dashboard, les JWT, les
tokens de déploiement ni les identifiants d'API internes. Toute transition vers le
produit passe par la connexion ou l'onboarding du Dashboard.

---

*Marketing et Ingénierie de la Confiance Aegis AI — 2026*
