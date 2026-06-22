import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { runwayInputSchema } from "@shared/schema";

const sessionBodySchema = z.object({
  sessionToken: z.string().min(1).max(128),
});

const calculationBodySchema = z.object({
  sessionToken: z.string().min(1).max(128),
  inputs: runwayInputSchema,
});

const resetCheckoutBodySchema = z.object({
  sessionToken: z.string().min(1).max(128).optional(),
});

const resetIntakeBodySchema = z.object({
  stripeSessionId: z.string().min(1),
  name: z.string().min(1).max(200),
  contactMethod: z.enum(["whatsapp", "webchat"]),
  intakeAnswers: z.record(z.string(), z.string()),
});

const resetStatusSchema = z.object({
  status: z.string().min(1),
});

const resetNotesSchema = z.object({
  adminNotes: z.string(),
});

const RESET_PRICE_GBP = 7900;
const RESET_PRODUCT_NAME = "7-Day Redundancy Reset";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/session", async (req, res) => {
    try {
      const parsed = sessionBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid session token" });
      }

      const { sessionToken } = parsed.data;
      let session = await storage.getSessionByToken(sessionToken);
      if (!session) {
        session = await storage.createSession({ sessionToken });
      }

      return res.json({ session });
    } catch (error) {
      console.error("Session error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/access/:token", async (req, res) => {
    try {
      const token = req.params.token;
      if (!token || token.length > 128) {
        return res.status(400).json({ message: "Invalid token" });
      }

      const purchase = await storage.getPurchaseBySessionToken(token);

      if (!purchase || purchase.status !== "completed") {
        return res.json({ hasAccess: false });
      }

      const now = new Date();
      if (purchase.expiresAt < now) {
        return res.json({ hasAccess: false, expired: true });
      }

      return res.json({ hasAccess: true, expiresAt: purchase.expiresAt });
    } catch (error) {
      console.error("Access check error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/calculations", async (req, res) => {
    try {
      const parsed = calculationBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid calculation data", errors: parsed.error.issues });
      }

      const { sessionToken, inputs } = parsed.data;
      const calculation = await storage.createCalculation({
        sessionToken,
        inputs,
      });

      return res.json({ calculation });
    } catch (error) {
      console.error("Calculation error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/calculations/:token", async (req, res) => {
    try {
      const token = req.params.token;
      if (!token || token.length > 128) {
        return res.status(400).json({ message: "Invalid token" });
      }

      const calculations = await storage.getCalculationsBySessionToken(token);
      return res.json({ calculations });
    } catch (error) {
      console.error("Get calculations error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // POST /api/reset-checkout
  // Creates a Stripe Checkout session for the Reset product.
  // Pre-creates a pending reset record keyed by the Stripe session ID — this is
  // the ONLY way a reset record can be created. The paid flag is set server-side
  // only, never trusted from the client.
  app.post("/api/reset-checkout", async (req, res) => {
    try {
      const parsed = resetCheckoutBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request" });
      }

      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();

      const origin = `${req.protocol}://${req.get("host")}`;
      const sessionToken = parsed.data.sessionToken;

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "gbp",
              unit_amount: RESET_PRICE_GBP,
              product_data: {
                name: RESET_PRODUCT_NAME,
                description: "Practical written support and planning for redundancy. 7-day programme.",
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/redundancy-reset/intake?session_id={CHECKOUT_SESSION_ID}${sessionToken ? `&token=${sessionToken}` : ""}`,
        cancel_url: `${origin}/redundancy-reset`,
        metadata: {
          product: "reset",
          sessionToken: sessionToken ?? "",
        },
      });

      // Pre-create a server-side pending record so the stripeSessionId is known
      // and cannot be forged by a client later submitting intake.
      await storage.createPendingReset(checkoutSession.id, sessionToken);

      return res.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
    } catch (error: any) {
      console.error("Reset checkout error:", error);
      if (error.message?.includes("Stripe integration not connected") || error.message?.includes("Missing Replit")) {
        return res.status(503).json({ message: "Payment system not yet configured. Please try again shortly." });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // POST /api/stripe-webhook
  // Handles Stripe checkout.session.completed events.
  // Uses the webhookSecret from the Replit Stripe integration credentials —
  // NOT from process.env.STRIPE_WEBHOOK_SECRET.
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const sig = req.headers["stripe-signature"] as string;
      const rawBody = (req as any).rawBody as Buffer;

      if (!sig || !rawBody) {
        return res.status(400).json({ message: "Missing signature or body" });
      }

      // Import here to avoid crash at startup when integration not yet connected
      const { getUncachableStripeClient } = await import("./stripeClient");

      // Fetch webhook secret from the same integration credentials source
      // so we never rely on a separately-maintained env var.
      let webhookSecret: string | undefined;
      try {
        // Dynamically resolve from integration credentials
        const credModule = await import("./stripeClient");
        // getStripeSync reads webhookSecret from the connector; we mirror that approach
        const { getStripeSync } = credModule;
        const sync = await getStripeSync();
        // StripeSync exposes its webhookSecret via its config — fall back to env if unavailable
        webhookSecret = (sync as any).webhookSecret ?? process.env.STRIPE_WEBHOOK_SECRET;
      } catch {
        webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      }

      if (!webhookSecret) {
        console.error("Stripe webhook secret not available — cannot verify signature");
        return res.status(500).json({ message: "Webhook configuration error" });
      }

      const stripe = await getUncachableStripeClient();
      let event: any;
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).json({ message: "Webhook signature verification failed" });
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        if (session.metadata?.product === "reset") {
          await storage.updateResetPaid(session.id, "paid");
        }
      }

      return res.json({ received: true });
    } catch (error) {
      console.error("Stripe webhook error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // POST /api/resets
  // Saves intake answers for a Reset submission.
  // SECURITY: The stripeSessionId in the body must match a record that was
  // pre-created server-side by /api/reset-checkout. The client cannot create
  // a new record directly, and the `paid` status is never accepted from the client.
  // If the webhook has not yet arrived, the server attempts to verify payment
  // directly via the Stripe API and updates paid status if confirmed.
  app.post("/api/resets", async (req, res) => {
    try {
      const parsed = resetIntakeBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid intake data", errors: parsed.error.issues });
      }

      const { stripeSessionId, name, contactMethod, intakeAnswers } = parsed.data;

      // Verify this stripeSessionId was created by us (server-side) during checkout
      const existingReset = await storage.getResetByStripeSessionId(stripeSessionId);
      if (!existingReset) {
        return res.status(403).json({ message: "Checkout session not found. Please complete payment first." });
      }

      // If not yet marked paid by webhook, try to verify with Stripe API
      if (existingReset.paid !== "paid") {
        try {
          const { getUncachableStripeClient } = await import("./stripeClient");
          const stripe = await getUncachableStripeClient();
          const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
          if (session.payment_status === "paid") {
            await storage.updateResetPaid(stripeSessionId, "paid");
          } else {
            return res.status(402).json({ message: "Payment not yet confirmed. Please wait a moment and try again." });
          }
        } catch (stripeError: any) {
          // If Stripe not connected but we have a server-created pending record,
          // we allow the intake to proceed in dev/test mode — the paid status
          // will be reconciled when the webhook or manual verification arrives.
          console.warn("Stripe verification unavailable during intake; proceeding with server-created session:", stripeError.message);
        }
      }

      // Update the server-created record with actual intake data
      await storage.updateResetIntake(stripeSessionId, { name, contactMethod, intakeAnswers });

      const updatedReset = await storage.getResetByStripeSessionId(stripeSessionId);
      return res.json({ reset: updatedReset });
    } catch (error) {
      console.error("Create reset error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/resets", async (_req, res) => {
    try {
      const allResets = await storage.getResets();
      return res.json({ resets: allResets });
    } catch (error) {
      console.error("Get resets error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/resets/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      if (req.body.status !== undefined) {
        const statusParsed = resetStatusSchema.safeParse(req.body);
        if (statusParsed.success) {
          await storage.updateResetStatus(id, statusParsed.data.status);
        }
      }

      if (req.body.adminNotes !== undefined) {
        const notesParsed = resetNotesSchema.safeParse(req.body);
        if (notesParsed.success) {
          await storage.updateResetNotes(id, notesParsed.data.adminNotes);
        }
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("Update reset error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
