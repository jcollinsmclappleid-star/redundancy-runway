import type Stripe from "stripe";
import {
  getStripeEnv,
  REPORT_PRICE_GBP,
  RESET_PRICE_GBP,
  REPORT_PRODUCT_NAME,
  RESET_PRODUCT_NAME,
  REPORT_PRODUCT_DESCRIPTION,
  RESET_PRODUCT_DESCRIPTION,
} from "./stripeConfig";

type CheckoutLineItem = Stripe.Checkout.SessionCreateParams.LineItem;

export function buildReportLineItem(): CheckoutLineItem {
  const { priceReport } = getStripeEnv();
  if (priceReport) {
    return { price: priceReport, quantity: 1 };
  }
  return {
    price_data: {
      currency: "gbp",
      unit_amount: REPORT_PRICE_GBP,
      product_data: {
        name: REPORT_PRODUCT_NAME,
        description: REPORT_PRODUCT_DESCRIPTION,
      },
    },
    quantity: 1,
  };
}

export function buildResetLineItem(): CheckoutLineItem {
  const { priceReset } = getStripeEnv();
  if (priceReset) {
    return { price: priceReset, quantity: 1 };
  }
  return {
    price_data: {
      currency: "gbp",
      unit_amount: RESET_PRICE_GBP,
      product_data: {
        name: RESET_PRODUCT_NAME,
        description: RESET_PRODUCT_DESCRIPTION,
      },
    },
    quantity: 1,
  };
}
