import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "off", // Handled by @typescript-eslint
      "@typescript-eslint/no-unused-vars": "error",
      "no-console": "warn",
      "prefer-const": "error",
      "eqeqeq": "error",
      "no-var": "error",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  }
);
