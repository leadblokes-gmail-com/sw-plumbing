# S & W Plumbing — production website

Certified plumbing, Birkdale / bayside Brisbane. Fast, call-first marketing site built with **Astro** (static, near-zero JS) + **GSAP/ScrollTrigger/Lenis** for motion. Ported faithfully from the approved Claude Design concept and productionised (real form, SEO/schema, self-hosted fonts, deploy config).

- **Phone (primary CTA):** 0432 292 371
- **Email:** swplumbing@gmail.com
- **Pages:** `/` · `/services` · `/about` · `/service-areas` · `/contact`

---

## 1. Run it locally

```bash
npm install
npm run dev      # http://localhost:4321
```

Other scripts:

```bash
npm run build    # production build → ./dist
npm run preview  # serve the built ./dist locally
```

Requires Node 18+ (built and tested on Node 24).

---

## 2. ⚙️ Where to put your real details

Everything you'll want to change lives in **two places**: `src/data/site.ts` (content) and `.env` (form endpoint). No need to touch component code.

### a) Licence # and ABN  → `src/data/site.ts`
```ts
licence: null,   // ← replace null with 'QBCC 123456' (or your licence)
abn: null,       // ← replace null with '12 345 678 901'
```
While these are `null`, the site stays **honest** — it shows "Licensed & qualified" with **no visible `[brackets]`**. The moment you add real values they appear automatically in the footer, the About credentials, and the FAQ answer. Nothing else to edit.

### b) Reviews / Google rating  → `src/data/site.ts`
The business is new, so the reviews block is **hidden by design** (we never ship fake reviews). Add real ones and the block switches on automatically on the Home page and beside the contact form:
```ts
export const reviews = [
  { name: 'Jane D.', suburb: 'Cleveland', rating: 5, text: 'Turned up on time and sorted our hot water same day.' },
];
export const googleRating = { rating: 4.9, count: 27 }; // once your Google Business Profile is live
```

### c) Job / before-after photos  → `public/images/` + `src/data/site.ts`
Drop photos in `public/images/`, then:
```ts
export const jobs = [
  { title: 'Hot water swap — Cleveland', after: '/images/job-1.jpg', alt: 'New hot water unit installed' },
  // before/after pair:
  { title: 'Bathroom reno — Birkdale', before: '/images/job-2a.jpg', after: '/images/job-2b.jpg', alt: 'Bathroom rough-in to fit-off' },
];
```
The gallery is hidden until at least one job is added (no stock filler).

### d) Founder / van photo
Already wired: `public/images/about-founder.png` (with an optimised `about-founder.webp` served first). Replace both files to swap the photo — keep the same names, or regenerate the webp (see "Image optimisation" below).

### e) Contact form delivery  → `.env`
The form posts to **Formspree** (one config value, no backend):
1. Create a free form at <https://formspree.io>, set its email to **swplumbing@gmail.com**.
2. Copy `.env.example` → `.env` and paste your endpoint:
   ```
   PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/abcdwxyz
   ```
3. Add the **same** variable in Vercel → Project → Settings → Environment Variables.

Until it's set, the form validates and politely tells visitors to call — it never breaks. Spam is blocked with a honeypot field.

> Prefer GoHighLevel/another CRM instead of Formspree? The endpoint just needs to accept a `POST` of form fields. Swap the URL in `.env`; for a non-Formspree endpoint that doesn't return JSON you may want to tweak the success check in `src/components/ContactForm.astro`.

---

## 3. Deploy to Vercel

This project is configured for your Vercel account (`leadblockes`). Astro static is auto-detected; `vercel.json` adds caching + security headers.

**Option A — Git (recommended):**
1. Push this folder to a GitHub repo.
2. Vercel → **Add New… → Project** → import the repo.
3. Framework preset: **Astro** (auto). Build `npm run build`, output `dist` (auto).
4. Add env var `PUBLIC_FORMSPREE_ENDPOINT` (see above).
5. Deploy.

**Option B — CLI:**
```bash
npm i -g vercel
vercel            # preview deploy
vercel --prod     # production
```

**After deploy — set your real domain** in `astro.config.mjs`:
```js
site: 'https://your-domain.com.au',   // used for canonical URLs, sitemap, JSON-LD
```
Then redeploy. Also update the `Sitemap:` line in `public/robots.txt` to match.

---

## 4. What's already handled

- **SEO** — per-page `<title>`/meta/canonical, Open Graph + Twitter cards, branded `og-image.png`, semantic headings, `sitemap-index.xml`, `robots.txt`.
- **Structured data (JSON-LD)** — `Plumber`/`LocalBusiness` with `areaServed` (all suburbs) site-wide, `Service` schema on Services, `FAQPage` on Contact.
- **Performance** — self-hosted Clash Display + Satoshi (woff2, preloaded, no render-blocking external CSS), motion libs in one deferred ES module, optimised WebP hero image (893 KB → 15 KB), inlined critical CSS, compressed HTML.
- **Accessibility** — WCAG AA contrast (checked, incl. lime-on-dark; muted footer text bumped to pass), visible focus rings, keyboard-operable accordion + expandable service cards, ARIA on form/accordion, full `prefers-reduced-motion` support, sticky call bar always reachable.
- **Conversion** — call-first hero on every page, sticky mobile call bar, magnetic CTAs, trust/credentials bar, honest 100% guarantee, trust signals beside the contact form.

---

## 5. Project structure

```
src/
  data/site.ts          ← ALL business content (edit here)
  styles/
    global.css          ← design tokens (color/type/easing) + base
    fonts.css           ← self-hosted @font-face (generated)
  lib/motion.ts         ← one consolidated motion layer (GSAP/ScrollTrigger/Lenis)
  layouts/Layout.astro  ← head/SEO/JSON-LD, nav, footer, intro, cursor, call bar
  components/            ← Button, Section, ServiceCard, Accordion, Reviews,
                          Credentials, MapPanel, JobGallery, ContactForm, CtaBand…
  pages/                ← index, services, about, service-areas, contact
public/
  fonts/                ← self-hosted woff2
  images/               ← about-founder.png/.webp, job photos
  favicon.svg, og-image.png, robots.txt
design-source/          ← original Claude Design .dc.html files + screenshots (reference only, not shipped)
```

### Image optimisation
To regenerate the optimised WebP after replacing the founder photo:
```bash
node -e "require('sharp')('public/images/about-founder.png').resize(720,900,{fit:'cover'}).webp({quality:78}).toFile('public/images/about-founder.webp')"
```

---

## 6. Real-data checklist (hand these over to finish)

| Item | Where it goes | Status |
|------|---------------|--------|
| Plumbing **licence number** | `src/data/site.ts → licence` | ⛔ TODO — placeholder hidden until provided |
| **ABN** | `src/data/site.ts → abn` | ⛔ TODO — placeholder hidden until provided |
| **Google/Facebook reviews** (name + suburb + text) | `src/data/site.ts → reviews` | ⛔ TODO — block hidden until provided |
| **Google rating + count** | `src/data/site.ts → googleRating` | ⛔ TODO (needs Google Business Profile) |
| **Job / before-after photos** | `public/images/` + `jobs[]` | ⛔ TODO — gallery hidden until provided |
| **Form endpoint** (Formspree or CRM) | `.env → PUBLIC_FORMSPREE_ENDPOINT` | ⛔ TODO — form falls back to "call us" until set |
| **Production domain** | `astro.config.mjs → site` + `robots.txt` | ⛔ TODO — currently placeholder |
| Founder/van photo | `public/images/about-founder.*` | ✅ Done (from supplied photo) |

Facebook page on file: <https://www.facebook.com/people/S-W-Plumbing/61555117598812/>
