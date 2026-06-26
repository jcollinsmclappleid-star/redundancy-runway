import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { applyRouteSeoToHtml } from "./seo";

function resolveDistPublic(): string {
  const candidates = [
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "..", "dist", "public"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error(
    `Could not find the build directory (dist/public). Tried: ${candidates.join(", ")}`,
  );
}

export function serveStatic(app: Express) {
  const distPath = resolveDistPublic();

  app.use(express.static(distPath));

  app.use("/{*path}", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");
    const result = applyRouteSeoToHtml(html, req.originalUrl);
    res.status(result.statusCode).type("html").send(result.html);
  });
}
