import Stripe from "stripe";
import { customerReviewOptIn } from "./google-customer-reviews.mjs";

const REDIRECTS = new Map([
  ["/index.html", "/"],
  ["/pages/product.html", "/pages/fragrances-men.html"],
  ["/pages/bags", "/pages/bags.html"],
  ["/pages/bags/", "/pages/bags.html"],
  ["/pages/body-care", "/pages/body-care.html"],
  ["/pages/body-care/", "/pages/body-care.html"],
  ["/pages/clothing", "/pages/clothing.html"],
  ["/pages/clothing/", "/pages/clothing.html"],
  ["/pages/fragrances-men", "/pages/fragrances-men.html"],
  ["/pages/fragrances-men/", "/pages/fragrances-men.html"],
  ["/pages/fragrances-women", "/pages/fragrances-women.html"],
  ["/pages/fragrances-women/", "/pages/fragrances-women.html"],
  ["/pages/fragrances-under-100", "/pages/fragrances-under-100.html"],
  ["/pages/fragrances-under-100/", "/pages/fragrances-under-100.html"],
  ["/pages/product-montblanc-explorer-platinum", "/pages/product-montblanc-explorer-platinum.html"],
  ["/pages/product-montblanc-explorer-platinum/", "/pages/product-montblanc-explorer-platinum.html"],
  ["/pages/product-dolce-gabbana-k-edt", "/pages/product-dolce-gabbana-k-edt.html"],
  ["/pages/product-dolce-gabbana-k-edt/", "/pages/product-dolce-gabbana-k-edt.html"],
  ["/pages/product-ferragamo-spicy-leather", "/pages/product-ferragamo-spicy-leather.html"],
  ["/pages/product-ferragamo-spicy-leather/", "/pages/product-ferragamo-spicy-leather.html"],
  ["/pages/product-marc-jacobs-honey", "/pages/product-marc-jacobs-honey.html"],
  ["/pages/product-marc-jacobs-honey/", "/pages/product-marc-jacobs-honey.html"],
  ["/pages/product-mugler-angel-fantasm", "/pages/product-mugler-angel-fantasm.html"],
  ["/pages/product-mugler-angel-fantasm/", "/pages/product-mugler-angel-fantasm.html"],
  ["/pages/product-calvin-klein-one-gold", "/pages/product-calvin-klein-one-gold.html"],
  ["/pages/product-calvin-klein-one-gold/", "/pages/product-calvin-klein-one-gold.html"],
  ["/pages/product-dolce-gabbana-devotion", "/pages/product-dolce-gabbana-devotion.html"],
  ["/pages/product-dolce-gabbana-devotion/", "/pages/product-dolce-gabbana-devotion.html"],
  ["/pages/product-versace-dylan-blue-pour-femme", "/pages/product-versace-dylan-blue-pour-femme.html"],
  ["/pages/product-versace-dylan-blue-pour-femme/", "/pages/product-versace-dylan-blue-pour-femme.html"],
  ["/pages/product-juliette-has-a-gun-not-a-perfume", "/pages/product-juliette-has-a-gun-not-a-perfume.html"],
  ["/pages/product-juliette-has-a-gun-not-a-perfume/", "/pages/product-juliette-has-a-gun-not-a-perfume.html"],
  ["/pages/product-versace-crystal-noir-edt", "/pages/product-versace-crystal-noir-edt.html"],
  ["/pages/product-versace-crystal-noir-edt/", "/pages/product-versace-crystal-noir-edt.html"],
  ["/pages/sale", "/pages/sale.html"],
  ["/pages/sale/", "/pages/sale.html"],
  ["/pages/sunglasses", "/pages/sunglasses.html"],
  ["/pages/sunglasses/", "/pages/sunglasses.html"],
]);

const COUPONS = {
  p10: { coupon: "uwfg276r", label: "10% OFF" },
  p15: { coupon: "WOd7shGV", label: "15% OFF" },
  p20: { coupon: "VxdB2MHd", label: "20% OFF" },
  d15: { coupon: "qrngg8X2", label: "$15 OFF" },
};

const D15_MIN_AMOUNT_CENTS = 2999;
const CODE_TTL_DAYS = 7;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/create-checkout") return handleCheckout(request, env);
      if (url.pathname === "/api/get-session") return handleGetSession(request, env);
      if (url.pathname === "/api/spin-reward") return handleSpinReward(request, env);
      if (url.pathname === "/api/stripe-webhook") return handleStripeWebhook(request, env);
      if (url.pathname === "/api/newsletter") return handleNewsletter(request, env);

      const redirect = REDIRECTS.get(url.pathname);
      if (redirect) {
        const destination = new URL(redirect, url.origin);
        destination.search = url.search;
        return Response.redirect(destination.toString(), 301);
      }

      const assetUrl = new URL(request.url);
      if (assetUrl.pathname === "/") assetUrl.pathname = "/index.html";
      const response = await env.ASSETS.fetch(new Request(assetUrl, request));
      return withStorefrontHeaders(response, url.pathname);
    } catch (error) {
      console.error("Worker request failed", error);
      return json(500, { error: "The request could not be completed." });
    }
  },
};

function stripeClient(env) {
  if (!env.STRIPE_SECRET_KEY) return null;
  return new Stripe(env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
  });
}

async function handleCheckout(request, env) {
  if (request.method === "OPTIONS") return emptyCors("POST");
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });
  const stripe = stripeClient(env);
  if (!stripe) return json(500, { error: "STRIPE_SECRET_KEY is not set." });

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const items = payload?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return json(400, { error: "Cart is empty" });
  }

  let lineItems;
  try {
    lineItems = items.map((item) => {
      const unitAmount = Math.round(Number(item.price) * 100);
      if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
        throw new Error(`Invalid price for ${item.name || "item"}`);
      }
      const productName = item.subtitle
        ? `${item.name} ${item.subtitle}`.trim()
        : item.name;
      const description = [item.size, item.notes].filter(Boolean).join(" · ");
      const images = item.image && /^https?:\/\//.test(item.image) ? [item.image] : undefined;

      return {
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: String(productName || "Carter's Collections item").slice(0, 250),
            description: description ? description.slice(0, 250) : undefined,
            images,
            tax_code: pickTaxCode(item),
            metadata: { sku: String(item.id || "") },
          },
          tax_behavior: "exclusive",
        },
        quantity: Math.max(1, Math.min(99, Number(item.qty) || 1)),
      };
    });
  } catch (error) {
    return json(400, { error: error.message });
  }

  const subtotalCents = items.reduce((sum, item) => {
    const cents = Math.round(Number(item.price) * 100);
    const quantity = Math.max(1, Math.min(99, Number(item.qty) || 1));
    return sum + (Number.isFinite(cents) ? cents * quantity : 0);
  }, 0);

  const euCountries = [
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
    "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
    "SI", "ES", "SE",
  ];
  const allowedCountries = ["US", "CA", "GB", "AU", "HK", "PH", "CO", "ID", ...euCountries];
  const internationalIsFree = subtotalCents >= 29900;
  const shippingOptions = [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: 0, currency: "usd" },
        display_name: "USPS Ground Advantage (US) — 5 to 9 business days",
        delivery_estimate: {
          minimum: { unit: "business_day", value: 5 },
          maximum: { unit: "business_day", value: 9 },
        },
      },
    },
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: internationalIsFree ? 0 : 2900, currency: "usd" },
        display_name: internationalIsFree
          ? "International Shipping — FREE (orders $299+) — 7 to 21 business days"
          : "International Flat Rate ($29) — 7 to 21 business days",
        delivery_estimate: {
          minimum: { unit: "business_day", value: 7 },
          maximum: { unit: "business_day", value: 21 },
        },
      },
    },
  ];

  const baseUrl = String(env.SITE_ORIGIN || new URL(request.url).origin).replace(/\/$/, "");
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      automatic_tax: { enabled: true },
      shipping_address_collection: { allowed_countries: allowedCountries },
      phone_number_collection: { enabled: true },
      shipping_options: shippingOptions,
      allow_promotion_codes: true,
      success_url: `${baseUrl}/pages/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pages/cart.html?canceled=1`,
      metadata: {
        item_count: String(items.reduce((sum, item) => sum + (Number(item.qty) || 1), 0)),
        source: "carters-collection-web",
        special_order: String(items.some((item) => item.specialOrder === true)),
      },
    });
    return json(200, { url: session.url, id: session.id });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return json(500, { error: error.message || "Could not create checkout session" });
  }
}

async function handleGetSession(request, env) {
  if (request.method === "OPTIONS") return emptyCors("GET");
  if (request.method !== "GET") return json(405, { error: "Method not allowed" });
  const stripe = stripeClient(env);
  if (!stripe) return json(500, { error: "STRIPE_SECRET_KEY is not set." });

  const sessionId = new URL(request.url).searchParams.get("session_id") || "";
  if (!sessionId.startsWith("cs_")) return json(400, { error: "Missing or invalid session_id" });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return json(200, { ok: false, reason: "not_paid" }, privateHeaders());
    }
    const email = session.customer_details?.email || "";
    return json(200, {
      ok: true,
      order_id: session.id,
      amount_total: (session.amount_total || 0) / 100,
      currency: (session.currency || "usd").toUpperCase(),
      item_count: Number(session.metadata?.item_count || 1),
      email_sha256: email ? await sha256Hex(email.trim().toLowerCase()) : "",
      customer_review_opt_in: customerReviewOptIn(session),
    }, privateHeaders());
  } catch (error) {
    return json(500, { error: error.message }, privateHeaders());
  }
}

async function handleStripeWebhook(request, env) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const stripe = stripeClient(env);
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Server misconfigured", { status: 500 });
  }

  let stripeEvent;
  try {
    stripeEvent = await stripe.webhooks.constructEventAsync(
      await request.text(),
      request.headers.get("stripe-signature") || "",
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook verification failed", error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    return new Response("Event ignored");
  }

  const session = stripeEvent.data.object;
  let lineItems = [];
  try {
    const expanded = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "line_items.data.price.product"],
    });
    lineItems = expanded.line_items?.data || [];
  } catch (error) {
    console.error("Failed to expand Stripe line items", error);
  }

  const smsBody = orderSms(session, lineItems);
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER || !env.OWNER_PHONE_NUMBER) {
    console.log("Order received; Twilio variables are not configured");
    return new Response("Received (SMS skipped)");
  }

  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString("base64");
    const body = new URLSearchParams({
      To: env.OWNER_PHONE_NUMBER,
      From: env.TWILIO_FROM_NUMBER,
      Body: smsBody,
    });
    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    if (!response.ok) console.error("Twilio request failed", response.status, await response.text());
  } catch (error) {
    console.error("Twilio send failed", error);
  }
  return new Response("OK");
}

async function handleSpinReward(request, env) {
  if (request.method === "OPTIONS") return emptyCors("POST");
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });
  const stripe = stripeClient(env);
  if (!stripe) return json(500, { error: "STRIPE_SECRET_KEY is not set." });

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }
  const email = String(body?.email || "").trim().toLowerCase();
  const prizeKey = String(body?.prize || "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(400, { error: "A valid email is required." });
  const prize = COUPONS[prizeKey];
  if (!prize) return json(400, { error: "Unknown prize." });

  const emailKey = (await sha256Hex(email)).slice(0, 24);
  try {
    const existing = await stripe.promotionCodes.list({ limit: 100, active: true });
    const now = Math.floor(Date.now() / 1000);
    const reuse = existing.data.find((code) =>
      code.metadata?.spin_email === emailKey &&
      code.metadata?.source === "spin-wheel" &&
      code.active &&
      (!code.expires_at || code.expires_at > now) &&
      (code.max_redemptions == null || code.times_redeemed < code.max_redemptions));
    if (reuse) {
      const label = labelForCoupon(reuse);
      await sendRewardEmail(env, email, reuse.code, label, reuse.expires_at, reuse.metadata?.prize);
      return json(200, { code: reuse.code, label, expires_at: reuse.expires_at || null, reused: true });
    }

    const expiresAt = now + CODE_TTL_DAYS * 24 * 60 * 60;
    const params = {
      coupon: prize.coupon,
      code: buildCode(prize.label),
      max_redemptions: 1,
      expires_at: expiresAt,
      metadata: { source: "spin-wheel", spin_email: emailKey, prize: prizeKey },
    };
    if (prizeKey === "d15") {
      params.restrictions = { minimum_amount: D15_MIN_AMOUNT_CENTS, minimum_amount_currency: "usd" };
    }
    const promotionCode = await stripe.promotionCodes.create(params);
    await sendRewardEmail(env, email, promotionCode.code, prize.label, promotionCode.expires_at, prizeKey);
    return json(200, {
      code: promotionCode.code,
      label: prize.label,
      expires_at: promotionCode.expires_at || null,
      reused: false,
    });
  } catch (error) {
    console.error("Spin reward failed", error);
    return json(500, { error: error.message || "Could not generate code" });
  }
}

async function handleNewsletter(request, env) {
  if (request.method === "OPTIONS") return emptyCors("POST");
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });

  let data;
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      data = Object.fromEntries(new URLSearchParams(await request.text()));
    }
  } catch {
    return json(400, { error: "Invalid submission" });
  }

  if (String(data?.["bot-field"] || "").trim()) return json(200, { ok: true });
  const email = String(data?.email || "").trim().toLowerCase();
  const source = String(data?.source || "newsletter").slice(0, 80);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(400, { error: "A valid email is required." });
  if (!env.NEWSLETTER_SIGNUPS) return json(503, { error: "Newsletter storage is not configured." });

  const key = await sha256Hex(email);
  await env.NEWSLETTER_SIGNUPS.put(key, JSON.stringify({ email, source, subscribed_at: new Date().toISOString() }));
  if (source !== "spin-wheel") await sendWelcomeEmail(env, email);
  return json(200, { ok: true });
}

async function sendWelcomeEmail(env, email) {
  if (!env.RESEND_API_KEY) return;
  const html = `<div style="font-family:Georgia,serif;max-width:600px;margin:auto"><div style="background:#1a1a1a;color:#fff;padding:24px;text-align:center;letter-spacing:2px">CARTER'S COLLECTIONS</div><div style="padding:32px"><h1>Welcome to the collection.</h1><p style="color:#444;line-height:1.6">Authentic designer fragrances, body care, and hand-picked fashion shipped from Austin, Texas.</p><p style="text-align:center"><a href="https://carterscollections.com" style="background:#1a1a1a;color:#fff;padding:14px 36px;border-radius:6px;text-decoration:none">Shop Now</a></p></div></div>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Carter's Collections <hello@carterscollections.com>",
      to: email,
      subject: "Welcome to Carter's Collections",
      html,
    }),
  });
  if (!response.ok) console.error("Resend welcome email failed", response.status, await response.text());
}

async function sendRewardEmail(env, email, code, label, expiresAt, prizeKey) {
  if (!env.RESEND_API_KEY || !email || !code) return;
  const expiration = expiresAt
    ? new Date(expiresAt * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "soon";
  const minimum = prizeKey === "d15" ? " · minimum order $29.99" : "";
  const html = `<div style="font-family:Georgia,serif;max-width:600px;margin:auto"><div style="background:#0F0E0C;color:#C9A961;padding:24px;text-align:center;letter-spacing:3px">CARTER'S COLLECTIONS</div><div style="padding:32px;background:#fffdf9"><h1>You won ${escapeHtml(label)}!</h1><p>Here's your personal, one-time-use reward code.</p><div style="border:2px dashed #C9A961;border-radius:8px;padding:18px;text-align:center;margin:24px 0"><div style="font-size:30px;font-weight:bold;letter-spacing:3px">${escapeHtml(code)}</div><div style="font-size:12px;color:#888">${escapeHtml(label)} · expires ${escapeHtml(expiration)}${minimum}</div></div><p style="text-align:center"><a href="https://carterscollections.com/pages/sale.html" style="background:#0F0E0C;color:#C9A961;padding:14px 36px;border-radius:6px;text-decoration:none">Shop the Sale</a></p></div></div>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Carter's Collections <hello@carterscollections.com>",
      to: email,
      subject: `Your ${label} code is inside 🎉`,
      html,
    }),
  });
  if (!response.ok) console.error("Resend reward email failed", response.status, await response.text());
}

function orderSms(session, lineItems) {
  const shippingDetails = session.shipping_details || session.collected_information?.shipping_details || {};
  const shipping = shippingDetails.address || {};
  const customerName = session.customer_details?.name || "Customer";
  const shippingName = shippingDetails.name || customerName;
  const items = lineItems.map((item) => `${item.quantity || 1}× ${item.description || item.price?.product?.name || "Item"}`).join("\n");
  const money = (amount) => ((amount || 0) / 100).toFixed(2);
  return [
    "🛍️ NEW ORDER — Carter's Collections",
    "",
    `Ref: ${String(session.id || "").slice(-8).toUpperCase()}`,
    `Total: $${money(session.amount_total)} (sub $${money(session.amount_subtotal)} · tax $${money(session.total_details?.amount_tax)} · ship $${money(session.total_details?.amount_shipping)})`,
    "",
    "Items:",
    items,
    "",
    "Ship to:",
    shippingName,
    `${shipping.line1 || ""}${shipping.line2 ? `, ${shipping.line2}` : ""}`,
    `${shipping.city || ""}, ${shipping.state || ""} ${shipping.postal_code || ""}`,
    "",
    `Customer: ${session.customer_details?.email || "no email"} · ${session.customer_details?.phone || "no phone"}`,
  ].join("\n");
}

function pickTaxCode(item) {
  const id = String(item.id || "").toLowerCase();
  const category = String(item.cat || item.category || "").toLowerCase();
  return category === "fragrance" || category === "body-care" || /^[mw]\d/.test(id)
    ? "txcd_32050025"
    : "txcd_99999999";
}

function labelForCoupon(promotionCode) {
  const coupon = promotionCode.coupon || {};
  if (coupon.percent_off) return `${coupon.percent_off}% OFF`;
  if (coupon.amount_off) return `$${Math.round(coupon.amount_off / 100)} OFF`;
  return "REWARD";
}

function buildCode(label) {
  const tier = (label.match(/\d+/) || ["X"])[0];
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `SPIN${tier}-${Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("")}`;
}

async function sha256Hex(value) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function emptyCors(method) {
  return new Response(null, { status: 204, headers: corsHeaders(method) });
}

function corsHeaders(method = "GET, POST") {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": `${method}, OPTIONS`,
    "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
  };
}

function privateHeaders() {
  return {
    "Cache-Control": "no-store, private",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
  };
}

function json(status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(), ...extraHeaders },
  });
}

function withStorefrontHeaders(response, pathname) {
  const headers = new Headers(response.headers);
  if (pathname.startsWith("/assets/")) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (pathname === "/google-merchant-feed.xml") {
    headers.set("Content-Type", "application/rss+xml; charset=utf-8");
    headers.set("Cache-Control", "public, max-age=3600");
  } else if (pathname === "/sitemap.xml") {
    headers.set("Content-Type", "application/xml; charset=utf-8");
    headers.set("Cache-Control", "public, max-age=86400");
  } else if (pathname === "/robots.txt") {
    headers.set("Content-Type", "text/plain; charset=utf-8");
    headers.set("Cache-Control", "public, max-age=86400");
  } else if (pathname === "/" || pathname.endsWith(".html") || pathname.startsWith("/pages/")) {
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  }
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export { REDIRECTS, buildCode, customerReviewOptIn, handleNewsletter, sha256Hex };
