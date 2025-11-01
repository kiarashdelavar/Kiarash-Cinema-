import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig({
  files: ["**/*.js"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      process: "readonly",
      require: "readonly",
      module: "readonly",
    },
  },
  rules: {
    "no-unused-vars": "warn"
  },
});
