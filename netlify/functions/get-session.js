// Netlify Function: fetch limited Stripe Checkout Session details for the
// thank-you page. Used to fire the Pinterest Purchase event with verified
// server-side data (order total, hashed customer email for enhanced match).
//
// GET /api/get-session?session_id=cs_test_...
// Returns verified purchase analytics plus the Google Customer Reviews opt-in
// fields required on the order-confirmation page.

const Stripe = require("stripe");
const crypto = require("crypto");
const {
  customerReviewOptIn,
} = require("./lib/google-customer-reviews");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return json(500, { error: "STRIPE_SECRET_KEY is not set." });
  const stripe = Stripe(secret);

  const sessionId = (event.queryStringParameters || {}).session_id;
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return json(400, { error: "Missing or invalid session_id" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Only return data if the session has actually completed payment.
    if (session.payment_status !== "paid") {
      return json(200, { ok: false, reason: "not_paid" });
    }

    const email = (session.customer_details && session.customer_details.email) || "";
    // Hash the email lowercased+trimmed for Pinterest enhanced match (SHA-256 hex).
    const emailSha256 = email
      ? crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex")
      : "";

    return json(200, {
      ok: true,
      order_id: session.id,
      amount_total: (session.amount_total || 0) / 100, // cents → dollars
      currency: (session.currency || "usd").toUpperCase(),
      item_count: Number((session.metadata || {}).item_count || 1),
      email_sha256: emailSha256,
      customer_review_opt_in: customerReviewOptIn(session),
    });
  } catch (err) {
    return json(500, { error: err.message });
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, private",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      ...corsHeaders(),
    },
    body: JSON.stringify(body),
  };
}
