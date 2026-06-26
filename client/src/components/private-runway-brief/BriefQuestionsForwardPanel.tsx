import type { BriefDocument } from "@/lib/private-runway-brief/briefDocumentTypes";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { Card, CardContent } from "@/components/ui/card";
import {
  DOCUMENTS_TO_GATHER,
  PRACTICAL_ORGANISATION_CHECKLIST,
  QUESTIONS_SECTION_INTRO,
} from "@shared/briefCopy";

interface BriefQuestionsForwardPanelProps {
  document: BriefDocument;
}

export function BriefQuestionsForwardPanel({ document }: BriefQuestionsForwardPanelProps) {
  const groups = [
    { title: "HR & package clarification", questions: document.professionalQuestions.hrPackage ?? [], always: true },
    { title: "Financial adviser", questions: document.professionalQuestions.financialAdviser },
    { title: "Mortgage broker", questions: document.professionalQuestions.mortgageBroker },
    { title: "Employer, consultation & career", questions: document.professionalQuestions.employerOrCareer },
    { title: "Benefits & official signposting", questions: document.professionalQuestions.benefitsSignposting },
  ] as const;

  return (
    <div className="space-y-6" data-testid="brief-questions-forward">
      <p className="text-sm text-muted-foreground leading-relaxed">{QUESTIONS_SECTION_INTRO}</p>

      <DashboardPanel title="Documents to gather" subtitle="Build a verification pack before relying on the model.">
        <ul className="grid sm:grid-cols-2 gap-3">
          {DOCUMENTS_TO_GATHER.map((doc) => (
            <li key={doc.label} className="rounded-lg border border-gold/15 bg-white p-3 text-xs">
              <p className="font-semibold text-primary mb-1">{doc.label}</p>
              <p className="text-muted-foreground leading-relaxed">{doc.whyItMatters}</p>
            </li>
          ))}
        </ul>
      </DashboardPanel>

      <DashboardPanel title="Practical organisation checklist" subtitle="Neutral preparation steps — not advice on what to do.">
        <ul className="space-y-2">
          {PRACTICAL_ORGANISATION_CHECKLIST.map((item) => (
            <li key={item} className="text-sm text-foreground/85 flex gap-2 leading-relaxed">
              <span className="text-gold shrink-0">□</span>
              {item}
            </li>
          ))}
        </ul>
      </DashboardPanel>

      <DashboardPanel title="Questions for conversations" testId="brief-professional-questions-structured">
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map(({ title, questions }) =>
            questions.length > 0 ? (
              <Card key={title} className="border border-gold/15 bg-white rounded-xl">
                <CardContent className="pt-4 pb-4">
                  <h4 className="text-sm font-semibold text-primary mb-3">{title}</h4>
                  <ul className="space-y-2">
                    {questions.map((q) => (
                      <li key={q} className="text-xs text-foreground/80 leading-relaxed pl-3 border-l-2 border-gold/30">
                        {q}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null,
          )}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Official signposting" subtitle="Independent UK sources — not affiliated with this tool.">
        <ul className="space-y-2">
          {document.signposting.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline hover:text-primary/80"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">
          For employment disputes or complex cases, ACAS early conciliation or qualified legal advice may be appropriate —
          this tool does not provide that advice.
        </p>
      </DashboardPanel>
    </div>
  );
}
