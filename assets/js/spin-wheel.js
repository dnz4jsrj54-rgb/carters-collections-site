/* ============================================================
   Carter's Collections — Spin-the-Wheel (homepage only)

   Flow:
     1. Pops a modal a few seconds after landing (once per visitor).
     2. Visitor enters email to unlock the spin.
     3. Wheel animates to a weighted-random prize.
     4. We call POST /api/spin-reward to mint a UNIQUE, single-use,
        7-day promo code in Stripe and reveal it.

   Sharing-proof: every code is max_redemptions:1 + 7-day expiry, so a
   screenshotted code dies after one order. Email-gated server-side so a
   visitor can't farm a stack of codes.

   Wedges (8): mostly 10%, some 15%, rare 20%, two small $15 wedges.
   ============================================================ */
(function () {
  try {
    var SEEN_KEY = "cc_spin_seen_v1";
    var EXIT_KEY = "cc_exit_offer_seen_v1"; // shared with exit-popup so we don't double-pop
    if (localStorage.getItem(SEEN_KEY)) return;

    // Wedge layout, clockwise from the top (pointer). Each maps to a prize key
    // the backend understands. Weighting handled separately so the *visual*
    // wheel can show 20% while still being rare.
    // Three prizes only: 15%, $15, 20%. Eight wedges keep the wheel full and
    // fun: four 15% wedges, two $15 wedges, two 20% wedges. Colors alternate.
    var WEDGES = [
      { label: "15% OFF", prize: "p15", color: "#C9A961" },
      { label: "$15 OFF", prize: "d15", color: "#1A1814" },
      { label: "15% OFF", prize: "p15", color: "#241F18" },
      { label: "20% OFF", prize: "p20", color: "#C9A961" },
      { label: "15% OFF", prize: "p15", color: "#1A1814" },
      { label: "$15 OFF", prize: "d15", color: "#241F18" },
      { label: "15% OFF", prize: "p15", color: "#C9A961" },
      { label: "20% OFF", prize: "p20", color: "#1A1814" }
    ];

    // Weighted landing per WEDGE INDEX. Targets: 15% ≈ 55%, $15 ≈ 30%, 20% ≈ 15%.
    // Four 15% wedges share 55 (≈13.75 each); two $15 wedges share 30 (15 each);
    // two 20% wedges share 15 (7.5 each). Spread so the visual landing matches.
    var WEIGHTS = [13.75, 15, 13.75, 7.5, 13.75, 15, 13.75, 7.5];

    var spun = false;

    function pickIndex() {
      var total = WEIGHTS.reduce(function (a, b) { return a + b; }, 0);
      var r = Math.random() * total;
      for (var i = 0; i < WEIGHTS.length; i++) {
        if (r < WEIGHTS[i]) return i;
        r -= WEIGHTS[i];
      }
      return 0;
    }

    function buildModal() {
      var wrap = document.createElement("div");
      wrap.id = "cc-spin-overlay";
      wrap.setAttribute("role", "dialog");
      wrap.setAttribute("aria-modal", "true");
      wrap.setAttribute("aria-label", "Spin to win a discount");
      wrap.style.cssText =
        "position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(8,8,10,0.74);backdrop-filter:blur(4px);opacity:0;transition:opacity .25s ease;";

      wrap.innerHTML =
        '<div id="cc-spin-card" style="position:relative;width:100%;max-width:440px;background:var(--bg,#0F0E0C);color:var(--text,#EDE6D8);border:1px solid var(--gold,#C9A961);border-radius:16px;padding:30px 26px 26px;box-shadow:0 26px 80px rgba(0,0,0,0.6);transform:translateY(14px) scale(.98);transition:transform .3s ease;font-family:var(--font-body,sans-serif);text-align:center;">' +
        '<button id="cc-spin-close" aria-label="Close" style="position:absolute;top:10px;right:14px;background:none;border:none;font-size:1.6rem;line-height:1;color:var(--text-muted,#9A9384);cursor:pointer;z-index:2;">&times;</button>' +
        '<div style="font-family:var(--font-display,serif);font-style:italic;font-size:0.8rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold,#C9A961);margin-bottom:6px;">Carter\u2019s Collections</div>' +
        '<h2 style="font-family:var(--font-display,serif);font-size:1.85rem;line-height:1.15;margin:0 0 4px;">Spin to win your discount</h2>' +
        '<p style="font-size:0.88rem;line-height:1.55;color:var(--text-muted,#9A9384);margin:0 0 16px;">One spin per shopper. Your code is one-time use and good for 7 days.</p>' +

        // Wheel
        '<div style="position:relative;width:288px;height:288px;margin:0 auto 18px;">' +
          '<canvas id="cc-wheel" width="288" height="288" style="width:288px;height:288px;border-radius:50%;display:block;"></canvas>' +
          // pointer
          '<div style="position:absolute;top:-6px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-top:22px solid var(--gold,#C9A961);filter:drop-shadow(0 2px 3px rgba(0,0,0,.5));z-index:3;"></div>' +
          // hub
          '<div style="position:absolute;top:50%;left:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:var(--bg,#0F0E0C);border:2px solid var(--gold,#C9A961);display:flex;align-items:center;justify-content:center;font-family:var(--font-display,serif);font-size:0.7rem;letter-spacing:0.1em;color:var(--gold,#C9A961);z-index:2;">C&middot;C</div>' +
        '</div>' +

        // Email gate
        '<form id="cc-spin-form" name="newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field" style="display:flex;flex-direction:column;gap:10px;">' +
          '<input type="hidden" name="form-name" value="newsletter" />' +
          '<p style="display:none;"><label>Don\u2019t fill this out: <input name="bot-field" /></label></p>' +
          '<input id="cc-spin-email" type="email" name="email" required placeholder="you@email.com" style="padding:13px 14px;border:1px solid var(--border,#2E2A24);border-radius:9px;font-size:0.95rem;font-family:inherit;background:rgba(255,255,255,0.03);color:var(--text,#EDE6D8);text-align:center;" />' +
          '<button id="cc-spin-go" type="submit" style="padding:14px;border:none;border-radius:9px;background:var(--gold,#C9A961);color:#15120A;font-weight:600;font-size:1rem;letter-spacing:0.04em;cursor:pointer;font-family:inherit;">SPIN THE WHEEL</button>' +
        '</form>' +

        // Result
        '<div id="cc-spin-result" style="display:none;">' +
          '<p id="cc-spin-win" style="font-family:var(--font-display,serif);font-size:1.5rem;margin:4px 0 8px;color:var(--gold,#C9A961);"></p>' +
          '<p style="font-size:0.85rem;color:var(--text-muted,#9A9384);margin:0 0 8px;">Use this code at checkout:</p>' +
          '<div id="cc-spin-code" style="display:inline-block;border:1px dashed var(--gold,#C9A961);border-radius:9px;padding:11px 20px;font-size:1.2rem;font-weight:700;letter-spacing:0.1em;color:var(--gold,#C9A961);font-family:var(--font-body,sans-serif);"></div>' +
          '<p id="cc-spin-exp" style="font-size:0.76rem;color:var(--text-faint,#5E594F);margin:12px 0 4px;"></p>' +
          '<a href="' + (window.CC_PATH ? window.CC_PATH("sale.html") : "pages/sale.html") + '" id="cc-spin-shop" style="display:inline-block;margin-top:10px;padding:11px 22px;border:1px solid var(--gold,#C9A961);border-radius:9px;color:var(--gold,#C9A961);text-decoration:none;font-size:0.9rem;letter-spacing:0.04em;">Shop the Sale &rarr;</a>' +
        '</div>' +

        '<button id="cc-spin-decline" style="display:block;margin:14px auto 0;background:none;border:none;font-size:0.76rem;color:var(--text-faint,#5E594F);text-decoration:underline;cursor:pointer;font-family:inherit;">No thanks</button>' +
        '</div>';
      return wrap;
    }

    function drawWheel(canvas) {
      var ctx = canvas.getContext("2d");
      var n = WEDGES.length;
      var cx = 144, cy = 144, r = 138;
      var arc = (Math.PI * 2) / n;
      // start at top (-90deg) so wedge 0 is centered under the pointer
      var start = -Math.PI / 2 - arc / 2;
      for (var i = 0; i < n; i++) {
        var a0 = start + i * arc;
        var a1 = a0 + arc;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, a0, a1);
        ctx.closePath();
        ctx.fillStyle = WEDGES[i].color;
        ctx.fill();
        ctx.strokeStyle = "#C9A961";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // label
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a0 + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = WEDGES[i].color === "#C9A961" ? "#15120A" : "#EDE6D8";
        ctx.font = "600 14px Inter, sans-serif";
        ctx.fillText(WEDGES[i].label, r - 16, 5);
        ctx.restore();
      }
      // outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "#C9A961";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    function close(overlay) {
      localStorage.setItem(SEEN_KEY, "1");
      localStorage.setItem(EXIT_KEY, "1"); // also suppress the exit popup
      overlay.style.opacity = "0";
      setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 260);
    }

    function show() {
      if (localStorage.getItem(SEEN_KEY)) return;
      var overlay = buildModal();
      document.body.appendChild(overlay);
      var canvas = document.getElementById("cc-wheel");
      drawWheel(canvas);

      requestAnimationFrame(function () {
        overlay.style.opacity = "1";
        var card = document.getElementById("cc-spin-card");
        if (card) card.style.transform = "translateY(0) scale(1)";
      });

      overlay.addEventListener("click", function (e) { if (e.target === overlay) close(overlay); });
      document.getElementById("cc-spin-close").addEventListener("click", function () { close(overlay); });
      document.getElementById("cc-spin-decline").addEventListener("click", function () { close(overlay); });

      var form = document.getElementById("cc-spin-form");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (spun) return;
        var email = document.getElementById("cc-spin-email").value.trim();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
        spun = true;

        var btn = document.getElementById("cc-spin-go");
        btn.disabled = true;
        btn.textContent = "Spinning\u2026";

        // Capture the email into the Netlify newsletter list (fire-and-forget).
        try {
          var data = new URLSearchParams(new FormData(form)).toString();
          fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data }).catch(function () {});
        } catch (e2) {}

        var winIdx = pickIndex();
        var prizeKey = WEDGES[winIdx].prize;
        var n = WEDGES.length;
        var arc = 360 / n;
        // Rotate so the winning wedge center stops under the top pointer.
        var spins = 6; // full rotations for drama
        var targetDeg = spins * 360 + (360 - winIdx * arc);
        var jitter = (Math.random() - 0.5) * (arc * 0.5);
        targetDeg += jitter;

        canvas.style.transition = "transform 4.2s cubic-bezier(.17,.67,.21,1)";
        canvas.style.transform = "rotate(" + targetDeg + "deg)";

        // Request the real Stripe code in parallel with the animation.
        var codePromise = fetch("/api/spin-reward", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, prize: prizeKey })
        }).then(function (r) { return r.json(); }).catch(function () { return null; });

        setTimeout(function () {
          codePromise.then(function (res) {
            form.style.display = "none";
            var result = document.getElementById("cc-spin-result");
            result.style.display = "block";
            var winLabel = WEDGES[winIdx].label;
            document.getElementById("cc-spin-win").textContent = "You won " + winLabel + "!";
            if (res && res.code) {
              document.getElementById("cc-spin-code").textContent = res.code;
              if (res.expires_at) {
                var d = new Date(res.expires_at * 1000);
                var opts = { month: "short", day: "numeric" };
                document.getElementById("cc-spin-exp").textContent =
                  "One-time use \u00b7 expires " + d.toLocaleDateString("en-US", opts) +
                  (prizeKey === "d15" ? " \u00b7 min. order $29.99" : "");
              }
            } else {
              // Backend hiccup: still honor the win with the standing code.
              document.getElementById("cc-spin-code").textContent = "10OFF";
              document.getElementById("cc-spin-exp").textContent = "10% off + free U.S. shipping \u00b7 ends June 30, 2026";
            }
            localStorage.setItem(SEEN_KEY, "1");
            localStorage.setItem(EXIT_KEY, "1");
          });
        }, 4300);
      });
    }

    // Trigger ~6s after landing (homepage only — script is included only there).
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(show, 6000);
    } else {
      document.addEventListener("DOMContentLoaded", function () { setTimeout(show, 6000); });
    }
  } catch (e) {}
})();
