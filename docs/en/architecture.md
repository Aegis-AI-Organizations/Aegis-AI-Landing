# 🌍 Landing Page Architecture: Marketing & Trust Center

The **Aegis AI Landing Page** is the public face of the platform. Built with **Next.js** and optimized for **Static Site Generation (SSG)**, it serves as the "Trust Center" for the enterprise security market.

---

## 🏗️ Core Design Principles

The Landing Page is designed for **performance**, **surface reduction**, and **discoverability**:

1. **Strategic Isolation**: The site is completely decoupled from the application domain (`app.aegis.ai`), providing physical separation between public traffic and the private orchestrator core.
2. **Docs-as-Code Interface**: Serves as the primary public entry point for our technical documentation, pulling content dynamically from across the microservice ecosystem.
3. **Extreme Performance**: Using **Static Site Generation (SSG)** to ensure sub-second Time-To-Interactive (TTI) and maximum SEO ranking.

---

## 🔐 Security & Surface Reduction

Aegis implements a "Minimal Surface" strategy for all public-facing components:

- **Zero Database Reliance**: The Landing site contains **no** runtime connections to the Aegis production databases or Kubernetes core. All data is pre-fetched at build time.
- **Physical Domain Separation**: Hosted on `www.aegis.ai`, with no shared session state or cookies with the Dashboard.
- **DDoS Immunity**: Leveraging globally distributed CDN Edge nodes to absorb high-intensity traffic without impacting the private analyst portal.

---

## 🛰️ Technical Stack

| Component | Technology        | Version |
| --------- | ----------------- | ------- |
| Framework | **Next.js** (SSG) | 14.x    |
| Styling   | **Tailwind CSS**  | 3.x     |
| Animation | **Framer Motion** | 10.x    |
| Hosting   | **Edge CDN**      | —       |

---

## 🌊 Logic Flow: Entry Point

1. **Conversion**: High-fidelity marketing copy and interactive demos funnel traffic toward the private portal login.
2. **Documentation**: Transparently exposes the platform's security architecture via the `/docs` path.
3. **Compliance**: Dedicated sections for SOC2/ISO audit transparency and uptime reporting.

---

_Aegis AI Marketing & Trust Engineering — 2026_
