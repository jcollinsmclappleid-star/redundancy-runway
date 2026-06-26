import { Link } from "wouter";
import { LegalDocLayout } from "@/components/LegalDocLayout";
import { LegalDisclaimerBox } from "@/components/legal/LegalDisclaimerBox";
import { RUNWAY_BRIEF_NAME, RUNWAY_REPORT_FULL, RUNWAY_REPORT_PRICE_GBP } from "@shared/product";
import { SUPPORT_EMAIL } from "@shared/site";

export default function TermsPage() {
  return (
    <LegalDocLayout
      title="Terms of Use | RedundancyCalculatorUK"
      metaDescription="Terms of use for RedundancyCalculatorUK — conditions, disclaimers, payment, access, and limitations of liability."
      canonicalPath="/terms"
      heroLabel="Terms"
      heroTitle="Terms of Use"
      heroSubtitle="Conditions governing access to the redundancy calculator, paid report, and related services."
    >
      <p className="text-foreground font-medium">Last updated: June 2026</p>

      <LegalDisclaimerBox className="mb-2" />

      <p>
        By accessing or using RedundancyCalculatorUK (&quot;the Service&quot;, &quot;the Tool&quot;), you agree to
        these Terms of Use. If you do not agree, you must not use the Service.
      </p>

      <section>
        <h2 className="text-xl font-semibold text-foreground">1. About this service</h2>
        <p>
          RedundancyCalculatorUK is an online financial modelling tool that generates illustrative projections for UK
          redundancy packages and household runway. Outputs are based solely on data you enter and assumptions you
          configure.
        </p>
        <p>
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We may modify, suspend, or
          discontinue the Service without prior notice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">2. Important disclaimer</h2>
        <p className="font-medium text-foreground">
          This Tool does not provide financial advice, legal advice, tax advice, employment law advice, debt advice,
          benefits advice, or mortgage advice. It is not regulated by the FCA, SRA, or any other professional body.
        </p>
        <p>
          The Tool does not predict job outcomes, benefit decisions, lender decisions, or legal entitlement. All outputs
          are illustrative models only and must not be relied upon as the sole basis for legal, financial, tax, or
          employment decisions.
        </p>
        <p>
          See also our{" "}
          <Link href="/legal" className="underline text-primary">
            Legal &amp; Regulatory Notice
          </Link>{" "}
          and{" "}
          <Link href="/methodology" className="underline text-primary">
            Methodology
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">3. Accuracy and model limitations</h2>
        <p>
          Outputs are estimates from a simplified mathematical model. We make no warranty regarding accuracy,
          completeness, or fitness for any purpose. The model uses generalised UK statutory redundancy rules, user-entered
          package assumptions, and household runway arithmetic. It does not replicate payroll systems, HMRC personal
          tax calculations, benefit rules, or lender underwriting.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Statutory estimates use published caps and age-band rules in simplified form</li>
          <li>Notice pay, holiday pay, and enhanced packages depend on assumptions you enter</li>
          <li>Runway projections assume constant monthly burn unless scenario rules state otherwise</li>
          <li>Tax-sensitive splits are for modelling clarity only — not tax advice</li>
          <li>Results may differ materially from real outcomes even with accurate inputs</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">4. No advisory relationship</h2>
        <p>
          Use of the Tool does not create any professional-client or fiduciary relationship. The Tool does not assess
          fairness of employer offers, negotiate on your behalf, or provide regulated advice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">5. Your responsibility for inputs</h2>
        <p>
          You are responsible for the accuracy and completeness of information you enter. We do not verify inputs against
          payslips, contracts, or employer documentation.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">6. Access and payment</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>A limited free preview is available without payment</li>
          <li>
            Full access to the {RUNWAY_REPORT_FULL} requires a one-time payment of £{RUNWAY_REPORT_PRICE_GBP}
          </li>
          <li>Paid report access is valid for 6 months from purchase</li>
          <li>
            Access is linked to a browser session token. Use{" "}
            <Link href="/recover" className="underline text-primary">
              Recover Access
            </Link>{" "}
            with your purchase email if you change device
          </li>
          <li>Payments are processed by Stripe. We do not store card details</li>
          <li>
            The 7-Day Redundancy Reset is a separate paid product with its own written-support boundaries described on
            that product page
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">7. Refunds</h2>
        <p>
          If you have a billing concern, contact{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline text-primary">
            {SUPPORT_EMAIL}
          </a>
          . Nothing in these terms limits your statutory consumer rights under UK law.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">8. Limitation of liability</h2>
        <p>To the fullest extent permitted by law:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The Service is provided without warranties of any kind</li>
          <li>
            We are not liable for indirect, consequential, or financial losses arising from use of or reliance on the
            Tool
          </li>
          <li>
            We are not liable for decisions about redundancy packages, employment, tax, benefits, mortgages, or spending
            influenced by model outputs
          </li>
          <li>Our aggregate liability shall not exceed the amount you paid for access to the Service</li>
        </ul>
        <p>Nothing excludes liability that cannot be excluded under applicable law.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">9. Data protection</h2>
        <p>
          We process personal data as described in our{" "}
          <Link href="/privacy" className="underline text-primary">
            Privacy Policy
          </Link>
          , including use of Resend for transactional email delivery.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">10. Optional {RUNWAY_BRIEF_NAME}</h2>
        <p>
          If you generate a {RUNWAY_BRIEF_NAME}, selected de-identified model figures may be processed by a third-party
          language model service as described in the Privacy Policy. This is optional and activated only by you.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">11. Intellectual property</h2>
        <p>
          All content, design, and code are protected by intellectual property laws. You may save or print outputs for
          personal, non-commercial use only.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">12. Acceptable use</h2>
        <p>
          Use the Service only for personal illustrative modelling. Do not resell outputs as professional advice or use the
          Service unlawfully.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">13. Governing law</h2>
        <p>
          These terms are governed by the laws of England and Wales. Courts of England and Wales have exclusive
          jurisdiction, subject to mandatory consumer protections in your country of residence.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">14. Changes</h2>
        <p>We may update these terms on this page. Continued use after changes constitutes acceptance.</p>
      </section>
    </LegalDocLayout>
  );
}
