import { Shuffle } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const RandomizerConfig = defineTool({
  title: "Randomizer",
  description: "Flip coins, generate random numbers, or pick items from a list",
  icon: Shuffle,
  keywords: ["random", "coin", "number", "dice", "pick", "shuffle"],
  path: "/randomizer",
});
