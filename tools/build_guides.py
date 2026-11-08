#!/usr/bin/env python3
"""Generate guide pages, the guides index, and sitemap.xml for NeverShips.
Run from the repo root: python3 tools/build_guides.py
"""
import html, os, sys
from datetime import date
sys.path.insert(0, os.path.dirname(__file__))
from articles import ARTICLES

SITE = "https://neverships.dpdns.org"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BY = {a["slug"]: a for a in ARTICLES}
CAT_ORDER = ["Scams", "Shipping", "Smart buying", "Buyer's guides", "After the purchase"]


def head(title, desc, prefix, canonical):
    e = html.escape
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="google-adsense-account" content="ca-pub-7804394701272579" />
  <title>{e(title)} — NeverShips</title>
  <meta name="description" content="{e(desc)}" />
  <link rel="canonical" href="{canonical}" />
  <meta property="og:title" content="{e(title)}" />
  <meta property="og:description" content="{e(desc)}" />
  <meta property="og:type" content="article" />
  <link rel="icon" href="{prefix}favicon.svg" type="image/svg+xml" />
  <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@500,700,800&f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="{prefix}styles.css" />
  <script src="{prefix}config.js"></script>
  <script src="{prefix}ads.js" defer></script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header"><div class="wrap header-row">
    <a href="{prefix}index.html" class="brand" aria-label="NeverShips home"><span class="brand-word">Never<span>Ships</span></span><span class="brand-tag">tech that never comes</span></a>
    <nav class="page-nav" aria-label="Main"><a href="{prefix}guides.html">Guides</a><a href="{prefix}about.html">About</a></nav>
    <a href="{prefix}index.html#shop" class="cart-btn" style="text-decoration:none">Back to the store</a>
  </div></header>
"""


def foot(prefix):
    p = prefix
    return f"""  <footer class="site-footer"><div class="wrap footer-row">
    <div><span class="brand-word">Never<span>Ships</span></span><p class="small muted">A parody website for entertainment. Not a store. No products are sold, no payments are processed, and no items are shipped. All brands and products named are fictional. The shopping guides are real.</p></div>
    <nav class="footer-links" aria-label="Footer"><a href="{p}index.html">Store</a><a href="{p}guides.html">Guides</a><a href="{p}about.html">About</a><a href="{p}contact.html">Contact</a><a href="{p}privacy.html">Privacy policy</a><a href="{p}terms.html">Terms</a></nav>
  </div></footer>
</body>
</html>
"""


def nice_date(s):
    d = date.fromisoformat(s)
    return d.strftime("%B %-d, %Y")


def words(body):
    import re
    return len(re.sub(r"<[^>]+>", " ", body).split())


def article_page(a):
    mins = max(3, round(words(a["body"]) / 220))
    rel = "".join(
        f'<a class="guide" href="{r}.html"><span class="mono small muted">{html.escape(BY[r]["cat"]).upper()}</span><h3>{html.escape(BY[r]["title"])}</h3><p>{html.escape(BY[r]["desc"])}</p></a>'
        for r in a["related"])
    ld = ('{"@context":"https://schema.org","@type":"Article","headline":%s,"description":%s,'
          '"datePublished":"%s","dateModified":"%s","author":{"@type":"Organization","name":"NeverShips"},'
          '"publisher":{"@type":"Organization","name":"NeverShips"},"mainEntityOfPage":"%s/guides/%s.html"}') % (
        json_str(a["title"]), json_str(a["desc"]), a["date"], a["date"], SITE, a["slug"])
    return head(a["title"], a["desc"], "../", f"{SITE}/guides/{a['slug']}.html") + f"""  <main id="main" class="wrap page article">
    <nav class="crumbs mono small" aria-label="Breadcrumb"><a href="../guides.html">Guides</a> <span aria-hidden="true">/</span> {html.escape(a["cat"])}</nav>
    <h1>{html.escape(a["title"])}</h1>
    <p class="lede">{html.escape(a["desc"])}</p>
    <p class="byline mono small">By the NeverShips team · Updated <time datetime="{a["date"]}">{nice_date(a["date"])}</time> · {mins} min read</p>
{a["body"]}
    <aside class="note small"><strong>About this guide.</strong> NeverShips is a parody store, but our guides are genuine, general consumer advice written to help you shop safely. They aren't legal or financial advice; rules and protections vary by country, card issuer, and retailer, so check the specific terms that apply to you.</aside>
    <section class="related" aria-labelledby="related-h"><h2 id="related-h">Keep reading</h2><div class="guide-list related-list">{rel}</div></section>
    <div class="ad-slot" data-ad="footer" data-format="horizontal"></div>
  </main>
  <script type="application/ld+json">{ld}</script>
""" + foot("../")


def json_str(s):
    import json
    return json.dumps(s)


def index_page():
    desc = "Practical, genuine advice for buying tech online: spotting scams, handling missing packages, timing purchases, and choosing the right device."
    sections = []
    for c in CAT_ORDER:
        items = [a for a in ARTICLES if a["cat"] == c]
        if not items:
            continue
        cards = "".join(
            f'<a class="guide" href="guides/{a["slug"]}.html"><h3>{html.escape(a["title"])}</h3><p>{html.escape(a["desc"])}</p></a>'
            for a in items)
        sections.append(f'<section class="guide-cat"><h2>{html.escape(c)}</h2><div class="guide-grid">{cards}</div></section>')
    return head("Shopping guides", desc, "", f"{SITE}/guides.html") + f"""  <main id="main" class="wrap page page-wide">
    <p class="eyebrow mono">Real advice, for once</p>
    <h1>Shopping guides that actually help</h1>
    <p class="lede">Everything else on NeverShips is a joke. These aren't. They're practical guides for buying real tech without getting burned, written in plain language and updated as things change.</p>
    {sections[0]}
    <div class="ad-slot" data-ad="catalog" data-format="auto"></div>
    {''.join(sections[1:])}
    <div class="ad-slot" data-ad="footer" data-format="horizontal"></div>
  </main>
""" + foot("")


def contact_page():
    desc = "How to reach the people behind NeverShips: questions, corrections to our guides, and press."
    return head("Contact", desc, "", f"{SITE}/contact.html") + """  <main id="main" class="wrap page">
    <p class="eyebrow mono">Contact</p>
    <h1>Get in touch</h1>
    <p class="lede">NeverShips is a small, independent parody site. We read every message, though we can't promise a reply as fast as our drivers promise a delivery.</p>
    <h2>Before you write</h2>
    <ul>
      <li><strong>Did you place an order?</strong> It isn't coming. Nothing on NeverShips is for sale, no payment was taken, and nothing will ship. See our <a href="about.html">About page</a>.</li>
      <li><strong>Need help with a real order from another store?</strong> Contact that store directly. Our guide to <a href="guides/package-delivered-not-received.html">missing packages</a> explains what to do.</li>
    </ul>
    <h2>How to reach us</h2>
    <p class="contact-email">Email us at <a href="mailto:ratgalactic@gmail.com?subject=NeverShips">ratgalactic@gmail.com</a></p>
    <p>Write to us about:</p>
    <ul>
      <li>Corrections or suggestions for our shopping guides.</li>
      <li>Bug reports and accessibility problems.</li>
      <li>Ideas for new fake products or real guides.</li>
      <li>Privacy questions, press, and partnership inquiries.</li>
    </ul>
    <p>Please don't send payment details or other sensitive information. You can also report bugs publicly on our <a href="https://github.com/divebombdom/neverships/issues" rel="noopener">GitHub project page</a>.</p>
    <h2>Advertising</h2>
    <p>Ads on NeverShips are served by Google AdSense. We don't sell ad space directly. You can read how ads and cookies work on this site in our <a href="privacy.html">privacy policy</a>.</p>
  </main>
""" + foot("")


def sitemap():
    today = max(a["date"] for a in ARTICLES)
    urls = [("", "1.0"), ("guides.html", "0.9"), ("about.html", "0.5"), ("contact.html", "0.4"),
            ("privacy.html", "0.3"), ("terms.html", "0.3")]
    urls += [(f"guides/{a['slug']}.html", "0.8") for a in ARTICLES]
    body = "".join(f"  <url><loc>{SITE}/{u}</loc><lastmod>{today}</lastmod><priority>{p}</priority></url>\n" for u, p in urls)
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}</urlset>\n'


def main():
    os.makedirs(os.path.join(ROOT, "guides"), exist_ok=True)
    for a in ARTICLES:
        for r in a["related"]:
            assert r in BY, r
        with open(os.path.join(ROOT, "guides", a["slug"] + ".html"), "w") as f:
            f.write(article_page(a))
        print(a["slug"], words(a["body"]), "words")
    open(os.path.join(ROOT, "guides.html"), "w").write(index_page())
    open(os.path.join(ROOT, "contact.html"), "w").write(contact_page())
    open(os.path.join(ROOT, "sitemap.xml"), "w").write(sitemap())


if __name__ == "__main__":
    main()
