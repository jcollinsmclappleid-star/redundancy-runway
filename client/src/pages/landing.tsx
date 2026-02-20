import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingDown,
  BarChart3,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
  Lock,
  LineChart,
  Layers,
  FileText,
  ChevronDown,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 sm:py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 dark:from-primary/10 dark:to-primary/5" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6" data-testid="badge-status">
              <Clock className="w-3 h-3 mr-1" />
              Illustrative Modelling Tool
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
              See how long your savings
              <br />
              <span className="text-primary">may last</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Model your financial runway under income disruption.
              Compare scenarios. Understand the projection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" onClick={() => navigate("/wizard")} data-testid="button-start-estimate">
                Start My Projection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }} data-testid="button-learn-more">
                How It Works
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Private. No sign-up required. All calculations run in your browser.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-card/50" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Enter Your Figures", desc: "Savings, income assumptions, and monthly expenses. Use best estimates.", icon: FileText },
              { step: "2", title: "View Projections", desc: "See month-by-month capital depletion under your assumptions.", icon: LineChart },
              { step: "3", title: "Compare Scenarios", desc: "Model different income and spending assumptions side by side.", icon: Layers },
            ].map((item) => (
              <Card key={item.step} className="text-center" data-testid={`card-step-${item.step}`}>
                <CardContent className="pt-6 pb-6">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="mb-3">{`Step ${item.step}`}</Badge>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">What You Get</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Structured projection modelling to help clarify financial assumptions during income disruption.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: TrendingDown, title: "Capital Runway Projection", desc: "Month-by-month capital depletion timeline with milestone markers" },
              { icon: BarChart3, title: "Scenario Comparison", desc: "Compare up to 3 income and spending assumption scenarios side by side" },
              { icon: Shield, title: "Projection Stability Index", desc: "Deterministic scoring reflecting modelled cashflow sustainability" },
              { icon: Clock, title: "Sensitivity Analysis", desc: "See how expense increases and income delays affect your projection" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-md" data-testid={`feature-${i}`}>
                <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
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

      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Unlock Full Analysis</h2>
          <p className="text-center text-muted-foreground mb-10">See what's included in the full projection report</p>
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 pb-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold">Free Preview</div>
                <p className="text-sm text-muted-foreground mt-1">Approximate runway months shown free</p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Approximate runway in months",
                  "Multi-scenario comparison",
                  "Projection Stability Index",
                  "Month-by-month timeline",
                  "Milestone threshold markers",
                  "Spending impact analysis",
                  "Sensitivity projections",
                  "Sector reemployment data",
                  "Monthly check-in tracking",
                  "Downloadable PDF summary",
                  "6-month unlimited access",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    {i === 0 ? (
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={i > 0 ? "text-muted-foreground" : ""}>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => navigate("/wizard")} data-testid="button-start-free">
                Start Free Projection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Common Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "Is this financial advice?", a: "No. This tool provides illustrative financial projections based on assumptions you enter. It does not provide financial, employment, debt, or benefits advice. All projections are estimates and may not reflect your actual circumstances." },
              { q: "Is my data stored?", a: "All financial calculations run entirely in your browser. No sensitive financial data is sent to our servers. We only store a session token to manage access to paid features." },
              { q: "How accurate are the projections?", a: "Projections are as accurate as the assumptions you enter. They are illustrative models showing what may happen under those specific assumptions. Actual outcomes will vary." },
              { q: "What do I get with the free version?", a: "The free preview shows your approximate runway in months. The full analysis includes scenario comparison, milestone timeline, spending impact analysis, sensitivity projections, and a downloadable PDF summary." },
              { q: "Can I update my figures later?", a: "Yes. Paid access includes 6 months of unlimited projections with the monthly check-in feature, allowing you to track actual vs projected figures." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left" data-testid={`faq-trigger-${i}`}>{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5 dark:bg-primary/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to see your projection?</h2>
          <p className="text-muted-foreground mb-8">
            Enter your figures. See your runway. Compare scenarios.
          </p>
          <Button size="lg" onClick={() => navigate("/wizard")} data-testid="button-bottom-cta">
            Start My Projection
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
