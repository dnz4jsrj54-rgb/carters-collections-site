// netlify/functions/submission-created.js
// Auto-sends a welcome email when the "newsletter" form is submitted.
// Netlify automatically invokes a function named "submission-created" on every
// verified form submission — no extra wiring needed.
//
// One-time setup:
//   1. Sign up at https://resend.com (free tier) -> get an API key
//   2. Verify carterscollections.com in Resend (Domains tab -> add DNS records)
//   3. In Netlify: Site configuration > Environment variables > add RESEND_API_KEY
// Until RESEND_API_KEY is set, this function no-ops gracefully (form still saves).

exports.handler = async (event) => {
  try {
    const payload = JSON.parse(event.body).payload;
    const formName = payload.form_name;
    const email = payload.data && payload.data.email;

    // Only react to the newsletter form
    if (formName !== "newsletter" || !email) {
      return { statusCode: 200, body: "Ignored (not a newsletter signup)" };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      // Graceful no-op: the form submission is still saved by Netlify Forms.
      console.log("RESEND_API_KEY not set — skipping welcome email for", email);
      return { statusCode: 200, body: "Skipped (RESEND_API_KEY not configured)" };
    }

    const html = `
<div style="font-family:Georgia,serif;max-width:600px;margin:auto;">
  <div style="background:#1a1a1a;color:#fff;padding:24px;text-align:center;letter-spacing:2px;">CARTER'S COLLECTIONS</div>
  <div style="padding:32px;">
    <h1 style="color:#1a1a1a;">Welcome — here's 10% off.</h1>
    <p style="color:#444;line-height:1.6;">Authentic designer fragrances and hand-picked dresses, shipped fast from Austin, TX.</p>
    <div style="border:2px dashed #1a1a1a;border-radius:8px;padding:16px;text-align:center;margin:24px 0;">
      <div style="font-size:13px;color:#888;">YOUR CODE</div>
      <div style="font-size:28px;font-weight:bold;letter-spacing:3px;">10OFF</div>
      <div style="font-size:12px;color:#888;">10% off · free U.S. shipping · expires Jun 30, 2026</div>
    </div>
    <p style="text-align:center;">
      <a href="https://carterscollections.com" style="background:#1a1a1a;color:#fff;padding:14px 36px;border-radius:6px;text-decoration:none;">Shop Now</a>
    </p>
  </div>
</div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Carter's Collections <hello@carterscollections.com>",
        to: email,
        subject: "Here's your 10% off 👀",
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: 502, body: `Resend error: ${errText}` };
    }

    return { statusCode: 200, body: `Welcome email sent to ${email}` };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
};
