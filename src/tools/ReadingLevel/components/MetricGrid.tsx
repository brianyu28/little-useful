import { ActionIcon, Popover, Text } from "@mantine/core";
import { Info } from "lucide-react";
import styles from "../ReadingLevel.module.scss";
import type { TextMetrics } from "../types/TextMetrics";

interface Props {
  readonly metrics: TextMetrics;
}

const numberFormatter = new Intl.NumberFormat();
const characterInfo = "Characters count letters and numbers only.";

function formatDecimal(value: number) {
  return value.toFixed(1);
}

function formatRatio(numerator: number, denominator: number) {
  if (denominator === 0) {
    return "-";
  }

  return formatDecimal(numerator / denominator);
}

export function MetricGrid({ metrics }: Props) {
  const metricItems = [
    { label: "Words", value: numberFormatter.format(metrics.wordCount) },
    {
      label: "Sentences",
      value: numberFormatter.format(metrics.sentenceCount),
    },
    {
      label: "Syllables",
      value: numberFormatter.format(metrics.syllableCount),
    },
    { label: "Letters", value: numberFormatter.format(metrics.letterCount) },
    {
      label: "Characters",
      info: characterInfo,
      value: numberFormatter.format(metrics.characterCount),
    },
    {
      label: "Characters per word",
      info: characterInfo,
      value: formatRatio(metrics.characterCount, metrics.wordCount),
    },
    {
      label: "Words per sentence",
      value: formatRatio(metrics.wordCount, metrics.sentenceCount),
    },
    {
      label: "Syllables per word",
      value: formatRatio(metrics.syllableCount, metrics.wordCount),
    },
  ];

  return (
    <section aria-label="Text metrics" className={styles.metricGrid}>
      {metricItems.map((item) => (
        <div className={styles.metricItem} key={item.label}>
          <div className={styles.metricHeader}>
            <div className={styles.metricLabel}>{item.label}</div>
            {item.info != null && (
              <Popover
                position="bottom-start"
                shadow="md"
                width={280}
                withArrow
              >
                <Popover.Target>
                  <ActionIcon
                    aria-label={`${item.label} details`}
                    className={styles.metricInfoButton}
                    size="xs"
                    variant="subtle"
                  >
                    <Info size={13} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size="sm">{item.info}</Text>
                </Popover.Dropdown>
              </Popover>
            )}
          </div>
          <div className={styles.metricValue}>{item.value}</div>
        </div>
      ))}
    </section>
  );
}
