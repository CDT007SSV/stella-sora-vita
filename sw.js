// Service worker: guarda la app para abrirla sin conexión y siempre busca primero la versión nueva.
// Si cambias la lista SHELL, sube también el número de CACHE.
const CACHE = "stella-sora-wiki-v17";
const SHELL = ["./", "index.html", "data.js", "traducciones.js", "historias.js", "lector.js", "cambios.js", "fichas.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== location.origin) return;   // imágenes y modelos de otros sitios: sin tocar
  e.respondWith(
    fetch(req, { cache: "no-cache" })                          // 1º: versión nueva
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then(m => m || caches.match("index.html")))  // sin internet: copia guardada
  );
});
