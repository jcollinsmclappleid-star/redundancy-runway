import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Lock,
  ChevronDown,
  BarChart2,
  Layers,
  FileText,
  Calculator,
  TrendingDown,
  Shield,
  Home,
  Activity,
  Check,
  X,
  Briefcase,
  Users,
  Database,
  Eye,
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

      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/4 via-transparent to-transparent dark:from-primary/8" />
        <div className="max-w-3xl mx-auto relative">
          <div className="text-center">
            <Badge variant="secondary" className="mb-8" data-testid="badge-status">
              Institutional Capital Modelling
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Model your financial runway
              <br />
              with institutional clarity.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
              RedundancyRunway projects how long your capital may sustain you under income disruption
              — using structured modelling and UK labour market data context.
            </p>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-10">
              See your depletion timeline, recovery range, and scenario comparison in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" onClick={() => navigate("/wizard")} data-testid="button-start-model">
                Model My Runway
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                document.getElementById("methodology")?.scrollIntoView({ behavior: "smooth" });
              }} data-testid="button-methodology">
                View Methodology
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              All calculations run in your browser. No financial data is transmitted or stored on our servers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-4">From income shock to structured visibility.</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-sm leading-relaxed">
            RedundancyRunway converts your savings, redundancy package, and expense structure into a capital projection model.
            All modelling is deterministic and assumption-based.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "How long capital may last under your assumptions",
              "How different income recovery timelines affect depletion",
              "When capital thresholds may be reached",
              "How expense changes alter projected duration",
              "Where your position sits relative to UK benchmarks",
              "Capital recovery timeline if income resumes",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-md" data-testid={`what-it-shows-${i}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0 mt-2" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-4">Not a single number. A projection range.</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-sm leading-relaxed">
            Rather than relying on one assumed timeline, RedundancyRunway models three reemployment
            percentile outcomes — creating a structured projection band so you can see how sensitive
            your runway is to income recovery timing.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Faster historical outcome", percentile: "25th percentile" },
              { label: "Typical historical outcome", percentile: "Median" },
              { label: "Slower historical outcome", percentile: "75th percentile" },
            ].map((item, i) => (
              <Card key={i} className="text-center" data-testid={`projection-range-${i}`}>
                <CardContent className="pt-6 pb-6">
                  <Badge variant="outline" className="mb-3">{item.percentile}</Badge>
                  <p className="text-sm font-medium">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6">
            Historical labour market statistics are used for contextual modelling only.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-card/50" id="methodology">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-4">Built for mid-career professionals.</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto text-sm">
            Four pillars of institutional modelling
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Calculator, title: "Redundancy-Native Modelling", desc: "Structured redundancy package estimation built into capital calculations. UK statutory formula with age-band multipliers, weekly pay cap, and enhanced package support." },
              { icon: Eye, title: "Deterministic Engine", desc: "Clear formulas. Transparent assumptions. No black-box scoring. Every output traces directly to the inputs you provide." },
              { icon: Database, title: "UK Benchmark Context", desc: "Savings benchmarks, housing burden reference points, and labour market data layered into results for contextual positioning." },
              { icon: FileText, title: "Institutional Presentation", desc: "Structured report format suitable for focused financial review. Copy-to-clipboard summary with full assumptions appendix." },
            ].map((item, i) => (
              <Card key={i} data-testid={`pillar-${i}`}>
                <CardContent className="pt-6 pb-6">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-4">Your structured financial impact report includes:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            {[
              { icon: TrendingDown, text: "Capital depletion timeline (0-60 months)" },
              { icon: Layers, text: "Projection range (Fast / Typical / Slower)" },
              { icon: BarChart2, text: "Scenario comparison modelling" },
              { icon: TrendingDown, text: "Capital recovery estimate (if income resumes)" },
              { icon: Activity, text: "Expense sensitivity modelling" },
              { icon: Shield, text: "Assumption stress testing" },
              { icon: Database, text: "UK redundancy environment context" },
              { icon: Home, text: "Savings position comparison" },
              { icon: FileText, text: "Full assumptions appendix" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-md" data-testid={`report-item-${i}`}>
                <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-12">
            How RedundancyRunway compares
          </h2>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-comparison">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-3 font-medium text-muted-foreground">Feature</th>
                        <th className="text-center py-3 px-3 font-medium text-muted-foreground">Free Budget Tools</th>
                        <th className="text-center py-3 px-3 font-medium">RedundancyRunway</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        "Capital depletion timeline",
                        "Projection range modelling",
                        "Reemployment percentile modelling",
                        "UK benchmark context",
                        "Structured export report",
                      ].map((feature, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-3 px-3">{feature}</td>
                          <td className="py-3 px-3 text-center">
                            <X className="w-4 h-4 text-muted-foreground mx-auto" />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Check className="w-4 h-4 mx-auto" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6">Designed for:</h2>
              <ul className="space-y-3">
                {[
                  "Professionals facing redundancy",
                  "Individuals modelling voluntary exit",
                  "Households assessing income disruption risk",
                  "Mid-career earners with mortgage exposure",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" data-testid={`designed-for-${i}`}>
                    <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6">Not designed for:</h2>
              <ul className="space-y-3">
                {[
                  "Legal redundancy disputes",
                  "Debt restructuring advice",
                  "Benefits optimisation advice",
                  "Tax advisory services",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground" data-testid={`not-for-${i}`}>
                    <X className="w-4 h-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-4">Full Projection Access</h2>
          <p className="text-center text-muted-foreground mb-10 text-sm">One-time payment. Six months of modelling access.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card data-testid="card-free-tier">
              <CardContent className="pt-8 pb-8">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold">Free Preview</div>
                  <p className="text-sm text-muted-foreground mt-1">No account required</p>
                </div>
                <ul className="space-y-3 mb-6 text-sm">
                  {[
                    "Approximate runway in months",
                    "Stability classification",
                    "Capital at 3/6/12 month intervals",
                    "Essential-only spending insight",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
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
                  <p className="text-sm text-muted-foreground mt-1">One-time payment</p>
                </div>
                <ul className="space-y-3 mb-6 text-sm">
                  {[
                    { text: "Everything in free preview", locked: false },
                    { text: "60-month capital projection", locked: true },
                    { text: "Projection range (Fast/Typical/Slower)", locked: true },
                    { text: "Income recovery scenarios", locked: true },
                    { text: "Capital recovery timeline", locked: true },
                    { text: "Expense sensitivity ranking", locked: true },
                    { text: "Stress testing", locked: true },
                    { text: "UK benchmark context layer", locked: true },
                    { text: "Mortgage sensitivity", locked: true },
                    { text: "Structured export", locked: true },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {item.locked ? (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                      )}
                      <span className={item.locked ? "text-muted-foreground" : ""}>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => navigate("/wizard")} data-testid="button-start-paid">
                  Unlock Full Model
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-center mb-4">Why one-time payment?</h2>
          <p className="text-center text-muted-foreground mb-10 text-sm max-w-xl mx-auto leading-relaxed">
            RedundancyRunway is not a subscription budgeting app. It is a structured modelling instrument
            designed for focused financial review during income disruption. Access includes unlimited
            recalculations for six months from purchase.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Instant access", desc: "after payment" },
              { label: "6 months", desc: "modelling window" },
              { label: "Secure payment", desc: "via Stripe" },
              { label: "No recurring", desc: "charges" },
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-4">Methodology & data sources</h2>
          <p className="text-center text-muted-foreground mb-10 text-sm max-w-xl mx-auto leading-relaxed">
            RedundancyRunway combines user-entered financial assumptions with deterministic projection logic,
            Office for National Statistics labour data, household savings benchmarks, and historical reemployment percentiles.
            All outputs are illustrative and assumption-driven.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Financial Intake", desc: "UK-specific redundancy calculation, capital position, income assumptions, and itemised expense categories.", icon: Calculator },
              { step: "2", title: "Trajectory Projection", desc: "Month-by-month capital depletion with threshold events, stability classification, recovery modelling, and projection range.", icon: TrendingDown },
              { step: "3", title: "Scenario Comparison", desc: "Three income recovery scenarios overlaid, sensitivity stress testing, and conditional spending analysis.", icon: Layers },
            ].map((item) => (
              <Card key={item.step} className="text-center" data-testid={`card-step-${item.step}`}>
                <CardContent className="pt-8 pb-8">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <Badge variant="outline" className="mb-3">{`Phase ${item.step}`}</Badge>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-10">Common Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "Is this financial advice?", a: "No. This tool produces illustrative capital projections based entirely on the assumptions you enter. It does not constitute financial, employment, debt, or benefits advice. All outputs are estimates and may not reflect actual outcomes." },
              { q: "How does it differ from a budgeting calculator?", a: "This is a capital depletion model, not a budget planner. It projects how long your combined savings, redundancy pay, and liquid assets may last under specific income recovery assumptions, with multi-scenario comparison, projection range modelling, and sensitivity testing." },
              { q: "Is my data stored anywhere?", a: "All financial calculations run entirely in your browser. No sensitive financial data is transmitted to or stored on our servers. We only store a session token to manage access to paid features." },
              { q: "How is the UK redundancy calculation performed?", a: "The statutory redundancy estimate uses the UK government formula: 0.5 weeks per year of service (age under 22), 1 week (ages 22-40), 1.5 weeks (age 41+), capped at £643/week and 20 years of service. This is an estimate only. You can override it with your actual package amount." },
              { q: "What is the projection range?", a: "The projection range models three reemployment timing outcomes based on historical UK labour market percentiles for your sector and age group: a faster outcome (25th percentile), typical outcome (median), and slower outcome (75th percentile). This creates a band rather than a single point estimate." },
              { q: "Where does the benchmark data come from?", a: "Benchmark data is sourced from the Office for National Statistics, including labour market statistics, the Wealth and Assets Survey, and household expenditure data. Data is updated quarterly. All benchmarks are contextual only and do not constitute advice." },
              { q: "How accurate are the projections?", a: "Projections are deterministic models that show what may happen under the specific assumptions you enter. They do not account for inflation, investment returns, tax changes, or other variable factors. Actual outcomes will differ." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left" data-testid={`faq-trigger-${i}`}>{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16 px-6 bg-primary/4 dark:bg-primary/8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">Access Full Projection Analysis</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Structured visibility. Clear assumptions. No guesswork.
          </p>
          <Button size="lg" onClick={() => navigate("/wizard")} data-testid="button-bottom-cta">
            Unlock Full Model &mdash; &pound;49
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Access valid for six months from purchase date.
          </p>
        </div>
      </section>

      <footer className="py-8 px-6 border-t">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            This platform provides illustrative financial modelling based on assumptions you enter and published statistical data.
            It does not provide financial, employment, tax, debt, or benefits advice.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Data sources: Office for National Statistics (Labour Market Statistics, Wealth & Assets Survey, Household Expenditure Data).
            Benchmark data last updated: Q4 2025.
          </p>
        </div>
      </footer>
    </div>
  );
}
