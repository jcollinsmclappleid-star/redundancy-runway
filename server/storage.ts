import { db } from "./db";
import { sessions, purchases, calculations, resets } from "@shared/schema";
import type { Session, InsertSession, Purchase, InsertPurchase, Calculation, InsertCalculation, Reset, InsertReset } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getSessionByToken(token: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  getPurchaseBySessionToken(token: string): Promise<Purchase | undefined>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  updatePurchaseStatus(sessionToken: string, status: string): Promise<void>;
  createCalculation(calc: InsertCalculation): Promise<Calculation>;
  getCalculationsBySessionToken(token: string): Promise<Calculation[]>;
  createReset(reset: InsertReset): Promise<Reset>;
  getResets(): Promise<Reset[]>;
  getResetByStripeSessionId(stripeSessionId: string): Promise<Reset | undefined>;
  updateResetStatus(id: string, status: string): Promise<void>;
  updateResetNotes(id: string, adminNotes: string): Promise<void>;
  updateResetPaid(stripeSessionId: string, paid: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getSessionByToken(token: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.sessionToken, token));
    return session;
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [created] = await db.insert(sessions).values(session).returning();
    return created;
  }

  async getPurchaseBySessionToken(token: string): Promise<Purchase | undefined> {
    const [purchase] = await db
      .select()
      .from(purchases)
      .where(eq(purchases.sessionToken, token))
      .orderBy(desc(purchases.createdAt))
      .limit(1);
    return purchase;
  }

  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const [created] = await db.insert(purchases).values(purchase).returning();
    return created;
  }

  async updatePurchaseStatus(sessionToken: string, status: string): Promise<void> {
    await db.update(purchases).set({ status }).where(eq(purchases.sessionToken, sessionToken));
  }

  async createCalculation(calc: InsertCalculation): Promise<Calculation> {
    const [created] = await db.insert(calculations).values(calc).returning();
    return created;
  }

  async getCalculationsBySessionToken(token: string): Promise<Calculation[]> {
    return db.select().from(calculations).where(eq(calculations.sessionToken, token));
  }

  async createReset(reset: InsertReset): Promise<Reset> {
    const [created] = await db.insert(resets).values(reset).returning();
    return created;
  }

  async getResets(): Promise<Reset[]> {
    return db.select().from(resets).orderBy(desc(resets.createdAt));
  }

  async getResetByStripeSessionId(stripeSessionId: string): Promise<Reset | undefined> {
    const [reset] = await db.select().from(resets).where(eq(resets.stripeSessionId, stripeSessionId));
    return reset;
  }

  async updateResetStatus(id: string, status: string): Promise<void> {
    await db.update(resets).set({ status, updatedAt: new Date() }).where(eq(resets.id, id));
  }

  async updateResetNotes(id: string, adminNotes: string): Promise<void> {
    await db.update(resets).set({ adminNotes, updatedAt: new Date() }).where(eq(resets.id, id));
  }

  async updateResetPaid(stripeSessionId: string, paid: string): Promise<void> {
    await db.update(resets).set({ paid, updatedAt: new Date() }).where(eq(resets.stripeSessionId, stripeSessionId));
  }
}

export const storage = new DatabaseStorage();
