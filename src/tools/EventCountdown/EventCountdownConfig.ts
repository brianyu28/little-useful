import { CalendarClock } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const EventCountdownConfig = defineTool({
  title: "Event Countdown",
  description: "Track time until upcoming events",
  icon: CalendarClock,
  keywords: ["date", "time", "countdown"],
  path: "/events",
});
