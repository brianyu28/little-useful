import {
  ColorInput,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { Check, X } from "lucide-react";
import React from "react";
import ToolPage from "../../components/ToolPage";
import type { RgbColor } from "../ColorPicker/types/RgbColor";
import { getColorForHex } from "../ColorPicker/utils/getColorForHex";
import { getHexForColor } from "../ColorPicker/utils/getHexForColor";
import { normalizeHex } from "../ColorPicker/utils/normalizeHex";
import ContrastCheckInstructions from "./components/ContrastCheckInstructions";
import styles from "./ContrastCheck.module.scss";
import { ContrastCheckConfig } from "./ContrastCheckConfig";
import { formatContrastRatio } from "./utils/formatContrastRatio";
import { getContrastRatio } from "./utils/getContrastRatio";

const INITIAL_FOREGROUND = "#000000";
const INITIAL_BACKGROUND = "#ffffff";
const colorChannels: Array<keyof RgbColor> = ["red", "green", "blue"];

const thresholds = [
  {
    label: "AA large text",
    description: "Normal contrast for large text",
    minimumRatio: 3,
  },
  {
    label: "AA normal text",
    description: "Normal contrast for body text",
    minimumRatio: 4.5,
  },
  {
    label: "AAA large text",
    description: "Enhanced contrast for large text",
    minimumRatio: 4.5,
  },
  {
    label: "AAA normal text",
    description: "Enhanced contrast for body text",
    minimumRatio: 7,
  },
];

function getSafeHex(value: string, fallback: string) {
  return normalizeHex(value) ?? fallback;
}

function clampRgb(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function getChannelLabel(channel: keyof RgbColor) {
  return channel.charAt(0).toUpperCase() + channel.slice(1);
}

interface RgbInputsProps {
  readonly fallback: string;
  readonly label: string;
  readonly onChange: (value: string) => void;
  readonly value: string;
}

function RgbInputs({ fallback, label, onChange, value }: RgbInputsProps) {
  const color = getColorForHex(getSafeHex(value, fallback));

  const updateChannel = React.useCallback(
    (channel: keyof RgbColor, nextValue: number | string) => {
      if (typeof nextValue !== "number") return;

      onChange(
        getHexForColor({
          ...color,
          [channel]: clampRgb(nextValue),
        }),
      );
    },
    [color, onChange],
  );

  return (
    <SimpleGrid cols={3} spacing="xs">
      {colorChannels.map((channel) => (
        <NumberInput
          aria-label={`${label} ${channel}`}
          clampBehavior="strict"
          hideControls
          key={channel}
          label={getChannelLabel(channel)}
          max={255}
          min={0}
          onChange={(nextValue) => updateChannel(channel, nextValue)}
          value={color[channel]}
        />
      ))}
    </SimpleGrid>
  );
}

export default function ContrastCheck() {
  const [foreground, setForeground] = React.useState(INITIAL_FOREGROUND);
  const [background, setBackground] = React.useState(INITIAL_BACKGROUND);

  const normalizedForeground = getSafeHex(foreground, INITIAL_FOREGROUND);
  const normalizedBackground = getSafeHex(background, INITIAL_BACKGROUND);
  const contrastRatio = getContrastRatio(
    normalizedForeground,
    normalizedBackground,
  );

  return (
    <ToolPage
      description={ContrastCheckConfig.description}
      title={ContrastCheckConfig.title}
      instructions={<ContrastCheckInstructions />}
    >
      <Stack gap="lg">
        <div
          aria-label={`Preview with ${normalizedForeground} text on ${normalizedBackground} background`}
          className={styles.preview}
          style={{
            backgroundColor: normalizedBackground,
            color: normalizedForeground,
          }}
        >
          <div className={styles.previewText}>Lorem ipsum</div>
          <div className={styles.previewTextSmall}>dolor sit amet</div>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Stack gap="xs">
            <ColorInput
              format="hex"
              label="Background"
              onChange={setBackground}
              value={background}
            />
            <RgbInputs
              fallback={INITIAL_BACKGROUND}
              label="Background"
              onChange={setBackground}
              value={background}
            />
          </Stack>
          <Stack gap="xs">
            <ColorInput
              format="hex"
              label="Foreground"
              onChange={setForeground}
              value={foreground}
            />
            <RgbInputs
              fallback={INITIAL_FOREGROUND}
              label="Foreground"
              onChange={setForeground}
              value={foreground}
            />
          </Stack>
        </SimpleGrid>

        <Stack className={styles.ratioPanel} gap="md">
          <div>
            <Text c="dimmed" size="sm">
              Contrast ratio
            </Text>
            <div className={styles.ratioValue}>
              {formatContrastRatio(contrastRatio)}
            </div>
          </div>

          <Stack gap={0}>
            {thresholds.map((threshold) => {
              const passes = contrastRatio >= threshold.minimumRatio;

              return (
                <div className={styles.resultRow} key={threshold.label}>
                  <div className={styles.resultLabel}>
                    <Text fw={700}>{threshold.label}</Text>
                    <Text c="dimmed" size="sm">
                      {threshold.description} · {threshold.minimumRatio}:1
                    </Text>
                  </div>
                  <div
                    className={
                      passes
                        ? `${styles.statusPill} ${styles.statusPass}`
                        : `${styles.statusPill} ${styles.statusFail}`
                    }
                  >
                    {passes ? (
                      <Group>
                        <Check /> Pass
                      </Group>
                    ) : (
                      <Group>
                        <X /> Fail
                      </Group>
                    )}
                  </div>
                </div>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </ToolPage>
  );
}
