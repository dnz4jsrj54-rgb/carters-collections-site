// Netlify Function: generate a UNIQUE, single-use promotion code when a
// visitor spins the homepage prize wheel.
//
// POST { email, prize }  ->  { code, label, expires_at }
//
// Why server-side: creating promotion codes requires the Stripe secret key,
// which must never touch the browser. The wheel UI calls this endpoint the
// moment it lands on a prize.
//
// Anti-abuse:
//   - Each generated code is max_redemptions:1 and expires in 7 days, so a
//     screenshotted/shared code is worthless after one order or 7 days.
//   - Email gating: if the same email already has an ACTIVE spin code, we
//     return that existing code instead of minting a new one (no infinite
//     spinning for a stack of codes).
//
// The four coupons below are pre-created in the Stripe dashboard.

const Stripe = require("stripe");

// Pre-created coupon IDs (Carter's Collections Stripe account).
const COUPONS = {
  p10: { coupon: "uwfg276r", label: "10% OFF", kind: "percent", value: 10 },
  p15: { coupon: "WOd7shGV", label: "15% OFF", kind: "percent", value: 15 },
  p20: { coupon: "VxdB2MHd", label: "20% OFF", kind: "percent", value: 20 },
  d15: { coupon: "qrngg8X2", label: "$15 OFF", kind: "amount", value: 15 },
};

// $15-off requires a minimum order so it can't gut a cheap item's margin.
// Set low ($29.99) on purpose: a thin-margin first order is worth it to win a
// customer who may reorder.
const D15_MIN_AMOUNT_CENTS = 2999;

const CODE_TTL_DAYS = 7;

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors(), body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return json(500, { error: "STRIPE_SECRET_KEY is not set." });
  }
  const stripe = Stripe(secret);

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const email = String(body.email || "").trim().toLowerCase();
  const prizeKey = String(body.prize || "").trim();

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json(400, { error: "A valid email is required." });
  }
  const prize = COUPONS[prizeKey];
  if (!prize) {
    return json(400, { error: "Unknown prize." });
  }

  const emailKey = hashEmail(email);

  try {
    // 1) Anti-abuse: has this email already been issued an active spin code?
    //    We tag every spin code with metadata.spin_email = <hash>. If one is
    //    still valid (active + not expired + not redeemed), reuse it.
    const existing = await stripe.promotionCodes.list({ limit: 100, active: true });
    const now = Math.floor(Date.now() / 1000);
    const reuse = existing.data.find(
      (pc) =>
        pc.metadata &&
        pc.metadata.spin_email === emailKey &&
        pc.metadata.source === "spin-wheel" &&
        pc.active &&
        (!pc.expires_at || pc.expires_at > now) &&
        (pc.max_redemptions == null || pc.times_redeemed < pc.max_redemptions)
    );
    if (reuse) {
      return json(200, {
        code: reuse.code,
        label: labelForCoupon(reuse),
        expires_at: reuse.expires_at || null,
        reused: true,
      });
    }

    // 2) Mint a fresh unique code.
    const expires_at = now + CODE_TTL_DAYS * 24 * 60 * 60;
    const codeStr = buildCode(prize.label);

    const params = {
      coupon: prize.coupon,
      code: codeStr,
      max_redemptions: 1,
      expires_at,
      metadata: {
        source: "spin-wheel",
        spin_email: emailKey,
        prize: prizeKey,
      },
    };
    // $15-off requires a minimum order subtotal.
    if (prizeKey === "d15") {
      params.restrictions = { minimum_amount: D15_MIN_AMOUNT_CENTS, minimum_amount_currency: "usd" };
    }

    const pc = await stripe.promotionCodes.create(params);

    return json(200, {
      code: pc.code,
      label: prize.label,
      expires_at: pc.expires_at || null,
      reused: false,
    });
  } catch (err) {
    console.error("spin-reward error:", err);
    return json(500, { error: err.message || "Could not generate code" });
  }
};

// --- helpers ---------------------------------------------------------------

// Short, readable, hard-to-guess code, e.g. "SPIN-15-7F3K9A".
function buildCode(label) {
  const tier = (label.match(/\d+/) || ["X"])[0];
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous 0/O/1/I
  let rand = "";
  for (let i = 0; i < 6; i++) {
    rand += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `SPIN${tier}-${rand}`;
}

// Non-reversible-ish tag so we don't store raw emails in Stripe metadata.
function hashEmail(email) {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(email).digest("hex").slice(0, 24);
}

function labelForCoupon(pc) {
  const c = pc.coupon || {};
  if (c.percent_off) return `${c.percent_off}% OFF`;
  if (c.amount_off) return `$${Math.round(c.amount_off / 100)} OFF`;
  return "REWARD";
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...cors() },
    body: JSON.stringify(body),
  };
}
