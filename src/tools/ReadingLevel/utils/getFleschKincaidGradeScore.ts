import type { TextMetrics } from "../types/TextMetrics";
import { safeDivide } from "./safeDivide";

export function getFleschKincaidGradeScore(metrics: TextMetrics) {
  const wordsPerSentence = safeDivide(metrics.wordCount, metrics.sentenceCount);
  const syllablesPerWord = safeDivide(metrics.syllableCount, metrics.wordCount);

  if (wordsPerSentence == null || syllablesPerWord == null) {
    return null;
  }

  return 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
}
