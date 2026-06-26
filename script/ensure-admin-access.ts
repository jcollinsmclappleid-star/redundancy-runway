/**
 * Ensure granted admin access exists in production DB.
 * Run: node --env-file=.env ./node_modules/tsx/dist/cli.mjs script/ensure-admin-access.ts
 */
import { ensureGrantedProducts, isGrantedAccessEmail } from "../server/grantedAccess";
import { storage } from "../server/storage";

const email = process.env.GRANTED_ACCESS_EMAILS?.split(",")[0]?.trim();
if (!email) {
  console.error("GRANTED_ACCESS_EMAILS not set in .env");
  process.exit(1);
}

console.log(`Granted list includes ${email}:`, isGrantedAccessEmail(email));

const granted = await ensureGrantedProducts(email);
console.log("Granted access provisioned:");
console.log(`  sessionToken: ${granted.sessionToken.slice(0, 12)}…`);
console.log(`  expiresAt: ${granted.expiresAt}`);
console.log(`  resetPortalUrl: ${granted.resetPortalUrl}`);

const purchases = await storage.getPaidPurchasesByEmail(email);
const active = purchases.filter((p) => {
  const paid = p.status === "paid" || p.status === "completed";
  return paid && new Date(p.expiresAt) > new Date();
});
console.log(`Active paid/granted purchases for ${email}:`, active.length);
