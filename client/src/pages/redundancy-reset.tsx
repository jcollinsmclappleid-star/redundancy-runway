import { Helmet } from "react-helmet-async";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Clock,
  Shield,
  X,
  AlertTriangle,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getSessionToken } from "@/lib/sessionToken";
import { RESET_PRICE_GBP_DISPLAY } from "@shared/product";

const BOUNDARY_DISCLAIMER =
  "This is practical written support only. It is not financial, legal, debt, employment, medical or mental health advice.";

function useResetCheckout() {
  return useMutation({
    mutationFn: async () => {
      const sessionToken = getSessionToken();
      const response = await apiRequest("POST", "/api/reset-checkout", { sessionToken });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message ?? "Could not start checkout");
      }
    },
  });
}

export default function RedundancyResetPage() {
  const [, navigate] = useLocation();
  const checkout = useResetCheckout();

  return (
    <>
      <Helmet>
        <title>7-Day Redundancy Reset — Private Written Support | RedundancyCalculatorUK</title>
        <meta name="description" content="A private written intake and 7-day action plan for people facing redundancy. Share your situation through the Private Reset Portal. Receive a calm written response within 1 working day. Not financial advice." />
        <link rel="canonical" href="https://www.redundancycalculatoruk.co.uk/redundancy-reset" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RedundancyCalculatorUK" />
        <meta property="og:title" content="7-Day Redundancy Reset — Private Written Support" />
        <meta property="og:description" content="A private written intake and 7-day action plan for people facing redundancy. Share your situation through the Private Reset Portal. Receive a calm written response within 1 working day." />
        <meta property="og:url" content="https://www.redundancycalculatoruk.co.uk/redundancy-reset" />
        <meta property="og:image" content="https://www.redundancycalculatoruk.co.uk/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="7-Day Redundancy Reset — Private Written Support" />
        <meta name="twitter:description" content="A private written intake and 7-day action plan for people facing redundancy. Receive a calm written response within 1 working day." />
        <meta name="twitter:image" content="https://www.redundancycalculatoruk.co.uk/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "7-Day Redundancy Reset",
          "description": "Private written intake and 7-day action plan for people facing redundancy. Not financial, legal or employment advice.",
          "brand": { "@type": "Brand", "name": "RedundancyCalculatorUK" },
          "offers": {
            "@type": "Offer",
            "price": String(RESET_PRICE_GBP_DISPLAY),
            "priceCurrency": "GBP",
            "availability": "https://schema.org/InStock",
            "name": "7-Day Redundancy Reset",
          }
        })}</script>
      </Helmet>
    <div className="min-h-screen flex flex-col">
      <DisclaimerBanner />

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b" data-testid="header-reset">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Logo showTagline />
          </div>
          <Button
            size="sm"
            onClick={() => checkout.mutate()}
            disabled={checkout.isPending}
            data-testid="button-header-cta"
          >
            {checkout.isPending ? "Loading…" : "Start my 7-Day Reset"}
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-6 bg-primary overflow-hidden" data-testid="section-hero-reset">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
        <div className="max-w-3xl mx-auto relative text-center">
          <Badge className="mb-6 bg-white/15 text-primary-foreground border-white/20 hover:bg-white/15" data-testid="badge-reset">
            7-Day Redundancy Reset
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight mb-5 leading-tight text-primary-foreground">
            Get a clearer next step
            <br />
            after redundancy.
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-6 leading-relaxed">
            Practical written support and a clear 7-day plan — delivered privately,
            without calls, without judgement, without open-ended commitment.
          </p>
          <p className="text-sm text-primary-foreground/60 max-w-2xl mx-auto mb-8 italic">
            {BOUNDARY_DISCLAIMER}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
              onClick={() => checkout.mutate()}
              disabled={checkout.isPending}
              data-testid="button-hero-cta"
            >
              {checkout.isPending ? "Loading…" : "Start my 7-Day Redundancy Reset"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {checkout.isError && (
            <p className="text-sm text-red-300 mt-3" data-testid="text-checkout-error">
              {(checkout.error as Error)?.message ?? "Something went wrong. Please try again."}
            </p>
          )}
          <p className="text-sm text-primary-foreground/70 mt-6">£{RESET_PRICE_GBP_DISPLAY} · one-off payment · no subscription</p>
          <p className="text-xs text-primary-foreground/60 mt-1">You will complete your private intake after payment.</p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="py-14 px-6 bg-background" data-testid="section-who-for">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-8">
            Who this is for
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "You have just been made redundant or are in the at-risk period and feel unsure what to do first.",
              "You have run the runway calculator and the result has left you with questions you don't know how to answer.",
              "You want a calm, private starting point — not a sales call, not generic articles.",
              "You want practical written clarity on what to prioritise in the next 7 days.",
              "You are dealing with practical decisions around money, job searching, or household costs and want a structured response.",
              "You want written support you can refer back to, not a conversation that disappears.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3" data-testid={`who-for-item-${i}`}>
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final plan preview */}
      <section className="py-14 px-6 bg-muted/20" data-testid="section-final-plan-preview">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3 text-xs bg-gold/10 text-gold border-gold/30">
              Tangible written output
            </Badge>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              What your final plan includes
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-2xl mx-auto">
              The Reset turns your situation and calculator context into a structured written plan you can come back to during the week.
            </p>
          </div>
          <Card className="border-primary/15 bg-card shadow-lg overflow-hidden" data-testid="card-final-plan-preview">
            <CardContent className="p-0">
              <div className="bg-primary text-primary-foreground px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary-foreground/60">Final output</p>
                  <h3 className="font-serif text-xl font-bold">Your Redundancy Next-Step Plan</h3>
                </div>
                <Badge className="bg-gold text-gold-foreground border-0 hover:bg-gold">By Day 7</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                {[
                  "Situation summary",
                  "Main pressure point",
                  "What matters most this week",
                  "What not to rush",
                  "Your 7-day action plan",
                  "Your 30-day direction",
                  "Useful scripts or templates where relevant",
                  "Signposting where professional support may be needed",
                ].map((item, i) => (
                  <div key={item} className={`flex items-start gap-3 p-4 ${i % 2 === 0 ? "sm:border-r" : ""} ${i < 6 ? "border-b" : ""}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/85">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 7-Day journey */}
      <section className="py-14 px-6 bg-muted/20" data-testid="section-journey">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-3">
            How it works
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-10 max-w-lg mx-auto">
            After payment, the experience stays structured: intake, written response, one follow-up check-in, then your final plan.
          </p>
          <div className="relative">
            <div className="hidden sm:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-border" />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {[
                {
                  day: "1",
                  icon: Shield,
                  title: "Complete private intake",
                  desc: "Answer guided questions so the first written response can be prepared from your actual situation.",
                },
                {
                  day: "2",
                  icon: MessageSquare,
                  title: "First written response",
                  desc: "Receive your first private written response within 1 working day after intake submission.",
                },
                {
                  day: "3",
                  icon: Clock,
                  title: "Follow-up check-in",
                  desc: "Complete one follow-up check-in during the 7-day reset so the final plan can focus on what changed.",
                },
                {
                  day: "4",
                  icon: CheckCircle2,
                  title: "Final plan by Day 7",
                  desc: "Receive your Redundancy Next-Step Plan with practical priorities and calm signposting where relevant.",
                },
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center text-center" data-testid={`journey-step-${item.day}`}>
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs mb-4 relative z-10 shadow-md">
                    {item.day}
                  </div>
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8 italic">
            One-off payment. No subscription. Practical written support only.
          </p>
        </div>
      </section>

      {/* What is included */}
      <section className="py-14 px-6 bg-background" data-testid="section-included">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-8">
            What is included
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card data-testid="card-included">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Written support package</span>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Guided intake (7 questions on your situation)",
                    "Initial written response to your specific circumstances",
                    "A practical 7-day written action plan",
                    "Structured priorities based on your intake",
                    "Day 7 written follow-up",
                    "Written responses delivered via your Private Reset Portal",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5" data-testid="card-not-included">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <X className="w-4 h-4 text-destructive" />
                  <span className="font-semibold text-sm">What this is not</span>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Financial advice",
                    "Legal or employment law advice",
                    "Debt advice",
                    "Therapy, counselling or mental health support",
                    "Crisis support (if you are in crisis, please contact Samaritans or your GP)",
                    "Live chat or unlimited messaging",
                    "Phone or video calls",
                    "A guarantee of income or employment outcomes",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <X className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing & CTA with disclaimer */}
      <section className="py-14 px-6 bg-muted/30" id="pricing" data-testid="section-pricing-reset">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-6">One-off. Written. Private.</h2>
          <Card className="ring-2 ring-primary shadow-lg mb-6" data-testid="card-pricing">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold">£{RESET_PRICE_GBP_DISPLAY}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">One-off payment. No subscription.</p>
              <ul className="space-y-2 mb-6 text-sm text-left max-w-xs mx-auto">
                {[
                  "Guided intake form (7 questions)",
                  "First written response within 1 working day",
                  "Private Reset Portal",
                  "One follow-up check-in",
                  "Final Redundancy Next-Step Plan by Day 7",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-3 mb-5 text-left" data-testid="disclaimer-before-cta">
                <div className="flex gap-2 items-start">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {BOUNDARY_DISCLAIMER}
                  </p>
                </div>
              </div>
              <Button
                className="w-full font-semibold"
                size="lg"
                onClick={() => checkout.mutate()}
                disabled={checkout.isPending}
                data-testid="button-pricing-cta"
              >
                {checkout.isPending ? "Loading…" : `Start my 7-Day Redundancy Reset — £${RESET_PRICE_GBP_DISPLAY}`}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {checkout.isError && (
                <p className="text-xs text-destructive mt-2" data-testid="text-pricing-checkout-error">
                  {(checkout.error as Error)?.message ?? "Something went wrong. Please try again."}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                You will complete your private intake after payment.
              </p>
            </CardContent>
          </Card>

          <div className="rounded-md border p-4 text-left" data-testid="card-refund">
            <p className="text-sm font-medium mb-1.5">Refund policy</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you have paid and not yet submitted your intake form, contact us within 7 days for a full refund. Once your intake has been submitted and the first written response sent, the service has been delivered and refunds are not available.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-6" data-testid="section-faq-reset">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-8">Common questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "What is the 7-Day Redundancy Reset?",
                a: "It is a practical written support service for people in or approaching redundancy. After a guided intake, you receive a written response to your situation and a practical 7-day plan delivered via your Private Reset Portal. This is written, asynchronous support — not live chat, not calls.",
              },
              {
                q: "Is this financial or legal advice?",
                a: "No. The 7-Day Redundancy Reset is practical written planning support only. It is not financial advice, legal advice, debt advice, employment law advice, therapy, counselling, crisis support or medical advice. If you need regulated advice, please contact a qualified financial adviser, solicitor or the Citizens Advice Bureau.",
              },
              {
                q: "What happens after I pay?",
                a: "You will be redirected to a short intake form (7 questions about your situation). Once submitted, you will receive a first written response within 1 working day. A structured 7-day plan follows within 3–4 days, with a brief written follow-up on day 7.",
              },
              {
                q: "What is the 7-day plan?",
                a: "The plan is a structured written document delivered within 3–4 working days of your intake. It covers practical priorities for the next 7 days — such as financial clarity steps, job search starting points, and household items to address — based on your specific situation. It does not provide regulated advice.",
              },
              {
                q: "Can I get a refund?",
                a: "If you have paid but not yet submitted your intake form, you can request a full refund within 7 days. Once your intake has been submitted and the first written response sent, the service has been delivered and refunds are not available.",
              },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} data-testid={`faq-item-${i}`}>
                <AccordionTrigger className="text-sm text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 px-6 bg-primary" data-testid="section-bottom-cta-reset">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground mb-3">
            Ready to get a clearer next step?
          </h2>
          <p className="text-primary-foreground/70 text-sm mb-6 max-w-lg mx-auto">
            Practical written support and planning. No calls. No judgement. No subscription.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
              onClick={() => checkout.mutate()}
              disabled={checkout.isPending}
              data-testid="button-bottom-cta"
            >
              {checkout.isPending ? "Loading…" : `Start my 7-Day Redundancy Reset — £${RESET_PRICE_GBP_DISPLAY}`}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link href="/wizard">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                data-testid="button-try-calculator-first"
              >
                Try the runway calculator first
              </Button>
            </Link>
          </div>
          <p className="text-xs text-primary-foreground/40 mt-4">{BOUNDARY_DISCLAIMER}</p>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
}
