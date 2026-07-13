# S & W Plumbing — Quote Backend Setup (one-time, ~10 min)

The code is done and deployed. The quote form saves leads to a database, emails
S&W **instantly** on every submission, and emails a **weekly digest every Monday
7am (Brisbane)**. It just needs three things wired up in the dashboards — steps a
person has to do because they involve logins and secret keys.

Until these are done, the form politely shows **"please call us"** and no data is lost.

---

## Step 1 — Create the database (Vercel)

1. Go to **https://vercel.com/leadblockes/sw-plumbing** → **Storage** tab.
2. **Create Database** → **Postgres** (it's powered by Neon).
3. Name it e.g. `sw-plumbing-db`, region **Sydney (syd1)**, **Create**.
4. When asked, **Connect** it to the **sw-plumbing** project (all environments).
   - This automatically adds the `DATABASE_URL` / `POSTGRES_URL` env var. You don't copy anything.

*(The leads table creates itself on the first submission — no SQL to run.)*

## Step 2 — Create the email sender (Resend)

1. Go to **https://resend.com** → **Sign up**, and **use the email `SWPlumbing73@gmail.com`**.
   *(Signing up with that address lets it email that inbox without owning a domain.)*
2. Confirm the sign-up email.
3. **API Keys** → **Create API Key** → name it `sw-plumbing`, **Create**, and **copy** the key (starts with `re_…`).

## Step 2b — Create the Airtable token (leads grid for the client)

Leads also mirror into an Airtable base — **S&W Plumbing – Leads** — so the client can
view and manage every enquiry in a simple grid + phone app (New → Contacted → Quoted →
Won pipeline). The base is already built; it just needs a token so the site can write to it.

1. Go to **https://airtable.com/create/tokens** → **Create token**.
2. **Name:** `S&W Plumbing website leads`.
3. **Scopes:** add **`data.records:write`**.
4. **Access:** add the base **S&W Plumbing – Leads** (that base only).
5. **Create token**, then **copy** it (starts with `pat…`) — it's shown once.

*(Base id and table name default in code — `AIRTABLE_BASE_ID=appsrrbGxnnTaLT7l`,
`AIRTABLE_TABLE=Leads` — so only the token is needed. Override via env if the base moves.)*

## Step 3 — Add the secrets to Vercel

In **https://vercel.com/leadblockes/sw-plumbing** → **Settings** → **Environment Variables**,
add these (tick **Production** — and Preview if you want), then **Save**:

| Name | Value |
|---|---|
| `AIRTABLE_TOKEN` | the `pat…` token from Step 2b |
| `RESEND_API_KEY` | the `re_…` key from Step 2 |
| `CRON_SECRET` | any long random string — generate one, e.g. `openssl rand -hex 32` |
| `LEAD_EMAIL_TO` | `SWPlumbing73@gmail.com` *(optional — this is already the default)* |

*(`DATABASE_URL` is already there from Step 1. `CRON_SECRET` can be any long random string — it just has to match what Vercel uses. **Never commit the real value** — keep it only in Vercel's env settings. Each feature is independent — set just `AIRTABLE_TOKEN` and the grid works even before email is configured.)*

## Step 4 — Redeploy

Env vars only take effect on the **next** deploy:
- **Deployments** → the latest one → **⋯** → **Redeploy**.

---

## Test it

- **Instant alert + storage:** open the live site → **Contact** → send a test quote.
  You should get an email at SWPlumbing73@gmail.com within a few seconds, and the
  form should say *"Thanks — we've got it."*
- **Airtable grid:** open the **S&W Plumbing – Leads** base — a new row should appear
  within a second or two (Status = New). Works from both the homepage and Contact forms.
- **See the stored leads:** Vercel → **Storage** → your database → **Data**/**Query**, run:
  ```sql
  SELECT * FROM quote_requests ORDER BY created_at DESC;
  ```
- **Weekly digest:** runs automatically Monday 7am Brisbane. To test it now, either
  hit **Settings → Cron Jobs → Run** in Vercel, or run:
  ```bash
  curl -H "Authorization: Bearer <CRON_SECRET>" \
    https://sw-plumbing-leadblockes.vercel.app/api/cron/weekly-digest
  ```

## Notes
- **Free tiers cover this easily** (Neon Postgres + Resend + Vercel Cron).
- Emails send from Resend's shared `onboarding@resend.dev`. Once S&W has a real
  domain, verify it in Resend and set `LEAD_EMAIL_FROM` to e.g.
  `S&W Plumbing <leads@swplumbing.com.au>` for branded sender + better deliverability.
- Customer photos (if attached on the form) are forwarded on the instant alert email.
  They are **not** attached to the Airtable row (Airtable attachments need a public URL;
  add Vercel Blob hosting later to fill the `Photo` column too).
- All config lives in `.env.example`; endpoints are in `src/pages/api/`, data/email
  helpers in `src/lib/`.
