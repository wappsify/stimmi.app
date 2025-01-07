import pluginNext from "@next/eslint-plugin-next";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const simpleImportSortPlugin = {
  plugins: {
    "simple-import-sort": simpleImportSort,
  },
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};

const optionsForTypeChecked = {
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
};

const nextPlugin = {
  plugins: {
    "@next/next": pluginNext,
  },
  files: ["**/*.ts", "**/*.tsx"],
  rules: {
    ...pluginNext.configs.recommended.rules,
    ...pluginNext.configs["core-web-vitals"].rules,
  },
};

const ignores = {
  ignores: [
    "node_modules",
    ".next",
    "*.config.mjs",
    "lib/supabase/database.types.ts",
  ],
};

const ruleOverrides = {
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/consistent-type-imports": ["error"],
  },
};

const config = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  optionsForTypeChecked,
  nextPlugin,
  simpleImportSortPlugin,
  ruleOverrides,
  ignores,
);

export default config;
