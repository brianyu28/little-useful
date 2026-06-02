import { Group, NumberInput, Slider } from "@mantine/core";
import styles from "./ColorChannelInput.module.scss";

interface Props {
  readonly label: string;
  readonly maxValue: number;
  readonly onChange: (value: number | string) => void;
  readonly value: number;
}

export default function ColorChannelInput({
  label,
  maxValue,
  onChange,
  value,
}: Props) {
  return (
    <Group className={styles.channel} gap="md" wrap="nowrap">
      <NumberInput
        clampBehavior="strict"
        decimalScale={maxValue === 1 ? 3 : 0}
        fixedDecimalScale={maxValue === 1}
        label={label}
        max={maxValue}
        min={0}
        onChange={onChange}
        value={value}
      />
      <Slider
        aria-label={`${label} slider`}
        label={
          maxValue === 1 ? (sliderValue) => sliderValue.toFixed(3) : undefined
        }
        max={maxValue}
        onChange={onChange}
        precision={maxValue === 1 ? 3 : 0}
        step={maxValue === 1 ? 0.001 : 1}
        value={value}
      />
    </Group>
  );
}
