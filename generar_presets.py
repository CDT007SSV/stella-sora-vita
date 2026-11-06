#!/usr/bin/env python3
"""Genera presets.json: listas de potenciales por personaje en el orden que usa el codigo de preset del juego.
Formato del codigo (descifrado y comprobado con los presets del juego): 3 ids de personaje (uint32 BE: principal, apoyo 1, apoyo 2)
+ por cada uno 40 bits: 4 (nucleo elegido si/no) + 9x3 (niveles normales) + 3x3 (niveles comunes). Base64.
Uso: STELLA_REPO=/ruta/a/StellaSoraData python3 generar_presets.py   (sin STELLA_REPO clona el repo)"""
import json, os, subprocess, tempfile

def repo():
    r = os.environ.get("STELLA_REPO")
    if r: return r
    d = tempfile.mkdtemp()
    subprocess.run(["git", "clone", "--depth", "1", "-q", "https://github.com/Hiro420/StellaSoraData.git", d], check=True, timeout=900)
    return d

def J(p): return json.load(open(p, encoding="utf-8"))

def main():
    R = repo() + "/EN/"
    CP = J(R + "bin/CharPotential.json"); Ch = J(R + "bin/Character.json")
    LC = J(R + "language/en_US/Character.json"); LI = J(R + "language/en_US/Item.json")
    out = {}
    for i, d in CP.items():
        if i not in Ch: continue
        n = LC.get(Ch[i]["Name"])
        if not n or "Golem" in n: continue
        ids = {k: d[v] for k, v in (("ms", "MasterSpecificPotentialIds"), ("mn", "MasterNormalPotentialIds"), ("as", "AssistSpecificPotentialIds"), ("an", "AssistNormalPotentialIds"), ("cm", "CommonPotentialIds"))}
        nom = {str(p): LI.get("Item.%d.1" % p, "") for l in ids.values() for p in l}
        out[i] = dict(n=n, **ids, names=nom)
    json.dump(out, open("presets.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print("Personajes:", len(out))

if __name__ == "__main__": main()
