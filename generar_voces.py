#!/usr/bin/env python3
"""Genera cumples_voz.json: la linea de voz de cumpleaños de cada Trekker (archivo de audio JP/CN + texto + traduccion al ingles),
leida de la subpagina de audio de cada personaje en la wiki (plantilla AudioRow, fila "Trekker birthday").
Los nombres de los personajes salen de presets.json. Si una pagina no se encuentra, se omite (la app usa el nombre de archivo estandar sin subtitulo)."""
import json, re, urllib.request, urllib.parse, time
RAW = "https://stellasora.miraheze.org/w/index.php?action=raw&title="
SUF = ["/Audio", "/Voice", "/Voicelines", "/Voice_Lines", "/Quotes", "/Voice_lines"]

def raw(t):
    try:
        req = urllib.request.Request(RAW + urllib.parse.quote(t), headers={"User-Agent": "StellaSoraVita-fanapp/1.0"})
        return urllib.request.urlopen(req, timeout=30).read().decode("utf-8")
    except Exception:
        return ""

def fila(txt, titulo):
    for m in re.finditer(r"\{\{AudioRow\|(.*?)\}\}\s*(?=\{\{|\n|$)", txt, re.S):
        s = m.group(1)
        parts = re.split(r"\|(?=\w+=)", s)
        d = {}
        for p in parts:
            k, _, v = p.partition("=")
            d[k.strip()] = v.strip()
        if d.get("title", "").lower() == titulo.lower():
            return d
    return None

def limpia(t): return re.sub(r"<br\s*/?>", "\n", t or "").strip()

def main():
    P = json.load(open("presets.json", encoding="utf-8"))
    try: prev = json.load(open("cumples_voz.json", encoding="utf-8"))
    except Exception: prev = {}
    out = {}
    for p in P.values():
        n = p["n"]; base = n.replace(" ", "_")
        for s in SUF:
            txt = raw(base + s)
            if "AudioRow" not in txt: continue
            d = fila(txt, "Trekker birthday")
            if d and d.get("file_jp"):
                out[n] = {"f": d.get("file_jp"), "fc": d.get("file_cn", ""), "tj": limpia(d.get("text_jp")), "tc": limpia(d.get("text_cn")), "en": limpia(d.get("trans_en"))}
                o = prev.get(n) or {}
                if o.get("es") and o.get("en") == out[n]["en"]: out[n]["es"] = o["es"]   # conserva la traduccion al espanol ya hecha
                break
        else:
            print("Sin pagina de audio:", n)
        time.sleep(0.4)
    json.dump(out, open("cumples_voz.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print("Voces de cumpleaños:", len(out))

if __name__ == "__main__": main()
