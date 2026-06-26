import { BLOCKED_RESULT_PHRASES } from "@shared/complianceCopy";

const ADVICE_PATTERNS = [
  /\byou should\b/i,
  /\bwe recommend\b/i,
  /\byou must\b/i,
  /\bguaranteed\b/i,
  /\bentitled to\b/i,
  /\bbest option\b/i,
];

export interface BriefTextValidationResult {
  ok: boolean;
  violations: string[];
}

export function validateBriefText(text: string): BriefTextValidationResult {
  const violations: string[] = [];
  const lower = text.toLowerCase();

  for (const phrase of BLOCKED_RESULT_PHRASES) {
    if (lower.includes(phrase.toLowerCase())) {
      violations.push(`blocked phrase: "${phrase}"`);
    }
  }

  for (const pattern of ADVICE_PATTERNS) {
    if (pattern.test(text)) {
      violations.push(`advice pattern: ${pattern}`);
    }
  }

  return { ok: violations.length === 0, violations };
}

export function validateBriefNarrativeLite(fields: {
  executiveHeadline?: string;
  executiveObservations?: Array<{ observation: string }>;
}): BriefTextValidationResult {
  const texts: string[] = [];
  if (fields.executiveHeadline) texts.push(fields.executiveHeadline);
  for (const o of fields.executiveObservations ?? []) {
    texts.push(o.observation);
  }

  const violations: string[] = [];
  for (const text of texts) {
    const result = validateBriefText(text);
    violations.push(...result.violations);
  }

  return { ok: violations.length === 0, violations };
}
