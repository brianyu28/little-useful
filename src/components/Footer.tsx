import { Anchor, Container, Group, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container size="lg">
        <Group justify="space-between">
          <Text c="dimmed" size="sm">
            &copy; {new Date().getFullYear()} Little Useful
          </Text>
          <Anchor component={Link} size="sm" to="/about">
            About
          </Anchor>
        </Group>
      </Container>
    </footer>
  );
}
