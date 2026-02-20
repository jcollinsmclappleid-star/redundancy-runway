import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionToken: text("session_token").notNull().unique(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionToken: text("session_token").notNull(),
  stripeSessionId: text("stripe_session_id"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("gbp"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const calculations = pgTable("calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionToken: text("session_token").notNull(),
  inputs: jsonb("inputs").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true, createdAt: true });
export const insertPurchaseSchema = createInsertSchema(purchases).omit({ id: true, createdAt: true });
export const insertCalculationSchema = createInsertSchema(calculations).omit({ id: true, createdAt: true });

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;

export const contextSchema = z.object({
  employmentStatus: z.enum(["redundant", "at_risk", "other_disruption"]).default("redundant"),
  housingType: z.enum(["mortgage", "renting", "owned_outright", "other"]).default("mortgage"),
  householdStructure: z.enum(["single", "couple", "family"]).default("single"),
  hasDependents: z.boolean().default(false),
  confidenceLevel: z.enum(["comfortable", "uncertain", "under_pressure"]).default("uncertain"),
});

export type ContextInputs = z.infer<typeof contextSchema>;

export const redundancyPackageSchema = z.object({
  age: z.number().int().min(16).max(100).default(35),
  yearsOfService: z.number().min(0).max(20).default(5),
  weeklyGrossPay: z.number().min(0).default(0),
  noticeWeeks: z.number().min(0).max(52).default(0),
  holidayWeeks: z.number().min(0).max(10).default(0),
  enhancedPackage: z.boolean().default(false),
  enhancedAmount: z.number().min(0).default(0),
  useManualOverride: z.boolean().default(false),
  manualOverrideAmount: z.number().min(0).default(0),
});

export type RedundancyPackageInputs = z.infer<typeof redundancyPackageSchema>;

export const runwayInputSchema = z.object({
  context: contextSchema.default({}),
  redundancyPackage: redundancyPackageSchema.default({}),

  cashSavings: z.number().min(0),
  liquidInvestments: z.number().min(0),
  otherOneOffIncome: z.number().min(0).default(0),

  currentMonthlyNetIncome: z.number().min(0),
  replacementMonthlyIncome: z.number().min(0).default(0),
  monthsUntilNewJob: z.number().int().min(0).max(60).default(0),
  benefitSupportEstimate: z.number().min(0).default(0),

  mortgageOrRent: z.number().min(0),
  utilities: z.number().min(0),
  food: z.number().min(0),
  insurance: z.number().min(0).default(0),
  transport: z.number().min(0).default(0),
  debtRepayments: z.number().min(0).default(0),
  childcare: z.number().min(0).default(0),
  otherEssential: z.number().min(0).default(0),

  subscriptions: z.number().min(0).default(0),
  leisure: z.number().min(0).default(0),
  travel: z.number().min(0).default(0),
  discretionaryOther: z.number().min(0).default(0),

  includeNonEssential: z.boolean().default(true),

  emergencyBuffer: z.number().min(0).default(5000),
  sector: z.string().default("all"),

  mortgageSensitivityPercent: z.number().min(0).max(100).default(0),
});

export type RunwayInputs = z.infer<typeof runwayInputSchema>;

export interface MonthProjection {
  month: number;
  capital: number;
  income: number;
  expenses: number;
  netBurn: number;
  milestones: string[];
}

export interface StabilityExplanation {
  runwayMonths: number;
  housingPercent: number;
  debtPercent: number;
  gapIncomePercent: number;
  capitalCoverMonths: number;
  nonEssentialPercent: number;
  factors: string[];
}

export interface CapitalRecovery {
  recoveryMonth: number | null;
  rebuildDuration: number | null;
  capitalAt12MonthsPostReemployment: number;
  recovers: boolean;
}

export interface MortgageSensitivityResult {
  label: string;
  increasePercent: number;
  adjustedRunway: number;
  difference: number;
  newHousingCost: number;
}

export interface RedundancyEstimate {
  statutoryRedundancy: number;
  noticePay: number;
  holidayPay: number;
  totalEstimated: number;
  taxFreeThreshold: number;
}

export interface RunwayResult {
  monthsUntilDepletion: number;
  capitalAfter3Months: number;
  capitalAfter6Months: number;
  capitalAfter12Months: number;
  startingCapital: number;
  monthlyBurn: number;
  essentialExpenses: number;
  nonEssentialExpenses: number;
  totalExpenses: number;
  projections: MonthProjection[];
  stabilityScore: number;
  stabilityBand: "Stable" | "Watch" | "High Pressure";
  stabilityExplanation: StabilityExplanation;
  milestones: Array<{ month: number; description: string; severity: "info" | "warning" | "critical" }>;
  capitalRecovery: CapitalRecovery;
}

export interface ScenarioComparison {
  name: string;
  description: string;
  result: RunwayResult;
}

export interface SpendingImpact {
  category: string;
  currentAmount: number;
  reductionAmount: number;
  runwayExtensionMonths: number;
  impactPerPound: number;
  effort: "Low" | "Medium" | "High";
}

export interface SensitivityResult {
  label: string;
  baseRunway: number;
  adjustedRunway: number;
  difference: number;
}

export interface SectorData {
  sector: string;
  medianWeeks: number;
  p25Weeks: number;
  p75Weeks: number;
  source: string;
  lastUpdated: string;
}
