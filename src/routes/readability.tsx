import { createFileRoute } from "@tanstack/react-router";
import ReadingLevel from "../tools/ReadingLevel/ReadingLevel";
import { ReadingLevelConfig } from "../tools/ReadingLevel/ReadingLevelConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/readability")({
  component: ReadingLevel,
  head: () => createPageHead(ReadingLevelConfig.title),
});
