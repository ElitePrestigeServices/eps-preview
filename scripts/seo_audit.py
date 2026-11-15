#!/usr/bin/env python3
"""Audit SEO complet du site EPS, à lancer à CHAQUE point « SEO » (règle d'Anthony du 15/11/2026).

Contrôle, sur les pages du sitemap :
  1. cannibalisation : deux pages dont les titres visent la même requête principale ;
  2. données structurées : BreadcrumbList, FAQPage (si FAQ visible), LocalBusiness, JSON valide ;
  3. FAQ : réponses identiques sur plusieurs pages, réponses vides ou hors sujet évidentes ;
  4. balises : un seul h1, title ≤ 65 car., description ≤ 155 car., titres en double ;
  5. pages clés : À propos indexable, mentions légales complètes, médiateur dans les CGV.
Usage : python3 scripts/seo_audit.py [racine]
"""
import collections
import glob
import html
import json
import os
import re
import sys
import xml.etree.ElementTree as ET

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
BASE = "https://www.elite-prestige-services.fr"
STOP = set("""le la les de des du d l un une et à a au aux en pour sur avec votre vos nos notre prix fixe
privé privée chauffeur vtc eps the to of and in for with private fixed price driver chauffeur service
il lo di e per con prezzo fisso autista privato ncc el los con precio fijo chófer privado y a""".split())

urls = set()
for sm in ("sitemap.xml", "seo/sitemap-production.xml"):
    p = os.path.join(ROOT, sm)
    if os.path.exists(p):
        urls |= {l.text.strip() for l in ET.parse(p).iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")}

def txt(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()

problems = collections.defaultdict(list)
pages = {}
answers = collections.defaultdict(list)
for url in sorted(urls):
    slug = url[len(BASE):].strip("/")
    path = os.path.join(ROOT, slug, "index.html") if slug else os.path.join(ROOT, "index.html")
    if not os.path.exists(path):
        problems["page du sitemap introuvable"].append(slug); continue
    h = open(path, encoding="utf-8").read()
    title = txt((re.search(r"<title>(.*?)</title>", h, re.S) or [None, ""])[1])
    desc = (re.search(r'<meta name="description" content="([^"]*)"', h) or [None, ""])[1]
    lang = slug.split("/")[0] if slug.split("/")[0] in ("en", "it", "es") else "fr"
    pages[slug or "/"] = (lang, title)
    if h.count("<h1") != 1: problems["h1 ≠ 1"].append(slug)
    if len(title) > 65: problems["title > 65 car."].append(f"{slug} ({len(title)})")
    if not desc: problems["description manquante"].append(slug)
    elif len(html.unescape(desc)) > 155: problems["description > 155 car."].append(f"{slug} ({len(html.unescape(desc))})")
    types = set()
    for b in re.findall(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', h, re.S):
        try:
            d = json.loads(b)
        except Exception:
            problems["JSON-LD invalide"].append(slug); continue
        stack = [d]
        while stack:
            x = stack.pop()
            if isinstance(x, dict):
                t = x.get("@type"); types |= set(t if isinstance(t, list) else [t] if t else [])
                stack += list(x.values())
            elif isinstance(x, list):
                stack += x
    if "LocalBusiness" not in types: problems["sans LocalBusiness"].append(slug)
    if slug and "BreadcrumbList" not in types: problems["sans fil d'Ariane (BreadcrumbList)"].append(slug)
    fm = re.search(r"<h2>(?:Questions fréquentes|Frequently asked questions|Domande frequenti|Preguntas frecuentes|FAQ)</h2>(.*?)</section>", h, re.S)
    if fm:
        qa = re.findall(r"<h3>(.*?)</h3>\s*<p>(.*?)</p>", fm.group(1), re.S)
        if qa and "FAQPage" not in types: problems["FAQ visible sans FAQPage"].append(slug)
        for q, a in qa:
            a_t = txt(a)
            answers[a_t].append(slug)
            if len(a_t) < 25: problems["réponse FAQ très courte"].append(f"{slug} : {txt(q)}")
            # réponse « prix » à une question qui ne parle pas de prix
            if re.match(r"^(Le prix est fixe|The price is fixed|Il prezzo è fisso|El precio es fijo)", a_t) and not re.search(r"prix|coût|price|cost|prezz|precio|combien|how much|quanto|cuánto", txt(q), re.I):
                problems["réponse FAQ hors sujet"].append(f"{slug} : {txt(q)}")

for a, where in answers.items():
    if len(where) > 2:
        problems["réponse FAQ répétée sur > 2 pages"].append(f"{len(where)}× « {a[:70]}… »")

# cannibalisation : mots-clés significatifs du title (avant « | »), même langue
def keys(title):
    words = re.findall(r"[a-zà-ÿ0-9’'-]+", title.split("|")[0].lower())
    return frozenset(w for w in words if w not in STOP and len(w) > 2)
seen = collections.defaultdict(list)
for slug, (lang, title) in pages.items():
    k = keys(title)
    if k: seen[(lang, k)].append(slug)
for (lang, k), slugs in seen.items():
    if len(slugs) > 1: problems["cannibalisation (titres équivalents)"].append(f"{', '.join(slugs)} → {' '.join(sorted(k))}")
titles = collections.Counter(t for _, t in pages.values())
for t, n in titles.items():
    if n > 1: problems["title en double"].append(t)

def read(p):
    p = os.path.join(ROOT, p)
    return open(p, encoding="utf-8").read() if os.path.exists(p) else ""
if f"{BASE}/a-propos/" not in urls: problems["pages clés"].append("/a-propos/ absente du sitemap")
ml = read("mentions-legales/index.html")
for need in ("RCS", "capital", "Directeur de la publication", "o2switch", "EVTC"):
    if need not in ml: problems["pages clés"].append(f"mentions légales : « {need} » manquant")
if "médiat" not in read("cgv/index.html").lower():
    problems["pages clés"].append("CGV : pas de médiateur de la consommation (obligatoire en B2C — Anthony s'en occupe)")

print(f"Audit SEO : {len(pages)} pages du sitemap")
if not problems:
    print("Aucun problème.")
for k, v in problems.items():
    print(f"\n[{k}] {len(v)}")
    for x in v[:15]:
        print("  -", x)
