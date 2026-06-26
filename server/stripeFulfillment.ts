import type Stripe from "stripe";
import { storage } from "./storage";
import { sendPurchaseConfirmationEmail } from "./email";

function isCheckoutPaid(session: Stripe.Checkout.Session): boolean {
  return session.payment_status === "paid";
}

/**
 * Idempotent fulfillment for a completed Checkout session.
 * Used by the Stripe webhook and by client-side verify fallbacks.
 */
export async function fulfillCheckoutSession(
  session: Stripe.Checkout.Session,
  origin: string,
): Promise<{ fulfilled: boolean; product?: "report" | "reset" }> {
  if (!isCheckoutPaid(session)) {
    return { fulfilled: false };
  }

  const product = session.metadata?.product;

  if (product === "reset") {
    const existing = await storage.getResetByStripeSessionId(session.id);
    if (!existing) {
      console.warn(`Webhook: reset checkout ${session.id} has no pending record`);
      return { fulfilled: false, product: "reset" };
    }
    if (existing.paid !== "paid") {
      await storage.updateResetPaid(session.id, "paid");
    }
    return { fulfilled: true, product: "reset" };
  }

  if (product === "report") {
    const purchase = await storage.getPurchaseByCheckoutSessionId(session.id);
    if (!purchase) {
      console.warn(`Webhook: report checkout ${session.id} has no purchase record`);
      return { fulfilled: false, product: "report" };
    }

    if (purchase.status !== "paid" && purchase.status !== "completed") {
      const email = session.customer_details?.email ?? null;
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? "";

      await storage.markPurchasePaid(purchase.id, paymentIntentId, email);

      if (email) {
        const updated = await storage.getPurchaseByCheckoutSessionId(session.id);
        const emailed = await sendPurchaseConfirmationEmail(
          email,
          purchase.sessionToken,
          updated?.expiresAt ?? null,
          origin,
        );
        if (!emailed) {
          console.error(`[checkout] Purchase confirmation not sent to ${email} — check Resend`);
        }
      }
    }

    return { fulfilled: true, product: "report" };
  }

  console.warn(`Webhook: checkout ${session.id} missing or unknown product metadata`);
  return { fulfilled: false };
}

export const STRIPE_WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
] as const;

export type StripeWebhookEventType = (typeof STRIPE_WEBHOOK_EVENTS)[number];

export function isHandledWebhookEvent(type: string): type is StripeWebhookEventType {
  return (STRIPE_WEBHOOK_EVENTS as readonly string[]).includes(type);
}
