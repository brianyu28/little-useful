import {
  Alert,
  Button,
  Checkbox,
  Menu,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { Check, ChevronDown, X } from "lucide-react";
import React from "react";
import ToolPage from "../../components/ToolPage";
import styles from "./RegexTest.module.scss";
import { RegexTestConfig } from "./RegexTestConfig";
import RegexTestInstructions from "./components/RegexTestInstructions";

const INITIAL_PATTERN = "";
const INITIAL_LINES = [""];
const DEFAULT_FLAGS = "";

const REGEX_LITERAL_PATTERN = /^\/((?:\\.|[^/])*)\/([dgimsuvy]*)$/;
const REGEX_FLAGS = [
  {
    flag: "g",
    name: "Global",
    description: "Find all matches",
  },
  {
    flag: "i",
    name: "Ignore case",
    description: "Match uppercase and lowercase",
  },
  {
    flag: "u",
    name: "Unicode",
    description: "Use Unicode mode",
  },
] as const;

interface ParsedRegex {
  readonly error?: string;
  readonly flags: string;
  readonly pattern: string;
  readonly regex?: RegExp;
}

interface MatchRange {
  readonly end: number;
  readonly start: number;
}

interface MatchGroup {
  readonly label: string;
  readonly value?: string;
}

interface MatchDetails {
  readonly groups: MatchGroup[];
  readonly text: string;
}

interface TestLine {
  readonly id: number;
  readonly value: string;
}

function parseRegex(patternInput: string, flagsInput: string): ParsedRegex {
  const trimmedPattern = patternInput.trim();
  const literalMatch = trimmedPattern.match(REGEX_LITERAL_PATTERN);
  const pattern = literalMatch?.[1] ?? patternInput;
  const flags = flagsInput;

  try {
    return {
      flags,
      pattern,
      regex: new RegExp(pattern, flags),
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Invalid regular expression",
      flags,
      pattern,
    };
  }
}

function getMatchRanges(line: string, regex: RegExp): MatchRange[] {
  const findAllMatches = regex.flags.includes("g");
  const matchRegex = new RegExp(regex.source, regex.flags);
  const ranges: MatchRange[] = [];
  let match: RegExpExecArray | null;

  while ((match = matchRegex.exec(line)) != null) {
    const start = match.index;
    const text = match[0];

    if (text.length === 0) {
      matchRegex.lastIndex += 1;
    } else {
      ranges.push({ start, end: start + text.length });
    }

    if (!findAllMatches) break;
  }

  return ranges;
}

function getMatchDetails(line: string, regex: RegExp): MatchDetails[] {
  const findAllMatches = regex.flags.includes("g");
  const matchRegex = new RegExp(regex.source, regex.flags);
  const matches: MatchDetails[] = [];
  let match: RegExpExecArray | null;

  while ((match = matchRegex.exec(line)) != null) {
    const numberedGroups = match.slice(1).map((value, index) => ({
      label: `$${index + 1}`,
      value,
    }));
    const namedGroups = Object.entries(match.groups ?? {}).map(
      ([name, value]) => ({
        label: name,
        value,
      }),
    );

    matches.push({
      groups: [...numberedGroups, ...namedGroups],
      text: match[0],
    });

    if (match[0].length === 0) {
      matchRegex.lastIndex += 1;
    }

    if (!findAllMatches) break;
  }

  return matches;
}

function formatGroupValue(value: string | undefined) {
  if (value == null) return "undefined";
  if (value.length === 0) return "(empty)";
  return value;
}

function renderHighlightedLine(line: string, ranges: MatchRange[]) {
  if (ranges.length === 0) return line;

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((range, index) => {
    if (cursor < range.start) {
      parts.push(line.slice(cursor, range.start));
    }

    parts.push(
      <mark
        className={styles.match}
        key={`${range.start}-${range.end}-${index}`}
      >
        {line.slice(range.start, range.end)}
      </mark>,
    );

    cursor = range.end;
  });

  if (cursor < line.length) {
    parts.push(line.slice(cursor));
  }

  return parts;
}

function renderMatchGroups(matches: MatchDetails[]) {
  const hasGroups = matches.some((match) => match.groups.length > 0);

  if (!hasGroups) {
    return <Text size="sm">No capture groups</Text>;
  }

  return (
    <Stack gap="xs">
      {matches.map((match, matchIndex) => {
        if (match.groups.length === 0) return null;

        return (
          <div
            className={styles.groupMatch}
            key={`${match.text}-${matchIndex}`}
          >
            {matches.length > 1 ? (
              <Text c="dimmed" size="xs">
                Match {matchIndex + 1}: {match.text || "(empty)"}
              </Text>
            ) : null}
            {match.groups.map((group) => (
              <div className={styles.groupRow} key={group.label}>
                <span className={styles.groupLabel}>{group.label}</span>
                <span className={styles.groupValue}>
                  {formatGroupValue(group.value)}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </Stack>
  );
}

export default function RegexTest() {
  const [pattern, setPattern] = React.useState(INITIAL_PATTERN);
  const [flags, setFlags] = React.useState(DEFAULT_FLAGS);
  const [lines, setLines] = React.useState<TestLine[]>(() =>
    INITIAL_LINES.map((value, index) => ({ id: index, value })),
  );
  const nextLineId = React.useRef(INITIAL_LINES.length);
  const pendingFocusIndex = React.useRef<number | null>(null);
  const lineInputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  const parsedRegex = React.useMemo(
    () => parseRegex(pattern, flags),
    [flags, pattern],
  );
  const flagsLabel = flags.length > 0 ? flags.split("").join(" ") : "None";

  React.useLayoutEffect(() => {
    if (pendingFocusIndex.current == null) return;

    const input = lineInputRefs.current[pendingFocusIndex.current];

    if (input != null && document.activeElement !== input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }

    pendingFocusIndex.current = null;
  }, [lines]);

  const handlePatternChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setPattern(event.currentTarget.value),
    [],
  );

  const toggleFlag = React.useCallback(
    (flag: string) =>
      setFlags((currentFlags) => {
        if (currentFlags.includes(flag)) {
          return currentFlags.replace(flag, "");
        }

        return REGEX_FLAGS.map(({ flag: availableFlag }) => availableFlag)
          .filter(
            (availableFlag) =>
              currentFlags.includes(availableFlag) || availableFlag === flag,
          )
          .join("");
      }),
    [],
  );

  const updateLine = React.useCallback((index: number, value: string) => {
    setLines((currentLines) =>
      currentLines.map((line, lineIndex) =>
        lineIndex === index ? { ...line, value } : line,
      ),
    );
  }, []);

  const insertLines = React.useCallback(
    (index: number, values: string[], focusOffset: number) => {
      const newLines = values.map((value) => ({
        id: nextLineId.current++,
        value,
      }));

      pendingFocusIndex.current = index + focusOffset;
      setLines((currentLines) => [
        ...currentLines.slice(0, index),
        ...newLines,
        ...currentLines.slice(index + 1),
      ]);
    },
    [],
  );

  const handleLineKeyDown = React.useCallback(
    (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const selectionStart = input.selectionStart ?? input.value.length;
      const selectionEnd = input.selectionEnd ?? input.value.length;

      if (event.key === "Enter") {
        event.preventDefault();
        insertLines(
          index,
          [
            input.value.slice(0, selectionStart),
            input.value.slice(selectionEnd),
          ],
          1,
        );
      }

      if (
        event.key === "Backspace" &&
        lines.length > 1 &&
        input.value.length === 0
      ) {
        event.preventDefault();
        pendingFocusIndex.current = Math.max(0, index - 1);
        setLines((currentLines) =>
          currentLines.filter((_, lineIndex) => lineIndex !== index),
        );
      }
    },
    [insertLines, lines.length],
  );

  const handleLinePaste = React.useCallback(
    (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = event.clipboardData.getData("text");
      if (!pastedText.includes("\n")) return;

      event.preventDefault();

      const input = event.currentTarget;
      const selectionStart = input.selectionStart ?? input.value.length;
      const selectionEnd = input.selectionEnd ?? input.value.length;
      const pastedLines = pastedText.replace(/\r\n?/g, "\n").split("\n");
      const replacementLines = [
        `${input.value.slice(0, selectionStart)}${pastedLines[0]}`,
        ...pastedLines.slice(1, -1),
        `${pastedLines[pastedLines.length - 1]}${input.value.slice(
          selectionEnd,
        )}`,
      ];

      insertLines(index, replacementLines, pastedLines.length - 1);
    },
    [insertLines],
  );

  return (
    <ToolPage
      description={RegexTestConfig.description}
      title={RegexTestConfig.title}
      instructions={<RegexTestInstructions />}
    >
      <Stack gap="lg">
        <div className={styles.controls}>
          <TextInput
            aria-label="Regular expression"
            label="Regular expression"
            onChange={handlePatternChange}
            placeholder="Pattern..."
            value={pattern}
          />
          <div>
            <Text fw={500} size="sm">
              Flags
            </Text>
            <Menu closeOnItemClick={false} position="bottom-end" width={280}>
              <Menu.Target>
                <Button
                  className={styles.flagsButton}
                  justify="space-between"
                  rightSection={<ChevronDown size={16} />}
                  variant="default"
                >
                  {flagsLabel}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {REGEX_FLAGS.map(({ description, flag, name }) => {
                  const checked = flags.includes(flag);

                  return (
                    <Menu.Item
                      key={flag}
                      leftSection={<Checkbox checked={checked} readOnly />}
                      onClick={() => toggleFlag(flag)}
                    >
                      <div className={styles.flagMenuItem}>
                        <Text fw={700} size="sm">
                          {name} ({flag})
                        </Text>
                        <Text c="dimmed" size="xs">
                          {description}
                        </Text>
                      </div>
                    </Menu.Item>
                  );
                })}
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>

        {parsedRegex.error ? (
          <Alert color="red" title="Invalid regular expression">
            {parsedRegex.error}
          </Alert>
        ) : null}

        <Stack gap="xs">
          <div>
            <Text fw={500} size="sm">
              Text to test
            </Text>
            <Text c="dimmed" size="sm">
              {lines.length} {lines.length === 1 ? "line" : "lines"} checked
            </Text>
          </div>
          <div className={styles.results}>
            {lines.map((line, index) => {
              const regex = parsedRegex.regex;
              const ranges =
                regex == null ? [] : getMatchRanges(line.value, regex);
              const matchDetails =
                regex == null ? [] : getMatchDetails(line.value, regex);
              const matches = matchDetails.length > 0;
              const statusLabel =
                regex == null
                  ? `Line ${index + 1} cannot be checked`
                  : matches
                    ? `Line ${index + 1} matched`
                    : `Line ${index + 1} did not match`;

              return (
                <div className={styles.resultRow} key={line.id}>
                  {matches && regex != null ? (
                    <Tooltip
                      label={renderMatchGroups(matchDetails)}
                      multiline
                      position="right"
                      withArrow
                    >
                      <div
                        aria-label={statusLabel}
                        className={`${styles.statusBox} ${styles.statusMatch}`}
                      >
                        <Check size={20} />
                      </div>
                    </Tooltip>
                  ) : (
                    <div
                      aria-label={statusLabel}
                      className={`${styles.statusBox} ${
                        regex == null ? styles.statusInvalid : styles.statusMiss
                      }`}
                    >
                      <X size={20} />
                    </div>
                  )}
                  <div className={styles.lineEditor}>
                    <div aria-hidden className={styles.highlightLayer}>
                      {renderHighlightedLine(line.value, ranges)}
                    </div>
                    <input
                      aria-label={`Text to test line ${index + 1}`}
                      className={styles.lineInput}
                      onChange={(event) =>
                        updateLine(index, event.currentTarget.value)
                      }
                      onKeyDown={(event) => handleLineKeyDown(index, event)}
                      onPaste={(event) => handleLinePaste(index, event)}
                      placeholder="Enter text to test"
                      ref={(element) => {
                        lineInputRefs.current[index] = element;
                      }}
                      spellCheck={false}
                      value={line.value}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Stack>
      </Stack>
    </ToolPage>
  );
}
