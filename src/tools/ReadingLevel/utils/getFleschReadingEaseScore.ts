import type { TextMetrics } from "../types/TextMetrics";
import { safeDivide } from "./safeDivide";

export function getFleschReadingEaseScore(metrics: TextMetrics) {
  const wordsPerSentence = safeDivide(metrics.wordCount, metrics.sentenceCount);
  const syllablesPerWord = safeDivide(metrics.syllableCount, metrics.wordCount);

  if (wordsPerSentence == null || syllablesPerWord == null) {
    return null;
  }

  return 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
}
