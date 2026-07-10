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

## 🚨 Copy fixes still needed (site vs reality)
1. **Email** → change everywhere to `SWPlumbing73@gmail.com`.
2. **"24/7 Emergency" / "Same-day · 7 days a week"** banners on the live site → **overclaims.** Reality is Mon–Fri 7am–5pm, Sat by appt, after-hours *limited*. Change to e.g. "After-hours available — call for the fastest time."
3. **Remove Gas fitting** from services (they don't do it).
4. Add real **ABN (69 792 955 926)** and **QBCC licence PD25587** to footer + trust/proof areas (currently "TBC" placeholders).
5. Add **Elantis Premium Funding** as a "finance / payment options" trust point.
6. **Reviews are FAKE placeholders** (Sarah/Matt/Emily) — must be replaced with real Google reviews before relying on them (Australian Consumer Law risk on fake testimonials). They want a Google reviews feed.

## 📸 Assets still needed from client
- Real **owner photo** (the current "founder photo" is a screenshot of a mockup — looks broken; swap it). 
- Real **job photos** + **before/after** + **van** photos (they said they'll supply).
- Logo (needs designing).

## Requested features from onboarding (check these exist)
Click-to-call ✓ · Service-area map ✓ · Photo gallery ✓ · Before/after photos ✓ · **Google reviews feed** (needs real reviews) · **Finance/payment options** (add Elantis) · Sticky mobile call bar ✓. Pages: Home, Services, About, Service Areas, Reviews, Contact. Main goal = phone calls.

## Notes / gotchas
- Windows + PowerShell. `gh` CLI is **not** logged in — but GitHub pushes work via the cached Git Credential Manager token, and the repo is under the **leadblokes-gmail-com** GitHub account.
- `@astrojs/sitemap` is pinned to `~3.2.1` (newer 3.7 breaks on Astro 4).
- Brand recently shifted from neon-lime to **#00A651 green + black** (image-led, lighter theme).
- Set `site:` in `astro.config.mjs` to the real domain once purchased (used for sitemap/canonical), then push.
