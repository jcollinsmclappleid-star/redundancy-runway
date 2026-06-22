import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";

const LAST_CHECKED = "April 2025";
const WEEKLY_CAP = "£643";
const TAX_FREE_THRESHOLD = "£30,000";

export default function StatutoryRedundancyPayPage() {
  return (
    <>
      <Helmet>
        <title>UK Statutory Redundancy Pay 2025: What You're Entitled To | RedundancyCalculatorUK</title>
        <meta name="description" content="How UK statutory redundancy pay is calculated — age-band multipliers, weekly pay cap, service limits and tax treatment. Last checked April 2025. Not financial advice." />
        <link rel="canonical" href="https://redundancycalculatoruk.com/statutory-redundancy-pay" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="RedundancyCalculatorUK" />
        <meta property="og:title" content="UK Statutory Redundancy Pay 2025: What You're Entitled To" />
        <meta property="og:description" content="How UK statutory redundancy pay is calculated — age-band multipliers, weekly pay cap, service limits and tax treatment. Last checked April 2025." />
        <meta property="og:url" content="https://redundancycalculatoruk.com/statutory-redundancy-pay" />
        <meta property="og:image" content="https://redundancycalculatoruk.com/og-image.png" />
        <meta name="twitter:image" content="https://redundancycalculatoruk.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "UK Statutory Redundancy Pay 2025: What You're Entitled To",
          "description": "How UK statutory redundancy pay is calculated — age-band multipliers, weekly pay cap, service limits and tax treatment.",
          "publisher": { "@type": "Organization", "name": "RedundancyCalculatorUK", "url": "https://redundancycalculatoruk.com" },
          "dateModified": "2025-04-01",
          "mainEntityOfPage": "https://redundancycalculatoruk.com/statutory-redundancy-pay"
        })}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />

        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <Logo />
            <Link href="/wizard">
              <Button size="sm" data-testid="button-header-cta">
                Calculate my entitlement
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1">
          <section className="py-14 px-6 bg-primary" data-testid="section-hero">
            <div className="max-w-3xl mx-auto">
              <Badge className="mb-5 bg-white/15 text-primary-foreground border-white/20 text-xs">UK Redundancy Guide</Badge>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4 leading-tight">
                UK Statutory Redundancy Pay 2025: What You're Entitled To
              </h1>
              <p className="text-primary-foreground/75 text-base leading-relaxed max-w-2xl">
                How the statutory formula works, what the weekly pay cap means for your calculation, and how tax treatment differs between redundancy pay and notice pay.
              </p>
              <p className="text-primary-foreground/50 text-xs mt-4">Last checked: {LAST_CHECKED}. Source: GOV.UK. This is contextual information only, not legal or financial advice.</p>
            </div>
          </section>

          <section className="py-12 px-6" data-testid="section-content">
            <div className="max-w-3xl mx-auto space-y-10">

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">The qualifying service requirement</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To qualify for statutory redundancy pay under UK employment law, you generally need at least 2 years of continuous service with the same employer. If you have fewer than 2 years, you are not entitled to statutory redundancy pay — though you may still be entitled to notice pay and accrued holiday pay, which are separate.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Continuous service is calculated in complete years. Partial years are not counted in the statutory redundancy formula.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">How the statutory formula works</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The statutory redundancy formula multiplies your years of service by a weekly pay figure (capped at {WEEKLY_CAP} as of April 2025) and by a multiplier that depends on your age during each year of service:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse" data-testid="table-age-bands">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium border-b">Age during the year of service</th>
                        <th className="text-left p-3 font-medium border-b">Multiplier</th>
                        <th className="text-left p-3 font-medium border-b">Pay per qualifying year</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">Under 22</td>
                        <td className="p-3">½ week's pay</td>
                        <td className="p-3">Up to £321.50</td>
                      </tr>
                      <tr className="border-b bg-muted/20">
                        <td className="p-3">22–40</td>
                        <td className="p-3">1 week's pay</td>
                        <td className="p-3">Up to £643.00</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">41 and over</td>
                        <td className="p-3">1½ week's pay</td>
                        <td className="p-3">Up to £964.50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Weekly pay cap: {WEEKLY_CAP} (April 2025). Maximum service counted: 20 years. Source: GOV.UK.</p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">The 20-year service cap</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Statutory redundancy pay counts a maximum of 20 years of service, even if you have worked for the same employer for longer. This means the maximum statutory redundancy payment under the April 2025 rules is £19,290 (20 years × 1.5 multiplier × {WEEKLY_CAP}). Enhanced redundancy packages offered by employers are not subject to this cap.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Tax treatment of redundancy payments</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Not all elements of a redundancy package are treated the same for tax purposes:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <div><span className="text-foreground font-medium">Statutory redundancy pay (and genuine ex-gratia payments):</span> Generally tax-free up to {TAX_FREE_THRESHOLD} of the total genuine redundancy payment. The excess over {TAX_FREE_THRESHOLD} is subject to income tax.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <div><span className="text-foreground font-medium">Notice pay (payment in lieu of notice / PILON):</span> Subject to income tax and National Insurance, regardless of the amount.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <div><span className="text-foreground font-medium">Accrued holiday pay:</span> Subject to income tax and National Insurance.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <div><span className="text-foreground font-medium">Enhanced redundancy above the statutory amount:</span> Generally falls within the {TAX_FREE_THRESHOLD} tax-free allowance if it is a genuine redundancy payment, but the full position depends on individual circumstances.</div>
                  </li>
                </ul>
                <Card className="mt-4 bg-muted/30 border-muted">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Tax treatment of redundancy payments can be complex and depends on individual circumstances. RedundancyCalculatorUK shows gross figures only. For advice on your specific tax position, consult a qualified tax adviser or HMRC directly.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Enhanced redundancy packages</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Some employers offer enhanced redundancy packages that pay more than the statutory minimum. These are often expressed as a multiple of the statutory entitlement or as a separate lump sum. Enhanced packages are not legally required but are common in larger organisations and where collective redundancy agreements exist. RedundancyCalculatorUK lets you enter an enhanced package amount and model the impact on your financial runway separately from the statutory element.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">What the statutory figure does not cover</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Understanding what the statutory redundancy estimate does not represent is important for financial planning:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "It does not predict how long your money will last — that depends on your savings, expenses and income assumptions.",
                    "It does not account for income tax payable on notice pay or holiday pay.",
                    "It does not include benefits entitlement, which depends on individual circumstances and National Insurance record.",
                    "It does not include any enhanced package element unless you enter that separately.",
                    "It is not a legal determination of your entitlement — only an illustrative estimate under the statutory formula.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/50 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Card className="bg-primary text-primary-foreground" data-testid="card-calculator-cta">
                <CardContent className="pt-8 pb-8 text-center">
                  <Calculator className="w-8 h-8 mx-auto mb-4 opacity-80" />
                  <h3 className="font-serif text-xl font-bold mb-2">Calculate your statutory estimate</h3>
                  <p className="text-primary-foreground/75 text-sm mb-6 max-w-sm mx-auto">
                    Enter your age, years of service and weekly pay to see an estimate under the UK statutory formula. Then model how long your money may last.
                  </p>
                  <Link href="/wizard">
                    <Button className="bg-white text-primary hover:bg-white/90 font-semibold" data-testid="button-cta-calculator">
                      Start the free calculator
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-primary-foreground/50 mt-3">Illustrative estimate only. Not financial or legal advice.</p>
                </CardContent>
              </Card>

              <div className="border-t pt-6" data-testid="section-related-links">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">Related guides</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <Link href="/redundancy-mortgage" data-testid="link-guide-mortgage">
                    <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                      <p className="text-sm font-medium mb-1">Redundancy &amp; Your Mortgage</p>
                      <p className="text-xs text-muted-foreground">Payment holidays, rate sensitivity and what to model before contacting your lender.</p>
                    </div>
                  </Link>
                  <Link href="/voluntary-redundancy" data-testid="link-guide-vr">
                    <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                      <p className="text-sm font-medium mb-1">Voluntary Redundancy Guide</p>
                      <p className="text-xs text-muted-foreground">How VR compares to statutory, the runway implications, and negotiation points.</p>
                    </div>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Link href="/redundancy-reset" className="text-primary hover:underline underline-offset-4" data-testid="link-reset">
                    7-Day Redundancy Reset — written support after redundancy
                  </Link>
                  <span className="text-muted-foreground/30">·</span>
                  <Link href="/" className="text-primary hover:underline underline-offset-4" data-testid="link-home">
                    RedundancyCalculatorUK home
                  </Link>
                </div>
              </div>

            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
