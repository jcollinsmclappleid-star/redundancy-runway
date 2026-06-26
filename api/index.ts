import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const require = createRequire(import.meta.url);

function pathnameFromRequest(req: VercelRequest): string {
  const pathnameParam = req.query.pathname;
  if (pathnameParam === undefined || pathnameParam === "") return "/";
  const parts = Array.isArray(pathnameParam) ? pathnameParam : [pathnameParam];
  const joined = parts.filter(Boolean).join("/");
  return joined ? `/${joined}` : "/";
}

function serveSeoHtml(req: VercelRequest, res: VercelResponse) {
  const pathname = pathnameFromRequest(req);
  const { applyRouteSeoToHtml } = require(join(process.cwd(), "dist/seo-handler.cjs")) as {
    applyRouteSeoToHtml: (html: string, originalUrl: string) => { html: string; statusCode: number };
  };
  const indexPath = join(process.cwd(), "dist/public/index.html");
  const html = readFileSync(indexPath, "utf-8");
  const result = applyRouteSeoToHtml(html, pathname);

  res.status(result.statusCode);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  return res.send(result.html);
}

function restoreApiUrl(req: VercelRequest) {
  const raw = req.query.__path;
  if (raw === undefined) return;
  const pathSuffix = Array.isArray(raw) ? raw.join("/") : String(raw);
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === "__path" || key === "pathname") continue;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  req.url = `/api/${pathSuffix}${qs ? `?${qs}` : ""}`;
}

export default async function vercelHandler(req: VercelRequest, res: VercelResponse) {
  if (req.query.pathname !== undefined) {
    return serveSeoHtml(req, res);
  }

  if (req.query.__path !== undefined) {
    restoreApiUrl(req);
  }

  const handlerPath = join(process.cwd(), "dist/vercel-handler.cjs");
  const { getVercelApp } = require(handlerPath) as {
    getVercelApp: () => Promise<import("express").Express>;
  };
  const app = await getVercelApp();
  return app(req, res);
}
