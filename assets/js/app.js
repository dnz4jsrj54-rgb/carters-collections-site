/* Carter's Collections — App Logic
   Cart state in-memory (no localStorage). Theme toggle in-memory.
   ============================================================ */

// ============================================================
// Product Catalog (shared across pages)
// ============================================================
window.CARTER_CATALOG = {
  m1: { id: 'm1', name: 'His Confession', subtitle: 'by Lattafa', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Bergamot · Rose · Oud · Sandalwood', price: 32.99, oldPrice: 40, image: 'assets/real-products/confession_1.jpg', imageFit: 'contain', badge: 'Signature', detail: 'product-confession.html', real: true },
  m2: { id: 'm2', name: 'Le Male Le Parfum', subtitle: 'by Jean Paul Gaultier', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Cardamom · Lavender · Vanilla · Tonka', price: 89.99, oldPrice: 152, image: 'assets/real-products/item3_1.jpg', imageFit: 'contain', badge: 'Iconic', detail: 'product-lemale-parfum.html', real: true },
  m3: { id: 'm3', name: 'Le Male Elixir', subtitle: 'by Jean Paul Gaultier', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Lavender · Mint · Honey · Tobacco', price: 99.99, oldPrice: 178, image: 'assets/real-products/item4_1.jpg', imageFit: 'contain', badge: 'Bestseller', detail: 'product-lemale-elixir.html', real: true },
  m4: { id: 'm4', name: 'Sauvage Elixir', subtitle: 'by Dior', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Cinnamon · Nutmeg · Licorice · Sandalwood', price: 169.99, oldPrice: 199, image: 'assets/real-products/sauvage_elixir_1.jpg', imageFit: 'contain', badge: 'Iconic', detail: 'product-sauvage-elixir.html', real: true },
  m5: { id: 'm5', name: 'Eros', subtitle: 'by Versace', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Mint · Green Apple · Tonka · Vanilla', price: 64.99, oldPrice: 120, image: 'assets/real-products/eros_1.jpg', imageFit: 'contain', badge: 'Bestseller', detail: 'product-eros.html', real: true },
  m6: { id: 'm6', name: 'Stronger With You Intensely', subtitle: 'by Armani', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Pink Pepper · Lavender · Honey · Vanilla', price: 89.99, oldPrice: 130, image: 'assets/real-products/stronger_1.jpg', imageFit: 'contain', badge: 'Signature', detail: 'product-stronger.html', real: true },
  m7: { id: 'm7', name: 'Asad', subtitle: 'by Lattafa', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Pineapple · Bergamot · Amber · Patchouli', price: 42.99, oldPrice: 60, image: 'assets/real-products/asad_1.jpg', imageFit: 'contain', badge: 'Niche Pick', detail: 'product-asad.html', real: true },
  m8: { id: 'm8', name: '9PM', subtitle: 'by Afnan', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Apple · Cinnamon · Vanilla · Sandalwood', price: 44.99, oldPrice: 65, image: 'assets/real-products/ninepm_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-9pm.html', real: true },
  w1: { id: 'w1', name: 'Yara Moi', subtitle: 'by Lattafa', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Peach · Jasmine · Caramel · Sandalwood', price: 24.99, oldPrice: 40, image: 'assets/real-products/yara_2.jpg', imageFit: 'contain', badge: 'Bestseller', detail: 'product-yara.html', real: true },
  w2: { id: 'w2', name: 'Bright Crystal', subtitle: 'by Versace', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Yuzu · Peony · Magnolia · Musk', price: 84.99, oldPrice: 128, image: 'assets/real-products/bright_crystal_1.jpg', imageFit: 'contain', badge: 'Iconic', detail: 'product-bright-crystal.html', real: true },
  w3: { id: 'w3', name: 'Libre', subtitle: 'by Yves Saint Laurent', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Lavender · Orange Blossom · Vanilla · Musk', price: 119.99, oldPrice: 180, image: 'assets/real-products/libre_1.jpg', imageFit: 'contain', badge: 'Bestseller', detail: 'product-libre.html', real: true },
  w4: { id: 'w4', name: 'Replica On A Date', subtitle: 'by Maison Margiela', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Pink Pepper · Rose · Wine · Patchouli', price: 144.99, oldPrice: 170, image: 'assets/real-products/onadate_1.jpg', imageFit: 'contain', badge: 'Niche', detail: 'product-on-a-date.html', real: true },
  w5: { id: 'w5', name: 'Khamrah', subtitle: 'by Lattafa', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Cinnamon · Dates · Vanilla · Tonka', price: 49.99, oldPrice: 70, image: 'assets/real-products/khamrah_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-khamrah.html', real: true },
  w6: { id: 'w6', name: 'Cloud', subtitle: 'by Ariana Grande', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Lavender Blossom · Pear · Praline · Musk', price: 54.99, oldPrice: 72, image: 'assets/real-products/cloud_1.jpg', imageFit: 'contain', badge: 'Bestseller', detail: 'product-cloud.html', real: true },
  w7: { id: 'w7', name: 'Glossier You', subtitle: 'by Glossier', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Pink Pepper · Iris · Ambrette · Ambrox', price: 74.99, oldPrice: 82, image: 'assets/real-products/glossier_you_1.jpg', imageFit: 'contain', badge: 'Cult Favorite', detail: 'product-glossier-you.html', real: true },
  w8: { id: 'w8', name: 'Cheirosa 62 Mist', subtitle: 'by Sol de Janeiro', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Pistachio · Salted Caramel · Vanilla', price: 36.99, oldPrice: 39, image: 'assets/real-products/cheirosa62_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-cheirosa62.html', real: true },
  c1: { id: 'c1', name: 'Satin Slip Backless Maxi', cat: 'clothing', section: 'Dresses', notes: 'Black · Mauve · Silver Grey', price: 22.99, oldPrice: 75, image: 'assets/real-products/dress_1.jpg', imageFit: 'cover-cropped', badge: 'Bestseller', detail: 'product-dress.html', real: true },
  c2: { id: 'c2', name: 'Easy Lounge Maxi', cat: 'clothing', section: 'Dresses', notes: 'Relaxed fit · Open back · 17 colors', price: 22.99, oldPrice: 58, image: 'assets/real-products/dress2_1.jpg', imageFit: 'cover-cropped', badge: 'New', detail: 'product-loungemaxi.html', real: true },
  c3: { id: 'c3', name: 'Lace-Up Cutout Mock-Neck Dress', cat: 'clothing', section: 'Dresses', notes: 'Mock neck · Lace-up sides · Black, White, Orange', price: 22.99, oldPrice: 62, image: 'assets/real-products/dress3_1.jpg', imageFit: 'cover-cropped', badge: 'New', detail: 'product-cutout.html', real: true },
  c4: { id: 'c4', name: 'Floral Tie-Strap Maxi', cat: 'clothing', section: 'Dresses', notes: 'Ditsy floral · Tie-up straps · 4 colorways', price: 22.99, oldPrice: 60, image: 'assets/real-products/dress4_1.jpg', imageFit: 'cover-cropped', badge: 'New', detail: 'product-floral.html', real: true },
  m9: { id: 'm9', name: "Aventus", subtitle: 'by Creed', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Blackcurrant · Bergamot · Pineapple · Apple', price: 399.99, oldPrice: 495, image: 'assets/real-products/m9_1.jpg', imageFit: 'contain', badge: 'Iconic', detail: 'product-creed-aventus.html', real: true },
  m10: { id: 'm10', name: "Acqua Di Giò", subtitle: 'by Giorgio Armani', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Sea Notes · Green Mandarin · Clary Sage · Lavender', price: 99.99, oldPrice: 165, image: 'assets/real-products/m10_1.jpg', imageFit: 'contain', badge: 'Bestseller', detail: 'product-acqua-di-gio.html', real: true },
  m11: { id: 'm11', name: "Paradigme", subtitle: 'by Prada', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Neroli · Geranium · Sage · Vetiver', price: 134.99, oldPrice: 220, image: 'assets/real-products/m11_1.jpg', imageFit: 'contain', badge: 'Signature', detail: 'product-prada-paradigme.html', real: true },
  m12: { id: 'm12', name: "Y", subtitle: 'by Yves Saint Laurent', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Bergamot · Ginger · Apple · Grapefruit', price: 114.99, oldPrice: 165, image: 'assets/real-products/m12_1.jpg', imageFit: 'contain', badge: 'Bestseller', detail: 'product-ysl-y.html', real: true },
  m13: { id: 'm13', name: "Sauvage", subtitle: 'by Dior', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Calabrian Bergamot · Sichuan Pepper · Star Anise · Lavender', price: 169.99, oldPrice: 185, image: 'assets/real-products/m13_1.jpg', imageFit: 'contain', badge: 'Iconic', detail: 'product-dior-sauvage.html', real: true },
  m14: { id: 'm14', name: "Layton", subtitle: 'by Parfums de Marly', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Cardamom · Apple · Violet · Bergamot', price: 409.99, oldPrice: 545, image: 'assets/real-products/m14_1.jpg', imageFit: 'contain', badge: 'Niche Pick', detail: 'product-pdm-layton.html', real: true },
  m15: { id: 'm15', name: "Myslf", subtitle: 'by Yves Saint Laurent', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Calabrian Bergamot · Bergamot · Orange Blossom · Ambrofix', price: 124.99, oldPrice: 155, image: 'assets/real-products/m15_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-ysl-myslf.html', real: true },
  m16: { id: 'm16', name: "Hawas", subtitle: 'by Rasasi', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Bergamot · Violet Leaf · Cardamom · Citrus', price: 54.99, oldPrice: 80, image: 'assets/real-products/m16_1.jpg', imageFit: 'contain', badge: 'Cult Favorite', detail: 'product-rasasi-hawas.html', real: true },
  m17: { id: 'm17', name: "Club De Nuit Intense", subtitle: 'by Armaf', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Lemon · Blackcurrant · Apple · Jasmine', price: 37.99, oldPrice: 75, image: 'assets/real-products/m17_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-armaf-cdni.html', real: true },
  m18: { id: 'm18', name: "Phantom", subtitle: 'by Paco Rabanne', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: 'Lavender · Lemon Zest · Amalfi Lemon · Apple', price: 84.99, oldPrice: 130, image: 'assets/real-products/m18_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-paco-phantom.html', real: true },
  w9: { id: 'w9', name: "Sì Intense", subtitle: 'by Giorgio Armani', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Rose · Bergamot · Blackcurrant · Freesia', price: 99.99, oldPrice: 174, image: 'assets/real-products/w9_1.jpg', imageFit: 'contain', badge: 'Bestseller', detail: 'product-armani-si-intense.html', real: true },
  w10: { id: 'w10', name: "Good Girl", subtitle: 'by Carolina Herrera', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Jasmine Sambac · Coffee · Almond · Bergamot', price: 119.99, oldPrice: 148, image: 'assets/real-products/w10_1.jpg', imageFit: 'contain', badge: 'Iconic', detail: 'product-good-girl.html', real: true },
  w11: { id: 'w11', name: "La Vie Est Belle L'Elixir", subtitle: 'by Lancôme', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Blackcurrant · Iris · Patchouli · Orange Blossom', price: 134.99, oldPrice: 210, image: 'assets/real-products/w11_1.jpg', imageFit: 'contain', badge: 'Bestseller', detail: 'product-lavb-elixir.html', real: true },
  w12: { id: 'w12', name: "Miss Dior", subtitle: 'by Dior', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Rose · Peony · Lily of the Valley · Jasmine', price: 194.99, oldPrice: 225, image: 'assets/real-products/w12_1.jpg', imageFit: 'contain', badge: 'Iconic', detail: 'product-miss-dior.html', real: true },
  w13: { id: 'w13', name: "Flowerbomb", subtitle: 'by Viktor & Rolf', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Bergamot · Tea · Jasmine · Freesia', price: 99.99, oldPrice: 182, image: 'assets/real-products/w13_1.jpg', imageFit: 'contain', badge: 'Cult Favorite', detail: 'product-flowerbomb.html', real: true },
  w14: { id: 'w14', name: "Delina Exclusif", subtitle: 'by Parfums de Marly', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Turkish Rose · Lychee · Rhubarb · Peony', price: 434.99, oldPrice: 555, image: 'assets/real-products/w14_1.jpg', imageFit: 'contain', badge: 'Niche Pick', detail: 'product-pdm-delina-exclusif.html', real: true },
  w15: { id: 'w15', name: "Yara", subtitle: 'by Lattafa', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Bergamot · Lemon · Violet · Raspberry', price: 32.99, oldPrice: 55, image: 'assets/real-products/w15_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-lattafa-yara.html', real: true },
  w16: { id: 'w16', name: "Black Opium", subtitle: 'by Yves Saint Laurent', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Coffee · Pink Pepper · Orange Blossom · Jasmine', price: 134.99, oldPrice: 172, image: 'assets/real-products/w16_1.jpg', imageFit: 'contain', badge: 'Bestseller', detail: 'product-ysl-black-opium.html', real: true },
  w17: { id: 'w17', name: "Her", subtitle: 'by Burberry', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Raspberry · Cherry · Strawberry · Blackberry', price: 119.99, oldPrice: 181, image: 'assets/real-products/w17_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-burberry-her.html', real: true },
  w18: { id: 'w18', name: "Baroque Rouge 540", subtitle: 'by Maison Alhambra', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: 'Jasmine · Egyptian Grandiflorum · Saffron · Cedar', price: 27.99, oldPrice: 65, image: 'assets/real-products/w18_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-alhambra-br540.html', real: true },
  m19: { id: 'm19', name: "Legend Blue", subtitle: 'by Mont Blanc', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: "Lavender · Mint · Cedar · Ambroxan", price: 109.99, oldPrice: 165, image: 'assets/real-products/m19_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-mont-blanc-legend-blue.html', real: true },
  m20: { id: 'm20', name: "Eros Flame", subtitle: 'by Versace', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: "Italian Citrus · Black Pepper · Tonka · Vanilla", price: 169.99, oldPrice: 230, image: 'assets/real-products/m20_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-versace-eros-flame.html', real: true },
  m21: { id: 'm21', name: "Bad Boy", subtitle: 'by Carolina Herrera', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: "Black Pepper · Sage · Cacao · Tonka", price: 169.99, oldPrice: 220, image: 'assets/real-products/m21_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-carolina-herrera-bad-boy.html', real: true },
  m22: { id: 'm22', name: "Tobacco Vanille", subtitle: 'by Tom Ford', cat: 'fragrance', section: 'Men\u2019s Fragrance', notes: "Tobacco Leaf · Tonka · Vanilla · Cocoa", price: 474.99, oldPrice: 600, image: 'assets/real-products/m22_1.jpg', imageFit: 'contain', badge: 'Iconic', detail: 'product-tom-ford-tobacco-vanille.html', real: true },
  w19: { id: 'w19', name: "Hypnotic Poison", subtitle: 'by Dior', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: "Bitter Almond · Caraway · Jasmine · Vanilla", price: 239.99, oldPrice: 295, image: 'assets/real-products/w19_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-dior-hypnotic-poison.html', real: true },
  w20: { id: 'w20', name: "Black Orchid", subtitle: 'by Tom Ford', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: "Black Truffle · Orchid · Patchouli · Dark Chocolate", price: 264.99, oldPrice: 425, image: 'assets/real-products/w20_1.jpg', imageFit: 'contain', badge: 'Iconic', detail: 'product-tom-ford-black-orchid.html', real: true },
  w21: { id: 'w21', name: "Vanilla 28", subtitle: 'by Kayali', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: "Vanilla Orchid · Brown Sugar · Tonka · Amber", price: 299.99, oldPrice: 399, image: 'assets/real-products/w21_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-kayali-vanilla-28.html', real: true },
  w22: { id: 'w22', name: "By the Fireplace", subtitle: 'by Maison Margiela', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: "Chestnut · Clove · Guaiac Wood · Vanilla", price: 234.99, oldPrice: 305, image: 'assets/real-products/w22_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-margiela-by-the-fireplace.html', real: true },
  w23: { id: 'w23', name: "Sparkle", subtitle: 'by Kate Spade New York', cat: 'fragrance', section: 'Women\u2019s Fragrance', notes: "Blackcurrant · Pink Pepper · Peony · Crème Brûlée", price: 89.99, oldPrice: 115, image: 'assets/real-products/kate_spade_sparkle_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-kate-spade-sparkle.html', real: true },
};

// ============================================================
// Persistent cart state (localStorage with safe fallback)
// ============================================================
const CART_STORAGE_KEY = 'carters_collection_cart_v1';
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}
function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(window.CARTER_STATE.cart));
  } catch (e) {
    // localStorage unavailable (sandbox/private mode) — silently degrade
  }
}
window.CARTER_STATE = window.CARTER_STATE || {
  cart: loadCart(), // [{id, qty, size, color}]
  theme: 'dark',
};
window.saveCart = saveCart;

function imgPath(rel) {
  // Adjust image paths when running from /pages/
  const onSub = location.pathname.includes('/pages/');
  return onSub ? '../' + rel : rel;
}
function pagePath(file) {
  const onSub = location.pathname.includes('/pages/');
  if (file === 'index.html') return onSub ? '../index.html' : 'index.html';
  return onSub ? file : 'pages/' + file;
}
window.imgPath = imgPath;
window.pagePath = pagePath;

// ============================================================
// Header: scroll style, mobile nav, theme, cart count
// ============================================================
function initHeader() {
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const ham = document.querySelector('.hamburger');
  const overlay = document.querySelector('.mobile-nav');
  if (ham && overlay) {
    ham.addEventListener('click', () => overlay.classList.add('is-open'));
    overlay.querySelectorAll('[data-close]').forEach(el =>
      el.addEventListener('click', () => overlay.classList.remove('is-open'))
    );
  }

  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      window.CARTER_STATE.theme = next;
    });
  }
  updateCartCount();
}

function updateCartCount() {
  const count = window.CARTER_STATE.cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('is-visible', count > 0);
  });
}

// ============================================================
// Cart actions
// ============================================================
function addToCart(productId, qty, size, color) {
  qty = qty || 1;
  const existing = window.CARTER_STATE.cart.find(i => i.id === productId && i.size === (size || null) && i.color === (color || null));
  if (existing) existing.qty += qty;
  else window.CARTER_STATE.cart.push({ id: productId, qty, size: size || null, color: color || null });
  saveCart();
  updateCartCount();
  showToast('Added to cart');
  // Pinterest Tag — AddToCart event
  try {
    if (typeof pintrk === 'function') {
      const p = (window.CARTER_CATALOG || {})[productId] || {};
      pintrk('track', 'addtocart', {
        value: Number(p.price || 0) * qty,
        order_quantity: qty,
        currency: 'USD',
        line_items: [{
          product_name: p.name || productId,
          product_id: productId,
          product_price: Number(p.price || 0),
          product_quantity: qty,
          product_category: p.cat || 'fragrance'
        }]
      });
    }
  } catch (e) { /* never break checkout for analytics */ }
}
function removeFromCart(idx) {
  window.CARTER_STATE.cart.splice(idx, 1);
  saveCart();
  updateCartCount();
  if (typeof renderCartPage === 'function') renderCartPage();
}
function updateCartQty(idx, delta) {
  const item = window.CARTER_STATE.cart[idx];
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  updateCartCount();
  if (typeof renderCartPage === 'function') renderCartPage();
}
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQty = updateCartQty;

// ============================================================
// Toast
// ============================================================
let toastTimer;
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('span').textContent = msg;
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
}
window.showToast = showToast;

// ============================================================
// Render product card
// ============================================================
function fmtPrice(v) {
  // Show cents only when needed (e.g. $27.99); whole dollars stay as $195.
  return Number.isInteger(v) ? `$${v}` : `$${v.toFixed(2)}`;
}
window.fmtPrice = fmtPrice;

function productCardHTML(p, opts) {
  opts = opts || {};
  const lazy = opts.lazy === false ? '' : 'loading="lazy"';
  const link = p.detail ? (pagePath(p.detail)) : (pagePath('product.html') + '?id=' + p.id);
  const fitClass = p.imageFit === 'contain' ? ' is-contain'
                 : p.imageFit === 'cover-cropped' ? ' is-cropped'
                 : '';
  // Stacked badges: BESTSELLER/SIGNATURE/ICONIC on top, 30% OFF below it when on sale.
  let badge = '';
  if (p.badge) badge += `<span class="product-badge">${p.badge}</span>`;
  if (p.oldPrice) {
    const pct = Math.round((1 - p.price / p.oldPrice) * 100);
    badge += `<span class="product-badge product-badge-sale">${pct}% Off</span>`;
  }
  const priceBlock = p.oldPrice
    ? `<span class="product-card-price has-sale"><span class="old">${fmtPrice(p.oldPrice)}</span><span class="now">${fmtPrice(p.price)}</span></span>`
    : `<span class="product-card-price">${fmtPrice(p.price)}</span>`;
  const subtitle = p.subtitle ? `<span class="product-card-sub">${p.subtitle}</span>` : '';
  return `
    <article class="product-card reveal" data-product="${p.id}">
      <a href="${link}" class="product-card-media${fitClass}">
        ${badge}
        <img src="${imgPath(p.image)}" alt="${p.name} — ${p.notes}" ${lazy} />
      </a>
      <div class="product-card-body">
        <a href="${link}" class="product-card-name">${p.name}${subtitle}</a>
        <div class="product-card-notes">${p.notes}</div>
        <div class="product-card-foot">
          ${priceBlock}
          <button class="add-to-cart-btn" data-add="${p.id}">Add</button>
        </div>
      </div>
    </article>
  `;
}
window.productCardHTML = productCardHTML;

function bindAddButtons(root) {
  root = root || document;
  root.querySelectorAll('[data-add]').forEach(btn => {
    if (btn._bound) return;
    btn._bound = true;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-add');
      addToCart(id, 1);
      btn.classList.add('is-added');
      const orig = btn.textContent;
      btn.textContent = 'Added';
      setTimeout(() => { btn.classList.remove('is-added'); btn.textContent = orig; }, 1400);
    });
  });
}
window.bindAddButtons = bindAddButtons;

// ============================================================
// Filter chips (visual-only)
// ============================================================
function bindFilterChips() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('is-active'));
  });
}

// ============================================================
// Reveal on scroll
// ============================================================
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ============================================================
// Newsletter (Netlify Forms)
// ============================================================
function bindNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value) return;

      // Build URL-encoded payload from all named fields so Netlify records the submission.
      const data = new FormData(form);
      const body = new URLSearchParams(data).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      }).then(() => {
        showToast('Welcome to Carter\u2019s Collections');
        form.reset();
      }).catch(() => {
        // Even if the network hiccups, give the visitor positive feedback.
        showToast('Welcome to Carter\u2019s Collections');
        form.reset();
      });
    });
  });
}

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  bindAddButtons();
  bindFilterChips();
  initReveal();
  bindNewsletter();
});
