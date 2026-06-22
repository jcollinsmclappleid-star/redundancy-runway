import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { runwayInputSchema, insertResetSchema } from "@shared/schema";

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

const resetIntakeBodySchema = insertResetSchema;

const resetStatusSchema = z.object({
  status: z.string().min(1),
});

const resetNotesSchema = z.object({
  adminNotes: z.string(),
});

const RESET_PRODUCT_NAME = "7-Day Redundancy Reset";
const RESET_PRICE_GBP = 7900;

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

      const session = await stripe.checkout.sessions.create({
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

      return res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error("Reset checkout error:", error);
      if (error.message?.includes("Stripe integration not connected")) {
        return res.status(503).json({ message: "Payment system not yet configured. Please try again shortly." });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();

      const sig = req.headers["stripe-signature"] as string;
      const rawBody = (req as any).rawBody as Buffer;

      if (!sig || !rawBody) {
        return res.status(400).json({ message: "Missing signature or body" });
      }

      let event: any;
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
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

  app.post("/api/resets", async (req, res) => {
    try {
      const parsed = resetIntakeBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid intake data", errors: parsed.error.issues });
      }

      const reset = await storage.createReset(parsed.data);
      return res.json({ reset });
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

      const statusParsed = resetStatusSchema.safeParse(req.body);
      const notesParsed = resetNotesSchema.safeParse(req.body);

      if (statusParsed.success && req.body.status !== undefined) {
        await storage.updateResetStatus(id, statusParsed.data.status);
      }

      if (notesParsed.success && req.body.adminNotes !== undefined) {
        await storage.updateResetNotes(id, notesParsed.data.adminNotes);
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("Update reset error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
