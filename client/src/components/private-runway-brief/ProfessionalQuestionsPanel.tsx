import { Card, CardContent } from "@/components/ui/card";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";

interface ProfessionalQuestionsPanelProps {
  narrative: PrivateRunwayBriefNarrative;
}

export function ProfessionalQuestionsPanel({ narrative }: ProfessionalQuestionsPanelProps) {
  const groups = [
    ["Financial adviser", narrative.professionalQuestions.financialAdviser],
    ["Mortgage broker", narrative.professionalQuestions.mortgageBroker],
    ["Employer / career", narrative.professionalQuestions.employerOrCareer],
    ["Benefits signposting", narrative.professionalQuestions.benefitsSignposting],
  ] as const;

  return (
    <DashboardPanel title="Questions to take forward" testId="brief-professional-questions">
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
  );
}
