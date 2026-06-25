/**
 * Creates or fetches a Stripe publishable key via IAM API and writes it to .env.
 * Run: npm run stripe:publishable-key
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
if (!secretKey) {
  console.error("STRIPE_SECRET_KEY missing in .env");
  process.exit(1);
}

const stripe = new Stripe(secretKey);
const account = await stripe.accounts.retrieve();
const accountId = account.id;

const res = await fetch("https://api.stripe.com/v2/iam/api_keys", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${secretKey}`,
    "Stripe-Version": "2026-05-27.preview",
    "Stripe-Context": accountId,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    type: "publishable_key",
    name: "RedundancyCalculatorUK",
  }),
});

const body = await res.json();
if (!res.ok) {
  console.error("Stripe IAM API error:", body.error?.message ?? res.statusText);
  console.error(
    "Fallback: copy pk_live_... from https://dashboard.stripe.com/apikeys into STRIPE_PUBLISHABLE_KEY",
  );
  process.exit(1);
}

const pk =
  body.publishable_key?.token ??
  body.token ??
  body.key;

if (!pk || typeof pk !== "string" || !pk.startsWith("pk_")) {
  console.error("Unexpected response shape from Stripe IAM API");
  process.exit(1);
}

const envPath = resolve(process.cwd(), ".env");
let env = readFileSync(envPath, "utf8");
if (/^STRIPE_PUBLISHABLE_KEY=.*/m.test(env)) {
  env = env.replace(/^STRIPE_PUBLISHABLE_KEY=.*/m, `STRIPE_PUBLISHABLE_KEY=${pk}`);
} else {
  env += `\nSTRIPE_PUBLISHABLE_KEY=${pk}\n`;
}
writeFileSync(envPath, env);
console.log(`Updated STRIPE_PUBLISHABLE_KEY in .env (${pk.slice(0, 14)}...)`);
