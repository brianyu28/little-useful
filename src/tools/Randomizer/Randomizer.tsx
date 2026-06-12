import { useToolState } from "#/hooks/useToolState";
import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { Clipboard, ClipboardCheck } from "lucide-react";
import React from "react";
import { z } from "zod";
import ToolPage from "../../components/ToolPage";
import styles from "./Randomizer.module.scss";
import { RandomizerConfig } from "./RandomizerConfig";
import type { ListPreset } from "./types/ListPreset";
import { LIST_PRESET_LABELS, LIST_PRESETS } from "./types/ListPreset";
import type { RandomizerMode } from "./types/RandomizerMode";
import {
  RANDOMIZER_MODE_LABELS,
  RANDOMIZER_MODES,
} from "./types/RandomizerMode";
import { getListItems, randomize } from "./utils/randomize";

const randomizerDefaults = {
  count: 1,
  listInput: "",
  listPreset: "custom" satisfies ListPreset,
  max: 100,
  min: 1,
  mode: "coin" satisfies RandomizerMode,
};

const randomizerSchema = z.object({
  count: z.number().int().min(1).max(1000),
  listInput: z.string(),
  listPreset: z.enum(LIST_PRESETS),
  max: z.number().int(),
  min: z.number().int(),
  mode: z.enum(RANDOMIZER_MODES),
});

const modeData = RANDOMIZER_MODES.map((mode) => ({
  label: RANDOMIZER_MODE_LABELS[mode],
  value: mode,
}));

const listPresetData = LIST_PRESETS.map((preset) => ({
  label: LIST_PRESET_LABELS[preset],
  value: preset,
}));

export default function Randomizer() {
  const [options, setOptions] = useToolState(
    "randomizer",
    randomizerDefaults,
    randomizerSchema,
  );
  const [results, setResults] = React.useState<string[]>([]);
  const [isCopied, setIsCopied] = React.useState(false);
  const copyTimeoutRef = React.useRef<number>(undefined);

  React.useEffect(
    () => () => {
      window.clearTimeout(copyTimeoutRef.current);
    },
    [],
  );

  const canGenerate =
    options.mode !== "list" ||
    getListItems(options.listPreset, options.listInput).length > 0;
  const copyValue = results.join("\n");

  const handleGenerate = React.useCallback(() => {
    setResults(randomize(options).filter(Boolean));
  }, [options]);

  const handleCopy = React.useCallback(() => {
    if (!copyValue) return;

    void navigator.clipboard.writeText(copyValue).then(() => {
      window.clearTimeout(copyTimeoutRef.current);
      setIsCopied(true);
      copyTimeoutRef.current = window.setTimeout(
        () => setIsCopied(false),
        1000,
      );
    });
  }, [copyValue]);

  return (
    <ToolPage
      contentPadding="md"
      description={RandomizerConfig.description}
      size="md"
      title={RandomizerConfig.title}
    >
      <Stack gap="md">
        <div className={styles.controls}>
          <SegmentedControl
            aria-label="Randomizer mode"
            data={modeData}
            onChange={(mode) => setOptions({ ...options, mode })}
            value={options.mode}
          />

          {options.mode === "number" && (
            <div className={styles.numberGrid}>
              <NumberInput
                allowDecimal={false}
                label="Minimum"
                onChange={(value) => {
                  if (typeof value === "number") {
                    setOptions({ ...options, min: value });
                  }
                }}
                value={options.min}
              />
              <NumberInput
                allowDecimal={false}
                label="Maximum"
                onChange={(value) => {
                  if (typeof value === "number") {
                    setOptions({ ...options, max: value });
                  }
                }}
                value={options.max}
              />
              <CountInput
                count={options.count}
                onChange={(count) => setOptions({ ...options, count })}
              />
            </div>
          )}

          {options.mode !== "number" && (
            <CountInput
              count={options.count}
              onChange={(count) => setOptions({ ...options, count })}
            />
          )}

          {options.mode === "list" && (
            <div className={styles.listGrid}>
              <Select
                allowDeselect={false}
                data={listPresetData}
                label="List"
                onChange={(preset) => {
                  if (preset != null) {
                    setOptions({
                      ...options,
                      listPreset: preset,
                    });
                  }
                }}
                value={options.listPreset}
              />
              {options.listPreset === "custom" && (
                <Textarea
                  aria-label="Randomizer list items"
                  autosize
                  classNames={{ input: styles.textarea }}
                  minRows={8}
                  onChange={(event) =>
                    setOptions({
                      ...options,
                      listInput: event.currentTarget.value,
                    })
                  }
                  placeholder="One item per line"
                  value={options.listInput}
                />
              )}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button disabled={!canGenerate} onClick={handleGenerate}>
            Generate
          </Button>
          <Group gap={4}>
            <Tooltip label="Copy results">
              <ActionIcon
                aria-label="Copy results"
                disabled={!copyValue}
                onClick={handleCopy}
                variant="subtle"
              >
                {isCopied ? (
                  <ClipboardCheck size={18} />
                ) : (
                  <Clipboard size={18} />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>
        </div>

        <section className={styles.resultPanel} aria-label="Randomizer results">
          {results.length === 0 ? (
            <p className={styles.empty}>No result yet.</p>
          ) : results.length === 1 ? (
            <div className={styles.singleResult}>{results[0]}</div>
          ) : (
            <ol className={styles.resultList}>
              {results.map((result, index) => (
                <li className={styles.resultItem} key={`${result}-${index}`}>
                  {result}
                </li>
              ))}
            </ol>
          )}
        </section>
      </Stack>
    </ToolPage>
  );
}

interface CountInputProps {
  readonly count: number;
  readonly onChange: (count: number) => void;
}

function CountInput({ count, onChange }: CountInputProps) {
  return (
    <NumberInput
      allowDecimal={false}
      allowNegative={false}
      clampBehavior="strict"
      label="How many"
      max={1000}
      min={1}
      onChange={(value) => {
        if (typeof value === "number") onChange(value);
      }}
      value={count}
    />
  );
}
