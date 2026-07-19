import { createFileRoute } from "@tanstack/react-router";
import MoonPhaseCalculator from "../tools/MoonPhaseCalculator/MoonPhaseCalculator";
import { MoonPhaseCalculatorConfig } from "../tools/MoonPhaseCalculator/MoonPhaseCalculatorConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/moon")({
  component: MoonPhaseCalculator,
  head: () => createPageHead(MoonPhaseCalculatorConfig.title),
});
