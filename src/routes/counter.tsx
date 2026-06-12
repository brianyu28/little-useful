import { createFileRoute } from "@tanstack/react-router";
import Counter from "../tools/Counter/Counter";
import { CounterConfig } from "../tools/Counter/CounterConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/counter")({
  component: Counter,
  head: () => createPageHead(CounterConfig.title),
});
