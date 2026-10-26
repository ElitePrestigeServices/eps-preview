"""Check the public host after deployment, never infer success from FTP alone."""
import json
import time
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from prepare_production_seo import Metadata, NS, ORIGIN


def fetch(path):
    request = urllib.request.Request(ORIGIN + path, headers={"Cache-Control": "no-cache", "User-Agent": "EPS-SEO-deployment-check"})
    with urllib.request.urlopen(request, timeout=20) as response:
        if response.status != 200 or "noindex" in response.headers.get("X-Robots-Tag", "").lower():
            raise ValueError(f"Bad response/header: {path}")
        return response.read().decode("utf-8")


def check_page(path):
    metadata = Metadata(fetch(path))
    if metadata.canonicals != [ORIGIN + path] or not metadata.robots or any("noindex" in rule for rule in metadata.robots):
        raise ValueError(f"Public SEO mismatch: {path}")


def verify():
    marker = json.loads(fetch("/seo/deployment.json"))
    if marker.get("version") != "2026-10-26-seo-v1":
        raise ValueError("Production marker not deployed")
    sitemap = ET.fromstring(fetch("/sitemap.xml"))
    urls = [loc.text for loc in sitemap.iter(f"{{{NS}}}loc")]
    if len(urls) != marker["public_pages"] or ORIGIN + "/" not in urls:
        raise ValueError("Production sitemap not aligned")
    paths = ["/", "/aviation-privee-aeroport-nice/", "/en/nice-airport-cannes-private-transfer/"]
    with ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(check_page, paths))
    for path in ("/admin/", "/client/"):
        if not any("noindex" in rule for rule in Metadata(fetch(path)).robots):
            raise ValueError(f"Private page lost noindex: {path}")
    print(f"Public host verified: {len(urls)} sitemap URLs, sample SEO and private exclusions correct.")


if __name__ == "__main__":
    for attempt in range(6):
        try:
            verify()
            break
        except Exception as error:
            if attempt == 5:
                raise
            print(f"Public verification pending: {error}", flush=True)
            time.sleep(10)
