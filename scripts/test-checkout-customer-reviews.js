const assert = require("node:assert/strict");
const Module = require("node:module");

let createdCheckout;
let retrievedSession;
let retrieveArguments;

const stripeMock = {
  checkout: {
    sessions: {
      create: async (options) => {
        createdCheckout = options;
        return { id: "cs_test_created", url: "https://checkout.stripe.test/session" };
      },
      retrieve: async (...args) => {
        retrieveArguments = args;
        return retrievedSession;
      },
    },
  },
};

const originalLoad = Module._load;
Module._load = function mockStripe(request, parent, isMain) {
  if (request === "stripe") return () => stripeMock;
  return originalLoad.call(this, request, parent, isMain);
};

process.env.STRIPE_SECRET_KEY = "sk_test_customer_reviews";
const createCheckout = require("../netlify/functions/create-checkout").handler;
const getSession = require("../netlify/functions/get-session").handler;
Module._load = originalLoad;

async function run() {
  const checkoutResponse = await createCheckout({
    httpMethod: "POST",
    headers: { host: "carterscollections.com" },
    body: JSON.stringify({
      origin: "https://carterscollections.com",
      items: [{
        id: "m23",
        cat: "fragrance",
        name: "Explorer Platinum",
        price: 77.99,
        qty: 1,
        specialOrder: true,
      }],
    }),
  });
  assert.equal(checkoutResponse.statusCode, 200);
  assert.equal(createdCheckout.metadata.special_order, "true");
  assert.equal(createdCheckout.metadata.item_count, "1");
  assert.equal(createdCheckout.shipping_options.length, 2);
  assert.equal(
    createdCheckout.success_url,
    "https://carterscollections.com/pages/checkout-success.html?session_id={CHECKOUT_SESSION_ID}",
  );

  retrievedSession = {
    id: "cs_test_paid",
    created: Date.parse("2026-07-31T12:00:00Z") / 1000,
    payment_status: "paid",
    amount_total: 7799,
    currency: "usd",
    customer_details: {
      email: "buyer@example.com",
      address: { country: "US" },
    },
    shipping_details: { address: { country: "US" } },
    metadata: { item_count: "1", special_order: "true" },
  };
  const paidResponse = await getSession({
    httpMethod: "GET",
    queryStringParameters: { session_id: "cs_test_paid" },
  });
  assert.equal(paidResponse.statusCode, 200);
  assert.deepEqual(retrieveArguments, ["cs_test_paid"]);
  assert.equal(paidResponse.headers["Cache-Control"], "no-store, private");
  assert.equal(paidResponse.headers["Referrer-Policy"], "no-referrer");
  assert.equal(paidResponse.headers["Access-Control-Allow-Origin"], undefined);
  const paidBody = JSON.parse(paidResponse.body);
  assert.equal(paidBody.ok, true);
  assert.equal(paidBody.amount_total, 77.99);
  assert.deepEqual(paidBody.customer_review_opt_in, {
    merchant_id: 5799118477,
    order_id: "cs_test_paid",
    email: "buyer@example.com",
    delivery_country: "US",
    estimated_delivery_date: "2026-08-24",
  });

  retrievedSession = { ...retrievedSession, payment_status: "unpaid" };
  const unpaidResponse = await getSession({
    httpMethod: "GET",
    queryStringParameters: { session_id: "cs_test_unpaid" },
  });
  assert.deepEqual(JSON.parse(unpaidResponse.body), {
    ok: false,
    reason: "not_paid",
  });

  console.log("Checkout and Customer Reviews integration tests passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
