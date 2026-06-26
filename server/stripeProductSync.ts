import type Stripe from "stripe";
import {
  getStripeEnv,
  REPORT_PRODUCT_NAME,
  REPORT_PRODUCT_DESCRIPTION,
  RESET_PRODUCT_NAME,
  RESET_PRODUCT_DESCRIPTION,
} from "./stripeConfig";

async function syncProductForPrice(
  stripe: Stripe,
  priceId: string | undefined,
  name: string,
  description: string,
): Promise<void> {
  if (!priceId) return;
  const price = await stripe.prices.retrieve(priceId);
  const productId = typeof price.product === "string" ? price.product : price.product.id;
  const product = await stripe.products.retrieve(productId);
  if (product.name === name && product.description === description) return;
  await stripe.products.update(productId, { name, description });
}

/** Keeps Stripe Checkout line-item names aligned with stripeConfig (Dashboard products can lag renames). */
export async function syncStripeCatalogNames(stripe: Stripe): Promise<void> {
  const { priceReport, priceReset } = getStripeEnv();
  await Promise.all([
    syncProductForPrice(stripe, priceReport, REPORT_PRODUCT_NAME, REPORT_PRODUCT_DESCRIPTION),
    syncProductForPrice(stripe, priceReset, RESET_PRODUCT_NAME, RESET_PRODUCT_DESCRIPTION),
  ]);
}
