import { createFileRoute } from "@tanstack/react-router";
import RegexTest from "../tools/RegexTest/RegexTest";
import { RegexTestConfig } from "../tools/RegexTest/RegexTestConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/regex")({
  component: RegexTest,
  head: () => createPageHead(RegexTestConfig.title),
});
