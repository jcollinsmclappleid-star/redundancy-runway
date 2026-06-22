import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Scale, Info, Calculator } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";

export default function VoluntaryRedundancyPage() {
  return (
    <>
      <Helmet>
        <title>Should I Take Voluntary Redundancy? A UK Financial Planning Guide | RedundancyCalculatorUK</title>
        <meta name="description" content="How voluntary redundancy compares to statutory entitlement, what the financial runway implications are, and how to model the decision before accepting. Not financial advice." />
        <link rel="canonical" href="https://redundancycalculatoruk.com/voluntary-redundancy" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Should I Take Voluntary Redundancy? A UK Financial Planning Guide" />
        <meta property="og:description" content="How voluntary redundancy compares to statutory entitlement, what the financial runway implications are, and how to model the decision before accepting." />
        <meta property="og:url" content="https://redundancycalculatoruk.com/voluntary-redundancy" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Should I Take Voluntary Redundancy? A UK Financial Planning Guide" />
        <meta name="twitter:description" content="How voluntary redundancy compares to statutory entitlement, what the financial runway implications are, and how to model the decision before accepting." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Should I Take Voluntary Redundancy? A UK Financial Planning Guide",
          "description": "How voluntary redundancy compares to statutory entitlement, the financial runway implications, and how to model the decision before accepting.",
          "publisher": { "@type": "Organization", "name": "RedundancyCalculatorUK", "url": "https://redundancycalculatoruk.com" },
          "dateModified": "2025-04-01",
          "mainEntityOfPage": "https://redundancycalculatoruk.com/voluntary-redundancy"
        })}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />

        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <Logo />
            <Link href="/wizard">
              <Button size="sm" data-testid="button-header-cta">
                Compare my VR package
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
                Should I Take Voluntary Redundancy? A UK Financial Planning Guide
              </h1>
              <p className="text-primary-foreground/75 text-base leading-relaxed max-w-2xl">
                Voluntary redundancy can look attractive on the surface — a larger-than-statutory package, a chance to leave on your own terms. But the financial runway implications depend entirely on your individual circumstances. This guide explains what to model before you decide.
              </p>
              <p className="text-primary-foreground/50 text-xs mt-4">
                This is contextual information only. It is not financial, legal or employment advice. RedundancyCalculatorUK is a non-advisory modelling tool.
              </p>
            </div>
          </section>

          <Card className="mx-6 max-w-3xl mt-6 lg:mx-auto bg-amber-50/70 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800" data-testid="card-disclaimer">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Important: </span>
                  Voluntary redundancy decisions have financial, legal and employment implications. This tool provides illustrative financial modelling only. Consult an employment solicitor, financial adviser or ACAS before accepting any package.
                </p>
              </div>
            </CardContent>
          </Card>

          <section className="py-12 px-6" data-testid="section-content">
            <div className="max-w-3xl mx-auto space-y-10">

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">What is voluntary redundancy?</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Voluntary redundancy (VR) occurs when an employer offers employees the option to leave in exchange for a redundancy payment, typically as part of a headcount reduction exercise. Unlike compulsory redundancy, you choose to apply — which means the decision is yours to make with full knowledge of the financial implications.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  VR packages almost always include at least the statutory redundancy entitlement, but often offer more — either as a multiplier of the statutory amount or as a fixed enhanced payment. The key question is whether the package offered is sufficient to bridge the income gap until you return to equivalent earnings.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">VR vs. statutory: the comparison that matters</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  The first financial modelling step is comparing the VR package to your statutory entitlement:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse" data-testid="table-vr-comparison">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium border-b">Factor</th>
                        <th className="text-left p-3 font-medium border-b">Statutory redundancy</th>
                        <th className="text-left p-3 font-medium border-b">Typical VR enhancement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Basis", "Age-band multiplier × years × capped weekly pay", "Often 1.5x–3x statutory, or fixed lump sum"],
                        ["Tax treatment", "Up to £30,000 generally tax-free", "Same — excess over £30,000 taxed"],
                        ["Negotiability", "Fixed by law — no negotiation", "Often negotiable depending on employer and role"],
                        ["Notice period", "Separate — still applies", "Sometimes includes PILON (paid notice)"],
                      ].map((row, i) => (
                        <tr key={i} className={`border-b ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                          {row.map((cell, j) => <td key={j} className="p-3">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Illustrative comparisons. Actual terms depend on your employer, contract and individual circumstances.</p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">The runway question: is the package enough?</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  The package figure is only meaningful in the context of your monthly costs and expected time to re-employment. Consider:
                </p>
                <div className="space-y-3">
                  {[
                    { title: "Capital to burn rate ratio", body: "The VR payment, combined with your existing savings, needs to cover your monthly burn rate (expenses minus any gap income) for the expected duration of your job search — plus a safety margin." },
                    { title: "Income recovery timeline", body: "If you work in a sector or role where re-employment typically takes 3 months, a VR package covering 6 months of living costs gives clear headroom. If re-employment typically takes longer, the same package looks very different." },
                    { title: "Income recovery level", body: "Voluntary redundancy is sometimes taken as an opportunity to change direction. If the new role or sector pays less, the model needs to account for a lower recovery income — which extends the effective burn period." },
                    { title: "Household vs. individual", body: "A couple where one partner's income continues has a structurally different position from a single-income household. The runway calculator models partner income separately." },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted/30" data-testid={`factor-${i}`}>
                      <p className="text-sm font-medium mb-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Negotiating a VR package</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Unlike statutory redundancy, VR packages are often negotiable. Things that may be worth raising with your employer:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "The base multiplier (e.g. 2x rather than 1.5x statutory)",
                    "A gardening leave period rather than immediate departure",
                    "Outplacement support (career coaching, CV assistance)",
                    "Whether the settlement agreement covers any existing disputes or grievances",
                    "The payment timeline — a single lump sum vs. phased payments has tax implications",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Card className="mt-4 bg-muted/30 border-muted">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-2">
                      <Scale className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        If a settlement agreement is involved, you are legally required to receive independent legal advice before signing. Your employer is typically required to contribute to the cost of that advice.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">How to model a VR decision</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  RedundancyCalculatorUK includes a voluntary redundancy comparison in the full private report. To use it:
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground list-none">
                  {[
                    "In the Context step, select 'Considering voluntary redundancy' as your situation.",
                    "In the Redundancy Package step, enter your statutory entitlement details as normal.",
                    "An additional field appears: 'Voluntary redundancy offer amount'. Enter the VR package total.",
                    "The full report shows both the statutory runway and the VR runway side by side, under the same income and expense assumptions.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>

              <Card className="bg-primary text-primary-foreground" data-testid="card-cta">
                <CardContent className="pt-8 pb-8 text-center">
                  <Calculator className="w-8 h-8 mx-auto mb-4 opacity-80" />
                  <h3 className="font-serif text-xl font-bold mb-2">Compare your VR package against statutory</h3>
                  <p className="text-primary-foreground/75 text-sm mb-6 max-w-sm mx-auto">
                    Enter your package details and model how the VR offer and your statutory entitlement compare under your own expense and income assumptions.
                  </p>
                  <Link href="/wizard">
                    <Button className="bg-white text-primary hover:bg-white/90 font-semibold" data-testid="button-cta-calculator">
                      Start the free calculator
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-primary-foreground/50 mt-3">Illustrative projections based on your assumptions. Not financial or legal advice.</p>
                </CardContent>
              </Card>

            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
