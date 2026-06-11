#!/usr/bin/env python3
"""
seo_snapshot.py — strumento di sicurezza per il porting v4 sul sito reale.

Cattura ("snapshot") e confronta ("diff") la superficie SEO di un build Hugo,
per dimostrare che il restyling NON ha toccato head, JSON-LD, sitemap, robots
o l'insieme degli URL.

Uso:
  python scripts/seo_snapshot.py snapshot <docs_dir> <out_dir>
  python scripts/seo_snapshot.py diff <baseline_out_dir> <new_out_dir>

Note:
- Nel <head> il fingerprint del CSS (style.min.<hash>.css) e il valore
  integrity cambiano per costruzione: vengono normalizzati a HASH/SRI cosi'
  il diff dell'head mostra solo differenze REALI (es. la riga del nuovo font).
- I blocchi JSON-LD devono restare identici (zero diff) -> gate bloccante.
"""
import sys, os, re, hashlib, shutil

HEAD_RE   = re.compile(r"<head[^>]*>(.*?)</head>", re.DOTALL | re.IGNORECASE)
JSONLD_RE = re.compile(r"<script[^>]*application/ld\+json[^>]*>(.*?)</script>", re.DOTALL | re.IGNORECASE)
FP_RE     = re.compile(r"style\.min\.[0-9a-f]{40,}\.css")
SRI_RE    = re.compile(r'integrity="[^"]+"')

def normalize_head(head: str) -> str:
    head = FP_RE.sub("style.min.HASH.css", head)
    head = SRI_RE.sub('integrity="SRI"', head)
    return head

def iter_html(docs_dir):
    for root, _dirs, files in os.walk(docs_dir):
        for f in files:
            if f.endswith(".html"):
                full = os.path.join(root, f)
                rel = os.path.relpath(full, docs_dir).replace("\\", "/")
                yield rel, full

def snapshot(docs_dir, out_dir):
    if os.path.isdir(out_dir):
        shutil.rmtree(out_dir)
    os.makedirs(out_dir, exist_ok=True)
    urls = []
    for rel, full in iter_html(docs_dir):
        urls.append(rel)
        text = open(full, encoding="utf-8").read()
        m = HEAD_RE.search(text)
        head = normalize_head(m.group(1)) if m else ""
        jsonld = "\n--LDJSON--\n".join(s.strip() for s in JSONLD_RE.findall(text))
        base = os.path.join(out_dir, "pages", rel)
        os.makedirs(os.path.dirname(base), exist_ok=True)
        open(base + ".head", "w", encoding="utf-8").write(head)
        open(base + ".jsonld", "w", encoding="utf-8").write(jsonld)
    open(os.path.join(out_dir, "urls.txt"), "w", encoding="utf-8").write("\n".join(sorted(urls)) + "\n")
    for inv in ("sitemap.xml", "robots.txt"):
        src = os.path.join(docs_dir, inv)
        if os.path.exists(src):
            shutil.copyfile(src, os.path.join(out_dir, inv))
    print(f"[snapshot] {len(urls)} pagine -> {out_dir}")

def read(p):
    return open(p, encoding="utf-8").read() if os.path.exists(p) else ""

def diff(a_dir, b_dir):
    a_urls = set(read(os.path.join(a_dir, "urls.txt")).split())
    b_urls = set(read(os.path.join(b_dir, "urls.txt")).split())
    problems = 0
    expected = 0

    added = sorted(b_urls - a_urls)
    removed = sorted(a_urls - b_urls)
    if added:
        problems += 1
        print(f"\n[URL] !! {len(added)} URL AGGIUNTI (possibile leak):")
        for u in added: print("   + " + u)
    if removed:
        problems += 1
        print(f"\n[URL] !! {len(removed)} URL RIMOSSI:")
        for u in removed: print("   - " + u)
    if not added and not removed:
        print(f"[URL] ok — stesso insieme di {len(a_urls)} URL")

    # invarianti byte-identici
    for inv in ("sitemap.xml", "robots.txt"):
        if read(os.path.join(a_dir, inv)) != read(os.path.join(b_dir, inv)):
            problems += 1
            print(f"[{inv}] !! DIFFERISCE — atteso byte-identico")
        else:
            print(f"[{inv}] ok — byte-identico")

    # JSON-LD: deve essere zero-diff. head: normalizzato, differenze elencate.
    jsonld_diffs = []
    head_diffs = []
    for rel in sorted(a_urls & b_urls):
        ap = os.path.join(a_dir, "pages", rel)
        bp = os.path.join(b_dir, "pages", rel)
        if read(ap + ".jsonld") != read(bp + ".jsonld"):
            jsonld_diffs.append(rel)
        ah = read(ap + ".head"); bh = read(bp + ".head")
        if ah != bh:
            head_diffs.append((rel, ah, bh))

    if jsonld_diffs:
        problems += 1
        print(f"\n[JSON-LD] !! {len(jsonld_diffs)} pagine con JSON-LD MODIFICATO (gate bloccante):")
        for rel in jsonld_diffs: print("   ! " + rel)
    else:
        print("[JSON-LD] ok — identico su tutte le pagine comuni")

    if head_diffs:
        expected += 1
        print(f"\n[HEAD] {len(head_diffs)} pagine con <head> diverso (normalizzato). Verifica che siano SOLO aggiunte attese (es. font):")
        for rel, ah, bh in head_diffs[:6]:
            print(f"\n   --- {rel} ---")
            a_lines = set(ah.split(">"))
            b_lines = set(bh.split(">"))
            for seg in sorted(b_lines - a_lines):
                s = seg.strip()
                if s: print("     + " + s[:160])
            for seg in sorted(a_lines - b_lines):
                s = seg.strip()
                if s: print("     - " + s[:160])
        if len(head_diffs) > 6:
            print(f"   … e altre {len(head_diffs)-6} pagine (stessa differenza attesa)")
    else:
        print("[HEAD] ok — identico (a meno di fingerprint/SRI) su tutte le pagine")

    print("\n==============================")
    if problems:
        print(f"RISULTATO: {problems} PROBLEMA/I BLOCCANTE/I — NON pubblicare")
        sys.exit(1)
    print("RISULTATO: nessun problema bloccante." + (" Controlla le differenze head attese sopra." if expected else ""))

def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(2)
    mode = sys.argv[1]
    if mode == "snapshot" and len(sys.argv) == 4:
        snapshot(sys.argv[2], sys.argv[3])
    elif mode == "diff" and len(sys.argv) == 4:
        diff(sys.argv[2], sys.argv[3])
    else:
        print(__doc__); sys.exit(2)

if __name__ == "__main__":
    main()
