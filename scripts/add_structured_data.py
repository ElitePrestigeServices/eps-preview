#!/usr/bin/env python3
"""Ajoute (ou remet à jour) sur chaque page publique indexable :
- un fil d'Ariane visible (<nav class="crumbs">) au-dessus du titre ;
- les données structurées BreadcrumbList et FAQPage (JSON-LD).

Idempotent : on peut le relancer après chaque modification de page
(les anciens blocs data-eps="ariane" / "faq" et nav.crumbs sont remplacés).
Usage : python3 scripts/add_structured_data.py [racine]
"""
import glob
import html
import json
import os
import re
import sys

BASE = "https://www.elite-prestige-services.fr"
ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
SKIP_PREFIX = ("admin", "client", "chauffeur/", "eps-preview", "scripts", "node_modules", ".git")

LANG = {
    "fr": {"home": "Accueil", "aria": "Fil d’Ariane", "faq": ["Questions fréquentes", "FAQ"]},
    "en": {"home": "Home", "aria": "Breadcrumb", "faq": ["Frequently asked questions", "FAQ"]},
    "it": {"home": "Home", "aria": "Percorso", "faq": ["Domande frequenti", "FAQ"]},
    "es": {"home": "Inicio", "aria": "Ruta de navegación", "faq": ["Preguntas frecuentes", "FAQ"]},
    "ru": {"home": "Главная", "aria": "Главная", "faq": ["Частые вопросы", "FAQ"]},
    "zh": {"home": "首页", "aria": "首页", "faq": ["常见问题", "FAQ"]},
}
# Pages françaises rangées sous /destinations/ (hub). Les autres pages FR sont directement sous l'accueil.
NO_HUB_FR = {"destinations", "agenda-evenements-cote-dazur", "a-propos"}


def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def ld(kind, data):
    return ('<script type="application/ld+json" data-eps="%s">' % kind
            + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "</script>")


def process(path):
    rel = os.path.relpath(path, ROOT).replace(os.sep, "/")
    slug = rel[: -len("index.html")].rstrip("/")
    if not slug or slug.startswith(SKIP_PREFIX):
        return None
    h = open(path, encoding="utf-8").read()
    if f"{BASE}/{slug}/" not in PUBLIC or 'http-equiv="refresh"' in h:
        return None
    lang = slug.split("/")[0] if slug.split("/")[0] in ("en", "it", "es", "ru", "zh") else "fr"
    L = LANG[lang]
    m = re.search(r"<h1[^>]*>(.*?)</h1>", h, re.S)
    if not m:
        return None
    name = text(m.group(1))
    url = f"{BASE}/{slug}/"

    # nettoyage des anciens ajouts
    h = re.sub(r'<script type="application/ld\+json" data-eps="(?:ariane|faq)">.*?</script>', "", h, flags=re.S)
    h = re.sub(r'<nav class="crumbs".*?</nav>', "", h, flags=re.S)

    if lang in ("ru", "zh"):  # pages russes / chinoises : leur propre accueil (/ru/, /zh/)
        trail = [] if slug == lang else [(L["home"], f"{BASE}/{lang}/", f"/{lang}/")]
    else:
        trail = [(L["home"], f"{BASE}/", "/")]
    if lang == "fr" and slug not in NO_HUB_FR:
        trail.append(("Destinations", f"{BASE}/destinations/", "/destinations/"))
    trail.append((name, url, None))

    crumbs = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u, _) in enumerate(trail)]}
    parts = [f'<a href="{href}">{html.escape(n)}</a>' for n, _, href in trail[:-1]]
    parts.append(f'<span aria-current="page">{html.escape(name)}</span>')
    nav = f'<nav class="crumbs" aria-label="{L["aria"]}">' + '<span aria-hidden="true"> › </span>'.join(parts) + "</nav>"

    blocks = [ld("ariane", crumbs)]
    faq_re = "|".join(re.escape(t) for t in L["faq"])
    fm = re.search(r"<h2>(?:%s)</h2>(.*?)</section>" % faq_re, h, re.S)
    nq = 0
    if fm:
        qa = re.findall(r"<h3>(.*?)</h3>\s*<p>(.*?)</p>", fm.group(1), re.S)
        if qa:
            nq = len(qa)
            blocks.append(ld("faq", {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
                {"@type": "Question", "name": text(q), "acceptedAnswer": {"@type": "Answer", "text": text(a)}}
                for q, a in qa]}))

    h = h.replace("</head>", "".join(blocks) + "</head>", 1)
    # fil d'Ariane visible : juste avant le surtitre (ou le h1)
    anchor = re.search(r'<p class="eyebrow">|<h1', h[h.find("<main"):])
    if anchor:
        pos = h.find("<main") + anchor.start()
        h = h[:pos] + nav + h[pos:]
    open(path, "w", encoding="utf-8").write(h)
    return slug, len(trail), nq


import xml.etree.ElementTree as ET
PUBLIC = set()
for sm in ("sitemap.xml", "seo/sitemap-production.xml"):
    p = os.path.join(ROOT, sm)
    if os.path.exists(p):
        PUBLIC |= {l.text.strip() for l in ET.parse(p).iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")}

done = [r for r in (process(p) for p in sorted(glob.glob(os.path.join(ROOT, "**/index.html"), recursive=True))) if r]
print(f"{len(done)} pages : fil d'Ariane ; {sum(1 for d in done if d[2])} avec FAQPage ({sum(d[2] for d in done)} questions)")
