import type { BriefDocument } from "@/lib/private-runway-brief/briefDocumentTypes";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { Card, CardContent } from "@/components/ui/card";

interface BriefSignpostingPanelProps {
  document: BriefDocument;
}

export function BriefSignpostingPanel({ document }: BriefSignpostingPanelProps) {
  const groups = [
    ["Financial adviser", document.professionalQuestions.financialAdviser],
    ["Mortgage broker", document.professionalQuestions.mortgageBroker],
    ["Employer / career", document.professionalQuestions.employerOrCareer],
    ["Benefits signposting", document.professionalQuestions.benefitsSignposting],
  ] as const;

  return (
    <div className="space-y-6">
      <DashboardPanel title="Questions to take forward" testId="brief-professional-questions-structured">
        <div className="grid gap-4 sm:grid-cols-2">
          {groups.map(([title, questions]) =>
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
      </DashboardPanel>
    </div>
  );
}
