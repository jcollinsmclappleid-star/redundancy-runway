import { createHash, randomBytes } from "crypto";
import { storage } from "./storage";
import { REPORT_PRICE_GBP } from "./stripeConfig";

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function isGrantedAccessEmail(email: string): boolean {
  const raw = process.env.GRANTED_ACCESS_EMAILS?.trim();
  if (!raw) return false;
  const normalized = normalizeEmail(email);
  return raw
    .split(",")
    .map((entry) => normalizeEmail(entry))
    .filter(Boolean)
    .includes(normalized);
}

function grantedPurchaseStripeId(email: string): string {
  return `granted:${createHash("sha256").update(normalizeEmail(email)).digest("hex").slice(0, 32)}`;
}

function grantedResetPortalToken(email: string): string {
  return `grant-${createHash("sha256").update(`reset:${normalizeEmail(email)}`).digest("hex").slice(0, 40)}`;
}

function purchaseHasAccess(purchase: { status: string; expiresAt: Date }) {
  const paid = purchase.status === "paid" || purchase.status === "completed";
  return paid && new Date(purchase.expiresAt) > new Date();
}

async function resolveSessionToken(email: string): Promise<string> {
  const sessions = await storage.getSessionsByEmail(email);
  if (sessions[0]?.sessionToken) return sessions[0].sessionToken;
  const sessionToken = randomBytes(32).toString("hex");
  await storage.createSession({ sessionToken, email: normalizeEmail(email) });
  return sessionToken;
}

export async function ensureGrantedReportAccess(email: string): Promise<{
  sessionToken: string;
  expiresAt: string;
}> {
  const normalized = normalizeEmail(email);
  const existingPaid = (await storage.getPaidPurchasesByEmail(normalized)).find((p) =>
    purchaseHasAccess(p),
  );
  if (existingPaid) {
    return {
      sessionToken: existingPaid.sessionToken,
      expiresAt: new Date(existingPaid.expiresAt).toISOString(),
    };
  }

  const grantedId = grantedPurchaseStripeId(normalized);
  const byGrantedId = await storage.getPurchaseByCheckoutSessionId(grantedId);
  if (byGrantedId && purchaseHasAccess(byGrantedId)) {
    return {
      sessionToken: byGrantedId.sessionToken,
      expiresAt: new Date(byGrantedId.expiresAt).toISOString(),
    };
  }

  const sessionToken = await resolveSessionToken(normalized);
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 6);
  const now = new Date();

  await storage.createPurchase({
    sessionToken,
    stripeSessionId: grantedId,
    email: normalized,
    amount: REPORT_PRICE_GBP,
    currency: "gbp",
    status: "paid",
    purchasedAt: now,
    expiresAt,
  });

  return { sessionToken, expiresAt: expiresAt.toISOString() };
}

export async function ensureGrantedResetAccess(email: string): Promise<string> {
  const normalized = normalizeEmail(email);
  const existing = (await storage.getResetsByEmail(normalized)).find(
    (reset) => reset.paid === "paid" && reset.portalToken,
  );
  if (existing?.portalToken) return existing.portalToken;

  const portalToken = grantedResetPortalToken(normalized);
  const byToken = await storage.getResetByPortalToken(portalToken);
  if (byToken?.portalToken) return byToken.portalToken;

  const created = await storage.createGrantedReset(normalized, portalToken);
  return created.portalToken ?? portalToken;
}

export async function ensureGrantedProducts(email: string): Promise<{
  sessionToken: string;
  expiresAt: string;
  resetPortalUrl: string;
}> {
  const report = await ensureGrantedReportAccess(email);
  const portalToken = await ensureGrantedResetAccess(email);
  return {
    ...report,
    resetPortalUrl: `/redundancy-reset/portal/${portalToken}`,
  };
}
