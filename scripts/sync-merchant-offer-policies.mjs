import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const pagesDir = path.join(root, 'pages');
const shippingPolicyId = 'https://carterscollections.com/pages/shipping-policy.html#us-standard-shipping';
const returnPolicyId = 'https://carterscollections.com/pages/return-policy.html#standard-return-policy';

function matchingJsonValueEnd(source, start) {
  const opening = source[start];
  const closing = opening === '{' ? '}' : opening === '[' ? ']' : null;
  if (!closing) throw new Error(`Expected an object or array at offset ${start}`);

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }

    if (char === '"') inString = true;
    else if (char === opening) depth += 1;
    else if (char === closing && --depth === 0) return index + 1;
  }

  throw new Error(`Unterminated JSON value at offset ${start}`);
}

function replacePropertyValue(jsonText, propertyName, value) {
  const propertyPattern = new RegExp(`"${propertyName}"\\s*:`);
  const match = propertyPattern.exec(jsonText);
  if (!match) throw new Error(`Missing ${propertyName} property`);

  let valueStart = match.index + match[0].length;
  while (/\s/.test(jsonText[valueStart])) valueStart += 1;
  const valueEnd = matchingJsonValueEnd(jsonText, valueStart);
  const lineStart = jsonText.lastIndexOf('\n', match.index) + 1;
  const indent = jsonText.slice(lineStart, match.index).match(/^\s*/)?.[0] ?? '';
  const formatted = JSON.stringify(value, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `${indent}${line}`))
    .join('\n');

  return `${jsonText.slice(0, valueStart)}${formatted}${jsonText.slice(valueEnd)}`;
}

function offersList(offers) {
  return Array.isArray(offers) ? offers : [offers];
}

function invariantSnapshot(product) {
  return offersList(product.offers).map((offer) => ({
    price: offer.price,
    priceCurrency: offer.priceCurrency,
    availability: offer.availability,
    itemCondition: offer.itemCondition,
    url: offer.url,
  }));
}

const files = fs.readdirSync(pagesDir)
  .filter((name) => name.startsWith('product-') && name.endsWith('.html'))
  .sort();

let changedCount = 0;
let productCount = 0;

for (const name of files) {
  const file = path.join(pagesDir, name);
  const original = fs.readFileSync(file, 'utf8');
  let foundProduct = false;

  const updated = original.replace(
    /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    (script, body) => {
      const jsonText = body.trim();
      let data;
      try {
        data = JSON.parse(jsonText);
      } catch (error) {
        throw new Error(`${name}: invalid JSON-LD: ${error.message}`);
      }

      if (data['@type'] !== 'Product') return script;
      if (!data.offers) throw new Error(`${name}: Product is missing offers`);

      foundProduct = true;
      productCount += 1;
      const before = invariantSnapshot(data);

      for (const offer of offersList(data.offers)) {
        offer.shippingDetails = {
          '@type': 'OfferShippingDetails',
          hasShippingService: { '@id': shippingPolicyId },
        };
        offer.hasMerchantReturnPolicy = { '@id': returnPolicyId };
      }

      const after = invariantSnapshot(data);
      if (JSON.stringify(before) !== JSON.stringify(after)) {
        throw new Error(`${name}: price, availability, condition, currency, or URL changed`);
      }

      const newJsonText = replacePropertyValue(jsonText, 'offers', data.offers);
      return script.replace(jsonText, newJsonText);
    },
  );

  if (!foundProduct) continue;
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    changedCount += 1;
  }
}

console.log(`Merchant policy references verified on ${productCount} products; ${changedCount} files updated.`);
