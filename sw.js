// Service worker: guarda la app para abrirla sin conexión y siempre busca primero la versión nueva.
// Si cambias la lista SHELL, sube también el número de CACHE.
const CACHE = "stella-sora-wiki-v37";
const SHELL = ["./", "index.html", "data.js", "traducciones.js", "historias.js", "lector.js", "cambios.js", "fichas.js","discos.js","teams.js","cumples.js","comunidad-config.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE && !/^ssv-(img|mdl)-/.test(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Cache de imagenes y modelos 3D de otros sitios (la 1a vez baja, las siguientes salen del telefono al instante).
// Se sirve la copia guardada y en segundo plano se refresca. Limite de entradas para no llenar el telefono.
const IMG = "ssv-img-v1", MDL = "ssv-mdl-v1", MAX_IMG = 700, MAX_MDL = 14;
const esImg = u => u.hostname === "raw.githubusercontent.com" && /\.(webp|png|jpe?g|gif)$/i.test(u.pathname);
const esMdl = u => u.hostname === "cdn.jsdelivr.net" && /StellaSoraModels/.test(u.pathname);
async function recorta(c, max){ const k = await c.keys(); if(k.length > max) await Promise.all(k.slice(0, k.length - max).map(r => c.delete(r))); }
async function externo(e, nombre, max){
  const c = await caches.open(nombre), hit = await c.match(e.request.url);
  const red = fetch(e.request.url, { mode: "cors", credentials: "omit" }).then(res => {
    if(res.ok){ c.put(e.request.url, res.clone()).then(() => recorta(c, max)).catch(() => {}); }
    return res;
  });
  if(hit){ red.catch(() => {}); return hit; }     // copia guardada ya; se refresca en segundo plano
  return red.catch(() => Response.error());
}
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (u.origin !== location.origin) {                           // imagenes y modelos de otros sitios
    if (esImg(u)) e.respondWith(externo(e, IMG, MAX_IMG));
    else if (esMdl(u)) e.respondWith(externo(e, MDL, MAX_MDL));
    return;                                                     // el resto: sin tocar
  }
  e.respondWith(
    fetch(req, { cache: "no-cache" })                          // 1º: versión nueva
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then(m => m || caches.match("index.html")))  // sin internet: copia guardada
  );
});
