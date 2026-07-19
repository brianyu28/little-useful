//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  ...tanstackConfig,
  reactHooks.configs.flat.recommended,
  {
    rules: {
      "import/no-cycle": "off",
      "import/order": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
    },
  },
  {
    ignores: ["eslint.config.js", "prettier.config.js", "public/*.js"],
  },
];
