/**
 * One-off: create £79/£95 prices, production webhook, and patch .env.
 * Run: node --env-file=.env ./node_modules/tsx/dist/cli.mjs script/provision-production-stripe.ts
 */
import { randomBytes } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import Stripe from "stripe";
import { REPORT_PRICE_GBP, RESET_PRICE_GBP } from "../server/stripeConfig";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const targetUrl = "https://redundancycalculatoruk.co.uk/api/stripe-webhook";

const reportOld = await stripe.prices.retrieve(process.env.STRIPE_PRICE_REPORT!);
const resetOld = await stripe.prices.retrieve(process.env.STRIPE_PRICE_RESET!);

const reportPrice =
  reportOld.unit_amount === REPORT_PRICE_GBP && reportOld.active
    ? reportOld
    : await stripe.prices.create({
        product: reportOld.product as string,
        currency: "gbp",
        unit_amount: REPORT_PRICE_GBP,
        metadata: { app: "redundancy-runway", product: "report", version: "2026-06" },
      });

const resetPrice =
  resetOld.unit_amount === RESET_PRICE_GBP && resetOld.active
    ? resetOld
    : await stripe.prices.create({
        product: resetOld.product as string,
        currency: "gbp",
        unit_amount: RESET_PRICE_GBP,
        metadata: { app: "redundancy-runway", product: "reset", version: "2026-06" },
      });

const existing = (await stripe.webhookEndpoints.list({ limit: 100 })).data.find((e) => e.url === targetUrl);
let webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
let endpoint = existing;
if (!endpoint) {
  endpoint = await stripe.webhookEndpoints.create({
    url: targetUrl,
    enabled_events: ["checkout.session.completed", "checkout.session.async_payment_succeeded"],
    description: "RedundancyCalculatorUK production",
  });
  webhookSecret = endpoint.secret ?? undefined;
}

const sessionSecret = process.env.SESSION_SECRET?.trim();
const needsSession = !sessionSecret || sessionSecret === "change-me-in-production";

let env = readFileSync(".env", "utf8");
const set = (key: string, value: string) => {
  const re = new RegExp(`^${key}=.*`, "m");
  env = re.test(env) ? env.replace(re, `${key}=${value}`) : `${env}\n${key}=${value}`;
};

set("STRIPE_PRICE_REPORT", reportPrice.id);
set("STRIPE_PRICE_RESET", resetPrice.id);
if (webhookSecret) set("STRIPE_WEBHOOK_SECRET", webhookSecret);
if (needsSession) set("SESSION_SECRET", randomBytes(48).toString("base64url"));
env = env.replace(
  /^DEV_GRANT_REPORT_ACCESS=1\s*$/m,
  "# DEV_GRANT_REPORT_ACCESS=1  # local only — never set on Vercel",
);
writeFileSync(".env", env);

console.log(`Report price: ${reportPrice.id} (${reportPrice.unit_amount} pence)`);
console.log(`Reset price: ${resetPrice.id} (${resetPrice.unit_amount} pence)`);
console.log(`Webhook: ${endpoint?.id} ${endpoint?.url} (${existing ? "reused" : "created"})`);
console.log(`SESSION_SECRET: ${needsSession ? "generated" : "unchanged"}`);
