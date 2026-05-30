#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
add_sale_items.py — Used by the twice-daily Jomashop Sale watcher.

Reads a JSON file of NEW qualifying items, appends catalog entries to app.js
(flagged onSale:true), builds detail pages, bumps the cache-bust version across
all HTML, and prints a summary. Does NOT commit/push — the cron does that step
so it can craft the commit message and verify the deploy.

Input JSON: a list of objects with these fields (the watcher must supply them):
{
  "id": "s001",                 # unique id, prefix 's' for sale-watcher items
  "name": "...",
  "brand": "...",
  "cat": "bag" | "fragrance" | "clothing",
  "section": "Women\u2019s Handbags" | "Men\u2019s Bags" | "Wallets & Small Leather Goods" | "",
  "price": 144.99,              # sell price = jomashop cost * (1 + markup), MUST be < oldPrice
  "oldPrice": 250,              # genuine retail / MSRP
  "subtitle": "by Brand",
  "notes": "Leather \u00b7 Black",
  "image": "../assets/real-products/s001_1.jpg",  # local path; image must already be downloaded
  "short_desc": "One-sentence description.",
  "bullets": ["...", "..."],
  "house": "Short brand blurb.",
  "related": ["b1","b2"],
  "detail": "product-<slug>.html"
}

THE RULE (enforced here as a safety net):
  - markup_on_cost between 35% and 45%  (informational; watcher computes price)
  - sell price MUST be strictly below oldPrice (retail). Items failing this are SKIPPED.
  - oldPrice must be present and > 0 (no verifiable retail -> SKIP).
Usage:
  python3 tools/add_sale_items.py /path/to/new_items.json [--version YYYYMMDDHHMM]
"""
import os, sys, re, json, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_JS = os.path.join(ROOT, "assets", "js", "app.js")
PAGES = os.path.join(ROOT, "pages")

DETAIL_TEMPLATE = None  # loaded lazily from an existing template if needed


def fmt(v):
    v = float(v)
    return f"${int(v)}" if v.is_integer() else f"${v:.2f}"


def pct(price, old):
    return round((1 - price / old) * 100)


def load_template():
    # Reuse the original bag-page template from the workspace builder if available;
    # otherwise build a minimal self-contained detail page.
    cand = "/home/user/workspace/build_bag_pages.py"
    if os.path.exists(cand):
        src = open(cand, encoding="utf-8").read()
        m = re.search(r'TEMPLATE = """(.*?)"""', src, re.DOTALL)
        if m:
            return ("file", m.group(1))
    return ("min", None)


def build_detail_page(item, ver):
    kind, tmpl = load_template()
    price = float(item["price"]); old = float(item["oldPrice"])
    pc = pct(price, old)
    badge = item.get("badge") or (f"{pc}% Below Retail" if pc >= 50 else "On Sale")
    if kind == "file":
        bullets_html = "\n".join([f'          <li>\u2014 {b}</li>' for b in item.get("bullets", [])])
        try:
            return tmpl.format(
                id=item["id"], detail=item["detail"], name=item["name"], brand=item["brand"],
                section=item.get("section", ""), price=f"{price:.2f}", price_str=fmt(price),
                old_str=fmt(old), pct=pc, short_desc=item.get("short_desc", ""),
                short_meta=item.get("short_desc", "")[:90], bullets=bullets_html,
                house=item.get("house", ""), related=str(item.get("related", [])).replace("'", '"'),
                badge=badge, kind=item.get("cat", "bag"), ver=ver,
            )
        except (KeyError, IndexError):
            pass  # fall through to minimal
    # Minimal fallback detail page
    return f"""<!doctype html><html lang="en" data-theme="dark"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{item['name']} — Carter's Collections</title>
<link rel="stylesheet" href="../assets/css/style.css?v={ver}">
</head><body><div id="header-slot"></div><main><section class="page-header"><div class="container">
<span class="eyebrow">{badge}</span><h1>{item['name']}</h1>
<p class="lede">{item.get('short_desc','')}</p>
<p><strong>{fmt(price)}</strong> <s>{fmt(old)}</s> — {pc}% below retail</p>
<img src="{item['image']}" alt="{item['name']}" style="max-width:480px;width:100%">
</div></section></main><div id="footer-slot"></div>
<script src="../assets/js/layout.js?v={ver}"></script>
<script src="../assets/js/app.js?v={ver}"></script></body></html>"""


def catalog_entry(item):
    pc = pct(float(item["price"]), float(item["oldPrice"]))
    badge = item.get("badge") or (f"{pc}% Below Retail" if pc >= 50 else "On Sale")
    # JS object string, matching existing schema
    rel = json.dumps(item.get("related", []))
    def esc(s):
        return (s or "").replace("\\", "\\\\").replace("'", "\\'")
    return (
        f"  {item['id']}: {{ id: '{item['id']}', name: '{esc(item['name'])}', "
        f"subtitle: '{esc(item.get('subtitle',''))}', cat: '{item['cat']}', "
        f"section: '{esc(item.get('section',''))}', notes: '{esc(item.get('notes',''))}', "
        f"price: {float(item['price']):.2f}, oldPrice: {float(item['oldPrice']):.2f}, "
        f"image: '{item['image']}', imageFit: 'contain', badge: '{esc(badge)}', "
        f"detail: '{item['detail']}', real: true, onSale: true, "
        f"saleAddedAt: '{datetime.date.today().isoformat()}' }},"
    )


def main():
    if len(sys.argv) < 2:
        print("usage: add_sale_items.py <items.json> [--version YYYYMMDDHHMM]"); sys.exit(1)
    items = json.load(open(sys.argv[1]))
    ver = None
    if "--version" in sys.argv:
        ver = sys.argv[sys.argv.index("--version") + 1]
    if not ver:
        ver = datetime.datetime.utcnow().strftime("%Y%m%d%H%M")

    src = open(APP_JS, encoding="utf-8").read()
    existing_ids = set(re.findall(r'\b([a-z]\d+):\s*\{', src))

    added, skipped = [], []
    entries = []
    for it in items:
        # --- RULE ENFORCEMENT (safety net) ---
        try:
            price = float(it["price"]); old = float(it.get("oldPrice") or 0)
        except (TypeError, ValueError):
            skipped.append((it.get("name", "?"), "bad price/oldPrice")); continue
        if old <= 0:
            skipped.append((it.get("name", "?"), "no verifiable retail")); continue
        if price >= old:
            skipped.append((it.get("name", "?"), "sell price not below retail")); continue
        if it["id"] in existing_ids:
            skipped.append((it.get("name", "?"), f"duplicate id {it['id']}")); continue
        if not os.path.exists(os.path.join(ROOT, it["image"].replace("../", ""))):
            skipped.append((it.get("name", "?"), "image missing")); continue
        entries.append(catalog_entry(it))
        # detail page
        with open(os.path.join(PAGES, it["detail"]), "w", encoding="utf-8") as f:
            f.write(build_detail_page(it, ver))
        added.append((it["id"], it["name"], pct(price, old)))

    if entries:
        # insert before the final closing of the catalog object.
        # The catalog object ends with a line containing just '};'
        m = re.search(r'\n\};\s*\n', src)
        if not m:
            print("ERROR: could not find catalog object close '};'"); sys.exit(2)
        insert_at = m.start()
        src = src[:insert_at] + "\n" + "\n".join(entries) + src[insert_at:]
        open(APP_JS, "w", encoding="utf-8").write(src)

    # bump cache version across all HTML
    bumped = 0
    for dirpath, _, files in os.walk(ROOT):
        if "/.git" in dirpath:
            continue
        for fn in files:
            if fn.endswith(".html"):
                fp = os.path.join(dirpath, fn)
                txt = open(fp, encoding="utf-8").read()
                new = re.sub(r'v=\d{12}', f'v={ver}', txt)
                if new != txt:
                    open(fp, "w", encoding="utf-8").write(new); bumped += 1

    print(json.dumps({
        "version": ver,
        "added": added,
        "skipped": skipped,
        "html_files_bumped": bumped,
    }, indent=2))


if __name__ == "__main__":
    main()
