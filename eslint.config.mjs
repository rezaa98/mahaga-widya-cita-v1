import nextVitals from "eslint-config-next/core-web-vitals";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [...nextVitals, eslintConfigPrettier, { ignores: ["src/payload-types.ts"] }];

export default eslintConfig;
