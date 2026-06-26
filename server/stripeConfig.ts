/** Stripe product pricing (pence). */
export const REPORT_PRICE_GBP = 7900;
export const RESET_PRICE_GBP = 9500;

export const REPORT_PRODUCT_NAME = "Private Redundancy Pay Intelligence Report";
export const RESET_PRODUCT_NAME = "7-Day Redundancy Reset";

export const REPORT_PRODUCT_DESCRIPTION =
  "Private Runway Command Centre plus plain-English Redundancy Runway Brief. 6 months access.";

export const RESET_PRODUCT_DESCRIPTION =
  "Practical written support and planning for redundancy. 7-day programme.";

export interface StripeEnvConfig {
  secretKey?: string;
  publishableKey?: string;
  webhookSecret?: string;
  priceReport?: string;
  priceReset?: string;
}

export function getStripeEnv(): StripeEnvConfig {
  return {
    secretKey: process.env.STRIPE_SECRET_KEY?.trim() || undefined,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY?.trim() || undefined,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET?.trim() || undefined,
    priceReport: process.env.STRIPE_PRICE_REPORT?.trim() || undefined,
    priceReset: process.env.STRIPE_PRICE_RESET?.trim() || undefined,
  };
}

export function isStripeEnvConfigured(): boolean {
  return Boolean(getStripeEnv().secretKey);
}
