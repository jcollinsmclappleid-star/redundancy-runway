import serverless from "serverless-http";
import { createApp } from "./createApp";

let handler: ReturnType<typeof serverless> | undefined;

export async function getVercelHandler() {
  if (!handler) {
    process.env.NODE_ENV = "production";
    process.env.VERCEL = "1";
    const { app } = await createApp();
    handler = serverless(app);
  }
  return handler;
}
