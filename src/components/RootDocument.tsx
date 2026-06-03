import { MantineProvider } from "@mantine/core";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Footer from "./Footer";
import styles from "./RootDocument.module.scss";

const FONT_FAMILY =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
const DIMMED_LIGHT = "#6c7175";
const DIMMED_DARK = "#9ca3af";

const cssVariablesResolver = () => ({
  variables: {},
  light: {
    "--mantine-color-dimmed": DIMMED_LIGHT,
  },
  dark: {
    "--mantine-color-dimmed": DIMMED_DARK,
  },
});

interface Props {
  readonly children: React.ReactNode;
}

export default function RootDocument({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <MantineProvider
          cssVariablesResolver={cssVariablesResolver}
          defaultColorScheme="auto"
          theme={{
            fontFamily: FONT_FAMILY,
            headings: {
              fontFamily: FONT_FAMILY,
            },
          }}
        >
          <div className={styles.app}>
            <div className={styles.content}>{children}</div>
            <Footer />
          </div>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </MantineProvider>
      </body>
    </html>
  );
}
