import js from '@eslint/js';
import globals from 'globals';
export default [
  { ignores: ['dist/**', 'test-results/**', 'playwright-report/**', 'node_modules/**'] },
  js.configs.recommended,
  { files: ['script.js', 'theme.js'], languageOptions: { globals: globals.browser } },
  { files: ['tests/**/*.mjs', 'tooling/visual-qa.mjs'], languageOptions: { globals: globals.browser } },
  { files: ['**/*.mjs'], languageOptions: { globals: globals.node } },
];
