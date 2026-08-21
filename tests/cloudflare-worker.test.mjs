import assert from "node:assert/strict";
import test from "node:test";
import worker, { REDIRECTS, buildCode } from "../cloudflare/worker.mjs";

function env(overrides = {}) {
  return {
    ASSETS: {
      async fetch(request) {
        return new Response(`asset:${new URL(request.url).pathname}`, {
          headers: { "Content-Type": "text/html" },
        });
      },
    },
    ...overrides,
  };
}

test("serves the homepage from index.html with no-cache headers", async () => {
  const response = await worker.fetch(new Request("https://example.com/"), env());
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "asset:/index.html");
  assert.equal(response.headers.get("cache-control"), "public, max-age=0, must-revalidate");
});

test("preserves Netlify canonical redirects", async () => {
  assert.equal(REDIRECTS.size, 38);
  const response = await worker.fetch(
    new Request("https://example.com/pages/body-care?campaign=1"),
    env(),
  );
  assert.equal(response.status, 301);
  assert.equal(response.headers.get("location"), "https://example.com/pages/body-care.html?campaign=1");
});

test("checkout fails safely when the Stripe secret is missing", async () => {
  const response = await worker.fetch(new Request("https://example.com/api/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: [{ id: "m2", name: "Test", price: 10, qty: 1 }] }),
  }), env());
  assert.equal(response.status, 500);
  assert.match(await response.text(), /STRIPE_SECRET_KEY/);
});

test("newsletter validates input and writes a normalized signup", async () => {
  const writes = [];
  const newsletterEnv = env({
    NEWSLETTER_SIGNUPS: { async put(key, value) { writes.push([key, JSON.parse(value)]); } },
  });
  const response = await worker.fetch(new Request("https://example.com/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "form-name=newsletter&email=Customer%40Example.com&source=footer",
  }), newsletterEnv);
  assert.equal(response.status, 200);
  assert.equal(writes.length, 1);
  assert.equal(writes[0][1].email, "customer@example.com");
  assert.equal(writes[0][1].source, "footer");
});

test("spin codes retain the expected readable format", () => {
  assert.match(buildCode("15% OFF"), /^SPIN15-[A-HJ-NP-Z2-9]{6}$/);
});
