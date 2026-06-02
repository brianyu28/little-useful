import { createFileRoute } from "@tanstack/react-router";
import Scratchpad from "../tools/Scratchpad/Scratchpad";
import { ScratchpadConfig } from "../tools/Scratchpad/ScratchpadConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/scratchpad")({
  component: Scratchpad,
  head: () => createPageHead(ScratchpadConfig.title),
});
