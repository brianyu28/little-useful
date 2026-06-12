import { useToolState } from "#/hooks/useToolState";
import {
  Accordion,
  Button,
  Checkbox,
  Group,
  Menu,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { ChevronDown } from "lucide-react";
import React from "react";
import { z } from "zod";
import ToolPage from "../../components/ToolPage";
import styles from "./SetComparison.module.scss";
import { SetComparisonConfig } from "./SetComparisonConfig";
import type { SetComparisonEntry } from "./utils/compareLineSets";
import { compareLineSets } from "./utils/compareLineSets";

const setComparisonDefaults = {
  caseSensitive: true,
  sortResults: true,
  trimLines: true,
};

const setComparisonSchema = z.object({
  caseSensitive: z.boolean(),
  sortResults: z.boolean(),
  trimLines: z.boolean(),
});

export default function SetComparison() {
  const [options, setOptions] = useToolState(
    "set-comparison",
    setComparisonDefaults,
    setComparisonSchema,
  );
  const [leftTitle, setLeftTitle] = React.useState("");
  const [rightTitle, setRightTitle] = React.useState("");
  const [leftInput, setLeftInput] = React.useState("");
  const [rightInput, setRightInput] = React.useState("");
  const [result, setResult] = React.useState<ReturnType<
    typeof compareLineSets
  > | null>(null);

  const resolvedLeftTitle = leftTitle.trim() || "Left Set";
  const resolvedRightTitle = rightTitle.trim() || "Right Set";

  const handleCompare = React.useCallback(() => {
    setResult(compareLineSets(leftInput, rightInput, options));
  }, [leftInput, options, rightInput]);

  return (
    <ToolPage
      contentPadding="md"
      description={SetComparisonConfig.description}
      size="xl"
      title={SetComparisonConfig.title}
    >
      <Stack gap="md">
        <div className={styles.controls}>
          <OptionsMenu options={options} setOptions={setOptions} />
          <Button onClick={handleCompare}>Compare</Button>
        </div>

        <div className={styles.inputs}>
          <section className={styles.panel}>
            <TextInput
              aria-label="Left set title"
              onChange={(event) => setLeftTitle(event.currentTarget.value)}
              placeholder="Left Set"
              value={leftTitle}
            />
            <Textarea
              aria-label="Left set lines"
              classNames={{ input: styles.textarea }}
              onChange={(event) => setLeftInput(event.currentTarget.value)}
              placeholder="One entry per line"
              rows={12}
              value={leftInput}
            />
          </section>
          <section className={styles.panel}>
            <TextInput
              aria-label="Right set title"
              onChange={(event) => setRightTitle(event.currentTarget.value)}
              placeholder="Right Set"
              value={rightTitle}
            />
            <Textarea
              aria-label="Right set lines"
              classNames={{ input: styles.textarea }}
              onChange={(event) => setRightInput(event.currentTarget.value)}
              placeholder="One entry per line"
              rows={12}
              value={rightInput}
            />
          </section>
        </div>

        {result != null ? (
          <div className={styles.results}>
            <ResultPanel
              entries={result.leftOnly}
              label={`${resolvedLeftTitle} only`}
              value="left-only"
            />
            <ResultPanel
              entries={result.rightOnly}
              label={`${resolvedRightTitle} only`}
              value="right-only"
            />
            <ResultPanel entries={result.both} label="In both" value="both" />
          </div>
        ) : null}
      </Stack>
    </ToolPage>
  );
}

interface OptionsMenuProps {
  readonly options: typeof setComparisonDefaults;
  readonly setOptions: (options: typeof setComparisonDefaults) => void;
}

function OptionsMenu({ options, setOptions }: OptionsMenuProps) {
  const optionItems = [
    {
      checked: options.caseSensitive,
      description: "Treat uppercase and lowercase letters as different.",
      label: "Case sensitive",
      onToggle: () =>
        setOptions({ ...options, caseSensitive: !options.caseSensitive }),
    },
    {
      checked: options.sortResults,
      description: "Sort entries alphabetically inside each result group.",
      label: "Sort results",
      onToggle: () =>
        setOptions({ ...options, sortResults: !options.sortResults }),
    },
    {
      checked: options.trimLines,
      description: "Ignore spaces before and after each line.",
      label: "Strip surrounding spaces",
      onToggle: () => setOptions({ ...options, trimLines: !options.trimLines }),
    },
  ];

  return (
    <div className={styles.options}>
      <Menu closeOnItemClick={false} position="bottom-start" width={300}>
        <Menu.Target>
          <Button
            className={styles.optionsButton}
            justify="space-between"
            rightSection={<ChevronDown size={16} />}
            variant="default"
          >
            Options
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {optionItems.map((option) => (
            <Menu.Item
              key={option.label}
              leftSection={<Checkbox checked={option.checked} readOnly />}
              onClick={option.onToggle}
            >
              <div className={styles.optionMenuItem}>
                <Text fw={700} size="sm">
                  {option.label}
                </Text>
                <Text c="dimmed" size="xs">
                  {option.description}
                </Text>
              </div>
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

interface ResultPanelProps {
  readonly entries: SetComparisonEntry[];
  readonly label: string;
  readonly value: string;
}

function ResultPanel({ entries, label, value }: ResultPanelProps) {
  return (
    <Accordion defaultValue={value} variant="contained">
      <Accordion.Item value={value}>
        <Accordion.Control>
          <Group justify="space-between" wrap="nowrap">
            <Text fw={700}>{label}</Text>
            <Text c="dimmed" size="sm">
              {entries.length}
            </Text>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          {entries.length ? (
            <ol className={styles.list}>
              {entries.map((entry) => (
                <li className={styles.item} key={entry.key}>
                  {entry.displayValue || "(empty line)"}
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.empty}>No entries.</p>
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
