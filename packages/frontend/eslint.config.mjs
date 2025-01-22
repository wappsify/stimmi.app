import pluginNext from "@next/eslint-plugin-next";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

const simpleImportSortPluginConfig = {
  name: "simple-import-sort",
  plugins: {
    "simple-import-sort": simpleImportSort,
  },
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};

const optionsForTypeCheckedConfig = {
  name: "Additional options for type-checked rulesets",
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
};

const nextPluginConfig = {
  name: "next/next",
  plugins: {
    "@next/next": pluginNext,
  },
  files: ["**/*.ts", "**/*.tsx"],
  rules: {
    ...pluginNext.configs.recommended.rules,
    ...pluginNext.configs["core-web-vitals"].rules,
  },
};

const ignoreConfig = {
  name: "ignore",
  ignores: ["node_modules", ".next", "*.config.mjs"],
};

const ruleOverrideConfigs = [
  {
    name: "General extra rules",
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": "error",
      "import/no-default-export": "error",
    },
  },
  {
    name: "Allow default exports for Next.js files and configs",
    files: ["app/**/*.tsx", "i18n/**/*.ts", "tailwind.config.ts"],
    rules: {
      "import/no-default-export": "off",
    },
  },
];

const importPluginConfig = {
  ...importPlugin.flatConfigs.recommended,
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
};

const config = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  optionsForTypeCheckedConfig,
  nextPluginConfig,
  simpleImportSortPluginConfig,
  importPluginConfig,
  ...ruleOverrideConfigs,
  ignoreConfig
);

export default config;
