import type { MantineSpacing, StyleProp } from "@mantine/core";
import {
  ActionIcon,
  Container,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CircleHelp, Settings } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./ToolPage.module.scss";

interface Props {
  readonly children: ReactNode;
  readonly contentClassName?: string;
  readonly contentPadding?: StyleProp<MantineSpacing>;
  readonly description: string;
  readonly instructions?: ReactNode;
  readonly settings?: ReactNode;
  readonly title: string;
}

export default function ToolPage({
  children,
  contentClassName,
  contentPadding = "xl",
  description,
  instructions,
  settings,
  title,
}: Props) {
  const [areSettingsOpen, { close: closeSettings, open: openSettings }] =
    useDisclosure(false);
  const [
    areInstructionsOpen,
    { close: closeInstructions, open: openInstructions },
  ] = useDisclosure(false);

  return (
    <Container component="main" className={styles.page} size="sm">
      <Group className={styles.nav} justify="space-between">
        <ActionIcon
          aria-label="All tools"
          component={Link}
          to="/"
          variant="subtle"
        >
          <ArrowLeft size={16} />
        </ActionIcon>
        <Group gap="xs">
          {instructions != null && (
            <ActionIcon
              aria-label={`${title} instructions`}
              onClick={openInstructions}
              size="lg"
              variant="subtle"
            >
              <CircleHelp size={20} />
            </ActionIcon>
          )}
          {settings != null && (
            <ActionIcon
              aria-label={`${title} settings`}
              onClick={openSettings}
              size="lg"
              variant="subtle"
            >
              <Settings size={20} />
            </ActionIcon>
          )}
        </Group>
      </Group>

      <Stack gap="xl">
        <div>
          <Title order={1}>{title}</Title>
          <Text c="dimmed" mt={4}>
            {description}
          </Text>
        </div>
        <Paper
          className={contentClassName}
          p={contentPadding}
          radius="md"
          shadow="xs"
          withBorder
        >
          {children}
        </Paper>
      </Stack>

      {settings != null && (
        <Modal
          centered
          onClose={closeSettings}
          opened={areSettingsOpen}
          title={<strong>Settings</strong>}
        >
          {settings}
        </Modal>
      )}
      {instructions != null && (
        <Modal
          centered
          onClose={closeInstructions}
          opened={areInstructionsOpen}
          title={<strong>Instructions</strong>}
        >
          {instructions}
        </Modal>
      )}
    </Container>
  );
}
