import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Home, TrendingDown, Info } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";
import { formatGBP, UK_STATUTORY_REDUNDANCY } from "@/lib/engine";

export default function RedundancyMortgagePage() {
  return (
    <>
      <Helmet>
        <title>Redundancy and Your Mortgage: What to Model Before You Panic | RedundancyCalculatorUK</title>
        <meta name="description" content="How redundancy affects your mortgage — what to consider around payment holidays, rate exposure and capital runway. Model your own housing scenario with the free UK redundancy calculator." />
        <link rel="canonical" href="https://redundancycalculatoruk.co.uk/redundancy-mortgage" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="RedundancyCalculatorUK" />
        <meta property="og:title" content="Redundancy and Your Mortgage: What to Model Before You Panic" />
        <meta property="og:description" content="How redundancy affects your mortgage — what to consider around payment holidays, rate exposure and capital runway. Model your own housing scenario with the free UK redundancy calculator." />
        <meta property="og:url" content="https://redundancycalculatoruk.co.uk/redundancy-mortgage" />
        <meta property="og:image" content="https://redundancycalculatoruk.co.uk/og-image.png" />
        <meta name="twitter:image" content="https://redundancycalculatoruk.co.uk/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Redundancy and Your Mortgage: What to Model Before You Panic" />
        <meta name="twitter:description" content="How redundancy affects your mortgage — what to consider around payment holidays, rate exposure and capital runway." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Redundancy and Your Mortgage: What to Model Before You Panic",
          "description": "How redundancy affects your mortgage — payment holidays, rate exposure and capital runway modelling.",
          "publisher": { "@type": "Organization", "name": "RedundancyCalculatorUK", "url": "https://redundancycalculatoruk.co.uk" },
          "dateModified": "2025-04-01",
          "mainEntityOfPage": "https://redundancycalculatoruk.co.uk/redundancy-mortgage"
        })}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />

        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <Logo />
            <Link href="/wizard">
              <Button size="sm" data-testid="button-header-cta">
                Model my mortgage scenario
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
                Redundancy and Your Mortgage: What to Model Before You Panic
              </h1>
              <p className="text-primary-foreground/75 text-base leading-relaxed max-w-2xl">
                For homeowners, the mortgage is usually the single biggest fixed cost in a redundancy scenario. Understanding how it interacts with your capital runway — and what options may exist — is one of the most practical things you can do before making any decisions.
              </p>
              <p className="text-primary-foreground/50 text-xs mt-4">
                This is contextual information only. It is not financial, legal or mortgage advice. Speak to your lender or a qualified mortgage adviser for guidance specific to your circumstances.
              </p>
            </div>
          </section>

          <Card className="mx-6 max-w-3xl mt-6 lg:mx-auto bg-amber-50/70 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800" data-testid="card-disclaimer">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Important: </span>
                  Mortgage arrangements vary significantly between lenders and products. Always speak directly to your lender before missing a payment. This page provides general contextual information only, last reviewed {UK_STATUTORY_REDUNDANCY.lastChecked}.
                </p>
              </div>
            </CardContent>
          </Card>

          <section className="py-12 px-6" data-testid="section-content">
            <div className="max-w-3xl mx-auto space-y-10">

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Why housing costs matter more than almost any other expense</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  In a redundancy scenario, your monthly burn rate determines how long your capital lasts. For most UK households with a mortgage, housing is the single largest fixed monthly cost — often representing 30–50% of essential outgoings. Unlike discretionary spending, it cannot easily be reduced short-term.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This means a mortgage does two things in the model: it sets a high floor on your minimum monthly spend, and it creates sensitivity to any rate change that could increase it further. The redundancy calculator includes a mortgage sensitivity module for this reason — so you can see the capital path impact of a rate rise before it happens.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Payment holidays: what they are and what they are not</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  A mortgage payment holiday allows you to temporarily pause or reduce your monthly payments, usually with lender agreement. Key points to understand before approaching your lender:
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    { title: "Interest continues to accrue", body: "During a payment holiday, interest does not stop. It accumulates on the outstanding balance, meaning your total debt increases. This increases future monthly payments once the holiday ends." },
                    { title: "Lender discretion", body: "Payment holidays are not a legal right — they are offered at the lender's discretion. Many UK lenders introduced them widely during COVID-19, but availability and terms vary. You must apply and be approved." },
                    { title: "Credit file impact", body: "A mortgage payment holiday agreed with your lender should not affect your credit file. Missing payments without agreement will." },
                    { title: "Not a solution — a buffer", body: "A payment holiday buys time but increases total cost. Use it as a bridge if your runway model shows you returning to income within the holiday period." },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30" data-testid={`point-${i}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-sm mb-0.5">{item.title}</p>
                        <p className="text-xs">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Rate sensitivity: what a 1% or 2% rise does to your runway</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  For tracker mortgage holders or those approaching a fixed-rate end date, a rate increase directly increases the monthly burn rate. The impact compounds over a multi-month redundancy period.
                </p>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm border-collapse" data-testid="table-rate-sensitivity">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium border-b">Current monthly mortgage</th>
                        <th className="text-left p-3 font-medium border-b">+1% rate rise (illustrative)</th>
                        <th className="text-left p-3 font-medium border-b">+2% rate rise (illustrative)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["£800/mo", "~£850–£900/mo", "~£900–£960/mo"],
                        ["£1,200/mo", "~£1,270–£1,350/mo", "~£1,340–£1,440/mo"],
                        ["£1,800/mo", "~£1,900–£2,020/mo", "~£2,000–£2,160/mo"],
                      ].map((row, i) => (
                        <tr key={i} className={`border-b ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                          {row.map((cell, j) => <td key={j} className="p-3">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground">
                  Illustrative figures only. Actual impact depends on remaining term, outstanding balance and mortgage type. Use the runway calculator to model your specific figures.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Fixed-rate end dates and redundancy timing</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  If your fixed rate ends during or shortly after a redundancy period, the potential rate change adds a second layer of risk to the capital projection. The runway calculator allows you to enter a custom housing cost increase, which is useful for modelling this scenario:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Enter your current mortgage payment as the monthly housing cost in the expenses step.",
                    "Use the mortgage sensitivity module in the full report to see capital paths at +1%, +2% and a custom percentage.",
                    "Compare the runway under the current rate vs. the expected new rate to understand the gap.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Renters and redundancy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Renters face different but equally significant housing risk. Rent is typically fixed by contract term, but a lease renewal that coincides with an income gap could mean a rent increase at the worst possible time. Renters can use the custom housing cost field in the runway calculator to model a projected rent increase alongside their redundancy scenario.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">What to do first</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Before contacting your lender, it is worth modelling your position so you understand what you are asking for and why. Specifically:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { step: "1", title: "Model your runway", desc: "Enter your redundancy package and expenses to see how long capital may last at current burn rate." },
                    { step: "2", title: "Test rate sensitivity", desc: "Use the mortgage sensitivity module to understand the impact of a rate change on your capital path." },
                    { step: "3", title: "Contact your lender", desc: "With a clear picture of your position, speak to your lender about options available to you." },
                  ].map((item) => (
                    <div key={item.step} className="rounded-lg bg-muted/30 p-4" data-testid={`step-${item.step}`}>
                      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mb-2">{item.step}</div>
                      <p className="text-sm font-medium mb-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-primary text-primary-foreground" data-testid="card-cta">
                <CardContent className="pt-8 pb-8 text-center">
                  <Home className="w-8 h-8 mx-auto mb-4 opacity-80" />
                  <h3 className="font-serif text-xl font-bold mb-2">Model your mortgage scenario</h3>
                  <p className="text-primary-foreground/75 text-sm mb-6 max-w-sm mx-auto">
                    Enter your situation including mortgage or rent, and the full report includes a mortgage sensitivity analysis showing capital paths at +1%, +2% and custom rate rises.
                  </p>
                  <Link href="/wizard">
                    <Button className="bg-white text-primary hover:bg-white/90 font-semibold" data-testid="button-cta-calculator">
                      Start the free runway calculator
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-primary-foreground/50 mt-3">Illustrative projections based on your assumptions. Not financial or mortgage advice.</p>
                </CardContent>
              </Card>

              <div className="border-t pt-6" data-testid="section-related-links">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">Related guides</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <Link href="/statutory-redundancy-pay-calculator" data-testid="link-guide-statutory">
                    <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                      <p className="text-sm font-medium mb-1">Statutory Redundancy Pay 2025</p>
                      <p className="text-xs text-muted-foreground">Age-band multipliers, the {formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)} weekly cap, tax treatment and service limits.</p>
                    </div>
                  </Link>
                  <Link href="/voluntary-redundancy-calculator" data-testid="link-guide-vr">
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
