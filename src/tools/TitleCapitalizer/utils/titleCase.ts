export const TITLE_STYLES = ["chicago", "ap", "mla", "apa"] as const;

export type TitleStyle = (typeof TITLE_STYLES)[number];

type MinorWordRule = (word: string) => boolean;

export interface TitleStyleRule {
  readonly description: string;
  readonly label: string;
  /** Words that stay lowercase unless they are structurally emphasized. */
  readonly isMinorWord: MinorWordRule;
  /** MLA lowercases the word immediately following a hyphenated prefix. */
  readonly lowercaseAfterHyphenatedPrefix?: boolean;
}

const ARTICLES = new Set(["a", "an", "the"]);

const COORDINATING_CONJUNCTIONS = new Set([
  "and",
  "but",
  "for",
  "nor",
  "or",
  "so",
  "yet",
]);

const PREPOSITIONS = new Set([
  "about",
  "above",
  "across",
  "after",
  "against",
  "along",
  "among",
  "around",
  "as",
  "at",
  "before",
  "behind",
  "below",
  "beneath",
  "beside",
  "between",
  "beyond",
  "by",
  "despite",
  "down",
  "during",
  "except",
  "for",
  "from",
  "in",
  "inside",
  "into",
  "like",
  "near",
  "of",
  "off",
  "on",
  "onto",
  "out",
  "outside",
  "over",
  "past",
  "per",
  "since",
  "through",
  "throughout",
  "till",
  "to",
  "toward",
  "under",
  "underneath",
  "until",
  "up",
  "upon",
  "via",
  "with",
  "within",
  "without",
]);

const FUNCTION_WORDS = new Set([
  ...ARTICLES,
  ...COORDINATING_CONJUNCTIONS,
  ...PREPOSITIONS,
]);

const isShortPrepositionOrConjunction = (word: string) =>
  word.length <= 3 &&
  (PREPOSITIONS.has(word) || COORDINATING_CONJUNCTIONS.has(word));

const isChicagoMinorWord = (word: string) =>
  ARTICLES.has(word) ||
  COORDINATING_CONJUNCTIONS.has(word) ||
  (PREPOSITIONS.has(word) && word.length <= 4);

// Prefixes for hyphenated words for which we might capitalize or lowercase following word
const HYPHENATED_PREFIXES = new Set([
  "anti",
  "auto",
  "bi",
  "co",
  "counter",
  "cross",
  "de",
  "ex",
  "extra",
  "fore",
  "hyper",
  "inter",
  "intra",
  "macro",
  "micro",
  "mid",
  "mini",
  "mis",
  "mono",
  "multi",
  "neo",
  "non",
  "over",
  "post",
  "pre",
  "pro",
  "pseudo",
  "re",
  "semi",
  "sub",
  "super",
  "trans",
  "ultra",
  "under",
  "un",
]);

export const TITLE_STYLE_RULES: Record<TitleStyle, TitleStyleRule> = {
  chicago: {
    label: "Chicago",
    description:
      "Lowercase articles, conjunctions, and prepositions of four letters or fewer.",
    isMinorWord: isChicagoMinorWord,
  },
  ap: {
    label: "AP",
    description:
      'Lowercase articles, conjunctions, and prepositions of three letters or fewer. This tool does not capitalize infinitive "to", which differs from official AP style.',
    isMinorWord: (word) =>
      ARTICLES.has(word) || isShortPrepositionOrConjunction(word),
  },
  mla: {
    label: "MLA",
    description:
      "Lowercase articles, conjunctions, and prepositions; lowercase words after hyphenated prefixes.",
    isMinorWord: (word) => FUNCTION_WORDS.has(word),
    lowercaseAfterHyphenatedPrefix: true,
  },
  apa: {
    label: "APA",
    description:
      "Lowercase articles, conjunctions, and prepositions of three letters or fewer; lowercase words after hyphenated prefixes.",
    isMinorWord: (word) =>
      ARTICLES.has(word) || isShortPrepositionOrConjunction(word),
    lowercaseAfterHyphenatedPrefix: true,
  },
};

const KNOWN_ACRONYMS = new Set([
  "AI",
  "API",
  "CSS",
  "EU",
  "HTML",
  "NASA",
  "PDF",
  "SEO",
  "SQL",
  "UK",
  "US",
  "USA",
]);

const WORD_PART =
  /^(?<opening>[^\p{L}\p{N}]*)(?<word>[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?)(?<closing>[^\p{L}\p{N}]*)$/u;

const TITLE_PUNCTUATION = /[:—–!?]$/u;

function capitalizeWord(word: string) {
  const acronym = word.toUpperCase();
  if (KNOWN_ACRONYMS.has(acronym)) return acronym;

  return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
}

function formatWordPart(
  part: string,
  isEmphasized: boolean,
  rule: TitleStyleRule,
  forceLowercase = false,
) {
  const match = part.match(WORD_PART);
  if (!match?.groups) return part;

  const { closing, opening, word } = match.groups;
  const normalizedWord = word.toLowerCase();
  const value =
    !forceLowercase && (isEmphasized || !rule.isMinorWord(normalizedWord))
      ? capitalizeWord(word)
      : normalizedWord;
  return `${opening}${value}${closing}`;
}

function formatToken(
  token: string,
  isEmphasized: boolean,
  rule: TitleStyleRule,
) {
  const parts = token.split(/([—–-])/u);

  return parts
    .map((part, index) => {
      if (part === "-" || part === "–" || part === "—") return part;

      const precedingPart = parts[index - 2];
      const followsHyphenatedPrefix =
        rule.lowercaseAfterHyphenatedPrefix === true &&
        parts[index - 1] === "-" &&
        HYPHENATED_PREFIXES.has(precedingPart.toLowerCase());

      return formatWordPart(
        part,
        followsHyphenatedPrefix ? false : isEmphasized,
        rule,
        followsHyphenatedPrefix,
      );
    })
    .join("");
}

/** Converts free-form text into title case using the selected declarative rule. */
export function capitalizeTitle(input: string, style: TitleStyle) {
  const words = input.match(/\S+/gu) ?? [];
  if (!words.length) return input;

  const rule = TITLE_STYLE_RULES[style];
  let wordIndex = 0;
  let capitalizeNext = true;

  return input.replace(/\S+/gu, (token) => {
    const isFirstOrLast = wordIndex === 0 || wordIndex === words.length - 1;
    const formatted = formatToken(token, capitalizeNext || isFirstOrLast, rule);
    capitalizeNext = TITLE_PUNCTUATION.test(token);
    wordIndex += 1;
    return formatted;
  });
}
