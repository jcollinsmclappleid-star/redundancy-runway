import { createApp } from "./createApp";
import type { Express } from "express";

let app: Express | undefined;

export async function getVercelApp() {
  if (!app) {
    process.env.NODE_ENV = "production";
    process.env.VERCEL = "1";
    const bundle = await createApp();
    app = bundle.app;
  }
  return app;
}
