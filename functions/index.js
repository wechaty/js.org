export async function onRequest({ request, env }) {
  const url = new URL(request.url)
  const path = url.pathname

  const docusaurusPrefixes = [
    '/docs',
    '/press',
    '/qrcode',
    '/search',
    '/img',
    '/css',
    '/js'
  ]

  // → Route to Docusaurus
  if (docusaurusPrefixes.some(p => path.startsWith(p))) {
    return env.DOCUSAURUS.fetch(request)
  }

  // → Try Jekyll
  const jekyllRes = await env.JEKYLL.fetch(request)

  if (jekyllRes.status !== 404) {
    return jekyllRes
  }

  // → Fallback to Docusaurus
  return env.DOCUSAURUS.fetch(request)
}