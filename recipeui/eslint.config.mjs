import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  { languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {
    files: ["*.test.tsx"],  // Adjust pattern to fit your project structure
    rules: {
      "react/display-name": "off",  // Disable this rule for test files
    }
  }
];
