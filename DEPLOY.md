# Deploy S & W Plumbing → GitHub → Vercel

Goal: get this site on a **permanent** Vercel URL that auto-updates every time we change it.
The repo is already committed and push-ready. There is exactly **one** thing only you can do
(log into your own GitHub) — everything else I'll run for you.

---

## Step 1 — Log into GitHub (one time, ~60 seconds)

Open a terminal **in this folder** and run:

```bash
gh auth login
```

Answer the prompts like this (use arrow keys + Enter):

1. `What account do you want to log into?` → **GitHub.com**
2. `What is your preferred protocol for Git operations?` → **HTTPS**
3. `Authenticate Git with your GitHub credentials?` → **Yes**
4. `How would you like to authenticate?` → **Login with a web browser**
5. It shows a **one-time code** (e.g. `AB12-CD34`) — copy it, press **Enter**
6. Your browser opens → paste the code → **Authorize**

That's it. You're logged in.

## Step 2 — Tell me "logged in"

Then I run this for you (creates the repo under your account + pushes everything):

```bash
gh repo create sw-plumbing --private --source=. --remote=origin --push
```

## Step 3 — Connect it on Vercel (you, ~1 minute)

1. Go to **https://vercel.com/new?teamSlug=leadblockes**
2. **Import Git Repository** → pick **`sw-plumbing`**
   (if you don't see it, click *Adjust GitHub App Permissions* and give Vercel access to the repo)
3. Framework Preset: **Astro** (auto-detected). Leave build/output as-is.
4. *(Optional)* Environment Variables → add `PUBLIC_FORMSPREE_ENDPOINT` if your contact form is set up.
5. **Deploy.** ~30s later you get a live `*.vercel.app` URL.

## Step 4 — From now on it's automatic

Any change we make → I commit + `git push` → **Vercel redeploys itself.** No more dead tunnel links.

---

### Don't want to use the terminal at all?
Alternative with no GitHub: install the Vercel CLI and deploy the built folder directly.
```bash
npm i -g vercel
npm run build
vercel --prod
```
`vercel` will ask you to log in (browser) and pick the **leadblockes** team. This deploys the
`dist/` build but does **not** auto-redeploy on changes — the GitHub path above is better long-term.

### After it's live
- Point your real domain at it (Vercel → Project → Settings → Domains).
- Update `site:` in `astro.config.mjs` to that domain, then push (sitemap/canonical use it).
