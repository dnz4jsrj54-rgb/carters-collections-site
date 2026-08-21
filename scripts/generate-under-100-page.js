#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'assets/js/app.js'), 'utf8');
const catalogEnd = appSource.indexOf(
  '// ============================================================\n// Persistent cart state'
);
const sandbox = { window: {} };
vm.runInNewContext(appSource.slice(0, catalogEnd), sandbox);

const products = Object.values(sandbox.window.CARTER_CATALOG)
  .filter(product => product.cat === 'fragrance' && product.price < 100)
  .sort((a, b) => (a.soldOut ? 1 : 0) - (b.soldOut ? 1 : 0) || a.price - b.price || a.name.localeCompare(b.name));

function money(value) {
  return Number(value).toFixed(2);
}

function escapeHTML(value) {
  return String(value || '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function imagePath(value) {
  return '../' + String(value || '').replace(/^(\.\.\/)+/, '');
}

function brand(product) {
  return String(product.subtitle || '').replace(/^by\s+/i, '');
}

function card(product) {
  const availability = product.soldOut ? 'OutOfStock' : 'InStock';
  const action = product.soldOut
    ? '<button class="add-to-cart-btn" disabled aria-disabled="true">Sold Out</button>'
    : `<button class="add-to-cart-btn" data-add="${escapeHTML(product.id)}">Add</button>`;
  return `          <article class="product-card" data-product="${escapeHTML(product.id)}" itemscope itemtype="https://schema.org/Product">
            <a href="${escapeHTML(product.detail)}" class="product-card-media${product.imageFit === 'contain' ? ' is-contain' : ''}" itemprop="url">
              <img src="${escapeHTML(imagePath(product.image))}" alt="${escapeHTML(product.name)} — ${escapeHTML(product.notes)}" loading="lazy" itemprop="image" />
            </a>
            <div class="product-card-body">
              <a href="${escapeHTML(product.detail)}" class="product-card-name" itemprop="url"><span itemprop="name">${escapeHTML(product.name)}</span><span class="product-card-sub">${escapeHTML(product.subtitle || '')}</span></a>
              <meta itemprop="brand" content="${escapeHTML(brand(product))}" />
              <div class="product-card-notes">${escapeHTML(product.notes)}</div>
              <div class="product-card-foot">
                <span class="product-card-price${product.oldPrice ? ' has-sale' : ''}" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                  ${product.oldPrice ? `<span class="old">$${money(product.oldPrice)}</span>` : ''}<span class="now" itemprop="price" content="${money(product.price)}">$${money(product.price)}</span>
                  <meta itemprop="priceCurrency" content="USD" />
                  <link itemprop="availability" href="https://schema.org/${availability}" />
                </span>
                ${action}
              </div>
            </div>
          </article>`;
}

const itemList = products.map((product, index) => ({
  '@type': 'ListItem',
  position: index + 1,
  url: `https://carterscollections.com/pages/${product.detail}`,
  name: product.name
}));

const page = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Fragrances Under $100 — Carter's Collections</title>
  <meta name="description" content="Shop authentic designer, niche, and viral fragrances under $100. Explore ${products.length} men's, women's, and unisex scents shipped from Austin." />
  <meta property="og:title" content="Fragrances Under $100 — Carter's Collections" />
  <meta property="og:description" content="${products.length} authentic designer, niche, and viral fragrances priced under $100." />
  <meta property="og:image" content="https://carterscollections.com/assets/real-products/m17_1.jpg" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://carterscollections.com/pages/fragrances-under-100.html" />
  <meta property="og:site_name" content="Carter's Collections" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@carterscollection" />
  <meta name="twitter:title" content="Fragrances Under $100 — Carter's Collections" />
  <meta name="twitter:description" content="${products.length} authentic designer, niche, and viral fragrances priced under $100." />
  <meta name="twitter:image" content="https://carterscollections.com/assets/real-products/m17_1.jpg" />
  <link rel="canonical" href="https://carterscollections.com/pages/fragrances-under-100.html" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="theme-color" content="#0F0E0C" />
  <link rel="icon" type="image/svg+xml" href="../assets/images/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/style.css?v=202607261635" />
  <link rel="stylesheet" href="../assets/css/under-100.css?v=202607261900" />
  <script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Fragrances Under $100',
  description: `Authentic designer, niche, and viral fragrances priced under $100 at Carter's Collections.`,
  url: 'https://carterscollections.com/pages/fragrances-under-100.html',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: products.length,
    itemListElement: itemList
  }
}, null, 2)}
  </script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-YWY8CMZ40F"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-YWY8CMZ40F');
  </script>
</head>
<body>
  <div id="header-slot"></div>

  <main>
    <section class="page-header under-100-header">
      <div class="container reveal">
        <span class="eyebrow">The Smart-Scent Edit</span>
        <h1>Fragrances under $100.</h1>
        <p class="lede">Designer signatures, niche discoveries, and viral favorites—each currently priced below $100. Authentic, factory-sealed, and shipped from Austin.</p>
        <div class="under-100-links" aria-label="Browse related fragrance collections">
          <a href="fragrances-men.html">Shop men's fragrance</a>
          <a href="fragrances-women.html">Shop women's fragrance</a>
        </div>
      </div>
    </section>

    <section class="section-tight under-100-guide">
      <div class="container">
        <div class="under-100-guide-grid">
          <div>
            <span class="eyebrow">How to choose</span>
            <h2>Start with the mood.</h2>
          </div>
          <p><strong>Fresh and easy:</strong> citrus, aquatic, and clean musk notes suit daytime and warm weather. <strong>Warm and memorable:</strong> vanilla, amber, spice, and woods feel richer for evenings. Use the notes beneath each bottle to narrow the edit, then visit the product page for the full profile.</p>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="under-100-count reveal"><span>${products.length} fragrances</span><span>All currently under $100</span></div>
        <div class="product-grid" id="grid">
${products.map(card).join('\n')}
        </div>
      </div>
    </section>

    <section class="under-100-faq section-tight">
      <div class="container">
        <span class="eyebrow">Good to know</span>
        <h2>Shopping fragrance under $100</h2>
        <div class="under-100-faq-grid">
          <div><h3>Are these fragrances authentic?</h3><p>Yes. Carter's Collections sells authentic products sourced for the boutique and ships orders from Austin, Texas.</p></div>
          <div><h3>Why are some bottles below retail?</h3><p>Pricing can reflect sourcing, inventory timing, and limited availability. The current selling price and displayed original price appear on each product page.</p></div>
          <div><h3>Can fragrance be returned?</h3><p>Unopened fragrance with its factory seal intact may be returned within 30 days of delivery. Review the <a href="return-policy.html">return policy</a> for complete conditions.</p></div>
        </div>
      </div>
    </section>

    <section class="newsletter section-tight">
      <div class="container reveal">
        <span class="eyebrow">Stay In Touch</span>
        <h2>Letters from the atelier</h2>
        <p>A quiet quarterly note—new arrivals, the perfumer's bench, and seasonal edits.</p>
        <form class="newsletter-form" name="newsletter" method="POST" novalidate>
          <input type="hidden" name="form-name" value="newsletter" />
          <p class="hidden" style="display:none"><label>Don’t fill this out: <input name="bot-field" /></label></p>
          <input type="email" name="email" placeholder="Your email" aria-label="Email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  </main>

  <div id="footer-slot"></div>
  <script src="../assets/js/layout.js?v=202607311842"></script>
  <script src="../assets/js/app.js?v=202607262230"></script>
  <script>
    bindAddButtons();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'pages/fragrances-under-100.html'), page);
console.log(`Generated ${products.length} products in pages/fragrances-under-100.html`);
