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
  c5: { id: 'c5', name: 'Faux Leather Strapless Mini', cat: 'clothing', section: 'Dresses', notes: 'Matte faux leather · Strapless · Black', price: 18.99, oldPrice: 44, image: 'assets/real-products/dress5_1.jpg', imageFit: 'cover-cropped', badge: 'New', detail: 'product-faux-leather-strapless.html', real: true },
  c6: { id: 'c6', name: 'Satin Lace Slip Mini', cat: 'clothing', section: 'Dresses', notes: 'Satin · Lace trim · Asymmetric hem · 6 colors', price: 18.99, oldPrice: 48, image: 'assets/real-products/dress6_1.jpg', imageFit: 'cover-cropped', badge: 'New', detail: 'product-satin-lace-slip.html', real: true },
  c7: { id: 'c7', name: 'Polka Dot Halter Mini', cat: 'clothing', section: 'Dresses', notes: 'Satin polka dot · Halter neck · Open back', price: 18.99, oldPrice: 46, image: 'assets/real-products/dress7_1.jpg', imageFit: 'cover-cropped', badge: 'New', detail: 'product-polka-dot-halter.html', real: true },
  c8: { id: 'c8', name: 'Velvet Cross Lace Mini', cat: 'clothing', section: 'Dresses', notes: 'Velvet · Lace trim · Cross charm · Side slit', price: 18.99, oldPrice: 52, image: 'assets/real-products/dress8_6.jpg', imageFit: 'cover-cropped', badge: 'New', detail: 'product-velvet-cross.html', real: true },
  c9: { id: 'c9', name: 'Lace-Up Backless Maxi', cat: 'clothing', section: 'Dresses', notes: 'Lace-up back · High side slit · Red & Black', price: 18.99, oldPrice: 54, image: 'assets/real-products/dress9_1.jpg', imageFit: 'cover-cropped', badge: 'New', detail: 'product-laceup-backless.html', real: true },
  c10: { id: 'c10', name: 'Faux Leather Backless Mini', cat: 'clothing', section: 'Dresses', notes: 'Faux leather · Open back · Bodycon', price: 18.99, oldPrice: 42, image: 'assets/real-products/dress10_1.jpg', imageFit: 'cover-cropped', badge: 'New', detail: 'product-faux-leather-backless.html', real: true },
  c11: { id: 'c11', name: 'Halter Keyhole Cutout Maxi', cat: 'clothing', section: 'Dresses', notes: 'Halter cutout · Ruched · Lace-up slit · 4 colors', price: 18.99, oldPrice: 58, image: 'assets/real-products/dress11_1.jpg', imageFit: 'cover-cropped', badge: 'New', detail: 'product-cowl-neck-cutout.html', real: true },
  c12: { id: 'c12', name: 'Floral Ruffle Slip Maxi', cat: 'clothing', section: 'Dresses', notes: 'Floral satin · V-neck · Ruffle straps · 2 colors', price: 19.99, oldPrice: 58, image: 'assets/real-products/dress12_1.jpg', imageFit: 'cover-cropped', badge: 'New', detail: 'product-floral-slip-maxi.html', real: true },
  c13: { id: 'c13', name: 'Strappy Scoop Bodycon Mini', cat: 'clothing', section: 'Dresses', notes: 'Spaghetti straps · Scoop neck · Stretch · 8 colors', price: 22.99, oldPrice: 48, image: 'assets/real-products/dress13_1.jpg', imageFit: 'cover-cropped', badge: 'New', detail: 'product-cami-bodycon-mini.html', real: true },
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
  // ============================================================
  // Bags & Leather Goods — sourced authentic, priced below retail
  // ============================================================
  b1: { id: 'b1', name: 'Jet Set Large Crossbody', subtitle: 'by Michael Kors', cat: 'bag', section: 'Women\u2019s Handbags', notes: 'Saffiano Leather · Black · Gold Hardware', price: 124.99, oldPrice: 168, image: 'assets/real-products/b1_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-mk-jet-set-crossbody.html', real: true },
  b2: { id: 'b2', name: 'Jet Set Medium Travel Tote', subtitle: 'by Michael Kors', cat: 'bag', section: 'Women\u2019s Handbags', notes: 'Saffiano Leather · Black · Top-Zip Tote', price: 174.99, oldPrice: 298, image: 'assets/real-products/b2_1.jpg', imageFit: 'contain', badge: 'Bestseller', detail: 'product-mk-jet-set-travel-tote.html', real: true },
  b3: { id: 'b3', name: 'Saffiano Shoulder Bag', subtitle: 'by Michael Kors', cat: 'bag', section: 'Women\u2019s Handbags', notes: 'Saffiano Leather · Camel · MK Charm', price: 307.99, oldPrice: 428, image: 'assets/real-products/b3_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-mk-saffiano-shoulder.html', real: true },
  b4: { id: 'b4', name: 'The Snapshot Camera Bag', subtitle: 'by Marc Jacobs', cat: 'bag', section: 'Women\u2019s Handbags', notes: 'Saffiano Leather · Colorblock · Crossbody', price: 376.99, oldPrice: 450, image: 'assets/real-products/b4_1.jpg', imageFit: 'contain', badge: 'Iconic', detail: 'product-mj-snapshot.html', real: true },
  b5: { id: 'b5', name: 'The Small Terry Tote', subtitle: 'by Marc Jacobs', cat: 'bag', section: 'Women\u2019s Handbags', notes: 'Terry Towelling · Black · Logo Front', price: 320.99, oldPrice: 350, image: 'assets/real-products/b5_1.jpg', imageFit: 'contain', badge: 'TikTok Viral', detail: 'product-mj-terry-tote.html', real: true },
  b6: { id: 'b6', name: 'Micro Shield Check Sling', subtitle: 'by Burberry', cat: 'bag', section: 'Women\u2019s Handbags', notes: 'Check Canvas · Green · Chain Strap', price: 458.99, oldPrice: 1150, image: 'assets/real-products/b6_1.jpg', imageFit: 'contain', badge: '60% Below Retail', detail: 'product-burberry-shield-sling.html', real: true },
  b7: { id: 'b7', name: 'Vintage Check Snug Tote', subtitle: 'by Burberry', cat: 'bag', section: 'Women\u2019s Handbags', notes: 'Vintage Check · Bridle Brown · Bucket Tote', price: 696.99, oldPrice: 1250, image: 'assets/real-products/b7_1.jpg', imageFit: 'contain', badge: 'Iconic', detail: 'product-burberry-snug-tote.html', real: true },
  b8: { id: 'b8', name: 'Medium Shield Messenger', subtitle: 'by Burberry', cat: 'bag', section: 'Men\u2019s Bags', notes: 'Quilted Leather · Black · Crossbody', price: 1102.99, oldPrice: 3090, image: 'assets/real-products/b8_1.jpg', imageFit: 'contain', badge: '64% Below Retail', detail: 'product-burberry-shield-messenger.html', real: true },
  b9: { id: 'b9', name: 'Extreme 3.0 Messenger M LOCK', subtitle: 'by Montblanc', cat: 'bag', section: 'Men\u2019s Bags', notes: 'Coated Leather · Black · M LOCK 4810 Buckle', price: 1105.99, oldPrice: 1590, image: 'assets/real-products/b9_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-montblanc-extreme-messenger.html', real: true },
  b10: { id: 'b10', name: '6cc Grain Leather Wallet', subtitle: 'by Montblanc', cat: 'bag', section: 'Wallets & Small Leather Goods', notes: 'Grain Leather · Black · 6 Card Slots', price: 388.99, oldPrice: 550, image: 'assets/real-products/b10_1.jpg', imageFit: 'contain', badge: 'Gift Pick', detail: 'product-montblanc-6cc-wallet.html', real: true },
  b11: { id: 'b11', name: 'Mini Vertical Wallet 6cc', subtitle: 'by Montblanc', cat: 'bag', section: 'Wallets & Small Leather Goods', notes: 'Corteccia Sfumato Leather · Cognac · Zip', price: 435.99, oldPrice: 690, image: 'assets/real-products/b11_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-montblanc-mini-wallet.html', real: true },
  b12: { id: 'b12', name: 'Bum Bag Mini', subtitle: 'by Rains', cat: 'bag', section: 'Women’s Handbags', notes: 'Water-Resistant · Black · Belt Bag', price: 65.99, oldPrice: 75, image: 'assets/real-products/b12_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-rains-bum-bag-mini.html', real: true },
  b13: { id: 'b13', name: 'Braided Straw Shoulder Bag', subtitle: 'by Bonpoint', cat: 'bag', section: 'Women’s Handbags', notes: 'Woven Straw · Natural · Summer Shoulder Bag', price: 65.99, oldPrice: 85, image: 'assets/real-products/b13_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-bonpoint-braided-straw-shoulder-bag.html', real: true },
  b14: { onSale: true, saleAddedAt: '2026-05-30', id: 'b14', name: 'Tanala Woven Clutch', subtitle: 'by Ibeliv', cat: 'bag', section: 'Women’s Handbags', notes: 'Hand-Woven Raffia · Orange · Clutch', price: 114.99, oldPrice: 180, image: 'assets/real-products/b14_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-ibeliv-tanala-woven-clutch.html', real: true },
  b15: { id: 'b15', name: 'Jet Set Travel Wristlet', subtitle: 'by Michael Kors', cat: 'bag', section: 'Women’s Handbags', notes: 'Saffiano Leather · Black · Smartphone Wristlet', price: 121.99, oldPrice: 158, image: 'assets/real-products/b15_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-michael-kors-jet-set-travel-wristlet.html', real: true },
  b16: { id: 'b16', name: 'Metallic Star Shoulder Bag', subtitle: 'by Stella McCartney', cat: 'bag', section: 'Women’s Handbags', notes: 'Faux Leather · Silver · Star Shoulder Bag', price: 143.99, oldPrice: 155, image: 'assets/real-products/b16_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-stella-mccartney-metallic-star-shoulder-bag.html', real: true },
  b17: { id: 'b17', name: 'Star Laminated Bucket Bag', subtitle: 'by Stella McCartney', cat: 'bag', section: 'Women’s Handbags', notes: 'Laminated Canvas · Bucket Bag', price: 144.99, oldPrice: 179, image: 'assets/real-products/b17_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-stella-mccartney-star-laminated-bucket-bag.html', real: true },
  b18: { onSale: true, saleAddedAt: '2026-05-30', id: 'b18', name: 'Equestrian Knight Trench Backpack', subtitle: 'by Burberry', cat: 'bag', section: 'Women’s Handbags', notes: 'Cotton Gabardine · Beige · Embroidered Backpack', price: 722.99, oldPrice: 2190, image: 'assets/real-products/b18_1.jpg', imageFit: 'contain', badge: '67% Below Retail', detail: 'product-burberry-equestrian-knight-trench-backpack.html', real: true },
  b19: { id: 'b19', name: 'Sartorial Mini Crossbody', subtitle: 'by Montblanc', cat: 'bag', section: 'Women’s Handbags', notes: 'Saffiano Leather · Black · Compact Crossbody', price: 891.99, oldPrice: 1150, image: 'assets/real-products/b19_1.jpg', imageFit: 'contain', badge: '', detail: 'product-montblanc-sartorial-mini-crossbody.html', real: true },
  b20: { id: 'b20', name: 'Frayme Bucket Bag', subtitle: 'by Stella McCartney', cat: 'bag', section: 'Women’s Handbags', notes: 'Alter Mat · Chain Detail · Bucket Bag', price: 1007.99, oldPrice: 1150, image: 'assets/real-products/b20_1.jpg', imageFit: 'contain', badge: '', detail: 'product-stella-mccartney-frayme-bucket-bag.html', real: true },
  b21: { onSale: true, saleAddedAt: '2026-05-30', id: 'b21', name: 'Snip Leather Shoulder Bag', subtitle: 'by Burberry', cat: 'bag', section: 'Women’s Handbags', notes: 'Grained Leather · Adjustable Strap', price: 1012.99, oldPrice: 2457, image: 'assets/real-products/b21_1.jpg', imageFit: 'contain', badge: '59% Below Retail', detail: 'product-burberry-snip-leather-shoulder-bag.html', real: true },
  b22: { onSale: true, saleAddedAt: '2026-05-30', id: 'b22', name: 'Medium Knight Shoulder Bag', subtitle: 'by Burberry', cat: 'bag', section: 'Women’s Handbags', notes: 'Leather · Equestrian Knight Hardware', price: 1142.99, oldPrice: 3090, image: 'assets/real-products/b22_1.jpg', imageFit: 'contain', badge: '63% Below Retail', detail: 'product-burberry-medium-knight-shoulder-bag.html', real: true },
  b23: { onSale: true, saleAddedAt: '2026-05-30', id: 'b23', name: 'Check Compact Messenger', subtitle: 'by Burberry', cat: 'bag', section: 'Men’s Bags', notes: 'Check Canvas · Birch Brown · Messenger', price: 722.99, oldPrice: 1250, image: 'assets/real-products/b23_1.jpg', imageFit: 'contain', badge: '', detail: 'product-burberry-check-compact-messenger.html', real: true },
  b24: { onSale: true, saleAddedAt: '2026-05-30', id: 'b24', name: 'Denny Slim Shopper', subtitle: 'by Burberry', cat: 'bag', section: 'Men’s Bags', notes: 'Coated Canvas · Charcoal · Slim Shopper', price: 867.99, oldPrice: 1790, image: 'assets/real-products/b24_1.jpg', imageFit: 'contain', badge: '52% Below Retail', detail: 'product-burberry-denny-slim-shopper.html', real: true },
  b25: { onSale: true, saleAddedAt: '2026-05-30', id: 'b25', name: 'Origami Colorblock Coin Wallet', subtitle: 'by Coach', cat: 'bag', section: 'Wallets & Small Leather Goods', notes: 'Leather · Colorblock · Zip Coin Wallet', price: 144.99, oldPrice: 250, image: 'assets/real-products/b25_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-coach-origami-colorblock-coin-wallet.html', real: true },
  b26: { id: 'b26', name: 'Origami Coin Wallet', subtitle: 'by Coach', cat: 'bag', section: 'Wallets & Small Leather Goods', notes: 'Leather · Colorblock · Coin Wallet', price: 144.99, oldPrice: 165, image: 'assets/real-products/b26_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-coach-origami-coin-wallet.html', real: true },
  b27: { id: 'b27', name: 'Sartorial 2cc MagSafe Card Holder', subtitle: 'by Montblanc', cat: 'bag', section: 'Wallets & Small Leather Goods', notes: 'Saffiano Leather · MagSafe · iPhone Card Holder', price: 184.99, oldPrice: 285, image: 'assets/real-products/b27_1.jpg', imageFit: 'contain', badge: '', detail: 'product-montblanc-sartorial-2cc-magsafe-card-holder.html', real: true },
  b28: { onSale: true, saleAddedAt: '2026-05-30', id: 'b28', name: 'Shield Coin Pouch', subtitle: 'by Burberry', cat: 'bag', section: 'Wallets & Small Leather Goods', notes: 'Leather · Equestrian Knight · Coin Pouch', price: 272.99, oldPrice: 480, image: 'assets/real-products/b28_1.jpg', imageFit: 'contain', badge: '', detail: 'product-burberry-shield-coin-pouch.html', real: true },
  b29: { id: 'b29', name: 'Small Check Folding Wallet', subtitle: 'by Burberry', cat: 'bag', section: 'Wallets & Small Leather Goods', notes: 'Check Canvas · Bifold Wallet', price: 359.99, oldPrice: 550, image: 'assets/real-products/b29_1.jpg', imageFit: 'contain', badge: '', detail: 'product-burberry-small-check-folding-wallet.html', real: true },
  b30: { onSale: true, saleAddedAt: '2026-05-30', id: 'b30', name: 'Heritage Large Zip Wallet', subtitle: 'by Burberry', cat: 'bag', section: 'Wallets & Small Leather Goods', notes: 'Leather · Zip-Around Wallet', price: 359.99, oldPrice: 760, image: 'assets/real-products/b30_1.jpg', imageFit: 'contain', badge: '53% Below Retail', detail: 'product-burberry-heritage-large-zip-wallet.html', real: true },
  b31: { onSale: true, saleAddedAt: '2026-05-30', id: 'b31', name: 'Check Leather Long Wallet', subtitle: 'by Burberry', cat: 'bag', section: 'Wallets & Small Leather Goods', notes: 'Check Canvas + Leather · Long Wallet', price: 432.99, oldPrice: 720, image: 'assets/real-products/b31_1.jpg', imageFit: 'contain', badge: '', detail: 'product-burberry-check-leather-long-wallet.html', real: true },
  b32: { id: 'b32', name: 'Extreme Toiletry Clutch', subtitle: 'by Montblanc', cat: 'bag', section: 'Wallets & Small Leather Goods', notes: 'Extreme 3.0 Leather · Black · Travel Clutch', price: 738.99, oldPrice: 940, image: 'assets/real-products/b32_1.jpg', imageFit: 'contain', badge: '', detail: 'product-montblanc-extreme-toiletry-clutch.html', real: true },
  g1: { id: 'g1', name: 'Smoke Square FT1051-K 01A', subtitle: 'by Tom Ford', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 310.99, oldPrice: 470.00, image: 'assets/real-products/g1_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-tom-ford-smoke-square-ft1051-k-01a-53.html', real: true },
  g2: { id: 'g2', name: 'Grey Browline GG0748S 001', subtitle: 'by Gucci', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 248.99, oldPrice: 305.00, image: 'assets/real-products/g2_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-gucci-grey-browline-gg0748s-001-59.html', real: true },
  g3: { onSale: true, saleAddedAt: '2026-05-30', id: 'g3', name: 'Grey Square SF1111SCP 001', subtitle: 'by Ferragamo', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 124.99, oldPrice: 345.00, image: 'assets/real-products/g3_1.jpg', imageFit: 'contain', badge: '64% Below Retail', detail: 'product-ferragamo-grey-square-sf1111scp-001-55.html', real: true },
  g4: { onSale: true, saleAddedAt: '2026-05-30', id: 'g4', name: 'Blue Gradient Navigator SF999S 414', subtitle: 'by Ferragamo', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 132.99, oldPrice: 325.00, image: 'assets/real-products/g4_1.jpg', imageFit: 'contain', badge: '59% Below Retail', detail: 'product-ferragamo-blue-gradient-navigator-sf999s-414-60.html', real: true },
  g5: { id: 'g5', name: 'Smoke Square GG0001SN 001', subtitle: 'by Gucci', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 310.99, oldPrice: 385.00, image: 'assets/real-products/g5_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-gucci-smoke-square-gg0001sn-001-52.html', real: true },
  g6: { onSale: true, saleAddedAt: '2026-05-30', id: 'g6', name: 'Grey Bronze Mirror Square BOSS 1598/S', subtitle: 'by Hugo Boss', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 99.99, oldPrice: 240.00, image: 'assets/real-products/g6_1.jpg', imageFit: 'contain', badge: '58% Below Retail', detail: 'product-hugo-boss-grey-bronze-mirror-square-boss-1598-s-55.html', real: true },
  g7: { onSale: true, saleAddedAt: '2026-05-30', id: 'g7', name: 'Grey Gradient Navigator MARC 417/S', subtitle: 'by Marc Jacobs', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 101.99, oldPrice: 280.00, image: 'assets/real-products/g7_1.jpg', imageFit: 'contain', badge: '64% Below Retail', detail: 'product-marc-jacobs-grey-gradient-navigator-marc-417-s-58.html', real: true },
  g8: { onSale: true, saleAddedAt: '2026-05-30', id: 'g8', name: 'Grey Gradient Square SF955S 001', subtitle: 'by Ferragamo', cat: 'sunglasses', section: 'Women’s Eyewear', notes: 'Ladies — Designer Sunglasses — 100% UV', price: 124.99, oldPrice: 375.00, image: 'assets/real-products/g8_1.jpg', imageFit: 'contain', badge: '67% Below Retail', detail: 'product-ferragamo-grey-gradient-square-sf955s-001-53.html', real: true },
  g9: { id: 'g9', name: 'Grey Square BE4293 380687', subtitle: 'by Burberry', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 248.99, oldPrice: 284.00, image: 'assets/real-products/g9_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-burberry-grey-square-be4293-380687-56.html', real: true },
  g10: { onSale: true, saleAddedAt: '2026-05-30', id: 'g10', name: 'Polarized Green Grey Sport 8064/S', subtitle: 'by Carrera', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 77.99, oldPrice: 265.00, image: 'assets/real-products/g10_1.jpg', imageFit: 'contain', badge: '71% Below Retail', detail: 'product-carrera-polarized-green-grey-sport-8064-s-57.html', real: true },
  g11: { id: 'g11', name: 'Dark Grey Cat Eye PR A02S 16K08Z', subtitle: 'by Prada', cat: 'sunglasses', section: 'Women’s Eyewear', notes: 'Ladies — Designer Sunglasses — 100% UV', price: 509.99, oldPrice: 518.00, image: 'assets/real-products/g11_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-prada-dark-grey-cat-eye-pr-a02s-16k08z.html', real: true },
  g12: { id: 'g12', name: 'Green Square GG0001SN 002', subtitle: 'by Gucci', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 295.99, oldPrice: 385.00, image: 'assets/real-products/g12_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-gucci-green-square-gg0001sn-002-52.html', real: true },
  g13: { id: 'g13', name: 'Grey Cat Eye SL 276 MICA 001', subtitle: 'by Saint Laurent', cat: 'sunglasses', section: 'Women’s Eyewear', notes: 'Ladies — Designer Sunglasses — 100% UV', price: 362.99, oldPrice: 495.00, image: 'assets/real-products/g13_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-saint-laurent-grey-cat-eye-sl-276-mica-001-53.html', real: true },
  g14: { id: 'g14', name: 'Grey Square SF1065S 005', subtitle: 'by Ferragamo', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 124.99, oldPrice: 239.00, image: 'assets/real-products/g14_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-ferragamo-grey-square-sf1065s-005-59.html', real: true },
  g15: { id: 'g15', name: 'Polarized Grey Square GG1427S 002', subtitle: 'by Gucci', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 381.99, oldPrice: 490.00, image: 'assets/real-products/g15_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-gucci-polarized-grey-square-gg1427s-002-53.html', real: true },
  g16: { id: 'g16', name: 'New Wayfarer Classic Green RB2132 901', subtitle: 'by Ray-Ban', cat: 'sunglasses', section: 'Unisex Eyewear', notes: 'Unisex — Designer Sunglasses — 100% UV', price: 166.99, oldPrice: 178.00, image: 'assets/real-products/g16_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-ray-ban-new-wayfarer-classic-green-rb2132-901-58.html', real: true },
  g17: { onSale: true, saleAddedAt: '2026-05-30', id: 'g17', name: 'Amber Rectangular SF1110S 009', subtitle: 'by Ferragamo', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 115.99, oldPrice: 415.00, image: 'assets/real-products/g17_1.jpg', imageFit: 'contain', badge: '72% Below Retail', detail: 'product-ferragamo-amber-rectangular-sf1110s-009-56.html', real: true },
  g18: { id: 'g18', name: 'Grey Square MB0319S 001', subtitle: 'by Montblanc', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 333.99, oldPrice: 465.00, image: 'assets/real-products/g18_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-montblanc-grey-square-mb0319s-001-55.html', real: true },
  g19: { id: 'g19', name: 'Polarized Grey Square HC8426U', subtitle: 'by Coach', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 170.99, oldPrice: 223.00, image: 'assets/real-products/g19_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-coach-polarized-grey-square-hc8426u-54.html', real: true },
  g20: { onSale: true, saleAddedAt: '2026-05-30', id: 'g20', name: 'Grey Gradient Pilot MARC 588/S', subtitle: 'by Marc Jacobs', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 93.99, oldPrice: 280.00, image: 'assets/real-products/g20_1.jpg', imageFit: 'contain', badge: '66% Below Retail', detail: 'product-marc-jacobs-grey-gradient-pilot-marc-588-s-53.html', real: true },
  g21: { onSale: true, saleAddedAt: '2026-05-30', id: 'g21', name: 'Dark Grey Butterfly SF1106S 001', subtitle: 'by Ferragamo', cat: 'sunglasses', section: 'Women’s Eyewear', notes: 'Ladies — Designer Sunglasses — 100% UV', price: 124.99, oldPrice: 415.00, image: 'assets/real-products/g21_1.jpg', imageFit: 'contain', badge: '70% Below Retail', detail: 'product-ferragamo-dark-grey-butterfly-sf1106s-001-57.html', real: true },
  g22: { onSale: true, saleAddedAt: '2026-05-30', id: 'g22', name: 'Green Square BOSS 1538/F/SK', subtitle: 'by Hugo Boss', cat: 'sunglasses', section: 'Men’s Eyewear', notes: 'Men — Designer Sunglasses — 100% UV', price: 101.99, oldPrice: 275.00, image: 'assets/real-products/g22_1.jpg', imageFit: 'contain', badge: '63% Below Retail', detail: 'product-hugo-boss-green-square-boss-1538-f-sk-57.html', real: true },
  g23: { id: 'g23', name: 'Grey Square GG1402S 001', subtitle: 'by Gucci', cat: 'sunglasses', section: 'Women’s Eyewear', notes: 'Ladies — Designer Sunglasses — 100% UV', price: 295.99, oldPrice: 385.00, image: 'assets/real-products/g23_1.jpg', imageFit: 'contain', badge: 'New Arrival', detail: 'product-gucci-grey-square-gg1402s-001-55.html', real: true },
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
