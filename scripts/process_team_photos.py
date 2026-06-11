#!/usr/bin/env python3
"""
Processa le foto del team OIDA: rende trasparente lo sfondo bianco esterno
alla circoletta teal, croppa al cerchio, ridimensiona e salva in WebP <150KB
con nomi file SEO. Sfondo bianco INTERNO (camicie, dolcevita) preservato
perche' non connesso ai bordi (l'anello teal fa da confine al flood-fill).
"""
import os
from PIL import Image, ImageDraw

SRC = os.path.join(os.path.expanduser("~"), "Downloads")
DST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "static", "img", "team")
DST = os.path.normpath(DST)

JOBS = [
    ("Stefano Giarratana Founder Marketing Sanitario OIDA Labs.png",
     "stefano-giarratana-founder-marketing-sanitario-oida-labs.webp"),
    ("Alessandro Catalano CMO Marketing Sanitario OIDA Labs.png",
     "alessandro-catalano-cmo-marketing-sanitario-oida-labs.webp"),
    ("Giacomo Baldi Tech Advisor Marketing Sanitario OIDA Labs.png",
     "giacomo-baldi-tech-advisor-marketing-sanitario-oida-labs.webp"),
]

TARGET_MAX = 1000      # lato lungo finale px
SIZE_LIMIT = 150 * 1024
FLOOD_THRESH = 70      # tolleranza near-white per il flood-fill dagli angoli

def process(src_name, dst_name):
    src = os.path.join(SRC, src_name)
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    # flood-fill trasparente dai 4 angoli (esterno bianco -> trasparente)
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    for c in corners:
        ImageDraw.floodfill(im, c, (0, 0, 0, 0), thresh=FLOOD_THRESH)
    # crop al contenuto visibile (bbox dell'alpha)
    bbox = im.getbbox()
    if bbox:
        pad = 6
        l, t, r, b = bbox
        l = max(0, l - pad); t = max(0, t - pad)
        r = min(w, r + pad); b = min(h, b + pad)
        im = im.crop((l, t, r, b))
    # ridimensiona lato lungo a TARGET_MAX
    cw, ch = im.size
    scale = TARGET_MAX / max(cw, ch)
    if scale < 1:
        im = im.resize((round(cw * scale), round(ch * scale)), Image.LANCZOS)
    # esporta WebP, abbassando qualita' finche' < 150KB
    out = os.path.join(DST, dst_name)
    for q in (90, 85, 80, 75, 70, 65, 60):
        im.save(out, "WEBP", quality=q, method=6)
        kb = os.path.getsize(out) / 1024
        if os.path.getsize(out) <= SIZE_LIMIT:
            break
    return im.size, q, kb

for src_name, dst_name in JOBS:
    size, q, kb = process(src_name, dst_name)
    print(f"{dst_name}  {size[0]}x{size[1]}  q{q}  {kb:.0f}KB")
print("DONE ->", DST)
