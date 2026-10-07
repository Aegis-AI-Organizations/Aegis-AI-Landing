# Aegis AI Landing

Public, bilingual presentation of Aegis AI, with an illustrative dashboard and scroll-driven product walkthrough. The demo uses fictional data and does not connect to the platform, run scans, or access infrastructure.

## Development

Use Node.js 22 and npm. Run `npm run cms:setup` once to create the local CMS environment.

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

## Editorial CMS and blog

Payload 3 powers `/admin`, `/fr/blog`, and `/en/blog`. The site keeps its existing design;
Payload provides the authenticated editor, media library, autosave, revision history and publication actions.

### Local setup

```sh
npm ci
npm run cms:setup
npm run dev -- --hostname 127.0.0.1 --port 3001
```

Open `http://localhost:3001/admin` and create your first account. It becomes an administrator.
Subsequent accounts can only be created by an administrator. Editors can manage articles and media,
but cannot delete them, manage other users, or change roles. Use the Équipe collection to add colleagues.

The Médias sidebar opens `/admin/media` at the root with two actions: create a folder and import an image. Click a folder to browse it, use the breadcrumb to go up, or click a thumbnail to edit its details. Folder changes keep image URLs stable. Editors can organize folders; only administrators can delete folders. Deleting a folder preserves its media.

Create an article with its language, title, summary, unique slug, author, category and rich text.
Save a draft, use **Preview** to check it while authenticated, and publish when ready.
English and French articles are separate documents, so each language has its own publication lifecycle.
The public language switch returns to the journal in the chosen language; translations are not inferred.
The publication date is display metadata, not a scheduler. Images uploaded to the media library are public assets.
Do not upload confidential documents. JPEG, PNG, WebP and AVIF images are supported (10 MB maximum).

Content persists in `aegis-content.db`; uploads persist in `media/`. Both are ignored by Git.
Back up both together, along with the secret stored in `.env.local`. No sample articles or default
passwords are installed in your real database. The public journal intentionally has an empty state.
SMTP is configurable. Local setup uses Mailpit at 127.0.0.1:1025, with its mailbox at
http://127.0.0.1:8025. Start it using `mailpit --listen 127.0.0.1:8025 --smtp 127.0.0.1:1025`.
Mailpit captures messages without external delivery. `npm run test:mailpit` verifies delivery,
reset URL, password replacement and single-use tokens on an isolated database. CI runs this test
against a Mailpit service. Never expose the Mailpit inbox publicly.
For real SMTP later, configure SMTP_HOST, SMTP_PORT, SMTP_FROM_ADDRESS and, if required, SMTP_USER,
SMTP_PASSWORD, SMTP_SECURE (implicit TLS) or SMTP_REQUIRE_TLS (STARTTLS). Keep credentials outside Git.

### Deployment

This configuration uses SQLite and a persistent media directory. It is suitable for a **single writable
application instance**. Do not scale multiple Kubernetes replicas against this local database. For a
multi-replica deployment, migrate to Payload's PostgreSQL adapter and shared object storage first;
the Aegis platform database is not connected to this CMS.

Set `PAYLOAD_SECRET` to a persistent random secret and `SITE_URL` to the public origin. Never reuse
test credentials or generate a new secret on each boot. The Docker image expects a persistent volume
at `/app/data`, writable by its `node` user. This volume contains both the SQLite database and media.
On a fresh production database, the versioned migrations are applied at startup. Future schema changes
need a new `payload migrate:create` migration. Do not point production at a development database managed
by automatic schema push. The production first-user page returns 404 and anonymous user creation is rejected even on an empty database.
To provision the first administrator privately on startup, set CMS_BOOTSTRAP_EMAIL and
CMS_BOOTSTRAP_PASSWORD_FILE to a mounted secret file (minimum 16 characters), optionally CMS_BOOTSTRAP_NAME.
Remove this bootstrap configuration and file after provisioning. Existing accounts are never reset by startup.
Production requires a persistent PAYLOAD_SECRET of at least 32 characters. The reset link uses SITE_URL.
Do not reuse a development database managed by schema push in production.

Infrastructure preparation and backup/restore instructions live in Aegis-AI-Infra's
`docs/landing-cms.md` (sub-issue #69). Its overlay is opt-in until secrets, storage and a verified CMS image exist.

For work spanning repositories, use one parent issue and one linked sub-issue per repository.
Each repository PR closes its own sub-issue; close the parent after all sub-issues and shared acceptance criteria are fulfilled.

### Validation

```sh
npm run lint
npm run coverage
npm run test:cms
npm run build
pre-commit run --all-files
```

`test:cms` uses its own temporary database and removes it afterward. It verifies first-user setup,
permissions, draft privacy, publication, revision isolation and unpublishing. Generated Payload types,
migrations and framework adapter glue are excluded from unit coverage; real CMS behavior is checked
by the integration suite and the production build. Regenerate types and import maps after configuration
changes with `npm run cms:types` and `npm run cms:importmap`.

### Issue-driven delivery

Track landing work in the Aegis GitHub Project's current sprint. Start each change from an issue with acceptance criteria, use a dedicated branch, then open a PR targeting `main` with `Closes #<issue-number>`. Run the relevant tests, lint, build and pre-commit before pushing. Merge after successful required checks and review; use auto-merge when authorized. Do not mark local-only changes as delivered until the PR is merged.

Current tracking: #8 editorial CMS/blog, #9 minimal media explorer, #10 journal visual validation, #11 production readiness. Existing #5 tracks landing sections including pricing.
