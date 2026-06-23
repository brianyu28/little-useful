import type { ReadabilityTest } from "../types/ReadabilityTest";
import { getAutomatedReadabilityIndexScore } from "./getAutomatedReadabilityIndexScore";
import { getColemanLiauIndexScore } from "./getColemanLiauIndexScore";
import { getFleschKincaidGradeScore } from "./getFleschKincaidGradeScore";
import { getFleschReadingEaseScore } from "./getFleschReadingEaseScore";

export const readabilityTests: ReadabilityTest[] = [
  {
    id: "flesch-reading-ease",
    label: "Flesch Reading-Ease",
    description:
      "Higher scores are easier to read. 60-70 is considered plain English. 80 and above is considered easy, 50 and below is considered difficult.",
    formula:
      "206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)",
    getScore: getFleschReadingEaseScore,
  },
  {
    id: "flesch-kincaid",
    label: "Flesch-Kincaid",
    description:
      "Estimates U.S. grade level, higher scores are harder to read. 1 is first grade, 2 is second grade, 12 is twelfth grade, 13 is college.",
    formula: "0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59",
    formulaContext:
      "A score near 8 suggests eighth-grade readability. Higher scores indicate more advanced text.",
    getScore: getFleschKincaidGradeScore,
  },
  {
    id: "coleman-liau",
    label: "Coleman-Liau Index",
    shortLabel: "Coleman-Liau",
    description:
      "Estimates U.S. grade level, higher scores are harder to read. 1 is first grade, 2 is second grade, 12 is twelfth grade, 13 is college.",
    formula:
      "0.0588 * (letters per 100 words) - 0.296 * (sentences per 100 words) - 15.8",
    getScore: getColemanLiauIndexScore,
  },
  {
    id: "automated-readability",
    label: "Automated Readability Index",
    shortLabel: "Automated Readability",
    description:
      "Estimates U.S. grade level, higher scores are harder to read. 1 is kindergarten, 2 is first grade, 13 is twelfth grade, 14 is college.",
    formula: "4.71 * (characters / words) + 0.5 * (words / sentences) - 21.43",
    getScore: getAutomatedReadabilityIndexScore,
  },
];
