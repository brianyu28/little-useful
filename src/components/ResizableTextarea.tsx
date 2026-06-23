import { Textarea } from "@mantine/core";
import type { TextareaProps } from "@mantine/core";
import classNames from "classnames";
import styles from "./ResizableTextarea.module.scss";

interface Props extends Omit<TextareaProps, "classNames"> {
  readonly inputClassName?: string;
}

export function ResizableTextarea({ inputClassName, ...props }: Props) {
  return (
    <Textarea
      classNames={{ input: classNames(styles.input, inputClassName) }}
      {...props}
    />
  );
}
