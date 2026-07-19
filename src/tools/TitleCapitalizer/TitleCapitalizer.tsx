import { Select, Text } from "@mantine/core";
import React from "react";
import { ResizableTextarea } from "../../components/ResizableTextarea";
import ToolPage from "../../components/ToolPage";
import styles from "./TitleCapitalizer.module.scss";
import { TitleCapitalizerConfig } from "./TitleCapitalizerConfig";
import type { TitleStyle } from "./utils/titleCase";
import {
  capitalizeTitle,
  TITLE_STYLE_RULES,
  TITLE_STYLES,
} from "./utils/titleCase";

const styleOptions = TITLE_STYLES.map((style) => ({
  label: TITLE_STYLE_RULES[style].label,
  value: style,
}));

export default function TitleCapitalizer() {
  const [style, setStyle] = React.useState<TitleStyle>("chicago");
  const [title, setTitle] = React.useState("");

  const handleTitleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTitle(capitalizeTitle(event.currentTarget.value, style));
    },
    [style],
  );

  const handleStyleChange = React.useCallback((value: string | null) => {
    if (value == null) return;

    const nextStyle = value as TitleStyle;
    setStyle(nextStyle);
    setTitle((currentTitle) => capitalizeTitle(currentTitle, nextStyle));
  }, []);

  return (
    <ToolPage
      contentPadding="lg"
      description={TitleCapitalizerConfig.description}
      size="lg"
      title={TitleCapitalizerConfig.title}
    >
      <div className={styles.content}>
        <Select
          allowDeselect={false}
          aria-label="Title capitalization style"
          data={styleOptions}
          label="Style"
          onChange={handleStyleChange}
          value={style}
        />
        <Text c="dimmed" className={styles.styleNote} size="sm">
          {TITLE_STYLE_RULES[style].description}
        </Text>
        <ResizableTextarea
          aria-label="Title to capitalize"
          autoFocus
          inputClassName={styles.input}
          onChange={handleTitleChange}
          placeholder="Type Title Here..."
          value={title}
        />
      </div>
    </ToolPage>
  );
}
