import { Link } from "wouter";
import { LegalDocLayout } from "@/components/LegalDocLayout";
import { DataDeletionForm } from "@/components/legal/DataDeletionForm";
import { RUNWAY_BRIEF_NAME, RUNWAY_REPORT_FULL } from "@shared/product";
import { SITE_URL, SUPPORT_EMAIL } from "@shared/site";

export default function PrivacyPage() {
  return (
    <LegalDocLayout
      title="Privacy Policy | RedundancyCalculatorUK"
      metaDescription="RedundancyCalculatorUK privacy policy. How we collect, use, and protect your personal data under UK GDPR, including Resend email delivery."
      canonicalPath="/privacy"
      heroLabel="Privacy"
      heroTitle="Privacy Policy"
      heroSubtitle="How we handle personal data when you use the calculator, purchase a report, or receive transactional emails."
    >
      <p className="text-foreground font-medium">Last updated: June 2026</p>
      <p>
        This Privacy Policy explains how RedundancyCalculatorUK (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;),
        operated by Ianson Systems Limited, collects, uses, stores, and protects personal data when you use{" "}
        {SITE_URL.replace("https://", "")} and our financial modelling tools (&quot;the Service&quot;).
      </p>
      <p>
        This policy is provided in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data
        Protection Act 2018. Read it together with our{" "}
        <Link href="/terms" className="underline text-primary">
          Terms of Use
        </Link>
        .
      </p>

      <section>
        <h2 className="text-xl font-semibold text-foreground">1. Data controller</h2>
        <p>
          The data controller is Ianson Systems Limited, operator of RedundancyCalculatorUK. For data protection
          enquiries: <strong>{SUPPORT_EMAIL}</strong>. We aim to respond within one month.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">2. What personal data we collect</h2>
        <p className="font-medium mt-2">Processed locally in your browser (not sent to our servers for core modelling):</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Financial modelling data:</strong> Redundancy package assumptions, savings, income, expenses, and
            other figures you enter. Core calculations run in your browser and are stored in localStorage unless you use
            optional server features below.
          </li>
        </ul>

        <p className="font-medium mt-2">Processed on our servers:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Session tokens:</strong> Random identifiers in localStorage to verify report access. They do not
            contain financial figures.
          </li>
          <li>
            <strong>Email address:</strong> From Stripe checkout, the recover/sign-in flow, optional report-access
            email save, or Reset intake where provided.
          </li>
          <li>
            <strong>Payment records:</strong> Stripe session ID, payment status, purchase date, access expiry, and
            linked email. We do not receive card numbers.
          </li>
          <li>
            <strong>Optional saved calculations:</strong> If you save a report-access email, we may store your modelling
            inputs against your session token to help restore access.
          </li>
          <li>
            <strong>7-Day Redundancy Reset:</strong> Name, email, contact preference, and intake answers when you
            purchase and complete that product.
          </li>
          <li>
            <strong>{RUNWAY_BRIEF_NAME} (optional):</strong> De-identified numerical model outputs sent to OpenAI only
            when you explicitly generate a brief. See Section 8.
          </li>
          <li>
            <strong>Server logs:</strong> IP address, user agent, pages accessed, and timestamps for security and
            operations.
          </li>
        </ul>

        <p className="font-medium mt-2">Data we do not collect:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>No account registration with password</li>
          <li>No advertising or analytics tracking cookies</li>
          <li>No sale of personal data to third parties</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">3. Lawful basis for processing</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Contract (Article 6(1)(b)):</strong> Session tokens, payment records, and emails needed to deliver
            purchased access and transactional messages.
          </li>
          <li>
            <strong>Consent (Article 6(1)(a)):</strong> Optional {RUNWAY_BRIEF_NAME} generation and optional
            report-access email save, activated only when you choose them.
          </li>
          <li>
            <strong>Legitimate interests (Article 6(1)(f)):</strong> Security monitoring via server logs, balanced
            against your rights.
          </li>
          <li>
            <strong>Legal obligation (Article 6(1)(c)):</strong> Retention of certain payment records for tax and
            accounting compliance.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">4. How we use your data</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide and verify access to the {RUNWAY_REPORT_FULL}</li>
          <li>Process payments via Stripe</li>
          <li>Send transactional emails (purchase confirmation, sign-in links, access recovery)</li>
          <li>Fulfil the 7-Day Redundancy Reset where purchased</li>
          <li>Prevent fraud and maintain service security</li>
        </ul>
        <p>We do not send marketing newsletters or use your data for profiling with legal or similarly significant effects.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">5. Third parties</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Stripe</strong> — payment processing.{" "}
            <a href="https://stripe.com/gb/privacy" target="_blank" rel="noopener noreferrer" className="underline text-primary">
              Stripe Privacy Policy
            </a>
          </li>
          <li>
            <strong>Resend</strong> — transactional email delivery (confirmations, magic links, access links). Your
            email address is shared with Resend solely to deliver these messages. Resend acts as a data processor.{" "}
            <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline text-primary">
              Resend Privacy Policy
            </a>
          </li>
          <li>
            <strong>OpenAI</strong> — optional {RUNWAY_BRIEF_NAME} generation only when you activate it. See Section 8.
          </li>
          <li>
            <strong>Hosting providers</strong> — infrastructure for the website and database, acting as processors on
            our instructions.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">6. International transfers</h2>
        <p>
          Stripe, Resend, OpenAI, and our hosting providers may process data outside the UK. Where required, we rely on
          UK adequacy decisions, International Data Transfer Agreements, or other approved safeguards under Chapter V of
          the UK GDPR.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">7. Data retention</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Purchase emails:</strong> For your 6-month access period plus up to 6 years for UK accounting
            records, then anonymised.
          </li>
          <li>
            <strong>Magic link tokens:</strong> Short-lived (about 1 hour) and deleted after use or expiry.
          </li>
          <li>
            <strong>Authenticated session cookie (rruk.sid):</strong> Up to 90 days from last sign-in.
          </li>
          <li>
            <strong>Browser modelling data:</strong> Stored on your device until you clear site data.
          </li>
          <li>
            <strong>Server logs:</strong> Typically up to 90 days.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">8. Optional {RUNWAY_BRIEF_NAME}</h2>
        <p>
          When you generate a {RUNWAY_BRIEF_NAME}, de-identified numerical outputs (runway months, capital figures,
          scenario labels, sensitivity results) may be sent to OpenAI to produce plain-English text. We do not send your
          name, employer, address, email, or free-text notes. The brief is returned to your browser and not retained on
          our servers as personal data beyond the processing request.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">9. Security</h2>
        <p>
          We use HTTPS, restrict server access, and rely on Stripe (PCI DSS Level 1) for card processing. Core financial
          modelling runs locally in your browser. No electronic storage is completely secure.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">10. Your rights</h2>
        <p>Under UK GDPR you may have rights of access, rectification, erasure, restriction, portability, and objection.</p>
        <DataDeletionForm />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">11. Cookies and local storage</h2>
        <p>
          We do not use advertising or analytics cookies. We use localStorage for session tokens and wizard state, and a
          strictly necessary HttpOnly session cookie (<code>rruk.sid</code>) when you use email sign-in. Stripe may set
          cookies on checkout pages under its own policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">12. Complaints</h2>
        <p>
          You may complain to the Information Commissioner&apos;s Office (ICO) at{" "}
          <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="underline text-primary">
            ico.org.uk
          </a>{" "}
          or 0303 123 1113. Please contact us first at {SUPPORT_EMAIL}.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">13. Changes</h2>
        <p>We may update this policy with a new date on this page. Continued use after changes constitutes acknowledgement.</p>
      </section>
    </LegalDocLayout>
  );
}
