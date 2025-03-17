import js from "@eslint/js";
import next from "@next/eslint-plugin-next";

export default [
  js.configs.recommended,
  next.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
    },
  },
];
