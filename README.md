# 🌍 Aegis AI — Public Landing & Trust Center

**Project ID:** AEGIS-CORE-2026

> The **Aegis AI Landing Site** is the public face of the platform. Designed for extreme performance and SEO, it serves as the "Trust Center" where potential users can explore the platform's vision, compliance certifications, and technical documentation.

---

## 🏗️ Role in the Ecosystem

The Landing site is strategically isolated from the core infrastructure to minimize the platform's attack surface.

- **Marketing Hub**: High-conversion landing pages and interactive product demos.
- **Documentation Hosting**: Serves as the primary entry point for the **Docs-as-Code** platform.
- **Trust Center**: Transparently displays security posture, compliance (SOC2/ISO), and uptime.

```mermaid
graph TD
    Public([Public Traffic]) -- "HTTPS / CDN" --> Landing[Landing Site (Next.js)]
    Landing -- "Link" --> Dashboard[Private Portal (app.aegis.ai)]
    Landing -- "Static Content" --> Docs[Documentation Hub]
```

---

## 🛠️ Tech Stack

| Component  | Technology        | Version |
| ---------- | ----------------- | ------- |
| Framework  | **Next.js** (SSG) | 14.x    |
| Styling    | **Tailwind CSS**  | 3.x     |
| Animations | **Framer Motion** | 10.x    |
| Hosting    | **CDN Optimized** | —       |

---

## 🔐 Security & Surface Reduction

- **Static Generation (SSG)**: The site is fully pre-rendered at build time. It contains **zero** runtime connections to the Aegis production databases or Kubernetes core.
- **Domain Separation**: Hosted on `www.aegis.ai`, completely decoupled from the application domain (`app.aegis.ai`) to prevent cross-site scripting (XSS) and session leakage risks.
- **DDoS Resilience**: Leveraging global Edge networks to absorb high-intensity traffic without affecting the private dashboard.

---

## 🐳 Deployment (Docker)

```bash
docker pull ghcr.io/aegis-ai/aegis-landing:latest

# Serving as a highly optimized static container
docker run -d \
  --name aegis-landing \
  --read-only \
  -p 80:80 \
  ghcr.io/aegis-ai/aegis-landing:latest
```

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

_Aegis AI — Marketing & Trust Engineering — 2026_
