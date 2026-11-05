# Detecta personajes, discos, banners y builds NUEVOS comparando con lo que ya se anuncio,
# y los guarda en novedades.json (lo muestra la app en su centro de novedades).
# Se ejecuta despues de generar_auto.py y generar_builds.py. No usa servicios externos ni cuesta nada.
import json, os, time

MAX_ITEMS = 60
ROLE = {"Vanguard": "Vanguardia", "Support": "Apoyo", "Versatile": "Versátil"}
IMG = (".png", ".jpg", ".jpeg", ".webp", ".gif")

def cargar(ruta, defecto):
    try:
        return json.load(open(ruta, encoding="utf-8"))
    except Exception:
        return defecto

def ahora():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

def candidatos():
    """Todo lo que existe hoy, como {clave: item}."""
    auto, builds = cargar("auto.json", {}), cargar("builds.json", {})
    out = {}
    for p in auto.get("personajes", []):
        n = p.get("name")
        if not n: continue
        det = " · ".join(x for x in ["%s★" % p.get("rarity") if p.get("rarity") else "", p.get("element"), ROLE.get(p.get("role"), p.get("role"))] if x)
        out["c:" + n] = {"tipo": "personaje", "titulo": "Nuevo personaje: " + n, "texto": det, "img": p.get("imageUrl"), "ref": n}
    for d in auto.get("discos", []):
        n = d.get("name")
        if not n: continue
        det = " · ".join(x for x in ["%s★" % d.get("rarity") if d.get("rarity") else "", d.get("element")] if x)
        out["d:" + n] = {"tipo": "disco", "titulo": "Nuevo disco: " + n, "texto": det, "img": d.get("imageUrl"), "ref": n}
    for b in auto.get("banners", []):
        if not b.get("id") or not b.get("name"): continue
        out["b:%s" % b["id"]] = {"tipo": "banner", "titulo": "Nuevo banner: " + b["name"],
            "texto": b.get("kind") or "", "img": b.get("img"), "ref": "banners", "fecha": b.get("start"), "fin": b.get("end")}
    for it in builds.get("items", []):
        img = it.get("cover")
        for v in (it.get("props") or {}).values():
            for x in (v if isinstance(v, list) else [v]):
                if isinstance(x, str) and x.lower().split("?")[0].endswith(IMG): img = x; break
            else: continue
            break
        out["x:" + it["id"]] = {"tipo": "build", "titulo": "Nueva build: " + (it.get("title") or "").strip(),
            "texto": "", "img": img, "ref": it["id"], "fecha": it.get("edited")}
    return out

def main():
    cur = candidatos()
    if not cur:
        print("Sin datos de auto.json ni builds.json: no se cambia novedades.json."); return
    prev = cargar("novedades.json", None)
    t = ahora()
    if prev is None:
        # Primera vez: no se anuncia todo el catalogo. Se dejan los banners activos y las 3 builds mas recientes.
        conocidos = set(cur)
        items = []
        for k, v in cur.items():
            if v["tipo"] == "banner" and (v.get("fecha") or "") <= t <= (v.get("fin") or "9999"): items.append((k, v))
        bs = sorted((kv for kv in cur.items() if kv[1]["tipo"] == "build"), key=lambda kv: kv[1].get("fecha") or "", reverse=True)[:3]
        items += bs
        items = [dict(v, id=k, fecha=v.get("fecha") or t) for k, v in items]
    else:
        conocidos = set(prev.get("conocidos", []))
        nuevos = [(k, v) for k, v in cur.items() if k not in conocidos]
        items = [dict(v, id=k, fecha=t) for k, v in nuevos] + prev.get("items", [])
        conocidos |= set(cur)
        if not nuevos:
            print("Sin novedades."); return
    for v in items: v.pop("fin", None)
    items.sort(key=lambda v: v.get("fecha") or "", reverse=True)
    items = items[:MAX_ITEMS]
    json.dump({"generado": t, "conocidos": sorted(conocidos), "items": items}, open("novedades.json", "w", encoding="utf-8"), ensure_ascii=False)
    print("novedades.json: %d items (%d nuevos)." % (len(items), 0 if prev is None else len(nuevos)))

if __name__ == "__main__":
    main()
