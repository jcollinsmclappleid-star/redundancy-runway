import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import { createApp } from "../server/createApp";

let handler: ReturnType<typeof serverless> | undefined;

async function getHandler() {
  if (!handler) {
    process.env.NODE_ENV = "production";
    const { app } = await createApp();
    handler = serverless(app);
  }
  return handler;
}

export default async function vercelHandler(req: VercelRequest, res: VercelResponse) {
  const fn = await getHandler();
  return fn(req, res);
}
