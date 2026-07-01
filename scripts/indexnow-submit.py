#!/usr/bin/env python3
"""
IndexNow submit per oida-labs.com.
Legge la sitemap pubblicata e notifica IndexNow (Bing, Yandex e altri) di tutti gli URL.
Da eseguire dopo ogni deploy (hugo --minify + push):  python scripts/indexnow-submit.py

Chiave IndexNow: fe3f7ae7ed8f1ed400e9bdab94387cd8
File-chiave:     https://oida-labs.com/fe3f7ae7ed8f1ed400e9bdab94387cd8.txt
"""
import json
import re
import sys
import urllib.request

HOST = "oida-labs.com"
KEY = "fe3f7ae7ed8f1ed400e9bdab94387cd8"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
SITEMAP = f"https://{HOST}/sitemap.xml"
ENDPOINT = "https://api.indexnow.org/indexnow"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "oida-indexnow/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def main():
    xml = fetch(SITEMAP)
    urls = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml)
    urls = [u for u in urls if u.startswith(f"https://{HOST}")]
    if not urls:
        print("Nessun URL trovato nella sitemap.")
        sys.exit(1)
    payload = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT, data=payload,
        headers={"Content-Type": "application/json; charset=utf-8",
                 "User-Agent": "oida-indexnow/1.0"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"IndexNow: HTTP {r.status} — inviati {len(urls)} URL")
    except urllib.error.HTTPError as e:
        # 200/202 = ok; 403 = chiave non verificata; 422 = URL non validi
        print(f"IndexNow: HTTP {e.code} — {e.reason} (inviati {len(urls)} URL)")
        if e.code not in (200, 202):
            sys.exit(2)


if __name__ == "__main__":
    main()
