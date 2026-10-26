"""Prepare SEO only in the deployment copy; preserve the preview source files."""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ORIGIN = "https://www.elite-prestige-services.fr"
PREVIEW = "https://eliteprestigeservices.github.io/eps-preview"
NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
ROBOTS = re.compile(r'<meta\b(?=[^>]*\bname\s*=\s*[\"\'](?:robots|googlebot)[\"\'])[^>]*>', re.I)
CANONICAL = re.compile(r'<link\b(?=[^>]*\brel\s*=\s*[\"\']canonical[\"\'])[^>]*>', re.I)
PRIVATE = {"admin", "client", "chauffeur", "devis", "dispatch-demo"}


class Metadata(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.robots = []
        self.canonicals = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta" and attrs.get("name", "").lower() in ("robots", "googlebot"):
            self.robots.append(attrs.get("content", "").lower())
        if tag == "link" and attrs.get("rel", "").lower() == "canonical":
            self.canonicals.append(attrs.get("href"))


def source_urls(root):
    urls = set()
    for name in ("sitemap.xml", "seo/sitemap-production.xml"):
        for loc in ET.parse(root / name).iter(f"{{{NS}}}loc"):
            url = loc.text.strip()
            parts = urlsplit(url)
            if parts.scheme != "https" or parts.netloc != urlsplit(ORIGIN).netloc or parts.query or parts.fragment:
                raise ValueError(f"Unexpected sitemap URL: {url}")
            path = parts.path.strip("/")
            first = path.split("/")[0]
            if first in PRIVATE or first.startswith("test-") or ".." in path.split("/"):
                raise ValueError(f"Private/invalid URL in sitemap: {url}")
            urls.add(url)
    return sorted(urls)


def page_path(root, url):
    return root / urlsplit(url).path.lstrip("/") / "index.html"


def prepare(root):
    urls = source_urls(root)
    for url in urls:
        path = page_path(root, url)
        html = path.read_text(encoding="utf-8")
        html = ROBOTS.sub("", html)
        html = CANONICAL.sub("", html)
        html = html.replace(PREVIEW, ORIGIN)
        # These footers came from the preview scaffolding, not the public service.
        html = re.sub(r" · Aperçu du futur site — Réservations inactives(?: sur cette version)?\.", " · Chauffeur privé sur la Côte d’Azur", html)
        metadata = f'<meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="{url}">'
        html, count = re.subn(r"</head\s*>", metadata + "</head>", html, count=1, flags=re.I)
        if count != 1:
            raise ValueError(f"Missing head in {path}")
        path.write_text(html, encoding="utf-8")
    ET.register_namespace("", NS)
    sitemap = ET.Element(f"{{{NS}}}urlset")
    for url in urls:
        node = ET.SubElement(sitemap, f"{{{NS}}}url")
        ET.SubElement(node, f"{{{NS}}}loc").text = url
    ET.indent(sitemap)
    xml = ET.tostring(sitemap, encoding="unicode", xml_declaration=True) + "\n"
    for name in ("sitemap.xml", "seo/sitemap-production.xml"):
        (root / name).write_text(xml, encoding="utf-8")
    (root / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {ORIGIN}/sitemap.xml\n", encoding="utf-8")
    (root / "seo/deployment.json").write_text(json.dumps({"version": "2026-10-26-seo-v1", "public_pages": len(urls)}, indent=2) + "\n", encoding="utf-8")
    check(root)


def check(root):
    urls = source_urls(root)
    for url in urls:
        html = page_path(root, url).read_text(encoding="utf-8")
        meta = Metadata(html)
        if meta.canonicals != [url] or len(meta.robots) != 1 or "noindex" in meta.robots[0] or "nofollow" in meta.robots[0]:
            raise ValueError(f"Invalid production SEO: {url}: {meta.canonicals}, {meta.robots}")
        if PREVIEW in html:
            raise ValueError(f"Preview link remains: {url}")
    for directory in ("admin", "client", "chauffeur", "test-reservation", "test-dispatch", "test-validation-chauffeurs", "dispatch-demo"):
        for page in (root / directory).rglob("*.html"):
            if not any("noindex" in rule for rule in Metadata(page.read_text(encoding="utf-8")).robots):
                raise ValueError(f"Private page lost noindex: {page}")
    print(f"Production SEO verified: {len(urls)} public URLs; private/test pages remain noindex.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    (check if args.check else prepare)(args.root.resolve())
