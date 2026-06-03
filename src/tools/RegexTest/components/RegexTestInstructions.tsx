import { Text } from "@mantine/core";

export default function RegexTestInstructions() {
  return (
    <>
      <Text mb="sm">
        Enter a regular expression pattern. Optionally, specify any flags to
        customize behavior.
      </Text>
      <Text mb="sm">
        Type one or more lines of text to check against the pattern. Press{" "}
        <strong>Enter</strong> to add a new line. Press{" "}
        <strong>Backspace</strong> on an empty line to delete it.
      </Text>
      <Text mb="sm">Hover over a checkmark to view any capturing groups.</Text>
    </>
  );
}
