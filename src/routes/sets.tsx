import { createFileRoute } from "@tanstack/react-router";
import SetComparison from "../tools/SetComparison/SetComparison";
import { SetComparisonConfig } from "../tools/SetComparison/SetComparisonConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/sets")({
  component: SetComparison,
  head: () => createPageHead(SetComparisonConfig.title),
});
