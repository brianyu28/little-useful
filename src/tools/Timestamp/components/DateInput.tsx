import { NumberInput } from "@mantine/core";

interface Props {
  readonly className?: string;
  readonly label: string;
  readonly max?: number;
  readonly min?: number;
  readonly onChange: (value: number | string) => void;
  readonly pad?: boolean;
  readonly value: number;
}

export default function DateInput({
  className,
  label,
  max,
  min,
  onChange,
  pad = true,
  value,
}: Props) {
  return (
    <NumberInput
      allowDecimal={false}
      aria-label={label}
      clampBehavior="strict"
      className={className}
      hideControls
      max={max}
      min={min}
      onChange={onChange}
      value={pad ? String(value).padStart(2, "0") : value}
    />
  );
}
