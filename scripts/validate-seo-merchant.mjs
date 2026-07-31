import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const pagesDir = path.join(root, 'pages');
const shippingPolicyId = 'https://carterscollections.com/pages/shipping-policy.html#us-standard-shipping';
const returnPolicyId = 'https://carterscollections.com/pages/return-policy.html#standard-return-policy';
const priorityPages = new Map([
  ['pages/product-dior-sauvage.html', ['Dior', 'Sauvage', '100ml']],
  ['pages/product-glossier-you.html', ['Glossier', 'You', '50ml']],
  ['pages/product-kayali-vanilla-28.html', ['Kayali', 'Vanilla 28', '100ml']],
  ['pages/product-pdm-delina-exclusif.html', ['Parfums de Marly', 'Delina Exclusif', '75ml']],
]);

function fail(message) {
  throw new Error(message);
}

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(absolute);
    return entry.name.endsWith('.html') ? [absolute] : [];
  });
}

function jsonLdObjects(html, filename) {
  return [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      fail(`${filename}: invalid JSON-LD: ${error.message}`);
    }
  });
}

function productFromHtml(html, filename) {
  return jsonLdObjects(html, filename).find((value) => value['@type'] === 'Product');
}

function offersList(offers) {
  return Array.isArray(offers) ? offers : [offers];
}

function invariantSnapshot(product) {
  return {
    sku: product.sku,
    productID: product.productID,
    url: product.url,
    offers: offersList(product.offers).map((offer) => ({
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      availability: offer.availability,
      itemCondition: offer.itemCondition,
      url: offer.url,
    })),
  };
}

function metaContent(html, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.match(new RegExp(`<meta\\s+${escaped}\\s+content="([^"]*)"`, 'i'))?.[1];
}

const files = htmlFiles(root);
let jsonLdCount = 0;
let productCount = 0;
let internalLinkCount = 0;

for (const file of files) {
  const relative = path.relative(root, file);
  const html = fs.readFileSync(file, 'utf8');
  const objects = jsonLdObjects(html, relative);
  jsonLdCount += objects.length;
  const product = objects.find((value) => value['@type'] === 'Product');
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"'#]+)["']/gi)) {
    let target = match[1].replace(/&amp;/g, '&').split(/[?#]/)[0];
    if (!target || target.includes('${') || /^(?:mailto:|tel:|sms:|javascript:|data:|\/\/)/i.test(target)) continue;
    if (/^https?:\/\//i.test(target)) {
      const url = new URL(target);
      if (!/(^|\.)carterscollections\.com$/i.test(url.hostname)) continue;
      target = url.pathname;
    }

    internalLinkCount += 1;
    let resolved = target === '/'
      ? path.join(root, 'index.html')
      : target.startsWith('/')
        ? path.join(root, target.slice(1))
        : path.resolve(path.dirname(file), target);
    if (resolved.endsWith(path.sep)) resolved = path.join(resolved, 'index.html');
    if (!resolved.startsWith(root) || !fs.existsSync(resolved)) fail(`${relative}: missing local target ${match[1]}`);
  }

  const excluded = new Set(['pages/cart.html', 'pages/checkout-success.html', 'pages/product.html']);
  if (!excluded.has(relative)) {
    const expectedUrl = relative === 'index.html'
      ? 'https://carterscollections.com/'
      : `https://carterscollections.com/${relative}`;
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    const ogUrl = metaContent(html, 'property="og:url"');
    if (canonical && canonical !== expectedUrl) fail(`${relative}: canonical URL mismatch`);
    if (ogUrl && ogUrl !== expectedUrl) fail(`${relative}: Open Graph URL mismatch`);
    if (canonical && ogUrl && canonical !== ogUrl) fail(`${relative}: canonical and Open Graph URLs disagree`);
  }

  if (!product) continue;

  productCount += 1;
  if (!product.description?.trim()) fail(`${relative}: Product description is missing`);
  if (product.category === 'Beauty > Fragrance' && !product.sku && !product.productID) {
    fail(`${relative}: fragrance Product identifier is missing`);
  }
  if (!String(product.image).startsWith('https://carterscollections.com/')) fail(`${relative}: Product image is not absolute`);
  if (!String(product.url).startsWith('https://carterscollections.com/')) fail(`${relative}: Product URL is not absolute`);

  for (const offer of offersList(product.offers)) {
    if (offer.shippingDetails?.hasShippingService?.['@id'] !== shippingPolicyId) {
      fail(`${relative}: Offer does not reference the shipping policy`);
    }
    if (offer.hasMerchantReturnPolicy?.['@id'] !== returnPolicyId) {
      fail(`${relative}: Offer does not reference the return policy`);
    }
  }

  const beforeHtml = execFileSync('git', ['show', `origin/main:${relative}`], { cwd: root, encoding: 'utf8' });
  const beforeProduct = productFromHtml(beforeHtml, `origin/main:${relative}`);
  if (JSON.stringify(invariantSnapshot(beforeProduct)) !== JSON.stringify(invariantSnapshot(product))) {
    fail(`${relative}: price, availability, currency, condition, product ID, or canonical offer URL changed`);
  }
}

for (const [relative, terms] of priorityPages) {
  const html = fs.readFileSync(path.join(root, relative), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '';
  const description = metaContent(html, 'name="description"') ?? '';
  const ogTitle = metaContent(html, 'property="og:title"') ?? '';
  const twitterTitle = metaContent(html, 'name="twitter:title"') ?? '';
  const h1 = html.match(/<h1>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ?? '';

  for (const term of terms) {
    for (const [label, value] of Object.entries({ title, ogTitle, twitterTitle, h1 })) {
      if (!value.toLowerCase().includes(term.toLowerCase())) fail(`${relative}: ${label} is missing “${term}”`);
    }
  }
  if (/\$|on sale|sale from/i.test(description)) fail(`${relative}: meta description contains volatile price copy`);
  if (metaContent(html, 'property="og:type"') !== 'product') fail(`${relative}: og:type is not product`);
  for (const selector of ['property="og:image"', 'name="twitter:image"']) {
    if (!metaContent(html, selector)?.startsWith('https://carterscollections.com/')) {
      fail(`${relative}: ${selector} is not an absolute site URL`);
    }
  }
}

const returnPolicy = jsonLdObjects(
  fs.readFileSync(path.join(root, 'pages/return-policy.html'), 'utf8'),
  'pages/return-policy.html',
).find((value) => value['@type'] === 'OnlineStore')?.hasMerchantReturnPolicy;
if (returnPolicy?.['@id'] !== returnPolicyId) fail('Return policy definition is missing');
if (returnPolicy.returnFees !== 'https://schema.org/ReturnFeesCustomerResponsibility') {
  fail('Return policy does not match the published customer-paid change-of-mind return shipping rule');
}

const shippingPolicy = jsonLdObjects(
  fs.readFileSync(path.join(root, 'pages/shipping-policy.html'), 'utf8'),
  'pages/shipping-policy.html',
).find((value) => value['@type'] === 'OnlineStore')?.hasShippingService;
if (shippingPolicy?.['@id'] !== shippingPolicyId) fail('Shipping policy definition is missing');
if (shippingPolicy.shippingConditions?.shippingRate?.value !== 0) fail('U.S. shipping is not marked free');

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (new Set(sitemapUrls).size !== sitemapUrls.length) fail('sitemap.xml contains duplicate URLs');
for (const loc of sitemapUrls) {
  const url = new URL(loc);
  if (url.origin !== 'https://carterscollections.com') fail(`sitemap.xml contains a non-canonical origin: ${loc}`);
  const relative = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  if (!fs.existsSync(path.join(root, relative))) fail(`sitemap.xml points to a missing file: ${loc}`);
  if (/(?:^|\/)(?:cart|checkout-success|api)(?:\.html|\/|$)|\/\.netlify\//.test(url.pathname)) {
    fail(`sitemap.xml contains a private utility URL: ${loc}`);
  }
}

const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
for (const directive of [
  'Disallow: /pages/cart.html',
  'Disallow: /pages/checkout-success.html',
  'Disallow: /api/',
  'Disallow: /.netlify/functions/',
  'Sitemap: https://carterscollections.com/sitemap.xml',
]) {
  if (!robots.includes(directive)) fail(`robots.txt is missing: ${directive}`);
}

const netlify = fs.readFileSync(path.join(root, 'netlify.toml'), 'utf8');
const redirects = [...netlify.matchAll(/\[\[redirects\]\][\s\S]*?from\s*=\s*"([^"]+)"[\s\S]*?to\s*=\s*"([^"]+)"[\s\S]*?status\s*=\s*(\d+)/g)]
  .map((match) => ({ from: match[1], to: match[2], status: Number(match[3]) }));
for (const redirect of redirects.filter((entry) => entry.status === 301)) {
  if (redirect.from === redirect.to) fail(`redirect self-loop: ${redirect.from}`);
  if (redirects.some((entry) => entry.status === 301 && entry.from === redirect.to && entry.to === redirect.from)) {
    fail(`redirect two-way loop: ${redirect.from} and ${redirect.to}`);
  }
}

console.log(`Validated ${jsonLdCount} JSON-LD blocks across ${files.length} HTML pages.`);
console.log(`Validated Merchant policy references and unchanged catalog values on ${productCount} Product pages.`);
console.log(`Validated priority metadata on ${priorityPages.size} Search Console opportunity pages.`);
console.log(`Validated ${internalLinkCount} internal links/assets, ${sitemapUrls.length} sitemap URLs, robots.txt, and ${redirects.length} redirects.`);
