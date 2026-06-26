import { db } from "./db";
import { sessions, purchases, calculations, resets, magicLinks } from "@shared/schema";
import type { Session, InsertSession, Purchase, InsertPurchase, Calculation, InsertCalculation, Reset, MagicLink } from "@shared/schema";
import { eq, and, desc, inArray, sql } from "drizzle-orm";

export interface ResetFulfilmentUpdate {
  status?: string;
  riskFlags?: Record<string, unknown>;
  reply1?: Record<string, unknown>;
  followUp?: Record<string, unknown>;
  finalPlan?: Record<string, unknown>;
  boundaryChecklist?: Record<string, unknown>;
  adminNotes?: string;
}

function isPaidStatus(status: string) {
  return status === "paid" || status === "completed";
}

export interface IStorage {
  getSessionByToken(token: string): Promise<Session | undefined>;
  getSessionsByEmail(email: string): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSessionEmail(sessionToken: string, email: string): Promise<void>;
  getPurchaseBySessionToken(token: string): Promise<Purchase | undefined>;
  getPurchaseByCheckoutSessionId(checkoutSessionId: string): Promise<Purchase | undefined>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  markPurchasePaid(id: string, paymentIntentId: string, email: string | null): Promise<Purchase>;
  getPaidPurchasesByEmail(email: string): Promise<Purchase[]>;
  createMagicLink(email: string, token: string, expiresAt: Date): Promise<MagicLink>;
  getMagicLinkByToken(token: string): Promise<MagicLink | undefined>;
  useMagicLink(id: string): Promise<MagicLink>;
  createCalculation(calc: InsertCalculation): Promise<Calculation>;
  getCalculationsBySessionToken(token: string): Promise<Calculation[]>;
  createPendingReset(stripeSessionId: string, portalToken: string, sessionToken?: string): Promise<Reset>;
  createGrantedReset(email: string, portalToken: string): Promise<Reset>;
  getResetByStripeSessionId(stripeSessionId: string): Promise<Reset | undefined>;
  getResetByPortalToken(portalToken: string): Promise<Reset | undefined>;
  getResetsByEmail(email: string): Promise<Reset[]>;
  updateResetIntake(stripeSessionId: string, data: { name: string; email?: string; contactMethod: string; intakeAnswers: Record<string, unknown> }): Promise<void>;
  getResets(): Promise<Reset[]>;
  updateResetFulfilment(id: string, data: ResetFulfilmentUpdate): Promise<void>;
  updateResetPaid(stripeSessionId: string, paid: string): Promise<void>;
  deletePersonalDataByEmail(email: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getSessionByToken(token: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.sessionToken, token));
    return session;
  }

  async getSessionsByEmail(email: string): Promise<Session[]> {
    return db.select().from(sessions).where(eq(sessions.email, email.toLowerCase().trim()));
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [created] = await db.insert(sessions).values(session).returning();
    return created;
  }

  async updateSessionEmail(sessionToken: string, email: string): Promise<void> {
    await db.update(sessions).set({ email: email.toLowerCase().trim() }).where(eq(sessions.sessionToken, sessionToken));
  }

  async getPurchaseBySessionToken(token: string): Promise<Purchase | undefined> {
    const rows = await db
      .select()
      .from(purchases)
      .where(eq(purchases.sessionToken, token))
      .orderBy(desc(purchases.createdAt));
    return rows.find((p) => isPaidStatus(p.status));
  }

  async getPurchaseByCheckoutSessionId(checkoutSessionId: string): Promise<Purchase | undefined> {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.stripeSessionId, checkoutSessionId));
    return purchase;
  }

  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const [created] = await db.insert(purchases).values(purchase).returning();
    return created;
  }

  async markPurchasePaid(id: string, paymentIntentId: string, email: string | null): Promise<Purchase> {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 6);

    const [updated] = await db
      .update(purchases)
      .set({
        status: "paid",
        stripePaymentIntentId: paymentIntentId,
        email: email?.toLowerCase().trim() ?? null,
        purchasedAt: now,
        expiresAt,
      })
      .where(eq(purchases.id, id))
      .returning();
    return updated;
  }

  async getPaidPurchasesByEmail(email: string): Promise<Purchase[]> {
    const normalized = email.toLowerCase().trim();
    const rows = await db
      .select()
      .from(purchases)
      .where(eq(purchases.email, normalized))
      .orderBy(desc(purchases.purchasedAt));
    return rows.filter((p) => isPaidStatus(p.status));
  }

  async createMagicLink(email: string, token: string, expiresAt: Date): Promise<MagicLink> {
    const [created] = await db
      .insert(magicLinks)
      .values({ email: email.toLowerCase().trim(), token, expiresAt })
      .returning();
    return created;
  }

  async getMagicLinkByToken(token: string): Promise<MagicLink | undefined> {
    const [link] = await db.select().from(magicLinks).where(eq(magicLinks.token, token));
    return link;
  }

  async useMagicLink(id: string): Promise<MagicLink> {
    const [updated] = await db
      .update(magicLinks)
      .set({ usedAt: new Date() })
      .where(eq(magicLinks.id, id))
      .returning();
    return updated;
  }

  async createCalculation(calc: InsertCalculation): Promise<Calculation> {
    const [created] = await db.insert(calculations).values(calc).returning();
    return created;
  }

  async getCalculationsBySessionToken(token: string): Promise<Calculation[]> {
    return db
      .select()
      .from(calculations)
      .where(eq(calculations.sessionToken, token))
      .orderBy(desc(calculations.createdAt));
  }

  async createPendingReset(stripeSessionId: string, portalToken: string, sessionToken?: string): Promise<Reset> {
    const [created] = await db
      .insert(resets)
      .values({
        stripeSessionId,
        portalToken,
        sessionToken: sessionToken ?? null,
        name: "[Pending checkout]",
        contactMethod: "webchat",
        intakeAnswers: {},
        status: "Intake needed",
        paid: "pending",
      })
      .returning();
    return created;
  }

  async createGrantedReset(email: string, portalToken: string): Promise<Reset> {
    const normalized = email.toLowerCase().trim();
    const [created] = await db
      .insert(resets)
      .values({
        stripeSessionId: `granted-reset:${portalToken.slice(0, 16)}`,
        portalToken,
        email: normalized,
        name: normalized.split("@")[0] || "Granted access",
        contactMethod: "webchat",
        intakeAnswers: {},
        status: "Intake needed",
        paid: "paid",
      })
      .returning();
    return created;
  }

  async getResetByStripeSessionId(stripeSessionId: string): Promise<Reset | undefined> {
    const [reset] = await db.select().from(resets).where(eq(resets.stripeSessionId, stripeSessionId));
    return reset;
  }

  async getResetByPortalToken(portalToken: string): Promise<Reset | undefined> {
    const [reset] = await db.select().from(resets).where(eq(resets.portalToken, portalToken));
    return reset;
  }

  async getResetsByEmail(email: string): Promise<Reset[]> {
    return db
      .select()
      .from(resets)
      .where(eq(resets.email, email.toLowerCase().trim()))
      .orderBy(desc(resets.createdAt));
  }

  async updateResetIntake(
    stripeSessionId: string,
    data: { name: string; email?: string; contactMethod: string; intakeAnswers: Record<string, unknown> }
  ): Promise<void> {
    await db
      .update(resets)
      .set({
        name: data.name,
        email: data.email?.toLowerCase().trim(),
        contactMethod: data.contactMethod,
        intakeAnswers: data.intakeAnswers,
        status: "Intake submitted",
        submittedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(resets.stripeSessionId, stripeSessionId));
  }

  async getResets(): Promise<Reset[]> {
    return db.select().from(resets).orderBy(desc(resets.createdAt));
  }

  async updateResetFulfilment(id: string, data: ResetFulfilmentUpdate): Promise<void> {
    const now = new Date();
    const patch: Partial<typeof resets.$inferInsert> = { updatedAt: now };

    if (data.status !== undefined) {
      patch.status = data.status;
      if (data.status === "Reply 1 ready") patch.reply1ReadyAt = now;
      if (data.status === "Follow-up check-in ready") patch.followUpReadyAt = now;
      if (data.status === "Final plan ready") patch.finalPlanReadyAt = now;
      if (data.status === "Closed") patch.closedAt = now;
    }
    if (data.riskFlags !== undefined) patch.riskFlags = data.riskFlags;
    if (data.reply1 !== undefined) patch.reply1 = data.reply1;
    if (data.followUp !== undefined) patch.followUp = data.followUp;
    if (data.finalPlan !== undefined) patch.finalPlan = data.finalPlan;
    if (data.boundaryChecklist !== undefined) patch.boundaryChecklist = data.boundaryChecklist;
    if (data.adminNotes !== undefined) patch.adminNotes = data.adminNotes;

    await db.update(resets).set(patch).where(eq(resets.id, id));
  }

  async updateResetPaid(stripeSessionId: string, paid: string): Promise<void> {
    await db.update(resets).set({ paid, updatedAt: new Date() }).where(eq(resets.stripeSessionId, stripeSessionId));
  }

  async deletePersonalDataByEmail(email: string): Promise<void> {
    const normalized = email.toLowerCase().trim();
    const userSessions = await this.getSessionsByEmail(normalized);
    const sessionTokens = userSessions.map((s) => s.sessionToken);

    await db.update(purchases).set({ email: null }).where(eq(purchases.email, normalized));
    await db.delete(magicLinks).where(eq(magicLinks.email, normalized));
    await db.update(sessions).set({ email: null }).where(eq(sessions.email, normalized));

    if (sessionTokens.length > 0) {
      await db.delete(calculations).where(inArray(calculations.sessionToken, sessionTokens));
    }

    await db
      .update(resets)
      .set({
        email: null,
        name: "[removed]",
        intakeAnswers: {},
        adminNotes: null,
        updatedAt: new Date(),
      })
      .where(eq(resets.email, normalized));

    await db.execute(sql`DELETE FROM user_sessions WHERE sess->>'email' = ${normalized}`);
  }
}

export const storage = new DatabaseStorage();
