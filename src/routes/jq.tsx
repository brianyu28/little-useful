import { createFileRoute } from "@tanstack/react-router";
import ProcessJSON from "../tools/ProcessJson/ProcessJson";
import { ProcessJSONConfig } from "../tools/ProcessJson/ProcessJsonConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/jq")({
  component: ProcessJSON,
  head: () => createPageHead(ProcessJSONConfig.title),
});
