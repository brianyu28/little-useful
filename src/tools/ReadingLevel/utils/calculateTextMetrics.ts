import { syllable } from "syllable";
import type { TextMetrics } from "../types/TextMetrics";
import { countSentences } from "./countSentences";

// Match words, including those with apostrophes or hyphens
const wordPattern = /[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu;

// Match a single letter or number (this is how ARI defines characters)
const characterPattern = /[\p{L}\p{N}]/gu;

// Match a single letter
const letterPattern = /\p{L}/gu;

export function calculateTextMetrics(text: string): TextMetrics {
  const words = text.match(wordPattern) ?? [];
  const characters = text.match(characterPattern) ?? [];
  const letters = text.match(letterPattern) ?? [];

  return {
    text,
    characterCount: characters.length,
    wordCount: words.length,
    sentenceCount: countSentences(text),
    syllableCount: words.reduce((count, word) => count + syllable(word), 0),
    letterCount: letters.length,
  };
}
