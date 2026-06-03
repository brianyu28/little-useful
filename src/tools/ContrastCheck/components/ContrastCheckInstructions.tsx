import { Text } from "@mantine/core";

export default function ContrastCheckInstructions() {
  return (
    <>
      <Text mb="sm">
        Input a background and foreground color to see their contrast ratio.
      </Text>
      <Text mb="sm">
        The Web Content Accessibility Guidelines define a{" "}
        <a href="https://www.w3.org/TR/WCAG22/#contrast-minimum">
          Minimum Success Criterion
        </a>{" "}
        and an{" "}
        <a href="https://www.w3.org/TR/WCAG22/#contrast-enhanced">
          Enhanced Success Criterion
        </a>{" "}
        for color contrast.
      </Text>
      <Text mb="sm">
        Separate criteria exist for body text and large text. Large text is
        defined as at least 18-point regular font or 14-point bold font.
      </Text>
    </>
  );
}
