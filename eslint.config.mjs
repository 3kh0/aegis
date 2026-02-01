// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import prettier from "eslint-config-prettier";

export default withNuxt(
  {
    ignores: ["node_modules/", ".nuxt/", ".output/", "dist/", ".vercel/", ".DS_Store", "*.lock", "prisma/generated/"],
  },
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["server/utils/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
  prettier,
);
