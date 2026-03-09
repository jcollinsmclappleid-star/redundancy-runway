import { useLocation } from "wouter";
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
  Database,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <DisclaimerBanner />

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b" data-testid="header-landing">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
          <Logo showTagline />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => navigate("/wizard")} data-testid="button-header-start">
              Model My Runway
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </header>

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
            Institutional Capital Modelling
          </Badge>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight text-primary-foreground">
            Know how long your
            <br />
            money may last.
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8 leading-relaxed">
            Model your capital runway under redundancy or income loss — with UK labour market data,
            projection ranges, and scenario comparison.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
              onClick={() => navigate("/wizard")}
              data-testid="button-start-model"
            >
              Model My Runway — Free Preview
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              onClick={() => {
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
              }}
              data-testid="button-see-pricing"
            >
              Full Access — £49
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <p className="text-xs text-primary-foreground/60">
            All calculations run in your browser. No financial data is transmitted or stored.
          </p>
        </div>
      </section>

      <section className="py-5 px-6 border-b bg-muted/40" data-testid="section-trust">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[
              { icon: ShieldCheck, label: "Data stays in your browser", sub: "No transmission, no storage" },
              { icon: BarChart2, label: "ONS labour market context", sub: "Office for National Statistics" },
              { icon: Calculator, label: "UK statutory redundancy calc", sub: "Age-band multipliers, £643/wk cap" },
              { icon: Database, label: "Deterministic modelling", sub: "Full formula transparency" },
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

      <section className="py-16 px-6" data-testid="section-how-it-works">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Three steps from uncertainty to structured visibility.
            </p>
          </div>
          <div className="relative">
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1.25rem)] right-[calc(16.67%+1.25rem)] h-px bg-border" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Enter your position", desc: "Redundancy package, savings, income assumptions, and expenses. UK statutory calculation built in.", icon: Calculator },
                { step: "2", title: "View projections", desc: "Capital trajectory, depletion timeline, and projection range modelled across reemployment percentiles.", icon: TrendingDown },
                { step: "3", title: "Compare scenarios", desc: "Scenario overlay, stress testing, sensitivity ranking, and UK benchmark context.", icon: Layers },
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

      <section className="py-16 px-6 bg-primary" data-testid="section-product-preview">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-3">
              See what your model looks like.
            </h2>
            <p className="text-primary-foreground/70 text-sm max-w-md mx-auto">
              Free preview gives you the headline figures. Unlock the full analysis for £49.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="bg-white/10 border-white/15 text-primary-foreground" data-testid="preview-free-card">
              <CardContent className="pt-6 pb-6">
                <Badge className="mb-4 bg-white/15 text-primary-foreground border-white/20 text-xs">Free Preview</Badge>
                <div className="mb-4">
                  <p className="text-xs text-primary-foreground/60 mb-1">Capital runway estimate</p>
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
                <Badge className="mb-4 bg-white/15 text-primary-foreground border-white/20 text-xs">Full Model — £49</Badge>
                <ul className="space-y-2.5">
                  {[
                    "60-month capital trajectory chart",
                    "Projection range: p25 / p50 / p75",
                    "Income recovery scenario overlay",
                    "Expense sensitivity ranking",
                    "Stress testing (6 scenarios)",
                    "UK ONS benchmark context",
                    "Mortgage sensitivity analysis",
                    "Structured export",
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
          <div className="text-center mt-8">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
              onClick={() => navigate("/wizard")}
              data-testid="button-preview-cta"
            >
              Start Free Preview
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30" id="pricing" data-testid="section-pricing">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Choose your access level</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Start free. Unlock the full model for a one-time payment — no subscription.
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
                  Start Free Preview
                </Button>
              </CardContent>
            </Card>

            <div className="relative" data-testid="card-paid-tier-wrapper">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium shadow-sm">
                  Full Access
                </Badge>
              </div>
              <Card className="ring-2 ring-primary shadow-lg">
                <CardContent className="pt-8 pb-8">
                  <div className="mb-6">
                    <div className="text-3xl font-bold">£49</div>
                    <p className="text-sm text-muted-foreground mt-1">One-time. 6 months access.</p>
                  </div>
                  <ul className="space-y-3 mb-8 text-sm">
                    {[
                      { text: "Everything in free preview", locked: false },
                      { text: "60-month capital trajectory", locked: true },
                      { text: "Projection range (p25 / p50 / p75)", locked: true },
                      { text: "Income recovery scenarios", locked: true },
                      { text: "Expense sensitivity ranking", locked: true },
                      { text: "Stress testing & mortgage sensitivity", locked: true },
                      { text: "UK benchmark context layer", locked: true },
                      { text: "Structured export", locked: true },
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
                    Unlock Full Model — £49
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

      <section className="py-16 px-6" data-testid="section-faq">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">Common Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Is this financial advice?",
                a: "No. This tool produces illustrative capital projections based entirely on the assumptions you enter. It does not constitute financial, employment, debt, or benefits advice. All outputs are estimates and may not reflect actual outcomes.",
              },
              {
                q: "How does it differ from a budgeting app?",
                a: "This is a capital depletion model, not a budget planner. It projects how long your combined savings, redundancy pay, and liquid assets may last under specific income recovery assumptions — with multi-scenario comparison and projection range modelling.",
              },
              {
                q: "Is my data stored anywhere?",
                a: "All financial calculations run entirely in your browser. No sensitive financial data is transmitted to or stored on our servers. We only store a session token to manage access to paid features.",
              },
              {
                q: "What is the projection range?",
                a: "The projection range models three reemployment timing outcomes based on historical UK labour market percentiles for your sector and age group: faster (25th percentile), typical (median), and slower (75th percentile). This creates a band rather than a single point estimate.",
              },
              {
                q: "Where does the benchmark data come from?",
                a: "Benchmark data is sourced from the Office for National Statistics, including labour market statistics, the Wealth and Assets Survey, and household expenditure data. All benchmarks are contextual only and do not constitute advice.",
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

      <section className="py-20 px-6 bg-primary" data-testid="section-bottom-cta">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Model your runway now.
          </h2>
          <p className="text-primary-foreground/70 mb-8 text-sm">
            Free preview in minutes. Full analysis unlocked for £49.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-md"
              onClick={() => navigate("/wizard")}
              data-testid="button-bottom-cta"
            >
              Get Started — Free Preview
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              onClick={() => navigate("/wizard")}
              data-testid="button-bottom-cta-paid"
            >
              Unlock Full Model — £49
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
