import { createFileRoute } from "@tanstack/react-router";
import EventCountdown from "../tools/EventCountdown/EventCountdown";
import { EventCountdownConfig } from "../tools/EventCountdown/EventCountdownConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/events")({
  component: EventCountdown,
  head: () => createPageHead(EventCountdownConfig.title),
});
