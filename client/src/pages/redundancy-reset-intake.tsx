import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, CheckCircle2, Clock, FileText, Shield, MessageSquare, AlertTriangle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const BOUNDARY_NOTE = "This is practical written support only. It is not financial, legal, debt, employment, medical or mental health advice.";
const WHATSAPP_CONTACT_NUMBER = "+447700900000";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_CONTACT_NUMBER.replace(/[^0-9]/g, "")}`;

type StepKind = "contact" | "chips" | "textarea";

interface IntakeStep {
  id: string;
  kind: StepKind;
  title: string;
  helper: string;
  options?: string[];
  placeholder?: string;
}

const INTAKE_STEPS: IntakeStep[] = [
  {
    id: "contact",
    kind: "contact",
    title: "How should your private written response reach you?",
    helper: "Your payment is complete. Your Reset begins once your intake is submitted.",
  },
  {
    id: "urgent_area",
    kind: "chips",
    title: "What feels most urgent right now?",
    helper: "Choose the area taking up the most mental space. You can add detail later.",
    options: ["Money and runway", "Consultation or employer process", "Mortgage or household bills", "Job search direction", "Confidence and overwhelm", "Something else"],
  },
  {
    id: "calculator_reaction",
    kind: "textarea",
    title: "What did your calculator result make you think or feel?",
    helper: "This helps frame the first written response. You do not need to use perfect wording.",
    placeholder: "Short answers are fine. For example: I can see the numbers, but I do not know what to do first.",
  },
  {
    id: "employment_position",
    kind: "chips",
    title: "Which best describes your current position?",
    helper: "Pick the closest fit so the written response starts from the right context.",
    options: ["At risk of redundancy", "Consultation has started", "Redundancy confirmed", "Considering voluntary redundancy", "Contract ending", "Job uncertainty"],
  },
  {
    id: "main_pressure",
    kind: "textarea",
    title: "What is the main pressure point you want understood?",
    helper: "This can be practical, emotional, household-related or about timing.",
    placeholder: "Tell us what would be most useful to understand before preparing your first response.",
  },
  {
    id: "household_context",
    kind: "chips",
    title: "What household context matters most?",
    helper: "This helps the plan stay grounded without asking for every detail.",
    options: ["Sole income household", "Partner income available", "Children or dependants", "Mortgage pressure", "Rent pressure", "No major household dependency"],
  },
  {
    id: "next_7_days_outcome",
    kind: "textarea",
    title: "What outcome would make the next 7 days feel more manageable?",
    helper: "This helps the final plan focus on practical next steps rather than general advice.",
    placeholder: "For example: I want to know what to sort first, what not to rush, and what questions to ask.",
  },
];

interface IntakeState {
  name: string;
  email: string;
  contactMethod: "whatsapp" | "webchat";
  whatsappNumber: string;
  answers: Record<string, string>;
}

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    stripeSessionId: params.get("session_id") ?? "",
    sessionToken: params.get("token") ?? "",
    portalToken: params.get("portal_token") ?? "",
  };
}

function storageKey(stripeSessionId: string) {
  return `reset-intake-${stripeSessionId}`;
}

function TimelineCard({ submitted = false }: { submitted?: boolean }) {
  const rows = [
    { label: "Intake", status: submitted ? "Submitted" : "Not started", icon: Shield },
    { label: "Reply 1", status: "Due within 1 working day after intake", icon: MessageSquare },
    { label: "Follow-up", status: "During the 7-day reset", icon: Clock },
    { label: "Final plan", status: "By Day 7", icon: FileText },
  ];

  return (
    <Card className="border-primary/15 bg-card" data-testid="card-reset-timeline">
      <CardContent className="pt-5 pb-5 space-y-4">
        {rows.map((row, i) => (
          <div key={row.label} className="flex gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? "bg-gold/15 text-gold" : "bg-primary/10 text-primary"}`}>
              <row.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{row.label}</p>
              <p className="text-xs text-muted-foreground">{row.status}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function RedundancyResetIntakePage() {
  const [, navigate] = useLocation();
  const { stripeSessionId, portalToken } = getUrlParams();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [portalUrl, setPortalUrl] = useState(portalToken ? `/redundancy-reset/portal/${portalToken}` : "");
  const [submittedContactMethod, setSubmittedContactMethod] = useState<"whatsapp" | "webchat">("webchat");
  const [data, setData] = useState<IntakeState>({
    name: "",
    email: "",
    contactMethod: "webchat",
    whatsappNumber: "",
    answers: {},
  });

  useEffect(() => {
    if (!stripeSessionId) return;
    const saved = window.localStorage.getItem(storageKey(stripeSessionId));
    if (!saved) return;
    try {
      setData(JSON.parse(saved) as IntakeState);
      setStarted(true);
    } catch {
      window.localStorage.removeItem(storageKey(stripeSessionId));
    }
  }, [stripeSessionId]);

  useEffect(() => {
    if (!stripeSessionId || submitted) return;
    window.localStorage.setItem(storageKey(stripeSessionId), JSON.stringify(data));
  }, [data, stripeSessionId, submitted]);

  const submitMutation = useMutation({
    mutationFn: async (state: IntakeState) => {
      if (!stripeSessionId) {
        throw new Error("No checkout session found. Please complete payment via the product page.");
      }

      const intakeAnswers: Record<string, string> = {
        ...state.answers,
      };
      if (state.contactMethod === "whatsapp" && state.whatsappNumber) {
        intakeAnswers.whatsappNumber = state.whatsappNumber;
      }

      const response = await apiRequest("POST", "/api/resets", {
        stripeSessionId,
        name: state.name,
        email: state.email,
        contactMethod: state.contactMethod,
        intakeAnswers,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message ?? "Submission failed");
      }
      return response.json();
    },
    onSuccess: (response, variables) => {
      setSubmittedContactMethod(variables.contactMethod);
      setPortalUrl(response.portalUrl ?? portalUrl);
      setSubmitted(true);
      window.localStorage.removeItem(storageKey(stripeSessionId));
    },
  });

  const currentStep = INTAKE_STEPS[step];
  const isContactStep = currentStep.kind === "contact";
  const isReviewStep = step === INTAKE_STEPS.length;
  const progress = useMemo(() => ((Math.min(step + 1, INTAKE_STEPS.length) / INTAKE_STEPS.length) * 100), [step]);

  const canProceed = () => {
    if (isReviewStep) return true;
    if (isContactStep) {
      if (!data.name.trim()) return false;
      if (!data.email.trim()) return false;
      if (data.contactMethod === "whatsapp" && !data.whatsappNumber.trim()) return false;
      return true;
    }
    return (data.answers[currentStep.id] ?? "").trim().length > 0;
  };

  const updateAnswer = (id: string, value: string) => {
    setData((prev) => ({
      ...prev,
      answers: { ...prev.answers, [id]: value },
    }));
  };

  const handleNext = () => {
    if (isReviewStep) {
      submitMutation.mutate(data);
      return;
    }
    setStep((s) => s + 1);
  };

  if (!stripeSessionId) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <DisclaimerBanner />
        <header className="border-b px-6 py-3">
          <div className="max-w-2xl mx-auto">
            <Logo showTagline />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-md w-full text-center" data-testid="section-no-session">
            <AlertTriangle className="w-10 h-10 text-gold mx-auto mb-4" />
            <h1 className="font-serif text-xl font-bold mb-3">No checkout session found</h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              This intake opens after payment so your private written response can be attached to the right Reset.
            </p>
            <Button onClick={() => navigate("/redundancy-reset")} data-testid="button-back-product">
              Go to product page
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <DisclaimerBanner />
        <header className="border-b px-6 py-3">
          <div className="max-w-3xl mx-auto">
            <Logo showTagline />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-2xl w-full text-center" data-testid="section-success">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-bold mb-3">Your intake has been received.</h1>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Your first written response will be prepared within 1 working day.
            </p>

            {submittedContactMethod === "whatsapp" && (
              <Card className="mb-5 border-primary/20 bg-primary/5 text-left" data-testid="card-whatsapp-contact">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium">Your written response can arrive via WhatsApp</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Save this number so you recognise the response. This is not live chat, so you do not need to wait on this page.
                  </p>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    {WHATSAPP_CONTACT_NUMBER}
                  </a>
                </CardContent>
              </Card>
            )}

            <TimelineCard submitted />
            <div className="rounded-md border border-primary/15 bg-muted/30 p-3 my-5 text-left" data-testid="reminder-boundaries">
              <p className="text-xs text-muted-foreground leading-relaxed">{BOUNDARY_NOTE}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button className="btn-gold" onClick={() => navigate(portalUrl || "/redundancy-reset")}>
                Open Private Reset Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => navigate("/wizard")}>
                Return to calculator
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <DisclaimerBanner />
        <header className="border-b px-6 py-3">
          <div className="max-w-3xl mx-auto">
            <Logo showTagline />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-2xl w-full">
            <Badge variant="outline" className="mb-4 text-xs">Your 7-Day Reset</Badge>
            <h1 className="font-serif text-3xl font-bold mb-3">Your 7-Day Reset has started.</h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Complete your private intake so your first written response can be prepared.
            </p>
            <TimelineCard />
            <div className="rounded-md border border-primary/15 bg-muted/30 p-3 my-5">
              <p className="text-xs text-muted-foreground leading-relaxed">{BOUNDARY_NOTE}</p>
            </div>
            <Button className="btn-gold w-full sm:w-auto" size="lg" onClick={() => setStarted(true)} data-testid="button-start-intake">
              Complete private intake
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>7-Day Redundancy Reset - Intake | RedundancyCalculatorUK</title>
        <meta name="description" content="Complete your 7-Day Redundancy Reset intake privately and receive a written response within 1 working day." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://redundancycalculatoruk.co.uk/redundancy-reset/intake" />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <DisclaimerBanner />
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b px-4 py-3" data-testid="header-intake">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {step > 0 && (
                <Button variant="ghost" size="icon" onClick={() => setStep((s) => s - 1)} data-testid="button-back-step">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <Logo />
            </div>
            <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
              {isReviewStep ? "Review" : `Step ${step + 1} of ${INTAKE_STEPS.length}`}
            </Badge>
          </div>
          <Progress value={progress} className="h-1.5 mt-3 rounded-none" data-testid="progress-bar" />
        </header>

        <main className="flex-1 px-4 py-8 pb-28 sm:pb-8">
          <div className="max-w-2xl mx-auto">
            <Badge variant="outline" className="text-xs mb-3 bg-gold/10 text-gold border-gold/30">Written Reset Space</Badge>

            {isReviewStep ? (
              <Card className="border-t-4 border-t-primary" data-testid="section-review">
                <CardContent className="pt-6 pb-6">
                  <h1 className="font-serif text-2xl font-bold mb-2">Review your answers before sending.</h1>
                  <p className="text-sm text-muted-foreground mb-5">
                    Your first written response will be prepared from this intake.
                  </p>
                  <div className="space-y-4">
                    <div className="rounded-md border p-3">
                      <p className="text-xs text-muted-foreground mb-1">Name and contact</p>
                      <p className="text-sm font-medium">{data.name} · {data.email} · {data.contactMethod === "webchat" ? "Private Reset Portal" : "WhatsApp"}</p>
                    </div>
                    {INTAKE_STEPS.filter((item) => item.kind !== "contact").map((item) => (
                      <div key={item.id} className="rounded-md border p-3">
                        <p className="text-xs text-muted-foreground mb-1">{item.title}</p>
                        <p className="text-sm whitespace-pre-wrap">{data.answers[item.id]}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-t-4 border-t-primary" data-testid={`section-step-${currentStep.id}`}>
                <CardContent className="pt-6 pb-6">
                  <h1 className="font-serif text-2xl font-bold mb-2" data-testid="text-step-title">{currentStep.title}</h1>
                  <p className="text-sm text-muted-foreground mb-6" data-testid="text-step-helper">{currentStep.helper}</p>

                  {currentStep.kind === "contact" && (
                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="name" className="text-sm mb-1.5 block">Your first name or preferred name</Label>
                        <Input id="name" value={data.name} onChange={(event) => setData((prev) => ({ ...prev, name: event.target.value }))} placeholder="e.g. Sarah" data-testid="input-name" />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm mb-1.5 block">Email for your private access link</Label>
                        <Input id="email" type="email" value={data.email} onChange={(event) => setData((prev) => ({ ...prev, email: event.target.value }))} placeholder="you@example.com" data-testid="input-email" />
                        <p className="text-xs text-muted-foreground mt-1.5">Used to recover your Private Reset Portal if you change device or lose the link.</p>
                      </div>
                      <div>
                        <Label className="text-sm mb-2 block">Preferred written response route</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(["webchat", "whatsapp"] as const).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setData((prev) => ({ ...prev, contactMethod: method }))}
                              className={`min-h-24 flex items-start gap-3 p-4 rounded-lg border text-left transition-colors ${
                                data.contactMethod === method ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                              }`}
                              data-testid={`button-contact-${method}`}
                            >
                              {method === "webchat" ? <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" /> : <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />}
                              <span>
                                <span className="block text-sm font-medium">{method === "webchat" ? "Private Reset Portal" : "WhatsApp"}</span>
                                <span className="block text-xs text-muted-foreground mt-1">{method === "webchat" ? "Your written response appears in your private portal." : "Receive written messages. No calls or live chat."}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      {data.contactMethod === "whatsapp" && (
                        <div>
                          <Label htmlFor="whatsapp" className="text-sm mb-1.5 block">Your WhatsApp number</Label>
                          <Input id="whatsapp" value={data.whatsappNumber} onChange={(event) => setData((prev) => ({ ...prev, whatsappNumber: event.target.value }))} placeholder="e.g. 07700 900000" data-testid="input-whatsapp" />
                          <p className="text-xs text-muted-foreground mt-1.5">Used only to deliver your written response and plan.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep.kind === "chips" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid={`chips-${currentStep.id}`}>
                      {currentStep.options?.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateAnswer(currentStep.id, option)}
                          className={`min-h-14 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                            data.answers[currentStep.id] === option ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:border-primary/40"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentStep.kind === "textarea" && (
                    <div>
                      <Textarea
                        value={data.answers[currentStep.id] ?? ""}
                        onChange={(event) => updateAnswer(currentStep.id, event.target.value)}
                        placeholder={currentStep.placeholder}
                        rows={6}
                        className="resize-none"
                        data-testid={`input-answer-${currentStep.id}`}
                      />
                      <p className="text-xs text-muted-foreground mt-2">You can write in plain English. Short answers are fine.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {submitMutation.isError && (
              <p className="text-xs text-destructive mt-3" data-testid="text-submit-error">
                {(submitMutation.error as Error)?.message ?? "Something went wrong. Please try again."}
              </p>
            )}
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-3 sm:static sm:border-t-0 sm:bg-transparent sm:p-0">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{BOUNDARY_NOTE}</p>
            <Button onClick={handleNext} disabled={!canProceed() || submitMutation.isPending} data-testid="button-next-step">
              {submitMutation.isPending ? "Submitting..." : isReviewStep ? "Submit intake" : step === INTAKE_STEPS.length - 1 ? "Review answers" : "Continue"}
              {!isReviewStep && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
