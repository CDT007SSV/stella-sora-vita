// Cloudflare Worker: guarda las suscripciones push (en KV "SUBS") y las entrega solo a GitHub Actions.
// Variables: ADMIN_TOKEN (secreto, el mismo que el secreto PUSH_ADMIN de GitHub). Enlace KV: SUBS.
const OK = ["https://cdt007ssv.github.io", "http://localhost:8765"];
const cors = o => ({ "Access-Control-Allow-Origin": OK.includes(o) ? o : OK[0], "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Vary": "Origin" });
const json = (d, s, o) => new Response(JSON.stringify(d), { status: s || 200, headers: { "Content-Type": "application/json", ...cors(o) } });
async function hid(s) { const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, "0")).join(""); }
function admin(req, env) { const a = req.headers.get("Authorization") || ""; return !!env.ADMIN_TOKEN && a === "Bearer " + env.ADMIN_TOKEN; }
export default {
  async fetch(req, env) {
    const o = req.headers.get("Origin") || "", u = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(o) });
    try {
      if (u.pathname === "/sub" && req.method === "POST") {
        if (!OK.includes(o)) return json({ error: "origen" }, 403, o);
        const s = await req.json();
        if (!s || typeof s.endpoint !== "string" || !/^https:\/\//.test(s.endpoint) || s.endpoint.length > 600 || !s.keys || typeof s.keys.p256dh !== "string" || typeof s.keys.auth !== "string") return json({ error: "datos" }, 400, o);
        await env.SUBS.put(await hid(s.endpoint), JSON.stringify({ endpoint: s.endpoint, keys: { p256dh: s.keys.p256dh, auth: s.keys.auth } }));
        return json({ ok: 1 }, 200, o);
      }
      if (u.pathname === "/unsub" && req.method === "POST") {
        const s = await req.json();
        if (s && typeof s.endpoint === "string") await env.SUBS.delete(await hid(s.endpoint));
        return json({ ok: 1 }, 200, o);
      }
      if (u.pathname === "/list" && req.method === "GET") {
        if (!admin(req, env)) return json({ error: "no" }, 401, o);
        const out = []; let cursor;
        do { const r = await env.SUBS.list({ cursor }); for (const k of r.keys) { const v = await env.SUBS.get(k.name); if (v) out.push(JSON.parse(v)); } cursor = r.list_complete ? null : r.cursor; } while (cursor);
        return json(out, 200, o);
      }
      if (u.pathname === "/gone" && req.method === "POST") {
        if (!admin(req, env)) return json({ error: "no" }, 401, o);
        const b = await req.json();
        for (const e of (b.endpoints || [])) await env.SUBS.delete(await hid(e));
        return json({ ok: 1 }, 200, o);
      }
      return json({ ok: 1, servicio: "ssv-push" }, 200, o);
    } catch (e) { return json({ error: "fallo" }, 500, o); }
  }
};
