import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://carterscollections.com';

const nativeVariants = [
  ['Coconut & Vanilla Whole Body - 2.4 oz', 'assets/body-care/native/01-coconut-vanilla-whole-body.jpg'],
  ['Palm Leaf & Agave - 3.1 oz', 'assets/body-care/native/02-palm-leaf-agave-3-1oz.jpg'],
  ['Honey & White Oak - 3.1 oz', 'assets/body-care/native/03-honey-white-oak-3-1oz.jpg'],
  ['Sea Salt & Cedar - 3.1 oz', 'assets/body-care/native/04-sea-salt-cedar-3-1oz.jpg'],
  ['Cashmere & Rain - 3.1 oz', 'assets/body-care/native/05-cashmere-rain-3-1oz.jpg'],
  ['Coconut & Vanilla - 3.1 oz', 'assets/body-care/native/06-coconut-vanilla-3-1oz.jpg'],
  ['Ocean & Timber - 3.1 oz', 'assets/body-care/native/07-ocean-timber-3-1oz.jpg'],
  ['Pomelo & Spring Rain - 2.65 oz', 'assets/body-care/native/08-pomelo-spring-rain-2-65oz.jpg'],
  ['Vanilla & Sandalwood - 2.65 oz', 'assets/body-care/native/09-vanilla-sandalwood-2-65oz.jpg'],
  ['Cucumber & Mint - 2.65 oz', 'assets/body-care/native/10-cucumber-mint-2-65oz.jpg'],
  ['Cashmere & Rain - 2.65 oz', 'assets/body-care/native/11-cashmere-rain-2-65oz.jpg'],
  ['Sea Salt & Cedar Twin Pack - 2 x 2.3 oz', 'assets/body-care/native/12-sea-salt-cedar-twin-pack.jpg'],
  ['Lavender & Rose - 2.65 oz', 'assets/body-care/native/13-lavender-rose-2-65oz.jpg'],
  ['Lilac & White Tea - 2.65 oz', 'assets/body-care/native/14-lilac-white-tea-2-65oz.jpg'],
  ['Eucalyptus & Mint - 2.65 oz', 'assets/body-care/native/15-eucalyptus-mint-2-65oz.jpg'],
  ['Sea Salt & Cedar - 2.65 oz', 'assets/body-care/native/16-sea-salt-cedar-2-65oz.jpg'],
].map(([label, image]) => ({ label, image }));

const products = [
  {
    id: 'bc1',
    slug: 'product-native-deodorant.html',
    name: 'Aluminum-Free Deodorant Stick',
    brand: 'Native',
    eyebrow: 'Body Care · Multiple Scents and Sizes',
    price: 10.99,
    badge: '16 Options',
    mainImage: nativeVariants[0].image,
    variants: nativeVariants,
    description: 'Choose from 16 Native deodorant options, including classic aluminum-free sticks, a whole-body formula, and a Sea Salt & Cedar twin pack. Every option is clearly labeled with its scent and size so you can order the exact item you want.',
    bullets: [
      'Aluminum-free deodorant options from Native',
      'Sixteen scent-and-size combinations',
      'Includes classic sticks, whole-body deodorant, and one twin-pack option',
      'New, retail-packaged product; packaging may vary slightly',
    ],
    detailsTitle: 'Choose your option',
    details: 'Select a scent and size before adding the item to your cart. The product photo updates to match your selection.',
  },
  {
    id: 'bc2',
    slug: 'product-native-discovery-set.html',
    name: 'Deodorant Discovery Set 4-Pack',
    brand: 'Native',
    eyebrow: 'Body Care · Four 2.65 oz Sticks',
    price: 49.99,
    oldPrice: 56.00,
    badge: '4-Pack',
    mainImage: 'assets/body-care/native-discovery/main.jpg',
    variants: [
      { label: 'Top Sellers', image: 'assets/body-care/native-discovery/top-sellers.jpg' },
      { label: 'Vanilla', image: 'assets/body-care/native-discovery/vanilla.jpg' },
    ],
    description: 'A ready-to-gift set of four full-size Native deodorant sticks. Choose the Top Sellers assortment for a mix of customer favorites or the Vanilla assortment for a warmer, sweeter scent wardrobe.',
    bullets: [
      'Four full-size deodorant sticks per set',
      '2.65 oz each',
      'Choose Top Sellers or Vanilla',
      'Aluminum-free formula with 72-hour odor protection, as labeled',
    ],
    detailsTitle: 'Two curated sets',
    details: 'Top Sellers offers a broad mix of popular Native scents. Vanilla is the warmer option for shoppers who prefer creamy, gourmand profiles.',
  },
  {
    id: 'bc3',
    slug: 'product-dr-squatch-coconut-castaway.html',
    name: 'Coconut Castaway Invisible Glide Deodorant',
    brand: 'Dr. Squatch',
    eyebrow: 'Body Care · 2.65 oz',
    price: 10.99,
    badge: 'Invisible Glide',
    mainImage: 'assets/body-care/dr-squatch/coconut-castaway-invisible-glide.jpg',
    variants: [{ label: 'Coconut Castaway · 2.65 oz', image: 'assets/body-care/dr-squatch/coconut-castaway-invisible-glide.jpg' }],
    description: 'Dr. Squatch Coconut Castaway Invisible Glide delivers a tropical, coconut-forward scent in a smooth 2.65 oz deodorant stick. This listing is for Coconut Castaway only, with no scent substitutions.',
    bullets: [
      'Coconut Castaway scent',
      'Invisible Glide format',
      '2.65 oz deodorant stick',
      'Single item; no variations',
    ],
    detailsTitle: 'The scent',
    details: 'Creamy coconut and fresh island-inspired notes create an easy everyday profile that feels clean, warm, and relaxed.',
  },
  {
    id: 'bc4',
    slug: 'product-dr-squatch-natural-deodorant.html',
    name: "Natural Men's Deodorant",
    brand: 'Dr. Squatch',
    eyebrow: 'Body Care · Six Scent Options',
    price: 9.99,
    oldPrice: 13.00,
    badge: 'Bestseller',
    mainImage: 'assets/body-care/dr-squatch/six-scents-main.jpg',
    variants: [
      { label: 'Wood Barrel Bourbon', image: 'assets/body-care/dr-squatch/wood-barrel-bourbon.jpg' },
      { label: 'Fresh Falls', image: 'assets/body-care/dr-squatch/fresh-falls.jpg' },
      { label: 'Coastal Mist', image: 'assets/body-care/dr-squatch/coastal-mist.jpg' },
      { label: 'Cool Fresh Aloe', image: 'assets/body-care/dr-squatch/cool-fresh-aloe.jpg' },
      { label: 'Mountain Meadow', image: 'assets/body-care/dr-squatch/mountain-meadow.jpg' },
      { label: 'Coconut Castaway', image: 'assets/body-care/dr-squatch/coconut-castaway.jpg' },
    ],
    description: 'Choose from six Dr. Squatch deodorant scents at the same $9.99 price. Each option uses the brand\'s aluminum-free deodorant format and is labeled for 72-hour odor protection.',
    bullets: [
      'Six scent options',
      'Aluminum-free deodorant',
      '72-hour odor protection, as labeled',
      'Select your scent before adding to cart',
    ],
    detailsTitle: 'Pick your scent',
    details: 'Go warm with Wood Barrel Bourbon or Coconut Castaway, crisp with Fresh Falls or Coastal Mist, cooling with Cool Fresh Aloe, or green and outdoorsy with Mountain Meadow.',
  },
];

function money(value) {
  return Number(value).toFixed(2);
}

function absoluteAsset(assetPath) {
  return `${ORIGIN}/${assetPath.replace(/^\/+/, '')}`;
}

function storeSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: "Carter's Collections",
    url: ORIGIN,
    logo: `${ORIGIN}/assets/images/favicon.svg`,
    image: `${ORIGIN}/assets/images/hero.jpg`,
    description: 'An independent Austin boutique offering authentic fragrance, body care, accessories, and considered womenswear.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
  };
}

function productSchema(product) {
  const url = `${ORIGIN}/pages/${product.slug}`;
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    image: absoluteAsset(product.mainImage),
    description: product.description,
    sku: product.id,
    productID: product.id,
    category: 'Health & Beauty > Personal Care > Deodorant & Antiperspirant',
    url,
    additionalProperty: product.variants.length > 1 ? [{
      '@type': 'PropertyValue',
      name: 'Available options',
      value: product.variants.map(variant => variant.label).join(', '),
    }] : undefined,
    offers: {
      '@type': 'Offer',
      url,
      price: money(product.price),
      priceCurrency: 'USD',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: "Carter's Collections" },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        hasShippingService: { '@id': `${ORIGIN}/pages/shipping-policy.html#us-standard-shipping` },
      },
      hasMerchantReturnPolicy: { '@id': `${ORIGIN}/pages/return-policy.html#standard-return-policy` },
    },
  };
}

function head({ title, description, url, image, schema }) {
  return `  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${url}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="theme-color" content="#0F0E0C" />
  <meta property="og:type" content="product" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:site_name" content="Carter's Collections" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <link rel="icon" type="image/svg+xml" href="../assets/images/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/style.css?v=20260817" />
  <link rel="stylesheet" href="../assets/css/body-care.css?v=20260817" />
  <script type="application/ld+json">${JSON.stringify(storeSchema(), null, 2)}</script>
  <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-YWY8CMZ40F"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-YWY8CMZ40F');
  </script>`;
}

function priceMarkup(product) {
  if (!product.oldPrice) {
    return `<div class="product-info product-price" style="margin:14px 0 18px;font-family:var(--font-display);font-size:1.8rem;color:var(--gold);">$${money(product.price)}</div>`;
  }
  const percentage = Math.round((1 - product.price / product.oldPrice) * 100);
  return `<div class="product-detail-price has-sale" style="margin:14px 0 18px;">
          <span class="old">$${money(product.oldPrice)}</span>
          <span class="now" style="font-family:var(--font-display);font-size:1.8rem;">$${money(product.price)}</span>
          <span class="sale-tag">${percentage}% Off</span>
        </div>`;
}

function uniqueGallery(product) {
  const images = [product.mainImage, ...product.variants.map(variant => variant.image)];
  return [...new Set(images)];
}

function productPage(product) {
  const url = `${ORIGIN}/pages/${product.slug}`;
  const title = `${product.name} by ${product.brand} — Carter's Collections`;
  const metaDescription = `${product.name} by ${product.brand}. $${money(product.price)} with free U.S. shipping from Carter's Collections.`;
  const gallery = uniqueGallery(product);
  const hasChoices = product.variants.length > 1;
  const optionMarkup = hasChoices ? `
        <div class="variant-picker">
          <div class="variant-picker-head">
            <span class="label-sm">Choose an option</span>
            <span class="variant-picker-note" id="variant-status">Selection required</span>
          </div>
          <div class="variant-grid" id="variant-grid">
            ${product.variants.map((variant, index) => `<button class="variant-pill" type="button" data-index="${index}" aria-pressed="false">${variant.label}</button>`).join('\n            ')}
          </div>
        </div>` : '';

  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
${head({ title, description: metaDescription, url, image: absoluteAsset(product.mainImage), schema: productSchema(product) })}
</head>
<body>
  <div id="header-slot"></div>
  <main>
    <section class="container product-detail">
      <div class="product-gallery">
        <div class="product-gallery-main is-contain">
          <span class="product-badge">${product.badge}</span>
          <img id="main-img" src="../${product.mainImage}" alt="${product.name} by ${product.brand}" />
        </div>
        <div class="product-gallery-thumbs body-care-gallery-thumbs">
          ${gallery.map((image, index) => `<button class="product-gallery-thumb is-contain${index === 0 ? ' is-active' : ''}" data-img="../${image}" aria-label="View product image ${index + 1}"><img src="../${image}" alt="" loading="lazy" /></button>`).join('\n          ')}
        </div>
      </div>

      <div class="product-info">
        <span class="eyebrow">${product.eyebrow}</span>
        <h1>${product.name}<span style="display:block;font-family:var(--font-display);font-style:italic;font-size:1.4rem;color:var(--text-muted);letter-spacing:0;margin-top:4px;text-transform:none;">by ${product.brand}</span></h1>
        ${priceMarkup(product)}
        <p class="product-desc">${product.description}</p>
        <ul class="product-bullets" style="list-style:none;padding:0;margin:22px 0 8px;color:var(--text-muted);font-size:0.92rem;line-height:1.8;">
          ${product.bullets.map(bullet => `<li>— ${bullet}</li>`).join('\n          ')}
        </ul>
        ${optionMarkup}
        <div class="qty-row" style="margin-top:24px;">
          <span class="label-sm">Quantity</span>
          <div class="qty-stepper">
            <button id="qty-down" aria-label="Decrease quantity">−</button>
            <span class="qty-value" id="qty-value">1</span>
            <button id="qty-up" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cta-row">
          <button class="btn btn-primary" id="add-btn"${hasChoices ? ' disabled aria-disabled="true"' : ''}>${hasChoices ? 'Choose an Option' : 'Add to Cart'}</button>
          <button class="btn btn-ghost" id="wish-btn">♡ Wishlist</button>
        </div>
        <div class="ship-badge" style="margin-top:14px;padding:10px 14px;background:rgba(196,158,88,0.08);border:1px solid rgba(196,158,88,0.25);border-radius:6px;font-size:0.8rem;color:var(--text);display:flex;align-items:center;gap:10px;">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--gold)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v8H3z"/><path d="M14 10h4l3 3v2h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
          <span><strong style="color:var(--gold);">Free U.S. shipping</strong> · U.S. delivery typically 3–5 business days · International free over $299 or $29 flat.</span>
        </div>
        <p class="body-care-disclaimer">For external use only. Follow the directions and ingredient information printed on the product packaging. Stop use if irritation occurs.</p>
        <details class="expandable" open><summary>${product.detailsTitle}</summary><p>${product.details}</p></details>
        <details class="expandable"><summary>Shipping & Returns</summary><p>Free U.S. shipping on every order. Review our return policy for current eligibility and conditions before opening personal-care products.</p></details>
      </div>
    </section>

    <section class="section-tight product-related">
      <div class="container">
        <div class="section-head reveal"><div><span class="eyebrow">More Body Care</span><h2>You may also like</h2></div></div>
        <div class="product-grid product-grid-3" id="related-grid"></div>
      </div>
    </section>
    <section class="section-tight product-pairs">
      <div class="container">
        <div class="section-head reveal"><div><span class="eyebrow">Complete The Order</span><h2>Pairs perfectly with</h2></div></div>
        <div class="product-grid product-grid-3" id="pairs-grid"></div>
      </div>
    </section>
  </main>
  <div id="footer-slot"></div>
  <script src="../assets/js/layout.js?v=20260817"></script>
  <script src="../assets/js/app.js?v=20260817"></script>
  <script>
    const productId = ${JSON.stringify(product.id)};
    const variants = ${JSON.stringify(product.variants)};
    const needsSelection = variants.length > 1;
    const mainImage = document.getElementById('main-img');
    const addButton = document.getElementById('add-btn');
    const variantStatus = document.getElementById('variant-status');
    let selectedVariant = needsSelection ? null : variants[0];
    let qty = 1;

    document.querySelectorAll('.product-gallery-thumb').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.product-gallery-thumb').forEach(item => item.classList.remove('is-active'));
        button.classList.add('is-active');
        mainImage.src = button.getAttribute('data-img');
      });
    });

    document.querySelectorAll('.variant-pill').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.variant-pill').forEach(item => {
          item.classList.remove('is-active');
          item.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');
        selectedVariant = variants[Number(button.getAttribute('data-index'))];
        mainImage.src = '../' + selectedVariant.image;
        mainImage.alt = ${JSON.stringify(`${product.name} by ${product.brand} — `)} + selectedVariant.label;
        document.querySelectorAll('.product-gallery-thumb').forEach(thumb => thumb.classList.toggle('is-active', thumb.getAttribute('data-img') === '../' + selectedVariant.image));
        variantStatus.textContent = selectedVariant.label;
        addButton.disabled = false;
        addButton.removeAttribute('aria-disabled');
        addButton.textContent = 'Add to Cart';
      });
    });

    const qtyValue = document.getElementById('qty-value');
    document.getElementById('qty-down').addEventListener('click', () => { qty = Math.max(1, qty - 1); qtyValue.textContent = qty; });
    document.getElementById('qty-up').addEventListener('click', () => { qty += 1; qtyValue.textContent = qty; });
    addButton.addEventListener('click', () => {
      if (!selectedVariant) return;
      addToCart(productId, qty, selectedVariant.label);
    });
    document.getElementById('wish-btn').addEventListener('click', () => showToast('Saved to wishlist'));

    const related = ['bc1', 'bc2', 'bc3', 'bc4'].filter(id => id !== productId).slice(0, 3);
    const relatedGrid = document.getElementById('related-grid');
    relatedGrid.innerHTML = related.map(id => productCardHTML(CARTER_CATALOG[id])).join('');
    bindAddButtons(relatedGrid);
    renderCrossBundle('pairs-grid', productId);
  </script>
</body>
</html>
`;
}

function collectionPage() {
  const url = `${ORIGIN}/pages/body-care.html`;
  const title = `Body Care — Native & Dr. Squatch Deodorant | Carter's Collections`;
  const description = 'Shop Native and Dr. Squatch deodorants at Carter\'s Collections, including individual sticks, discovery sets, and multiple scent options with free U.S. shipping.';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Body Care',
    description,
    url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${ORIGIN}/pages/${product.slug}`,
        name: `${product.name} by ${product.brand}`,
      })),
    },
  };

  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
${head({ title, description, url, image: absoluteAsset('assets/body-care/dr-squatch/six-scents-main.jpg'), schema })}
</head>
<body>
  <div id="header-slot"></div>
  <main>
    <section class="page-header body-care-header">
      <div class="container reveal">
        <span class="eyebrow">Daily Essentials</span>
        <h1>Body care, chosen well.</h1>
        <p class="lede">Native and Dr. Squatch deodorants in fresh, warm, woody, and clean scent profiles. Every product below mirrors the current Carter's Fragrance Factory TikTok Shop price.</p>
        <div class="body-care-proof"><span>✓ Free U.S. Shipping</span><span>✓ New Retail Products</span><span>✓ Exact Scent Selection</span></div>
      </div>
    </section>
    <section class="container body-care-intro">
      <div><span class="eyebrow">The Body Care Edit</span><h2>Four listings. Plenty of ways to stay fresh.</h2></div>
      <p>Start with a single everyday stick, explore a four-pack discovery set, or choose your scent from the complete Native and Dr. Squatch assortments. Multi-option products open a selection page so the exact scent and size follow the item into checkout.</p>
    </section>
    <section class="section-tight">
      <div class="container">
        <div class="section-head reveal"><div><span class="eyebrow">Shop Body Care</span><h2>Native & Dr. Squatch</h2></div><span class="link">4 listings</span></div>
        <div class="product-grid product-grid-4" id="body-care-grid"></div>
      </div>
    </section>
    <section class="section-tight body-care-faq">
      <div class="container">
        <span class="eyebrow">Good To Know</span><h2>Choosing your deodorant</h2>
        <div class="body-care-faq-grid">
          <div><h3>How do options work?</h3><p>Open any product marked “Options,” choose the exact scent or set, then add it to your cart. Your selection appears in the cart and at checkout.</p></div>
          <div><h3>Is shipping free?</h3><p>Yes. U.S. shipping is free on every order. International shipping is free at $299 or $29 flat below the threshold.</p></div>
          <div><h3>What should I check first?</h3><p>Read the size and format shown beside each option. The Native assortment includes multiple sizes, a whole-body formula, and one twin pack.</p></div>
        </div>
      </div>
    </section>
  </main>
  <div id="footer-slot"></div>
  <script src="../assets/js/layout.js?v=20260817"></script>
  <script src="../assets/js/app.js?v=20260817"></script>
  <script>
    const grid = document.getElementById('body-care-grid');
    grid.innerHTML = ['bc1', 'bc2', 'bc3', 'bc4'].map(id => productCardHTML(CARTER_CATALOG[id], { lazy: false })).join('');
    bindAddButtons(grid);
  </script>
</body>
</html>
`;
}

fs.writeFileSync(path.join(ROOT, 'pages/body-care.html'), collectionPage(), 'utf8');
for (const product of products) {
  fs.writeFileSync(path.join(ROOT, 'pages', product.slug), productPage(product), 'utf8');
}

console.log(`Generated Body Care collection and ${products.length} product pages.`);
