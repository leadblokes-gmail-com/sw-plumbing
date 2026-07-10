# S & W Plumbing — Project Handoff (paste this into a new chat)

## What this is
Production marketing website for **S & W Plumbing** (Birkdale / bayside Brisbane plumber), a Lead Blokes client. Astro + TypeScript, deployed on Vercel, auto-deploys from GitHub.

## Where everything lives
- **Project folder:** `C:\Users\caleb\Documents\Claude\Projects\Lead Blokes\sw-plumbing`
- **GitHub repo:** https://github.com/leadblokes-gmail-com/sw-plumbing  (branch `main`)
- **Live site (Vercel):** https://sw-plumbing-leadblockes.vercel.app  (public, HTTP 200)
- **Vercel team/project:** Leadblockes → `sw-plumbing`. Connected to the GitHub repo — **every `git push` to `main` auto-redeploys.** Deployment Protection (login wall) is OFF so the public can see it.
- **Contact form:** posts to a configurable endpoint via `PUBLIC_FORMSPREE_ENDPOINT` env var (set in `.env` and in Vercel → Project → Settings → Environment Variables). Falls back to "call us" if unset.

## How to run / build / deploy
```bash
npm install
npm run dev        # local dev
npm run build      # production build -> dist/
git add -A && git commit -m "..." && git push   # -> Vercel auto-deploys
```
All site content is centralised in **`src/data/site.ts`** (business info, services, suburbs, FAQs, reviews). Edit there, not per-page.

---

## ✅ REAL business data (from the signed onboarding sheet — plug these in)
| Field | Value |
|---|---|
| Legal name | S & W Plumbing |
| **ABN** | **69 792 955 926** |
| **QBCC licence #** | **PD25587** |
| Year established | 2025 |
| Main contact | **Steve** |
| Mobile (primary CTA) | 0432 292 371 |
| **Email** | **SWPlumbing73@gmail.com** ⚠️ (site may still show the old `swplumbing@gmail.com` — FIX to this) |
| Base suburb | Birkdale, QLD |
| **Service area** | **40 km radius, Brisbane South-East** (bayside / Redlands) |
| **Trading hours** | **Mon–Fri 7am–5pm, Sat by appointment** |
| **After-hours / emergency** | **Yes, LIMITED** (⚠️ NOT 24/7 — see fixes below) |
| Works for | Mostly residential |
| Wants more of | Real estate / water-filter jobs |
| Finance option | **Elantis Premium Funding** (payment plans available — a trust signal) |
| Brand colours | **Black & green** |
| Logo | None yet — needs one made |
| Photos they'll supply | Job/work photos + van photos (real ones to come) |

### Services they DO offer (use these)
General maintenance · Hot water systems · Burst pipes · **Bathroom/kitchen renovations** · Blocked drains · **Leak detection** · **Roof & gutter** · **Commercial plumbing**

### Services they DON'T offer (remove if present)
❌ **Gas fitting** · ❌ Drain camera/CCTV · ❌ Backflow testing · ❌ New construction/fit-out

---

## ✅ Copy fixes — DONE (commit af550f4, 2026-07-11)
1. ~~Email~~ → now `SWPlumbing73@gmail.com` everywhere (site.ts, contact-page mailto, JSON-LD).
2. ~~24/7 / same-day / 7-days overclaims~~ → replaced with real hours (Mon–Fri 7am–5pm · Sat by appointment · limited after-hours) in hero, emergency strip, nav bar, footer and contact page. `openingHoursSpecification` added to LocalBusiness schema.
3. ~~Gas fitting~~ → removed everywhere (service, FAQ, quote dropdown, meta descriptions, home card, footer thumbs). Home card swapped to **General Maintenance**.
4. ~~ABN / QBCC~~ → real `QBCC PD25587` + `ABN 69 792 955 926` set in `business` (site.ts); flow automatically into the footer via `credentialLine` and the "Licensed & qualified" credential card.
5. ~~Elantis~~ → added as a **"Payment plans available"** credential/trust card and `business.finance`.

## ✅ Reconciled against the signed onboarding sheet (commit after af550f4, 2026-07-11)
All data above verified against the client's scanned sheet (JOB #LB-7976, 26 Jun 2026). Additional changes:
6. **Insurance claim REMOVED.** The sheet's "Licences, insurances, memberships, guarantees" box lists **only "Elantis Premium Funding"** — no public liability, no membership, no guarantee. So the "Public liability insured" home trust card was replaced with **"No job too big or small"**, and no insurance claim remains site-wide. **Do not re-add insurance/insured claims until the client actually provides a policy.** (QBCC licence is the only verified credential.)
7. **Differentiators** (their words): "Approachable, honest, no job too big or small" woven into the About hero + story.
8. **Target work they want MORE of** (real estate / water filters): added *water filter installs* + *real estate / commercial* to services data + FAQ.

## 🚨 Still needs real data from client (blocked — don't fabricate)
- **Reviews** — the `reviews` array in `site.ts` is intentionally **EMPTY** (no fake testimonials; the Reviews block auto-hides). Paste real Google/Facebook reviews here to switch it on. They want a Google reviews feed. *(Note: the "Sarah/Matt/Emily" fakes from the old handoff are already gone.)*
- **Google rating** — set `googleRating` in `site.ts` once a Google Business Profile is live.

## 📸 Assets still needed from client
- Real **owner photo** — the About page already shows an honest **"Owner photo to be added"** placeholder (the old broken mockup screenshot is gone). Drop in the real photo when supplied.
- Real **job photos** + **before/after** + **van** photos → add to the `jobs` array in `site.ts` (currently empty; JobGallery auto-hides).
- Logo (needs designing).
- `gas-fitting.jpg` still sits unused in `public/assets/` — harmless; delete whenever.

## Requested features from onboarding (status vs the sheet)
- Ticked & built: Click-to-call ✓ · Service-area map ✓ · Before/after photos (component ready, `jobs` array empty) ✓ · Finance/payment options (Elantis) ✓ · Sticky mobile call bar ✓ · Google reviews feed (needs real reviews + a GBP — client **doesn't have a Google Business Profile yet**).
- **NOT ticked by client** (so we didn't add): Online quote/booking form, Live chat, WhatsApp button, **Emergency call-out banner** (note: the home page still has a softened "After-Hours Emergency Help" strip — fine given they do limited after-hours, but it wasn't a requested feature).
- **Pages ticked:** Home ✓ Services ✓ About ✓ Service Areas ✓ Contact ✓ **Reviews/testimonials** — ⚠️ *no dedicated `reviews.astro` page exists yet*; reviews currently render as an auto-hiding section on Home/About. Build a proper Reviews page once there are real reviews to fill it.
- Look & feel + wording: client said **"No, need it written"** and left look/feel blank — all copy is ours; keep it approachable/honest per their differentiator. Main goal = **phone calls** ("Call now").

## Notes / gotchas
- Windows + PowerShell. `gh` CLI is **not** logged in — but GitHub pushes work via the cached Git Credential Manager token, and the repo is under the **leadblokes-gmail-com** GitHub account.
- `@astrojs/sitemap` is pinned to `~3.2.1` (newer 3.7 breaks on Astro 4).
- Brand recently shifted from neon-lime to **#00A651 green + black** (image-led, lighter theme).
- Set `site:` in `astro.config.mjs` to the real domain once purchased (used for sitemap/canonical), then push.
