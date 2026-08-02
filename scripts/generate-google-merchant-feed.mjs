import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://carterscollections.com';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG_PATH = path.join(ROOT, 'assets/js/app.js');
const FEED_PATH = path.join(ROOT, 'google-merchant-feed.xml');
const PINTEREST_FEED_PATH = path.join(ROOT, 'pinterest-catalog.xml');

// Product attributes Google Ads flagged in the Performance Max diagnostics.
// These values come from the product copy and primary product images.
const PRODUCT_ATTRIBUTE_OVERRIDES = Object.freeze({
  b2: { gender: 'female', ageGroup: 'adult', color: 'Black' },
  b6: { gender: 'female', ageGroup: 'adult', color: 'Green' },
  b8: { gender: 'male', ageGroup: 'adult', color: 'Black' },
  b11: { gender: 'unisex', ageGroup: 'adult', color: 'Cognac' },
  b14: { gender: 'female', ageGroup: 'adult', color: 'Orange' },
  b18: { gender: 'female', ageGroup: 'adult', color: 'Beige' },
  b19: { gender: 'female', ageGroup: 'adult', color: 'Black' },
  b22: { gender: 'female', ageGroup: 'adult', color: 'Beige' },
  b30: { gender: 'unisex', ageGroup: 'adult', color: 'Black' },
  g2: { color: 'Grey' },
  g5: { color: 'Smoke' },
  g7: { color: 'Grey' },
  g13: { color: 'Grey' },
  g19: { color: 'Grey' },
  g22: { color: 'Green' },
  g23: { color: 'Grey' }
});

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function singleLine(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function loadCatalog() {
  const source = fs.readFileSync(CATALOG_PATH, 'utf8');
  const marker = 'window.CARTER_CATALOG = ';
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) throw new Error('CARTER_CATALOG was not found in assets/js/app.js');

  const objectStart = source.indexOf('{', markerIndex + marker.length);
  const objectEnd = source.indexOf('\n};', objectStart);
  if (objectStart === -1 || objectEnd === -1) throw new Error('CARTER_CATALOG object could not be parsed');

  const objectLiteral = source.slice(objectStart, objectEnd + 2);
  return vm.runInNewContext(`(${objectLiteral})`, Object.create(null), { timeout: 1_000 });
}

function jsonLdObjects(html, fileName) {
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const objects = [];

  for (const block of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(block[1]);
    } catch (error) {
      throw new Error(`${fileName} contains invalid JSON-LD: ${error.message}`);
    }

    const values = Array.isArray(parsed) ? parsed : [parsed];
    for (const value of values) {
      if (value && Array.isArray(value['@graph'])) objects.push(...value['@graph']);
      else objects.push(value);
    }
  }

  return objects;
}

function hasType(value, expected) {
  const types = Array.isArray(value?.['@type']) ? value['@type'] : [value?.['@type']];
  return types.includes(expected);
}

function firstOffer(product) {
  const offers = Array.isArray(product.offers) ? product.offers : [product.offers];
  return offers.find(Boolean);
}

function absoluteUrl(value, pageUrl) {
  return new URL(String(value), pageUrl).href;
}

function firstImage(product, pageUrl) {
  const image = Array.isArray(product.image) ? product.image[0] : product.image;
  const value = typeof image === 'object' ? image?.url || image?.contentUrl : image;
  return absoluteUrl(value, pageUrl);
}

function schemaAvailability(value) {
  const normalized = String(value || '').split('/').pop().toLowerCase();
  if (normalized === 'instock') return 'in_stock';
  if (normalized === 'outofstock') return 'out_of_stock';
  if (normalized === 'preorder') return 'preorder';
  if (normalized === 'backorder') return 'backorder';
  throw new Error(`Unsupported schema availability: ${value}`);
}

function brandName(product, catalogProduct) {
  if (typeof product.brand === 'string') return singleLine(product.brand);
  if (product.brand?.name) return singleLine(product.brand.name);
  if (catalogProduct.subtitle) return singleLine(catalogProduct.subtitle.replace(/^by\s+/i, ''));
  return "Carter's Collections";
}

function selectedVariant(html, baseClass, dataAttribute) {
  const pattern = new RegExp(
    `<(?:span|button)\\b([^>]*class=["'][^"']*\\b${baseClass}\\b[^"']*["'][^>]*)>`,
    'gi'
  );
  const candidates = [...html.matchAll(pattern)];
  const selected = candidates.find((match) => /\bis-active\b/.test(match[1])) || candidates[0];
  if (!selected) return '';
  const attribute = selected[1].match(new RegExp(`${dataAttribute}=["']([^"']+)["']`, 'i'));
  return singleLine(attribute?.[1]);
}

function localPathFromUrl(url) {
  const parsed = new URL(url);
  if (parsed.origin !== ORIGIN) return null;
  return path.join(ROOT, decodeURIComponent(parsed.pathname.replace(/^\//, '')));
}

function itemFromCatalog(id, catalogProduct) {
  if (!catalogProduct?.detail) throw new Error(`Catalog product ${id} has no product-page URL`);
  const htmlPath = path.join(ROOT, 'pages', catalogProduct.detail);
  if (!fs.existsSync(htmlPath)) throw new Error(`Catalog product ${id} is missing ${catalogProduct.detail}`);

  const html = fs.readFileSync(htmlPath, 'utf8');
  const product = jsonLdObjects(html, catalogProduct.detail).find((value) => hasType(value, 'Product'));
  if (!product) throw new Error(`${catalogProduct.detail} has no Product JSON-LD`);
  const offer = firstOffer(product);
  if (!offer) throw new Error(`${catalogProduct.detail} has no Offer JSON-LD`);

  const expectedLink = `${ORIGIN}/pages/${catalogProduct.detail}`;
  const link = absoluteUrl(offer.url || product.url || expectedLink, expectedLink);
  if (link !== expectedLink) {
    throw new Error(`${catalogProduct.detail} uses noncanonical offer URL ${link}`);
  }

  const imageLink = firstImage(product, link);
  const imagePath = localPathFromUrl(imageLink);
  if (!imagePath || !fs.existsSync(imagePath)) {
    throw new Error(`${catalogProduct.detail} references a missing or off-site primary image: ${imageLink}`);
  }

  const price = Number(offer.price);
  if (!Number.isFinite(price) || price <= 0) throw new Error(`${catalogProduct.detail} has an invalid price`);
  if (offer.priceCurrency !== 'USD') throw new Error(`${catalogProduct.detail} must use USD`);

  const availability = schemaAvailability(offer.availability);
  const catalogAvailability = catalogProduct.soldOut === true ? 'out_of_stock' : 'in_stock';
  if (availability !== catalogAvailability) {
    throw new Error(`${catalogProduct.detail} availability conflicts with CARTER_CATALOG`);
  }
  if (Math.abs(price - Number(catalogProduct.price)) > 0.0001) {
    throw new Error(`${catalogProduct.detail} price conflicts with CARTER_CATALOG`);
  }

  const item = {
    id,
    title: singleLine(product.name),
    description: singleLine(product.description),
    link,
    imageLink,
    availability,
    condition: 'new',
    price: `${price.toFixed(2)} USD`,
    brand: brandName(product, catalogProduct),
    googleProductCategory: singleLine(product.category),
    productType: singleLine(product.category || catalogProduct.section || catalogProduct.cat),
    customLabel0: singleLine(catalogProduct.cat || 'other')
  };

  if (catalogProduct.cat === 'clothing') {
    item.gender = 'female';
    item.ageGroup = 'adult';
    item.color = selectedVariant(html, 'swatch', 'data-color');
    item.size = selectedVariant(html, 'size-pill', 'data-size');
    if (!item.color || !item.size) {
      throw new Error(`${catalogProduct.detail} is missing its default color or size`);
    }
  } else if (catalogProduct.cat === 'sunglasses') {
    const section = String(catalogProduct.section || '').toLowerCase();
    if (section.includes('women')) item.gender = 'female';
    if (section.includes('men')) item.gender = 'male';
    item.ageGroup = 'adult';
  }

  Object.assign(item, PRODUCT_ATTRIBUTE_OVERRIDES[id] || {});

  return item;
}

function naturalIdSort(left, right) {
  return left.id.localeCompare(right.id, 'en', { numeric: true });
}

export function buildMerchantItems() {
  const catalog = loadCatalog();
  return Object.entries(catalog)
    .filter(([, product]) => product?.detail)
    .map(([id, product]) => itemFromCatalog(id, product))
    .sort(naturalIdSort);
}

function tag(name, value) {
  return value ? `    <g:${name}>${xmlEscape(value)}</g:${name}>\n` : '';
}

export function renderMerchantFeed(items) {
  const itemXml = items.map((item) => [
    '  <item>\n',
    `    <title>${xmlEscape(item.title)}</title>\n`,
    `    <description>${xmlEscape(item.description)}</description>\n`,
    `    <link>${xmlEscape(item.link)}</link>\n`,
    tag('id', item.id),
    tag('image_link', item.imageLink),
    tag('availability', item.availability),
    tag('condition', item.condition),
    tag('price', item.price),
    tag('brand', item.brand),
    tag('google_product_category', item.googleProductCategory),
    tag('product_type', item.productType),
    tag('custom_label_0', item.customLabel0),
    tag('gender', item.gender),
    tag('age_group', item.ageGroup),
    tag('color', item.color),
    tag('size', item.size),
    '  </item>\n'
  ].join('')).join('');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n',
    '<channel>\n',
    "  <title>Carter&apos;s Collections Product Feed</title>\n",
    `  <link>${ORIGIN}/</link>\n`,
    '  <description>Current public catalog for Google Merchant Center free listings.</description>\n',
    itemXml,
    '</channel>\n',
    '</rss>\n'
  ].join('');
}

export function renderPinterestFeed(items) {
  const pinterestItems = items.map((item) => ({
    ...item,
    id: `p-${item.id}`
  }));

  return renderMerchantFeed(pinterestItems)
    .replace(
      "<title>Carter&apos;s Collections Product Feed</title>",
      "<title>Carter&apos;s Collections Pinterest Product Feed</title>"
    )
    .replace(
      'Current public catalog for Google Merchant Center free listings.',
      'Current public catalog for Pinterest Shopping.'
    );
}

export function generateMerchantFeed() {
  const items = buildMerchantItems();
  const xml = renderMerchantFeed(items);
  const pinterestXml = renderPinterestFeed(items);
  fs.writeFileSync(FEED_PATH, xml, 'utf8');
  fs.writeFileSync(PINTEREST_FEED_PATH, pinterestXml, 'utf8');
  return {
    items,
    xml,
    outputPath: FEED_PATH,
    pinterestXml,
    pinterestOutputPath: PINTEREST_FEED_PATH
  };
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  const { items, outputPath, pinterestOutputPath } = generateMerchantFeed();
  const inStock = items.filter((item) => item.availability === 'in_stock').length;
  const outOfStock = items.length - inStock;
  console.log(`Generated ${path.relative(ROOT, outputPath)} with ${items.length} products (${inStock} in stock, ${outOfStock} out of stock).`);
  console.log(`Generated ${path.relative(ROOT, pinterestOutputPath)} with ${items.length} Pinterest products using migration-safe IDs.`);
}
