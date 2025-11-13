const DOCUSAURUS_PREFIX_RE = /^\/(docs|press|qrcode|search|img|css|js)(\/.*)?$/;
const ORIGIN_HOST = "wechaty.github.io";
const MAX_REDIRECTS = 5;

export default {
  async fetch(request, env, ctx) {
    // Wrangler dev sometimes calls fetch with undefined request
    if (!request || !request.url) {
      return new Response("Warmup OK", { status: 200 });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // ---- Rule 1: Docusaurus ----
    if (DOCUSAURUS_PREFIX_RE.test(path)) {
      return fetchWithRedirects(makeUpstream(request, `/docusaurus${path}`), request);
    }

    // ---- Rule 2: Jekyll → fallback ----
    const jekyllUrl = makeUpstream(request, `/jekyll${path}`);
    const jekyllRes = await fetchWithRedirects(jekyllUrl, request);

    if (jekyllRes.status !== 404) {
      return jekyllRes;
    }

    // ---- Fallback ----
    return fetchWithRedirects(makeUpstream(request, `/docusaurus${path}`), request);
  }
};

function makeUpstream(request, pathname) {
  const u = new URL(request.url);
  u.hostname = ORIGIN_HOST;
  u.pathname = pathname;
  return u;
}

async function fetchWithRedirects(url, request, maxRedirects = MAX_REDIRECTS) {
  let current = new URL(url);
  let count = 0;

  while (true) {
    const res = await fetch(current.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "manual"
    });

    if (![301, 302, 303, 307, 308].includes(res.status)) {
      return res;
    }

    const loc = res.headers.get("Location") || res.headers.get("location");
    if (!loc) return res;
    if (count >= maxRedirects) return new Response("Too many redirects", { status: 508 });

    const next = new URL(loc, current);
    next.hostname = ORIGIN_HOST;
    current = next;
    count++;
  }
}