import { Moon } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const MoonPhaseCalculatorConfig = defineTool({
  title: "Moon Phase",
  description: "See the moon phase for any date",
  icon: Moon,
  keywords: [
    "moon",
    "lunar",
    "phase",
    "full moon",
    "new moon",
    "calendar",
    "moon phase calculator",
  ],
  path: "/moon",
});
