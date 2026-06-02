import { createFileRoute } from "@tanstack/react-router";
import Timestamp from "../tools/Timestamp/Timestamp";
import { TimestampConfig } from "../tools/Timestamp/TimestampConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/timestamp")({
  component: Timestamp,
  head: () => createPageHead(TimestampConfig.title),
});
