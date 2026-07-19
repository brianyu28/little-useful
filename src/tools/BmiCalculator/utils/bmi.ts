export type BmiThresholdSet = "standard" | "asian";

export interface BmiCategory {
  readonly label: string;
  readonly maximum?: number;
  readonly minimum?: number;
  readonly rangeLabel: string;
}

/**
 * Adult BMI category cutoffs.
 */
export const BMI_CATEGORIES: Record<BmiThresholdSet, readonly BmiCategory[]> = {
  standard: [
    { label: "Underweight", maximum: 18.5, rangeLabel: "Below 18.5" },
    {
      label: "Healthy weight",
      minimum: 18.5,
      maximum: 25,
      rangeLabel: "18.5 to less than 25",
    },
    {
      label: "Overweight",
      minimum: 25,
      maximum: 30,
      rangeLabel: "25 to less than 30",
    },
    { label: "Obesity", minimum: 30, rangeLabel: "30 or greater" },
  ],
  asian: [
    { label: "Underweight", maximum: 18.5, rangeLabel: "Below 18.5" },
    {
      label: "Healthy weight",
      minimum: 18.5,
      maximum: 23,
      rangeLabel: "18.5 to less than 23",
    },
    {
      label: "Overweight",
      minimum: 23,
      maximum: 27.5,
      rangeLabel: "23 to less than 27.5",
    },
    { label: "Obesity", minimum: 27.5, rangeLabel: "27.5 or greater" },
  ],
};

export function calculateMetricBmi(weightKg: number, heightCm: number) {
  if (weightKg <= 0 || heightCm <= 0) return undefined;

  const heightM = heightCm / 100;
  return weightKg / heightM ** 2;
}

export function calculateImperialBmi(
  weightLb: number,
  heightFt: number,
  heightIn: number,
) {
  const heightInches = heightFt * 12 + heightIn;
  if (weightLb <= 0 || heightInches <= 0) return undefined;

  return (weightLb * 703) / heightInches ** 2;
}

export function getBmiCategory(bmi: number, thresholdSet: BmiThresholdSet) {
  const categories = BMI_CATEGORIES[thresholdSet];
  return (
    categories.find(
      (category) => category.maximum == null || bmi < category.maximum,
    ) ?? categories.at(-1)!
  );
}
