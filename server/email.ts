import { REPORT_PRODUCT_NAME } from "./stripeConfig";

const FROM_DOMAIN = "redundancycalculatoruk.co.uk";
const defaultFrom = `noreply@${FROM_DOMAIN}`;
const fromEmail = process.env.ACCESS_EMAIL_FROM || process.env.RESEND_FROM_EMAIL || defaultFrom;
const FROM = `RedundancyCalculatorUK <${fromEmail}>`;
const REPLY_TO = "support@redundancycalculatoruk.co.uk";

function htmlEscape(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(date: Date | string | null): string {
  if (!date) return "unknown";
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function emailWrapper(content: string): string {
  return `<!DOCTYPE html><html lang="en"><body style="margin:0;padding:0;background:#f4f5f7;font-family:Inter,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 16px;"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:8px;border:1px solid #e2e8f0;">
<tr><td style="background:#0f1b2d;padding:24px 32px;"><p style="margin:0;color:#c9a84c;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">RedundancyCalculatorUK</p></td></tr>
<tr><td style="padding:32px;">${content}</td></tr>
<tr><td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;"><p style="margin:0;color:#94a3b8;font-size:11px;line-height:1.6;">Illustrative modelling only — not financial, legal or employment advice.</p></td></tr>
</table></td></tr></table></body></html>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, reply_to: REPLY_TO, subject, html }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Email delivery failed: ${response.status} ${text}`);
  }
  return true;
}

export async function sendPurchaseConfirmationEmail(
  email: string,
  sessionToken: string,
  expiresAt: Date | string | null,
  origin: string
): Promise<void> {
  const accessUrl = `${origin}/access?token=${encodeURIComponent(sessionToken)}`;
  const html = emailWrapper(`
    <h1 style="margin:0 0 8px;color:#0f1b2d;font-size:24px;">Your report access is ready</h1>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">Thank you for your purchase. Open your ${htmlEscape(REPORT_PRODUCT_NAME)}, update your assumptions, and download your summary any time before ${htmlEscape(formatDate(expiresAt))}.</p>
    <p style="margin:0 0 24px;"><a href="${accessUrl}" style="display:inline-block;background:#c9a84c;color:#fff;padding:14px 28px;border-radius:8px;font-weight:700;text-decoration:none;">Open my report</a></p>
    <p style="margin:0;color:#94a3b8;font-size:12px;word-break:break-all;">${htmlEscape(accessUrl)}</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
    <p style="margin:0;color:#64748b;font-size:13px;">On another device? Visit <a href="${origin}/recover">${origin}/recover</a> and sign in with this email for a fresh link.</p>
  `);
  await sendEmail(email, "Your RedundancyCalculatorUK report access", html);
}

export async function sendMagicLinkEmail(email: string, token: string, origin: string): Promise<void> {
  const verifyUrl = `${origin}/api/auth/verify?token=${encodeURIComponent(token)}`;
  const html = emailWrapper(`
    <h1 style="margin:0 0 8px;color:#0f1b2d;font-size:24px;">Sign in to your report</h1>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">Click below to open your ${htmlEscape(REPORT_PRODUCT_NAME)}. This link expires in 1 hour and works once.</p>
    <p style="margin:0 0 24px;"><a href="${verifyUrl}" style="display:inline-block;background:#c9a84c;color:#fff;padding:14px 28px;border-radius:8px;font-weight:700;text-decoration:none;">Sign in</a></p>
    <p style="margin:0;color:#94a3b8;font-size:12px;word-break:break-all;">${htmlEscape(verifyUrl)}</p>
  `);
  await sendEmail(email, "Sign in to RedundancyCalculatorUK", html);
}

export async function sendAccessLinksEmail(
  email: string,
  reportLinks: string[],
  resetLinks: string[],
): Promise<boolean> {
  const reportList = reportLinks.length
    ? `<h2 style="font-size:16px;color:#0f1b2d;">Report access</h2><ul>${reportLinks.map((l) => `<li><a href="${htmlEscape(l)}">${htmlEscape(l)}</a></li>`).join("")}</ul>`
    : "";
  const resetList = resetLinks.length
    ? `<h2 style="font-size:16px;color:#0f1b2d;">Reset portal</h2><ul>${resetLinks.map((l) => `<li><a href="${htmlEscape(l)}">${htmlEscape(l)}</a></li>`).join("")}</ul>`
    : "";
  const html = emailWrapper(`
    <h1 style="margin:0 0 8px;color:#0f1b2d;font-size:24px;">Your access links</h1>
    <p style="margin:0 0 20px;color:#475569;font-size:14px;">Use the links below to return to your report or Private Reset Portal.</p>
    ${reportList}${resetList}
    <p style="margin:16px 0 0;color:#94a3b8;font-size:12px;">Paid report access? Use <a href="https://redundancycalculatoruk.co.uk/recover">/recover</a> for a secure sign-in link.</p>
  `);
  return sendEmail(email, "Your RedundancyCalculatorUK access links", html);
}
