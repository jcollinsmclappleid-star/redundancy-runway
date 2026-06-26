import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/Logo";

export interface StepMeta {
  category: string;
  icon: LucideIcon;
  pillBg: string;
  pillText: string;
  borderTop: string;
  dotBg: string;
  dotBorder: string;
  shieldBorder: string;
  progressBar: string;
}

export interface WizardStage {
  label: string;
  steps: number[];
  stageNum: number;
}

interface WizardShellProps {
  step: number;
  totalSteps: number;
  steps: { title: string }[];
  stepMeta: StepMeta[];
  wizardStages: WizardStage[];
  prompt: string;
  reassurance: string;
  onStepClick: (index: number) => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  warnings?: React.ReactNode;
}

export function WizardShell({
  step,
  totalSteps,
  steps,
  stepMeta,
  wizardStages,
  prompt,
  reassurance,
  onStepClick,
  children,
  footer,
  warnings,
}: WizardShellProps) {
  const meta = stepMeta[step];
  const StepIcon = meta.icon;
  const progress = ((step + 1) / totalSteps) * 100;
  const stage = wizardStages.find((s) => s.steps.includes(step));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="wizard-header">
        <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-2xl hidden lg:flex items-start justify-center gap-6">
              {wizardStages.map((st) => {
                const stageComplete = st.steps.every((s) => s < step);
                const stageActive = st.steps.includes(step);
                return (
                  <div key={st.stageNum} className="flex flex-col items-center gap-1 min-w-0">
                    <span className={`text-[9px] font-semibold uppercase tracking-widest whitespace-nowrap transition-colors ${
                      stageActive ? "text-primary" : stageComplete ? "text-primary/70" : "text-muted-foreground"
                    }`}>
                      {st.label}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {st.steps.map((stepIdx) => (
                        <button
                          key={stepIdx}
                          type="button"
                          onClick={() => stepIdx <= step && onStepClick(stepIdx)}
                          disabled={stepIdx > step}
                          data-testid={`stepper-step-${stepIdx}`}
                          title={steps[stepIdx].title}
                          className="p-0.5 disabled:cursor-default"
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 transition-all duration-300 ${
                            stepIdx < step
                              ? `${stepMeta[stepIdx].dotBg} ${stepMeta[stepIdx].dotBorder} text-white`
                              : stepIdx === step
                              ? `${stepMeta[stepIdx].dotBg} ${stepMeta[stepIdx].dotBorder} text-white ring-2 ring-offset-1 ring-offset-background ring-current`
                              : "border-muted-foreground/40 text-muted-foreground bg-background"
                          }`}>
                            {stepIdx < step ? <Check className="w-3 h-3" /> : stepIdx + 1}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <Link href="/recover" className="text-sm font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline shrink-0" data-testid="wizard-link-sign-in">
              Sign in
            </Link>
            <span className="text-xs text-muted-foreground lg:hidden shrink-0" data-testid="text-step-progress-mobile">
              {stage ? `Stage ${stage.stageNum} of 3` : ""} · Step {step + 1}/{totalSteps}
            </span>
          </div>
        </div>
        <Progress value={progress} className={`h-1.5 rounded-none ${meta.progressBar}`} data-testid="progress-bar" />
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 lg:py-8">
        <div className="flex gap-8 items-start">
          <aside className="hidden lg:block w-52 shrink-0 sticky top-20 space-y-1" data-testid="wizard-sidebar">
            {steps.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => i <= step && onStepClick(i)}
                disabled={i > step}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                  i === step
                    ? "bg-primary/15 text-primary font-semibold"
                    : i < step
                    ? "text-foreground/80 hover:bg-muted/60"
                    : "text-muted-foreground/60 cursor-default"
                }`}
                data-testid={`sidebar-step-${i}`}
              >
                <span className="flex items-center gap-2">
                  {i < step ? <Check className="w-3 h-3 text-primary shrink-0" /> : <span className="w-3 text-center shrink-0">{i + 1}</span>}
                  <span className="truncate">{s.title}</span>
                </span>
              </button>
            ))}
          </aside>

          <div className="flex-1 min-w-0 max-w-2xl mx-auto lg:mx-0">
            <div className="mb-5">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.pillBg} ${meta.pillText}`} data-testid="text-step-category">
                <StepIcon className="w-3 h-3" />
                {meta.category}
              </span>
            </div>

            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2" data-testid="text-step-title">
              {prompt}
            </h1>
            <p className="text-sm text-foreground/80 leading-relaxed mb-6 max-w-xl" data-testid="text-step-reassurance">
              {reassurance}
            </p>

            <div className={`rounded-xl border bg-card shadow-sm overflow-hidden border-t-4 ${meta.borderTop}`}>
              <div className={`border-l-4 pl-4 pr-4 py-6 ${meta.shieldBorder}`}>
                {children}
              </div>
            </div>

            {warnings}

            <div className="mt-6">{footer}</div>

            <p className="text-xs text-foreground/70 text-center mt-4">
              Use best estimates. Assumptions can be refined later. Core calculations run in your browser.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
