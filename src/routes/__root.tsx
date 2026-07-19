import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { createRootRoute } from "@tanstack/react-router";
import NotFound from "../components/NotFound";
import RootDocument from "../components/RootDocument";
import appCss from "../styles.scss?url";

export const Route = createRootRoute({
  headers: () => ({
    "Cache-Control": "no-cache",
  }),
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
      {
        rel: "icon",
        href: "/favicon.ico",
        sizes: "any",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});
