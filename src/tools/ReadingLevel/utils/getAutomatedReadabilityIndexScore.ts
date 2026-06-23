import type { TextMetrics } from "../types/TextMetrics";
import { safeDivide } from "./safeDivide";

export function getAutomatedReadabilityIndexScore(metrics: TextMetrics) {
  const charactersPerWord = safeDivide(
    metrics.characterCount,
    metrics.wordCount,
  );
  const wordsPerSentence = safeDivide(metrics.wordCount, metrics.sentenceCount);

  if (charactersPerWord == null || wordsPerSentence == null) {
    return null;
  }

  return 4.71 * charactersPerWord + 0.5 * wordsPerSentence - 21.43;
}
