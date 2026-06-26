import { Link } from "wouter";
import { LegalDocLayout } from "@/components/LegalDocLayout";
import { LegalDisclaimerBox } from "@/components/legal/LegalDisclaimerBox";
import { RUNWAY_REPORT_FULL, RUNWAY_REPORT_PRICE_GBP } from "@shared/product";
import { SUPPORT_EMAIL } from "@shared/site";

export default function LegalPage() {
  return (
    <LegalDocLayout
      title="Legal & Regulatory Notice | RedundancyCalculatorUK"
      metaDescription="Legal and regulatory notice for RedundancyCalculatorUK — non-advisory modelling tool, limitations, and when to seek professional advice."
      canonicalPath="/legal"
      heroLabel="Legal"
      heroTitle="Legal & regulatory notice"
      heroSubtitle="How RedundancyCalculatorUK is positioned under UK law and what it does not provide."
    >
      <p className="text-foreground font-medium">Last updated: June 2026</p>

      <LegalDisclaimerBox className="mb-2" />

      <p>
        RedundancyCalculatorUK is operated by <strong>Ianson Systems Limited</strong>. This page explains the
        regulatory status of the Service and the boundaries of what it provides. It should be read alongside our{" "}
        <Link href="/terms" className="underline text-primary">
          Terms of Use
        </Link>
        ,{" "}
        <Link href="/privacy" className="underline text-primary">
          Privacy Policy
        </Link>
        , and{" "}
        <Link href="/methodology" className="underline text-primary">
          Methodology
        </Link>
        .
      </p>

      <section>
        <h2 className="text-xl font-semibold text-foreground">1. Non-advisory service</h2>
        <p className="font-medium text-foreground">
          RedundancyCalculatorUK is an assumption-based financial modelling tool. It does not provide financial advice,
          legal advice, tax advice, employment law advice, debt advice, benefits advice, mortgage advice, or career
          advice.
        </p>
        <p>
          The Service is not authorised or regulated by the Financial Conduct Authority (FCA), the Solicitors Regulation
          Authority (SRA), or any other professional regulatory body. It does not recommend specific financial products,
          lenders, investments, or settlement structures and does not assess suitability for any regulated arrangement.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">2. Illustrative outputs only</h2>
        <p>
          All calculator outputs, dashboards, scenario comparisons, and plain-English briefs are illustrative models
          based on the assumptions you enter. They do not determine legal entitlement to redundancy pay, whether an
          employer offer is fair or complete, personal tax liability, benefit entitlement, mortgage eligibility, or
          future employment outcomes.
        </p>
        <p>
          Statutory redundancy estimates apply published UK rules in simplified form. They are not a substitute for
          checking your contract, payslips, HR documentation, or independent employment advice where needed.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">3. No professional relationship</h2>
        <p>
          Use of this Service does not create any adviser-client, solicitor-client, fiduciary, or similar relationship
          between you and RedundancyCalculatorUK or Ianson Systems Limited. No duty of care arises from your use of the
          Tool beyond our obligations as a service provider under applicable consumer and data protection law.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">4. When to seek independent advice</h2>
        <p>You may wish to seek qualified professional advice where your situation involves, for example:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Disputed redundancy selection, discrimination, or unfair dismissal concerns — employment law adviser or solicitor</li>
          <li>Settlement agreements or enhanced package negotiations — solicitor</li>
          <li>Complex tax treatment of termination payments — qualified tax adviser or accountant</li>
          <li>Mortgage arrears, lender negotiations, or regulated mortgage advice — lender or FCA-authorised mortgage adviser</li>
          <li>Debt, insolvency, or benefit entitlement questions — debt adviser, Citizens Advice, or relevant government services</li>
          <li>Long-term financial planning after redundancy — FCA-authorised financial adviser</li>
        </ul>
        <p>
          For general employment rights guidance in England, Wales and Scotland, ACAS provides free information. This
          Service does not replicate ACAS, HMRC, or GOV.UK guidance and may not reflect the latest official rules until
          updated.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">5. Paid products</h2>
        <p>
          The {RUNWAY_REPORT_FULL} (£{RUNWAY_REPORT_PRICE_GBP}, one-off) unlocks extended modelling dashboards and an
          optional plain-English brief generated from your figures. The 7-Day Redundancy Reset is a separate written
          support product. Neither product constitutes regulated advice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">6. Intellectual property</h2>
        <p>
          All content, design, algorithms, and code are protected by intellectual property laws. You may save or print
          outputs for personal, non-commercial use only.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">7. Contact</h2>
        <p>
          For legal or regulatory enquiries about the Service:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline text-primary">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </section>
    </LegalDocLayout>
  );
}
