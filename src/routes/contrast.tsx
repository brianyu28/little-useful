import { createFileRoute } from "@tanstack/react-router";
import ContrastCheck from "../tools/ContrastCheck/ContrastCheck";
import { ContrastCheckConfig } from "../tools/ContrastCheck/ContrastCheckConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/contrast")({
  component: ContrastCheck,
  head: () => createPageHead(ContrastCheckConfig.title),
});
