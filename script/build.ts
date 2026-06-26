import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { cp, rm, readFile } from "fs/promises";
import path from "path";

process.env.NODE_ENV ||= "production";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "serverless-http",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();
  await cp("public", "dist/public", { recursive: true, force: true });

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "warning",
  });

  console.log("building vercel api handler...");
  await esbuild({
    entryPoints: ["server/vercelHandler.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/vercel-handler.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "warning",
  });

  console.log("building seo html handler...");
  await esbuild({
    entryPoints: ["server/seo.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/seo-handler.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    alias: {
      "@shared/site": path.resolve("shared/site.ts"),
      "@shared/aiRedundancySeo": path.resolve("shared/aiRedundancySeo.ts"),
    },
    minify: true,
    logLevel: "warning",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
