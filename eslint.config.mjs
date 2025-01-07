import pluginNext from "@next/eslint-plugin-next";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

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
    ...pluginNext.configs["core-web-vitals"].rules,
  },
};

const ignores = {
  ignores: ["node_modules", ".next", "*.config.mjs", "database.types.ts"],
};

const ruleOverrides = {
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
  },
};

const config = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  optionsForTypeChecked,
  nextPlugin,
  ruleOverrides,
  ignores
);

export default config;
