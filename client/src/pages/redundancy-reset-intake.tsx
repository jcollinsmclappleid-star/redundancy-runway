import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Clock,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Placeholder WhatsApp contact number — owner should update before going live
const WHATSAPP_CONTACT_NUMBER = "+447700900000";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_CONTACT_NUMBER.replace(/[^0-9]/g, "")}`;

const STEPS = [
  {
    id: "contact",
    title: "Your name and contact preference",
    description: "How would you like to receive your written response?",
  },
  {
    id: "situation",
    title: "Your situation",
    description: "What has happened or is happening with your employment?",
  },
  {
    id: "urgency",
    title: "Urgency and timeline",
    description: "How urgent does your situation feel right now?",
  },
  {
    id: "concern",
    title: "Biggest concern",
    description: "What is the thing you are most worried about or unsure how to handle?",
  },
  {
    id: "context",
    title: "Financial context",
    description: "Give a brief sense of your financial position — this does not need to be precise.",
  },
  {
    id: "partner",
    title: "Household situation",
    description: "Are you the sole income earner, or does a partner or household member also have income?",
  },
  {
    id: "timeline_pressure",
    title: "Key decisions or deadlines",
    description: "Are there any specific decisions, deadlines or pressures coming up in the next few weeks?",
  },
  {
    id: "anything_else",
    title: "Anything else",
    description: "Is there anything else you want to share that would help us understand your situation?",
  },
];

interface IntakeState {
  name: string;
  contactMethod: "whatsapp" | "webchat";
  whatsappNumber: string;
  answers: Record<string, string>;
}

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    stripeSessionId: params.get("session_id") ?? "",
    sessionToken: params.get("token") ?? "",
  };
}

export default function RedundancyResetIntakePage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedContactMethod, setSubmittedContactMethod] = useState<"whatsapp" | "webchat">("webchat");
  const [data, setData] = useState<IntakeState>({
    name: "",
    contactMethod: "webchat",
    whatsappNumber: "",
    answers: {},
  });

  const submitMutation = useMutation({
    mutationFn: async (state: IntakeState) => {
      const { stripeSessionId } = getUrlParams();
      if (!stripeSessionId) {
        throw new Error("No checkout session found. Please complete payment via the product page.");
      }

      const intakeAnswers: Record<string, string> = {
        ...state.answers,
      };
      if (state.contactMethod === "whatsapp" && state.whatsappNumber) {
        intakeAnswers.whatsappNumber = state.whatsappNumber;
      }

      // paid and status are NOT sent from the client — server determines them server-side
      const response = await apiRequest("POST", "/api/resets", {
        stripeSessionId,
        name: state.name,
        contactMethod: state.contactMethod,
        intakeAnswers,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message ?? "Submission failed");
      }
      return response.json();
    },
    onSuccess: (_data, variables) => {
      setSubmittedContactMethod(variables.contactMethod);
      setSubmitted(true);
    },
  });

  const { stripeSessionId } = getUrlParams();
  const currentStep = STEPS[step];
  const isContactStep = step === 0;
  const isLastStep = step === STEPS.length - 1;

  const canProceed = () => {
    if (isContactStep) {
      if (!data.name.trim()) return false;
      if (data.contactMethod === "whatsapp" && !data.whatsappNumber.trim()) return false;
      return true;
    }
    return (data.answers[currentStep.id] ?? "").trim().length > 0;
  };

  const handleNext = () => {
    if (isLastStep) {
      submitMutation.mutate(data);
    } else {
      setStep((s) => s + 1);
    }
  };

  const updateAnswer = (value: string) => {
    setData((prev) => ({
      ...prev,
      answers: { ...prev.answers, [currentStep.id]: value },
    }));
  };

  // No valid checkout session in URL — show an access message
  if (!stripeSessionId) {
    return (
      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />
        <header className="border-b px-6 py-3">
          <div className="max-w-2xl mx-auto">
            <Logo showTagline />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-md w-full text-center" data-testid="section-no-session">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
            <h1 className="font-serif text-xl font-bold mb-3">No checkout session found</h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              This page is only accessible after completing payment for the 7-Day Redundancy Reset.
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
      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />
        <header className="border-b px-6 py-3">
          <div className="max-w-2xl mx-auto">
            <Logo showTagline />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full text-center" data-testid="section-success">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-bold mb-3">Your intake has been received.</h1>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Thank you for sharing your situation. We have received your intake and will be in touch shortly.
            </p>

            {/* WhatsApp number shown for WhatsApp users */}
            {submittedContactMethod === "whatsapp" && (
              <Card className="mb-5 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10" data-testid="card-whatsapp-contact">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-green-700 dark:text-green-400" />
                    <p className="text-sm font-medium">Your written response will arrive via WhatsApp</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Messages will come from the number below. Save it so you don't miss your response.
                    This is not live chat — responses arrive within working days, not minutes.
                  </p>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                    data-testid="link-whatsapp-contact"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {WHATSAPP_CONTACT_NUMBER}
                  </a>
                </CardContent>
              </Card>
            )}

            <Card className="mb-5" data-testid="card-what-happens-next">
              <CardContent className="pt-5 pb-5 text-left">
                <p className="text-sm font-medium mb-4">What happens next</p>
                <div className="space-y-4">
                  {[
                    {
                      icon: MessageSquare,
                      day: "Day 1",
                      label: "First written response",
                      desc: "You will receive a written acknowledgement and initial practical response to your situation within 1 working day.",
                    },
                    {
                      icon: Clock,
                      day: "Day 3–4",
                      label: "7-day plan delivered",
                      desc: "A structured practical written plan arrives, covering what to prioritise, what to look into, and what to set aside for now.",
                    },
                    {
                      icon: CheckCircle2,
                      day: "Day 7",
                      label: "Written follow-up",
                      desc: "A brief written follow-up to see if there are practical questions you need addressed before the programme ends.",
                    },
                  ].map((item) => (
                    <div key={item.day} className="flex gap-3" data-testid={`next-step-${item.day}`}>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge variant="outline" className="text-xs">{item.day}</Badge>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-3 mb-6 text-left" data-testid="reminder-boundaries">
              <div className="flex gap-2 items-start">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Reminder: The 7-Day Redundancy Reset provides practical written support and planning only.
                  It is not financial, legal, debt, employment, medical or mental health advice.
                  First written response within 1 working day. This is not live chat.
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={() => navigate("/wizard")} data-testid="button-build-runway-report">
              Build your runway report
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
        <title>7-Day Redundancy Reset — Intake | RedundancyCalculatorUK</title>
        <meta name="description" content="Complete your 7-Day Redundancy Reset intake — share your situation privately and receive a written response within 1 working day." />
        <meta name="robots" content="noindex" />
      </Helmet>
    <div className="min-h-screen flex flex-col">
      <DisclaimerBanner />

      <header className="border-b px-6 py-3" data-testid="header-intake">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 0 && (
              <Button variant="ghost" size="icon" onClick={() => setStep((s) => s - 1)} data-testid="button-back-step">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs" data-testid="badge-step-progress">
              Step {step + 1} of {STEPS.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="h-1 bg-muted">
        <div
          className="h-1 bg-primary transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          data-testid="progress-bar"
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs mb-3">7-Day Redundancy Reset</Badge>
          </div>
          <h2 className="font-serif text-xl font-bold mb-1.5" data-testid="text-step-title">
            {currentStep.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-6" data-testid="text-step-description">
            {currentStep.description}
          </p>

          {isContactStep ? (
            <div className="space-y-5" data-testid="form-contact">
              <div>
                <Label htmlFor="name" className="text-sm mb-1.5 block">
                  Your first name (or the name you would like us to use)
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Sarah"
                  className="max-w-sm"
                  data-testid="input-name"
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Preferred contact method</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(["webchat", "whatsapp"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setData((prev) => ({ ...prev, contactMethod: method }))}
                      className={`flex items-start gap-3 p-3.5 rounded-lg border text-left transition-colors ${
                        data.contactMethod === method
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                      data-testid={`button-contact-${method}`}
                    >
                      {method === "webchat" ? (
                        <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {method === "webchat" ? "Private web message" : "WhatsApp"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {method === "webchat"
                            ? "Receive your written plan via a secure message"
                            : "Receive your written plan as WhatsApp messages"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {data.contactMethod === "whatsapp" && (
                <div data-testid="form-whatsapp-number">
                  <Label htmlFor="whatsapp" className="text-sm mb-1.5 block">
                    Your WhatsApp number (UK mobile)
                  </Label>
                  <Input
                    id="whatsapp"
                    value={data.whatsappNumber}
                    onChange={(e) => setData((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                    placeholder="e.g. 07700 900000"
                    className="max-w-sm"
                    data-testid="input-whatsapp"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Used only to deliver your written response and plan. Not for live chat or calls.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div data-testid={`form-answer-${currentStep.id}`}>
              <Textarea
                value={data.answers[currentStep.id] ?? ""}
                onChange={(e) => updateAnswer(e.target.value)}
                placeholder="Share as much or as little as you feel comfortable with..."
                rows={5}
                className="resize-none"
                data-testid={`input-answer-${currentStep.id}`}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Your response is private. We do not share it with third parties.
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {step + 1} of {STEPS.length}
            </p>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || submitMutation.isPending}
              data-testid="button-next-step"
            >
              {submitMutation.isPending
                ? "Submitting…"
                : isLastStep
                ? "Submit intake"
                : "Continue"}
              {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          {submitMutation.isError && (
            <p className="text-xs text-destructive mt-3" data-testid="text-submit-error">
              {(submitMutation.error as Error)?.message ?? "Something went wrong. Please try again."}
            </p>
          )}
        </div>
      </main>
    </div>
    </>
  );
}
