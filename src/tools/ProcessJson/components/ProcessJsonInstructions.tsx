import { List, Stack, Text } from "@mantine/core";
import styles from "../ProcessJSON.module.scss";

export default function ProcessJSONInstructions() {
  return (
    <Stack gap="sm">
      <Text size="sm">
        jq is a small query language for filtering, reshaping, and extracting
        values from JSON.
      </Text>
      <List size="sm" spacing="xs">
        <List.Item>
          <code className={styles.inlineCode}>.</code> returns the whole input.
        </List.Item>
        <List.Item>
          <code className={styles.inlineCode}>.name</code> reads an object
          field.
        </List.Item>
        <List.Item>
          <code className={styles.inlineCode}>.items[]</code> emits each array
          item.
        </List.Item>
        <List.Item>
          <code className={styles.inlineCode}>.items | length</code> counts an
          array.
        </List.Item>
        <List.Item>
          <code className={styles.inlineCode}>
            {"{name, count: .items | length}"}
          </code>{" "}
          builds a new object.
        </List.Item>
      </List>
    </Stack>
  );
}
