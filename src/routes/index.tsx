import {
  Container,
  Group,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import React from "react";
import ToolCard from "../components/ToolCard";
import { tools } from "../tools/tools";
import { searchTools } from "../utils/searchTools";
import styles from "./index.module.scss";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [query, setQuery] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [focusedToolPath, setFocusedToolPath] = React.useState<string>();
  const navigate = useNavigate();

  const filteredTools = React.useMemo(
    () => (query.trim() ? searchTools(query) : tools),
    [query],
  );

  const handleSearchKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && query.trim() && filteredTools[0]) {
        navigate({ to: filteredTools[0].path });
      }
    },
    [filteredTools, navigate, query],
  );

  const handleSearchBlur = React.useCallback(() => setSearchFocused(false), []);

  const handleSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.currentTarget.value);
      setSearchFocused(true);
    },
    [],
  );

  const handleSearchFocus = React.useCallback(() => setSearchFocused(true), []);

  return (
    <Container component="main" className={styles.home} size="lg">
      <header className={styles.header}>
        <Group justify="center">
          <img
            className={styles.logo}
            alt="Little Useful Logo"
            src="/logo.png"
          />
          <div>
            <Title order={1}>Little Useful</Title>
            <Text c="dimmed" mt="xs">
              A free collection of little useful tools
            </Text>
          </div>
        </Group>
        <TextInput
          aria-label="Search tools"
          autoFocus
          className={styles.search}
          leftSection={<Search size={20} />}
          onBlur={handleSearchBlur}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search tools..."
          radius="xl"
          size="lg"
          value={query}
        />
      </header>

      {filteredTools.length ? (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {filteredTools.map((tool, index) => (
            <ToolCard
              isHighlighted={
                query.trim().length > 0 &&
                ((searchFocused && index === 0) ||
                  focusedToolPath === tool.path)
              }
              key={tool.path}
              onBlur={() => setFocusedToolPath(undefined)}
              onFocus={() => setFocusedToolPath(tool.path)}
              tool={tool}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Text c="dimmed" ta="center">
          No tools found.
        </Text>
      )}
    </Container>
  );
}
