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

  return httpServer;
}
