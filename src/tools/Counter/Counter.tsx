import { useToolState } from "#/hooks/useToolState";
import {
  Badge,
  Button,
  Checkbox,
  Menu,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { ChevronDown } from "lucide-react";
import React from "react";
import { z } from "zod";
import ToolPage from "../../components/ToolPage";
import styles from "./Counter.module.scss";
import { CounterConfig } from "./CounterConfig";
import { countLines } from "./utils/countLines";

const counterDefaults = {
  caseSensitive: true,
  trimLines: true,
};

const counterSchema = z.object({
  caseSensitive: z.boolean(),
  trimLines: z.boolean(),
});

export default function Counter() {
  const [options, setOptions] = useToolState(
    "counter",
    counterDefaults,
    counterSchema,
  );
  const [input, setInput] = React.useState("");
  const [counts, setCounts] = React.useState(() => countLines("", options));

  const handleCount = React.useCallback(() => {
    setCounts(countLines(input, options));
  }, [input, options]);

  return (
    <ToolPage
      contentPadding="md"
      description={CounterConfig.description}
      size="lg"
      title={CounterConfig.title}
    >
      <Stack gap="md">
        <div className={styles.controls}>
          <OptionsMenu options={options} setOptions={setOptions} />
          <Button onClick={handleCount}>Count</Button>
        </div>

        <Textarea
          aria-label="Lines to count"
          autosize
          classNames={{ input: styles.textarea }}
          maxRows={18}
          minRows={12}
          onChange={(event) => setInput(event.currentTarget.value)}
          placeholder="One entry per line"
          value={input}
        />

        <section className={styles.results} aria-label="Line counts">
          {counts.length ? (
            counts.map((lineCount) => (
              <div className={styles.resultRow} key={lineCount.key}>
                <Badge className={styles.count} variant="light">
                  {lineCount.count}
                </Badge>
                <Text className={styles.line}>{lineCount.displayValue}</Text>
              </div>
            ))
          ) : (
            <p className={styles.empty}>No lines counted.</p>
          )}
        </section>
      </Stack>
    </ToolPage>
  );
}

interface OptionsMenuProps {
  readonly options: typeof counterDefaults;
  readonly setOptions: (options: typeof counterDefaults) => void;
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
