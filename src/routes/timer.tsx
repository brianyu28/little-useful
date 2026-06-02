import { createFileRoute } from "@tanstack/react-router";
import Timer from "../tools/Timer/Timer";
import { TimerConfig } from "../tools/Timer/TimerConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/timer")({
  component: Timer,
  head: () => createPageHead(TimerConfig.title),
});
