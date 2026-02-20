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
          Begin Model
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </header>

      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/4 via-transparent to-transparent dark:from-primary/8" />
        <div className="max-w-3xl mx-auto relative">
          <div className="text-center">
            <Badge variant="secondary" className="mb-8" data-testid="badge-status">
              Illustrative Capital Modelling
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Capital depletion modelling
              <br />
              for UK income disruption
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Structured projection of how savings, redundancy pay, and liquid assets
              may deplete under various income recovery assumptions. Redundancy-native
              intake with UK statutory calculation. Not financial advice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" onClick={() => navigate("/wizard")} data-testid="button-start-model">
                Begin Capital Model
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

      <section className="py-16 px-6 bg-card/50" id="methodology">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-4">Methodology</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto text-sm">
            A structured, deterministic approach to capital trajectory modelling
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Financial Intake", desc: "UK-specific redundancy calculation, capital position, income assumptions, and itemised expense categories.", icon: Calculator },
              { step: "2", title: "Trajectory Projection", desc: "Month-by-month capital depletion with threshold events, stability classification, and recovery modelling.", icon: TrendingDown },
              { step: "3", title: "Scenario Comparison", desc: "Three income recovery scenarios overlaid, sensitivity stress testing, and conditional spending analysis.", icon: Layers },
            ].map((item) => (
              <Card key={item.step} className="text-center" data-testid={`card-step-${item.step}`}>
                <CardContent className="pt-8 pb-8">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-5 h-5 text-primary" />
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
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-4">Analysis Outputs</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto text-sm">
            Institutional-grade projection outputs under your entered assumptions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: TrendingDown, title: "Capital Trajectory", desc: "Month-by-month depletion curve with threshold event markers and capital recovery projection" },
              { icon: BarChart2, title: "Income Recovery Scenarios", desc: "Three income assumptions modelled and overlaid: zero income, partial income, full recovery" },
              { icon: Shield, title: "Stability Classification", desc: "Deterministic scoring with specific explanatory factors driving the classification" },
              { icon: Activity, title: "Stress Testing", desc: "Sensitivity analysis across expense inflation, income delay, and savings variation" },
              { icon: Home, title: "Mortgage Sensitivity", desc: "Housing cost increase scenarios modelling the impact on capital depletion" },
              { icon: FileText, title: "Expense Sensitivity Ranking", desc: "Conditional spending analysis ranking each category by runway extension impact" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-md" data-testid={`feature-${i}`}>
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-4">Access</h2>
          <p className="text-center text-muted-foreground mb-10 text-sm">Free preview available. Full analysis requires a one-time unlock.</p>
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
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
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
                  <div className="text-2xl font-bold">Full Analysis</div>
                  <p className="text-sm text-muted-foreground mt-1">One-time unlock</p>
                </div>
                <ul className="space-y-3 mb-6 text-sm">
                  {[
                    { text: "Everything in free preview", locked: false },
                    { text: "Income recovery scenarios", locked: true },
                    { text: "Capital recovery timeline", locked: true },
                    { text: "Capital threshold events", locked: true },
                    { text: "Expense sensitivity ranking", locked: true },
                    { text: "Stress testing", locked: true },
                    { text: "Mortgage sensitivity", locked: true },
                    { text: "PDF export", locked: true },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {item.locked ? (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                      <span className={item.locked ? "text-muted-foreground" : ""}>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => navigate("/wizard")} data-testid="button-start-paid">
                  Begin Capital Model
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-10">Common Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "Is this financial advice?", a: "No. This tool produces illustrative capital projections based entirely on the assumptions you enter. It does not constitute financial, employment, debt, or benefits advice. All outputs are estimates and may not reflect actual outcomes." },
              { q: "How does it differ from a budgeting calculator?", a: "This is a capital depletion model, not a budget planner. It projects how long your combined savings, redundancy pay, and liquid assets may last under specific income recovery assumptions, with multi-scenario comparison and sensitivity testing." },
              { q: "Is my data stored anywhere?", a: "All financial calculations run entirely in your browser. No sensitive financial data is transmitted to or stored on our servers. We only store a session token to manage access to paid features." },
              { q: "How is the UK redundancy calculation performed?", a: "The statutory redundancy estimate uses the UK government formula: 0.5 weeks per year of service (age under 22), 1 week (ages 22-40), 1.5 weeks (age 41+), capped at £643/week and 20 years of service. This is an estimate only. You can override it with your actual package amount." },
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
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">Ready to model your capital trajectory?</h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Enter your financial position. View the projection. Compare scenarios.
          </p>
          <Button size="lg" onClick={() => navigate("/wizard")} data-testid="button-bottom-cta">
            Begin Capital Model
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <footer className="py-6 px-6 border-t text-center text-xs text-muted-foreground">
        This tool provides illustrative capital projections only. It does not constitute financial, employment, debt, or benefits advice.
      </footer>
    </div>
  );
}
