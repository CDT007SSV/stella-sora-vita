import json, os, re, sys, time, glob, shutil, subprocess, tempfile, urllib.request, urllib.parse, collections
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

RAW = "https://raw.githubusercontent.com/Hiro420/StellaSoraData/main/EN/"
UA = {"User-Agent": "StellaSoraWikiES-fanapp/1.0 (https://github.com/EveCDT00/stella-sora-wiki-es)"}
WIKI = "https://stellasora.miraheze.org/wiki/"
FILE = WIKI + "Special:FilePath/"
DIAS_ADELANTE = 3   # banners que empiezan en los proximos N dias (no adelantamos filtraciones)
DIAS_ATRAS = 14     # banners terminados hace menos de N dias

# Copia local del repositorio (mucho mas rapido y permite buscar todas las carpetas de idiomas)
REPO = os.environ.get("STELLA_REPO")
if not REPO:
    try:
        _d = tempfile.mkdtemp()
        subprocess.run(["git", "clone", "--depth", "1", "-q", "https://github.com/Hiro420/StellaSoraData.git", _d],
                       check=True, timeout=600)
        REPO = _d
        print("Repositorio clonado.")
    except Exception as e:
        print("No se pudo clonar (se usara descarga directa):", e)
        REPO = None

def jget(path):
    if REPO:
        f = os.path.join(REPO, "EN", path)
        if os.path.exists(f):
            return json.load(open(f, encoding="utf-8"))
    for intento in range(3):
        try:
            req = urllib.request.Request(RAW + path, headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:
            print("   reintento", path, e)
            time.sleep(2)
    print("ERROR: no se pudo leer", path)
    sys.exit(1)

def jopt(path):
    """Como jget pero devuelve {} si la tabla no existe (no rompe el resto)."""
    try:
        if REPO:
            f = os.path.join(REPO, "EN", path)
            return json.load(open(f, encoding="utf-8")) if os.path.exists(f) else {}
        req = urllib.request.Request(RAW + path, headers=UA)
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception:
        return {}

def jidioma(carpeta, locales, archivo):
    """Busca language/<locale>/<archivo> en la carpeta de un idioma (JP, KR, CN...) del clon."""
    if not REPO:
        return {}
    for loc in locales:
        f = os.path.join(REPO, carpeta, "language", loc, archivo)
        if os.path.exists(f):
            return json.load(open(f, encoding="utf-8"))
    for f in sorted(glob.glob(os.path.join(REPO, carpeta, "language", "*", archivo))):
        return json.load(open(f, encoding="utf-8"))
    return {}

def q(nombre):
    return urllib.parse.quote(nombre.replace(" ", "_"), safe="_")

src = open("data.js", encoding="utf-8").read()
def arr(n):
    m = re.search(r"const " + n + r" = (\[.*?\]);\n", src, re.S)
    return json.loads(m.group(1)) if m else []
OLDD = arr("DISCS")

NIVEL_MAX = 90          # los valores de la app son los del nivel 90 (verificado con 10 personajes)
ELEM = {1: "Aqua", 2: "Ignis", 3: "Terra", 4: "Ventus", 5: "Lux", 6: "Umbra"}
ROLE = {1: "Vanguard", 2: "Versatile", 3: "Support"}
RAR = {1: 5, 2: 4}

# ---------- estadisticas (tabla Attribute: filas por grupo y nivel) ----------
attr = jget("bin/Attribute.json")
por_grupo = collections.defaultdict(list)
for v in attr.values():
    por_grupo[v.get("GroupId")].append(v)

def fila_max(grupo):
    filas = por_grupo.get(grupo) or []
    if not filas:
        return None
    nivel = NIVEL_MAX if any(f.get("lvl") == NIVEL_MAX for f in filas) else max(f.get("lvl", 0) for f in filas)
    return max((f for f in filas if f.get("lvl") == nivel), key=lambda f: f.get("Hp", 0))

def a_entero(x):
    try:
        return int(x)
    except Exception:
        return None

# ---------- personajes ----------
chars = jget("bin/Character.json")
Lc = jget("language/en_US/Character.json")
personajes = []
for k, c in chars.items():
    if not (c.get("Visible") and c.get("Available")):
        continue
    nombre = Lc.get(c.get("Name"))
    el, ro, ra = ELEM.get(c.get("EET")), ROLE.get(c.get("Class")), RAR.get(c.get("Grade"))
    if not (nombre and el and ro and ra):
        print("   omitido (datos incompletos):", k, nombre)
        continue
    ficha = {"cid": int(k), "name": nombre, "rarity": ra, "element": el, "role": ro,
             "wikiUrl": WIKI + q(nombre), "imageUrl": FILE + q(nombre) + ".png"}
    fm = fila_max(a_entero(c.get("AttributeId")))
    if fm and fm.get("Hp", 0) > 0 and fm.get("Atk", 0) > 0:
        ficha["hp"], ficha["atk"] = fm["Hp"], fm["Atk"]
    personajes.append(ficha)
personajes.sort(key=lambda p: -p["cid"])
print("Personajes:", len(personajes), "| con estadisticas:", sum(1 for p in personajes if "hp" in p))
# comprobacion: los valores calculados deben coincidir con los que ya estaban en data.js
_viejos = {c["name"]: c for c in arr("CHARS")}
_ok, _mal = 0, []
for p in personajes:
    o = _viejos.get(p["name"])
    h = a_entero(re.sub(r"\D", "", str((o or {}).get("hp") or "")))
    a = a_entero(re.sub(r"\D", "", str((o or {}).get("atk") or "")))
    if h and a and "hp" in p:
        if (h, a) == (p["hp"], p["atk"]):
            _ok += 1
        else:
            _mal.append((p["name"], (h, a), (p["hp"], p["atk"])))
print("Estadisticas que coinciden con data.js:", _ok, "| distintas:", _mal)

# ---------- ficha completa (tablas CharacterDes / CharacterTag / CharacterArchiveBaseInfo) ----------
des = jopt("bin/CharacterDes.json")
tag = jopt("bin/CharacterTag.json")
base_info = jopt("bin/CharacterArchiveBaseInfo.json")
EN_DES = jopt("language/en_US/CharacterDes.json")
EN_TAG = jopt("language/en_US/CharacterTag.json")
EN_INFO = jopt("language/en_US/CharacterArchiveBaseInfo.json")
EN_FORCE = jopt("language/en_US/Force.json")
JP_CH, KR_CH, CN_CH = (jidioma(c, [l], "Character.json") for c, l in (("JP", "ja_JP"), ("KR", "ko_KR"), ("CN", "zh_CN")))
JP_DES, KR_DES, CN_DES = (jidioma(c, [l], "CharacterDes.json") for c, l in (("JP", "ja_JP"), ("KR", "ko_KR"), ("CN", "zh_CN")))
print("Tablas de ficha: Des", len(des), "Tag", len(tag), "BaseInfo", len(base_info), "| idiomas JP/KR/CN:",
      len(JP_CH), len(KR_CH), len(CN_CH))
for _n, _t in (("CharacterDes", des), ("CharacterTag", tag), ("CharacterArchiveBaseInfo", base_info)):
    for _k, _v in list(_t.items())[:1]:
        print("   ejemplo", _n, _k, "->", json.dumps(_v, ensure_ascii=False)[:300])

def buscar(clave, *dicts):
    if not clave:
        return None
    for d in dicts:
        v = d.get(clave) if isinstance(d, dict) else None
        if v:
            return v
    return None

def texto(clave):
    """Clave de idioma -> texto en ingles (o la propia cadena si no es una clave)."""
    t = buscar(clave, EN_DES, EN_INFO, EN_TAG, EN_FORCE)
    return t if t else (clave if isinstance(clave, str) and " " in clave else None)

def limpia(t):
    if not isinstance(t, str):
        return t
    t = re.sub(r"<[^>]+>", "", t).replace("\\n", "\n").replace("\r", "")
    return re.sub(r"[ \t]+\n", "\n", t).strip()

def ids_fila(v):
    for k in ("CharId", "CharacterId", "CharID", "Char"):
        if k in v:
            return str(v[k])
    return None

info_por_char = collections.defaultdict(list)
for k, v in base_info.items():
    cid = ids_fila(v)
    if cid is None:
        cid = str(k).split("_")[0]
    info_por_char[cid].append((v.get("Sort", v.get("Id", 0)) if isinstance(v.get("Sort", v.get("Id", 0)), (int, float)) else 0, k, v))

ATAQUE = {1: "Melee", 2: "Ranged"}

def ficha_extra(cid, c):
    ex = {}
    d = des.get(str(cid)) or {}
    # estilo (etiquetas de tipo 2) y rol de ataque
    estilos = []
    for tid in (d.get("Tag") or []):
        t = tag.get(str(tid)) or {}
        if t.get("TagType") == 2:
            nombre = texto(t.get("Title")) or EN_TAG.get(t.get("Title"))
            if nombre:
                estilos.append(limpia(nombre))
    if estilos:
        ex["style"] = estilos[0]
    f = texto("Force.%s.1" % d.get("Force")) if d.get("Force") is not None else None
    if f:
        ex["faction"] = limpia(f)
    # tipo de ataque: por etiqueta ("Melee"/"Ranged") o por un campo numerico de Character
    todas = [limpia(texto(tag.get(str(t), {}).get("Title")) or "") for t in (d.get("Tag") or [])]
    ex["_tags"] = todas
    for t in todas:
        if t.lower() in ("melee", "ranged"):
            ex["attack"] = t.capitalize()
    if "attack" not in ex and ATAQUE.get(c.get("CharacterAttackType")):
        ex["attack"] = ATAQUE[c["CharacterAttackType"]]
    if "attack" not in ex:
        for kk, vv in c.items():
            if "attack" in kk.lower() and "type" in kk.lower() and ATAQUE.get(vv):
                ex["attack"] = ATAQUE[vv]
    nombres = {}
    for cod, tabla in (("jp", JP_CH), ("kr", KR_CH), ("cn", CN_CH)):
        n = tabla.get(c.get("Name"))
        if n:
            nombres[cod] = n
    if nombres:
        ex["names"] = nombres
    va = {}
    jp = buscar(d.get("JpCv"), JP_DES, EN_DES, KR_DES, CN_DES)
    cn = buscar(d.get("CnCv"), CN_DES, EN_DES, JP_DES, KR_DES)
    if jp:
        va["jp"] = limpia(jp)
    if cn:
        va["cn"] = limpia(cn)
    if va:
        ex["va"] = va
    perfil = limpia(buscar(d.get("CharDes"), EN_DES))
    if perfil:
        ex["profile"] = perfil
    filas, cumple = [], None
    for _, k, v in sorted(info_por_char.get(str(cid), []), key=lambda x: (x[0], str(x[1]))):
        et = limpia(texto(v.get("Title")) or "")
        co = limpia(texto(v.get("Content")) or "")
        up = limpia(texto(v.get("UpdateContent1")) or "")
        if not et or et.lower() == "name":
            continue
        if et.lower() == "birthday":
            cumple = co or up
            continue
        if up and up != co:
            co = up if (not co or "█" in co) else co + " / " + up
        if co:
            filas.append({"k": et, "v": co})
    if not cumple and d.get("Birthday"):
        cumple = str(d["Birthday"])
    if cumple:
        ex["birthday"] = cumple
    if filas:
        ex["info"] = filas
    return ex

for p in personajes:
    p.update(ficha_extra(p["cid"], chars.get(str(p["cid"])) or {}))
for _n in ("Allie", "Amber"):
    for p in personajes:
        if p["name"] == _n:
            print("DIAG", _n, "etiquetas:", p.get("_tags"), "| fila Character:", json.dumps(chars.get(str(p["cid"])), ensure_ascii=False)[:700])
for p in personajes:
    p.pop("_tags", None)
_con = lambda k: sum(1 for p in personajes if p.get(k))
print("Ficha -> estilo", _con("style"), "| faccion", _con("faction"), "| ataque", _con("attack"), "| nombres", _con("names"),
      "| VA", _con("va"), "| perfil", _con("profile"), "| cumple", _con("birthday"), "| info", _con("info"), "de", len(personajes))
_ok = {"style": 0, "faction": 0}; _dif = []
for p in personajes:
    o = _viejos.get(p["name"]) or {}
    for k in _ok:
        if p.get(k) and o.get(k):
            if p[k].lower() == str(o[k]).lower():
                _ok[k] += 1
            else:
                _dif.append((p["name"], k, o[k], p[k]))
print("Coinciden con data.js:", _ok, "| distintos:", _dif[:12])
print("Rol de ataque por personaje:", [(p["name"], p.get("attack")) for p in personajes[:50]])
for p in personajes:
    if p["name"] in ("Allie", "Amber"):
        print("MUESTRA", p["name"], json.dumps({k: v for k, v in p.items() if k not in ("wikiUrl", "imageUrl")}, ensure_ascii=False)[:1800])

# ---------- habilidades y potenciales (Skill / Potential / HitDamage / EffectValue / BuffValue) ----------
SK_BIN, PO_BIN = jopt("bin/Skill.json"), jopt("bin/Potential.json")
CHPOT = jopt("bin/CharPotential.json")
HITD, EFV, BUFV, SPV = (jopt("bin/%s.json" % n) for n in ("HitDamage", "EffectValue", "BuffValue", "ScriptParameterValue"))
EFD = jopt("bin/EffectDesc.json")
EN_SK, EN_PO, EN_EFD = (jopt("language/en_US/%s.json" % n) for n in ("Skill", "Potential", "EffectDesc"))
NIVEL_HAB = 10   # los valores mostrados son los del nivel 10 de habilidad (verificado con Amber: 106% x2 + 7.6% x4)
print("Tablas de habilidades: Skill", len(SK_BIN), "Potential", len(PO_BIN), "HitDamage", len(HITD), "EffectValue", len(EFV))

def _num(x):
    s = ("%.2f" % x).rstrip("0").rstrip(".")
    return s

def _atributo(sub):
    d = EFD.get(str(120000 + int(sub) * 10 + 1)) or {}
    return EN_EFD.get(d.get("Desc"))

def resolver_param(spec, estado):
    """'HitDamage,DamageNum,123' -> '106%' etc. Devuelve None si no se sabe resolver."""
    try:
        p = spec.split(",")
        t, ident = p[0], p[2]
        if t == "HitDamage":
            lst = (HITD.get(ident) or {}).get("SkillPercentAmend") or []
            if not lst:
                return None
            return _num(lst[min(NIVEL_HAB - 1, len(lst) - 1)] / 10000) + "%"
        if t == "Skill" and len(p) > 4 and p[3] == "Title":
            return EN_SK.get("Skill.%s.1" % ident)
        if p[1] == "LevelUp" and t in ("Effect", "Buff", "BuffValue") and ident not in (EFV if t == "Effect" else BUFV):
            ident = str(int(ident) + 10 * estado.get("lvl", 1))   # filas por nivel: id base + 10 x nivel
        if t == "Buff":
            t = "BuffValue"
        if t == "BuffValue":
            fila = BUFV.get(ident) or {}
            if p[3] == "Time":
                return _num(fila["Time"] / 10000) if "Time" in fila else None
            if p[3] in fila:
                return _num(fila[p[3]])
        if t in ("EffectValue", "Effect"):
            fila = EFV.get(ident) or {}
            if not fila:
                return None
            if p[3] == "EffectTypeFirstSubtype":
                return _atributo(fila["EffectTypeFirstSubtype"]) if fila.get("EffectType") == 12 else None
            if p[3] == "EffectTypeParam1":
                v = float(fila["EffectTypeParam1"])
                return _num(v * 100) + "%" if len(p) > 4 and p[4] == "HdPct" else _num(v)
        if t == "ScriptParameterValue":
            fila = SPV.get(ident) or {}
            if p[3] in fila:
                return _num(fila[p[3]] / 10000) if len(p) > 4 and p[4] == "10K" else _num(fila[p[3]])
    except Exception:
        pass
    return None

def texto_hab(clave, fila, estado):
    t = EN_SK.get(clave) if clave in EN_SK else EN_PO.get(clave)
    if not t:
        return None
    t = t.replace("\x0b", "\n").replace("\\n", "\n")
    t = re.sub(r"</?color[^>]*>", "", t)
    t = re.sub(r"##([^#]+)#\d+#", r"\1", t)
    def sust(m):
        spec = fila.get("Param" + m.group(1))
        v = resolver_param(spec, estado) if spec else None
        if v is None:
            estado["sin_resolver"] += 1
            return "…"
        return v
    t = re.sub(r"&Param(\d+)&", sust, t)
    return re.sub(r"[ \t]+", " ", t).strip()

TIPO_HAB = [("NormalAtkId", "Ataque normal"), ("SkillId", "Habilidad principal"), ("AssistSkillId", "Habilidad de apoyo"),
            ("UltimateId", "Definitiva")]
GRUPO_POT = [("MasterSpecificPotentialIds", "Principal"), ("AssistSpecificPotentialIds", "Apoyo"), ("CommonPotentialIds", "Común")]
_stat = {"hab": 0, "pot": 0, "sin": 0, "tot": 0}

def habilidades_de(cid, c):
    estado = {"sin_resolver": 0}
    habs, pots = [], []
    for campo, etiqueta in TIPO_HAB:
        sid = c.get(campo)
        s = SK_BIN.get(str(sid)) if sid else None
        if not s:
            continue
        nombre = EN_SK.get(s.get("Title"))
        desc = texto_hab(s.get("Desc"), s, estado) or texto_hab(s.get("BriefDesc"), s, estado)
        if not (nombre and desc):
            continue
        h = {"t": etiqueta, "n": nombre, "d": desc}
        if s.get("SkillCD"):
            h["cd"] = _num(s["SkillCD"] / 10000)
        habs.append(h)
    for campo, etiqueta in GRUPO_POT:
        for pid in ((CHPOT.get(str(cid)) or {}).get(campo) or []):
            po = PO_BIN.get(str(pid))
            if not po:
                continue
            estado["lvl"] = po.get("MaxLevel") or 1
            breve = texto_hab(po.get("BriefDesc"), po, estado)
            det = texto_hab(po.get("Desc"), po, estado)
            if breve:
                pots.append({"g": etiqueta, "b": breve, "d": det or breve})
    _stat["tot"] += 1
    _stat["hab"] += bool(habs); _stat["pot"] += bool(pots); _stat["sin"] += estado["sin_resolver"]
    return habs, pots

for p in personajes:
    h, po = habilidades_de(p["cid"], chars.get(str(p["cid"])) or {})
    if h:
        p["skillsAuto"] = h
    if po:
        p["potentials"] = po
print("Habilidades -> personajes con habilidades:", _stat["hab"], "| con potenciales:", _stat["pot"], "de", _stat["tot"],
      "| valores sin resolver (…):", _stat["sin"])
for p in personajes:
    if p["name"] == "Amber":
        print("MUESTRA-HAB Amber", json.dumps(p.get("skillsAuto"), ensure_ascii=False)[:1500])
        print("MUESTRA-POT Amber", json.dumps((p.get("potentials") or [])[:3], ensure_ascii=False)[:800])

# ---------- discos ----------
discs = jget("bin/Disc.json")
items = jget("bin/Item.json")
Li = jget("language/en_US/Item.json")
viejo = {d["name"]: d for d in OLDD}
cruz_r, cruz_e = collections.defaultdict(collections.Counter), collections.defaultdict(collections.Counter)
base = []
for k, d in discs.items():
    if not (d.get("Visible") and d.get("Available")):
        continue
    nombre = Li.get(f"Item.{k}.1")
    if not nombre:
        continue
    r_item = (items.get(k) or {}).get("Rarity")
    base.append((int(k), nombre, d.get("EET"), r_item))
    if nombre in viejo:
        cruz_r[r_item][int(viejo[nombre]["rarity"])] += 1
        cruz_e[d.get("EET")][viejo[nombre]["element"]] += 1
map_r = {r: c.most_common(1)[0][0] for r, c in cruz_r.items()}
map_e = {e: c.most_common(1)[0][0] for e, c in cruz_e.items()}
print("Rareza de disco (Item.Rarity -> estrellas):", {r: dict(c) for r, c in cruz_r.items()})
print("Elemento de disco (EET -> elemento):", {e: dict(c) for e, c in cruz_e.items()})
discos = []
for did, nombre, eet, r_item in sorted(base, key=lambda x: -x[0]):
    rar = map_r.get(r_item)
    ele = map_e.get(eet) or ELEM.get(eet) or ("Neutral" if eet == 7 else None)
    if not rar or not ele:
        print("   omitido (no se pudo clasificar):", did, nombre, r_item, eet)
        continue
    n = q(nombre)
    ficha = {"did": did, "name": nombre, "rarity": rar, "element": ele, "wikiUrl": WIKI + n,
             "imageUrl": FILE + "Disc_icon_" + n + ".png", "imageAlts": [FILE + "Disc_" + n + ".png"]}
    discos.append(ficha)
print("Discos:", len(discos), "| nuevos respecto a data.js:", [d["name"] for d in discos if d["name"] not in viejo])

# ---------- banners ----------
gacha = jget("bin/Gacha.json")
Lg = jget("language/en_US/Gacha.json")
ahora = datetime.now(timezone.utc)
TIPOS = {1: "Personajes", 8: "Personajes", 3: "Discos", 9: "Discos"}
banners = []
for k, x in gacha.items():
    tipo = TIPOS.get(x.get("GachaType"))
    if not tipo or not x.get("StartTime") or not x.get("EndTime"):
        continue
    ini, fin = datetime.fromisoformat(x["StartTime"]), datetime.fromisoformat(x["EndTime"])
    if ini > ahora + timedelta(days=DIAS_ADELANTE) or fin < ahora - timedelta(days=DIAS_ATRAS):
        continue
    nombre = Lg.get(x.get("Name"))
    if not nombre:
        continue
    fecha_wiki = ini.astimezone(ZoneInfo("America/Los_Angeles")).strftime("%Y-%m-%d")
    n = q(nombre)
    exts = [".png", ".jpg"] if tipo == "Personajes" else [".jpg", ".png"]
    imgs = [FILE + f"Banner_{n}_{fecha_wiki}_EN{e}" for e in exts]
    dest = None
    if tipo == "Personajes":
        ch = chars.get(str(x.get("GuaranteeTid")))
        dest = Lc.get((ch or {}).get("Name"))
        if dest:
            imgs.append(FILE + q(dest) + ".png")
    banners.append({"id": int(k), "name": nombre, "kind": tipo, "start": ini.isoformat(), "end": fin.isoformat(),
                    "url": WIKI + n + "/" + fecha_wiki, "img": imgs[0], "imgAlts": imgs[1:], "featured": dest})
banners.sort(key=lambda b: b["start"], reverse=True)
print("Banners:", [(b["name"], b["kind"], b["start"][:10]) for b in banners])

# ---------- extras: historia y temas de discos, skins y CG de personajes -> extras.json ----------
# Se guarda aparte de auto.json y la app solo lo descarga al abrir un disco o un personaje.
try:
    dip, Ldip = jopt("bin/DiscIP.json"), jopt("language/en_US/DiscIP.json")
    skins, Lsk = jopt("bin/CharacterSkin.json"), jopt("language/en_US/CharacterSkin.json")
    cgs, Lcg = jopt("bin/CharacterCG.json"), jopt("language/en_US/CharacterCG.json")
    extras = {"discos": {}, "skins": {}}
    for d in discos:
        x = dip.get(str(d["did"]))
        if not x:
            continue
        e = {}
        for k, campo in (("t1", "VoName1"), ("t2", "VoName2"), ("st", "StoryName"), ("tx", "StoryDesc")):
            v = Ldip.get(x.get(campo) or "")
            if v and str(v).strip():
                e[k] = str(v).replace("\x0b", "\n").strip()
        if e:
            extras["discos"][d["name"]] = e
    por_id = {p["cid"]: p["name"] for p in personajes}
    for k, sk in sorted(skins.items(), key=lambda kv: int(kv[0])):
        nom = por_id.get(sk.get("CharId"))
        n = Lsk.get(sk.get("Name") or "")
        if not nom or not n:
            continue
        e = {"n": n, "t": sk.get("Type")}
        de = Lsk.get(sk.get("Desc") or "")
        if de and str(de).strip():
            e["d"] = str(de).replace("\x0b", "\n").strip()
        sec = extras["skins"].setdefault(nom, {"skins": [], "cg": []})
        sec["skins"].append(e)
        cg = Lcg.get((cgs.get(str(sk.get("CharacterCG"))) or {}).get("Name") or "")
        if cg and cg not in sec["cg"]:
            sec["cg"].append(cg)
    if extras["discos"] or extras["skins"]:
        nuevo = json.dumps(extras, ensure_ascii=False)
        viejo_x = open("extras.json", encoding="utf-8").read() if os.path.exists("extras.json") else ""
        if nuevo != viejo_x:
            open("extras.json", "w", encoding="utf-8").write(nuevo)
        print("Extras: %d discos con historia, %d personajes con skins." % (len(extras["discos"]), len(extras["skins"])))
except Exception as ex:
    print("Extras omitidos por error:", ex)

# ---------- comprobaciones y guardado ----------
if len(personajes) < 30 or len(discos) < 80:
    print("ERROR: muy pocos datos, no se guarda nada.")
    sys.exit(1)
datos = {"fuente": "Hiro420/StellaSoraData (GPL-3.0)", "personajes": personajes, "discos": discos, "banners": banners}
previo = None
if os.path.exists("auto.json"):
    try:
        previo = json.load(open("auto.json", encoding="utf-8"))
        previo.pop("generado", None)
    except Exception:
        previo = None
if previo == datos:
    print("Sin cambios: auto.json se queda igual.")
else:
    datos["generado"] = ahora.isoformat(timespec="seconds")
    with open("auto.json", "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=1)
    print("auto.json actualizado.")
