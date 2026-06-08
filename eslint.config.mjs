// eslint.config.js
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default [
  // 1. ESLint-ийн алсах (үл тоомсорлох) хавтаснууд
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
    ],
  },

  // 2. Үндсэн дүрмүүдийг идэвхжүүлэх (JS болон TypeScript)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Next.js, React, TypeScript-ийг нэгтгэсэн Flat Config
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tsParser, // TypeScript кодыг унших парсер
      sourceType: "module",
      ecmaVersion: "latest",
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // JSX/TSX кодыг зөвшөөрөх
        },
      },
    },
    rules: {
      // Next.js болон Core Web Vitals дүрмүүд
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // React Hooks дүрмүүд
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Тестийн вэбд зориулсан тусгай дүрмийн тохиргоонууд
      "no-unused-vars": "off", // Ердийн JS-ийн дүрмийг унтрааж...
      "@typescript-eslint/no-unused-vars": "warn", // TypeScript-ийн хувилбарыг нь асаана
      "no-console": "off", // console.log() ашиглахыг зөвшөөрөх
      "react/no-unescaped-entities": "off", // Текст дотор ', ", > тэмдэгтүүдийг шууд бичихийг зөвшөөрөх
      "@typescript-eslint/no-explicit-any": "warn", // 'any' ашиглавал warning өгөх
    },
  },
];
