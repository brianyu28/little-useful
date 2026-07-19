import { Scale } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const BmiCalculatorConfig = defineTool({
  title: "BMI",
  description: "Calculate adult BMI given weight and height",
  icon: Scale,
  keywords: ["body mass index", "weight", "height", "health", "bmi calculator"],
  path: "/bmi",
});
