// Netlify Function: Stripe webhook → Twilio SMS notification.
// Fires when a checkout.session.completed event arrives from Stripe.
// Sends a detailed SMS to the store owner's phone.

const Stripe = require("stripe");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_FROM_NUMBER; // e.g. +18885551234
  const ownerPhone = process.env.OWNER_PHONE_NUMBER; // +15125905489

  if (!stripeSecret || !webhookSecret) {
    console.error("Missing Stripe env vars");
    return { statusCode: 500, body: "Server misconfigured" };
  }

  const stripe = Stripe(stripeSecret);

  // Verify the webhook signature so random people on the internet
  // can't trigger SMS spam by hitting this endpoint.
  let stripeEvent;
  try {
    const sig = event.headers["stripe-signature"];
    // Netlify gives us the raw body when we use this pattern:
    const rawBody = event.body;
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // Only act on completed checkouts
  if (stripeEvent.type !== "checkout.session.completed") {
    return { statusCode: 200, body: "Event ignored" };
  }

  const session = stripeEvent.data.object;

  // Expand line items so we get product names
  let lineItems;
  try {
    const expanded = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "line_items.data.price.product"],
    });
    lineItems = expanded.line_items?.data || [];
  } catch (err) {
    console.error("Failed to expand line items:", err.message);
    lineItems = [];
  }

  // Build the SMS body
  const customerName =
    session.customer_details?.name || "Customer";
  const customerEmail =
    session.customer_details?.email || "no email";
  const customerPhone =
    session.customer_details?.phone || "no phone";
  const shipping = session.shipping_details?.address || {};
  const shippingName = session.shipping_details?.name || customerName;

  const itemsText = lineItems
    .map((li) => {
      const name = li.description || li.price?.product?.name || "Item";
      const qty = li.quantity || 1;
      return `${qty}× ${name}`;
    })
    .join("\n");

  const total = (session.amount_total / 100).toFixed(2);
  const subtotal = (session.amount_subtotal / 100).toFixed(2);
  const tax = ((session.total_details?.amount_tax || 0) / 100).toFixed(2);
  const shippingAmt = (
    (session.total_details?.amount_shipping || 0) / 100
  ).toFixed(2);

  const orderRef = session.id.slice(-8).toUpperCase();

  const smsBody = [
    `🛍️ NEW ORDER — Carter's Collections`,
    ``,
    `Ref: ${orderRef}`,
    `Total: $${total} (sub $${subtotal} · tax $${tax} · ship $${shippingAmt})`,
    ``,
    `Items:`,
    itemsText,
    ``,
    `Ship to:`,
    `${shippingName}`,
    `${shipping.line1 || ""}${shipping.line2 ? ", " + shipping.line2 : ""}`,
    `${shipping.city || ""}, ${shipping.state || ""} ${shipping.postal_code || ""}`,
    ``,
    `Customer: ${customerEmail} · ${customerPhone}`,
  ].join("\n");

  // Send SMS via Twilio REST API (no SDK needed — just fetch)
  if (!twilioSid || !twilioToken || !twilioFrom || !ownerPhone) {
    console.error("Missing Twilio env vars — order received but no SMS sent");
    console.log("Order details:\n" + smsBody);
    return { statusCode: 200, body: "Received (SMS skipped)" };
  }

  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
    const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");

    const body = new URLSearchParams({
      To: ownerPhone,
      From: twilioFrom,
      Body: smsBody,
    });

    const res = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Twilio error:", res.status, errText);
      return { statusCode: 200, body: "Received (Twilio failed)" };
    }
  } catch (err) {
    console.error("SMS send error:", err.message);
    // Still return 200 — we don't want Stripe to retry on SMS failures
  }

  return { statusCode: 200, body: "OK" };
};
