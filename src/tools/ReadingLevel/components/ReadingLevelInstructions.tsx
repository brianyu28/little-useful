import { List, Text } from "@mantine/core";

export default function ReadingLevelInstructions() {
  return (
    <>
      <Text mb="sm">
        Paste some text to see the estimated reading level of the text according
        to various metrics.
      </Text>
      <List spacing="xs">
        <List.Item>
          <strong>Flesch Reading-Ease</strong> gives higher scores to easier
          text on an approximately 0 to 100 scale. It measures difficulty based
          on sentence length and syllables per word.
        </List.Item>
        <List.Item>
          <strong>Flesch-Kincaid</strong> uses the same signal as Flesch
          Reading-Ease, but converts the score into an estimated U.S. grade
          level.
        </List.Item>
        <List.Item>
          <strong>Coleman-Liau Index</strong> estimates a U.S. grade level based
          on word length and sentence length.
        </List.Item>
        <List.Item>
          <strong>Automated Readability Index</strong> estimates a U.S. grade
          level based on word length and sentence length.
        </List.Item>
      </List>
    </>
  );
}
