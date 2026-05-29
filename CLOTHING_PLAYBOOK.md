# Clothing Collection — Operating Playbook

A short reference for adding womenswear pieces from wholesale/dropship suppliers
to Carter's Collection, written to mirror the fragrance fulfillment pattern
already in use.

---

## Recommended Suppliers (ranked for our setup)

| Rank | Supplier      | Model     | Ship  | MOQ        | Why it fits                                      |
| ---- | ------------- | --------- | ----- | ---------- | ------------------------------------------------ |
| 1    | Trendsi       | Dropship  | 2–5d  | 0          | US warehouse, free product photos, clean catalog |
| 2    | Dear-Lover    | Dropship  | 3–7d  | Low        | Daily new arrivals, 4.9 Trustpilot, since 2007   |
| 3    | DropCommerce  | Dropship  | 2–5d  | 0          | US/Canadian only — premium boutique tone         |
| 4    | Faire         | Wholesale | 5–10d | Brand min. | Net-60 terms, free first-order returns           |
| 5    | Spocket       | Dropship  | 5–8d  | 0          | Pre-vetted US/EU suppliers                       |

**Start with Trendsi.** Add Faire after 60 days of sales data so you know which
pieces deserve real inventory commitment.

---

## Pricing Rule (mirrors fragrance)

- Retail ends in **.99**
- Target gross margin **50–65%** → retail at minimum `wholesale * 2.2`
- Strikethrough `oldPrice` = MSRP if supplier provides one, otherwise `retail * 2.6`
- Existing dresses (c1–c4) all sit at $22.99 retail

Examples:

| Wholesale | Retail (2.2x rule) | oldPrice | Margin |
| --------- | ------------------ | -------- | ------ |
| $9.50     | $22.99             | $58      | 58.7%  |
| $14.50    | $38.99             | $95      | 62.8%  |
| $22.00    | $54.99             | $135     | 60.0%  |

---

## Adding a Piece (5-step workflow)

1. **Pick the item** on Trendsi (or your supplier of choice). Save the
   wholesale price and at least one hero image URL.
2. **Open `build_clothing.py`** and append a dict to `ITEMS`. Use the next
   available `c<n>` id. Set section to one of `Dresses` / `Tops` / `Bottoms`
   / `Outerwear`.
3. **Run the script** — it downloads the image, upserts the catalog entry,
   writes the product page, and adds the URL to `sitemap.xml`.
   ```
   python3 build_clothing.py
   ```
4. **Bust cache + redeploy:**
   ```
   bash carters-collection/bust_cache.sh
   ```
   Then redeploy via the existing pattern.
5. **Sanity check** the live page — check the Womenswear index, the product
   detail page, and that the cart "Add" button works.

---

## Fulfillment (matches fragrance pattern)

- Order placed on Carter's Collection → email to `sales@carterscollections.com`
- Manually place the matching order on Trendsi/Faire/etc. with **ship-to: customer**
- Supplier ships in plain packaging
- For premium pieces, optionally repackage in a Carter's branded box first
- Free shipping always (already baked into the retail price)

## Returns

- 30-day window
- Unworn, tags attached (already in footer + product page copy)
- Contact: `support@carterscollections.com`
- Most suppliers (Trendsi, Faire) reimburse on supplier-side defects;
  customer-preference returns come out of margin

---

## Tax (Stripe)

- Clothing tax code: **`txcd_99999999`** (general physical good)
- Fragrance tax code: **`txcd_32050025`**
- Already wired into your Stripe configuration — no change needed when adding
  clothing SKUs.

---

## Sections — How They Render

The `clothing.html` index auto-groups by `section` and only shows sections that
contain items. Filter chips at the top let visitors narrow by Dresses / Tops /
Bottoms / Outerwear. As you add pieces, the page scales gracefully — no manual
HTML edits required.

If a section has fewer than 3 items, that's fine — it still looks intentional
because of the section header + count display.
