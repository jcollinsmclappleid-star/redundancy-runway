/**
 * Which brief sections may use AI, and how.
 *
 * off    — 100% templates + engine; no API call.
 * lite   — API may personalise executive headline + up to 3 theme observations only.
 * legacy — full narrative JSON (rollback only).
 */
export type BriefAiMode = "off" | "lite" | "legacy";

export function getBriefAiMode(): BriefAiMode {
  const raw = process.env.BRIEF_AI_MODE?.trim().toLowerCase();
  if (raw === "off" || raw === "legacy") return raw;
  return "lite";
}

export const BRIEF_AI_POLICY = {
  /** Always deterministic — numbers, charts, tables */
  engineSections: [
    "package_dashboard",
    "completeness",
    "offer_comparison",
    "metrics",
    "path_chart",
    "scenarios",
    "pressure_map",
    "sensitivity_bars",
    "position_appendix",
  ],
  /** Always human-written templates — situation-filtered */
  templateSections: [
    "package_guides",
    "position_playbooks",
    "consultation_questions",
    "missing_money_guides",
    "professional_questions",
    "methodology",
    "glossary",
    "disclaimers",
    "scenario_interpretation",
    "assumption_guidance",
  ],
  /** Optional AI in lite mode only */
  aiOptionalSections: ["executive_headline", "executive_observations"],
} as const;
