import { ActionIcon, Code, Popover, Text } from "@mantine/core";
import { Info } from "lucide-react";
import styles from "../ReadingLevel.module.scss";
import type { TextMetrics } from "../types/TextMetrics";
import { readabilityTests } from "../utils/readabilityTests";

interface Props {
  readonly metrics: TextMetrics;
}

function formatRoundedScore(score: number | null) {
  if (score == null || !Number.isFinite(score)) {
    return "-";
  }

  return Math.round(score).toString();
}

function formatRawScore(score: number | null) {
  if (score == null || !Number.isFinite(score)) {
    return "-";
  }

  return score.toFixed(3);
}

export function ScoreGrid({ metrics }: Props) {
  return (
    <section aria-label="Reading level scores" className={styles.scoreGrid}>
      {readabilityTests.map((test) => {
        const score = test.getScore(metrics);
        const rawScore = formatRawScore(score);

        return (
          <article className={styles.scoreCard} key={test.id}>
            <div className={styles.scoreHeader}>
              <div className={styles.scoreLabel}>
                {test.shortLabel ?? test.label}
              </div>
              <Popover position="bottom-end" shadow="md" width={340} withArrow>
                <Popover.Target>
                  <ActionIcon
                    aria-label={`${test.label} details`}
                    className={styles.infoButton}
                    size="sm"
                    variant="subtle"
                  >
                    <Info size={15} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text fw={700} size="sm">
                    {test.label}
                  </Text>
                  <Text c="dimmed" mt={6} size="sm">
                    {test.description}
                  </Text>
                  <Code block mt="sm">
                    {test.formula}
                  </Code>
                </Popover.Dropdown>
              </Popover>
            </div>
            <div className={styles.scoreValue}>{formatRoundedScore(score)}</div>
            <div className={styles.scoreRawValue}>{rawScore}</div>
          </article>
        );
      })}
    </section>
  );
}
