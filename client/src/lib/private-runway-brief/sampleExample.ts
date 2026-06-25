import { buildBriefDashboardData } from "./buildBriefDashboardData";
import { EXAMPLE_RUNWAY_INPUTS } from "./exampleInputs";
import { SAMPLE_PRIVATE_RUNWAY_NARRATIVE } from "./sampleBrief";
import { PRODUCT_COPY } from "@shared/product";

export const SAMPLE_EXAMPLE_LABEL = PRODUCT_COPY.sampleLabel;

export const SAMPLE_EXAMPLE_FRAMING =
  "Under the sample assumptions, the baseline runway appears manageable, but the stress scenarios show how quickly the picture changes if replacement income is delayed or fixed costs remain high.";

export function getSampleBriefDashboard() {
  return buildBriefDashboardData(EXAMPLE_RUNWAY_INPUTS);
}

export { EXAMPLE_RUNWAY_INPUTS, SAMPLE_PRIVATE_RUNWAY_NARRATIVE };
