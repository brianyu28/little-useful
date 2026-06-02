const APP_TITLE = "Little Useful";

export function createPageHead(title: string) {
  return {
    meta: [
      {
        title: `${title} | ${APP_TITLE}`,
      },
    ],
  };
}
