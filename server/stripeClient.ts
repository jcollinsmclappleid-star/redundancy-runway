import Stripe from "stripe";
import { StripeSync } from "stripe-replit-sync";
import { getStripeEnv } from "./stripeConfig";

export interface StripeCredentials {
  secretKey: string;
  publishableKey?: string;
  webhookSecret?: string;
  source: "env" | "replit";
}

async function getReplitStripeCredentials(): Promise<StripeCredentials> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? `repl ${process.env.REPL_IDENTITY}`
    : process.env.WEB_REPL_RENEWAL
      ? `depl ${process.env.WEB_REPL_RENEWAL}`
      : null;

  if (!hostname || !xReplitToken) {
    throw new Error(
      "Missing Replit Stripe connector. Set STRIPE_SECRET_KEY in .env or connect Stripe via Replit Integrations.",
    );
  }

  const resp = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=stripe`,
    {
      headers: { Accept: "application/json", X_REPLIT_TOKEN: xReplitToken },
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!resp.ok) {
    throw new Error(`Failed to fetch Stripe credentials from Replit: ${resp.status} ${resp.statusText}`);
  }

  const data = await resp.json();
  const settings = data.items?.[0]?.settings;

  if (!settings?.secret_key) {
    throw new Error(
      "Stripe integration not connected on Replit. Set STRIPE_SECRET_KEY in .env or connect via Integrations.",
    );
  }

  return {
    secretKey: settings.secret_key,
    publishableKey: settings.publishable_key,
    webhookSecret: settings.webhook_secret,
    source: "replit",
  };
}

/** Prefer .env keys; fall back to Replit connector credentials. */
export async function getStripeCredentials(): Promise<StripeCredentials> {
  const env = getStripeEnv();

  if (env.secretKey) {
    return {
      secretKey: env.secretKey,
      publishableKey: env.publishableKey,
      webhookSecret: env.webhookSecret,
      source: "env",
    };
  }

  return getReplitStripeCredentials();
}

export async function getWebhookSecret(): Promise<string | undefined> {
  const env = getStripeEnv();
  if (env.webhookSecret) return env.webhookSecret;

  try {
    const creds = await getStripeCredentials();
    return creds.webhookSecret;
  } catch {
    return undefined;
  }
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await getStripeCredentials();
  return new Stripe(secretKey);
}

export async function getStripePublishableKey(): Promise<string | undefined> {
  const creds = await getStripeCredentials();
  return creds.publishableKey;
}

export async function getStripeSync(): Promise<StripeSync> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const { secretKey } = await getStripeCredentials();
  const webhookSecret = (await getWebhookSecret()) ?? "";

  return new StripeSync({
    poolConfig: { connectionString: databaseUrl },
    stripeSecretKey: secretKey,
    stripeWebhookSecret: webhookSecret,
  });
}
