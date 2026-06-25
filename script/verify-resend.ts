/**
 * Verify Resend API key and from-address configuration.
 * Run: node --env-file=.env ./node_modules/tsx/dist/cli.mjs script/verify-resend.ts
 */
const apiKey = process.env.RESEND_API_KEY?.trim();
const from =
  process.env.ACCESS_EMAIL_FROM ||
  process.env.RESEND_FROM_EMAIL ||
  "noreply@redundancycalculatoruk.co.uk";
const testTo = process.env.RESEND_TEST_TO?.trim();

async function main() {
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set. Add it to .env or Vercel/Replit secrets.");
    process.exit(1);
  }

  const domainsRes = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const domainsBody = await domainsRes.json();
  if (!domainsRes.ok) {
    console.error("Resend API key check failed:", domainsRes.status, domainsBody);
    process.exit(1);
  }

  console.log("Resend API key: OK");
  const domains = Array.isArray(domainsBody?.data) ? domainsBody.data : [];
  if (domains.length === 0) {
    console.warn("No verified domains yet. Add redundancycalculatoruk.co.uk in https://resend.com/domains");
  } else {
    console.log(
      "Verified domains:",
      domains.map((d: { name: string; status: string }) => `${d.name} (${d.status})`).join(", "),
    );
  }

  console.log(`From address configured: ${from}`);

  if (testTo) {
    const sendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `RedundancyCalculatorUK <${from}>`,
        to: testTo,
        subject: "Resend test — RedundancyCalculatorUK",
        html: "<p>Resend is configured correctly for preview/staging.</p>",
      }),
    });
    const sendBody = await sendRes.json();
    if (!sendRes.ok) {
      console.error("Test send failed:", sendRes.status, sendBody);
      process.exit(1);
    }
    console.log(`Test email sent to ${testTo} (id: ${sendBody.id})`);
  } else {
    console.log("Set RESEND_TEST_TO=you@example.com to send a test email.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
