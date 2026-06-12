import { createFileRoute } from "@tanstack/react-router";
import Randomizer from "../tools/Randomizer/Randomizer";
import { RandomizerConfig } from "../tools/Randomizer/RandomizerConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/randomizer")({
  component: Randomizer,
  head: () => createPageHead(RandomizerConfig.title),
});
