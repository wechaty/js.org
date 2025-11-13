<div align="center">
<a href="https://wechaty.js.org">
  <img src="https://github.com/wechaty/wechaty.js.org/blob/main/docs/images/wechaty-website.png" alt="wechaty official website" height ="auto" width="800" />
</a>
<br />
<h1>Wechaty Organization Website</h1>
<p>
Repository for the Wechaty Organization Website, a resource for the Wechaty Organization. It is the official Wechaty website for publishing latest news, blog posts, contributor profiles, and documentation from our open source community.
</p>
<p align="center">
<a href="https://github.com/wechaty/js.org" alt="GitHub contributors">
<img src="https://img.shields.io/github/contributors/wechaty/js.org.svg" /></a>
<a href="https://github.com/wechaty/js.org" alt="GitHub issues by-label">
<img src="https://img.shields.io/github/issues/wechaty/js.org" /></a>
<a href="https://gitter.im/wechaty/wechaty" alt="Gitter">
<img src="https://img.shields.io/badge/Gitter-@layer5.svg?logo=slack" /></a>
</p>

[![Docusaurus](https://github.com/wechaty/docusaurus/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/wechaty/docusaurus/actions/workflows/gh-pages.yml)
[![Jekyll](https://github.com/wechaty/jekyll/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/wechaty/jekyll/actions/workflows/gh-pages.yml)

</div>

## 1. News, Blog, Contributor Profiles

[![Wechaty Jekyll](https://github.com/wechaty/jekyll/blob/main/docs/images/wechaty-jekyll.png)](https://github.com/wechaty/jekyll)

Goto Jekyll Repo: <https://github.com/wechaty/jekyll>

## 2. Documentation

[![Wechaty Docusaurus](https://github.com/wechaty/docusaurus/blob/main/docs/images/wechaty-docusaurus.png)](https://github.com/wechaty/docusaurus)

Goto Docusaurus Repo: <https://github.com/wechaty/docusaurus>


# 🌐 Wechaty.js.org — Cloudflare Worker Transparent Proxy

<p align="center">
<a href="https://github.com/cloudflare/workers">
  <img src="https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare" />
</a>
<a href="https://github.com/wechaty/wechaty.js.org/actions">
  <img src="https://img.shields.io/github/actions/workflow/status/wechaty/wechaty.js.org/deploy.yml?label=Deploy" />
</a>
<a href="https://github.com/wechaty/wechaty.js.org">
  <img src="https://img.shields.io/github/contributors/wechaty/wechaty.js.org?color=success" />
</a>
</p>

<h1>Wechaty Organization Website</h1>
<p>
This repository hosts the official Wechaty website proxy layer — now rebuilt entirely using **Cloudflare Workers**, replacing the legacy Nginx + Docker Compose setup.
</p>
</div>

This repository contains the **Cloudflare Worker implementation** of the official **Wechaty.js.org transparent proxy**, replacing the legacy Docker + Nginx setup.

The Worker routes traffic from **wechaty.js.org** to two different GitHub Pages sites — **Docusaurus** and **Jekyll** — while preserving original URLs and providing global edge caching.

🔥 Fast.
🔥 Serverless.
🔥 Globally distributed.
🔥 Zero-downtime.

---

# Wechaty.js.org — Cloudflare Pages Router (Simplified)

Unified entry point for the Wechaty website, powered by **Cloudflare Pages + Pages Functions**.

This setup merges two existing Wechaty web properties:

* **Jekyll** — News, blog, contributors → [https://github.com/wechaty/jekyll](https://github.com/wechaty/jekyll)
* **Docusaurus** — Documentation → [https://github.com/wechaty/docusaurus](https://github.com/wechaty/docusaurus)

Served together under:

👉 **[https://wechaty.js.org](https://wechaty.js.org)**

---

# 🧭 Architecture (Short)

```
Visitor → Cloudflare Pages → Pages Function Router
            ↓                     ↓
        Docusaurus <—— fallback —— Jekyll
```

* Paths starting with `/docs`, `/img`, `/css`, `/js`, etc. → **Docusaurus**
* Everything else → **Jekyll**, with `404` fallback to Docusaurus

---

# 📁 Minimal Folder Structure

```
your-project/
├── functions/
│   └── index.js
├── public/
├── CNAME
└── README.md
```

`CNAME` file:

```
wechaty.js.org
```

---

# 🔥 functions/index.js (Router)

```js
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const path = url.pathname;

  const docusaurusPrefixes = [
    '/docs', '/press', '/qrcode', '/search', '/img', '/css', '/js'
  ];

  if (docusaurusPrefixes.some(p => path.startsWith(p))) {
    return env.DOCUSAURUS.fetch(request);
  }

  const res = await env.JEKYLL.fetch(request);
  if (res.status !== 404) return res;

  return env.DOCUSAURUS.fetch(request);
}
```

---

# 🔧 Bind Backends

In Cloudflare Pages → **Settings → Functions → Service Bindings**:

```
DOCUSAURUS → https://wechaty.github.io/docusaurus
JEKYLL     → https://wechaty.github.io/jekyll
```

---

# 🌐 JS.ORG Setup (Required)

1. Add `CNAME` file with `wechaty.js.org`
2. Submit PR to JS.ORG: add `"wechaty": "wechaty.js.org"`
3. JS.ORG team adds DNS:

```
wechaty.js.org CNAME <your-project>.pages.dev
```

---

# 🔗 Add Domain to Cloudflare Pages (via API)

Dashboard cannot add JS.ORG domains — use API:

```bash
curl -X POST \
  https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/pages/projects/<PROJECT>/domains \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{"name":"wechaty.js.org"}'
```

Done! Pages now serves the entire Wechaty website.

---

# 👤 Author

**Huan Li (李卓桓)** — [https://github.com/huan](https://github.com/huan)
