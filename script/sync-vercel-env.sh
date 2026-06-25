#!/usr/bin/env bash
# Push .env variables to Vercel Preview environment (not Production).
# Usage: npm run env:sync-vercel
set -euo pipefail

if [[ ! -f .env ]]; then
  echo "Missing .env — copy from .env.example first."
  exit 1
fi

VERCEL_CMD="${VERCEL_CMD:-npx vercel}"

if ! $VERCEL_CMD whoami >/dev/null 2>&1; then
  echo "Vercel CLI not authenticated. Run: npx vercel login"
  exit 1
fi

ENV_KEYS=(
  DATABASE_URL
  SESSION_SECRET
  RESEND_API_KEY
  ACCESS_EMAIL_FROM
  ADMIN_PASSWORD
  OPENAI_API_KEY
  STRIPE_SECRET_KEY
  STRIPE_PUBLISHABLE_KEY
  STRIPE_PRICE_REPORT
  STRIPE_PRICE_RESET
  STRIPE_WEBHOOK_SECRET
)

echo "Syncing Preview env vars to linked Vercel project (skipping Production)..."

for key in "${ENV_KEYS[@]}"; do
  value="$(grep -E "^${key}=" .env | head -1 | cut -d= -f2- || true)"
  if [[ -z "${value}" ]]; then
    echo "  skip ${key} (empty in .env)"
    continue
  fi
  printf '%s' "$value" | $VERCEL_CMD env add "$key" preview --force --scope jcollinsmclappleid-stars-projects 2>/dev/null || \
    printf '%s' "$value" | $VERCEL_CMD env add "$key" preview --scope jcollinsmclappleid-stars-projects
  echo "  set ${key} (preview)"
done

echo "Done. Deploy preview with: vercel deploy"
