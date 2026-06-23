import type { TextMetrics } from "./TextMetrics";

export interface ReadabilityTest {
  readonly description: string;
  readonly formula: string;
  readonly getScore: (metrics: TextMetrics) => number | null;
  readonly id: string;
  readonly label: string;
  readonly shortLabel?: string;
}
