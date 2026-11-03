"""Crée les pages EN/IT/ES à partir des traductions JSON et relie toutes les versions (hreflang + boutons de langue)."""
import json, os, re, sys, glob
from urllib.parse import quote
sys.path.insert(0, '/tmp/claude-0')
import convert_pages as C
ROOT = '/home/claude/eps-preview'
ORIGIN = 'https://www.elite-prestige-services.fr'
PAGES = ['agenda-evenements-cote-dazur', 'chauffeur-prive-cannes', 'chauffeur-prive-nice', 'chauffeur-prive-monaco', 'chauffeur-prive-saint-tropez', 'transfert-aeroport-nice-cannes']
EXISTING = {'transfert-aeroport-nice-cannes': {'en': '/en/nice-airport-cannes-private-transfer/', 'it': '/it/nice-airport-cannes-private-transfer/'}}
WA = {'en': 'Hello, I would like a quote for a chauffeur transfer', 'it': 'Buongiorno, vorrei un preventivo per un transfer con autista', 'es': 'Hola, quisiera un presupuesto para un traslado con chófer'}
BOOK = {'fr': 'Réserver →', 'en': 'Book →', 'it': 'Prenota →', 'es': 'Reservar →'}
LOCALE = {'fr': 'fr_FR', 'en': 'en_GB', 'it': 'it_IT', 'es': 'es_ES'}
esc = lambda s: s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')

groups = {}
trans = {}
for p in PAGES:
    g = {'fr': f'/{p}/'}
    g.update(EXISTING.get(p, {}))
    for lang in ('en', 'it', 'es'):
        f = f'/tmp/claude-0/tr/{lang}/{p}.json'
        if os.path.exists(f):
            d = json.load(open(f))
            g[lang] = f'/{lang}/{d["slug"]}/'
            trans[(p, lang)] = d
    groups[p] = g

def set_hreflang(html, g):
    html = re.sub(r'<link rel="alternate" hreflang="[^"]+" href="[^"]*">', '', html)
    links = ''.join(f'<link rel="alternate" hreflang="{l}" href="{ORIGIN}{u}">' for l, u in g.items())
    links += f'<link rel="alternate" hreflang="x-default" href="{ORIGIN}{g["fr"]}">'
    return html.replace('<link rel="preconnect" href="https://fonts.googleapis.com">', links + '<link rel="preconnect" href="https://fonts.googleapis.com">', 1)

def wa_link(lang):
    return 'https://wa.me/33745495321?text=' + quote(WA[lang])

def localise_body(html, lang, g, main_html=None):
    wa = wa_link(lang) if lang != 'fr' else (re.search(r'class="eps-cta-wa" href="([^"]+)"', html) or [None, 'https://wa.me/33745495321'])[1]
    html = re.sub(r'<header class="site-head">.*?</header>', lambda _: C.header(lang, g, wa), html, count=1, flags=re.S)
    if lang == 'fr':
        return html
    html = re.sub(r'(<div class="wrap page-body">).*?(</div><section class="page-cta)', lambda m: m.group(1) + main_html + m.group(2), html, count=1, flags=re.S)
    html = re.sub(r'<section class="page-cta wrap".*?</section>', lambda _: C.cta_band(lang, wa), html, count=1, flags=re.S)
    html = re.sub(r'<footer class="site-foot".*?</footer>', lambda _: C.footer(lang, wa), html, count=1, flags=re.S)
    html = re.sub(r'(class="eps-cta-wa" href=")[^"]+', lambda m: m.group(1) + wa, html)
    html = re.sub(r'(class="eps-wa-float" href=")[^"]+', lambda m: m.group(1) + wa, html)
    html = re.sub(r'<a class="eps-cta-book" href="[^"]*">[^<]*</a>', f'<a class="eps-cta-book" href="/?lang={lang}#reservation">{BOOK[lang]}</a>', html)
    html = html.replace('aria-label="Réserver"', f'aria-label="{BOOK[lang][:-2]}"')
    return html

written = []
for p in PAGES:
    g = groups[p]
    base = open(f'{ROOT}/{p}/index.html').read()
    # page française : liens de langue + hreflang
    fr = localise_body(set_hreflang(base, g), 'fr', g)
    open(f'{ROOT}/{p}/index.html', 'w').write(fr)
    for lang, url in g.items():
        if lang == 'fr': continue
        if (p, lang) not in trans:
            # version existante (EN/IT du transfert) : mettre à jour hreflang et boutons
            f = f'{ROOT}{url}index.html'
            h = open(f).read()
            h = set_hreflang(h, g)
            h = re.sub(r'<header class="site-head">.*?</header>', lambda _: C.header(lang, g, wa_link(lang)), h, count=1, flags=re.S)
            open(f, 'w').write(h); continue
        d = trans[(p, lang)]
        h = set_hreflang(base, g)
        h = re.sub(r'<html lang="[^"]+"', f'<html lang="{lang}"', h, count=1)
        h = re.sub(r'<title>.*?</title>', f'<title>{esc(d["title"])}</title>', h, count=1, flags=re.S)
        h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{esc(d["description"])}">', h, count=1)
        h = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{esc(d["title"])}">', h, count=1)
        h = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{esc(d["description"])}">', h, count=1)
        h = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{ORIGIN}{url}">', h, count=1)
        h = re.sub(r'<meta property="og:locale" content="[^"]*">', f'<meta property="og:locale" content="{LOCALE[lang]}">', h, count=1)
        h = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{ORIGIN}{url}">', h, count=1)
        h = localise_body(h, lang, g, d['main_html'])
        os.makedirs(f'{ROOT}{url}', exist_ok=True)
        open(f'{ROOT}{url}index.html', 'w').write(h)
        written.append(url)

# sitemap
sm = f'{ROOT}/seo/sitemap-production.xml'
x = open(sm).read()
add = ''.join(f'<url><loc>{ORIGIN}{u}</loc></url>\n' for u in written if f'{ORIGIN}{u}</loc>' not in x)
x = x.replace('</urlset>', add + '</urlset>')
open(sm, 'w').write(x)
print(len(written), 'pages créées', written)

# pieds de page des pages traduites : liens vers les versions dans la même langue
for f in glob.glob(f'{ROOT}/en/*/index.html') + glob.glob(f'{ROOT}/it/*/index.html') + glob.glob(f'{ROOT}/es/*/index.html'):
    h = open(f).read(); lang = re.search(r'<html lang="([a-z]+)', h).group(1)
    def fix(m):
        s = m.group(0)
        for p, g in groups.items():
            if lang in g: s = s.replace(f'href="/{p}/"', f'href="{g[lang]}"')
        if lang in groups['chauffeur-prive-monaco']: s = s.replace('href="/transfert-nice-monaco/"', f'href="{groups["chauffeur-prive-monaco"][lang]}"')
        return s
    h2 = re.sub(r'<footer class="site-foot".*?</footer>', fix, h, count=1, flags=re.S)
    if h2 != h: open(f, 'w').write(h2)
print('pieds de page reliés')
