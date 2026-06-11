# Audit/fix delle ancore di sommario nei post blog.
# Confronta i link `](#...)` nei Markdown con gli id generati da Hugo nell'HTML.
# Uso:
#   python anchor_audit.py audit  <content_blog_dir> <built_blog_dir>
#   python anchor_audit.py fix    <content_blog_dir> <built_blog_dir>
#   python anchor_audit.py check  <built_site_dir>      # link-checker: tutte le ancore #... risolvono?
#   python anchor_audit.py checkx <built_site_dir>      # come check, ma anche ancore cross-page (/pagina/#sezione)
import re
import sys
import unicodedata
from pathlib import Path
from urllib.parse import unquote

# attributi con o senza virgolette (l'HTML minificato le omette)
HEADING_ID_RE = re.compile(r'<h[1-6][^>]*\bid=(?:"([^"]+)"|([^\s>"]+))', re.I)
ANY_ID_RE = re.compile(r'\bid=(?:"([^"]+)"|([^\s>"]+))')
HREF_ANCHOR_RE = re.compile(r'\bhref=(?:"#([^"]+)"|#([^\s>"]+))')
MD_ANCHOR_RE = re.compile(r'\]\(#([^)\s]+)\)')
MD_HEADING_RE = re.compile(r'^(#{1,6})\s+(.*?)\s*$')


def deaccent(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                   if unicodedata.category(c) != 'Mn')


def _vals(rx, text):
    return [m.group(1) or m.group(2) for m in rx.finditer(text)]


def html_ids(html_path, headings_only=True):
    text = html_path.read_text(encoding='utf-8')
    rx = HEADING_ID_RE if headings_only else ANY_ID_RE
    return _vals(rx, text)


def post_pairs(content_dir, built_dir):
    """(md_path, html_path) per ogni post; html in built/<stem>/index.html"""
    pairs = []
    for md in sorted(Path(content_dir).glob('*.md')):
        if md.name == '_index.md':
            continue
        html = Path(built_dir) / md.stem / 'index.html'
        if not html.exists():
            print(f'!! HTML mancante per {md.name}: {html}')
            continue
        pairs.append((md, html))
    return pairs


def audit(content_dir, built_dir, do_fix=False):
    total_bad = total_fixed = 0
    for md, html in post_pairs(content_dir, built_dir):
        ids = set(html_ids(html))
        deacc_map = {}
        for i in ids:
            deacc_map.setdefault(deaccent(i), i)
        md_text = md.read_text(encoding='utf-8')
        anchors = MD_ANCHOR_RE.findall(md_text)
        bad = [a for a in anchors if a not in ids]
        if not bad:
            continue
        print(f'\n== {md.name}')
        # mappa: heading text -> id accentato generato, per individuare la riga heading
        lines = md_text.split('\n')
        fixed_in_file = 0
        for a in sorted(set(bad)):
            target = deacc_map.get(deaccent(a))
            if target is None:
                print(f'  ?? {a!r}: nessun id corrispondente nemmeno senza accenti')
                continue
            print(f'  -- href #{a}  ->  id generato #{target}')
            total_bad += 1
            if not do_fix:
                continue
            # trova la riga heading il cui id generato (con accenti) e' `target`:
            # ricostruisco lo slug github-style dal testo heading e confronto.
            hit = None
            for n, line in enumerate(lines):
                m = MD_HEADING_RE.match(line)
                if not m:
                    continue
                if github_slug(m.group(2)) == target:
                    hit = n
                    break
            if hit is None:
                print(f'     !! heading per id {target!r} non trovato nel md, salto')
                continue
            if lines[hit].rstrip().endswith('}'):
                print(f'     !! heading ha gia un attributo, salto: {lines[hit]!r}')
                continue
            lines[hit] = lines[hit].rstrip() + ' {#' + a + '}'
            fixed_in_file += 1
        if do_fix and fixed_in_file:
            md.write_text('\n'.join(lines), encoding='utf-8')
            total_fixed += fixed_in_file
            print(f'  => {fixed_in_file} heading aggiornati')
    print(f'\nTotale ancore rotte: {total_bad}' +
          (f' | corrette: {total_fixed}' if do_fix else ''))


PUNCT_STRIP_RE = re.compile(r'[^\w\s-]', re.UNICODE)
INLINE_MD_RE = re.compile(r'(\*\*|\*|`|__|_)')


def github_slug(heading_text):
    """Replica autoHeadingIDType=github di Hugo (accenti conservati)."""
    t = INLINE_MD_RE.sub('', heading_text)
    t = PUNCT_STRIP_RE.sub('', t)
    t = t.strip().lower()
    t = re.sub(r'\s+', '-', t)
    return t


def check(built_dir):
    """Verifica che ogni href="#..." in ogni pagina abbia un id corrispondente."""
    bad = 0
    pages = 0
    for html in Path(built_dir).rglob('index.html'):
        text = html.read_text(encoding='utf-8')
        ids = set(_vals(ANY_ID_RE, text))
        hrefs = _vals(HREF_ANCHOR_RE, text)
        pages += 1
        for h in hrefs:
            h = unquote(h)  # il browser decodifica il fragment prima del match con gli id
            if h and h not in ids:
                print(f'BROKEN  {html.relative_to(built_dir)}  #{h}')
                bad += 1
    print(f'{pages} pagine controllate, {bad} ancore rotte')
    return bad


HREF_ANY_RE = re.compile(r'\bhref=(?:"([^"]*)"|([^\s>"]+))')
BASEURL_RE = re.compile(r'^https?://(www\.)?oida-labs\.com')


def check_cross(built_dir):
    """Verifica le ancore nei link interni verso ALTRE pagine (es. ../foo/#bar)."""
    from posixpath import normpath
    built = Path(built_dir)
    ids_by_url = {}
    for html in built.rglob('index.html'):
        url = '/' + html.parent.relative_to(built).as_posix().strip('.') if html.parent != built else '/'
        url = url.rstrip('/') + '/'
        ids_by_url[url] = set(_vals(ANY_ID_RE, html.read_text(encoding='utf-8')))
    bad = links = 0
    for html in built.rglob('index.html'):
        page_url = '/' + html.parent.relative_to(built).as_posix().strip('.') if html.parent != built else '/'
        page_url = page_url.rstrip('/') + '/'
        for h in _vals(HREF_ANY_RE, html.read_text(encoding='utf-8')):
            h = BASEURL_RE.sub('', h)
            if '#' not in h or h.startswith(('#', 'mailto:', 'tel:', 'javascript:', 'http')):
                continue
            path, frag = h.split('#', 1)
            frag = unquote(frag)
            path = path.split('?')[0]
            target = path if path.startswith('/') else normpath(page_url + path)
            target = target.rstrip('/') + '/'
            links += 1
            if target not in ids_by_url:
                print(f'PAGINA MANCANTE  {page_url}  ->  {h}')
                bad += 1
            elif frag and frag not in ids_by_url[target]:
                print(f'BROKEN  {page_url}  ->  {target}#{frag}')
                bad += 1
    print(f'{links} link cross-page con ancora, {bad} rotti')
    return bad


if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'audit':
        audit(sys.argv[2], sys.argv[3], do_fix=False)
    elif mode == 'fix':
        audit(sys.argv[2], sys.argv[3], do_fix=True)
    elif mode == 'check':
        sys.exit(1 if check(sys.argv[2]) else 0)
    elif mode == 'checkx':
        broken = check(sys.argv[2]) + check_cross(sys.argv[2])
        sys.exit(1 if broken else 0)
