import { createFileRoute } from "@tanstack/react-router";
import BmiCalculator from "../tools/BmiCalculator/BmiCalculator";
import { BmiCalculatorConfig } from "../tools/BmiCalculator/BmiCalculatorConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/bmi")({
  component: BmiCalculator,
  head: () => createPageHead(BmiCalculatorConfig.title),
});
