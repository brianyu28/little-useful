import { Timer } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const TimerConfig = defineTool({
  title: "Timer",
  description: "Run a countdown timer",
  icon: Timer,
  keywords: ["alarm", "minutes", "pomodoro"],
  path: "/timer",
});
