import { createRequire } from "node:module";
import path from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const require = createRequire(import.meta.url);
const handlerPath = path.join(process.cwd(), "dist", "vercel-handler.cjs");
const { getVercelHandler } = require(handlerPath) as {
  getVercelHandler: () => Promise<(req: VercelRequest, res: VercelResponse) => Promise<unknown>>;
};

export default async function vercelHandler(req: VercelRequest, res: VercelResponse) {
  const handler = await getVercelHandler();
  return handler(req, res);
}
