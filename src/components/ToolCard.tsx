import type { ToolConfig } from "#/types/ToolConfig";
import { Card, Group, Text, ThemeIcon, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import styles from "./ToolCard.module.scss";

interface Props {
  readonly isHighlighted?: boolean;
  readonly onBlur?: () => void;
  readonly onFocus?: () => void;
  readonly tool: ToolConfig;
}

export default function ToolCard({
  isHighlighted,
  onBlur,
  onFocus,
  tool,
}: Props) {
  const Icon = tool.icon;

  return (
    <Card
      className={classNames(styles.card, {
        [styles.highlighted]: isHighlighted,
      })}
      component={Link}
      onBlur={onBlur}
      onFocus={onFocus}
      padding="lg"
      radius="md"
      shadow="xs"
      to={tool.path}
      withBorder
    >
      <Group align="flex-start" wrap="nowrap">
        <ThemeIcon radius="md" size="xl" variant="light">
          <Icon size={22} />
        </ThemeIcon>
        <div>
          <Title order={3} size="h4">
            {tool.title}
          </Title>
          <Text c="dimmed" mt={4} size="sm">
            {tool.description}
          </Text>
        </div>
      </Group>
    </Card>
  );
}
