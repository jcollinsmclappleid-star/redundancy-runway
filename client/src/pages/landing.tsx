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
  Monitor,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen">
      <DisclaimerBanner />

      <header className="flex items-center justify-between gap-4 px-6 py-4 border-b flex-wrap">
        <Logo showTagline />
        <Button variant="outline" onClick={() => navigate("/wizard")} data-testid="button-header-start">
          Model My Runway
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </header>

      <section className="relative py-16 sm:py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/4 via-transparent to-transparent dark:from-primary/8" />
        <div className="max-w-3xl mx-auto relative text-center">
          <Badge variant="secondary" className="mb-6" data-testid="badge-status">
            Capital Modelling for Income Disruption
          </Badge>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-5 leading-tight">
            Know how long your
            <br />
            money may last.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Model your capital runway under redundancy or income loss
            — with UK labour market data, projection ranges, and scenario comparison.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <Button size="lg" onClick={() => navigate("/wizard")} data-testid="button-start-model">
              Model My Runway &mdash; Free Preview
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => {
              document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
            }} data-testid="button-see-pricing">
              See Full Access &mdash; &pound;49
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            All calculations run in your browser. No financial data is transmitted or stored.
          </p>
        </div>
      </section>

      <section className="py-6 px-6 border-y bg-muted/30">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { icon: ShieldCheck, text: "Data stays in your browser" },
            { icon: BarChart2, text: "ONS labour market context" },
            { icon: Monitor, text: "Deterministic modelling" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground" data-testid={`trust-signal-${i}`}>
              <item.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-3">How it works</h2>
          <p className="text-center text-sm text-muted-foreground mb-10 max-w-lg mx-auto">
            Three steps from uncertainty to structured visibility.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Enter your position", desc: "Redundancy package, savings, income assumptions, and expenses. UK statutory calculation built in.", icon: Calculator },
              { step: "2", title: "View projections", desc: "Capital trajectory, depletion timeline, and projection range modelled across reemployment percentiles.", icon: TrendingDown },
              { step: "3", title: "Compare scenarios", desc: "Scenario overlay, stress testing, sensitivity ranking, and UK benchmark context.", icon: Layers },
            ].map((item) => (
              <Card key={item.step} className="text-center" data-testid={`card-step-${item.step}`}>
                <CardContent className="pt-6 pb-6">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <Badge variant="outline" className="mb-3">{`Step ${item.step}`}</Badge>
                  <h3 className="font-semibold mb-2 text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-6 bg-card/50" id="pricing">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-3">Choose your access level</h2>
          <p className="text-center text-sm text-muted-foreground mb-10 max-w-md mx-auto">
            Start with a free preview. Unlock full analysis for a one-time payment.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card data-testid="card-free-tier">
              <CardContent className="pt-8 pb-8">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold">Free Preview</div>
                  <p className="text-sm text-muted-foreground mt-1">No account required</p>
                </div>
                <ul className="space-y-3 mb-6 text-sm">
                  {[
                    "Approximate runway estimate",
                    "Stability classification",
                    "Capital at 3 / 6 / 12 months",
                    "Essential-only spending insight",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" onClick={() => navigate("/wizard")} data-testid="button-start-free">
                  Start Free Preview
                </Button>
              </CardContent>
            </Card>
            <Card data-testid="card-paid-tier">
              <CardContent className="pt-8 pb-8">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold">&pound;49</div>
                  <p className="text-sm text-muted-foreground mt-1">One-time. 6 months access.</p>
                </div>
                <ul className="space-y-3 mb-6 text-sm">
                  {[
                    { text: "Everything in free preview", locked: false },
                    { text: "60-month capital trajectory", locked: true },
                    { text: "Projection range (p25 / p50 / p75)", locked: true },
                    { text: "Income recovery scenarios", locked: true },
                    { text: "Expense sensitivity ranking", locked: true },
                    { text: "Stress testing & mortgage sensitivity", locked: true },
                    { text: "UK benchmark context", locked: true },
                    { text: "Structured export", locked: true },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {item.locked ? (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <Check className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      )}
                      <span className={item.locked ? "text-muted-foreground" : ""}>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => navigate("/wizard")} data-testid="button-start-paid">
                  Unlock Full Model &mdash; &pound;49
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  No subscription. No recurring charges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-center mb-8">Common Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "Is this financial advice?", a: "No. This tool produces illustrative capital projections based entirely on the assumptions you enter. It does not constitute financial, employment, debt, or benefits advice." },
              { q: "How does it differ from a budgeting app?", a: "This is a capital depletion model, not a budget planner. It projects how long your combined savings, redundancy pay, and liquid assets may last under specific income recovery assumptions, with multi-scenario comparison and projection range modelling." },
              { q: "Is my data stored anywhere?", a: "All financial calculations run entirely in your browser. No sensitive financial data is transmitted to or stored on our servers." },
              { q: "What is the projection range?", a: "The projection range models three reemployment timing outcomes based on historical UK labour market percentiles for your sector and age group: faster (25th percentile), typical (median), and slower (75th percentile)." },
              { q: "Where does the benchmark data come from?", a: "Office for National Statistics — labour market statistics, Wealth and Assets Survey, and household expenditure data. All benchmarks are contextual only." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm" data-testid={`faq-trigger-${i}`}>{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-14 px-6 bg-primary/4 dark:bg-primary/8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">Model your runway now.</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Free preview in minutes. Full access for &pound;49.
          </p>
          <Button size="lg" onClick={() => navigate("/wizard")} data-testid="button-bottom-cta">
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <footer className="py-6 px-6 border-t">
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Illustrative financial modelling based on assumptions you enter and published statistical data.
            Not financial, employment, tax, debt, or benefits advice.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Data: Office for National Statistics. Benchmark data last updated Q4 2025.
          </p>
        </div>
      </footer>
    </div>
  );
}
