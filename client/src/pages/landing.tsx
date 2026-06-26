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
  TrendingUp,
  ListChecks,
  ClipboardList,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { useAccess } from "@/hooks/use-access";
import { Footer } from "@/components/Footer";
import { RunwayCommandCentrePreview } from "@/components/RunwayCommandCentrePreview";
import { LandingReportExplorer } from "@/components/landing-report-explorer";
import { LandingHeroScene } from "@/components/landing-hero-scene";
import { LandingWhatsIncluded } from "@/components/landing/LandingWhatsIncluded";
import { heroTheme } from "@/lib/chart-theme";

const GOLD_CTA =
  "btn-gold rounded-full whitespace-normal h-auto min-h-10 py-2.5 inline-flex items-center justify-center text-center text-sm sm:text-base";
import {
  COMMAND_CENTRE_NAME,
  PRODUCT_COPY,
  PRIVACY_COPY,
  REDUNDANCY_PAY_MAXIMISER_NAME,
  RESET_PRICE_GBP_DISPLAY,
  RUNWAY_BRIEF_NAME,
  RUNWAY_REPORT_FULL,
  RUNWAY_REPORT_PRICE_GBP,
} from "@shared/product";
import { GUIDE_CONTENT_YEAR, SITE_URL } from "@shared/site";

const NAV_LINKS = [
  { label: "What's included", href: "#whats-included" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Guides", href: "#guides" },
  { label: "About", href: "/about", external: true },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, email, logout, isLoading } = useAccess();

  return (
    <>
      <Helmet>
        <title>RedundancyCalculatorUK | Maximise Redundancy Pay & Check Your Runway</title>
        <meta name="description" content="Check what could be in your redundancy package, see how many months it may cover, and prepare questions before HR or signing. UK statutory redundancy, notice, holiday, enhanced pay and runway modelling. Not financial advice." />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RedundancyCalculatorUK" />
        <meta property="og:title" content="RedundancyCalculatorUK | Maximise Redundancy Pay & Check Your Runway" />
        <meta property="og:description" content="Check your redundancy package, model runway months and prepare the questions to ask before you sign. Private modelling from your figures." />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RedundancyCalculatorUK | Maximise Redundancy Pay & Check Your Runway" />
        <meta name="twitter:description" content="Check your redundancy package, model runway months and prepare the questions to ask before you sign. Private modelling from your figures." />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "Organization",
          "name": "RedundancyCalculatorUK", "url": SITE_URL,
          "description": "UK statutory redundancy pay calculator and financial runway modelling tool."
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "WebApplication",
          "name": "RedundancyCalculatorUK", "url": SITE_URL,
          "applicationCategory": "FinanceApplication", "operatingSystem": "Web",
          "offers": [
            { "@type": "Offer", "price": "0", "priceCurrency": "GBP", "name": "Free Preview" },
            { "@type": "Offer", "price": String(RUNWAY_REPORT_PRICE_GBP), "priceCurrency": "GBP", "name": RUNWAY_REPORT_FULL }
          ],
          "provider": { "@type": "Organization", "name": "RedundancyCalculatorUK", "url": SITE_URL }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Is this financial advice?", "acceptedAnswer": { "@type": "Answer", "text": "No. RedundancyCalculatorUK is a non-advisory modelling tool. All outputs are estimates and may not reflect actual outcomes." } },
            { "@type": "Question", "name": "Is my data private?", "acceptedAnswer": { "@type": "Answer", "text": PRIVACY_COPY.faqPrivacy } },
            { "@type": "Question", "name": "Is statutory redundancy pay included?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The calculator uses current UK statutory redundancy rules including age-band multipliers, service caps and the current weekly pay cap." } },
            { "@type": "Question", "name": "What does the paid report unlock?", "acceptedAnswer": { "@type": "Answer", "text": `The full ${RUNWAY_REPORT_FULL} (£${RUNWAY_REPORT_PRICE_GBP}, one-off) unlocks protection measures playbook, package maximisation checks, missing money checklist, payout improvement scenarios, consultation preparation tools, role protection planner, Runway Command Centre dashboards, plain-English brief, and exportable report. Modelling and preparation tools — not legal or employment advice.` } },
            { "@type": "Question", "name": "Is this a subscription?", "acceptedAnswer": { "@type": "Answer", "text": `No. Both the ${RUNWAY_REPORT_FULL} and the 7-Day Redundancy Reset are one-off payments. No recurring charges.` } }
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col overflow-x-clip max-w-[100vw]">
        <DisclaimerBanner />

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50 backdrop-blur-md border-b"
          style={{ background: heroTheme.gradientHeader, borderColor: heroTheme.border }}
          data-testid="header-landing"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-5 py-4 sm:py-5">
            <Logo onDark />
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
              {!isLoading && isAuthenticated && email ? (
                <div className="hidden md:flex items-center gap-2 text-xs" style={{ color: heroTheme.textMuted }}>
                  <span className="truncate max-w-[140px]">{email}</span>
                  <button type="button" className="underline" onClick={() => void logout()} data-testid="button-landing-sign-out">
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/recover"
                  className="hidden md:inline text-sm font-medium hover:text-white transition-colors"
                  style={{ color: heroTheme.textMuted }}
                  data-testid="link-landing-sign-in"
                >
                  Sign in
                </Link>
              )}
              <Button size="sm" className={`${GOLD_CTA} px-5 hidden sm:flex`}
                onClick={() => navigate("/wizard")} data-testid="button-header-start">
                {PRODUCT_COPY.buildCta} <ArrowRight className="w-3.5 h-3.5 ml-1.5 shrink-0" />
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
              <Link
                href="/recover"
                className="md:hidden text-sm py-1"
                style={{ color: "hsl(215 15% 60%)" }}
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-sign-in"
              >
                Sign in
              </Link>
              <Button size="sm" className={`${GOLD_CTA} mt-2 w-full`}
                onClick={() => { navigate("/wizard"); setMobileMenuOpen(false); }}
                data-testid="button-mobile-cta">
                <span className="sm:hidden">{PRODUCT_COPY.buildCtaMobile}</span>
                <span className="hidden sm:inline">{PRODUCT_COPY.buildCta}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 shrink-0" />
              </Button>
            </div>
          )}
        </header>

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <section data-testid="section-hero" className="relative overflow-x-clip" style={{ background: heroTheme.navy }}>
          <div className="max-w-6xl mx-auto">
            {/* Text block — solid navy, no landscape bleed */}
            <div className="relative z-10 px-5 pt-8 pb-5 sm:pt-10 sm:pb-6 md:pt-16 md:pb-8 md:flex md:items-start md:gap-12">
              <div className="md:flex-1 md:max-w-xl">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 border"
                  style={{ borderColor: "hsl(192 55% 42%)", background: "hsl(192 55% 22% / 0.35)" }}
                  data-testid="hero-eyebrow"
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-teal-400" />
                  <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-teal-200/90">
                    {PRODUCT_COPY.heroEyebrow}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4" data-testid="hero-seo-terms">
                  {PRODUCT_COPY.heroSeoTerms.map((term) => (
                    <span
                      key={term}
                      className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-slate-300"
                    >
                      {term}
                    </span>
                  ))}
                </div>

                <h1
                  className="font-serif text-[1.65rem] sm:text-4xl lg:text-[3rem] font-bold leading-[1.15] text-white mb-4"
                  data-testid="hero-headline"
                >
                  {PRODUCT_COPY.heroH1}
                </h1>

                <p className="text-[15px] sm:text-base leading-relaxed mb-4 lg:max-w-lg text-slate-300" data-testid="hero-subheadline">
                  {PRODUCT_COPY.heroSub}
                </p>

                <ul className="space-y-2 mb-4 lg:max-w-lg" data-testid="hero-outcomes">
                  {PRODUCT_COPY.heroOutcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2 text-sm sm:text-[15px] text-slate-200">
                      <Check className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm font-medium text-teal-200/90 mb-3 lg:max-w-lg" data-testid="hero-positioning-line">
                  {PRODUCT_COPY.positioningSupporting}
                </p>

                <Link
                  href="/ai-redundancy-calculator"
                  className="inline-block text-xs text-slate-400 hover:text-teal-200/90 mb-5 transition-colors"
                  data-testid="hero-ai-guide-link"
                >
                  Worried about AI-driven restructuring? Read our readiness guides →
                </Link>

                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <Button
                    size="lg"
                    className={`${GOLD_CTA} px-6 sm:px-7 w-full sm:w-auto`}
                    onClick={() => navigate("/wizard")}
                    data-testid="button-hero-primary"
                  >
                    <span className="sm:hidden">{PRODUCT_COPY.buildCtaMobile}</span>
                    <span className="hidden sm:inline">{PRODUCT_COPY.buildCta}</span>
                    <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-6 sm:px-7 w-full sm:w-auto whitespace-normal h-auto min-h-10 py-2.5 inline-flex items-center justify-center text-center text-sm sm:text-base hover:text-white hover:bg-white/10 border-white/25 text-slate-300"
                    onClick={() => scrollTo("whats-included")}
                    data-testid="button-hero-secondary"
                  >
                    <span className="sm:hidden">{PRODUCT_COPY.seeIncludedCtaMobile}</span>
                    <span className="hidden sm:inline">{PRODUCT_COPY.seeIncludedCta}</span>
                    <ChevronDown className="w-4 h-4 ml-2 shrink-0" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5" data-testid="hero-assurance">
                  {PRODUCT_COPY.heroAssurance.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg bg-white/[0.06] px-2.5 py-2.5"
                    >
                      <p className="text-xs font-semibold text-slate-100 leading-snug">{item.label}</p>
                      <p className="text-[11px] text-slate-400 leading-snug mt-1">{item.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-5" data-testid="hero-pillars">
                  {PRODUCT_COPY.heroPillars.map((pillar) => (
                    <div
                      key={pillar.label}
                      className="rounded-lg bg-white/[0.06] px-2 py-2.5 text-center"
                    >
                      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-teal-200/90 leading-tight">{pillar.label}</p>
                      <p className="text-[11px] text-slate-400 leading-snug mt-1">{pillar.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-500" />
                  <p className="text-xs leading-relaxed text-slate-500">
                    {PRODUCT_COPY.trustLine} · {PRIVACY_COPY.heroTrust}. Not financial advice.
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

        <LandingWhatsIncluded />

        {/* ── PAYOUT-FIRST SECTION ───────────────────────────────────── */}
        <section className="py-16 px-5 bg-surface border-b" data-testid="section-payout-first">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">Maximise package + runway</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                {PRODUCT_COPY.payoutSectionHeading}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
                {PRODUCT_COPY.payoutSectionBody}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Calculator, title: "What could be in the package?", desc: "Check statutory, notice, holiday, enhanced pay and missing lines before you rely on the headline number." },
                { icon: TrendingDown, title: "How many months could it cover?", desc: "Turn package, savings and household costs into baseline, slow and severe runway scenarios." },
                { icon: ListChecks, title: REDUNDANCY_PAY_MAXIMISER_NAME, desc: "Ranks package lines by potential payout and runway impact — so you know what to verify first." },
                { icon: TrendingUp, title: "Which payout outcome matters?", desc: "Compare statutory-only, employer offer and improved-package scenarios side by side." },
                { icon: BarChart2, title: "How does payout become runway?", desc: "Bridge each package component into starting capital and month-by-month survivability." },
                { icon: Home, title: "What if costs rise?", desc: "Model mortgage pressure, income gaps and expense stress cases before the gap begins." },
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
              <Button className={`${GOLD_CTA} px-7`} onClick={() => navigate("/wizard")} data-testid="button-payout-section-cta">
                <span className="sm:hidden">{PRODUCT_COPY.buildCtaMobile}</span>
                <span className="hidden sm:inline">{PRODUCT_COPY.buildCta}</span>
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
              </Button>
            </div>
          </div>
        </section>

        {/* ── SITUATION ADAPT ─────────────────────────────────────────── */}
        <section className="py-10 px-5 bg-background border-b" id="position-tools" data-testid="section-position-tools">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">Adapts to your situation</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Already redundant? The report leads with package breakdown, payout scenarios and runway impact. At risk of redundancy?
              It brings consultation questions, role protection and evidence prep forward — all included in the same £{RUNWAY_REPORT_PRICE_GBP} report.
            </p>
            <Button variant="outline" className="rounded-full" onClick={() => scrollTo("whats-included")}>
              View full package contents
            </Button>
          </div>
        </section>

        {/* ── TRUST STRIP ─────────────────────────────────────────────── */}
        <section
          className="py-5 px-5 border-b"
          style={{ background: heroTheme.navySoft, borderColor: heroTheme.border }}
          data-testid="section-trust"
        >
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { icon: ShieldCheck, label: `One-off £${RUNWAY_REPORT_PRICE_GBP}`, sub: "6 months access · no subscription" },
                { icon: Lock, label: "Browser-local modelling", sub: "Core figures stay on your device" },
                { icon: Calculator, label: "UK statutory basis", sub: "Current caps and age bands" },
                { icon: ClipboardList, label: "HR-ready preparation", sub: "Questions, checklists & templates" },
                { icon: BarChart2, label: "Runway you can plan around", sub: "Months left under your costs" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center px-2 py-2"
                  data-testid={`trust-signal-${i}`}
                >
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center mb-2"
                    style={{ background: `${heroTheme.gold}18` }}
                  >
                    <item.icon className="w-4 h-4" style={{ color: heroTheme.gold }} />
                  </div>
                  <p className="text-xs font-semibold leading-snug mb-1 text-slate-200">{item.label}</p>
                  <p className="text-[11px] leading-snug text-slate-400">{item.sub}</p>
                </div>
              ))}
          </div>
        </section>

        {/* ── PROBLEM SECTION ─────────────────────────────────────────── */}
        <section className="py-16 px-5 bg-background" data-testid="section-problem">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 leading-snug">
                  You need three answers before you rely on the package.
                </h2>
                <div className="space-y-3 mb-6">
                  {[
                    {
                      icon: Calculator,
                      headline: "What could be included in your package?",
                      line: "Check statutory, notice, holiday, enhanced pay and missing lines — then rank what to verify first.",
                    },
                    {
                      icon: Calendar,
                      headline: "How long could it last?",
                      line: "Runway months from your package, savings, income assumptions and household costs.",
                    },
                    {
                      icon: MessageSquare,
                      headline: "What should you ask before signing?",
                      line: "Questions, evidence prompts and consultation preparation — not legal advice.",
                    },
                  ].map((card) => (
                    <div
                      key={card.headline}
                      className="flex items-start gap-3 rounded-xl border bg-card p-4"
                      data-testid={`three-answers-${card.headline.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <card.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-0.5">{card.headline}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{card.line}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Private modelling from your figures · one-off £{RUNWAY_REPORT_PRICE_GBP} · not financial advice.
                </p>
              </div>
              <RunwayCommandCentrePreview />
            </div>
          </div>
        </section>

        {/* ── REPORT EXPLORER ─────────────────────────────────────────── */}
        <section className="py-16 px-5 bg-surface border-y" data-testid="section-report-explorer">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">What you get</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                See the report that checks your package, runway and next questions
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
                Sample the package maximiser, runway dashboards and plain-English brief — start free, unlock when you are ready.
              </p>
            </div>
            <LandingReportExplorer />
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
                  { step: "1", title: "Enter your package and costs", desc: "Add statutory inputs, notice, holiday, enhanced assumptions, savings, income and monthly household costs.", icon: Calculator },
                  { step: "2", title: "Check the package", desc: "See what is included, what may be missing and how different payout outcomes change your starting capital.", icon: TrendingDown },
                  { step: "3", title: "Plan the runway and next questions", desc: "Compare runway scenarios, stress cases, mortgage pressure and preparation prompts before you sign.", icon: Layers },
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

        {/* ── PRICING ─────────────────────────────────────────────────── */}
        <section className="py-16 px-5 bg-muted" id="pricing" data-testid="section-pricing">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Start free. Unlock the full package check when you need it.</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Free preview first. Full private report for a one-off payment — no subscription, ever.
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
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{RUNWAY_REPORT_FULL}</p>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {PRODUCT_COPY.dualProductLine}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      <div className="rounded-lg border p-3 bg-primary/5">
                        <p className="text-xs font-semibold mb-1.5">Improve your position hub</p>
                      <p className="text-[11px] text-muted-foreground">{REDUNDANCY_PAY_MAXIMISER_NAME}, missing money, payout scenarios & consultation prep</p>
                      </div>
                      <div className="rounded-lg border p-3 bg-primary/5">
                        <p className="text-xs font-semibold mb-1.5">{COMMAND_CENTRE_NAME}</p>
                        <p className="text-[11px] text-muted-foreground">Capital path, stress tests, mortgage & income scenarios</p>
                      </div>
                      <div className="rounded-lg border border-gold/30 p-3 bg-gold/5 sm:col-span-2">
                        <p className="text-xs font-semibold mb-1.5">{RUNWAY_BRIEF_NAME}</p>
                        <p className="text-[11px] text-muted-foreground">Plain-English report with package and position commentary from your figures</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6">
                      {[
                        { text: "Everything in free preview", locked: false },
                        { text: REDUNDANCY_PAY_MAXIMISER_NAME, locked: true },
                        { text: "Missing money checklist", locked: true },
                        { text: "Payout improvement scenarios", locked: true },
                        { text: "Consultation Defence Pack", locked: true },
                        { text: "Role Protection Planner", locked: true },
                        { text: "Package clarification email templates", locked: true },
                        { text: "Slow and severe income scenarios", locked: true },
                        { text: "Mortgage / housing pressure test", locked: true },
                        { text: "Month-by-month capital path", locked: true },
                        { text: `${RUNWAY_BRIEF_NAME} with position commentary`, locked: true },
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
                    <div className="text-center mb-5 pt-4 border-t">
                      <p className="text-3xl font-bold">£{RUNWAY_REPORT_PRICE_GBP}</p>
                      <p className="text-sm text-muted-foreground">One-off · 6 months access · no subscription</p>
                    </div>
                    <Button className={`w-full ${GOLD_CTA} rounded-lg py-3 min-h-12`}
                      onClick={() => navigate("/wizard")} data-testid="button-start-paid">
                      <span className="sm:hidden">{PRODUCT_COPY.unlockCtaMobile}</span>
                      <span className="hidden sm:inline">{PRODUCT_COPY.unlockCta}</span>
                      <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">{PRODUCT_COPY.unlockSupportingLine} · 6 months access</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7-DAY RESET ─────────────────────────────────────────────── */}
        <section
          className="py-16 px-5 border-t"
          data-testid="section-reset-teaser"
          style={{
            background: `linear-gradient(135deg, ${heroTheme.navy} 0%, ${heroTheme.navySoft} 55%, ${heroTheme.navyMid} 100%)`,
            borderColor: heroTheme.border,
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: heroTheme.goldSoft }}>
                  SUPPORTIVE NEXT STEP
                </p>
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 font-serif font-bold text-2xl"
                    style={{ background: `${heroTheme.gold}2e`, color: heroTheme.goldSoft }}
                  >
                    7
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">7-Day Redundancy Reset</h2>
                    <p className="text-sm mt-1 text-slate-300">A guided 7-day plan to stabilise, plan and take control.</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-6 text-slate-300">
                  Share what's going on through the Private Reset Portal. Receive a calm written response within 1 working day and a practical 7-day plan. No calls. No judgement. No open-ended subscription.
                </p>
                <Link href="/redundancy-reset" data-testid="button-reset-cta">
                  <Button className={`${GOLD_CTA} px-6 sm:px-7`}>
                    Start your 7-day reset <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
                  </Button>
                </Link>
                <p className="text-xs mt-3" style={{ color: heroTheme.goldSoft }}>£{RESET_PRICE_GBP_DISPLAY} · one-off support</p>
                <p className="text-xs mt-2 text-slate-500">Practical written support only. Not financial, legal, debt, employment, medical or mental health advice.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Daily actions", body: "Short, practical steps for each day." },
                  { label: "Clarity & confidence", body: "Reduce overwhelm and regain control." },
                  { label: "Complements your runway report", body: "Plan today. Model tomorrow." },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-5 border"
                    data-testid={`reset-benefit-${i}`}
                    style={{ background: "rgba(255,255,255,0.06)", borderColor: heroTheme.border }}
                  >
                    <p className="text-sm font-semibold text-white mb-1.5">{item.label}</p>
                    <p className="text-xs leading-relaxed text-slate-400">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── UK GUIDES ───────────────────────────────────────────────── */}
        <section className="py-14 px-5 bg-background" id="guides" data-testid="section-guides">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-center mb-2">UK Redundancy Guides</h2>
            <p className="text-center text-sm text-muted-foreground mb-7">Contextual reading alongside your runway report. Not financial advice.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/redundancy-pay-calculator-2026" data-testid="guide-card-statutory">
                <div className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow h-full cursor-pointer">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Guide</p>
                  <p className="font-semibold text-sm leading-snug mb-2">Statutory Redundancy Pay {GUIDE_CONTENT_YEAR}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Age-band multipliers, the weekly cap, tax treatment and service limits — current-year assumptions.</p>
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
              <Link href="/redundancy-package-calculator" data-testid="guide-card-package">
                <div className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow h-full cursor-pointer">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Calculator</p>
                  <p className="font-semibold text-sm leading-snug mb-2">Redundancy package calculator</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Statutory, notice, holiday and enhanced pay in one package estimate.</p>
                </div>
              </Link>
              <Link href="/how-long-will-my-redundancy-pay-last" data-testid="guide-card-runway">
                <div className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow h-full cursor-pointer">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Runway</p>
                  <p className="font-semibold text-sm leading-snug mb-2">How long will redundancy pay last?</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Test package, savings and spending assumptions against household runway.</p>
                </div>
              </Link>
              <Link href="/ai-redundancy-calculator" data-testid="guide-card-ai">
                <div className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow h-full cursor-pointer">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">AI &amp; work</p>
                  <p className="font-semibold text-sm leading-snug mb-2">AI redundancy readiness</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Research-led preparation if automation or restructuring is on the table — not job-loss predictions.</p>
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
                { q: "Is my data private?", a: PRIVACY_COPY.faqPrivacy },
                { q: "Is statutory redundancy pay included?", a: "Yes. The calculator uses current UK statutory redundancy rules, including age-band multipliers, the current weekly pay cap, and the 20-year service cap. A two-year qualifying service minimum applies. Check GOV.UK for the most current thresholds." },
                { q: "Can I model voluntary redundancy?", a: "Yes. The paid report includes a voluntary redundancy comparison scenario. You can enter a VR package amount alongside your statutory entitlement and see how each affects the runway under these assumptions." },
                { q: "Can I use this with my partner?", a: "Yes. The income recovery step includes an optional partner income field. This adds partner monthly net income to the household runway model." },
                { q: "What does the paid report unlock?", a: `The full ${RUNWAY_REPORT_FULL} (£${RUNWAY_REPORT_PRICE_GBP}, one-off) unlocks the Improve your position hub — including protection measures playbook, package maximiser checks, missing money checklist, payout improvement scenarios, consultation preparation tools, role protection planner, package clarification emails, plus Runway Command Centre dashboards, ${RUNWAY_BRIEF_NAME} with position commentary, and export. Modelling and preparation only — not legal or employment advice. Access lasts 6 months.` },
                { q: "Is this a subscription?", a: `No. Both the ${RUNWAY_REPORT_FULL} (£${RUNWAY_REPORT_PRICE_GBP}) and the 7-Day Redundancy Reset are one-off payments. There are no recurring charges.` },
                { q: "How do I get my report — PDF, email or online?", a: PRIVACY_COPY.exportDelivery },
                { q: "What is the 7-Day Redundancy Reset?", a: "A separate one-off product for people who have completed the runway calculator and want help understanding what to do next. You receive a guided private written intake, a first written response within 1 working day, a follow-up check-in, and a final Redundancy Next-Step Plan through the Private Reset Portal. No calls." },
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
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              {PRODUCT_COPY.positioningHeadline}
            </h2>
            <p className="mb-8 text-sm text-slate-400 max-w-lg mx-auto">
              Free statutory estimate in minutes. Full position tools and runway report — £{RUNWAY_REPORT_PRICE_GBP}, one-off.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className={`${GOLD_CTA} px-6 sm:px-8`}
                onClick={() => navigate("/wizard")} data-testid="button-bottom-cta">
                <span className="sm:hidden">{PRODUCT_COPY.bottomCtaFreeMobile}</span>
                <span className="hidden sm:inline">{PRODUCT_COPY.bottomCtaFree}</span>
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-6 sm:px-8 whitespace-normal h-auto min-h-10 py-2.5 inline-flex items-center justify-center text-center text-sm sm:text-base hover:text-white hover:bg-white/10 border-white/25 text-slate-300"
                onClick={() => navigate("/wizard")} data-testid="button-bottom-cta-paid">
                {PRODUCT_COPY.bottomCtaPaid}
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
