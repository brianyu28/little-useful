import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { createRootRoute } from "@tanstack/react-router";
import NotFound from "../components/NotFound";
import RootDocument from "../components/RootDocument";
import appCss from "../styles.scss?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Little Useful",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});
