import type { ContextInputs } from "@shared/schema";

const AT_RISK_STATUSES: ContextInputs["employmentStatus"][] = [
  "at_risk",
  "restructuring",
  "ai_automation_concern",
  "contract_ending",
];

const POST_REDUNDANCY_STATUSES: ContextInputs["employmentStatus"][] = [
  "redundant",
  "voluntary_redundancy",
];

export type SituationType = "at_risk" | "post_redundancy" | "other";

export function isAtRiskContext(status: ContextInputs["employmentStatus"]): boolean {
  return AT_RISK_STATUSES.includes(status);
}

export function isPostRedundancyContext(status: ContextInputs["employmentStatus"]): boolean {
  return POST_REDUNDANCY_STATUSES.includes(status);
}

export function getSituationType(status: ContextInputs["employmentStatus"]): SituationType {
  if (isAtRiskContext(status)) return "at_risk";
  if (isPostRedundancyContext(status)) return "post_redundancy";
  return "other";
}

export type PositionModuleId =
  | "maximiser"
  | "missing-money"
  | "payout-scenarios"
  | "consultation-defence"
  | "role-protection"
  | "selection-criteria"
  | "alternative-roles"
  | "leverage-map"
  | "clarification-email";

const POST_REDUNDANCY_ORDER: PositionModuleId[] = [
  "maximiser",
  "missing-money",
  "payout-scenarios",
  "clarification-email",
  "leverage-map",
  "consultation-defence",
  "role-protection",
  "selection-criteria",
  "alternative-roles",
];

const AT_RISK_ORDER: PositionModuleId[] = [
  "maximiser",
  "missing-money",
  "payout-scenarios",
  "consultation-defence",
  "role-protection",
  "selection-criteria",
  "alternative-roles",
  "leverage-map",
  "clarification-email",
];

const DEFAULT_ORDER: PositionModuleId[] = [
  "maximiser",
  "missing-money",
  "payout-scenarios",
  "consultation-defence",
  "role-protection",
  "selection-criteria",
  "alternative-roles",
  "leverage-map",
  "clarification-email",
];

export function getModuleOrder(status: ContextInputs["employmentStatus"]): PositionModuleId[] {
  if (isPostRedundancyContext(status)) return POST_REDUNDANCY_ORDER;
  if (isAtRiskContext(status)) return AT_RISK_ORDER;
  return DEFAULT_ORDER;
}

export function getRecommendedModuleIds(status: ContextInputs["employmentStatus"]): PositionModuleId[] {
  return getModuleOrder(status).slice(0, 3);
}
