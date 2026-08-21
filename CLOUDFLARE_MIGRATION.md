# Cloudflare deployment

The storefront is deployed as one Cloudflare Worker with Static Assets. The
Worker keeps the existing `/api/*` URLs used by the cart, checkout-success
page, prize wheel, Stripe webhook, and newsletter forms.

## Build and validation

```sh
npm ci
npm run build:cloudflare
npm run test:cloudflare
npx wrangler deploy --dry-run
```

The production deploy command is `npx wrangler deploy`.

## Required secrets and bindings

Configure these as encrypted Worker secrets:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `OWNER_PHONE_NUMBER`
- `RESEND_API_KEY`

Create a Workers KV namespace and bind it as `NEWSLETTER_SIGNUPS`. The binding
stores future newsletter signups after Netlify Forms is retired.

`SITE_ORIGIN` is a non-secret variable committed in `wrangler.jsonc` and must
remain `https://carterscollections.com` in production.

## Cutover checklist

1. Deploy to the generated `workers.dev` preview URL.
2. Verify the homepage, representative category/product pages, cart, redirects,
   newsletter capture, and a Stripe test checkout.
3. Add the new `/api/stripe-webhook` endpoint in Stripe and verify its signing
   secret before disabling the Netlify endpoint.
4. Add `carterscollections.com` and `www.carterscollections.com` as Worker custom
   domains.
5. Re-test checkout and the Stripe webhook on the custom domain.
6. Keep the Netlify project intact temporarily as a rollback target.
