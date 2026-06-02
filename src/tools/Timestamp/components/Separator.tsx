import { Text } from "@mantine/core";
import styles from "./Separator.module.scss";

interface Props {
  readonly children: string;
}

export default function Separator({ children }: Props) {
  return (
    <Text aria-hidden className={styles.separator} component="span">
      {children}
    </Text>
  );
}
