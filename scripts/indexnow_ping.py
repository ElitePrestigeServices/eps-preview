"""Signale à Bing/IndexNow les pages publiques modifiées par le dernier push (04/11/2026).
Usage : python3 scripts/indexnow_ping.py <fichiers modifiés…>. N'échoue jamais le déploiement."""
import json, re, sys, urllib.request
from pathlib import Path
KEY = "d1d7cc866662ac2f0a98aa653433c774"
HOST = "www.elite-prestige-services.fr"
ORIGIN = "https://" + HOST
locs = set()
for name in ("sitemap.xml", "seo/sitemap-production.xml"):
    locs |= set(re.findall(r"<loc>(.*?)</loc>", Path(name).read_text(encoding="utf-8")))
urls = []
for f in sys.argv[1:]:
    if not f.endswith("index.html"):
        continue
    path = f[: -len("index.html")]
    url = ORIGIN + "/" + path
    if url in locs:
        urls.append(url)
if any(f in ("sitemap.xml", "seo/sitemap-production.xml") for f in sys.argv[1:]):
    urls = sorted(locs)
urls = sorted(set(urls))[:10000]
if not urls:
    print("IndexNow : aucune page publique modifiée.")
    sys.exit(0)
body = json.dumps({"host": HOST, "key": KEY, "keyLocation": f"{ORIGIN}/{KEY}.txt", "urlList": urls}).encode()
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body, headers={"Content-Type": "application/json; charset=utf-8"})
try:
    with urllib.request.urlopen(req, timeout=20) as r:
        print(f"IndexNow : {len(urls)} URL signalées, réponse {r.status}.")
except Exception as e:
    print(f"IndexNow : envoi non abouti ({e}) — sans incidence sur le déploiement.")
