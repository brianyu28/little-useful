import type { TextMetrics } from "../types/TextMetrics";
import { safeDivide } from "./safeDivide";

export function getColemanLiauIndexScore(metrics: TextMetrics) {
  const lettersPerWord = safeDivide(metrics.letterCount, metrics.wordCount);
  const sentencesPerWord = safeDivide(metrics.sentenceCount, metrics.wordCount);

  if (lettersPerWord == null || sentencesPerWord == null) {
    return null;
  }

  const averageLettersPerHundredWords = lettersPerWord * 100;
  const averageSentencesPerHundredWords = sentencesPerWord * 100;

  return (
    0.0588 * averageLettersPerHundredWords -
    0.296 * averageSentencesPerHundredWords -
    15.8
  );
}
