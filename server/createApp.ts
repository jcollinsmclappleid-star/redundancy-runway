import express, { type Express, type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import createMemoryStore from "memorystore";
import { createServer, type Server } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { log } from "./log";

declare module "express-session" {
  interface SessionData {
    email?: string;
  }
}

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

export type AppBundle = { app: Express; httpServer: Server };

export async function createApp(): Promise<AppBundle> {
  const app = express();
  const httpServer = createServer(app);

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  app.set("trust proxy", 1);
  app.set("etag", false);

  if (process.env.NODE_ENV === "production") {
    const secret = process.env.SESSION_SECRET?.trim();
    if (!secret || secret === "change-me-in-production" || secret === "rruk-dev-secret") {
      throw new Error("SESSION_SECRET must be set to a strong random value in production");
    }
  }

  const isVercel = process.env.VERCEL === "1";
  const sessionOptions: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "rruk-dev-secret",
    resave: false,
    saveUninitialized: false,
    name: "rruk.sid",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 90 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  };

  if (isVercel) {
    const MemoryStore = createMemoryStore(session);
    sessionOptions.store = new MemoryStore({ checkPeriod: 86_400_000 });
  } else {
    const PgSession = connectPgSimple(session);
    sessionOptions.store = new PgSession({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      tableName: "user_sessions",
      pruneSessionInterval: 60 * 60,
    });
  }

  app.use(session(sessionOptions));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, unknown> | undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson as Record<string, unknown>;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        log(logLine);
      }
    });

    next();
  });

  await registerRoutes(httpServer, app);

  app.use((err: { status?: number; statusCode?: number; message?: string }, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  const isProduction = process.env.NODE_ENV === "production";

  if (isVercel) {
    // Static HTML/assets are served by Vercel from outputDirectory (dist/public).
  } else if (isProduction) {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  return { app, httpServer };
}
