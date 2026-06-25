/**
 * Creates Stripe products + prices for RedundancyCalculatorUK.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... npx tsx script/setup-stripe.ts
 *
 * Copy the printed price IDs into .env as STRIPE_PRICE_REPORT and STRIPE_PRICE_RESET.
 */
import Stripe from "stripe";
import {
  REPORT_PRICE_GBP,
  RESET_PRICE_GBP,
  REPORT_PRODUCT_NAME,
  RESET_PRODUCT_NAME,
  REPORT_PRODUCT_DESCRIPTION,
  RESET_PRODUCT_DESCRIPTION,
} from "../server/stripeConfig";

async function main() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    console.error("Set STRIPE_SECRET_KEY in your environment or .env before running this script.");
    process.exit(1);
  }

  const stripe = new Stripe(secretKey);

  console.log("Creating Stripe products and prices...\n");

  const reportProduct = await stripe.products.create({
    name: REPORT_PRODUCT_NAME,
    description: REPORT_PRODUCT_DESCRIPTION,
    metadata: { app: "redundancy-runway", product: "report" },
  });

  const reportPrice = await stripe.prices.create({
    product: reportProduct.id,
    currency: "gbp",
    unit_amount: REPORT_PRICE_GBP,
    metadata: { app: "redundancy-runway", product: "report" },
  });

  const resetProduct = await stripe.products.create({
    name: RESET_PRODUCT_NAME,
    description: RESET_PRODUCT_DESCRIPTION,
    metadata: { app: "redundancy-runway", product: "reset" },
  });

  const resetPrice = await stripe.prices.create({
    product: resetProduct.id,
    currency: "gbp",
    unit_amount: RESET_PRICE_GBP,
    metadata: { app: "redundancy-runway", product: "reset" },
  });

  console.log("Done. Add these to your .env:\n");
  console.log(`STRIPE_PRICE_REPORT=${reportPrice.id}`);
  console.log(`STRIPE_PRICE_RESET=${resetPrice.id}`);
  console.log("");
  console.log("Dashboard links:");
  console.log(`  Report product: https://dashboard.stripe.com/products/${reportProduct.id}`);
  console.log(`  Reset product:  https://dashboard.stripe.com/products/${resetProduct.id}`);
  console.log("");
  console.log("Webhook endpoint (production):");
  console.log("  URL:    https://YOUR_DOMAIN/api/stripe-webhook");
  console.log("  Events: checkout.session.completed, checkout.session.async_payment_succeeded");
  console.log("");
  console.log("Local webhook forwarding:");
  console.log("  stripe listen --forward-to localhost:5000/api/stripe-webhook");
  console.log("  (copy whsec_... from CLI output into STRIPE_WEBHOOK_SECRET)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
