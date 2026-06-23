const terminalPunctuation = new Set([".", "!", "?"]);
const closingCharacters = new Set(['"', "'", ")", "]", "}", "”", "’"]);
const nonTerminalAbbreviations = new Set([
  "adj",
  "adm",
  "adv",
  "asst",
  "ave",
  "blvd",
  "brig",
  "capt",
  "cmdr",
  "co",
  "col",
  "corp",
  "dept",
  "dr",
  "fig",
  "gen",
  "gov",
  "hon",
  "inc",
  "jr",
  "lt",
  "maj",
  "messrs",
  "mlle",
  "mme",
  "mr",
  "mrs",
  "ms",
  "mt",
  "no",
  "nos",
  "prof",
  "rep",
  "reps",
  "rev",
  "sen",
  "sens",
  "sgt",
  "sr",
  "st",
  "ste",
  "vs",
]);
const contextualAbbreviations = new Set([
  "approx",
  "dept",
  "e.g",
  "etc",
  "i.e",
  "jan",
  "feb",
  "mar",
  "apr",
  "jun",
  "jul",
  "aug",
  "sep",
  "sept",
  "oct",
  "nov",
  "dec",
]);

const wordPattern = /[\p{L}\p{N}]/u;

/**
 * Sentence punctuation is often followed by quotes, parens, or whitespace.
 * This skips those characters so boundary checks can inspect the next real
 * content character.
 */
function getNextContentCharacter(text: string, index: number) {
  for (let position = index + 1; position < text.length; position += 1) {
    const character = text[position];

    if (closingCharacters.has(character) || /\s/u.test(character)) {
      continue;
    }

    return character;
  }

  return "";
}

/**
 * Reads the token ending at a period, preserving internal periods so values
 * like "i.e." and "p.m." can be handled differently from "Mr.".
 */
function getPreviousToken(text: string, index: number) {
  const token = text.slice(0, index + 1).match(/(?:^|\s)([\p{L}.]+)\.$/u)?.[1];

  return token?.toLocaleLowerCase() ?? "";
}

/**
 * Periods are ambiguous: they can close sentences, abbreviations, initials,
 * decimals, domain-like words, or ellipses. This function rejects the common
 * non-sentence cases before treating a period as a boundary.
 */
function isSentenceEndingPeriod(text: string, index: number) {
  const previousCharacter = text[index - 1] ?? "";
  const nextCharacter = text[index + 1] ?? "";
  const nextContentCharacter = getNextContentCharacter(text, index);

  // Decimal numbers such as "3.14" should not count as two sentences.
  if (/\p{N}/u.test(previousCharacter) && /\p{N}/u.test(nextCharacter)) {
    return false;
  }

  // Internal dots in compact tokens, such as URLs or product names, are not
  // sentence boundaries.
  if (
    wordPattern.test(previousCharacter) &&
    wordPattern.test(nextCharacter) &&
    !/\s/u.test(nextCharacter)
  ) {
    return false;
  }

  // Treat ellipses and repeated periods as a boundary only at the end of text.
  if (nextCharacter === "." || previousCharacter === ".") {
    return nextContentCharacter === "";
  }

  const token = getPreviousToken(text, index);
  const normalizedToken = token.replaceAll(".", "");

  if (!token) {
    return true;
  }

  // Titles and similar abbreviations normally attach to the following word.
  if (nonTerminalAbbreviations.has(normalizedToken)) {
    return false;
  }

  // Initials like "J. Smith" should not add sentence counts.
  if (/^\p{L}$/u.test(normalizedToken)) {
    return false;
  }

  // Multi-part abbreviations usually stay inside a sentence. "a.m." and
  // "p.m." are allowed to end one when followed by uppercase text or EOF.
  if (token.includes(".")) {
    return normalizedToken === "am" || normalizedToken === "pm"
      ? nextContentCharacter === "" || /\p{Lu}/u.test(nextContentCharacter)
      : false;
  }

  // Some abbreviations can end a sentence, but lowercase continuation text is
  // a strong signal that they are still part of the same sentence.
  if (contextualAbbreviations.has(token)) {
    return nextContentCharacter === "" || /\p{Lu}/u.test(nextContentCharacter);
  }

  return true;
}

export function countSentences(text: string) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return 0;
  }

  let sentenceCount = 0;
  let lastBoundaryIndex = -1;

  // Walk punctuation candidates rather than splitting on punctuation, so each
  // period can be classified with local context before incrementing the count.
  for (let index = 0; index < trimmedText.length; index += 1) {
    const character = trimmedText[index];

    if (!terminalPunctuation.has(character)) {
      continue;
    }

    if (character === "." && !isSentenceEndingPeriod(trimmedText, index)) {
      continue;
    }

    sentenceCount += 1;
    lastBoundaryIndex = index;

    // Consume attached punctuation and closers so "Really?!" or `"Done."`
    // count as one sentence boundary instead of several.
    while (
      index + 1 < trimmedText.length &&
      (terminalPunctuation.has(trimmedText[index + 1]) ||
        closingCharacters.has(trimmedText[index + 1]))
    ) {
      index += 1;
      lastBoundaryIndex = index;
    }
  }

  // Readability formulas generally treat a final fragment without terminal
  // punctuation as a sentence if it contains text.
  if (lastBoundaryIndex < trimmedText.length - 1) {
    const trailingText = trimmedText.slice(lastBoundaryIndex + 1);

    if (wordPattern.test(trailingText)) {
      sentenceCount += 1;
    }
  }

  return sentenceCount;
}
