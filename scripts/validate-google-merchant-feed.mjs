import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildMerchantItems, renderMerchantFeed } from './generate-google-merchant-feed.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FEED_PATH = path.join(ROOT, 'google-merchant-feed.xml');
const xml = fs.readFileSync(FEED_PATH, 'utf8');
const items = buildMerchantItems();

assert.equal(xml, renderMerchantFeed(items), 'Committed feed is stale; rerun the generator');
assert.equal((xml.match(/<item>/g) || []).length, items.length, 'Feed item count does not match the catalog');
assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
assert.match(xml, /xmlns:g="http:\/\/base\.google\.com\/ns\/1\.0"/);

const ids = new Set();
const links = new Set();
for (const item of items) {
  assert.ok(item.id && !ids.has(item.id), `Duplicate or missing product ID: ${item.id}`);
  assert.ok(item.link && !links.has(item.link), `Duplicate or missing product link: ${item.link}`);
  ids.add(item.id);
  links.add(item.link);

  assert.match(item.link, /^https:\/\/carterscollections\.com\/pages\/product-[a-z0-9-]+\.html$/);
  assert.match(item.imageLink, /^https:\/\/carterscollections\.com\/assets\//);
  assert.match(item.price, /^\d+\.\d{2} USD$/);
  assert.ok(['in_stock', 'out_of_stock', 'preorder', 'backorder'].includes(item.availability));
  assert.equal(item.condition, 'new');
  assert.ok(item.title && item.description && item.brand && item.productType);

  if (item.customLabel0 === 'clothing') {
    assert.equal(item.gender, 'female');
    assert.equal(item.ageGroup, 'adult');
    assert.ok(item.color && item.size, `${item.id} lacks apparel variant attributes`);
  }
}

const inStock = items.filter((item) => item.availability === 'in_stock').length;
const outOfStock = items.filter((item) => item.availability === 'out_of_stock').length;
console.log(`Validated Google Merchant feed: ${items.length} unique products (${inStock} in stock, ${outOfStock} out of stock).`);
