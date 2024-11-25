import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import tanstackQueryPlugin from "@tanstack/eslint-plugin-query";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config} */
const config = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...js.configs.recommended,
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
      "@tanstack/query": tanstackQueryPlugin,
    },
    rules: {
      "prefer-const": "error",
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...tanstackQueryPlugin.configs.recommended.rules,
    },
  },
  ...compat.config({
    extends: ["next/core-web-vitals", "next", "prettier"],
  }),
  {
    ignores: [".next/*", "node_modules/*"],
  },
];

export default config;
