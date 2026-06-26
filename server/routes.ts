import type { Express, Request } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { randomUUID, randomBytes, timingSafeEqual } from "crypto";
import { RESET_STATUS_OPTIONS, runwayInputSchema } from "@shared/schema";
import { rateLimit } from "./rateLimit";
import { sendPurchaseConfirmationEmail, sendMagicLinkEmail, sendAccessLinksEmail } from "./email";
import OpenAI from "openai";
import { PRIVATE_RUNWAY_BRIEF_SYSTEM_PROMPT } from "./private-runway-brief/prompt";
import {
  privateRunwayBriefRequestSchema,
  PRIVATE_RUNWAY_BRIEF_DISCLAIMER,
  privateRunwayBriefNarrativeSchema,
} from "./private-runway-brief/schema";
import { buildPrivateRunwayBriefUserPrompt, buildPrivateRunwayBriefLiteUserPrompt } from "./private-runway-brief/buildUserPrompt";
import { getBriefAiMode } from "@shared/briefAiPolicy";
import { PRIVATE_RUNWAY_BRIEF_LITE_SYSTEM_PROMPT } from "./private-runway-brief/prompt-lite";
import { briefNarrativeLiteSchema } from "./private-runway-brief/schema";
import { validateBriefNarrativeLite } from "@shared/validateBriefNarrative";
import { REPORT_PRICE_GBP } from "./stripeConfig";
import { buildReportLineItem, buildResetLineItem } from "./stripeCheckout";
import { buildCheckoutBranding } from "./stripeBranding";
import {
  fulfillCheckoutSession,
  isHandledWebhookEvent,
  STRIPE_WEBHOOK_EVENTS,
} from "./stripeFulfillment";
import { isDevReportAccessGranted } from "@shared/devAccess";
import { ensureGrantedProducts, isGrantedAccessEmail } from "./grantedAccess";
import { buildMaximiserInsights } from "../client/src/lib/position-enhancement/buildMaximiserInsights";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const sessionBodySchema = z.object({
  sessionToken: z.string().min(1).max(128),
});

const emailSchema = z.string().trim().email().max(320).transform((email) => email.toLowerCase());

const checkoutCreateSchema = z.object({
  sessionToken: z.string().min(1).max(128),
});

const checkoutVerifySchema = z.object({
  checkoutSessionId: z.string().min(1),
});

const calculationBodySchema = z.object({
  sessionToken: z.string().min(1).max(128),
  inputs: runwayInputSchema,
});

const reportAccessEmailBodySchema = z.object({
  sessionToken: z.string().min(1).max(128),
  email: emailSchema,
  inputs: runwayInputSchema.optional(),
});

const recoverAccessBodySchema = z.object({
  email: emailSchema,
});

const resetCheckoutBodySchema = z.object({
  sessionToken: z.string().min(1).max(128).optional(),
});

const resetIntakeBodySchema = z.object({
  stripeSessionId: z.string().min(1),
  name: z.string().min(1).max(200),
  email: emailSchema,
  contactMethod: z.enum(["whatsapp", "webchat"]),
  intakeAnswers: z.record(z.string(), z.string()),
});

const structuredResetFieldSchema = z.record(z.string(), z.unknown());

const resetFulfilmentSchema = z.object({
  status: z.enum(RESET_STATUS_OPTIONS).optional(),
  riskFlags: structuredResetFieldSchema.optional(),
  reply1: structuredResetFieldSchema.optional(),
  followUp: structuredResetFieldSchema.optional(),
  finalPlan: structuredResetFieldSchema.optional(),
  boundaryChecklist: structuredResetFieldSchema.optional(),
  adminNotes: z.string().optional(),
});

function stripeNotConfiguredMessage(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes("STRIPE_SECRET_KEY") ||
    msg.includes("Replit Stripe") ||
    msg.includes("Stripe integration not connected") ||
    msg.includes("Missing Replit")
  );
}

function createPortalToken() {
  return `reset_${randomUUID().replace(/-/g, "")}`;
}

function getOrigin(req: Request) {
  return `${req.protocol}://${req.get("host")}`;
}

function isAdminAuthorized(req: Request): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice(7);
  if (token.length !== password.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(password));
  } catch {
    return false;
  }
}

function purchaseHasAccess(purchase: { status: string; expiresAt: Date }) {
  const paid = purchase.status === "paid" || purchase.status === "completed";
  return paid && new Date(purchase.expiresAt) > new Date();
}

function toPublicReset(reset: Awaited<ReturnType<typeof storage.getResetByPortalToken>>) {
  if (!reset) return undefined;
  return {
    portalToken: reset.portalToken,
    name: reset.name,
    contactMethod: reset.contactMethod,
    intakeAnswers: reset.intakeAnswers,
    status: reset.status === "New" ? "Intake needed" : reset.status,
    riskFlags: reset.riskFlags,
    reply1: reset.reply1,
    followUp: reset.followUp,
    finalPlan: reset.finalPlan,
    submittedAt: reset.submittedAt,
    reply1ReadyAt: reset.reply1ReadyAt,
    followUpReadyAt: reset.followUpReadyAt,
    finalPlanReadyAt: reset.finalPlanReadyAt,
    closedAt: reset.closedAt,
    createdAt: reset.createdAt,
    updatedAt: reset.updatedAt,
  };
}

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
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
      const token = req.params.token;
      if (!token || token.length > 128) {
        return res.status(400).json({ message: "Invalid token" });
      }

      if (isDevReportAccessGranted()) {
        const devExpiry = new Date();
        devExpiry.setMonth(devExpiry.getMonth() + 6);
        return res.json({
          hasAccess: true,
          expiresAt: devExpiry.toISOString(),
          purchasedAt: new Date().toISOString(),
          devGranted: true,
        });
      }

      const sessionEmail = req.session?.email;
      if (sessionEmail && isGrantedAccessEmail(sessionEmail)) {
        const granted = await ensureGrantedProducts(sessionEmail);
        return res.json({
          hasAccess: true,
          expiresAt: granted.expiresAt,
          purchasedAt: new Date().toISOString(),
          granted: true,
        });
      }

      const purchase = await storage.getPurchaseBySessionToken(token);

      if (!purchase) {
        return res.json({ hasAccess: false, reason: "no_purchase" });
      }

      if (!purchaseHasAccess(purchase)) {
        return res.json({
          hasAccess: false,
          reason: new Date(purchase.expiresAt) <= new Date() ? "expired" : "no_purchase",
          expiresAt: purchase.expiresAt,
        });
      }

      if (purchase.email && !req.session?.email) {
        req.session.email = purchase.email;
        await new Promise<void>((resolve) => req.session.save(() => resolve()));
      }

      return res.json({
        hasAccess: true,
        expiresAt: purchase.expiresAt,
        purchasedAt: purchase.purchasedAt,
      });
    } catch (error) {
      console.error("Access check error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/checkout/create", async (req, res) => {
    try {
      const parsed = checkoutCreateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid checkout request" });
      }

      const { sessionToken } = parsed.data;
      const origin = getOrigin(req);
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      const { syncStripeCatalogNames } = await import("./stripeProductSync");
      await syncStripeCatalogNames(stripe);

      const placeholderExpiry = new Date();
      placeholderExpiry.setMonth(placeholderExpiry.getMonth() + 6);

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [buildReportLineItem()],
        mode: "payment",
        success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/unlock`,
        metadata: { product: "report", sessionToken },
        ...buildCheckoutBranding(origin),
      });

      await storage.createPurchase({
        sessionToken,
        stripeSessionId: checkoutSession.id,
        amount: REPORT_PRICE_GBP,
        currency: "gbp",
        status: "pending",
        expiresAt: placeholderExpiry,
      });

      return res.json({ url: checkoutSession.url });
    } catch (error: unknown) {
      console.error("Checkout create error:", error);
      if (stripeNotConfiguredMessage(error)) {
        return res.status(503).json({
          message: "Payment system not configured. Add STRIPE_SECRET_KEY to .env and run npm run stripe:setup.",
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/checkout/verify", async (req, res) => {
    try {
      const parsed = checkoutVerifySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "checkoutSessionId is required" });
      }

      const { checkoutSessionId } = parsed.data;
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);

      if (session.payment_status !== "paid") {
        return res.json({ status: session.payment_status });
      }

      await fulfillCheckoutSession(session, getOrigin(req));

      const updatedPurchase = await storage.getPurchaseByCheckoutSessionId(checkoutSessionId);
      return res.json({
        status: "paid",
        sessionToken: updatedPurchase?.sessionToken,
        expiresAt: updatedPurchase?.expiresAt,
      });
    } catch (error) {
      console.error("Checkout verify error:", error);
      return res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  app.post("/api/auth/send-link", async (req, res) => {
    try {
      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      if (!rateLimit(`magic-link:${clientIp}`, 3, 60 * 60 * 1000)) {
        return res.status(429).json({ message: "Too many attempts. Please try again later." });
      }

      const parsed = z.object({ email: emailSchema }).safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "A valid email address is required." });
      }
      const email = parsed.data.email;

      if (!rateLimit(`magic-link-email:${email}`, 5, 60 * 60 * 1000)) {
        return res.json({ sent: true });
      }

      const purchases = await storage.getPaidPurchasesByEmail(email);
      const validPurchase = purchases.find((p) => purchaseHasAccess(p));
      const granted = isGrantedAccessEmail(email);

      if (!validPurchase && !granted) {
        return res.json({ sent: true });
      }

      if (granted) {
        await ensureGrantedProducts(email);
      }

      const token = randomBytes(48).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await storage.createMagicLink(email, token, expiresAt);
      const emailed = await sendMagicLinkEmail(email, token, getOrigin(req));
      if (!emailed) {
        console.error(`[auth] Magic link not sent to ${email} — RESEND_API_KEY missing or delivery failed`);
      }

      return res.json({ sent: true });
    } catch (error) {
      console.error("Auth send-link error:", error);
      return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
  });

  app.get("/api/auth/verify", async (req, res) => {
    try {
      const token = req.query.token as string | undefined;
      if (!token) {
        return res.redirect("/recover?error=invalid_link");
      }

      const magicLink = await storage.getMagicLinkByToken(token);
      if (!magicLink) {
        return res.redirect("/recover?error=invalid_link");
      }
      if (magicLink.usedAt) {
        return res.redirect("/recover?error=link_used");
      }
      if (new Date() > new Date(magicLink.expiresAt)) {
        return res.redirect("/recover?error=link_expired");
      }

      await storage.useMagicLink(magicLink.id);
      req.session.email = magicLink.email;
      await new Promise<void>((resolve, reject) => req.session.save((err) => (err ? reject(err) : resolve())));

      if (isGrantedAccessEmail(magicLink.email)) {
        const granted = await ensureGrantedProducts(magicLink.email);
        return res.redirect(`/access?token=${encodeURIComponent(granted.sessionToken)}`);
      }

      const purchases = await storage.getPaidPurchasesByEmail(magicLink.email);
      const validPurchase = purchases.find((p) => purchaseHasAccess(p));
      if (!validPurchase) {
        return res.redirect("/unlock?signed_in=1");
      }

      return res.redirect(`/access?token=${encodeURIComponent(validPurchase.sessionToken)}`);
    } catch (error) {
      console.error("Auth verify error:", error);
      return res.redirect("/recover?error=server_error");
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
      if (isDevReportAccessGranted()) {
        const devExpiry = new Date();
        devExpiry.setMonth(devExpiry.getMonth() + 6);
        return res.json({
          authenticated: Boolean(req.session?.email),
          email: req.session?.email,
          hasAccess: true,
          expiresAt: devExpiry.toISOString(),
          devGranted: true,
        });
      }

      const email = req.session?.email;
      if (!email) {
        return res.json({ authenticated: false, hasAccess: false });
      }

      if (isGrantedAccessEmail(email)) {
        const granted = await ensureGrantedProducts(email);
        return res.json({
          authenticated: true,
          email,
          hasAccess: true,
          expiresAt: granted.expiresAt,
          purchasedAt: new Date().toISOString(),
          sessionToken: granted.sessionToken,
          resetPortalUrl: granted.resetPortalUrl,
          granted: true,
        });
      }

      const purchases = await storage.getPaidPurchasesByEmail(email);
      const validPurchase = purchases.find((p) => purchaseHasAccess(p));
      if (!validPurchase) {
        return res.json({ authenticated: true, email, hasAccess: false });
      }

      return res.json({
        authenticated: true,
        email,
        hasAccess: true,
        expiresAt: validPurchase.expiresAt,
        purchasedAt: validPurchase.purchasedAt,
        sessionToken: validPurchase.sessionToken,
      });
    } catch (error) {
      console.error("Auth me error:", error);
      return res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("rruk.sid");
      res.json({ success: true });
    });
  });

  app.post("/api/access/recover-by-order", async (req, res) => {
    try {
      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      if (!rateLimit(`recover-order:${clientIp}`, 3, 60 * 60 * 1000)) {
        return res.status(429).json({ message: "Too many attempts. Please try again later." });
      }

      const parsed = z.object({ checkoutSessionId: z.string().min(5) }).safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Valid order reference required" });
      }

      const purchase = await storage.getPurchaseByCheckoutSessionId(parsed.data.checkoutSessionId.trim());
      if (!purchase || !purchaseHasAccess(purchase)) {
        return res.json({ found: false });
      }

      if (!purchase.email) {
        return res.json({ found: true, noEmail: true });
      }

      sendPurchaseConfirmationEmail(purchase.email, purchase.sessionToken, purchase.expiresAt, getOrigin(req)).catch(console.error);
      return res.json({
        found: true,
        emailSent: true,
        maskedEmail: purchase.email.replace(/^(.)(.+?)(@.+)$/, (_, a, b, c) => a + "*".repeat(Math.min(b.length, 4)) + c),
      });
    } catch (error) {
      console.error("Recover by order error:", error);
      return res.status(500).json({ message: "Failed to recover access" });
    }
  });

  app.post("/api/report-access-email", async (req, res) => {
    try {
      const parsed = reportAccessEmailBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid report access email", errors: parsed.error.issues });
      }

      const { sessionToken, email, inputs } = parsed.data;
      let session = await storage.getSessionByToken(sessionToken);
      if (!session) {
        session = await storage.createSession({ sessionToken, email });
      } else {
        await storage.updateSessionEmail(sessionToken, email);
      }

      if (inputs) {
        await storage.createCalculation({ sessionToken, inputs });
      }

      const link = `${getOrigin(req)}/access?token=${encodeURIComponent(sessionToken)}`;
      const delivery = await sendAccessLinksEmail(email, [link], []);

      return res.json({
        success: true,
        emailSent: delivery,
        message: delivery
          ? "Report access link sent."
          : "Report access link saved. Email delivery is not configured.",
        reportAccessUrl: link,
      });
    } catch (error) {
      console.error("Report access email error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/recover-access", async (req, res) => {
    try {
      const parsed = recoverAccessBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid recovery email", errors: parsed.error.issues });
      }

      const { email } = parsed.data;
      const origin = getOrigin(req);

      const purchases = await storage.getPaidPurchasesByEmail(email);
      const validPurchase = purchases.find((p) => purchaseHasAccess(p));
      if (validPurchase) {
        const token = randomBytes(48).toString("hex");
        await storage.createMagicLink(email, token, new Date(Date.now() + 60 * 60 * 1000));
        const emailed = await sendMagicLinkEmail(email, token, origin);
        if (!emailed) {
          console.error(`[recover] Magic link not sent to ${email} — check Resend`);
        }
        return res.json({
          success: true,
          emailSent: emailed,
          message: emailed
            ? "If we found a paid report for that email, a sign-in link is on its way."
            : "Access found but email could not be sent. Try again shortly or contact support.",
          reportLinks: [],
          resetLinks: [],
        });
      }

      if (isGrantedAccessEmail(email)) {
        const granted = await ensureGrantedProducts(email);
        const token = randomBytes(48).toString("hex");
        await storage.createMagicLink(email, token, new Date(Date.now() + 60 * 60 * 1000));
        const emailed = await sendMagicLinkEmail(email, token, origin);
        if (!emailed) {
          console.error(`[recover] Granted magic link not sent to ${email} — check Resend`);
        }
        const reportLink = `${origin}/access?token=${encodeURIComponent(granted.sessionToken)}`;
        const resetLink = `${origin}${granted.resetPortalUrl}`;
        return res.json({
          success: true,
          emailSent: emailed,
          message: emailed
            ? "Sign-in link sent. Your report and Reset portal access are ready."
            : "Access is ready but email could not be sent. Try again shortly or contact support.",
          reportLinks: [reportLink],
          resetLinks: [resetLink],
        });
      }

      const sessions = await storage.getSessionsByEmail(email);
      const reportLinks = sessions.map((session) => `${origin}/access?token=${encodeURIComponent(session.sessionToken)}`);
      const resets = await storage.getResetsByEmail(email);
      const resetLinks = resets
        .filter((reset) => reset.portalToken)
        .map((reset) => `${origin}/redundancy-reset/portal/${reset.portalToken}`);

      if (reportLinks.length === 0 && resetLinks.length === 0) {
        return res.json({
          success: true,
          emailSent: false,
          message: "No report or Reset portal links were found for that email. For paid report access, use the email from checkout.",
          reportLinks: [],
          resetLinks: [],
        });
      }

      const delivery = await sendAccessLinksEmail(email, reportLinks, resetLinks);

      return res.json({
        success: true,
        emailSent: delivery,
        message: delivery ? "Access links sent." : "Access links found. Email delivery is not configured.",
        reportLinks,
        resetLinks,
      });
    } catch (error) {
      console.error("Recover access error:", error);
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
      const { syncStripeCatalogNames } = await import("./stripeProductSync");
      await syncStripeCatalogNames(stripe);

      const origin = getOrigin(req);
      const sessionToken = parsed.data.sessionToken;
      const portalToken = createPortalToken();

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [buildResetLineItem()],
        mode: "payment",
        success_url: `${origin}/redundancy-reset/intake?session_id={CHECKOUT_SESSION_ID}&portal_token=${portalToken}${sessionToken ? `&token=${sessionToken}` : ""}`,
        cancel_url: `${origin}/redundancy-reset`,
        metadata: {
          product: "reset",
          sessionToken: sessionToken ?? "",
          portalToken,
        },
        ...buildCheckoutBranding(origin),
      });

      // Pre-create a server-side pending record so the stripeSessionId is known
      // and cannot be forged by a client later submitting intake.
      await storage.createPendingReset(checkoutSession.id, portalToken, sessionToken);

      return res.json({ url: checkoutSession.url, sessionId: checkoutSession.id, portalToken });
    } catch (error: unknown) {
      console.error("Reset checkout error:", error);
      if (stripeNotConfiguredMessage(error)) {
        return res.status(503).json({
          message: "Payment system not configured. Add STRIPE_SECRET_KEY to .env and run npm run stripe:setup.",
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // POST /api/stripe-webhook
  // Handles checkout.session.completed and checkout.session.async_payment_succeeded.
  // Webhook secret: STRIPE_WEBHOOK_SECRET in .env, or Replit connector fallback.
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const sig = req.headers["stripe-signature"] as string;
      const rawBody = (req as { rawBody?: Buffer }).rawBody;

      if (!sig || !rawBody) {
        return res.status(400).json({ message: "Missing signature or body" });
      }

      const { getWebhookSecret, getUncachableStripeClient } = await import("./stripeClient");

      const webhookSecret = await getWebhookSecret();
      if (!webhookSecret) {
        console.error("Stripe webhook secret missing. Set STRIPE_WEBHOOK_SECRET or use stripe listen locally.");
        return res.status(500).json({ message: "Webhook configuration error — no webhook secret" });
      }

      const stripe = await getUncachableStripeClient();
      let event: { type: string; data: { object: import("stripe").Stripe.Checkout.Session } };
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret) as typeof event;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "verification failed";
        console.error("Webhook signature verification failed:", message);
        return res.status(400).json({ message: "Webhook signature verification failed" });
      }

      if (isHandledWebhookEvent(event.type)) {
        const origin = getOrigin(req);
        await fulfillCheckoutSession(event.data.object, origin);
      } else {
        console.log(`Stripe webhook ignored: ${event.type}`);
      }

      return res.json({ received: true });
    } catch (error) {
      console.error("Stripe webhook error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET /api/stripe/webhook-info — documents required webhook config (no secrets).
  app.get("/api/stripe/webhook-info", (_req, res) => {
    res.json({
      endpoint: "/api/stripe-webhook",
      events: STRIPE_WEBHOOK_EVENTS,
      localCli: "stripe listen --forward-to localhost:5000/api/stripe-webhook",
    });
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

      const { stripeSessionId, name, email, contactMethod, intakeAnswers } = parsed.data;

      // Verify this stripeSessionId was created by us (server-side) during checkout
      const existingReset = await storage.getResetByStripeSessionId(stripeSessionId);
      if (!existingReset) {
        return res.status(403).json({ message: "Checkout session not found. Please complete payment first." });
      }

      // If not yet marked paid by webhook, verify directly with Stripe API.
      // This gate is fail-closed: if verification cannot confirm payment, intake is rejected.
      if (existingReset.paid !== "paid") {
        let verified = false;
        let verifyError: string | undefined;

        try {
          const { getUncachableStripeClient } = await import("./stripeClient");
          const stripe = await getUncachableStripeClient();
          const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
          const result = await fulfillCheckoutSession(session, getOrigin(req));
          if (result.fulfilled && result.product === "reset") {
            verified = true;
          } else if (session.payment_status === "paid") {
            verified = true;
          } else {
            verifyError = "Payment not yet confirmed. Please wait a moment and try again.";
          }
        } catch (stripeError: unknown) {
          const message = stripeError instanceof Error ? stripeError.message : "unknown error";
          console.error("Stripe verification failed during intake submission:", message);
          verifyError = "Payment verification is temporarily unavailable. Please try again in a moment.";
        }

        if (!verified) {
          return res.status(402).json({ message: verifyError ?? "Payment not confirmed." });
        }
      }

      // Update the server-created record with actual intake data
      await storage.updateResetIntake(stripeSessionId, { name, email, contactMethod, intakeAnswers });

      const updatedReset = await storage.getResetByStripeSessionId(stripeSessionId);
      return res.json({
        reset: updatedReset,
        portalUrl: updatedReset?.portalToken ? `/redundancy-reset/portal/${updatedReset.portalToken}` : undefined,
      });
    } catch (error) {
      console.error("Create reset error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/resets", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const allResets = await storage.getResets();
      return res.json({ resets: allResets });
    } catch (error) {
      console.error("Get resets error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/reset-portal/:portalToken", async (req, res) => {
    try {
      const portalToken = req.params.portalToken;
      if (!portalToken || portalToken.length > 128) {
        return res.status(400).json({ message: "Invalid portal link" });
      }

      const reset = await storage.getResetByPortalToken(portalToken);
      if (!reset) {
        return res.status(404).json({ message: "Reset portal not found" });
      }

      return res.json({ reset: toPublicReset(reset) });
    } catch (error) {
      console.error("Get reset portal error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/resets/:id", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const parsed = resetFulfilmentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid reset update", errors: parsed.error.issues });
      }

      await storage.updateResetFulfilment(id, parsed.data);
      return res.json({ success: true });
    } catch (error) {
      console.error("Update reset error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/brief-config", (_req, res) => {
    res.json({ aiMode: getBriefAiMode() });
  });

  app.post("/api/package-maximiser-insights", async (req, res) => {
    try {
      const parsed = calculationBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request payload", errors: parsed.error.flatten() });
      }

      const { sessionToken, inputs } = parsed.data;

      if (!isDevReportAccessGranted()) {
        const purchase = await storage.getPurchaseBySessionToken(sessionToken);
        if (!purchase || (purchase.status !== "paid" && purchase.status !== "completed")) {
          return res.status(403).json({ message: "No active purchase found for this session." });
        }
        if (purchase.expiresAt && new Date() > new Date(purchase.expiresAt)) {
          return res.status(403).json({ message: "Your access has expired. Please renew to use this feature." });
        }
      }

      const insights = buildMaximiserInsights(inputs);
      return res.json({ insights, generatedAt: new Date().toISOString() });
    } catch (error) {
      console.error("Package maximiser insights error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/private-runway-brief", async (req, res) => {
    try {
      const aiMode = getBriefAiMode();
      if (aiMode === "off") {
        return res.status(400).json({
          message: "AI enhancement is disabled. Your report is built from expert templates and your figures.",
        });
      }

      if (!openai) {
        return res.status(503).json({ message: "Brief generation is not configured. Please try again later." });
      }

      const parsed = privateRunwayBriefRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request payload", errors: parsed.error.flatten() });
      }

      const { sessionToken, payload } = parsed.data;

      if (!isDevReportAccessGranted()) {
        const purchase = await storage.getPurchaseBySessionToken(sessionToken);
        if (!purchase || (purchase.status !== "paid" && purchase.status !== "completed")) {
          return res.status(403).json({ message: "No active purchase found for this session." });
        }
        if (purchase.expiresAt && new Date() > new Date(purchase.expiresAt)) {
          return res.status(403).json({ message: "Your access has expired. Please renew to use this feature." });
        }
      }

      const rlKey = `private-runway-brief:${sessionToken}`;
      if (!rateLimit(rlKey, 3, 60 * 60 * 1000)) {
        return res.status(429).json({
          message: "You have generated too many briefs recently. Please try again in an hour.",
        });
      }

      if (aiMode === "lite") {
        const allowedThemeKeys = payload.executiveSummaryThemeKeys;
        const userPrompt = buildPrivateRunwayBriefLiteUserPrompt(payload, allowedThemeKeys);
        const response = await openai.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [
            { role: "system", content: PRIVATE_RUNWAY_BRIEF_LITE_SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.35,
          max_tokens: 800,
          response_format: { type: "json_object" },
        });

        const raw = response.choices[0]?.message?.content;
        if (!raw) {
          return res.status(502).json({ message: "The brief service returned an empty response. Please try again." });
        }

        let liteData: unknown;
        try {
          liteData = JSON.parse(raw);
        } catch {
          return res.status(502).json({ message: "The brief service returned an unexpected format. Please try again." });
        }

        const parsedLite = briefNarrativeLiteSchema.safeParse(liteData);
        if (!parsedLite.success) {
          console.error("Brief lite validation failed:", parsedLite.error.flatten());
          return res.status(502).json({ message: "The brief was incomplete. Please try again." });
        }

        const compliance = validateBriefNarrativeLite(parsedLite.data);
        if (!compliance.ok) {
          console.error("Brief lite compliance failed:", compliance.violations);
          return res.status(502).json({ message: "The brief summary did not pass compliance checks. Please try again." });
        }

        return res.json({
          narrativeLite: {
            ...parsedLite.data,
            generatedAt: new Date().toISOString(),
            aiEnhanced: true,
          },
          aiMode: "lite",
        });
      }

      const userPrompt = buildPrivateRunwayBriefUserPrompt(payload);

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: PRIVATE_RUNWAY_BRIEF_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });

      const raw = response.choices[0]?.message?.content;
      if (!raw) {
        return res.status(502).json({ message: "The brief service returned an empty response. Please try again." });
      }

      let narrativeData: unknown;
      try {
        narrativeData = JSON.parse(raw);
      } catch {
        return res.status(502).json({ message: "The brief service returned an unexpected format. Please try again." });
      }

      const parsedNarrative = privateRunwayBriefNarrativeSchema.safeParse(narrativeData);
      if (!parsedNarrative.success) {
        console.error("Brief narrative validation failed:", parsedNarrative.error.flatten());
        return res.status(502).json({ message: "The brief was incomplete. Please try again." });
      }

      return res.json({
        narrative: {
          ...parsedNarrative.data,
          confidence: payload.confidence,
          generatedAt: new Date().toISOString(),
          disclaimer: PRIVATE_RUNWAY_BRIEF_DISCLAIMER,
        },
        aiMode: "legacy",
      });
    } catch (err: unknown) {
      console.error("Private runway brief error:", err);
      if (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 429) {
        return res.status(429).json({ message: "The brief service is busy. Please try again in a moment." });
      }
      return res.status(502).json({ message: "Something went wrong generating your brief. Please try again." });
    }
  });

  app.post("/api/gdpr/delete", async (req, res) => {
    try {
      const clientIp = req.ip || "unknown";
      if (!rateLimit(`gdpr:${clientIp}`, 3, 60 * 60 * 1000)) {
        return res.status(429).json({ message: "Too many requests. Please try again later." });
      }

      const parsed = z.object({ email: emailSchema }).safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Valid email address required" });
      }

      await storage.deletePersonalDataByEmail(parsed.data.email);
      console.log("[gdpr] Data deletion request processed");
      return res.json({ success: true, message: "All personal data for this email has been removed." });
    } catch (error) {
      console.error("GDPR delete error:", error);
      return res.status(500).json({ message: "Failed to process deletion request" });
    }
  });

  return httpServer;
}
