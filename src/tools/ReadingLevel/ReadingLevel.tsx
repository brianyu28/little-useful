import React from "react";
import { ResizableTextarea } from "../../components/ResizableTextarea";
import ToolPage from "../../components/ToolPage";
import { MetricGrid } from "./components/MetricGrid";
import ReadingLevelInstructions from "./components/ReadingLevelInstructions";
import { ScoreGrid } from "./components/ScoreGrid";
import styles from "./ReadingLevel.module.scss";
import { ReadingLevelConfig } from "./ReadingLevelConfig";
import { calculateTextMetrics } from "./utils/calculateTextMetrics";

export default function ReadingLevel() {
  const [text, setText] = React.useState("");
  const metrics = React.useMemo(() => calculateTextMetrics(text), [text]);

  return (
    <ToolPage
      contentPadding="lg"
      description={ReadingLevelConfig.description}
      instructions={<ReadingLevelInstructions />}
      size="lg"
      title={ReadingLevelConfig.title}
    >
      <div className={styles.content}>
        <ScoreGrid metrics={metrics} />
        <MetricGrid metrics={metrics} />
        <ResizableTextarea
          aria-label="Text to analyze"
          autoFocus
          inputClassName={styles.textarea}
          onChange={(event) => setText(event.currentTarget.value)}
          placeholder="Paste or write text here..."
          value={text}
        />
      </div>
    </ToolPage>
  );
}
