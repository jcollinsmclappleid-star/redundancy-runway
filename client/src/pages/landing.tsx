import { Helmet } from "react-helmet-async";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Lock,
  ChevronDown,
  Calculator,
  TrendingDown,
  Layers,
  Check,
  ShieldCheck,
  BarChart2,
  Home,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <>
      <Helmet>
        <title>RedundancyCalculatorUK | UK Statutory Redundancy Pay & Runway Calculator</title>
        <meta name="description" content="Calculate your UK statutory redundancy pay and model how long your money may last. Free redundancy runway report with mortgage sensitivity, income scenarios and expense analysis. Not financial advice." />
        <link rel="canonical" href="https://redundancycalculatoruk.com/" />
        <meta property="og:title" content="RedundancyCalculatorUK | UK Statutory Redundancy Pay & Runway Calculator" />
        <meta property="og:description" content="Calculate your UK statutory redundancy pay and model how long your money may last. Free redundancy runway report with mortgage sensitivity, income scenarios and expense analysis." />
        <meta property="og:url" content="https://redundancycalculatoruk.com/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "RedundancyCalculatorUK",
          "url": "https://redundancycalculatoruk.com",
          "description": "UK statutory redundancy pay calculator and financial runway modelling tool. Model how long your money may last under different income recovery scenarios.",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": [
            { "@type": "Offer", "price": "0", "priceCurrency": "GBP", "name": "Free Preview" },
            { "@type": "Offer", "price": "39", "priceCurrency": "GBP", "name": "Private Runway Report" }
          ],
          "provider": { "@type": "Organization", "name": "RedundancyCalculatorUK", "url": "https://redundancycalculatoruk.com" }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Is this financial advice?", "acceptedAnswer": { "@type": "Answer", "text": "No. RedundancyCalculatorUK is a non-advisory modelling tool. It produces illustrative projections based on assumptions you enter. It does not constitute financial, legal, tax, employment, debt, or benefits advice." } },
            { "@type": "Question", "name": "Is statutory redundancy pay included?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The calculator uses current UK statutory redundancy rules including age-band multipliers (0.5x, 1x and 1.5x weeks per year of service), the £643 weekly pay cap, and the 20-year service cap." } },
            { "@type": "Question", "name": "Is my data private?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. All financial calculations run entirely in your browser. No sensitive financial data is transmitted to or stored on servers." } }
          ]
        })}</script>
      </Helmet>
    <div className="min-h-screen flex flex-col">
      <DisclaimerBanner />

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b" data-testid="header-landing">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
          <Logo showTagline />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => navigate("/wizard")} data-testid="button-header-start">
              Build my private report
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 sm:py-28 px-6 bg-primary overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
        <div className="max-w-3xl mx-auto relative text-center">
          <Badge
            className="mb-6 bg-white/15 text-primary-foreground border-white/20 hover:bg-white/15"
            data-testid="badge-status"
          >
            Private Redundancy Runway Report
          </Badge>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight text-primary-foreground">
            Model how long your
            <br />
            money may last if
            <br />
            work changes.
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8 leading-relaxed">
            Build a private redundancy runway report for redundancy, restructuring, voluntary redundancy,
            AI-related uncertainty, mortgage pressure or a slower return to work.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
              onClick={() => navigate("/wizard")}
              data-testid="button-start-model"
            >
              Build my private report
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              onClick={() => {
                document.getElementById("report-contents")?.scrollIntoView({ behavior: "smooth" });
              }}
              data-testid="button-see-pricing"
            >
              See what the report includes
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <p className="text-xs text-primary-foreground/60">
            Your financial inputs are used to build the model. The report is assumption-based and does not provide financial, legal, tax or employment advice.
          </p>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-5 px-6 border-b bg-muted/40" data-testid="section-trust">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {[
              { icon: Calculator, label: "UK statutory redundancy assumptions", sub: "Age-band multipliers, £643/wk cap" },
              { icon: ShieldCheck, label: "Private, assumption-based modelling", sub: "Your data stays in your browser" },
              { icon: Home, label: "Mortgage and household scenarios", sub: "Housing pressure and partner income" },
              { icon: FileText, label: "One-off report access", sub: "£39 · no subscription" },
              { icon: BarChart2, label: "Non-advisory tool", sub: "Planning model, not financial advice" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3" data-testid={`trust-signal-${i}`}>
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-16 px-6 bg-background" data-testid="section-problem">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-5">
            Redundancy is not just a payout question. It is a runway question.
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base max-w-2xl mx-auto mb-6">
            A redundancy package can look manageable on day one. The harder question is how it behaves over time: if a new role takes longer than expected, if mortgage or rent still needs paying, if replacement income is lower, or if the household temporarily relies on one income.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base max-w-2xl mx-auto">
            RedundancyCalculatorUK helps you model that picture privately — under your own assumptions, before speaking to a financial adviser, solicitor, or anyone else.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-muted/20" data-testid="section-how-it-works">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Three steps to your private report.
            </p>
          </div>
          <div className="relative">
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1.25rem)] right-[calc(16.67%+1.25rem)] h-px bg-border" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Tell us your situation",
                  desc: "Enter your redundancy package, savings, income assumptions and monthly costs. UK statutory redundancy calculation is built in.",
                  icon: Calculator,
                },
                {
                  step: "2",
                  title: "Build your report",
                  desc: "See your baseline runway, capital path over time, and how the model changes under different income recovery assumptions.",
                  icon: TrendingDown,
                },
                {
                  step: "3",
                  title: "Explore the scenarios",
                  desc: "Compare stress cases, mortgage pressure, household resilience, voluntary redundancy alternatives and expense sensitivity — all in one private report.",
                  icon: Layers,
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center" data-testid={`card-step-${item.step}`}>
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mb-5 relative z-10 shadow-md">
                    {item.step}
                  </div>
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Report contents & scenario examples */}
      <section className="py-16 px-6 bg-primary" id="report-contents" data-testid="section-product-preview">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-3">
              What your private report includes.
            </h2>
            <p className="text-primary-foreground/70 text-sm max-w-md mx-auto">
              Free preview gives you the baseline. The full report unlocks the scenarios that matter most.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
            <Card className="bg-white/10 border-white/15 text-primary-foreground" data-testid="preview-free-card">
              <CardContent className="pt-6 pb-6">
                <Badge className="mb-4 bg-white/15 text-primary-foreground border-white/20 text-xs">Free Preview</Badge>
                <div className="mb-4">
                  <p className="text-xs text-primary-foreground/60 mb-1">Baseline runway estimate</p>
                  <p className="font-serif text-4xl font-bold">18 months</p>
                </div>
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">Watch · 61/100</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "3 months", value: "£34,200" },
                    { label: "6 months", value: "£26,800" },
                    { label: "12 months", value: "£12,100" },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/5 rounded-md p-2 text-center">
                      <p className="text-xs text-primary-foreground/50 mb-0.5">{item.label}</p>
                      <p className="text-xs font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/15 text-primary-foreground" data-testid="preview-full-card">
              <CardContent className="pt-6 pb-6">
                <Badge className="mb-4 bg-white/15 text-primary-foreground border-white/20 text-xs">Private Runway Report — £39</Badge>
                <ul className="space-y-2">
                  {[
                    "Statutory redundancy estimate",
                    "Starting capital and monthly burn",
                    "Baseline, slow and severe scenarios",
                    "Mortgage and housing pressure test",
                    "Household one-income resilience view",
                    "Expense sensitivity ranking",
                    "Month-by-month capital path",
                    "Voluntary redundancy comparison",
                    "Structural transition scenario",
                    "Partner discussion summary",
                    "Exportable private report",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-primary-foreground/80">
                      <div className="w-1 h-1 rounded-full bg-primary-foreground/40 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Scenario examples */}
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-primary-foreground/70 text-sm mb-6 font-medium">Scenarios the report models</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  label: "Baseline",
                  desc: "Your entered assumptions. How long the money lasts at current burn rate.",
                },
                {
                  label: "Slow recovery",
                  desc: "If a new role takes longer than expected. How much runway changes under a later return to income.",
                },
                {
                  label: "Mortgage / rent pressure",
                  desc: "If housing costs increase. How a rate rise or rent review affects the capital path.",
                },
                {
                  label: "Household one-income",
                  desc: "If one partner's income is temporarily the only income. How that changes the runway.",
                },
                {
                  label: "Voluntary redundancy",
                  desc: "If a VR package is on the table. How it compares to statutory entitlement under these assumptions.",
                },
                {
                  label: "Structural transition",
                  desc: "Models a slower or lower-income recovery path. This does not predict job outcomes — it simply applies a structural transition assumption to the model.",
                },
              ].map((scenario, i) => (
                <div
                  key={i}
                  className="bg-white/8 border border-white/15 rounded-lg p-4"
                  data-testid={`scenario-card-${i}`}
                >
                  <p className="text-xs font-semibold text-primary-foreground mb-1.5">{scenario.label}</p>
                  <p className="text-xs text-primary-foreground/65 leading-relaxed">{scenario.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
              onClick={() => navigate("/wizard")}
              data-testid="button-preview-cta"
            >
              Build my private report
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 bg-muted/30" id="pricing" data-testid="section-pricing">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Choose your access level</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Start free. Unlock the full private report for a one-off payment — no subscription.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto items-start">
            <Card className="border-border" data-testid="card-free-tier">
              <CardContent className="pt-8 pb-8">
                <div className="mb-6">
                  <div className="text-xl font-bold">Free Preview</div>
                  <p className="text-sm text-muted-foreground mt-1">No account required</p>
                </div>
                <ul className="space-y-3 mb-8 text-sm">
                  {[
                    "Statutory redundancy estimate",
                    "Runway estimate in months",
                    "Stability classification (0–100)",
                    "Capital at 3 / 6 / 12 months",
                    "Essential-only spending insight",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" onClick={() => navigate("/wizard")} data-testid="button-start-free">
                  Build my private report — Free Preview
                </Button>
              </CardContent>
            </Card>

            <div className="relative" data-testid="card-paid-tier-wrapper">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium shadow-sm">
                  Full Report
                </Badge>
              </div>
              <Card className="ring-2 ring-primary shadow-lg">
                <CardContent className="pt-8 pb-8">
                  <div className="mb-6">
                    <div className="text-3xl font-bold">£39</div>
                    <p className="text-sm text-muted-foreground mt-1">One-off payment. 6 months access.</p>
                  </div>
                  <ul className="space-y-3 mb-8 text-sm">
                    {[
                      { text: "Everything in free preview", locked: false },
                      { text: "Slow and severe scenarios", locked: true },
                      { text: "Mortgage / housing pressure test", locked: true },
                      { text: "Household resilience view", locked: true },
                      { text: "Expense sensitivity ranking", locked: true },
                      { text: "Month-by-month capital path", locked: true },
                      { text: "Voluntary redundancy comparison", locked: true },
                      { text: "Structural transition scenario", locked: true },
                      { text: "Exportable private report", locked: true },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {item.locked ? (
                          <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        ) : (
                          <Check className="w-3.5 h-3.5 shrink-0 text-primary" />
                        )}
                        <span className={item.locked ? "text-muted-foreground text-sm" : "text-sm font-medium"}>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full font-semibold" onClick={() => navigate("/wizard")} data-testid="button-start-paid">
                    Unlock my private report — £39
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    No subscription. No recurring charges.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Day Redundancy Reset teaser */}
      <section className="py-16 px-6 border-y" data-testid="section-reset-teaser">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
            Need help after seeing your result?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3 text-sm">
            Your report can show how long your money may last. The 7-Day Redundancy Reset helps you organise what to do next.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
            Share what's going on, choose WhatsApp or private web-chat style intake, and receive a calm written response plus a practical 7-day plan. No calls. No judgement. No open-ended subscription.
          </p>
          <Link href="/redundancy-reset" data-testid="button-reset-cta">
            <Button variant="outline" asChild={false}>
              Start a 7-Day Redundancy Reset
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            Practical written support only. Not financial, legal, debt, employment, medical or mental health advice.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6" data-testid="section-faq">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">Common questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Is this financial advice?",
                a: "No. RedundancyCalculatorUK is a non-advisory modelling tool. It produces illustrative projections based entirely on the assumptions you enter. It does not constitute financial, legal, tax, employment, debt, or benefits advice. All outputs are estimates and may not reflect actual outcomes.",
              },
              {
                q: "Does this predict whether I will find work?",
                a: "No. The tool uses historical UK labour market percentiles as reference data to model reemployment timelines, but it does not predict individual job search outcomes. Projected timelines are illustrative only and should be treated as planning assumptions, not forecasts.",
              },
              {
                q: "Is my data private?",
                a: "Yes. All financial calculations run entirely in your browser. No sensitive financial data is transmitted to or stored on our servers. We only store a session token to manage access to paid report features.",
              },
              {
                q: "Is statutory redundancy pay included?",
                a: "Yes. The calculator uses current UK statutory redundancy rules, including age-band multipliers (0.5x, 1x and 1.5x weeks per year of service), the £643 weekly pay cap, and the 20-year service cap. A two-year qualifying service minimum applies. The tool also separates statutory redundancy pay — which is generally tax-free up to £30,000 — from notice pay and holiday pay, which are subject to income tax. Last checked: April 2025.",
              },
              {
                q: "Can I model voluntary redundancy?",
                a: "Yes. The paid report includes a voluntary redundancy comparison scenario. You can enter a VR package amount alongside your statutory entitlement and see how each affects the runway under these assumptions.",
              },
              {
                q: "Can I use this with my partner?",
                a: "Yes. The income recovery step includes an optional partner income field. Enabling this adds partner monthly net income to the household runway model, which is useful for couples or households where one partner's income may continue during a period of disruption.",
              },
              {
                q: "What does the paid report unlock?",
                a: "The full Private Runway Report (£39, one-off) unlocks: slow and severe income scenarios, mortgage and housing pressure test, household resilience view, expense sensitivity ranking, month-by-month capital path, voluntary redundancy comparison, structural transition scenario, partner discussion summary, and exportable report. Access lasts 6 months.",
              },
              {
                q: "Is this a subscription?",
                a: "No. Both the Private Runway Report (£39) and the 7-Day Redundancy Reset (£79 launch / £99 standard) are one-off payments. There are no recurring charges.",
              },
              {
                q: "What is the 7-Day Redundancy Reset?",
                a: "The 7-Day Redundancy Reset is a separate one-off paid product for people who have completed the runway calculator and want help understanding what to do next. You receive a guided private written intake, a first written response within 1 working day, a follow-up check-in, and a final Redundancy Next-Step Plan. Intake is by WhatsApp or secure web-chat style. No calls.",
              },
              {
                q: "Is the 7-Day Redundancy Reset advice?",
                a: "No. The Reset provides practical written support and planning only. It is not financial advice, legal advice, debt advice, employment law advice, therapy, counselling, crisis support, medical advice or a guarantee of income, employment or outcomes.",
              },
              {
                q: "Is WhatsApp live chat?",
                a: "No. WhatsApp is offered as a convenient intake and response channel only. It is not a live chat service. The first written response is delivered within 1 working day of intake submission. There is no promise of unlimited messaging or real-time responses.",
              },
              {
                q: "Can I get a refund for the Reset?",
                a: "If the full Private Runway Report does not add meaningful clarity beyond the free preview, contact support within 7 days. For the 7-Day Redundancy Reset, please refer to the product page for full refund terms.",
              },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base" data-testid={`faq-trigger-${i}`}>
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-primary" data-testid="section-bottom-cta">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Model your runway now.
          </h2>
          <p className="text-primary-foreground/70 mb-8 text-sm">
            Free preview in minutes. Full private report unlocked for £39.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-md"
              onClick={() => navigate("/wizard")}
              data-testid="button-bottom-cta"
            >
              Build my private report — Free Preview
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              onClick={() => navigate("/wizard")}
              data-testid="button-bottom-cta-paid"
            >
              Unlock my private report — £39
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
}
