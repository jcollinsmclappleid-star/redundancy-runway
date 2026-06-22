import { Helmet } from "react-helmet-async";
import { useState } from "react";
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
  Menu,
  X,
  Users,
  Repeat,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Scenarios", href: "#scenarios" },
  { label: "Pricing", href: "#pricing" },
  { label: "Guides", href: "/statutory-redundancy-pay", external: true },
  { label: "About", href: "/about", external: true },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ── HERO VISUAL ────────────────────────────────────────────────────────
   A self-contained CSS/SVG illustration:
   - Winding road as an SVG path with gold glow
   - Central report card
   - Small floating scenario cards
   All aria-hidden, decorative only.
────────────────────────────────────────────────────────────────────── */
function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full h-full select-none"
      style={{ minHeight: 420 }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 320,
          height: 320,
          top: "10%",
          right: "5%",
          background: "radial-gradient(circle, hsl(198 65% 30% / 0.35) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200,
          height: 200,
          bottom: "15%",
          left: "10%",
          background: "radial-gradient(circle, hsl(38 72% 52% / 0.20) 0%, transparent 70%)",
          filter: "blur(32px)",
        }}
      />

      {/* SVG Road */}
      <svg
        viewBox="0 0 400 420"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ zIndex: 0 }}
      >
        <defs>
          <linearGradient id="roadGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="hsl(38 72% 52%)" stopOpacity="0.05" />
            <stop offset="50%" stopColor="hsl(38 72% 52%)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(38 72% 70%)" stopOpacity="0.7" />
          </linearGradient>
          <filter id="roadGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Winding road path */}
        <path
          d="M 60 410 C 80 360, 60 320, 120 280 C 180 240, 220 230, 200 180 C 185 140, 240 110, 260 70"
          fill="none"
          stroke="url(#roadGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#roadGlow)"
          opacity="0.9"
        />
        {/* Road centre dashes */}
        <path
          d="M 60 410 C 80 360, 60 320, 120 280 C 180 240, 220 230, 200 180 C 185 140, 240 110, 260 70"
          fill="none"
          stroke="hsl(38 72% 65% / 0.3)"
          strokeWidth="1"
          strokeDasharray="8 10"
          strokeLinecap="round"
        />
        {/* Runway destination dot */}
        <circle cx="260" cy="68" r="5" fill="hsl(38 72% 58%)" opacity="0.9" />
        <circle cx="260" cy="68" r="10" fill="hsl(38 72% 58% / 0.25)" />
      </svg>

      {/* Central Report Card */}
      <div
        className="absolute rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          top: "14%",
          right: "8%",
          width: 188,
          background: "hsl(215 50% 10% / 0.92)",
          borderColor: "hsl(215 30% 25%)",
          backdropFilter: "blur(12px)",
          zIndex: 10,
        }}
      >
        <div className="px-4 pt-4 pb-1">
          <p className="text-[9px] font-semibold tracking-widest uppercase mb-2" style={{ color: "hsl(38 72% 60%)" }}>
            Your Runway Report
          </p>
          <div className="flex items-end gap-1 mb-0.5">
            <span className="font-serif text-3xl font-bold text-white leading-none">10.4</span>
            <span className="text-xs text-white/50 mb-1">months</span>
          </div>
          <p className="text-[10px] text-white/40 mb-3">Baseline runway estimate</p>
          <div className="rounded-lg px-2 py-1.5 mb-3" style={{ background: "hsl(198 65% 18%)" }}>
            <p className="text-[9px] text-white/50 mb-0.5">Scenario range</p>
            <p className="text-xs font-semibold" style={{ color: "hsl(38 72% 65%)" }}>5.1 – 18.7 months</p>
          </div>
        </div>
        <div className="px-4 pb-4">
          <p className="text-[9px] font-semibold text-white/30 uppercase tracking-wide mb-2">Scenarios modelled</p>
          {[
            "Slow recovery",
            "Mortgage pressure",
            "One-income household",
            "Voluntary redundancy",
            "Structural transition",
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5 mb-1">
              <Check className="w-2.5 h-2.5 shrink-0" style={{ color: "hsl(38 72% 60%)" }} />
              <span className="text-[10px] text-white/60">{item}</span>
            </div>
          ))}
          <p className="text-[8px] text-white/25 mt-2 leading-relaxed">
            Illustrative sample. Not financial advice.
          </p>
        </div>
      </div>

      {/* Floating card: Redundancy pay estimate */}
      <div
        className="absolute rounded-xl border shadow-lg px-3 py-2.5"
        style={{
          top: "38%",
          left: "2%",
          width: 148,
          background: "hsl(215 45% 12% / 0.90)",
          borderColor: "hsl(215 30% 22%)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "hsl(38 72% 52% / 0.2)" }}>
            <Calculator className="w-3 h-3" style={{ color: "hsl(38 72% 60%)" }} />
          </div>
          <p className="text-[10px] font-semibold text-white/80">Redundancy pay</p>
        </div>
        <p className="text-[9px] text-white/40 leading-relaxed">Statutory estimate</p>
      </div>

      {/* Floating card: Mortgage pressure */}
      <div
        className="absolute rounded-xl border shadow-lg px-3 py-2.5"
        style={{
          top: "56%",
          right: "4%",
          width: 148,
          background: "hsl(215 45% 12% / 0.90)",
          borderColor: "hsl(215 30% 22%)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "hsl(198 65% 28% / 0.3)" }}>
            <Home className="w-3 h-3" style={{ color: "hsl(198 65% 60%)" }} />
          </div>
          <p className="text-[10px] font-semibold text-white/80">Mortgage pressure</p>
        </div>
        <p className="text-[9px] text-white/40 leading-relaxed">Rate rise impact</p>
      </div>

      {/* Floating card: Household impact */}
      <div
        className="absolute rounded-xl border shadow-lg px-3 py-2.5"
        style={{
          top: "72%",
          left: "5%",
          width: 148,
          background: "hsl(215 45% 12% / 0.90)",
          borderColor: "hsl(215 30% 22%)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "hsl(175 40% 28% / 0.3)" }}>
            <Users className="w-3 h-3" style={{ color: "hsl(175 40% 60%)" }} />
          </div>
          <p className="text-[10px] font-semibold text-white/80">Household impact</p>
        </div>
        <p className="text-[9px] text-white/40 leading-relaxed">One income supporting household</p>
      </div>

      {/* Floating card: Slow recovery */}
      <div
        className="absolute rounded-xl border shadow-lg px-3 py-2.5"
        style={{
          top: "8%",
          left: "10%",
          width: 140,
          background: "hsl(215 45% 12% / 0.90)",
          borderColor: "hsl(215 30% 22%)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "hsl(38 72% 52% / 0.15)" }}>
            <Clock className="w-3 h-3" style={{ color: "hsl(38 72% 60%)" }} />
          </div>
          <p className="text-[10px] font-semibold text-white/80">Slow recovery</p>
        </div>
        <p className="text-[9px] text-white/40 leading-relaxed">Extended job search</p>
      </div>
    </div>
  );
}

/* ── MOBILE HERO VISUAL ─────────────────────────────────────────────── */
function MobileHeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto mt-8" style={{ maxWidth: 320, height: 120 }}>
      {/* Glow */}
      <div
        className="absolute inset-x-0 bottom-0 rounded-full"
        style={{
          height: 60,
          background: "radial-gradient(ellipse, hsl(38 72% 52% / 0.25) 0%, transparent 70%)",
          filter: "blur(16px)",
        }}
      />
      {/* Mini report card */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 rounded-xl border shadow-xl px-4 py-3"
        style={{
          width: 240,
          background: "hsl(215 50% 10% / 0.94)",
          borderColor: "hsl(215 30% 25%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: "hsl(38 72% 60%)" }}>
            Runway Report
          </p>
          <span className="text-[8px] text-white/30">Illustrative</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="font-serif text-2xl font-bold text-white leading-none">10.4</span>
          <span className="text-xs text-white/50 mb-0.5">months baseline</span>
        </div>
        <p className="text-[9px] mt-1.5" style={{ color: "hsl(38 72% 60%)" }}>Range: 5.1 – 18.7 months under scenarios</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>RedundancyCalculatorUK | UK Statutory Redundancy Pay & Runway Calculator</title>
        <meta name="description" content="Calculate your UK statutory redundancy pay and model how long your money may last. Free redundancy runway report with mortgage sensitivity, income scenarios and expense analysis. Not financial advice." />
        <link rel="canonical" href="https://redundancycalculatoruk.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RedundancyCalculatorUK" />
        <meta property="og:title" content="RedundancyCalculatorUK | UK Statutory Redundancy Pay & Runway Calculator" />
        <meta property="og:description" content="Calculate your UK statutory redundancy pay and model how long your money may last. Free redundancy runway report with mortgage sensitivity, income scenarios and expense analysis." />
        <meta property="og:url" content="https://redundancycalculatoruk.com/" />
        <meta property="og:image" content="https://redundancycalculatoruk.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RedundancyCalculatorUK | UK Statutory Redundancy Pay & Runway Calculator" />
        <meta name="twitter:description" content="Calculate your UK statutory redundancy pay and model how long your money may last. Free redundancy runway report with mortgage sensitivity, income scenarios and expense analysis." />
        <meta name="twitter:image" content="https://redundancycalculatoruk.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "RedundancyCalculatorUK",
          "url": "https://redundancycalculatoruk.com",
          "description": "UK statutory redundancy pay calculator and financial runway modelling tool.",
          "sameAs": []
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "RedundancyCalculatorUK",
          "url": "https://redundancycalculatoruk.com",
          "description": "UK statutory redundancy pay calculator and financial runway modelling tool.",
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
            { "@type": "Question", "name": "Is this financial advice?", "acceptedAnswer": { "@type": "Answer", "text": "No. RedundancyCalculatorUK is a non-advisory modelling tool. It produces illustrative projections based entirely on the assumptions you enter. It does not constitute financial, legal, tax, employment, debt, or benefits advice. All outputs are estimates and may not reflect actual outcomes." } },
            { "@type": "Question", "name": "Is my data private?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. All financial calculations run entirely in your browser. No sensitive financial data is transmitted to or stored on our servers." } },
            { "@type": "Question", "name": "Is statutory redundancy pay included?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The calculator uses current UK statutory redundancy rules, including age-band multipliers, service caps and the current weekly pay cap. A two-year qualifying service minimum applies." } },
            { "@type": "Question", "name": "Can I model voluntary redundancy?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The paid report includes a voluntary redundancy comparison scenario." } },
            { "@type": "Question", "name": "What does the paid report unlock?", "acceptedAnswer": { "@type": "Answer", "text": "The full Private Runway Report (£39, one-off) unlocks: slow and severe income scenarios, mortgage and housing pressure test, household resilience view, expense sensitivity ranking, month-by-month capital path, voluntary redundancy comparison, structural transition scenario, and exportable report. Access lasts 6 months." } },
            { "@type": "Question", "name": "Is this a subscription?", "acceptedAnswer": { "@type": "Answer", "text": "No. Both the Private Runway Report (£39) and the 7-Day Redundancy Reset are one-off payments. There are no recurring charges." } }
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50 backdrop-blur-md border-b"
          style={{ background: "hsl(215 50% 8% / 0.97)", borderColor: "hsl(215 30% 16%)" }}
          data-testid="header-landing"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <Logo light />

            <nav className="hidden md:flex items-center gap-6" data-testid="nav-desktop">
              {NAV_LINKS.map((link) =>
                link.external ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium transition-colors"
                    style={{ color: "hsl(215 15% 60%)" }}
                    data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.href.replace("#", ""))}
                    className="text-sm font-medium transition-colors hover:text-white"
                    style={{ color: "hsl(215 15% 60%)" }}
                    data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.label}
                  </button>
                )
              )}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                size="sm"
                className="btn-gold rounded-full px-5 hidden sm:flex"
                onClick={() => navigate("/wizard")}
                data-testid="button-header-start"
              >
                Build my report
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
              <button
                className="md:hidden p-1"
                style={{ color: "hsl(215 15% 60%)" }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div
              className="md:hidden border-t px-6 py-4 flex flex-col gap-3"
              style={{ background: "hsl(215 50% 8%)", borderColor: "hsl(215 30% 16%)" }}
              data-testid="nav-mobile"
            >
              {NAV_LINKS.map((link) =>
                link.external ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm py-1"
                    style={{ color: "hsl(215 15% 60%)" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => { scrollTo(link.href.replace("#", "")); setMobileMenuOpen(false); }}
                    className="text-sm py-1 text-left"
                    style={{ color: "hsl(215 15% 60%)" }}
                  >
                    {link.label}
                  </button>
                )
              )}
              <Button
                size="sm"
                className="btn-gold rounded-full mt-2"
                onClick={() => { navigate("/wizard"); setMobileMenuOpen(false); }}
                data-testid="button-mobile-cta"
              >
                Build my report
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          )}
        </header>

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          data-testid="section-hero"
          style={{
            background: "linear-gradient(135deg, hsl(215 60% 6%) 0%, hsl(198 65% 10%) 50%, hsl(186 55% 12%) 100%)",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, hsl(198 65% 40% / 0.08) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            {/* Left: text */}
            <div className="flex-1 max-w-xl lg:max-w-none">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-5"
                style={{ color: "hsl(38 72% 55%)" }}
                data-testid="hero-eyebrow"
              >
                PRIVATE · ASSUMPTION-BASED · UK FOCUSED
              </p>
              <h1
                className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.12] text-white mb-6"
                data-testid="hero-headline"
              >
                Model how long your money may last if work changes.
              </h1>
              <p
                className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
                style={{ color: "hsl(215 15% 65%)" }}
                data-testid="hero-subheadline"
              >
                Build a private redundancy runway report — covering redundancy, restructuring, voluntary packages, mortgage pressure and a slower return to work.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <Button
                  size="lg"
                  className="btn-gold rounded-full px-8 text-base"
                  onClick={() => navigate("/wizard")}
                  data-testid="button-hero-primary"
                >
                  Build my private report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 text-base"
                  style={{ borderColor: "hsl(215 30% 30%)", color: "hsl(215 15% 70%)" }}
                  onClick={() => scrollTo("scenarios")}
                  data-testid="button-hero-secondary"
                >
                  See what's included
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "hsl(215 15% 45%)" }} />
                <p className="text-xs leading-relaxed" style={{ color: "hsl(215 15% 45%)" }}>
                  Your data stays in your browser. One-off report access. Not financial advice.
                </p>
              </div>

              {/* Mobile-only simplified visual */}
              <div className="lg:hidden">
                <MobileHeroVisual />
              </div>
            </div>

            {/* Right: desktop-only full visual */}
            <div className="hidden lg:block flex-1 relative" style={{ height: 480 }}>
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* ── TRUST STRIP ─────────────────────────────────────────────── */}
        <section
          className="py-5 px-6 border-b"
          style={{ background: "hsl(215 50% 8%)", borderColor: "hsl(215 30% 14%)" }}
          data-testid="section-trust"
        >
          <div className="max-w-6xl mx-auto overflow-x-auto">
            <div className="flex items-center justify-start md:justify-center gap-6 md:gap-8 min-w-max md:min-w-0 pb-1 md:pb-0">
              {[
                { icon: Calculator, label: "UK statutory assumptions", sub: "Age-band rules, service caps, current thresholds" },
                { icon: ShieldCheck, label: "Private modelling", sub: "Your data stays in your browser" },
                { icon: Home, label: "Mortgage & household scenarios", sub: "Test rate rises, rent and one-income pressure" },
                { icon: FileText, label: "One-off report access", sub: "One report. Yours to keep." },
                { icon: BarChart2, label: "Non-advisory tool", sub: "Planning model, not financial advice" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 shrink-0" data-testid={`trust-signal-${i}`}>
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: "hsl(38 72% 52% / 0.12)" }}
                  >
                    <item.icon className="w-4 h-4" style={{ color: "hsl(38 72% 58%)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "hsl(215 15% 78%)" }}>{item.label}</p>
                    <p className="text-xs" style={{ color: "hsl(215 15% 42%)" }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEM SECTION ─────────────────────────────────────────── */}
        <section className="py-20 px-6 bg-background" data-testid="section-problem">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 leading-snug">
                  Redundancy is not just a payout question. It is a runway question.
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base mb-5">
                  A redundancy package can look manageable on day one. The harder question is how it behaves over time — if a new role takes longer than expected, if mortgage or rent still needs paying, or if the household temporarily relies on one income.
                </p>
                <p className="text-muted-foreground leading-relaxed text-base">
                  RedundancyCalculatorUK helps you model that future privately — under your assumptions, not anyone else's — before speaking to a financial adviser, solicitor, or anyone else.
                </p>
              </div>
              <div className="rounded-2xl border bg-card shadow-lg p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-5">What you can plan for</p>
                <ul className="space-y-4">
                  {[
                    { icon: TrendingDown, label: "Multiple scenarios", sub: "Slow recovery, mortgage pressure, VR comparison and more." },
                    { icon: BarChart2, label: "Monthly capital path", sub: "See how your capital behaves month-by-month under each assumption." },
                    { icon: Users, label: "Household resilience", sub: "Model one-income household scenarios and partner income." },
                    { icon: ArrowRight, label: "Clear picture before any conversation", sub: "Understand your position privately first." },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4" data-testid={`plan-item-${i}`}>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-0.5">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
        <section
          className="py-20 px-6"
          id="how-it-works"
          data-testid="section-how-it-works"
          style={{ background: "hsl(60 8% 96%)" }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">How it works</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">Three steps to your private redundancy report.</p>
            </div>
            <div className="relative">
              <div className="hidden sm:block absolute top-9 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-border" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                {[
                  { step: "1", title: "Tell us your situation", desc: "Enter your redundancy package, savings, income assumptions and monthly costs. UK statutory redundancy calculation is built in.", icon: Calculator },
                  { step: "2", title: "Build your report", desc: "See your baseline runway, capital path over time, and how the model changes under different income recovery assumptions.", icon: TrendingDown },
                  { step: "3", title: "Explore the scenarios", desc: "Compare stress cases, mortgage pressure, household resilience, voluntary redundancy alternatives and expense sensitivity — all in one private report.", icon: Layers },
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center text-center" data-testid={`card-step-${item.step}`}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-6 relative z-10 shadow-md text-white"
                      style={{ background: "linear-gradient(135deg, hsl(198 65% 20%), hsl(198 65% 32%))" }}
                    >
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
        <section className="py-20 px-6 bg-background" id="scenarios" data-testid="section-scenarios">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Scenarios the report models</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                Free preview gives you the baseline. The full report unlocks every scenario.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {[
                { icon: BarChart2, label: "Baseline", desc: "How long the money lasts at your current burn rate." },
                { icon: TrendingDown, label: "Slow recovery", desc: "If a new role takes longer than expected — how much runway changes under a later return to income." },
                { icon: Home, label: "Mortgage / rent pressure", desc: "How a rate rise or rent review affects the capital path." },
                { icon: Users, label: "Household one-income", desc: "If one partner's income is temporarily the only income — how that changes the runway." },
                { icon: Repeat, label: "Voluntary redundancy", desc: "How a VR package compares to statutory entitlement under these assumptions." },
                { icon: TrendingUp, label: "Structural transition", desc: "A slower or lower-income recovery path modelled as an assumption — does not predict job outcomes." },
              ].map((scenario, i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow"
                  data-testid={`scenario-card-${i}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <scenario.icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm font-semibold mb-1.5">{scenario.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{scenario.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="btn-gold rounded-full px-8"
                onClick={() => navigate("/wizard")}
                data-testid="button-scenarios-cta"
              >
                Build my private report — Free preview
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* ── PRICING ─────────────────────────────────────────────────── */}
        <section
          className="py-20 px-6"
          id="pricing"
          data-testid="section-pricing"
          style={{ background: "hsl(60 8% 96%)" }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Simple, one-off pricing</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Start free. Unlock the full private report for a one-off payment — no subscription, ever.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto items-start">
              <Card className="border shadow-sm" data-testid="card-free-tier">
                <CardContent className="pt-8 pb-8">
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Free Preview</p>
                    <div className="text-3xl font-bold">£0</div>
                    <p className="text-sm text-muted-foreground mt-1">No account required</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      "UK statutory redundancy estimate",
                      "Runway estimate in months",
                      "Stability classification (0–100)",
                      "Capital at 3 / 6 / 12 months",
                      "Essential-only spending insight",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm">
                        <Check className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant="outline" onClick={() => navigate("/wizard")} data-testid="button-start-free">
                    Build my report — Free
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <div className="relative" data-testid="card-paid-tier-wrapper">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                    style={{
                      background: "linear-gradient(135deg, hsl(38 72% 52%), hsl(42 80% 60%))",
                      color: "hsl(215 50% 8%)",
                    }}
                  >
                    Full Report
                  </span>
                </div>
                <Card className="shadow-xl" style={{ outline: "2px solid hsl(38 72% 52%)", outlineOffset: "1px" }}>
                  <CardContent className="pt-8 pb-8">
                    <div className="mb-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Private Runway Report</p>
                      <div className="text-3xl font-bold">£39</div>
                      <p className="text-sm text-muted-foreground mt-1">One-off payment · 6 months access</p>
                    </div>
                    <ul className="space-y-3 mb-8">
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
                        <li key={i} className="flex items-center gap-2.5 text-sm">
                          {item.locked
                            ? <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            : <Check className="w-3.5 h-3.5 shrink-0 text-primary" />}
                          <span className={item.locked ? "text-muted-foreground" : "font-medium"}>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full btn-gold rounded-lg" onClick={() => navigate("/wizard")} data-testid="button-start-paid">
                      Unlock my private report — £39
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">No subscription. No recurring charges.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7-DAY RESET ─────────────────────────────────────────────── */}
        <section
          className="py-20 px-6"
          data-testid="section-reset-teaser"
          style={{ background: "hsl(186 40% 12%)" }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "hsl(38 72% 58%)" }}>
                  SUPPORTIVE NEXT STEP
                </p>
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 font-serif font-bold text-2xl"
                    style={{ background: "hsl(38 72% 52% / 0.18)", color: "hsl(38 72% 68%)" }}
                  >
                    7
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                      7-Day Redundancy Reset
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "hsl(186 20% 55%)" }}>
                      A guided 7-day plan to stabilise, plan and take control.
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(186 15% 60%)" }}>
                  Share what's going on via WhatsApp or private web-chat. Receive a calm written response within 1 working day and a practical 7-day plan. No calls. No judgement. No open-ended subscription.
                </p>
                <Link href="/redundancy-reset" data-testid="button-reset-cta">
                  <Button className="btn-gold rounded-full px-7">
                    Start your 7-day reset
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <p className="text-xs mt-3" style={{ color: "hsl(38 72% 55%)" }}>£79 launch offer · one-off support</p>
                <p className="text-xs mt-2" style={{ color: "hsl(186 15% 38%)" }}>
                  Practical written support only. Not financial, legal, debt, employment, medical or mental health advice.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Daily actions", body: "Short, practical steps for each day." },
                  { label: "Clarity & confidence", body: "Reduce overwhelm and regain control." },
                  { label: "Complements your runway report", body: "Plan today. Model tomorrow." },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-5"
                    data-testid={`reset-benefit-${i}`}
                    style={{ background: "hsl(186 40% 16%)", border: "1px solid hsl(186 35% 22%)" }}
                  >
                    <p className="text-sm font-semibold text-white mb-1.5">{item.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "hsl(186 15% 58%)" }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── UK GUIDES ───────────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-background" data-testid="section-guides">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-center mb-2">UK Redundancy Guides</h2>
            <p className="text-center text-sm text-muted-foreground mb-8">
              Contextual reading alongside your runway report. Not financial advice.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/statutory-redundancy-pay" data-testid="guide-card-statutory">
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
              <Link href="/voluntary-redundancy" data-testid="guide-card-vr">
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
        <section
          className="py-20 px-6"
          data-testid="section-faq"
          style={{ background: "hsl(60 8% 96%)" }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-10">Common questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "Is this financial advice?", a: "No. RedundancyCalculatorUK is a non-advisory modelling tool. It produces illustrative projections based entirely on the assumptions you enter. It does not constitute financial, legal, tax, employment, debt, or benefits advice. All outputs are estimates and may not reflect actual outcomes." },
                { q: "Does this predict whether I will find work?", a: "No. The tool uses historical UK labour market percentiles as reference data to model reemployment timelines, but it does not predict individual job search outcomes. Projected timelines are illustrative only and should be treated as planning assumptions, not forecasts." },
                { q: "Is my data private?", a: "Yes. All financial calculations run entirely in your browser. No sensitive financial data is transmitted to or stored on our servers. We only store a session token to manage access to paid report features." },
                { q: "Is statutory redundancy pay included?", a: "Yes. The calculator uses current UK statutory redundancy rules, including age-band multipliers, the current weekly pay cap, and the 20-year service cap. A two-year qualifying service minimum applies. The tool separates statutory redundancy pay from notice pay and holiday pay, which are treated differently for tax. Check GOV.UK for the most current thresholds." },
                { q: "Can I model voluntary redundancy?", a: "Yes. The paid report includes a voluntary redundancy comparison scenario. You can enter a VR package amount alongside your statutory entitlement and see how each affects the runway under these assumptions." },
                { q: "Can I use this with my partner?", a: "Yes. The income recovery step includes an optional partner income field. Enabling this adds partner monthly net income to the household runway model." },
                { q: "What does the paid report unlock?", a: "The full Private Runway Report (£39, one-off) unlocks: slow and severe income scenarios, mortgage and housing pressure test, household resilience view, expense sensitivity ranking, month-by-month capital path, voluntary redundancy comparison, structural transition scenario, and exportable report. Access lasts 6 months." },
                { q: "Is this a subscription?", a: "No. Both the Private Runway Report (£39) and the 7-Day Redundancy Reset are one-off payments. There are no recurring charges." },
                { q: "What is the 7-Day Redundancy Reset?", a: "A separate one-off product for people who have completed the runway calculator and want help understanding what to do next. You receive a guided private written intake, a first written response within 1 working day, a follow-up check-in, and a final Redundancy Next-Step Plan. Intake by WhatsApp or secure web-chat. No calls." },
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

        {/* ── BOTTOM CTA ──────────────────────────────────────────────── */}
        <section
          className="py-24 px-6"
          data-testid="section-bottom-cta"
          style={{ background: "linear-gradient(135deg, hsl(215 60% 6%) 0%, hsl(198 65% 12%) 100%)" }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Model your runway now.
            </h2>
            <p className="mb-8 text-sm" style={{ color: "hsl(215 15% 52%)" }}>
              Free preview in minutes. Full private report unlocked for £39.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="btn-gold rounded-full px-8"
                onClick={() => navigate("/wizard")}
                data-testid="button-bottom-cta"
              >
                Build my private report — Free preview
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8"
                style={{ borderColor: "hsl(215 30% 28%)", color: "hsl(215 15% 65%)" }}
                onClick={() => navigate("/wizard")}
                data-testid="button-bottom-cta-paid"
              >
                Unlock full report — £39
              </Button>
            </div>
          </div>
        </section>

        {/* ── FOOTER TRUST ROW ────────────────────────────────────────── */}
        <div
          className="py-5 px-6 border-t"
          style={{ background: "hsl(215 50% 8%)", borderColor: "hsl(215 30% 14%)" }}
        >
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {["Private & secure", "UK focused", "Built for individuals", "Clear, neutral, supportive"].map((label) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full" style={{ background: "hsl(38 72% 52%)" }} />
                <span className="text-xs" style={{ color: "hsl(215 15% 38%)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
