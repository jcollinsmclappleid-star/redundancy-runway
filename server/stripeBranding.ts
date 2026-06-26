import type Stripe from "stripe";

/** Public logo URL for Stripe Checkout branding (full dark wordmark). */
export function buildCheckoutBranding(origin: string): Pick<Stripe.Checkout.SessionCreateParams, "branding_settings"> {
  const logoUrl = `${origin.replace(/\/$/, "")}/logo.png`;
  return {
    branding_settings: {
      logo: {
        type: "url",
        url: logoUrl,
      },
    },
  };
}
