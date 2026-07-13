# Quote form → Google Sheet (Lead Blokes account) — ~5 min

This saves every quote-form enquiry as a row in a Google Sheet. No Postgres, no
Resend, nothing to pay. Do this while signed in to the **Lead Blokes Google account**.

## 1. Make the Sheet
1. Go to https://sheets.new (signed in as Lead Blokes).
2. Name it **S&W Plumbing – Leads**.

## 2. Add the script
1. In that Sheet: **Extensions → Apps Script**.
2. Delete whatever's there, and paste the whole contents of **`google-apps-script.gs`** (in this repo).
3. Click **Save** (💾).

## 3. Deploy it as a Web app
1. **Deploy → New deployment**.
2. Click the gear ⚙ → **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** **Anyone**
4. **Deploy** → **Authorize access** → pick the Lead Blokes account → Advanced → “Go to … (unsafe)” → **Allow**. *(This is Google warning you about your own script; it's fine.)*
5. Copy the **Web app URL** — it ends in `/exec`.

## 4. Send me the URL
Paste that `…/exec` URL back to me and I'll point the form at it (one line + a push).
*(Or set it yourself: Vercel → Project → Settings → Environment Variables →
`PUBLIC_QUOTE_ENDPOINT` = the `/exec` URL → redeploy.)*

## Done
Submit a test enquiry on the site → a new row appears in the Sheet
(Received, Name, Phone, Suburb, Service, Message).

Notes:
- Photos aren't saved to the Sheet (text fields only) — fine for now.
- This is a "for now" setup. The full Postgres + instant-email backend
  (`BACKEND-SETUP.md`) is still in the code if you want to switch to it later.
