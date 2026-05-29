/* Injects header & footer markup on every page.
   Runs before app.js inits.
   ============================================================ */

/* ============================================================
   Pinterest Tag (base) — fires PageVisit on every page.
   Event hooks (AddToCart, Checkout, Purchase) live in app.js / cart.html / checkout-success.html.
   Enhanced match (em: hashed email) is only attached on the Purchase event,
   where we get the customer's verified email from Stripe.
   ============================================================ */
!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
pintrk('load', '2613927087053');
pintrk('page');

// <noscript> fallback pixel — injected on DOMContentLoaded so it lands inside <body>.
document.addEventListener('DOMContentLoaded', function () {
  var ns = document.createElement('noscript');
  ns.innerHTML = '<img height="1" width="1" style="display:none;" alt="" src="https://ct.pinterest.com/v3/?event=init&tid=2613927087053&noscript=1" />';
  document.body.appendChild(ns);
});

(function () {
  const onSub = location.pathname.includes('/pages/');
  const root = onSub ? '../' : '';
  const P = (f) => f === 'index.html' ? root + 'index.html' : root + 'pages/' + f;

  // Apothecary Wordmark — typographic identity with hairline rules above & below.
  // Two variants: full (with eyebrows, for footer) and compact (single line, for header).
  const logoCompact = `
    <span class="wm-compact">
      <span class="wm-rule" aria-hidden="true"></span>
      <span class="wm-name">Carter's <em>Collections</em></span>
      <span class="wm-rule" aria-hidden="true"></span>
    </span>
  `;
  const logoFull = `
    <span class="wm-full">
      <span class="wm-eyebrow" aria-hidden="true">
        <span class="wm-rule"></span>
        <span>Est. MMXXVI</span>
        <span class="wm-rule"></span>
      </span>
      <span class="wm-name">Carter's <em>Collections</em></span>
      <span class="wm-eyebrow" aria-hidden="true">
        <span class="wm-rule"></span>
        <span>Fragrance · Form</span>
        <span class="wm-rule"></span>
      </span>
    </span>
  `;

  const header = `
    <div class="announcement-bar" role="region" aria-label="Site announcement">
      <div class="container" style="text-align:center; padding:8px 16px; font-size:0.78rem; letter-spacing:0.14em; text-transform:uppercase; color:#0F0E0C; background:linear-gradient(90deg,#C49E58,#E0C079,#C49E58); font-weight:600;">
        <span class="announce-msg" data-announce style="transition:opacity 220ms ease;">Free U.S. Shipping On Every Order &nbsp;·&nbsp; Hand-Packed In Austin</span>
      </div>
    </div>
    <header class="site-header">
      <div class="container header-inner">
        <a href="${P('index.html')}" class="logo logo--wordmark" aria-label="Carter's Collections home">
          ${logoCompact}
        </a>
        <nav class="nav-primary" aria-label="Primary">
          <a href="${P('fragrances-men.html')}">Men's Fragrance</a>
          <a href="${P('fragrances-women.html')}">Women's Fragrance</a>
          <a href="${P('clothing.html')}">Clothing</a>
          <a href="${P('about.html')}">About</a>
        </nav>
        <div class="header-actions">
          <button class="icon-btn theme-toggle" aria-label="Toggle light or dark theme">
            <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
            </svg>
            <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          </button>
          <a href="${P('cart.html')}" class="icon-btn cart-btn" aria-label="View cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span class="cart-count" aria-label="Cart item count">0</span>
          </a>
          <button class="icon-btn hamburger" aria-label="Open menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
              <path d="M3 7h18M3 17h18"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <div class="mobile-nav" aria-hidden="true">
      <div class="mobile-nav-header">
        <a href="${P('index.html')}" class="logo logo--wordmark" data-close>
          ${logoCompact}
        </a>
        <button class="icon-btn" data-close aria-label="Close menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <path d="m6 6 12 12M18 6 6 18"/>
          </svg>
        </button>
      </div>
      <ul>
        <li><a href="${P('fragrances-men.html')}" data-close>Men's Fragrance</a></li>
        <li><a href="${P('fragrances-women.html')}" data-close>Women's Fragrance</a></li>
        <li><a href="${P('clothing.html')}" data-close>Clothing</a></li>
        <li><a href="${P('about.html')}" data-close>About</a></li>
        <li><a href="${P('cart.html')}" data-close>Cart</a></li>
      </ul>
    </div>
  `;

  const footer = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="${P('index.html')}" class="logo logo--wordmark logo--full">
              ${logoFull}
            </a>
            <p>Curated fragrance and considered womenswear, made for those who care for the quiet details.</p>
          </div>
          <div class="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="${P('fragrances-men.html')}">Men's Fragrance</a></li>
              <li><a href="${P('fragrances-women.html')}">Women's Fragrance</a></li>
              <li><a href="${P('clothing.html')}">Clothing</a></li>
              <li><a href="${P('cart.html')}">Cart</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>About</h4>
            <ul>
              <li><a href="${P('about.html')}">Our Story</a></li>
              <li><a href="${P('about.html')}">Provenance</a></li>

              <li><a href="${P('about.html')}">Journal</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Help</h4>
            <ul>
              <li><a href="${P('shipping-policy.html')}">Shipping</a></li>
              <li><a href="${P('return-policy.html')}">Returns</a></li>
              <li><a href="${P('contact.html')}">Contact</a></li>
              <li><a href="${P('privacy-policy.html')}">Privacy</a></li>
              <li><a href="${P('terms.html')}">Terms</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Connect</h4>
            <div class="footer-socials">
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg></a>
              <a href="#" aria-label="Pinterest"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M11 21c.7-2 .8-3 1-5l1-5"/><path d="M9 9c.5-2 2-3 4-3 2.5 0 4 1.6 4 4 0 3-2 5-4 5-1.6 0-2.5-1-2-2"/></svg></a>
              <a href="#" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 3v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M15 3c.5 2.5 2.5 4.5 5 5"/></svg></a>
            </div>
          </div>
        </div>
        <div class="footer-shipping-note" style="text-align:center; padding:18px 0 0; font-size:0.82rem; line-height:1.6; color:var(--text-muted); border-top:1px solid var(--border); margin-top:24px;">
          <strong style="color:var(--gold); letter-spacing:0.08em; text-transform:uppercase; font-size:0.78rem;">Free U.S. shipping · International free over $299 (or $29 flat)</strong><br/>
          <span style="display:inline-block; margin-top:6px; color:var(--text);">Use code <strong style="color:var(--gold); letter-spacing:0.06em;">10OFF</strong> for 10% off your order &mdash; valid through June 30, 2026.</span><br/>
          <span style="display:inline-block; margin-top:6px; font-size:0.78rem; color:var(--text-muted);">International orders ship in 7–21 business days and may incur customs duties on delivery (customer's responsibility). Questions? Email <a href="mailto:sales@carterscollections.com" style="color:var(--gold); text-decoration:none;">sales@carterscollections.com</a>.</span>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Carter's Collections. All rights reserved.</span>
          <span>Austin, TX · Made with care.</span>
        </div>
      </div>
    </footer>
  `;

  // Mount before app.js init listeners run
  const headerSlot = document.getElementById('header-slot');
  if (headerSlot) headerSlot.outerHTML = header;
  const footerSlot = document.getElementById('footer-slot');
  if (footerSlot) footerSlot.outerHTML = footer;

  // Announcement bar rotator (Free Shipping <-> 10OFF promo)
  try {
    var announceEl = document.querySelector('[data-announce]');
    if (announceEl) {
      var msgs = [
        'Free U.S. Shipping \u00A0\u00B7\u00A0 International Free Over $299 (or $29 Flat)',
        'Use Code 10OFF For 10% Off \u00A0\u00B7\u00A0 Ends June 30',
        'Hand-Packed In Austin \u00A0\u00B7\u00A0 Now Shipping Worldwide'
      ];
      var i = 0;
      setInterval(function(){
        i = (i + 1) % msgs.length;
        announceEl.style.opacity = '0';
        setTimeout(function(){ announceEl.textContent = msgs[i]; announceEl.style.opacity = '1'; }, 220);
      }, 4500);
    }
  } catch(e) {}
})();
