#!/usr/bin/env bash
# Push .env variables to Vercel Preview and Production.
# Usage: npm run env:sync-vercel
# Never syncs DEV_GRANT_REPORT_ACCESS (local dev only).
set -euo pipefail

if [[ ! -f .env ]]; then
  echo "Missing .env — copy from .env.example first."
  exit 1
fi

VERCEL_CMD="${VERCEL_CMD:-./node_modules/.bin/vercel}"
SCOPE="${VERCEL_SCOPE:-jcollinsmclappleid-stars-projects}"

if ! $VERCEL_CMD whoami >/dev/null 2>&1; then
  echo "Vercel CLI not authenticated. Run: npx vercel login"
  exit 1
fi

ENV_KEYS=(
  DATABASE_URL
  SESSION_SECRET
  BRIEF_AI_MODE
  RESEND_API_KEY
  ACCESS_EMAIL_FROM
  GRANTED_ACCESS_EMAILS
  ADMIN_PASSWORD
  OPENAI_API_KEY
  STRIPE_SECRET_KEY
  STRIPE_PUBLISHABLE_KEY
  STRIPE_PRICE_REPORT
  STRIPE_PRICE_RESET
  STRIPE_WEBHOOK_SECRET
)

push_env_to_vercel() {
  local target="$1"
  echo "Syncing ${target}..."
  for key in "${ENV_KEYS[@]}"; do
    value="$(grep -E "^${key}=" .env | head -1 | cut -d= -f2- | tr -d '\r' || true)"
    value="${value#\"}"
    value="${value%\"}"
    if [[ -z "${value}" ]]; then
      echo "  skip ${key} (empty in .env)"
      continue
    fi
    printf '%s' "$value" | $VERCEL_CMD env add "$key" "$target" --force --scope "$SCOPE" 2>/dev/null || \
      printf '%s' "$value" | $VERCEL_CMD env add "$key" "$target" --scope "$SCOPE"
    echo "  set ${key}"
  done
}

push_env_to_vercel preview
echo ""
push_env_to_vercel production

echo ""
echo "Done. Deploy production with: npx vercel --prod"
