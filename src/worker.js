/**
 * Wechaty.js.org Reverse Proxy Worker
 * ------------------------------------
 * Replaces the old Nginx transparent proxy.
 * Features:
 *   - Multi-backend routing (Jekyll + Docusaurus)
 *   - Internal redirect following (301/302/303/307/308)
 *   - Edge caching with stale-while-revalidate
 *   - GitHub Pages origin
 */

const DOCUSAURUS_PREFIX_RE = /^\/(docs|press|qrcode|search|img|css|js)(\/.*)?$/
const ORIGIN_HOST = "wechaty.github.io"

// Cache TTLs
const CACHE_TTL_SECONDS = 600            // 10 minutes
const CACHE_STALE_SECONDS = 60           // 1 minute stale-while-revalidate
const MAX_REDIRECTS = 5

export default {
  async fetch(request, env, ctx) {
    // Check cache first
    const cache = caches.default
    let cached = await cache.match(request)
    if (cached) {
      return cached
    }

    const url = new URL(request.url)
    const path = url.pathname

    let response

    // --- RULE 1: Docusaurus prefixes ---
    if (DOCUSAURUS_PREFIX_RE.test(path)) {
      const upstreamPath = `/docusaurus${path}`
      response = await fetchFromUpstream(upstreamPath, request)

    // --- RULE 2: Default: Try Jekyll first, fallback to Docusaurus ---
    } else {
      const jekyllPath = `/jekyll${path}`
      let jekyllRes = await fetchFromUpstream(jekyllPath, request)

      if (jekyllRes.status === 404) {
        const docusaurusPath = `/docusaurus${path}`
        response = await fetchFromUpstream(docusaurusPath, request)
      } else {
        response = jekyllRes
      }
    }

    // --- Add cache-control headers ---
    const headers = new Headers(response.headers)
    headers.set(
      "Cache-Control",
      `public, max-age=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_STALE_SECONDS}`
    )
    headers.set("X-Cache", "MISS")
    headers.set("X-Proxy-By", "wechaty.js.org-cloudflare-worker")

    const finalRes = new Response(response.body, {
      status: response.status,
      headers,
    })

    // Save to CF edge cache
    ctx.waitUntil(cache.put(request, finalRes.clone()))

    return finalRes
  },
}

/**
 * Fetch from GitHub Pages with redirect-following
 */
async function fetchFromUpstream(pathname, request) {
  const original = new URL(request.url)
  const upstreamUrl = new URL(request.url)

  upstreamUrl.hostname = ORIGIN_HOST
  upstreamUrl.pathname = pathname

  return fetchWithRedirects(upstreamUrl, request, MAX_REDIRECTS)
}

/**
 * Internal redirect loop — matches nginx @handle_redirects
 */
async function fetchWithRedirects(url, request, maxRedirects) {
  let current = new URL(url)
  let count = 0

  while (true) {
    const res = await fetch(current.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "manual",
    })

    const status = res.status
    if (![301, 302, 303, 307, 308].includes(status)) {
      return res
    }

    const loc =
      res.headers.get("Location") || res.headers.get("location")

    if (!loc) return res
    if (count >= maxRedirects) {
      return new Response("Too many redirects", { status: 508 })
    }

    const next = new URL(loc, current)
    next.hostname = ORIGIN_HOST

    current = next
    count++
  }
}