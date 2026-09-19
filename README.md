# Aegis AI Landing

Public, bilingual presentation of Aegis AI, with an illustrative dashboard and scroll-driven product walkthrough. The demo uses fictional data and does not connect to the platform, run scans, or access infrastructure.

## Development

Use Node.js 22 and npm. No environment variables or backend services are required.

```bash
npm ci
npm run dev -- --port 3001
```

Open http://localhost:3001/fr or http://localhost:3001/en. The root redirects to French. External links open the dashboard and technical documentation.

## Structure

- `src/app/[lang]`: localized routes, document language and metadata.
- `src/components`: landing content and interactive dashboard preview.
- `src/hooks/useLandingMotion.ts`: scoped GSAP timelines and cleanup.
- `src/i18n`: language context and English translations of French source strings.
- `src/app/globals.css`: responsive styles and reduced-motion alternatives.

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, GSAP and ScrollTrigger. Next.js generates both locale pages at build time; the standalone Node server handles routing and image optimization. This is not a static-export deployment. Google fonts are fetched at build time and served by Next.js.

## Checks and contributions

```bash
pre-commit install --hook-type pre-commit --hook-type commit-msg
npm run lint
npm run coverage
npm run build
pre-commit run --all-files
```

Run pre-commit before every push. Commits use `[TYPE] Message in English`: uppercase bracketed type, concise imperative wording, preferably no more than 72 characters. Examples: `[ADD] Add bilingual landing experience`, `[FIX] Preserve keyboard navigation`, `[DOC] Update local setup instructions`.

Tests cover interactions, localization, routing and animation lifecycle. GSAP is mocked in unit tests: these checks do not measure visual smoothness. Before merging visual changes, check both languages, desktop/mobile layouts, scroll reversal, keyboard navigation and reduced motion in a browser.

## Production

```bash
npm run build
npm start
```

Or build the standalone container (requires network access for dependencies and fonts):

```bash
docker build -t aegis-landing .
docker run --rm -p 3001:3000 aegis-landing
```

The runtime runs as a non-root user. Pull requests run formatting, commit-format validation, ESLint, build and coverage. Merges to `main` also trigger the repository's existing release and container-publishing workflow.
