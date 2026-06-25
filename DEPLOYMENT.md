# Deployment — Vercel (preview) & Replit (mobile)

## GitHub

Push to `main` on `jcollinsmclappleid-star/redundancy-runway`. Production domain **redundancycalculatoruk.co.uk** is not auto-deployed from `main` (see `vercel.json`).

---

## Replit (recommended for full-stack + mobile testing)

Best for Express + Postgres sessions + Stripe webhooks. Your `.replit` file is already configured.

### 1. Import the repo

1. Open [Replit](https://replit.com) → **Create Repl** → **Import from GitHub**
2. Repo: `jcollinsmclappleid-star/redundancy-runway`

### 2. Secrets (Tools → Secrets)

Copy from your local `.env`:

| Secret | Required |
|--------|----------|
| `DATABASE_URL` | Yes |
| `SESSION_SECRET` | Yes (long random string) |
| `STRIPE_SECRET_KEY` | Yes (test key for staging) |
| `STRIPE_PUBLISHABLE_KEY` | Yes |
| `STRIPE_PRICE_REPORT` | Yes |
| `STRIPE_PRICE_RESET` | Yes |
| `STRIPE_WEBHOOK_SECRET` | Yes (Replit webhook URL) |
| `OPENAI_API_KEY` | For brief generation |
| `RESEND_API_KEY` | For access/recovery emails |
| `ACCESS_EMAIL_FROM` | `noreply@redundancycalculatoruk.co.uk` |
| `ADMIN_PASSWORD` | Admin fulfilment portal |

`PORT=5000` is set in `.replit` automatically.

### 3. Database

Replit Postgres or Neon — paste connection string as `DATABASE_URL`, then in Shell:

```bash
npm run db:push
```

### 4. Run & mobile URL

- Click **Run** (starts `npm run dev`)
- Open the **Webview** tab — URL looks like:  
  `https://redundancy-runway.<your-username>.repl.co`  
  or after **Deploy**: `https://redundancy-runway.<user>.repl.app`
- Open that URL on your phone (same link works on mobile)

### 5. Published deployment (stable mobile link)

1. **Deploy** → Autoscale (configured in `.replit`)
2. Build: `npm run build` → Start: `node dist/index.cjs`
3. Use the `.repl.app` URL for demos

### 6. Stripe webhooks on Replit

```bash
stripe listen --forward-to https://YOUR-REPL-URL.repl.app/api/stripe-webhook
```

Put the `whsec_...` secret in Replit Secrets as `STRIPE_WEBHOOK_SECRET`.

---

## Vercel (preview only — no production)

Preview deployments for staging. **Do not** run `vercel --prod` until the production domain is ready.

### 1. Link project (once)

```bash
npm i -g vercel
vercel login
vercel link --yes --project redundancy-runway
```

### 2. Preview environment variables

```bash
npm run env:sync-vercel
```

Or manually in [Vercel Dashboard](https://vercel.com) → Project → Settings → Environment Variables → **Preview** only:

- `DATABASE_URL`, `SESSION_SECRET`, `OPENAI_API_KEY`
- `STRIPE_*` (test keys)
- `RESEND_API_KEY`, `ACCESS_EMAIL_FROM`
- `ADMIN_PASSWORD`

### 3. Preview deploy

```bash
vercel deploy
```

Do **not** use `vercel --prod`. Preview URL: `https://redundancy-runway-*.vercel.app`

### 4. Stripe webhook (preview)

Add endpoint: `https://YOUR-PREVIEW-URL.vercel.app/api/stripe-webhook`  
Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`

---

## Resend (email)

Used for: purchase confirmation, magic-link recovery, report access emails.

### 1. Resend dashboard

1. [resend.com](https://resend.com) → API Keys → create key → `RESEND_API_KEY`
2. **Domains** → add `redundancycalculatoruk.co.uk` → add DNS records (SPF, DKIM)
3. Until domain is verified, use Resend’s `onboarding@resend.dev` **only for testing**

### 2. Verify locally

```bash
# API key + domain list
npm run resend:verify

# Optional test send
RESEND_TEST_TO=you@example.com npm run resend:verify
```

### 3. From address

Set `ACCESS_EMAIL_FROM=noreply@redundancycalculatoruk.co.uk` after domain verification.

---

## Quick commands

| Task | Command |
|------|---------|
| Local dev | `npm run dev` |
| Typecheck + tests | `npm run check && npm test` |
| Build | `npm run build` |
| Vercel preview deploy | `vercel deploy` |
| Sync env to Vercel preview | `npm run env:sync-vercel` |
| Verify Resend | `npm run resend:verify` |
| Demo Reset portal | `npm run reset:seed` |
