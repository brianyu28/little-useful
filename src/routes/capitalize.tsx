import { createFileRoute } from "@tanstack/react-router";
import TitleCapitalizer from "../tools/TitleCapitalizer/TitleCapitalizer";
import { TitleCapitalizerConfig } from "../tools/TitleCapitalizer/TitleCapitalizerConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/capitalize")({
  component: TitleCapitalizer,
  head: () => createPageHead(TitleCapitalizerConfig.title),
});
