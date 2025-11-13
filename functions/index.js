export async function onRequest(context) {
  const request = context.request
  const url = new URL(request.url)
  const path = url.pathname

  const DOCUSAURUS_PREFIX_RE = /^\/(docs|press|qrcode|search|img|css|js)(\/.*)?$/
  const ORIGIN_HOST = "wechaty.github.io"
  const MAX_REDIRECTS = 5

  // Check cache
  const cache = caches.default
  let cached = await cache.match(request)
  if (cached) {
    return cached
  }

  // Routing rule
  let response
  if (DOCUSAURUS_PREFIX_RE.test(path)) {
    response = await fetchFromUpstream(`/docusaurus${path}`, request)
  } else {
    const jekyllRes = await fetchFromUpstream(`/jekyll${path}`, request)
    response =
      jekyllRes.status === 404
        ? await fetchFromUpstream(`/docusaurus${path}`, request)
        : jekyllRes
  }

  // Add cache headers
  const headers = new Headers(response.headers)
  headers.set(
    "Cache-Control",
    "public, max-age=600, stale-while-revalidate=60"
  )
  headers.set("X-Cache", "MISS")

  const finalRes = new Response(response.body, {
    status: response.status,
    headers,
  })

  context.waitUntil(cache.put(request, finalRes.clone()))
  return finalRes
}

async function fetchFromUpstream(pathname, request) {
  const upstreamUrl = new URL(request.url)
  upstreamUrl.hostname = "wechaty.github.io"
  upstreamUrl.pathname = pathname
  return fetchWithRedirects(upstreamUrl, request, 5)
}

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

    if (![301, 302, 303, 307, 308].includes(res.status)) {
      return res
    }

    const loc = res.headers.get("Location") || res.headers.get("location")
    if (!loc) return res

    if (count >= maxRedirects) {
      return new Response("Too many redirects", { status: 508 })
    }

    const next = new URL(loc, current)
    next.hostname = "wechaty.github.io"

    current = next
    count++
  }
}