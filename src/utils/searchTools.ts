import type { FuseResult } from "fuse.js";
import Fuse from "fuse.js";
import { tools } from "../tools/tools";
import type { ToolConfig } from "../types/ToolConfig";

const PRIORITY_SCORE_WEIGHT = 0.001;

const toolSearch = new Fuse(tools, {
  ignoreLocation: true,
  includeScore: true,
  keys: [
    { name: "title", weight: 2 },
    { name: "description", weight: 1 },
    { name: "keywords", weight: 0.5 },
  ],
  threshold: 0.3,
});

export function searchTools(query: string) {
  return toolSearch
    .search(query)
    .sort(
      (left, right) =>
        adjustedScore(left) - adjustedScore(right) ||
        (left.score ?? 1) - (right.score ?? 1),
    )
    .map(({ item }) => item);
}

function adjustedScore({ item, score = 1 }: FuseResult<ToolConfig>) {
  return score + (item.priority ?? 0) * PRIORITY_SCORE_WEIGHT;
}
