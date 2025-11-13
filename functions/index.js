export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Prefixes that belong to Docusaurus
  const docusaurusPrefixes = [
    '/docs',
    '/press',
    '/qrcode',
    '/search',
    '/img',
    '/css',
    '/js'
  ];

  // If the path belongs to Docusaurus → send to DOCUSAURUS backend
  if (docusaurusPrefixes.some(prefix => path.startsWith(prefix))) {
    return env.DOCUSAURUS.fetch(request);
  }

  // Otherwise → try Jekyll first
  const jekyllResponse = await env.JEKYLL.fetch(request);

  // If Jekyll handled it, return immediately
  if (jekyllResponse.status !== 404) {
    return jekyllResponse;
  }

  // Otherwise fall back to Docusaurus
  return env.DOCUSAURUS.fetch(request);
}
