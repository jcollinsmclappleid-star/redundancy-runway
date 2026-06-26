import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const require = createRequire(import.meta.url);
const { applyRouteSeoToHtml } = require(join(process.cwd(), "dist/seo-handler.cjs")) as {
  applyRouteSeoToHtml: (
    html: string,
    originalUrl: string,
  ) => { html: string; statusCode: number };
};

function pathnameFromRequest(req: VercelRequest): string {
  const pathnameParam = req.query.pathname;
  if (pathnameParam === undefined || pathnameParam === "") return "/";
  const parts = Array.isArray(pathnameParam) ? pathnameParam : [pathnameParam];
  const joined = parts.filter(Boolean).join("/");
  return joined ? `/${joined}` : "/";
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const pathname = pathnameFromRequest(req);
  const indexPath = join(process.cwd(), "dist/public/index.html");
  const html = readFileSync(indexPath, "utf-8");
  const result = applyRouteSeoToHtml(html, pathname);

  res.status(result.statusCode);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  return res.send(result.html);
}
