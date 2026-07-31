// Netlify Function: create a Stripe Checkout Session from the cart.
// POST { items: [{ id, name, subtitle, price, qty, image, size }], origin }
// Returns: { url } — the browser redirects to it.

const Stripe = require("stripe");

exports.handler = async (event) => {
  // CORS preflight (Netlify same-origin, but harmless)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return json(500, {
      error:
        "STRIPE_SECRET_KEY is not set. In Netlify: Site settings → Environment variables → add STRIPE_SECRET_KEY.",
    });
  }

  const stripe = Stripe(secret);

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const { items, origin } = payload;
  if (!Array.isArray(items) || items.length === 0) {
    return json(400, { error: "Cart is empty" });
  }

  // Pick a Stripe Tax code per item.
  // Reference: https://docs.stripe.com/tax/tax-codes
  //   txcd_32050025 — Cosmetics / Beautifying (covers Cologne, Perfume)
  //   txcd_99999999 — General (Tangible Goods) fallback
  function pickTaxCode(it) {
    const id = String(it.id || "").toLowerCase();
    const cat = String(it.cat || it.category || "").toLowerCase();
    // Fragrance SKUs are m1-m8 (men) and w1-w8 (women)
    if (cat === "fragrance" || /^[mw]\d/.test(id)) return "txcd_32050025";
    // Everything else (clothing, accessories) → general tangible goods
    return "txcd_99999999";
  }

  // Build line items. We pass price_data so we don't have to pre-create
  // every product in the Stripe dashboard.
  const line_items = items.map((it) => {
    const unit_amount = Math.round(Number(it.price) * 100);
    if (!Number.isFinite(unit_amount) || unit_amount <= 0) {
      throw new Error(`Invalid price for ${it.name}`);
    }
    const productName = it.subtitle
      ? `${it.name} ${it.subtitle}`.trim()
      : it.name;
    const description = [it.size, it.notes].filter(Boolean).join(" · ");
    const images =
      it.image && /^https?:\/\//.test(it.image) ? [it.image] : undefined;

    return {
      price_data: {
        currency: "usd",
        unit_amount,
        product_data: {
          name: productName.slice(0, 250),
          description: description ? description.slice(0, 250) : undefined,
          images,
          // Stripe Tax category — perfume for fragrances, general for clothing.
          tax_code: pickTaxCode(it),
          metadata: { sku: String(it.id || "") },
        },
        tax_behavior: "exclusive",
      },
      quantity: Math.max(1, Math.min(99, Number(it.qty) || 1)),
    };
  });

  const baseUrl =
    origin ||
    `https://${event.headers.host || "carterscollections.com"}`;

  // ----- Shipping policy -------------------------------------------------
  // Domestic (US): always FREE.
  // International: flat $29 per order, FREE on orders with subtotal >= $299.
  // Note: Stripe Checkout cannot conditionally waive a shipping rate based on
  // cart total at the country level, so we compute the subtotal server-side
  // (pre-discount) and decide which international rate to present.
  const INTL_FREE_THRESHOLD_CENTS = 29900; // $299.00
  const INTL_FLAT_CENTS = 2900; // $29.00

  // Countries we ship to internationally: Canada, UK, Australia, Hong Kong,
  // Philippines, Colombia, Indonesia, plus the EU member states (incl. Poland).
  // US is domestic (free) and listed first.
  const EU_COUNTRIES = [
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
    "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
    "SI", "ES", "SE",
  ];
  const ALLOWED_COUNTRIES = [
    "US", "CA", "GB", "AU", "HK", "PH", "CO", "ID", ...EU_COUNTRIES,
  ];

  // Subtotal in cents (pre-discount), based on the line items.
  const subtotalCents = items.reduce((sum, it) => {
    const cents = Math.round(Number(it.price) * 100);
    const qty = Math.max(1, Math.min(99, Number(it.qty) || 1));
    return sum + (Number.isFinite(cents) ? cents * qty : 0);
  }, 0);

  const usFreeRate = {
    shipping_rate_data: {
      type: "fixed_amount",
      fixed_amount: { amount: 0, currency: "usd" },
      display_name: "USPS Ground Advantage (US) — 5 to 9 business days",
      delivery_estimate: {
        minimum: { unit: "business_day", value: 5 },
        maximum: { unit: "business_day", value: 9 },
      },
    },
  };

  // International rate is free once the subtotal hits the threshold, else flat.
  const intlQualifiesFree = subtotalCents >= INTL_FREE_THRESHOLD_CENTS;
  const intlRate = {
    shipping_rate_data: {
      type: "fixed_amount",
      fixed_amount: {
        amount: intlQualifiesFree ? 0 : INTL_FLAT_CENTS,
        currency: "usd",
      },
      display_name: intlQualifiesFree
        ? "International Shipping — FREE (orders $299+) — 7 to 21 business days"
        : "International Flat Rate ($29) — 7 to 21 business days",
      delivery_estimate: {
        minimum: { unit: "business_day", value: 7 },
        maximum: { unit: "business_day", value: 21 },
      },
    },
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      automatic_tax: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ALLOWED_COUNTRIES,
      },
      phone_number_collection: { enabled: true },
      // Customer sees the free US option AND the applicable international option.
      // Stripe presents both; the customer's chosen address determines which is
      // valid. US shoppers pick the free US rate; international shoppers pick the
      // intl rate (free or $29 depending on the pre-discount subtotal).
      shipping_options: [usFreeRate, intlRate],
      allow_promotion_codes: true,
      // Success page fetches order_total + hashed_email from /api/get-session (verified server-side).
      success_url: `${baseUrl}/pages/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pages/cart.html?canceled=1`,
      metadata: {
        item_count: String(items.reduce((s, i) => s + (Number(i.qty) || 1), 0)),
        source: "carters-collection-web",
        special_order: String(items.some((item) => item.specialOrder === true)),
      },
    });

    return json(200, { url: session.url, id: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    return json(500, {
      error: err.message || "Could not create checkout session",
    });
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
    body: JSON.stringify(body),
  };
}
