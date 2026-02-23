# 🌍 Aegis AI - Landing Site (Public Zone)

**Project ID:** AEGIS-CORE-2026

## 🏗️ System Architecture & Role
The **Aegis AI Landing** repository contains the code for the public organizational site hosted at `www.aegis.ai`. It handles global marketing, external documentation hosting (Docs as Code), and provides an interactive visual mockup demo.

* **Tech Stack:** Next.js (SSG - Static Site Generation) / Astro.
* **Role:** Conversion, trust reinforcement (compliance certifications presentation), and secure traffic funneling to the private portal.
* **Optimization:** Fully statically generated and served entirely from an Edge CDN (Vercel/Cloudflare) to guarantee extreme SEO ranking and split-second Response times.

## 🔐 Security & Dual-Interface Strategy
* **Zero Trust Boundary:** The Landing site forms part of our strategic "Attack Surface Reduction". As it executes entirely as static HTML/JS/CSS, it contains **Zero API Access** to the Kubernetes Core and holds **no read/write logic** to production databases. 
* **Protection:** In case of DDoS or web-defacement, the `app.aegis.ai` private environment stays physically unimpacted. 

## 🐳 Docker / CDN Deployment
Deployable natively to Edge providers, but containerized for platform-parity.

```bash
docker pull ghcr.io/aegis-ai/aegis-landing:latest

# Serving as a highly optimized static container
infisical run --env=prod -- docker run -d \
  --name aegis-landing \
  --read-only \
  --cap-drop=ALL \
  --security-opt no-new-privileges:true \
  --user 10001:10001 \
  -p 80:80 \
  -e INFISICAL_TOKEN=$INFISICAL_TOKEN \
  ghcr.io/aegis-ai/aegis-landing:latest
```
