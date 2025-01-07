import pluginNext from "@next/eslint-plugin-next";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const config = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      "@next/next": pluginNext,
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  { ignores: ["node_modules", ".next", "eslint.config.mjs"] }
);

export default config;
