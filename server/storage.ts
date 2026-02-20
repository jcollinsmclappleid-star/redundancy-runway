import { db } from "./db";
import { sessions, purchases, calculations } from "@shared/schema";
import type { Session, InsertSession, Purchase, InsertPurchase, Calculation, InsertCalculation } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getSessionByToken(token: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  getPurchaseBySessionToken(token: string): Promise<Purchase | undefined>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  updatePurchaseStatus(sessionToken: string, status: string): Promise<void>;
  createCalculation(calc: InsertCalculation): Promise<Calculation>;
  getCalculationsBySessionToken(token: string): Promise<Calculation[]>;
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
}

export const storage = new DatabaseStorage();
