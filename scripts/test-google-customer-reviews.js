const assert = require("node:assert/strict");
const {
  MERCHANT_ID,
  addBusinessDays,
  customerReviewOptIn,
  deliveryCountry,
} = require("../netlify/functions/lib/google-customer-reviews");

assert.equal(MERCHANT_ID, 5799118477);
assert.equal(addBusinessDays("2026-07-31T12:00:00Z", 1), "2026-08-03");
assert.equal(addBusinessDays("2026-07-31T12:00:00Z", 11), "2026-08-17");

const domestic = {
  id: "cs_test_domestic",
  created: Date.parse("2026-07-31T12:00:00Z") / 1000,
  customer_details: {
    email: "customer@example.com",
    address: { country: "us" },
  },
  shipping_details: { address: { country: "US" } },
  metadata: { special_order: "false" },
};
assert.equal(deliveryCountry(domestic), "US");
assert.deepEqual(customerReviewOptIn(domestic), {
  merchant_id: 5799118477,
  order_id: "cs_test_domestic",
  email: "customer@example.com",
  delivery_country: "US",
  estimated_delivery_date: "2026-08-17",
});

const internationalSpecialOrder = {
  ...domestic,
  id: "cs_test_international",
  shipping_details: null,
  collected_information: {
    shipping_details: { address: { country: "ca" } },
  },
  metadata: { special_order: "true" },
};
assert.equal(deliveryCountry(internationalSpecialOrder), "CA");
assert.equal(
  customerReviewOptIn(internationalSpecialOrder).estimated_delivery_date,
  "2026-09-09",
);

assert.equal(customerReviewOptIn({ ...domestic, customer_details: {} }), null);
assert.equal(
  customerReviewOptIn({
    ...domestic,
    shipping_details: null,
    customer_details: { email: "customer@example.com", address: null },
  }),
  null,
);
assert.equal(customerReviewOptIn({ ...domestic, created: null }), null);

console.log("Google Customer Reviews helper tests passed.");
