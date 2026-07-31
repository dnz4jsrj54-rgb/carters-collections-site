const MERCHANT_ID = 5799118477;

function addBusinessDays(orderedAt, businessDays) {
  const date = new Date(orderedAt);
  if (Number.isNaN(date.getTime())) return "";

  let remaining = Math.max(0, Number(businessDays) || 0);
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }

  return date.toISOString().slice(0, 10);
}

function deliveryCountry(session) {
  const country =
    session.shipping_details?.address?.country ||
    session.collected_information?.shipping_details?.address?.country ||
    session.customer_details?.address?.country ||
    "";
  const normalized = String(country).trim().toUpperCase();
  return /^[A-Z]{2}$/.test(normalized) ? normalized : "";
}

function customerReviewOptIn(session) {
  const email = String(
    session.customer_details?.email || session.customer_email || "",
  ).trim();
  const country = deliveryCountry(session);
  const orderId = String(session.id || "").trim();
  const createdAt = Number(session.created) * 1000;

  if (
    !email ||
    !country ||
    !orderId ||
    !Number.isFinite(createdAt) ||
    createdAt <= 0
  ) return null;

  // Published windows include up to two handling days. Special-order items can
  // add five sourcing days before the normal carrier window.
  const isSpecialOrder = session.metadata?.special_order === "true";
  const carrierWindow = country === "US" ? 9 : 21;
  const businessDays = 2 + carrierWindow + (isSpecialOrder ? 5 : 0);
  const estimatedDeliveryDate = addBusinessDays(createdAt, businessDays);
  if (!estimatedDeliveryDate) return null;

  return {
    merchant_id: MERCHANT_ID,
    order_id: orderId,
    email,
    delivery_country: country,
    estimated_delivery_date: estimatedDeliveryDate,
  };
}

module.exports = {
  MERCHANT_ID,
  addBusinessDays,
  customerReviewOptIn,
  deliveryCountry,
};
