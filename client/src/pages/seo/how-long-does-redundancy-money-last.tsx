import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingDown, Clock, Home } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";

export default function HowLongRedundancyMoneyLastPage() {
  return (
    <>
      <Helmet>
        <title>How Long Does Redundancy Money Last? A UK Planning Guide | RedundancyCalculatorUK</title>
        <meta name="description" content="What determines how long redundancy pay lasts — expenses, income gap, mortgage pressure and savings rate. Model your own assumptions with the free UK redundancy runway calculator." />
        <link rel="canonical" href="https://redundancycalculatoruk.com/how-long-does-redundancy-money-last" />
        <meta property="og:title" content="How Long Does Redundancy Money Last? A UK Planning Guide" />
        <meta property="og:description" content="What determines how long redundancy pay lasts — expenses, income gap, mortgage pressure and savings rate. Model your own assumptions with the free UK redundancy runway calculator." />
        <meta property="og:url" content="https://redundancycalculatoruk.com/how-long-does-redundancy-money-last" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "How Long Does Redundancy Money Last? A UK Planning Guide",
          "description": "What determines how long redundancy pay lasts — expenses, income gap, mortgage pressure and savings rate.",
          "publisher": { "@type": "Organization", "name": "RedundancyCalculatorUK", "url": "https://redundancycalculatoruk.com" },
          "dateModified": "2025-04-01",
          "mainEntityOfPage": "https://redundancycalculatoruk.com/how-long-does-redundancy-money-last"
        })}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />

        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <Logo />
            <Link href="/wizard">
              <Button size="sm" data-testid="button-header-cta">
                Model my runway
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
                How Long Does Redundancy Money Last?
              </h1>
              <p className="text-primary-foreground/75 text-base leading-relaxed max-w-2xl">
                There is no single answer. How long your redundancy pay lasts depends on your total starting capital, your monthly costs, any income during the gap, and how long it takes to return to full income. This guide explains the key factors and how to model your own situation.
              </p>
              <p className="text-primary-foreground/50 text-xs mt-4">
                All projections are illustrative and based on user-entered assumptions. Not financial advice.
              </p>
            </div>
          </section>

          <section className="py-12 px-6" data-testid="section-content">
            <div className="max-w-3xl mx-auto space-y-10">

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">The core equation: capital vs. burn rate</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  At its simplest, how long your money lasts comes down to two things:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Card className="bg-muted/30">
                    <CardContent className="pt-4 pb-4">
                      <p className="text-sm font-medium mb-1">Starting capital</p>
                      <p className="text-xs text-muted-foreground">Your redundancy pay + savings + any other lump sums available at the point income stops.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30">
                    <CardContent className="pt-4 pb-4">
                      <p className="text-sm font-medium mb-1">Net monthly burn</p>
                      <p className="text-xs text-muted-foreground">Your monthly expenses minus any income you have during the gap (part-time work, partner income, benefits).</p>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  If your monthly burn rate is £2,000 and your starting capital is £30,000, the basic runway is 15 months — before factoring in when income might resume. Once income resumes, the capital burn slows or stops, which is why the income recovery timeline matters as much as the starting figure.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Why the statutory redundancy figure is rarely the whole picture</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Many people focus on the redundancy pay figure. But in most cases, the statutory payment alone is a relatively small part of the total starting capital available:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Statutory redundancy pay for a 40-year-old with 10 years' service and average UK earnings might be around £6,000–£8,000.",
                    "Existing savings, ISAs or investments may significantly exceed that amount.",
                    "Notice pay (which is separate) can add several months' salary depending on your contract.",
                    "A household with a partner's continuing income has a very different burn rate to a single-income household.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/50 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                  This is why a full runway model — one that takes your actual savings, expenses and income assumptions into account — tends to give a more useful picture than the statutory figure alone.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">The five factors that most affect runway</h2>
                <div className="space-y-4">
                  {[
                    {
                      icon: TrendingDown,
                      title: "1. Monthly essential expenses",
                      body: "Housing (mortgage or rent), utilities, food, insurance and debt payments are the expenses that cannot easily be reduced. The higher these are as a percentage of your total spending, the less flexibility you have. A household spending £3,500/month on essentials burns through capital roughly twice as fast as one spending £1,750.",
                    },
                    {
                      icon: Clock,
                      title: "2. How long until income resumes",
                      body: "UK labour market data suggests the median time from redundancy to re-employment varies significantly by sector and age. Some sectors see median re-employment in 8–12 weeks; others closer to 20+ weeks. An assumption of 3 months vs 9 months makes a substantial difference to capital depletion.",
                    },
                    {
                      icon: Home,
                      title: "3. Housing cost structure",
                      body: "For homeowners with a mortgage, a base rate increase can add meaningfully to monthly outgoings. For renters, a lease renewal during the gap period could change the burn rate. Mortgage sensitivity is one of the scenarios most worth modelling before it happens.",
                    },
                    {
                      icon: ArrowRight,
                      title: "4. Income recovery level",
                      body: "Some people return to exactly their previous income. Others — particularly those changing industry, stepping down from senior roles, or entering self-employment — may earn significantly less for an extended period. A slow or lower-income recovery path has a compounding effect on how long capital lasts.",
                    },
                    {
                      icon: ArrowRight,
                      title: "5. Non-essential spending",
                      body: "Subscriptions, dining, travel and discretionary spending can often be reduced. How much of your current spending is non-essential is a significant lever. The runway calculator shows what happens if non-essential spending were reduced or eliminated entirely, expressed as additional months of runway.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30" data-testid={`factor-${i}`}>
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">What "running out of money" actually means</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  The runway estimate is not a cliff edge — it is a planning model. In practice, what happens as capital approaches depletion depends on your circumstances:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Most people will have taken employment before capital is fully depleted.",
                    "Benefits eligibility may provide a partial income floor, depending on National Insurance record and household circumstances.",
                    "Non-essential spending can be reduced progressively, extending the runway.",
                    "Assets not modelled (e.g. pension access at 55/57, property equity) may provide additional options.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/50 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                  The value of modelling is not to predict the future — it is to understand the shape of the risk in advance, so decisions can be made with clearer information.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">How to model your own runway</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  RedundancyCalculatorUK lets you enter your redundancy package details, savings, monthly expenses and income assumptions, and builds an illustrative projection. The free preview shows your baseline runway estimate. The full paid report shows:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  {[
                    "How the runway changes if income recovery takes longer than expected.",
                    "How mortgage rate rises affect the capital path.",
                    "How much each category of spending adds to or reduces your runway.",
                    "A comparison of fast, typical and slow income recovery scenarios using UK labour market percentile data.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Card className="bg-primary text-primary-foreground" data-testid="card-cta">
                <CardContent className="pt-8 pb-8 text-center">
                  <h3 className="font-serif text-xl font-bold mb-2">Model your own runway — free</h3>
                  <p className="text-primary-foreground/75 text-sm mb-6 max-w-sm mx-auto">
                    Enter your situation and see how long your money may last under different assumptions. UK statutory calculation included.
                  </p>
                  <Link href="/wizard">
                    <Button className="bg-white text-primary hover:bg-white/90 font-semibold" data-testid="button-cta-calculator">
                      Start the free runway model
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-primary-foreground/50 mt-3">Illustrative projections based on your assumptions. Not financial advice.</p>
                </CardContent>
              </Card>

            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
