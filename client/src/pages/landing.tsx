import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Menu,
  X,
  Users,
  Repeat,
  TrendingUp,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { RunwayCommandCentrePreview } from "@/components/RunwayCommandCentrePreview";
import { LandingDashboardShowcase } from "@/components/landing-dashboard-showcase";
import { BriefExampleEmbed } from "@/components/private-runway-brief/BriefExampleEmbed";
import { LandingHeroScene } from "@/components/landing-hero-scene";
import { heroTheme } from "@/lib/chart-theme";
import {
  COMMAND_CENTRE_NAME,
  PRODUCT_COPY,
  RUNWAY_BRIEF_NAME,
  RUNWAY_REPORT_FULL,
  RUNWAY_REPORT_PRICE_GBP,
} from "@shared/product";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Scenarios", href: "#scenarios" },
  { label: "Pricing", href: "#pricing" },
  { label: "Guides", href: "/statutory-redundancy-pay-calculator", external: true },
  { label: "About", href: "/about", external: true },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>RedundancyCalculatorUK | UK Statutory Redundancy Pay & Runway Calculator</title>
        <meta name="description" content="Calculate your UK statutory redundancy pay and model how long your money may last. Free redundancy runway report with mortgage sensitivity, income scenarios and expense analysis. Not financial advice." />
        <link rel="canonical" href="https://redundancycalculatoruk.co.uk/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RedundancyCalculatorUK" />
        <meta property="og:title" content="RedundancyCalculatorUK | UK Statutory Redundancy Pay & Runway Calculator" />
        <meta property="og:description" content="Calculate your UK statutory redundancy pay and model how long your money may last. Free redundancy runway report with mortgage sensitivity, income scenarios and expense analysis." />
        <meta property="og:url" content="https://redundancycalculatoruk.co.uk/" />
        <meta property="og:image" content="https://redundancycalculatoruk.co.uk/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RedundancyCalculatorUK | UK Statutory Redundancy Pay & Runway Calculator" />
        <meta name="twitter:description" content="Calculate your UK statutory redundancy pay and model how long your money may last. Free redundancy runway report with mortgage sensitivity, income scenarios and expense analysis." />
        <meta name="twitter:image" content="https://redundancycalculatoruk.co.uk/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "Organization",
          "name": "RedundancyCalculatorUK", "url": "https://redundancycalculatoruk.co.uk",
          "description": "UK statutory redundancy pay calculator and financial runway modelling tool."
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "WebApplication",
          "name": "RedundancyCalculatorUK", "url": "https://redundancycalculatoruk.co.uk",
          "applicationCategory": "FinanceApplication", "operatingSystem": "Web",
          "offers": [
            { "@type": "Offer", "price": "0", "priceCurrency": "GBP", "name": "Free Preview" },
            { "@type": "Offer", "price": "39", "priceCurrency": "GBP", "name": "Private Redundancy Runway Report" }
          ],
          "provider": { "@type": "Organization", "name": "RedundancyCalculatorUK", "url": "https://redundancycalculatoruk.co.uk" }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Is this financial advice?", "acceptedAnswer": { "@type": "Answer", "text": "No. RedundancyCalculatorUK is a non-advisory modelling tool. All outputs are estimates and may not reflect actual outcomes." } },
            { "@type": "Question", "name": "Is my data private?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. All financial calculations run entirely in your browser. No sensitive financial data is stored on our servers." } },
            { "@type": "Question", "name": "Is statutory redundancy pay included?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The calculator uses current UK statutory redundancy rules including age-band multipliers, service caps and the current weekly pay cap." } },
            { "@type": "Question", "name": "What does the paid report unlock?", "acceptedAnswer": { "@type": "Answer", "text": `The full ${RUNWAY_REPORT_FULL} (£${RUNWAY_REPORT_PRICE_GBP}, one-off) unlocks slow and severe scenarios, mortgage pressure test, household resilience view, expense sensitivity ranking, month-by-month capital path, VR comparison, structural transition scenario, and exportable report.` } },
            { "@type": "Question", "name": "Is this a subscription?", "acceptedAnswer": { "@type": "Answer", "text": `No. Both the ${RUNWAY_REPORT_FULL} and the 7-Day Redundancy Reset are one-off payments. No recurring charges.` } }
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50 backdrop-blur-md border-b"
          style={{ background: heroTheme.gradientHeader, borderColor: heroTheme.border }}
          data-testid="header-landing"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-5 py-4 sm:py-5">
            <Logo light />
            <nav className="hidden md:flex items-center gap-6" data-testid="nav-desktop">
              {NAV_LINKS.map((link) =>
                link.external ? (
                  <Link key={link.label} href={link.href}
                    className="text-sm font-medium transition-colors hover:text-white"
                    style={{ color: heroTheme.textMuted }}
                    data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}>
                    {link.label}
                  </Link>
                ) : (
                  <button key={link.label}
                    onClick={() => scrollTo(link.href.replace("#", ""))}
                    className="text-sm font-medium transition-colors hover:text-white"
                    style={{ color: heroTheme.textMuted }}
                    data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}>
                    {link.label}
                  </button>
                )
              )}
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle onDark />
              <Button size="sm" className="btn-gold rounded-full px-5 hidden sm:flex"
                onClick={() => navigate("/wizard")} data-testid="button-header-start">
                {PRODUCT_COPY.buildCta} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
              <button className="md:hidden p-1" style={{ color: heroTheme.textMuted }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu" aria-label="Toggle navigation">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden border-t px-5 py-4 flex flex-col gap-3"
              style={{ background: heroTheme.navy, borderColor: heroTheme.border }}
              data-testid="nav-mobile">
              {NAV_LINKS.map((link) =>
                link.external ? (
                  <Link key={link.label} href={link.href}
                    className="text-sm py-1" style={{ color: "hsl(215 15% 60%)" }}
                    onClick={() => setMobileMenuOpen(false)}>{link.label}</Link>
                ) : (
                  <button key={link.label}
                    onClick={() => { scrollTo(link.href.replace("#", "")); setMobileMenuOpen(false); }}
                    className="text-sm py-1 text-left" style={{ color: "hsl(215 15% 60%)" }}>
                    {link.label}
                  </button>
                )
              )}
              <Button size="sm" className="btn-gold rounded-full mt-2"
                onClick={() => { navigate("/wizard"); setMobileMenuOpen(false); }}
                data-testid="button-mobile-cta">
                {PRODUCT_COPY.buildCta} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          )}
        </header>

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <section data-testid="section-hero" className="relative overflow-hidden" style={{ background: heroTheme.navy }}>
          <div className="max-w-6xl mx-auto">
            {/* Text block — solid navy, no landscape bleed */}
            <div className="relative z-10 px-5 pt-10 pb-6 md:pt-16 md:pb-8 md:flex md:items-start md:gap-12">
              <div className="md:flex-1 md:max-w-xl">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 border"
                  style={{ borderColor: "hsl(192 55% 42%)", background: "hsl(192 55% 22% / 0.35)" }}
                  data-testid="hero-eyebrow"
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-teal-400" />
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-teal-200/90">
                    PRIVATE · ASSUMPTION-BASED · UK FOCUSED
                  </span>
                </div>

                <h1
                  className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-white mb-4"
                  data-testid="hero-headline"
                >
                  {PRODUCT_COPY.heroH1}
                </h1>

                <p className="text-base leading-relaxed mb-6 lg:max-w-lg text-slate-300" data-testid="hero-subheadline">
                  {PRODUCT_COPY.heroSub}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <Button
                    size="lg"
                    className="btn-gold rounded-full px-7 text-base w-full sm:w-auto"
                    onClick={() => navigate("/wizard")}
                    data-testid="button-hero-primary"
                  >
                    {PRODUCT_COPY.buildCta} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-7 text-base w-full sm:w-auto hover:text-white hover:bg-white/10 border-white/25 text-slate-300"
                    onClick={() => scrollTo("pricing")}
                    data-testid="button-hero-secondary"
                  >
                    See what the private report includes <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="flex items-start gap-2 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-500" />
                  <p className="text-xs leading-relaxed text-slate-500">
                    {PRODUCT_COPY.trustLine} · Your data stays in your browser. Not financial advice.
                  </p>
                </div>
              </div>

              {/* Desktop runway scene — right column */}
              <div className="hidden md:block md:flex-1 md:min-w-0">
                <LandingHeroScene variant="desktop" />
              </div>
            </div>

            {/* Mobile runway scene — full width below copy */}
            <div className="md:hidden">
              <LandingHeroScene variant="mobile" />
            </div>
          </div>
        </section>

        {/* ── PAYOUT-FIRST SECTION ───────────────────────────────────── */}
        <section className="py-16 px-5 bg-surface border-b" data-testid="section-payout-first">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">Payout first</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                {PRODUCT_COPY.payoutSectionHeading}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
                {PRODUCT_COPY.payoutSectionBody}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Calculator, title: "Statutory redundancy estimate", desc: "Age-band rules, service caps and current weekly pay cap built in." },
                { icon: Layers, title: "Package components", desc: "Model notice pay, holiday pay, enhanced offers and manual overrides." },
                { icon: TrendingUp, title: "Offer comparison", desc: "Compare statutory estimate against employer or voluntary package assumptions." },
                { icon: BarChart2, title: "Payout-to-runway bridge", desc: "See how the package feeds into starting capital and monthly burn." },
                { icon: Home, title: "Household runway", desc: "Model mortgage pressure, income gaps and essential spending." },
                { icon: FileText, title: "Plain-English brief", desc: "Your figures explained in a private report — not generic advice." },
              ].map((card) => (
                <Card key={card.title} className="border-gold/15">
                  <CardContent className="pt-5 pb-5">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <card.icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-semibold mb-1">{card.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button className="btn-gold rounded-full px-7" onClick={() => navigate("/wizard")} data-testid="button-payout-section-cta">
                {PRODUCT_COPY.buildCta} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* ── TRUST STRIP ─────────────────────────────────────────────── */}
        <section
          className="py-5 px-0 border-b"
          style={{ background: heroTheme.navySoft, borderColor: heroTheme.border }}
          data-testid="section-trust"
        >
          <div className="overflow-x-auto">
            <div className="flex items-start justify-start md:justify-center gap-0 min-w-max md:min-w-0 px-5">
              {[
                { icon: ShieldCheck, label: "UK statutory assumptions", sub: "Age-band rules, service caps and current thresholds" },
                { icon: Lock, label: "Private modelling", sub: "Your data stays in your browser" },
                { icon: Home, label: "Mortgage & household scenarios", sub: "Test rate rises, rent and one-income" },
                { icon: FileText, label: "One-off report access", sub: "One report. Yours to keep." },
                { icon: BarChart2, label: "Non-advisory tool", sub: "Planning model, not financial advice" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center px-5 py-2 shrink-0 border-r last:border-r-0"
                  style={{ borderColor: heroTheme.border, minWidth: 108 }}
                  data-testid={`trust-signal-${i}`}
                >
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center mb-2"
                    style={{ background: `${heroTheme.gold}18` }}
                  >
                    <item.icon className="w-4 h-4" style={{ color: heroTheme.gold }} />
                  </div>
                  <p className="text-[11px] font-semibold leading-tight mb-1 text-slate-200">{item.label}</p>
                  <p className="text-[10px] leading-tight text-slate-400">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEM SECTION ─────────────────────────────────────────── */}
        <section className="py-16 px-5 bg-background" data-testid="section-problem">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-5 leading-snug">
                  Redundancy is not just a payout question. It is a runway question.
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base mb-4">
                  A redundancy package can look manageable on day one. The harder question is how it behaves over time: if a new role takes longer than expected, if mortgage or rent still needs paying, if replacement income is lower, or if the household temporarily relies on one income.
                </p>
                <p className="text-muted-foreground leading-relaxed text-base">
                  RedundancyCalculatorUK helps you model that picture privately — under your own assumptions, before speaking to a financial adviser, solicitor, or anyone else.
                </p>
              </div>
              <RunwayCommandCentrePreview />
            </div>
          </div>
        </section>

        {/* ── DASHBOARD SHOWCASE ──────────────────────────────────────── */}
        <section className="py-16 px-5 bg-surface border-y" data-testid="section-dashboard-showcase">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">What you get</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                Advanced dashboards, built for clarity
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
                Start with a free preview of your baseline runway — then compare income recovery paths side by side in the full report.
              </p>
            </div>
            <LandingDashboardShowcase />
          </div>
        </section>

        {/* ── BRIEF EXAMPLE ───────────────────────────────────────────── */}
        <section className="py-16 px-5 bg-background" data-testid="section-brief-example">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">{RUNWAY_BRIEF_NAME}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                See what the plain-English brief looks like
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {PRODUCT_COPY.dualProductLine}
              </p>
            </div>
            <BriefExampleEmbed />
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
        <section className="py-16 px-5 bg-muted" id="how-it-works" data-testid="section-how-it-works">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">How it works</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">Three steps to your private redundancy report.</p>
            </div>
            <div className="relative">
              <div className="hidden sm:block absolute top-9 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-border" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                {[
                  { step: "1", title: "Tell us your situation", desc: "Enter your redundancy package, savings, income assumptions and monthly costs. UK statutory redundancy calculation is built in.", icon: Calculator },
                  { step: "2", title: "Build your report", desc: "See your baseline runway, capital path over time, and how the model changes under different income recovery assumptions.", icon: TrendingDown },
                  { step: "3", title: "Explore the scenarios", desc: "Compare stress cases, mortgage pressure, household resilience, voluntary redundancy alternatives and expense sensitivity.", icon: Layers },
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center text-center" data-testid={`card-step-${item.step}`}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-6 relative z-10 shadow-md text-white"
                      style={{ background: "linear-gradient(135deg, hsl(220 52% 18%), hsl(220 52% 28%))" }}>
                      {item.step}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 text-sm">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SCENARIOS ───────────────────────────────────────────────── */}
        <section className="py-16 px-5 bg-background" id="scenarios" data-testid="section-scenarios">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Scenarios the report models</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">Free preview gives you the baseline. The full report unlocks every scenario.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {[
                { icon: BarChart2, label: "Baseline", desc: "How long the money lasts at your current burn rate." },
                { icon: TrendingDown, label: "Slow recovery", desc: "If a new role takes longer — how much runway changes under a later return to income." },
                { icon: Home, label: "Mortgage / rent pressure", desc: "How a rate rise or rent review affects the capital path." },
                { icon: Users, label: "Household one-income", desc: "If one partner's income is temporarily the only income — how that changes the runway." },
                { icon: Repeat, label: "Voluntary redundancy", desc: "How a VR package compares to statutory entitlement under these assumptions." },
                { icon: TrendingUp, label: "Structural transition", desc: "A slower or lower-income recovery path modelled as an assumption — does not predict outcomes." },
              ].map((scenario, i) => (
                <div key={i} className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow"
                  data-testid={`scenario-card-${i}`}>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <scenario.icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm font-semibold mb-1.5">{scenario.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{scenario.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" className="btn-gold rounded-full px-8"
                onClick={() => navigate("/wizard")} data-testid="button-scenarios-cta">
                Build my private report — Free preview <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* ── PRICING ─────────────────────────────────────────────────── */}
        <section className="py-16 px-5 bg-muted" id="pricing" data-testid="section-pricing">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Simple, one-off pricing</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Start free. Unlock the full private report for a one-off payment — no subscription, ever.
              </p>
            </div>

            {/* Free card */}
            <div className="max-w-3xl mx-auto space-y-6">
              <Card className="border shadow-sm" data-testid="card-free-tier">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Free Preview</p>
                      <div className="text-2xl font-bold">£0</div>
                      <p className="text-sm text-muted-foreground mt-0.5">No account required</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/wizard")}
                      data-testid="button-start-free" className="shrink-0">
                      Start free <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {["UK statutory redundancy estimate","Runway estimate in months","Stability classification (0–100)","Capital at 3 / 6 / 12 months","Essential-only spending insight"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Paid card — styled to match mockup compact layout */}
              <div className="relative" data-testid="card-paid-tier-wrapper">
                <div className="absolute -top-3 left-4 z-10">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                    style={{ background: "linear-gradient(135deg, hsl(38 72% 52%), hsl(42 80% 60%))", color: "hsl(215 50% 8%)" }}>
                    FULL REPORT
                  </span>
                </div>
                <Card className="shadow-xl overflow-hidden"
                  style={{ outline: "2px solid hsl(38 72% 52%)", outlineOffset: "1px" }}>
                  <CardContent className="pt-7 pb-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{RUNWAY_REPORT_FULL}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">£{RUNWAY_REPORT_PRICE_GBP}</span>
                          <span className="text-sm text-muted-foreground">Two products · one payment</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {PRODUCT_COPY.dualProductLine}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      <div className="rounded-lg border p-3 bg-primary/5">
                        <p className="text-xs font-semibold mb-1.5">{COMMAND_CENTRE_NAME}</p>
                        <p className="text-[11px] text-muted-foreground">Scenarios, capital path, sensitivity & stress tests</p>
                      </div>
                      <div className="rounded-lg border border-gold/30 p-3 bg-gold/5">
                        <p className="text-xs font-semibold mb-1.5">{RUNWAY_BRIEF_NAME}</p>
                        <p className="text-[11px] text-muted-foreground">Plain-English report from your figures</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6">
                      {[
                        { text: "Everything in free preview", locked: false },
                        { text: "Slow and severe scenarios", locked: true },
                        { text: "Mortgage / housing pressure test", locked: true },
                        { text: "Household resilience view", locked: true },
                        { text: "Expense sensitivity ranking", locked: true },
                        { text: "Month-by-month capital path", locked: true },
                        { text: "Voluntary redundancy comparison", locked: true },
                        { text: "Structural transition scenario", locked: true },
                        { text: `${RUNWAY_BRIEF_NAME} (plain English)`, locked: true },
                        { text: "Exportable private report", locked: true },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          {item.locked
                            ? <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            : <Check className="w-3.5 h-3.5 shrink-0 text-primary" />}
                          <span className={item.locked ? "text-muted-foreground" : "font-medium"}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full btn-gold rounded-lg text-base py-5"
                      onClick={() => navigate("/wizard")} data-testid="button-start-paid">
                      {PRODUCT_COPY.unlockCta} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">Command Centre + Private Brief · 6 months access · No subscription</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7-DAY RESET ─────────────────────────────────────────────── */}
        <section className="py-16 px-5" data-testid="section-reset-teaser"
          style={{ background: "hsl(186 40% 12%)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "hsl(38 72% 58%)" }}>SUPPORTIVE NEXT STEP</p>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 font-serif font-bold text-2xl"
                    style={{ background: "hsl(38 72% 52% / 0.18)", color: "hsl(38 72% 68%)" }}>7</div>
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">7-Day Redundancy Reset</h2>
                    <p className="text-sm mt-1" style={{ color: "hsl(186 20% 55%)" }}>A guided 7-day plan to stabilise, plan and take control.</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(186 15% 60%)" }}>
                  Share what's going on through the Private Reset Portal or WhatsApp. Receive a calm written response within 1 working day and a practical 7-day plan. No calls. No judgement. No open-ended subscription.
                </p>
                <Link href="/redundancy-reset" data-testid="button-reset-cta">
                  <Button className="btn-gold rounded-full px-7">
                    Start your 7-day reset <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <p className="text-xs mt-3" style={{ color: "hsl(38 72% 55%)" }}>£79 launch offer · one-off support</p>
                <p className="text-xs mt-2" style={{ color: "hsl(186 15% 38%)" }}>Practical written support only. Not financial, legal, debt, employment, medical or mental health advice.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Daily actions", body: "Short, practical steps for each day." },
                  { label: "Clarity & confidence", body: "Reduce overwhelm and regain control." },
                  { label: "Complements your runway report", body: "Plan today. Model tomorrow." },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-5" data-testid={`reset-benefit-${i}`}
                    style={{ background: "hsl(186 40% 16%)", border: "1px solid hsl(186 35% 22%)" }}>
                    <p className="text-sm font-semibold text-white mb-1.5">{item.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "hsl(186 15% 58%)" }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── UK GUIDES ───────────────────────────────────────────────── */}
        <section className="py-14 px-5 bg-background" data-testid="section-guides">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-center mb-2">UK Redundancy Guides</h2>
            <p className="text-center text-sm text-muted-foreground mb-7">Contextual reading alongside your runway report. Not financial advice.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/statutory-redundancy-pay-calculator" data-testid="guide-card-statutory">
                <div className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow h-full cursor-pointer">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Guide</p>
                  <p className="font-semibold text-sm leading-snug mb-2">Statutory Redundancy Pay 2025</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Age-band multipliers, the weekly cap, tax treatment and service limits.</p>
                </div>
              </Link>
              <Link href="/redundancy-mortgage" data-testid="guide-card-mortgage">
                <div className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow h-full cursor-pointer">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Guide</p>
                  <p className="font-semibold text-sm leading-snug mb-2">Redundancy &amp; Your Mortgage</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Payment holidays, rate sensitivity and what to model before contacting your lender.</p>
                </div>
              </Link>
              <Link href="/voluntary-redundancy-calculator" data-testid="guide-card-vr">
                <div className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow h-full cursor-pointer">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Guide</p>
                  <p className="font-semibold text-sm leading-snug mb-2">Voluntary Redundancy Guide</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">How VR compares to statutory, the runway implications, and key considerations.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <section className="py-16 px-5 bg-muted" data-testid="section-faq">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-10 text-foreground">Common questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "Is this financial advice?", a: "No. RedundancyCalculatorUK is a non-advisory modelling tool. It produces illustrative projections based entirely on the assumptions you enter. It does not constitute financial, legal, tax, employment, debt, or benefits advice. All outputs are estimates and may not reflect actual outcomes." },
                { q: "Does this predict whether I will find work?", a: "No. The tool uses historical UK labour market percentiles as reference data to model reemployment timelines, but it does not predict individual job search outcomes. Projected timelines are illustrative only." },
                { q: "Is my data private?", a: "Yes. All financial calculations run entirely in your browser. No sensitive financial data is transmitted to or stored on our servers. We only store a session token to manage access to paid report features." },
                { q: "Is statutory redundancy pay included?", a: "Yes. The calculator uses current UK statutory redundancy rules, including age-band multipliers, the current weekly pay cap, and the 20-year service cap. A two-year qualifying service minimum applies. Check GOV.UK for the most current thresholds." },
                { q: "Can I model voluntary redundancy?", a: "Yes. The paid report includes a voluntary redundancy comparison scenario. You can enter a VR package amount alongside your statutory entitlement and see how each affects the runway under these assumptions." },
                { q: "Can I use this with my partner?", a: "Yes. The income recovery step includes an optional partner income field. This adds partner monthly net income to the household runway model." },
                { q: "What does the paid report unlock?", a: `The full ${RUNWAY_REPORT_FULL} (£${RUNWAY_REPORT_PRICE_GBP}, one-off) unlocks: slow and severe income scenarios, mortgage and housing pressure test, household resilience view, expense sensitivity ranking, month-by-month capital path, voluntary redundancy comparison, structural transition scenario, and exportable report. Access lasts 6 months.` },
                { q: "Is this a subscription?", a: `No. Both the ${RUNWAY_REPORT_FULL} (£${RUNWAY_REPORT_PRICE_GBP}) and the 7-Day Redundancy Reset are one-off payments. There are no recurring charges.` },
                { q: "What is the 7-Day Redundancy Reset?", a: "A separate one-off product for people who have completed the runway calculator and want help understanding what to do next. You receive a guided private written intake, a first written response within 1 working day, a follow-up check-in, and a final Redundancy Next-Step Plan through the Private Reset Portal or WhatsApp. No calls." },
              ].map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-base text-foreground" data-testid={`faq-trigger-${i}`}>{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-foreground/75 leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ── BOTTOM CTA ──────────────────────────────────────────────── */}
        <section
          className="py-20 px-5"
          data-testid="section-bottom-cta"
          style={{ background: `linear-gradient(135deg, ${heroTheme.navy} 0%, ${heroTheme.navySoft} 55%, ${heroTheme.navyMid} 100%)` }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">Model your runway now.</h2>
            <p className="mb-8 text-sm text-slate-400">Free preview in minutes. Full private report unlocked for £39.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="btn-gold rounded-full px-8"
                onClick={() => navigate("/wizard")} data-testid="button-bottom-cta">
                Build my private report — Free preview <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 hover:text-white hover:bg-white/10 border-white/25 text-slate-300"
                onClick={() => navigate("/wizard")} data-testid="button-bottom-cta-paid">
                Unlock full report — £39
              </Button>
            </div>
          </div>
        </section>

        {/* ── FOOTER TRUST ROW ────────────────────────────────────────── */}
        <div className="py-5 px-5 border-t" style={{ background: heroTheme.navy, borderColor: heroTheme.border }}>
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {["Private & secure", "UK focused", "Built for individuals", "Clear, neutral, supportive"].map((label) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full" style={{ background: heroTheme.gold }} />
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
