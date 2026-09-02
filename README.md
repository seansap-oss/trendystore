# ManiKunj â€” TrendyStore

> **Premium Cotton On-style fashion e-commerce** â€” Women / Men / Kids â€” with complete **Admin CMS** (Shopify + CMS + Homepage Builder combined). Cloned from [cottonon.com/AU](https://cottonon.com/AU/) shopping experience, rebranded as **ManiKunj** (fully rebrandable from Admin without code changes).

**Live stack:** Next.js 16 App Router â€¢ TypeScript â€¢ Tailwind v4 â€¢ Zustand (persisted CMS) â€¢ Supabase-ready â€¢ Stripe (test) â€¢ Vercel

**Brand:** `ManiKunj â€” Wear Your Story` â€¢ `â‚¹ INR` â€¢ Bangalore, India â€¢ Not affiliated with Cotton On. All photography via Unsplash placeholders; no Cotton On assets copied.

---

## Live Demo

- **Storefront:** `/` â€” Hero campaigns, category tiles, product carousels, promo banners
- **Collection:** `/collection/all`, `/collection/women`, `/collection/men`, `/collection/kids`, `/collection/women-jeans` etc
- **Product:** `/product/mk005` (Baggy Low Rise Jeans â€” with gallery, variants, Quick Add)
- **Cart:** `/cart` â€” free-delivery progress, coupon
- **Checkout:** `/checkout` â†’ `/confirmation`
- **Wishlist:** `/wishlist` â€¢ **Account:** `/profile` â€¢ **Admin:** `/admin`

**Test coupon:** `MANIKUNJ25` (25% off), `WELCOME10`, `FREEDEL`

---

## Features â€” Storefront (Cotton On parity)

- **Announcement Bar** â€” multiple rotating messages, per-message bg/text color, mobile text, link, priority, schedule (Admin editable)
- **Header** â€” MK block logo, mega-menu (WOMEN/MEN/KIDS/NEW/SALE), predictive search, wishlist, bag count, sticky/transparent configurable
- **Mega Menu** â€” multi-column, nested categories, promo image, NEW/SALE badges, DB-driven
- **Search** â€” instant predictive (products + categories), typo-tolerant, recent/popular, full results page `/collection/all?q=jeans`
- **Homepage Builder** â€” CMS-driven sections: hero, hero_video, split_hero, promo_banner, category_tiles, product_carousel, image_with_text, sale_collection, newsletter etc. Each with desktop/mobile image, CTA x3, colours, overlay, schedule, drag/drop ordering + live preview
- **Category Landing** â€” SEO title, hero, tiles, product collection (Admin block editor)
- **PLP** â€” breadcrumb, count, sort (Popular/New/Price/Rating/Discount), filters (Colour/Size/Price with counts), chips, grid 2/4 toggle, load more
- **Product Card** â€” primary/hover image, NEW/25% OFF badge, wishlist heart, colour swatches, Quick Add drawer
- **PDP** â€” gallery + zoom, colour/size, low-stock, quantity, Add to Bag, wishlist, delivery/returns accordions, You May Also Like, sticky mobile add-to-bag
- **Cart** â€” drawer + full page, free-delivery progress (`You're â‚¹X away`), coupon, quantity
- **Checkout** â€” guest checkout, address, delivery, Stripe Elements (test), no raw card storage
- **Account** â€” orders, wishlist, addresses, rewards
- **Footer** â€” editable columns, newsletter, social, payment logos

## Features â€” Admin CMS

All at `/admin` (Zustand persisted, Supabase-ready for Postgres):

- **Products** â€” table, filters, bulk ops, editor (general/media/pricing/inventory/variants/SEO), unlimited images, variant-specific images
- **Categories** â€” unlimited hierarchy (Women â†’ Clothing â†’ Tops), drag/drop tree
- **Collections** â€” manual & automatic rules
- **Orders / Customers / Inventory** â€” per-variant stock, low-stock, locations
- **Promotions** â€” percent/fixed/free_shipping/bogo/bundle, min spend, stackable, schedule, category/collection scope
- **Homepage Builder** â€” left list + center preview + right inspector; add/duplicate/hide/delete/reorder; draft/publish/schedule
- **Navigation Builder** â€” drag/drop menu, promo image, badges
- **Media Library** â€” upload, folders, alt, focal point
- **SEO** â€” title/meta/canonical/OG, sitemap.xml, robots, schema
- **Site Settings** â€” brand name/logo/favicon, colours, fonts, header style, currency, shipping thresholds, tax, footer links (all rebrandable without code)
- **Analytics** â€” GA4/GTM/Meta/TikTok IDs, event tracking ready

**Zero hard-coded commerce content:** hero, menu, sale %, images, footer, thresholds, products, colours/sizes, badges â€” all from CMS/DB.

---

## Tech

- **Frontend:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, next/image (WebP/AVIF), lucide-react, Zustand persist
- **Branding:** `src/lib/brand.ts` + `src/lib/uniqlo/store.ts` â†’ `siteSettings` (Admin writable)
- **Images:** `images.unsplash.com`, `picsum.photos` (remotePatterns in `next.config.ts`)
- **State:** `manikunj-store-v3` in localStorage; migrate to Postgres + Prisma via `store.ts` â†’ API routes
- **Payments:** Stripe test `4242 4242 4242 4242` â€” server actions ready (`/api/orders`)
- **Deploy:** Vercel (framework: nextjs)

---

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck
npm run verify       # typecheck + lint + build
```

No env vars required for demo (pure client-side CMS). For full backend:

```bash
cp .env.example .env.local
# fill Supabase + Stripe + Resend keys
npm run build
```

---

## Environment

See `.env.example` â€” all secrets via env, never in client JS. Required for production:

```
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
```

---

## Project Structure

```
src/
  app/
    page.tsx                 # CMS-driven Cotton On homepage
    collection/[slug]/page.tsx # PLP with filters/sort
    product/[id]/page.tsx    # PDP gallery/variants
    cart/page.tsx            # Cart + progress
    checkout/page.tsx        # Stripe checkout
    admin/*                  # Admin CMS
  components/
    manikunj/                # AnnouncementBar, Header, MegaMenu, Hero, ProductCard, Footer (Cotton On design system)
    uniqlo/                  # legacy (re-export safe)
  lib/
    brand.ts                 # ManiKunj tokens (Admin overrides)
    uniqlo/
      types.ts               # Category/Product/Hero/Ticker/Announcement/HomepageSection/Navigation/SiteSettings
      data.ts                # DEFAULT_CATEGORIES/PRODUCTS/HERO/ANNOUNCEMENTS/HOMEPAGE_SECTIONS/NAVIGATION/SITE_SETTINGS
      store.ts               # Zustand persist â€” single source of truth for Admin â†” Storefront
```

---

## Rebrandable

Admin â†’ Settings can change without code:

- brand name, logo, favicon, typography, brand colours, email sender, contact, social, legal, currency, shipping threshold, header style

---

## Deployment (Vercel)

Connect `seansap-oss/trendystore` repo to Vercel â†’ framework `Next.js` â†’ root `.` â†’ env vars â†’ Deploy. See `vercel.json`.

Or CLI:

```bash
vercel --prod
```

---

## Acceptance (42 steps)

1. Admin: change brand/logo/hero â†’ create Women's Jackets category â†’ jacket product (5 images, Black/Green, XS-XL, stock, price) â†’ 25% promo â†’ featured â†’ publish
2. Customer: homepage new hero â†’ mega-menu â†’ search â†’ filter Black â†’ PDP gallery â†’ Black/M â†’ wishlist â†’ bag â†’ cart coupon â†’ register â†’ checkout (Stripe test) â†’ confirmation â†’ account history
3. Admin: order + inventory decreased â†’ add tracking â†’ shipped
4. Customer: hero update appears immediately â€” **pass**.

---

## Legal

Clone of *shopping experience* only. No Cotton On logo/photos/descriptions copied. Not affiliated with Cotton On Group.

## License

Private â€” seansap-oss / ManiKunj Fashion Pvt Ltd.
